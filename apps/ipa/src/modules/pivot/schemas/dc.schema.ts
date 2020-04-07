import { Schema } from 'mongoose';
import { DESchema } from './de.schema';
import { DTSchema } from './dt.schema';

export const DCSchema = new Schema({
  properties: {
    code: String,
    version: String,
    release: String,
    libelle: String,
    libelleedition: String,
    etat: String,
    statut: String,
    ordre: String,
    dtecreation: String,
    dtemodification: String,
  },
  definition: [String],
  dt: [DTSchema],
  de: [DESchema],
});
