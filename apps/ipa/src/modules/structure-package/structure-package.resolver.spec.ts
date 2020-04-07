import { BusinessContext, StructurePackageIPA } from '@datahub/types';
import { BusinessContextService } from './../business-context/business-context.service';
import { StructurePackageResolver } from './structure-package.resolver';

describe('StructurePackageResolver', () => {
  let resolver: StructurePackageResolver;
  let service: BusinessContextService;

  beforeAll(() => {
    service = {
      find: jest.fn(),
    };
    resolver = new StructurePackageResolver(service);
  });

  describe('businessContexts', () => {
    let expected: BusinessContext[];
    let codes: string[];
    let parent: StructurePackageIPA;

    beforeEach(() => {
      codes = ['test', 'test2'];
      parent =
        {
          label: 'test',
          businessContexts: ['test', 'test test'],
        } as any;
      expected = [{ results: 'expected' }] as any;
      (service.find as any).mockReturnValue(expected);
    });

    afterEach(() => {
      (service.find as any).mockReset();
    });

    it('should filter business contexts list with codes filter passed in params', async () => {
      const results = await resolver.businessContexts(parent, codes);

      expect(service.find).toHaveBeenCalledWith(parent.businessContexts, codes);
      expect(results).toBe(expected);
    });

    it('should use empty array as default when no codes passed', async () => {
      await resolver.businessContexts(parent, []);

      expect(service.find).toHaveBeenCalledWith(parent.businessContexts, []);
    });
  });
});
