import { StructurePackageService } from './../structure-package/structure-package.service';
import { CSService } from './core-service.service';
import { CoreServiceResolver } from './core-service.resolver';
import {
  CoreServiceIPA,
  StructurePackageIPA,
  CachedCoreService,
  CachedStructurePackage,
} from '@datahub/types';

describe('CoreServiceResolver', () => {
  let resolver: CoreServiceResolver;
  let csService: CSService;
  let structurePackageService: StructurePackageService;
  let cacheManager: any;

  beforeAll(() => {
    csService =
      {
        filter: jest.fn(),
        getCoreServices: jest.fn(),
      } as any;
    structurePackageService =
      {
        filter: jest.fn(),
        getStructurePackage: jest.fn(),
      } as any;
    cacheManager =
      {
        get: jest.fn(),
        set: jest.fn(),
      } as any;
    resolver = new CoreServiceResolver(
      csService,
      structurePackageService,
      cacheManager,
    );
  });

  describe('coreServices', () => {
    let data: CachedCoreService[];
    let expected: CoreServiceIPA[];
    let labels: string[];

    beforeEach(() => {
      labels = ['test', 'test2'];
      data = [{ test: true }] as any;
      expected = [{ results: 'expected' }] as any;
      (csService.getCoreServices as any).mockResolvedValue(data);
      (csService.filter as any).mockReturnValue(expected);
      cacheManager.get.mockResolvedValue(data);
    });

    afterEach(() => {
      (csService.getCoreServices as any).mockReset();
      (csService.filter as any).mockReset();
      (csService.getCoreServices as any).mockReset();
    });

    it('should use an empty array as default value for labels filter', async () => {
      await resolver.coreServices();

      expect(csService.filter).toHaveBeenCalledWith(data, []);
    });

    it('should retrieve data stored in cache and filter it if exists', async () => {
      await resolver.coreServices(labels);

      expect(csService.getCoreServices).not.toHaveBeenCalled();
      expect(cacheManager.get).toHaveBeenCalledWith('coreServices');
      expect(csService.filter).toHaveBeenCalledWith(data, labels);
    });

    it('should retrieve data stored in database if not present in cache and cache it', async () => {
      cacheManager.get.mockResolvedValue(undefined);

      await resolver.coreServices(labels);

      expect(csService.getCoreServices).toHaveBeenCalled();
      expect(cacheManager.get).toHaveBeenCalledWith('coreServices');
      expect(cacheManager.set).toHaveBeenCalledWith('coreServices', data);
      expect(csService.filter).toHaveBeenCalledWith(data, labels);
    });

    it('should find coreServices corresponding with filters passed in params', async () => {
      const results = await resolver.coreServices(labels);

      expect(results).toBe(expected);
    });
  });

  describe('structurePackages', () => {
    let data: CachedStructurePackage;
    let expected: StructurePackageIPA[];
    let labels: string[];
    let parent: CoreServiceIPA;

    beforeEach(() => {
      labels = ['test', 'test2'];
      parent =
        {
          label: 'test',
          structurePackages: ['test', 'test test'],
        } as any;
      data = { label: 'test', structurePackages: [{ subSP: 'test' }] } as any;
      expected = [{ results: 'expected' }] as any;
      (structurePackageService.getStructurePackage as any).mockResolvedValue(
        data,
      );
      cacheManager.get.mockResolvedValue(data);
      (structurePackageService.filter as any).mockReturnValue(expected);
      (csService.getCoreServices as any).mockResolvedValue(data);
    });

    afterEach(() => {
      (structurePackageService.getStructurePackage as any).mockReset();
      (structurePackageService.filter as any).mockReset();
      (csService.getCoreServices as any).mockReset();
    });

    it('should retrieve all structure package of parent if no label filter passed', async () => {
      await resolver.structurePackages(parent);

      expect.assertions(parent.structurePackages.length);
      parent.structurePackages.forEach((name) => {
        expect(cacheManager.get).toHaveBeenCalledWith(name);
      });
    });

    it('should filter parent structure package with labels passed in param', async () => {
      await resolver.structurePackages(parent, labels);

      expect.assertions(2);
      expect(cacheManager.get).toHaveBeenCalledWith('test');
      expect(
        structurePackageService.getStructurePackage,
      ).not.toHaveBeenCalledWith();
    });

    it('should return retrieved and filtered data', async () => {
      const expectedData = [data];

      const results = await resolver.structurePackages(parent, labels);

      expect(results).toEqual(expectedData);
    });

    it('should only retrieve data from database if not present in cache', async () => {
      cacheManager.get.mockResolvedValueOnce(undefined).mockResolvedValue(data);

      await resolver.structurePackages(parent);

      expect(structurePackageService.getStructurePackage).toHaveBeenCalledWith(
        'test',
      );
      expect(cacheManager.set).toHaveBeenCalledWith('test', data);
    });
  });
});
