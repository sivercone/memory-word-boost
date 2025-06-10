import * as Types from '@src/types';

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
    id: crypto.randomUUID(),
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
