import { model, Schema, Document } from 'mongoose';
import { FolderInterface } from '@/interfaces';

const folderSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: String,
  sets: [{ type: Schema.Types.ObjectId, ref: 'Set' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const folderModel = model<FolderInterface & Document>('Folder', folderSchema);

export default folderModel;
