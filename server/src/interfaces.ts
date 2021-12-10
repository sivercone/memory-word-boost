export interface SetInterface {
  _id?: string;
  title: string;
  description: string;
  tags: string[];
  cardSet: { term: string; definition: string }[];
  folder?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface FolderInterface {
  _id?: string;
  name: string;
  description: string;
  sets?: string[];
  createdAt?: string;
  updatedAt?: string;
}
