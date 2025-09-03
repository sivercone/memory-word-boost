import { describe, expect, it } from '@jest/globals';

import { composeSortedFolders, upsertUser, getSampleSets } from '@src/lib/utils/array';
import type { FolderModel, UserModel } from '@src/types';

describe('composeSortedFolders', () => {
  it('includes default "Sets" first and sorts others by name', () => {
    const inputs: FolderModel[] = [
      {
        id: 'b',
        name: 'Bravo',
        description: '',
        setIds: [],
        userId: 'u1',
        createdAt: '2025-09-03T12:16:14.010Z',
        updatedAt: '2025-09-03T12:16:14.010Z',
      },
      {
        id: 'a',
        name: 'Alpha',
        description: '',
        setIds: [],
        userId: 'u1',
        createdAt: '2025-09-03T12:16:14.010Z',
        updatedAt: '2025-09-03T12:16:14.010Z',
      },
    ];
    const result = composeSortedFolders(inputs);
    expect(result[0]).toEqual({ id: 'sets', name: 'Sets' });
    expect(result.slice(1).map((f) => f.name)).toEqual(['Alpha', 'Bravo']);
  });
});

describe('upsertUser', () => {
  const baseUser: UserModel = {
    id: 'u1',
    email: 'a@example.com',
    name: 'A',
    bio: '',
    createdAt: '2025-09-03T12:16:14.010Z',
    updatedAt: '2025-09-03T12:16:14.010Z',
  };

  it('updates existing user and returns same id', () => {
    const { users, userId } = upsertUser({ users: [baseUser], data: { email: 'a@example.com', name: 'Alice' } });
    expect(userId).toBe('u1');
    expect(users).toHaveLength(1);
    expect(users[0].name).toBe('Alice');
    expect(new Date(users[0].updatedAt).toString()).not.toBe('Invalid Date');
  });

  it('creates new user when not found', () => {
    const { users, userId } = upsertUser({ users: [baseUser], data: { email: 'b@example.com', name: 'Bob' } });
    expect(users).toHaveLength(2);
    expect(users.find((u) => u.id === userId)).toBeTruthy();
  });

  it('throws if not found and allowCreate=false', () => {
    expect(() => upsertUser({ users: [baseUser], data: { email: 'x@example.com' }, allowCreate: false })).toThrow(
      'User not found and creation not allowed.',
    );
  });
});

describe('getSampleSets', () => {
  it('returns sets for given user id', () => {
    const sets = getSampleSets('user-123');
    expect(Array.isArray(sets)).toBe(true);
    expect(sets.length).toBeGreaterThanOrEqual(1);
    expect(sets.every((s) => s.userId === 'user-123')).toBe(true);
  });
});
