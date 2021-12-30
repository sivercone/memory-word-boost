export interface SetInterface {
  id: string;
  title: string;
  description: string;
  tags: string[];
  cards: { term: string; definition: string }[]; // todo: here is no ID
  folders: FolderInterface[];
  createdAt: string;
  updateddAt: string;
}

export interface FolderInterface {
  id: string;
  name: string;
  description: string;
  sets: SetInterface[];
  createdAt?: string;
  updatedAt?: string;
}

export interface UserInterface {
  id: string;
  email: string;
  name: string;
  bio: string;
  avatar: string;
  createdAt: string;
  updatedAt: string;
}
