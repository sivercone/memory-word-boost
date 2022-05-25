import { HttpException } from '@/utils/HttpException';
import { isEmpty } from '@/utils/isEmpty';
import { UserInterface } from '@/interfaces';
import { getRepository } from 'typeorm';
import UserEntity from '@/entity/UserEntity';

class UserService {
  public async findAll(): Promise<UserInterface[]> {
    const userRepo = getRepository(UserEntity);
    const users = await userRepo.find();
    return users;
  }

  public async findById(payload: string): Promise<UserInterface> {
    if (!payload) throw new HttpException(400, 'No payload');
    const userRepo = getRepository(UserEntity);
    const findUser = await userRepo.findOne({ id: payload });
    if (!findUser) throw new HttpException(404, 'Not found');
    return findUser;
  }

  public async update(payload: UserInterface): Promise<UserInterface> {
    if (isEmpty(payload)) throw new HttpException(400, 'No payload');
    const userRepo = getRepository(UserEntity);
    const findUser = await userRepo.findOne({ id: payload.id });
    if (!findUser) throw new HttpException(404, 'Not found');
    const result = await userRepo.save(payload);
    return result;
  }

  public async delete(payload: string): Promise<void> {
    if (!payload) throw new HttpException(400, 'No payload');
    const userRepo = getRepository(UserEntity);
    const findUser = await userRepo.findOne({ id: payload });
    if (!findUser) throw new HttpException(404, 'Not found');
    await userRepo.delete({ id: findUser.id });
  }
}

export const userService = new UserService();
