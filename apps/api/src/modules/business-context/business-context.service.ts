import { BusinessContext } from '@datahub/types';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BusinessContextService {
  /**
   * Returns the list of filtered by codes passed in params businessContexts
   *
   * @param data - businessContexts which filters be applied
   * @param codes - code filter
   */
  find(data: BusinessContext[], codes: string[]): BusinessContext[] {
    let filteredData = data;
    if (codes.length > 0) {
      filteredData = filteredData.filter((bc) => codes.includes(bc.code));
    }
    return filteredData;
  }
}
