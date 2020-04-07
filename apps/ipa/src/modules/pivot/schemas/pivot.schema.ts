import { Schema } from 'mongoose';
import { MessageSchema } from './message.schema';

export const PivotSchema = new Schema({
  fileName: String,
  codecomposantmetier: String,
  dtecreation: Date,
  messages: [MessageSchema],
  listeedition: [String],
  livrables: [String],
});
