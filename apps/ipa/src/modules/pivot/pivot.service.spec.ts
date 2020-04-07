import { CustomPivotResult } from '@datahub/types';
import * as classTransformer from 'class-transformer';
import PivotService from './pivot.service';

describe('PivotService', () => {
  let pivotService: PivotService;
  let pivotModel: any;

  beforeAll(() => {
    pivotModel = {
      aggregate: jest.fn(),
      find: jest.fn(),
      lean: jest.fn(),
    };
    pivotService = new PivotService(pivotModel);
  });

  describe('aggregate', () => {
    let pipeline: Array<{}>;

    beforeEach(() => {
      pipeline = [{ mypipeline: 'test' }];
      pivotModel.aggregate.mockResolvedValue('results');
    });

    it('should use empty object by default', async () => {
      const results = await pivotService.aggregate();

      expect(results).toBe('results');
    });

    it('should return results of aggregate method of model with pipeline passed as param', async () => {
      await pivotService.aggregate(pipeline);

      expect(pivotModel.aggregate).toHaveBeenCalledWith(pipeline);
    });
  });

  describe('find', () => {
    let spyPlainToClass: jest.SpyInstance;
    let conditions: {};
    let projections: {};
    let outputType: any;

    beforeEach(() => {
      projections = { projection: 'test' };
      conditions = { condition: 'test' };
      outputType = CustomPivotResult;
      spyPlainToClass = jest.spyOn(classTransformer, 'plainToClass');
      spyPlainToClass.mockReturnValue('results');
      pivotModel.find.mockReturnThis();
      pivotModel.lean.mockResolvedValue('beforeResults');
    });

    afterEach(() => {
      spyPlainToClass.mockRestore();
      pivotModel.find.mockRestore();
    });

    it('should find results from db without conditions and a specific projections', async () => {
      await pivotService.find(conditions, projections, outputType);

      expect(pivotModel.find).toHaveBeenCalledWith(conditions, projections);
      expect(pivotModel.lean).toHaveBeenCalled();
    });

    it('should transform db results using class transformer and CustomPivotResult', async () => {
      await pivotService.find(conditions, projections, outputType);

      expect(classTransformer.plainToClass).toHaveBeenCalledWith(
        CustomPivotResult,
        'beforeResults',
      );
    });
  });
});
