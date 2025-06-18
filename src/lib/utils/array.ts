import * as Types from '@src/types';

import { nanoid } from './string';

export function composeSortedFolders(folders: Types.FolderModel[]): Pick<Types.FolderModel, 'id' | 'name'>[] {
  const defaultFolder = { id: 'sets', name: 'Sets' };
  const sortedFolders = [...(folders || []), defaultFolder].sort((a, b) =>
    a.id === 'sets' ? -1 : b.id === 'sets' ? 1 : a.name.localeCompare(b.name),
  );

  return sortedFolders;
}

interface UpsertUserOptions {
  users: Types.UserModel[];
  data: Partial<Types.UserModel> & Pick<Types.UserModel, 'email'>;
  allowCreate: boolean;
}

export function upsertUser({ users, data, allowCreate = true }: UpsertUserOptions): {
  users: Types.UserModel[];
  userId: Types.UserModel['id'];
} {
  const index = users.findIndex((u) => u.email === data.email);
  const timestamp = new Date().toISOString();

  if (index !== -1) {
    const existing = users[index];
    const updated = { ...existing, ...data, updatedAt: timestamp };
    return {
      users: [...users.slice(0, index), updated, ...users.slice(index + 1)],
      userId: existing.id,
    };
  }

  if (!allowCreate) {
    throw new Error('User not found and creation not allowed.');
  }

  const newUser: Types.UserModel = {
    id: nanoid(),
    email: data.email,
    name: data.name || '',
    bio: data.bio || '',
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  return {
    users: [...users, newUser],
    userId: newUser.id,
  };
}

export const getSampleSets = (userId: Types.SetModel['userId']): Types.SetModel[] => [
  {
    id: nanoid(),
    name: 'Famous Quotes',
    description: 'Learn quoutes from famous people in history',
    folderId: 'sets',
    userId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    cards: [
      {
        back: 'Albert Einstein (Theoretical Physicist)',
        front:
          'Imagination is more important than knowledge. For knowledge is limited, whereas imagination embraces the entire world, stimulating progress, giving birth to evolution.',
        order: 1,
      },
      {
        back: 'Nelson Mandela (Former President of South Africa)',
        front: 'Education is the most powerful weapon which you can use to change the world.',
        order: 2,
      },
      {
        back: 'Maya Angelou (American Poet)',
        front:
          "I've learned that people will forget what you said, people will forget what you did, but people will never forget how you made them feel.",
        order: 3,
      },
      {
        back: 'Winston Churchill (Former UK Prime Minister)',
        front: 'Success is not final, failure is not fatal: It is the courage to continue that counts.',
        order: 4,
      },
      {
        back: 'Eleanor Roosevelt (Former First Lady of the US)',
        front: 'The future belongs to those who believe in the beauty of their dreams.',
        order: 5,
      },
      {
        back: 'Confucius (Chinese Philosopher)',
        front: 'It does not matter how slowly you go as long as you do not stop.',
        order: 6,
      },
      {
        back: 'Mark Twain (American Writer)',
        front: 'The two most important days in your life are the day you are born and the day you find out why.',
        order: 7,
      },
      {
        back: 'Oscar Wilde (Irish Poet and Playwright)',
        front: 'Be yourself; everyone else is already taken.',
        order: 8,
      },
      {
        back: 'Marie Curie (Physicist and Chemist)',
        front:
          'Nothing in life is to be feared, it is only to be understood. Now is the time to understand more, so that we may fear less.',
        order: 9,
      },
      {
        back: 'Stephen Hawking (Theoretical Physicist)',
        front: 'Intelligence is the ability to adapt to change.',
        order: 10,
      },
    ],
  },
  {
    id: nanoid(),
    name: 'Computer Science Fundamentals',
    description: 'Study set to help you learn the basics of computer science',
    folderId: 'sets',
    userId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    cards: [
      {
        order: 1,
        front: 'A number system with a base of 2, using only 0s and 1s.',
        back: 'binary',
      },
      {
        order: 2,
        front: 'A program that translates source code written in a high-level language into machine code.',
        back: 'compiler',
      },
      {
        order: 3,
        front: 'The measure of the amount of time and/or space required by an algorithm to solve a problem.',
        back: 'algorithm complexity',
      },
      {
        order: 4,
        front: 'A variable that stores the memory address of another variable.',
        back: 'pointer',
      },
      {
        order: 5,
        front: 'A data structure that follows the Last-In-First-Out (LIFO) principle.',
        back: 'stack',
      },
      {
        order: 6,
        front: 'A data structure that follows the First-In-First-Out (FIFO) principle.',
        back: 'queue',
      },
      {
        order: 7,
        front:
          'A data structure that consists of a sequence of nodes, where each node contains data and a reference to the next node.',
        back: 'linked list',
      },
      {
        order: 8,
        front: 'A programming technique where a function calls itself to solve a problem.',
        back: 'recursion',
      },
      {
        order: 9,
        front: 'A mathematical notation used to describe the time complexity of an algorithm.',
        back: 'Big O notation',
      },
      {
        order: 10,
        front: 'A named storage location in memory that can hold a value.',
        back: 'variable',
      },
    ],
  },
];
