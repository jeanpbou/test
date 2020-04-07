import { Schema } from 'mongoose';
import { PartenaireSchema } from './partenaire.schema';

export const LienPartenaireSchema = new Schema({
  partenaire: [PartenaireSchema],
});
