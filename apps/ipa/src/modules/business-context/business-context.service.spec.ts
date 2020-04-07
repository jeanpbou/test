import { BusinessContextService } from './business-context.service';
import { BusinessContext } from '@datahub/types';

describe('BusinessContextService', () => {
  let businesscontextService: BusinessContextService;

  beforeAll(() => {
    businesscontextService = new BusinessContextService();
  });

  describe('find', () => {
    let data: BusinessContext[];
    let codes: string[];

    beforeEach(() => {
      data =
        [
          { code: 'returned', messages: [{ id: 'test' }] },
          { code: 'never', messages: [{ id: 'test' }] },
        ] as BusinessContext[];
      codes = ['returned'];
    });

    it('should filter businesscontexts with codes passed', () => {
      const expected = [
        {
          code: 'returned',
          messages: [{ id: 'test' }],
        },
      ];
      expect(businesscontextService.find(data, codes)).toEqual(expected);
    });

    it('should return all businesscontexts if no codes passed', () => {
      codes = [];
      const expected = [...data];
      expect(businesscontextService.find(data, codes)).toEqual(
        expect.arrayContaining(expected),
      );
    });
  });
});
