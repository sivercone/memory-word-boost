import { FolderInterface } from '@/interfaces';
import FolderEntity from '@/entity/FolderEntity';
import { HttpException } from '@/utils/HttpException';
import { isEmpty } from '@utils/util';
import { getRepository } from 'typeorm';

class FolderService {
  public async findAll(): Promise<FolderInterface[]> {
    const folderRepo = getRepository(FolderEntity);
    const folders = await folderRepo.find({ relations: ['sets'] });
    return folders;
  }

  public async findById(payload: string): Promise<FolderInterface> {
    if (isEmpty(payload)) throw new HttpException(400, 'No payload');
    const folderRepo = getRepository(FolderEntity);
    const folder = await folderRepo.findOne({ where: { id: payload }, relations: ['sets', 'user'] });
    if (!folder) throw new HttpException(404, 'Not Found');
    return folder;
  }

  public async create(payload: FolderInterface): Promise<FolderInterface> {
    if (isEmpty(payload) || !payload.user) throw new HttpException(400, 'No payload');
    const folderRepo = getRepository(FolderEntity);
    const data = await folderRepo.save(payload);
    return data;
  }

  public async update(payload: FolderInterface): Promise<void> {
    if (isEmpty(payload)) throw new HttpException(400, 'No payload');
    const folderRepo = getRepository(FolderEntity);
    const folder = await folderRepo.findOne({ where: { id: payload.id } });
    if (!folder) throw new HttpException(409, 'Conflict');
    await folderRepo.save(payload);
  }

  public async delete(payload: string): Promise<void> {
    if (isEmpty(payload)) throw new HttpException(400, 'No payload');
    const folderRepo = getRepository(FolderEntity);
    const data = await folderRepo.findOne({ where: { id: payload } });
    if (!data) throw new HttpException(409, 'Conflict');
    await folderRepo.delete({ id: payload });
  }
}

export const folderService = new FolderService();
