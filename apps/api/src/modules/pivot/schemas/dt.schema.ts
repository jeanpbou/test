import { Schema } from 'mongoose';
import { TypeDarvaSchema } from './type-darva.schema';

export const DTSchema = new Schema({
  properties: {
    code: String,
    version: String,
    release: String,
    libelle: String,
    libelleedition: String,
    etat: String,
    statut: String,
    ordre: String,
    longueur: String,
    minlongueur: String,
    table: String,
    typemessage: String,
    dtecreation: Date,
    dtemodification: Date,
    personnel: String,
  },
  definition: [String],
  typedarva: [TypeDarvaSchema],
});
