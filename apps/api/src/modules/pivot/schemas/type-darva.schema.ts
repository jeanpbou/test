import { Schema } from 'mongoose';
import { FacetSchema } from './facet.schema';

export const TypeDarvaSchema = new Schema({
  properties: {
    nom: String,
    abreviation: String,
    typexml: String,
  },
  facets: [{ facet: [FacetSchema] }],
});
