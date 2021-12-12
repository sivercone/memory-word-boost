export interface SetInterface {
  id: string;
  title: string;
  description: string;
  tags: string[];
  cards: { term: string; definition: string }[];
  folders?: FolderInterface[];
  createdAt: string;
  updatedAt: string;
}

export interface FolderInterface {
  id: string;
  name: string;
  description: string;
  sets?: SetInterface[];
  createdAt: string;
  updatedAt: string;
}
