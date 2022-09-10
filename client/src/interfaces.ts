export interface CardInterface {
  term: string;
  definition: string;
}

export interface SetInterface {
  id: string;
  title: string;
  description: string;
  tags: string[];
  cards: CardInterface[];
  folders?: FolderInterface[];
  user: UserInterface;
  createdAt: string;
  updateddAt: string;
}

export interface FolderInterface {
  id: string;
  name: string;
  description: string;
  sets?: SetInterface[];
  user: UserInterface;
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
