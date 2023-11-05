import { Not } from 'typeorm';
import { dataSource } from '@src/core/db';
import { FolderEntity } from '@src/entities';
import { HttpException, logger } from '@src/lib';
import { isEmpty, nanoid } from '@src/lib/utils';
import { FolderInterface } from '@src/interfaces';

class FolderService {
  private folderRepository = dataSource.getRepository(FolderEntity);

  // @todo - this service can be removed and utilized by `findByUser`
  public async findAll(excludeUserId: string | undefined): Promise<FolderInterface[]> {
    try {
      const folders = await this.folderRepository.find({
        where: excludeUserId ? { user: { id: Not(excludeUserId) } } : undefined,
        relations: { sets: true },
        order: { createdAt: 'DESC' },
        take: 50,
      });
      return folders;
    } catch (error) {
      logger.error('[FolderService - findAll] >> Message:', error);
      throw new HttpException(error.status || 409, error.message || 'something went wrong');
    }
  }

  public async findById(payload: string): Promise<FolderInterface> {
    if (isEmpty(payload)) throw new HttpException(400, 'Payload is missed. Do not repeat this request without modification.');
    try {
      const folder = await this.folderRepository.findOne({ where: { id: payload }, relations: { sets: true, user: true } });
      if (!folder) throw new HttpException(404, 'Not Found');
      return folder;
    } catch (error) {
      logger.error('[FolderService - findById] >> Message:', error);
      throw new HttpException(error.status || 409, error.message || 'something went wrong');
    }
  }

  async findByUser(payload: string): Promise<FolderInterface[]> {
    if (isEmpty(payload)) throw new HttpException(400, 'Payload is missed. Do not repeat this request without modification.');
    try {
      const data = await this.folderRepository.find({ where: { user: { id: payload } }, order: { createdAt: 'DESC' } });
      return data;
    } catch (error) {
      logger.error('[FolderService - findByUser] >> Message:', error);
      throw new HttpException(error.status || 409, error.message || 'something went wrong');
    }
  }

  public async create(payload: Partial<Omit<FolderInterface, 'user'>>, userId?: string): Promise<FolderInterface> {
    if (isEmpty(payload) || !userId)
      throw new HttpException(400, 'Payload is missed. Do not repeat this request without modification.');

    try {
      const generatedId = nanoid();
      const data = await this.folderRepository.save({ ...payload, id: generatedId, user: { id: userId } });
      return data;
    } catch (error) {
      logger.error('[FolderService - create] >> Message:', error);
      throw new HttpException(error.status || 409, error.message || 'something went wrong');
    }
  }

  public async update(payload: Partial<Omit<FolderInterface, 'user'>>, userId?: string): Promise<FolderInterface> {
    if (isEmpty(payload) || !userId)
      throw new HttpException(400, 'Payload is missed. Do not repeat this request without modification.');
    try {
      const folder = await this.folderRepository.findOne({ where: { id: payload.id }, relations: { user: true } });
      if (!folder) throw new HttpException(409, 'Conflict');
      if (folder.user.id !== userId) throw new HttpException(403, 'Forbidden');
      const data = await this.folderRepository.save(payload);
      return data;
    } catch (error) {
      logger.error('[FolderService - update] >> Message:', error);
      throw new HttpException(error.status || 409, error.message || 'something went wrong');
    }
  }

  public async delete(folderId: string, userId: string): Promise<void> {
    if (!folderId || !userId) throw new HttpException(400, 'Payload is missed. Do not repeat this request without modification.');
    try {
      const data = await this.folderRepository.findOne({ where: { id: folderId }, relations: { user: true } });
      if (!data) throw new HttpException(409, 'Conflict');
      if (data.user.id !== userId) throw new HttpException(403, 'Forbidden');
      await this.folderRepository.delete({ id: folderId });
    } catch (error) {
      logger.error('[FolderService - delete] >> Message:', error);
      throw new HttpException(error.status || 409, error.message || 'something went wrong');
    }
  }
}

export const folderService = new FolderService();
