import { customAlphabet } from 'nanoid';
import { sign } from 'jsonwebtoken';

/**
 * @method isEmpty
 * @param {String | Number | Object} value
 * @returns {Boolean} true & false
 * @description this value is Empty Check
 */
export const isEmpty = (value: string | number | object): boolean => {
  if (value === null) {
    return true;
  } else if (typeof value !== 'number' && value === '') {
    return true;
  } else if (typeof value === 'undefined' || value === undefined) {
    return true;
  } else if (value !== null && typeof value === 'object' && !Object.keys(value).length) {
    return true;
  } else {
    return false;
  }
};

export const nanoid = (alphabet = 'abcdefghijklmnopqrstuvwxyz1234567890', size = 21) => {
  const id = customAlphabet(alphabet, size);
  return id();
};

export const createToken = {
  access(userId: string) {
    return sign({ userId }, process.env.ACCESS_SECRET, { expiresIn: '30m', algorithm: 'HS256' });
  },

  refresh(userId: string) {
    return sign({ userId }, process.env.REFRESH_SECRET, { expiresIn: '14d', algorithm: 'HS256' });
  },
};
