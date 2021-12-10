import { FolderInterface } from '@/interfaces';
import folderModel from '@/models/folderModel';
import { HttpException } from '@exceptions/HttpException';
import { isEmpty } from '@utils/util';

class FolderService {
  public folderModel = folderModel;

  public async findAll(): Promise<FolderInterface[]> {
    const folders = await this.folderModel.find();
    return folders;
  }

  public async create(payload: FolderInterface): Promise<void> {
    if (isEmpty(payload)) throw new HttpException(400, 'No payload');
    await this.folderModel.create(payload);
  }

  public async update(payload: FolderInterface): Promise<void> {
    if (isEmpty(payload)) throw new HttpException(400, 'No payload');
    const data = await this.folderModel.findByIdAndUpdate(payload._id, payload);
    if (!data) throw new HttpException(409, 'Conflict');
  }

  public async delete(payload: string): Promise<void> {
    if (isEmpty(payload)) throw new HttpException(400, 'No payload');
    const data = await this.folderModel.findByIdAndDelete(payload);
    if (!data) throw new HttpException(409, 'Conflict');
  }
}

export const folderService = new FolderService();
