import { Not } from 'typeorm';
import { dataSource } from '@/core/db';
import SetEntity from '@/entities/SetEntity';
import { HttpException } from '@/utils/HttpException';
import { isEmpty } from '@/utils/isEmpty';
import { logger } from '@/utils/logger';
import { SetInterface, UserInterface } from '@/interfaces';

class SetService {
  private setRepository = dataSource.getRepository(SetEntity);

  public async findAll(excludeUserId: string | undefined): Promise<SetInterface[]> {
    try {
      const sets = await this.setRepository.find({
        where: { user: { id: Not(excludeUserId) } },
        relations: { folders: true },
        order: { createdAt: 'ASC' },
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
      const data = await this.setRepository.findOne({ where: { id: payload }, relations: { folders: true, user: true } });
      if (!data) throw new HttpException(404, 'Not Found');
      return data;
    } catch (error) {
      logger.error('[SetService - findById] >> Message:', error);
      throw new HttpException(error.status || 409, error.message || 'something went wrong');
    }
  }

  async findByUser(payload: UserInterface): Promise<SetInterface[]> {
    if (isEmpty(payload)) throw new HttpException(400, 'Payload is missed. Do not repeat this request without modification.');
    try {
      const data = await this.setRepository.find({ where: { user: { id: payload.id } }, order: { createdAt: 'ASC' } });
      return data;
    } catch (error) {
      logger.error('[SetService - findByUser] >> Message:', error);
      throw new HttpException(error.status || 409, error.message || 'something went wrong');
    }
  }

  public async create(payload: SetInterface): Promise<SetInterface> {
    if (isEmpty(payload) || !payload.user)
      throw new HttpException(400, 'Payload is missed. Do not repeat this request without modification.');
    try {
      if (!Array.isArray(payload.tags)) payload.tags = (payload.tags as string).replace(/\s+/g, '').split(',');
      const saveSet = await this.setRepository.save(payload);
      return saveSet;
    } catch (error) {
      logger.error('[SetService - create] >> Message:', error);
      throw new HttpException(error.status || 409, error.message || 'something went wrong');
    }
  }

  public async update(payload: SetInterface, userId: string): Promise<SetInterface> {
    if (isEmpty(payload) || !userId)
      throw new HttpException(400, 'Payload is missed. Do not repeat this request without modification.');
    try {
      const findSet = await this.setRepository.findOne({ where: { id: payload.id }, relations: ['user'] });
      if (!findSet) throw new HttpException(409, 'Conflict');
      if (findSet.user.id !== userId) throw new HttpException(403, 'Forbidden');
      if (!Array.isArray(payload.tags)) payload.tags = (payload.tags as string).replace(/\s+/g, '').split(',');
      const saveSet = await this.setRepository.save(payload);
      return saveSet;
    } catch (error) {
      logger.error('[SetService - update] >> Message:', error);
      throw new HttpException(error.status || 409, error.message || 'something went wrong');
    }
  }

  public async delete(payload: string, userId: string): Promise<void> {
    if (isEmpty(payload) || !userId)
      throw new HttpException(400, 'Payload is missed. Do not repeat this request without modification.');
    try {
      const data = await this.setRepository.findOne({ where: { id: payload }, relations: ['user'] });
      if (!data) throw new HttpException(409, 'Conflict');
      if (data.user.id !== userId) throw new HttpException(403, 'Forbidden');
      await this.setRepository.delete({ id: payload });
    } catch (error) {
      logger.error('[SetService - delete] >> Message:', error);
      throw new HttpException(error.status || 409, error.message || 'something went wrong');
    }
  }
}

export const setService = new SetService();
