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

  // https://www.tutorialrepublic.com/faq/how-to-convert-comma-separated-string-into-an-array-in-javascript.php
  public async create(payload: SetInterface): Promise<void> {
    if (isEmpty(payload)) throw new HttpException(400, 'No payload');
    await this.setModel.create(payload);
  }
}

export const setService = new SetService();
