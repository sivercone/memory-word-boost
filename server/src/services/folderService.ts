import { FolderInterface, SetInterface } from '@/interfaces';
import folderModel from '@/models/folderModel';
import setModel from '@/models/setModel';
import { HttpException } from '@exceptions/HttpException';
import { isEmpty } from '@utils/util';

class FolderService {
  public folderModel = folderModel;
  public setModel = setModel;

  public async findAll(): Promise<FolderInterface[]> {
    const folders = await this.folderModel.find();
    return folders;
  }

  public async findById(payload: string): Promise<{ folder: FolderInterface; sets: SetInterface[] }> {
    if (isEmpty(payload)) throw new HttpException(400, 'No payload');
    const folder = await this.folderModel.findById(payload);
    if (!folder) throw new HttpException(404, 'Not Found');
    const sets = await this.setModel.find({ folder: folder._id });
    return { folder, sets };
  }

  public async create(payload: FolderInterface): Promise<FolderInterface> {
    if (isEmpty(payload)) throw new HttpException(400, 'No payload');
    const data = await this.folderModel.create(payload);
    return data;
  }

  public async update(payload: FolderInterface): Promise<void> {
    if (isEmpty(payload)) throw new HttpException(400, 'No payload');
    const folder = await this.folderModel.findByIdAndUpdate(payload._id, payload);
    if (!folder) throw new HttpException(409, 'Conflict');
    await this.setModel.updateMany({ id: folder.sets }, { folder: folder.id });
  }

  public async delete(payload: string): Promise<void> {
    if (isEmpty(payload)) throw new HttpException(400, 'No payload');
    const data = await this.folderModel.findByIdAndDelete(payload);
    if (!data) throw new HttpException(409, 'Conflict');
  }
}

export const folderService = new FolderService();
