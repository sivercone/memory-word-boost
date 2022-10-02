import { dataSource } from '@/core/db';
import { HttpException } from '@/utils/HttpException';
import { isEmpty } from '@/utils/isEmpty';
import UserEntity from '@/entities/UserEntity';
import { UserInterface } from '@/interfaces';

class UserService {
  private userRepository = dataSource.getRepository(UserEntity);

  public async findAll(): Promise<UserInterface[]> {
    const users = await this.userRepository.find();
    return users;
  }

  public async findById(payload: string): Promise<UserInterface> {
    if (!payload) throw new HttpException(400, 'No payload');
    const findUser = await this.userRepository.findOneBy({ id: payload });
    if (!findUser) throw new HttpException(404, 'Not found');
    return findUser;
  }

  public async update(payload: UserInterface): Promise<UserInterface> {
    if (isEmpty(payload)) throw new HttpException(400, 'No payload');
    const findUser = await this.userRepository.findOneBy({ id: payload.id });
    if (!findUser) throw new HttpException(404, 'Not found');
    const result = await this.userRepository.save(payload);
    return result;
  }

  public async delete(payload: string): Promise<void> {
    if (!payload) throw new HttpException(400, 'No payload');
    const findUser = await this.userRepository.findOneBy({ id: payload });
    if (!findUser) throw new HttpException(404, 'Not found');
    await this.userRepository.delete({ id: findUser.id });
  }

  public async logout(userId: string): Promise<UserInterface> {
    if (!userId) throw new HttpException(400, 'no data');
    try {
      const findUser = await this.userRepository.findOneBy({ id: userId });
      if (!findUser) throw new HttpException(409, 'no data find');
      return findUser;
    } catch (error) {
      throw new HttpException(error.status || 409, error.message || 'something went wrong');
    }
  }
}

export const userService = new UserService();
