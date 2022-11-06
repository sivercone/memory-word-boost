import express from 'express';

/* -------------- entities -------------- */

export interface SetInterface {
  id: string;
  title: string;
  description: string;
  tags: string[];
  cards: { order: number; term: string; definition: string }[];
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

export interface UserInterface {
  id: string;
  email: string;
  name: string;
  bio: string;
  avatar: string;
  refresh_token: string;
  fingerprint: string;
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

export interface GoogleUser {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
}

export interface GoogleTokens {
  access_token: string;
  expires_in: Number;
  refresh_token: string;
  scope: string;
  id_token: string;
}

export interface ReqWithSessionValues extends express.Request {
  access_token?: string;
  refresh_token?: string;
  userId?: string;
}
