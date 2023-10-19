import express from 'express';

/* -------------- entities -------------- */

export interface SetInterface {
  id: string;
  name: string;
  description: string;
  cards: { order: number; front: string; back: string }[];
  folder: FolderInterface;
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

export interface UserInterface {
  id: string;
  email: string;
  password: string;
  name: string;
  bio: string;
  refresh_token: string;
  createdAt: string;
  updatedAt: string;
}

/* -------------- other -------------- */

export interface dbConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  synchronize: boolean;
  entities: string[];
}

import { Router } from 'express';
export interface Routes {
  path?: string;
  router: Router;
}

export interface ReqWithSessionValues extends express.Request {
  access_token?: string;
  refresh_token?: string;
  userId?: string;
}
