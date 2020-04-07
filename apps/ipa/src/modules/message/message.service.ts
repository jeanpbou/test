import { Injectable } from '@nestjs/common';
import { Message, SearchResultType, Segment, Group } from '@datahub/types';

type SearchSettings = {
  [key: string]: {
    parent: string[];
    children: string[];
    key?: keyof Message | keyof Group | keyof Segment;
  };
};

@Injectable()
export class MessageService {
  private searchSettings: SearchSettings = {
    ME: { parent: [], children: ['GR', 'SE'] },
    GR: { parent: ['ME'], children: ['SE'], key: 'groups' },
    SE: {
      parent: ['ME', 'GR'],
      children: ['DE', 'DT', 'DC'],
      key: 'segments',
    },
    DE: { parent: ['SE', 'DC'], children: [], key: 'DEs' },
    DT: { parent: ['SE', 'DC'], children: [], key: 'DTs' },
    DC: { parent: ['SE'], children: ['DE', 'DT'], key: 'DCs' },
  };

  /**
   * Returns the list of filtered by ids passed in params messages
   *
   * @param data - messages which filter be applied
   * @param ids - id filter
   */
  find(data: Message[], ids: string[]) {
    return data.filter((m) => (ids.length ? ids.includes(m.id) : true));
  }

  /**
   * Search corresponding id inside item of message passed in params
   *
   * Handle case with specific type and case whithout any type
   *
   * @param message - parent message to which the search will be applied
   * @param id - wanted id
   *
   * @returns Arrays of any item type corresponding to wanted id
   */
  search(message: Message, id: string) {
    const type = id.substring(0, 2);
    const browse = this.browse(type);
    let data: SearchResultType[];

    if (['ME', 'GR', 'SE', 'DC', 'DE', 'DT'].includes(type)) {
      data = browse(message);
    } else {
      data = [
        ...this.browse('ME')(message),
        ...this.browse('GR')(message),
        ...this.browse('SE')(message),
        ...this.browse('DC')(message),
        ...this.browse('DE')(message),
        ...this.browse('DT')(message),
      ];
    }

    return data.filter((d) => d.id.includes(id));
  }

  /**
   * Build a method to browse item from settings
   *
   * @param type - 'SE' | 'ME' | 'GR' | 'DE' | 'DT' | 'DC'
   */
  private browse(type: string) {
    const settings = this.searchSettings;

    /**
     * Check type of item passed in params
     * If type is the same of searched id => return item
     * Else browse it with specific setting depending on its type
     *
     * @param d - Item to browse or return
     */
    return (d: SearchResultType): SearchResultType[] => {
      const subType = d.id.substring(0, 2);
      const setting = settings[subType];

      if (subType === type) return [d];

      return setting.children
        .map((t) => {
          const { key } = settings[t];
          const toBrowse = d[key];

          return toBrowse && toBrowse.map((i) => this.browse(type)(i));
        })
        .flat(Infinity)
        .filter(Boolean);
    };
  }
}
