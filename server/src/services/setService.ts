import { Not } from 'typeorm';
import { dataSource } from '@src/core/db';
import { SetEntity } from '@src/entities';
import { HttpException, logger } from '@src/lib';
import { isEmpty, nanoid } from '@src/lib/utils';
import { SetInterface } from '@src/interfaces';

class SetService {
  private setRepository = dataSource.getRepository(SetEntity);

  // @todo - this service can be removed and utilized by `findByUser`
  public async findAll(excludeUserId: string | undefined): Promise<SetInterface[]> {
    try {
      const sets = await this.setRepository.find({
        where: excludeUserId ? { user: { id: Not(excludeUserId) } } : undefined,
        order: { createdAt: 'DESC' },
      });
      return sets;
    } catch (error) {
      logger.error('[SetService - findAll] >> Message:', error);
      throw new HttpException(error.status || 409, error.message || 'something went wrong');
    }
  }

  public async findById(payload: string): Promise<SetInterface> {
    if (isEmpty(payload)) throw new HttpException(400, 'Payload is missed. Do not repeat this request without modification.');
    try {
      const data = await this.setRepository.findOne({ where: { id: payload }, relations: { user: true, folder: true } });
      if (!data) throw new HttpException(404, 'Not Found');
      return data;
    } catch (error) {
      logger.error('[SetService - findById] >> Message:', error);
      throw new HttpException(error.status || 409, error.message || 'something went wrong');
    }
  }

  async findByUser(payload: string): Promise<SetInterface[]> {
    if (isEmpty(payload)) throw new HttpException(400, 'Payload is missed. Do not repeat this request without modification.');
    try {
      const data = await this.setRepository.find({ where: { user: { id: payload } }, order: { createdAt: 'DESC' } });
      return data;
    } catch (error) {
      logger.error('[SetService - findByUser] >> Message:', error);
      throw new HttpException(error.status || 409, error.message || 'something went wrong');
    }
  }

  public async create(
    payload: Partial<Omit<SetInterface, 'user' | 'folder'> & { folderId: string }>,
    userId?: string,
  ): Promise<SetInterface> {
    if (isEmpty(payload) || !userId)
      throw new HttpException(400, 'Payload is missed. Do not repeat this request without modification.');
    try {
      const generatedId = nanoid();
      const saveSet = await this.setRepository.save({
        ...payload,
        folder: { id: payload.folderId },
        id: generatedId,
        user: { id: userId },
      });
      return saveSet;
    } catch (error) {
      logger.error('[SetService - create] >> Message:', error);
      throw new HttpException(error.status || 409, error.message || 'something went wrong');
    }
  }

  public async update(
    payload: Partial<Omit<SetInterface, 'user' | 'folder'> & { folderId: string }>,
    userId: string,
  ): Promise<SetInterface> {
    if (isEmpty(payload) || !userId)
      throw new HttpException(400, 'Payload is missed. Do not repeat this request without modification.');
    try {
      const findSet = await this.setRepository.findOne({ where: { id: payload.id }, relations: ['user'] });
      if (!findSet) throw new HttpException(409, 'Conflict');
      if (findSet.user.id !== userId) throw new HttpException(403, 'Forbidden');
      const saveSet = await this.setRepository.save({ ...payload, folder: { id: payload.folderId } });
      return saveSet;
    } catch (error) {
      logger.error('[SetService - update] >> Message:', error);
      throw new HttpException(error.status || 409, error.message || 'something went wrong');
    }
  }

  public async delete(setId: string, userId: string): Promise<void> {
    if (!setId || !userId) throw new HttpException(400, 'Payload is missed. Do not repeat this request without modification.');
    try {
      const data = await this.setRepository.findOne({ where: { id: setId }, relations: ['user'] });
      if (!data) throw new HttpException(409, 'Conflict');
      if (data.user.id !== userId) throw new HttpException(403, 'Forbidden');
      await this.setRepository.delete({ id: setId });
    } catch (error) {
      logger.error('[SetService - delete] >> Message:', error);
      throw new HttpException(error.status || 409, error.message || 'something went wrong');
    }
  }
}

export const setService = new SetService();
