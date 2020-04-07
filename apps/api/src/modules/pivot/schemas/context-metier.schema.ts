import { Schema } from 'mongoose';

export const ContextMetierSchema = new Schema({
  properties: {
    code: String,
    libelle: String,
    etat: String,
    domaine: String,
    dtecreation: Date,
    dtemodification: Date,
    dtediffusion: Date,
  },
});
