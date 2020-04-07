import { Schema } from 'mongoose';
import { DCSchema } from './dc.schema';
import { DESchema } from './de.schema';
import { DTSchema } from './dt.schema';
import { PropertiesSegGrpSchema } from './properties-seg-grp.schema';
import { RegleSchema } from './regle.schema';

export const SegSchema = new Schema({
  properties: PropertiesSegGrpSchema,
  definition: [String],
  regles: [{ regle: [RegleSchema] }],
  de: [DESchema],
  dt: [DTSchema],
  dc: [DCSchema],
});
