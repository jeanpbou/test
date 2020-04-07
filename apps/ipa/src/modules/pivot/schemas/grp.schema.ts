import { Schema } from 'mongoose';
import { PropertiesSegGrpSchema } from './properties-seg-grp.schema';
import { RegleSchema } from './regle.schema';
import { SegSchema } from './seg.schema';

export const GrpSchema = new Schema({
  properties: PropertiesSegGrpSchema,
  definition: [String],
  regles: [{ regle: [RegleSchema] }],
  seg: [SegSchema],
});
