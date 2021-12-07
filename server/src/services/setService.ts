import { SetInterface } from '@/interfaces';
import setModel from '@/models/setModel';
import { HttpException } from '@exceptions/HttpException';
import { isEmpty } from '@utils/util';

class SetService {
  public setModel = setModel;

  public async findAll(): Promise<SetInterface[]> {
    const sets = await this.setModel.find();
    return sets;
  }

  public async findById(payload: string): Promise<SetInterface> {
    const data = await this.setModel.findById(payload);
    if (!data) throw new HttpException(404, 'Not Found');
    return data;
  }

  public async create(payload: SetInterface): Promise<SetInterface> {
    if (isEmpty(payload)) throw new HttpException(400, 'No payload');
    if (!Array.isArray(payload.tags)) payload.tags = (payload.tags as string).replace(/\s+/g, '').split(',');
    const data = await this.setModel.create(payload);
    return data;
  }

  public async update(payload: SetInterface): Promise<SetInterface> {
    if (isEmpty(payload)) throw new HttpException(400, 'No payload');
    if (!Array.isArray(payload.tags)) payload.tags = (payload.tags as string).replace(/\s+/g, '').split(',');
    const data = await this.setModel.findByIdAndUpdate(payload._id, payload);
    if (!data) throw new HttpException(409, 'Conflict');
    return data;
  }

  public async delete(payload: string): Promise<void> {
    if (isEmpty(payload)) throw new HttpException(400, 'No payload');
    const data = await this.setModel.findByIdAndDelete(payload);
    if (!data) throw new HttpException(409, 'Conflict');
  }
}

export const setService = new SetService();
