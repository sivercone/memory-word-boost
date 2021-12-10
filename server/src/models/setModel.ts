import { model, Schema, Document } from 'mongoose';
import { SetInterface } from '@/interfaces';

const setSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: String,
  tags: [String],
  cards: [{ term: String, definition: String }],
  folder: [{ type: Schema.Types.ObjectId, ref: 'Folder' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const setModel = model<SetInterface & Document>('Set', setSchema);

export default setModel;
