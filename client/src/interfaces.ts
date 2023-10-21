export interface CardInterface {
  order: number;
  front: string;
  back: string;
}

export interface SetInterface {
  id: string;
  name: string;
  description: string;
  cards: CardInterface[];
  folder: FolderInterface;
  user: UserInterface;
  createdAt: string;
  updatedAt: string;
}
export type SetInterfaceDraft = Partial<Omit<SetInterface, 'user' | 'createdAt' | 'updatedAt'>>;

export interface FolderInterface {
  id: string;
  name: string;
  description: string;
  sets: SetInterface[];
  user: UserInterface;
  createdAt: string;
  updatedAt: string;
}
export type FolderInterfaceDraft = Partial<Omit<FolderInterface, 'user' | 'sets' | 'createdAt' | 'updatedAt'>>;

export interface UserInterface {
  id: string;
  email: string;
  name: string;
  bio: string;
  createdAt: string;
  updatedAt: string;
}
