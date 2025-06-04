import { useRouter } from 'next/router';
import React from 'react';
import { useForm } from 'react-hook-form';

import { notify } from '@src/lib';
import { useLocalStore } from '@src/stores';
import * as Types from '@src/types';
import { Dialog } from '@src/ui';

const ProfileForm: React.FC<{ open: boolean; setOpen: (value: boolean) => void }> = ({ open, setOpen }) => {
  const router = useRouter();
  const localStore = useLocalStore();
  const form = useForm<Types.UserForm>({
    defaultValues: { email: localStore.user?.email, name: localStore.user?.name, bio: localStore.user?.bio },
  });

  const onSubmit = (payload: Types.UserForm) => {
    if (!localStore.user) return;
    try {
      localStore.setValues({ user: { ...localStore.user, ...payload, updatedAt: new Date().toISOString() } });
      setOpen(false);
    } catch (error) {
      console.error(error);
      notify('Hmm, something went wrong, please try again later.');
    }
  };

  return (
    <Dialog
      defaultOpen={router.pathname === '/user/[id]/edit'}
      open={open}
      setOpen={setOpen}
      header={{
        title: 'Edit Profile',
        left: <Dialog.Button onClick={() => setOpen(false)}>Cancel</Dialog.Button>,
        right: <Dialog.Button onClick={form.handleSubmit(onSubmit)}>Save</Dialog.Button>,
      }}
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="p-4 flex flex-col gap-4 overflow-y-auto">
        <input
          type="email"
          placeholder="Email"
          {...form.register('email', {
            required: true,
            pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, message: 'Invalid email address' },
          })}
          className="border border-gray-200 border-solid p-2 rounded-lg bg-white read-only:bg-gray-100 read-only:text-gray-600"
          readOnly
        />
        <input
          placeholder="Name"
          {...form.register('name', { required: true })}
          className="border border-gray-200 border-solid p-2 rounded-lg bg-white"
        />
        <input placeholder="Bio" {...form.register('bio')} className="border border-gray-200 border-solid p-2 rounded-lg bg-white" />
        <input type="submit" aria-hidden="true" style={{ display: 'none' }} />
      </form>
    </Dialog>
  );
};

export default ProfileForm;
