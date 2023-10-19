import { customAlphabet } from 'nanoid';

const nanoid = (alphabet = 'abcdefghijklmnopqrstuvwxyz1234567890', size = 21) => {
  const id = customAlphabet(alphabet, size);
  return id();
};

export default nanoid;
