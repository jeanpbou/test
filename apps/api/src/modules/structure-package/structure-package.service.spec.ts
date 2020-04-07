import { StructurePackageService } from './structure-package.service';
import { StructurePackageIPA, CachedStructurePackage } from '@datahub/types';
import PivotService from '../pivot/pivot.service';
import * as classTransformer from 'class-transformer';

describe('StructurePackageService', () => {
  let structurePackageService: StructurePackageService;
  let pivotService: PivotService;

  beforeAll(() => {
    pivotService =
      {
        aggregate: jest.fn(),
      } as any;
    structurePackageService = new StructurePackageService(pivotService);
  });

  describe('getStructurePackage', () => {
    let spFromDB: any[];
    let spToCache: CachedStructurePackage;
    let spyPlainToClass: jest.SpyInstance;
    let name: string;
    let pipeline;

    beforeEach(() => {
      name = 'sp1';
      pipeline = [
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
      ];
      spyPlainToClass = jest.spyOn(classTransformer, 'plainToClass');
      spyPlainToClass.mockReturnValue('test');
      spFromDB = [
        {
          label: 'bc1',
          from: 'sp1',
          messages: [
            {
              properties: {
                numero: '01',
                version: '01',
                release: '01',
                sectorielcode: '1278',
              },
            },
          ],
          publicationDate: 'date',
        },
        {
          label: 'bc2',
          from: 'sp1',
          messages: [
            {
              properties: { numero: '02', version: '02', release: '02' },
              seg: [
                { properties: { code: '022', version: '02', release: '02' } },
              ],
            },
          ],
          publicationDate: 'date',
        },
      ];
      spToCache = {
        label: 'sp1',
        publicationDate: 'date' as any,
        businessContexts:
          [
            {
              label: 'bc1',
              from: 'sp1',
              messages: [
                {
                  properties: {
                    numero: '01',
                    version: '01',
                    release: '01',
                    sectorielcode: '1278',
                  },
                  id: 'ME0101011278',
                  seg: [],
                  grp: [],
                },
              ],
            },
            {
              label: 'bc2',
              from: 'sp1',
              messages: [
                {
                  properties: { numero: '02', version: '02', release: '02' },
                  id: 'ME020202',
                  grp: [],
                  seg: [
                    {
                      properties: { code: '022', version: '02', release: '02' },
                      id: 'SE0220202',
                      de: [],
                      dt: [],
                      dc: [],
                    },
                  ],
                },
              ],
            },
          ] as any,
      };
      (pivotService.aggregate as jest.Mock).mockResolvedValue(spFromDB);
    });

    afterEach(() => {
      spyPlainToClass.mockRestore();
      (pivotService.aggregate as jest.Mock).mockRestore();
    });

    it('should retrieve data to load from db', async () => {
      await structurePackageService.getStructurePackage(name);

      expect(pivotService.aggregate).toHaveBeenCalledWith(pipeline);
    });

    it('should transform data and add ids then set in cache with structure package name as key', async () => {
      await structurePackageService.getStructurePackage(name);

      expect(spyPlainToClass).toHaveBeenCalledWith(
        CachedStructurePackage,
        spToCache,
      );
    });
  });

  describe('filter', () => {
    let data: StructurePackageIPA[];
    let labels: string[];

    beforeEach(() => {
      data =
        [
          { label: 'returned', businessContexts: [{ code: 'test' }] },
          { label: 'never', businessContexts: [{ code: 'test' }] },
        ] as StructurePackageIPA[];
      labels = ['returned'];
    });

    it('should filter structurePackages with labels passed', () => {
      const expected = [
        {
          label: 'returned',
          businessContexts: [{ code: 'test' }],
        },
      ];
      expect(structurePackageService.filter(data, labels)).toEqual(expected);
    });

    it('should return all structurePackages if no labels passed', () => {
      labels = [];
      const expected = [...data];
      expect(structurePackageService.filter(data, labels)).toEqual(
        expect.arrayContaining(expected),
      );
    });
  });
});
