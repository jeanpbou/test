import { Schema } from 'mongoose';

export const RegleSchema = new Schema({
  properties: {
    etat: String,
  },
  definition: [String],
  type: [String],
  severite: [String],
  valeur: [String],
  ordre: [String],
  identifiant: [String],
});
