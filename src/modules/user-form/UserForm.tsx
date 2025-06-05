import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';

import { utils } from '@src/lib';
import { useLocalStore } from '@src/stores';
import * as Types from '@src/types';
import { Dialog } from '@src/ui';

const ProfileForm = ({ open, close }: Pick<React.ComponentProps<typeof Dialog>, 'open' | 'close'>) => {
  const router = useRouter();
  const { user, ...localStore } = useLocalStore();
  const form = useForm<Types.UserForm>({ defaultValues: { email: user?.email, name: user?.name, bio: user?.bio } });

  const onSubmit = (payload: Types.UserForm) => {
    if (!user) return;
    try {
      localStore.setValues({ user: { ...user, ...payload, updatedAt: new Date().toISOString() } });
      close();
    } catch (error) {
      utils.func.handleError(error);
    }
  };

  return (
    <Dialog
      defaultOpen={router.pathname === '/user/[id]/edit'}
      open={open}
      close={close}
      header={{
        title: 'Edit Profile',
        left: <Dialog.Button onClick={close}>Cancel</Dialog.Button>,
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
