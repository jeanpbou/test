import { Schema } from 'mongoose';

export const FacetSchema = new Schema({
  nom: [String],
  valeur: [String],
});
