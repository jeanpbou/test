import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PivotSchema } from './schemas/pivot.schema';
import PivotService from './pivot.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Pivot', schema: PivotSchema, collection: 'pivots' },
    ]),
  ],
  providers: [PivotService],
  exports: [PivotService],
})
export class PivotModule {}
