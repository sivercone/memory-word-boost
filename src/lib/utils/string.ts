import { customAlphabet } from 'nanoid';

export const trimExtraSpaces = (str: string): string => {
  return str.replace(/^\s+|\s+$/g, '').replace(/\s+/g, ' ');
};

export const nanoid = (alphabet = 'abcdefghijklmnopqrstuvwxyz1234567890', size = 21): string => {
  const id = customAlphabet(alphabet, size);
  return id();
};
