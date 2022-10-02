import jwt from 'jsonwebtoken';
import { dataSource } from '@/core/db';
import UserEntity from '@/entities/UserEntity';
import { HttpException } from '@utils/HttpException';
import { isEmpty } from '@/utils/isEmpty';
import { createAccessToken, createRefreshToken } from '@utils/createToken';
import { logger } from '@utils/logger';

class AuthService {
  private userRepository = dataSource.getRepository(UserEntity);

  public async logIn(payload: { email: string; name: string; avatar: string }): Promise<string> {
    if (isEmpty(payload)) throw new HttpException(400, 'No payload');
    try {
      const findUser = await this.userRepository.findOneBy({ email: payload.email });
      if (findUser) {
        const refreshToken = createRefreshToken(findUser.id);
        await this.userRepository.update(findUser.id, { ...payload, refresh_token: refreshToken });
        return refreshToken;
      } else {
        const savedUser = await this.userRepository.save(payload);
        const refreshToken = createRefreshToken(savedUser.id);
        await this.userRepository.update(savedUser.id, { ...savedUser, refresh_token: refreshToken });
        return refreshToken;
      }
    } catch (error) {
      logger.error('AuthService - logIn:', error);
      throw new HttpException(error.status || 409, error.message || 'something went wrong');
    }
  }

  async findToken(refreshToken: string): Promise<{ [x: string]: string }> {
    if (!refreshToken) throw new HttpException(401, 'Unauthorized. Your session has expired.');
    try {
      // const findUser = await userRepo.findOne({ where: { refresh_token: refreshToken } });
      const findUser = await this.userRepository
        .createQueryBuilder('user')
        .addSelect('user.refresh_token')
        .where('user.refresh_token = :refresh_token', { refresh_token: refreshToken })
        .getOne();
      if (!findUser) throw new HttpException(401, 'Unauthorized. No found session.');

      const foundRefreshToken: string = findUser.refresh_token;
      let decodedUserId: string;
      jwt.verify(foundRefreshToken, process.env.REFRESH_SECRET, (err, decoded: { userId: string }) => {
        if (err || !decoded.userId) throw new HttpException(401, 'Unauthorized. Your session has expired.');
        else decodedUserId = decoded.userId;
      });
      const access_token = createAccessToken(decodedUserId);
      const refresh_token = createRefreshToken(decodedUserId);

      await this.userRepository.update(findUser.id, { refresh_token: refresh_token });
      return { access_token, refresh_token, decodedUserId };
    } catch (error) {
      logger.error('AuthService - findToken:', error);
      throw new HttpException(error.status || 409, error.message || 'something went wrong');
    }
  }
}

export const authService = new AuthService();
