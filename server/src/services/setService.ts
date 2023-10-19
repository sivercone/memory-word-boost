import { Not } from 'typeorm';
import { dataSource } from '@/core/db';
import SetEntity from '@/entities/SetEntity';
import { HttpException } from '@/utils/HttpException';
import { isEmpty } from '@/utils/isEmpty';
import { logger } from '@/utils/logger';
import { SetInterface } from '@/interfaces';
import nanoid from '@/utils/nanoid';

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
      const data = await this.setRepository.findOne({ where: { id: payload }, relations: { user: true } });
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

  public async create(payload: SetInterface): Promise<SetInterface> {
    if (isEmpty(payload) || !payload.user)
      throw new HttpException(400, 'Payload is missed. Do not repeat this request without modification.');
    try {
      const generatedId = nanoid();
      const saveSet = await this.setRepository.save({ ...payload, id: generatedId });
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
