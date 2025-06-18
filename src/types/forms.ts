/**
 * Includes all types related to form data,
 * like form state interfaces and form submission types.
 */

import * as Models from './models';

export type FolderForm = Pick<Models.FolderModel, 'id' | 'name' | 'description'>;

export type SetForm = Pick<Models.SetModel, 'id' | 'name' | 'description' | 'cards' | 'folderId'>;

export type LoginForm = { email: Models.UserModel['email']; password: string };

export type UserForm = Pick<Models.UserModel, 'email' | 'name' | 'bio'>;
