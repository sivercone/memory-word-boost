import { Not } from 'typeorm';
import { dataSource } from '@/core/db';
import FolderEntity from '@/entities/FolderEntity';
import { HttpException } from '@/utils/HttpException';
import { isEmpty } from '@/utils/isEmpty';
import { FolderInterface, UserInterface } from '@/interfaces';

class FolderService {
  private folderRepository = dataSource.getRepository(FolderEntity);

  public async findAll(excludeUserId: string | undefined): Promise<FolderInterface[]> {
    const folders = await this.folderRepository.find({
      where: { user: { id: Not(excludeUserId) } },
      relations: { sets: true },
      order: { createdAt: 'ASC' },
      take: 50,
    });
    return folders;
  }

  public async findById(payload: string): Promise<FolderInterface> {
    if (isEmpty(payload)) throw new HttpException(400, 'No payload');
    const folder = await this.folderRepository.findOne({ where: { id: payload }, relations: { sets: true, user: true } });
    if (!folder) throw new HttpException(404, 'Not Found');
    return folder;
  }

  async findByUser(payload: UserInterface): Promise<FolderInterface[]> {
    if (isEmpty(payload)) throw new HttpException(400, 'No payload');
    const data = await this.folderRepository.find({ where: { user: { id: payload.id } }, order: { createdAt: 'DESC' } });
    return data;
  }

  public async create(payload: FolderInterface): Promise<FolderInterface> {
    if (isEmpty(payload) || !payload.user) throw new HttpException(400, 'No payload');
    const data = await this.folderRepository.save(payload);
    return data;
  }

  public async update(payload: FolderInterface, userId: string): Promise<FolderInterface> {
    if (isEmpty(payload) || !userId) throw new HttpException(400, 'No payload');
    const folder = await this.folderRepository.findOne({ where: { id: payload.id }, relations: { user: true } });
    if (!folder) throw new HttpException(409, 'Conflict');
    if (folder.user.id !== userId) throw new HttpException(403, 'Forbidden');
    const data = await this.folderRepository.save(payload);
    return data;
  }

  public async delete(payload: string, userId: string): Promise<void> {
    if (isEmpty(payload) || !userId) throw new HttpException(400, 'No payload');
    const data = await this.folderRepository.findOne({ where: { id: payload }, relations: { user: true } });
    if (!data) throw new HttpException(409, 'Conflict');
    if (data.user.id !== userId) throw new HttpException(403, 'Forbidden');
    await this.folderRepository.delete({ id: payload });
  }
}

export const folderService = new FolderService();
