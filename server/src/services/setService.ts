import { SetInterface } from '@/interfaces';
import SetEntity from '@/entity/SetEntity';
import { HttpException } from '@/utils/HttpException';
import { isEmpty } from '@utils/util';
import { getRepository } from 'typeorm';

class SetService {
  public async findAll(): Promise<SetInterface[]> {
    const setRepo = getRepository(SetEntity);
    const sets = await setRepo.find({ relations: ['folders'] });
    return sets;
  }

  public async findById(payload: string): Promise<SetInterface> {
    if (isEmpty(payload)) throw new HttpException(400, 'No payload');
    const setRepo = getRepository(SetEntity);
    const data = await setRepo.findOne({ where: { id: payload }, relations: ['folders'] });
    if (!data) throw new HttpException(404, 'Not Found');
    return data;
  }

  public async create(payload: SetInterface): Promise<SetInterface> {
    if (isEmpty(payload)) throw new HttpException(400, 'No payload');
    if (!Array.isArray(payload.tags)) payload.tags = (payload.tags as string).replace(/\s+/g, '').split(',');
    const setRepo = getRepository(SetEntity);
    const saveSet = await setRepo.save(payload);
    return saveSet;
  }

  public async update(payload: SetInterface): Promise<SetInterface> {
    if (isEmpty(payload)) throw new HttpException(400, 'No payload');
    const setRepo = getRepository(SetEntity);
    const findSet = await setRepo.findOne({ where: { id: payload.id } });
    if (!findSet) throw new HttpException(409, 'Conflict');
    if (!Array.isArray(payload.tags)) payload.tags = (payload.tags as string).replace(/\s+/g, '').split(',');
    const saveSet = await setRepo.save(payload);
    return saveSet;
  }

  public async delete(payload: string): Promise<void> {
    if (isEmpty(payload)) throw new HttpException(400, 'No payload');
    const setRepo = getRepository(SetEntity);
    const data = await setRepo.findOne({ where: { id: payload } });
    if (!data) throw new HttpException(409, 'Conflict');
    await setRepo.delete({ id: payload });
  }
}

export const setService = new SetService();
