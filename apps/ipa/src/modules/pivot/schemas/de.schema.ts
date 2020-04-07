import { Schema } from 'mongoose';
import { TypeDarvaSchema } from './type-darva.schema';

export const DESchema = new Schema({
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
    typemessage: String,
    dtecreation: Date,
    dtemodification: Date,
    personnel: String,
  },
  definition: [String],
  typedarva: [TypeDarvaSchema],
});
