import { PivotModel } from '@datahub/types';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { plainToClass } from 'class-transformer';
import { Document, Model } from 'mongoose';

interface Pivot extends PivotModel, Document {}

@Injectable()
export default class PivotService {
  constructor(
    @InjectModel('Pivot') private readonly pivotModel: Model<Pivot>,
  ) {}

  /**
   * Run a pipeline aggregation passed in params on mongodb instance of Pivot
   *
   * @param pipeline - aggregation pipeline configuration
   */
  async aggregate(pipeline: Array<{}> = []) {
    return this.pivotModel.aggregate([...pipeline]);
  }

  /**
   * Run a find command with conditions and projections from params on mongodb instance of Pivot
   *
   * After fetching, transform data using outputType param and class-transformer
   *
   * @param conditions - conditions to apply
   * @param projections - projections to apply
   * @param outputType - type of output
   */
  async find<T>(
    conditions: {} = {},
    projections: {} = {},
    outputType: new () => T,
  ) {
    return plainToClass(
      outputType,
      await this.pivotModel.find(conditions, projections).lean(),
    );
  }
}
