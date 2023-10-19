import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { dataSource } from '@/core/db';
import UserEntity from '@/entities/UserEntity';
import { HttpException } from '@utils/HttpException';
import { isEmpty } from '@/utils/isEmpty';
import { createAccessToken, createRefreshToken } from '@utils/createToken';
import { logger } from '@utils/logger';
import { UserInterface } from '@/interfaces';
import nanoid from '@/utils/nanoid';

class AuthService {
  private userRepository = dataSource.getRepository(UserEntity);

  public async logIn(payload: { email: string; password: string }): Promise<{ access: string; refresh: string }> {
    if (isEmpty(payload)) throw new HttpException(400, 'Payload is missed. Do not repeat this request without modification.');
    try {
      const findUser = await this.userRepository.findOne({
        where: { email: payload.email },
        select: { id: true, email: true, password: true },
      });
      if (findUser) {
        const isPasswordCorrect = await bcrypt.compare(payload.password, findUser.password);
        if (!isPasswordCorrect) throw new HttpException(401, 'Bad credentials.');
        const refreshToken = createRefreshToken(findUser.id);
        const accessToken = createAccessToken(findUser.id);
        await this.userRepository.update(findUser.id, { refresh_token: refreshToken });
        return { refresh: refreshToken, access: accessToken };
      } else {
        const generatedId = nanoid();
        const hashedPassword = await bcrypt.hash(payload.password, 10);
        const savedUser = await this.userRepository.save({ id: generatedId, email: payload.email, password: hashedPassword });
        const refreshToken = createRefreshToken(savedUser.id);
        const accessToken = createAccessToken(savedUser.id);
        await this.userRepository.update(savedUser.id, { refresh_token: refreshToken });
        return { refresh: refreshToken, access: accessToken };
      }
    } catch (error) {
      logger.error('[AuthService - logIn] >> Message:', error);
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
      logger.error('[AuthService - findToken] >> Message:', error);
      throw new HttpException(error.status || 409, error.message || 'something went wrong');
    }
  }

  public async logout(userId: string): Promise<UserInterface> {
    if (!userId) throw new HttpException(400, 'Payload is missed. Do not repeat this request without modification.');
    try {
      const findUser = await this.userRepository.findOneBy({ id: userId });
      if (!findUser) throw new HttpException(409, 'no data find');
      return findUser;
    } catch (error) {
      logger.error('[AuthService - delete] >> Message:', error);
      throw new HttpException(error.status || 409, error.message || 'something went wrong');
    }
  }
}

export const authService = new AuthService();
