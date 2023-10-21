import { dataSource } from '@src/core/db';
import { HttpException, logger } from '@src/lib';
import { isEmpty } from '@src/lib/utils';
import { UserEntity } from '@src/entities';
import { UserInterface } from '@src/interfaces';

class UserService {
  private userRepository = dataSource.getRepository(UserEntity);

  public async findAll(): Promise<UserInterface[]> {
    try {
      const users = await this.userRepository.find();
      return users;
    } catch (error) {
      logger.error('[UserService - findAll] >> Message:', error);
      throw new HttpException(error.status || 409, error.message || 'something went wrong');
    }
  }

  public async findById(payload: string): Promise<UserInterface> {
    if (!payload) throw new HttpException(400, 'Payload is missed. Do not repeat this request without modification.');
    try {
      const findUser = await this.userRepository.findOneBy({ id: payload });
      if (!findUser) throw new HttpException(404, 'Not found'); // @todo - fix incorrect response for auth check..
      return findUser;
    } catch (error) {
      logger.error('[UserService - findById] >> Message:', error);
      throw new HttpException(error.status || 409, error.message || 'something went wrong');
    }
  }

  public async update(payload: UserInterface): Promise<UserInterface> {
    if (isEmpty(payload)) throw new HttpException(400, 'Payload is missed. Do not repeat this request without modification.');
    try {
      const findUser = await this.userRepository.findOneBy({ id: payload.id });
      if (!findUser) throw new HttpException(404, 'Not found');
      const result = await this.userRepository.save(payload);
      return result;
    } catch (error) {
      logger.error('[UserService - update] >> Message:', error);
      throw new HttpException(error.status || 409, error.message || 'something went wrong');
    }
  }

  public async delete(payload: string): Promise<void> {
    if (!payload) throw new HttpException(400, 'Payload is missed. Do not repeat this request without modification.');
    try {
      const findUser = await this.userRepository.findOneBy({ id: payload });
      if (!findUser) throw new HttpException(404, 'Not found');
      await this.userRepository.delete({ id: findUser.id });
    } catch (error) {
      logger.error('[UserService - delete] >> Message:', error);
      throw new HttpException(error.status || 409, error.message || 'something went wrong');
    }
  }
}

export const userService = new UserService();
