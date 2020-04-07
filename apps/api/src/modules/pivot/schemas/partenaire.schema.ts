import { Schema } from 'mongoose';

export const PartenaireSchema = new Schema({
  properties: {
    code: String,
    libelle: String,
    sens: String,
    duplication: Boolean,
    etat: String,
  },
});
