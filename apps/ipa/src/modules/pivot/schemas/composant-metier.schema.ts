import { Schema } from 'mongoose';

export const ComposantMetierSchema = new Schema({
  properties: {
    dtecreation: Date,
    dtemodification: Date,
    etat: String,
  },
  code: [String],
  libelle: [String],
  definition: [String],
});
