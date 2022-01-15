export interface SetInterface {
  id: string;
  title: string;
  description: string;
  tags: string[];
  cards: { term: string; definition: string }[];
  folders?: FolderInterface[];
  user: UserInterface;
  createdAt: string;
  updatedAt: string;
}

export interface FolderInterface {
  id: string;
  name: string;
  description: string;
  sets?: SetInterface[];
  user: UserInterface;
  createdAt: string;
  updatedAt: string;
}

/* user */
export interface UserInterface {
  id: string;
  email: string;
  name: string;
  bio: string;
  avatar: string;
  access_token: string;
  refresh_token: string;
  fingerprint: string;
  createdAt: string;
  updatedAt: string;
}
