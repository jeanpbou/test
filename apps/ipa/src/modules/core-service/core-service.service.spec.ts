import { CSService } from './core-service.service';
import {
  CoreService,
  CachedCoreService,
  CustomPivotResult,
} from '@datahub/types';
import PivotService from '../pivot/pivot.service';

describe('CSService', () => {
  let csService: CSService;
  let pivotService: PivotService;

  beforeAll(() => {
    pivotService =
      {
        find: jest.fn(),
      } as any;
    csService = new CSService(pivotService);
  });

  describe('getCoreServices', () => {
    let dataFromPivotService: CustomPivotResult[];
    let coreServices: CachedCoreService[];

    beforeEach(() => {
      dataFromPivotService = [
        { coreService: 'cs1', structurePackageName: 'sp1' },
        { coreService: 'cs1', structurePackageName: 'sp2' },
        { coreService: 'cs2', structurePackageName: 'sp1' },
      ];
      coreServices = [
        { label: 'cs1', structurePackages: ['sp1', 'sp2'] },
        { label: 'cs2', structurePackages: ['sp1'] },
      ];
      (pivotService.find as jest.Mock).mockResolvedValue(dataFromPivotService);
    });

    afterEach(() => {
      (pivotService.find as jest.Mock).mockRestore();
    });

    it('should use find method from pivotService', async () => {
      await csService.getCoreServices();

      expect(pivotService.find).toHaveBeenCalledWith(
        {},
        { codecomposantmetier: 1, fileName: 1 },
        CustomPivotResult,
      );
    });

    it('should group structure packages by core services and return it', async () => {
      const results = await csService.getCoreServices();

      expect(results).toEqual(coreServices);
    });
  });

  describe('filter', () => {
    let data: CoreService[];
    let labels: string[];

    beforeEach(() => {
      data =
        [
          { label: 'returned', structurePackages: [{ label: 'test' }] },
          { label: 'never', structurePackages: [{ label: 'test' }] },
        ] as any[];
      labels = ['returned'];
    });

    it('should filter coreServices with labels passed', () => {
      const expected = [
        {
          label: 'returned',
          structurePackages: [{ label: 'test' }],
        },
      ];
      expect(csService.filter(data, labels)).toEqual(expected);
    });

    it('should return all coreServices if no labels passed', () => {
      labels = [];
      const expected = [...data];
      expect(csService.filter(data, labels)).toEqual(
        expect.arrayContaining(expected),
      );
    });
  });
});
