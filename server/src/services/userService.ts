import { HttpException } from '@/utils/HttpException';
import { isEmpty } from '@/utils/isEmpty';
import { UserInterface } from '@/interfaces';
import { getRepository } from 'typeorm';
import UserEntity from '@/entities/UserEntity';

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

  public async logout(userId: string): Promise<UserInterface> {
    if (!userId) throw new HttpException(400, 'no data');
    try {
      const userRepo = getRepository(UserEntity);
      const findUser = await userRepo.findOne({ where: { id: userId } });
      if (!findUser) throw new HttpException(409, 'no data find');
      return findUser;
    } catch (error) {
      throw new HttpException(error.status || 409, error.message || 'something went wrong');
    }
  }
}

export const userService = new UserService();
