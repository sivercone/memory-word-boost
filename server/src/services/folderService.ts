import { FolderInterface, UserInterface } from '@/interfaces';
import FolderEntity from '@/entities/FolderEntity';
import { HttpException } from '@/utils/HttpException';
import { isEmpty } from '@/utils/isEmpty';
import { getRepository, Not } from 'typeorm';

class FolderService {
  public async findAll(excludeUserId: string | undefined): Promise<FolderInterface[]> {
    const folderRepo = getRepository(FolderEntity);
    const folders = await folderRepo.find({
      where: { user: { id: Not(excludeUserId) } },
      relations: ['sets'],
      take: 10,
      order: { createdAt: 'ASC' },
    });
    return folders;
  }

  public async findById(payload: string): Promise<FolderInterface> {
    if (isEmpty(payload)) throw new HttpException(400, 'No payload');
    const folderRepo = getRepository(FolderEntity);
    const folder = await folderRepo.findOne({ where: { id: payload }, relations: ['sets', 'user'] });
    if (!folder) throw new HttpException(404, 'Not Found');
    return folder;
  }

  async findByUser(payload: UserInterface): Promise<FolderInterface[]> {
    if (isEmpty(payload)) throw new HttpException(400, 'No payload');
    const folderRepo = getRepository(FolderEntity);
    const data = await folderRepo.find({ where: { user: payload }, order: { createdAt: 'DESC' } });
    return data;
  }

  public async create(payload: FolderInterface): Promise<FolderInterface> {
    if (isEmpty(payload) || !payload.user) throw new HttpException(400, 'No payload');
    const folderRepo = getRepository(FolderEntity);
    const data = await folderRepo.save(payload);
    return data;
  }

  public async update(payload: FolderInterface, userId: string): Promise<FolderInterface> {
    if (isEmpty(payload) || !userId) throw new HttpException(400, 'No payload');
    const folderRepo = getRepository(FolderEntity);
    const folder = await folderRepo.findOne({ where: { id: payload.id }, relations: ['user'] });
    if (!folder) throw new HttpException(409, 'Conflict');
    if (folder.user.id !== userId) throw new HttpException(403, 'Forbidden');
    const data = await folderRepo.save(payload);
    return data;
  }

  public async delete(payload: string, userId: string): Promise<void> {
    if (isEmpty(payload) || !userId) throw new HttpException(400, 'No payload');
    const folderRepo = getRepository(FolderEntity);
    const data = await folderRepo.findOne({ where: { id: payload }, relations: ['user'] });
    if (!data) throw new HttpException(409, 'Conflict');
    if (data.user.id !== userId) throw new HttpException(403, 'Forbidden');
    await folderRepo.delete({ id: payload });
  }
}

export const folderService = new FolderService();
