import { CachedStructurePackage, StructurePackageIPA } from '@datahub/types';
import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import {
  IdentifierObject,
  serializeIdentifier,
  Type,
} from '../../utils/darva.tool';
import PivotService from '../pivot/pivot.service';

type Item = {
  properties: Omit<IdentifierObject, 'type'>;
};

type NestedIdentifierParams = {
  key: string;
  type: Type;
  arrayKey: string;
  nestedMapping?: NestedIdentifierParams[];
};

@Injectable()
export class StructurePackageService {
  constructor(private readonly pivotService: PivotService) {
    // a group can contain other groups
    this.GRIds.nestedMapping.push(this.GRIds);
  }

  private DEIds: NestedIdentifierParams = {
    key: 'de',
    arrayKey: 'de',
    type: 'DE',
  };
  private DTIds: NestedIdentifierParams = {
    key: 'dt',
    arrayKey: 'dt',
    type: 'DT',
  };
  private DCIds: NestedIdentifierParams = {
    key: 'dc',
    arrayKey: 'dc',
    type: 'DC',
    nestedMapping: [this.DEIds, this.DTIds],
  };
  private SEIds: NestedIdentifierParams = {
    key: 'seg',
    arrayKey: 'seg',
    type: 'SE',
    nestedMapping: [this.DCIds, this.DEIds, this.DTIds],
  };
  private GRIds: NestedIdentifierParams = {
    key: 'grp',
    arrayKey: 'grp',
    type: 'GR',
    nestedMapping: [this.SEIds],
  };

  async getStructurePackage(name: string) {
    const businessContexts = await this.pivotService.aggregate([
      /** Match depending core service */
      {
        $match: {
          fileName: name,
        },
      },
      /** Unwind messages to get one document per message */
      {
        $unwind: '$messages',
      },
      /** Unwind context metier from message to get one document per message and per context metier */
      {
        $unwind: '$messages.contextmetier',
      },
      /** Group document by business context */
      {
        $group: {
          _id: {
            businessContextCode: '$messages.contextmetier.properties.code',
            structurePackageLabel: '$fileName',
          },
          publicationDate: { $first: '$dtecreation' },
          from: { $first: '$fileName' },
          code: { $first: '$messages.contextmetier.properties.code' },
          etat: { $first: '$messages.contextmetier.properties.etat' },
          domaine: { $first: '$messages.contextmetier.properties.domaine' },
          label: { $first: '$messages.contextmetier.properties.libelle' },
          messages: { $push: '$messages' },
        },
      },
    ]);

    const structurePackage = businessContexts
      .map((bc) => ({
        ...bc,
        ...this.addIds('messages', bc.messages, 'ME', [this.GRIds, this.SEIds]),
      }))
      .reduce((acc, curr) => {
        const { publicationDate, ...businessContext } = curr;
        return {
          publicationDate: acc.publicationDate || publicationDate,
          label: acc.label || businessContext.from,
          businessContexts: [
            ...[].concat(acc.businessContexts || []),
            { ...businessContext },
          ],
        };
      }, {} as CachedStructurePackage);

    return plainToClass(CachedStructurePackage, structurePackage);
  }

  /**
   * Returns the list of filtered by fileNames passed in params structurePackages
   *
   * @param data - structurePackages which filters be applied
   * @param fileNames - fileName filter
   */
  filter(
    data: StructurePackageIPA[],
    fileNames: string[],
  ): StructurePackageIPA[] {
    let filteredData = data;
    if (fileNames.length > 0) {
      filteredData = filteredData.filter((sp) => fileNames.includes(sp.label));
    }
    return filteredData;
  }

  /**
   * Add ids to an array passed in params
   *
   * Generated id depends on type and properties passed from item
   *
   * It will be recursive in case of nested data
   *
   * @param key - key to add
   * @param array - array to browse
   * @param type - type of built id
   * @param nestedMapping - nested mapping to browse sub props and add ids
   */
  private addIds(
    key: string,
    array: Array<Item>,
    type: Type,
    nestedMapping: NestedIdentifierParams[],
  ) {
    const arrayWithIds = (array || []).map((i) => {
      const idProps = { ...i.properties, type } as IdentifierObject;
      const id = serializeIdentifier(idProps);
      let propsWithIds = {};

      for (const {
        key,
        arrayKey,
        type,
        nestedMapping: mapping,
      } of nestedMapping) {
        propsWithIds = {
          ...propsWithIds,
          ...this.addIds(key, i[arrayKey], type, mapping || []),
        };
      }
      return { ...i, ...propsWithIds, id };
    });

    return {
      [key]: arrayWithIds,
    };
  }
}
