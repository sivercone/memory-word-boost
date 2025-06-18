/**
 * Definitions for domain models which might be used across
 * components and services beyond just API interactions.
 */

export interface UserModel {
  id: string;
  email: string;
  name: string;
  bio: string;
  createdAt: string;
  updatedAt: string;
}

export interface FolderModel {
  id: string;
  name: string;
  description: string;
  setIds: string[];
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CardModel {
  order: number;
  front: string;
  back: string;
}

export interface SetModel {
  id: string;
  name: string;
  description: string;
  cards: CardModel[];
  folderId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}
