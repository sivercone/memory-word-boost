import { SetInterface, UserInterface } from '@/interfaces';
import SetEntity from '@/entities/SetEntity';
import { HttpException } from '@/utils/HttpException';
import { isEmpty } from '@/utils/isEmpty';
import { getRepository, Not } from 'typeorm';
import { logger } from '@/utils/logger';

class SetService {
  public async findAll(excludeUserId: string | undefined): Promise<SetInterface[]> {
    const setRepo = getRepository(SetEntity);
    const sets = await setRepo.find({
      where: { user: { id: Not(excludeUserId) } },
      relations: ['folders'],
      order: { createdAt: 'ASC' },
    });
    return sets;
  }

  public async findById(payload: string): Promise<SetInterface> {
    if (isEmpty(payload)) throw new HttpException(400, 'No payload');
    const setRepo = getRepository(SetEntity);
    const data = await setRepo.findOne({ where: { id: payload }, relations: ['folders', 'user'] });
    if (!data) throw new HttpException(404, 'Not Found');
    return data;
  }

  async findByUser(payload: UserInterface): Promise<SetInterface[]> {
    if (isEmpty(payload)) throw new HttpException(400, 'No payload');
    const setRepo = getRepository(SetEntity);
    const data = await setRepo.find({ where: { user: payload }, order: { createdAt: 'ASC' } });
    return data;
  }

  public async create(payload: SetInterface): Promise<SetInterface> {
    if (isEmpty(payload) || !payload.user) throw new HttpException(400, 'No payload');
    if (!Array.isArray(payload.tags)) payload.tags = (payload.tags as string).replace(/\s+/g, '').split(',');
    const setRepo = getRepository(SetEntity);
    const saveSet = await setRepo.save(payload);
    return saveSet;
  }

  public async update(payload: SetInterface, userId: string): Promise<SetInterface> {
    try {
      if (isEmpty(payload) || !userId) throw new HttpException(400, 'No payload');
      const setRepo = getRepository(SetEntity);
      const findSet = await setRepo.findOne({ where: { id: payload.id }, relations: ['user'] });
      if (!findSet) throw new HttpException(409, 'Conflict');
      if (findSet.user.id !== userId) throw new HttpException(403, 'Forbidden');
      if (!Array.isArray(payload.tags)) payload.tags = (payload.tags as string).replace(/\s+/g, '').split(',');
      const saveSet = await setRepo.save(payload);
      return saveSet;
    } catch (error) {
      logger.error('SetService/update:', error);
      throw new HttpException(error.status || 409, error.message || 'something went wrong');
    }
  }

  public async delete(payload: string, userId: string): Promise<void> {
    if (isEmpty(payload) || !userId) throw new HttpException(400, 'No payload');
    const setRepo = getRepository(SetEntity);
    const data = await setRepo.findOne({ where: { id: payload }, relations: ['user'] });
    if (!data) throw new HttpException(409, 'Conflict');
    if (data.user.id !== userId) throw new HttpException(403, 'Forbidden');
    await setRepo.delete({ id: payload });
  }
}

export const setService = new SetService();
