import { Schema } from 'mongoose';

export const PropertiesSegGrpSchema = new Schema({
  code: String,
  version: String,
  release: String,
  libelle: String,
  etat: String,
  statut: String,
  repet: String,
  ordre: String,
  sectoriel: Boolean,
  dtecreation: Date,
  dtemodification: Date,
});
