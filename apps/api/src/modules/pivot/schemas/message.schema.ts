import { Schema } from 'mongoose';
import { ComposantMetierSchema } from './composant-metier.schema';
import { ContextMetierSchema } from './context-metier.schema';
import { GrpSchema } from './grp.schema';
import { LienPartenaireSchema } from './lien-partenaire.schema';
import { RegleSchema } from './regle.schema';
import { SegSchema } from './seg.schema';

export const MessageSchema = new Schema({
  properties: {
    numero: String,
    version: String,
    release: String,
    revision: String,
    libelle: String,
    abreviation: String,
    etat: String,
    statut: String,
    sectoriel: String,
    dtecreation: Date,
    dtemodification: Date,
    dtediffusion: Date,
    ouverturedossier: Boolean,
    fermuturedossier: Boolean,
  },
  definition: [String],
  contextmetier: [ContextMetierSchema],
  partenaires: [LienPartenaireSchema],
  regles: [{ regle: [RegleSchema] }],
  seg: [SegSchema],
  grp: [GrpSchema],
  composantmetier: [ComposantMetierSchema],
});
