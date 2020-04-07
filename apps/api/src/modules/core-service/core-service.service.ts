import {
  CachedCoreService,
  CoreService,
  CustomPivotResult,
} from '@datahub/types';
import { Injectable } from '@nestjs/common';
import PivotService from '../pivot/pivot.service';

@Injectable()
export class CSService {
  constructor(private readonly pivotService: PivotService) {}

  /**
   * Run a find command with specific projections
   * to retrieve only core services and structure packages
   * on mongodb instance of Pivot
   */
  async getCoreServices() {
    const data = await this.pivotService.find(
      {},
      { codecomposantmetier: 1, fileName: 1 },
      CustomPivotResult,
    );
    const coreServices = data.reduce<CachedCoreService[]>((acc, curr) => {
      const existing = acc.find((i) => i.label === curr.coreService);
      if (existing) {
        existing.structurePackages.push(curr.structurePackageName);
        return acc;
      }
      return [
        ...acc,
        {
          label: curr.coreService,
          structurePackages: [curr.structurePackageName],
        },
      ];
    }, []);

    return coreServices;
  }

  /**
   * Returns the list of filtered by codecomposantmetiers passed in params coreServices
   *
   * @param data - coreServices which filters be applied
   * @param codecomposantmetiers - codecomposantmetier filter
   */
  filter(data: CoreService[], codecomposantmetiers: string[]): CoreService[] {
    let filteredData = data;
    if (codecomposantmetiers.length > 0) {
      filteredData = filteredData.filter((cs) =>
        codecomposantmetiers.includes(cs.label),
      );
    }
    return filteredData;
  }
}
