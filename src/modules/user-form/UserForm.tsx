import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { utils } from '@src/lib';
import { useLocalStore } from '@src/stores';
import * as Types from '@src/types';
import { Dialog, Input } from '@src/ui';

interface Props extends Pick<React.ComponentProps<typeof Dialog>, 'open' | 'close'> {
  data: Types.UserModel;
}

const UserForm = ({ data, open, close }: Props) => {
  const localStore = useLocalStore();
  const form = useForm<Types.UserForm>({ defaultValues: { email: data.email, name: data.name, bio: data.bio } });

  const onSubmit = (formData: Types.UserForm) => {
    try {
      localStore.setValues((prev) => {
        const res = utils.array.upsertUser({ users: prev.users, data: formData, allowCreate: false });
        return { ...prev, userId: res.userId, users: res.users } satisfies Parameters<typeof localStore.setValues>[0];
      });
      close();
    } catch (error) {
      utils.func.handleError(error);
    }
  };

  useEffect(() => {
    if (data) form.reset({ email: data.email, name: data.name, bio: data.bio });
  }, [data]);

  return (
    <Dialog
      open={open}
      close={close}
      header={{
        title: 'Edit Profile',
        left: <Dialog.Button onClick={close}>Cancel</Dialog.Button>,
        right: <Dialog.Button onClick={form.handleSubmit(onSubmit)}>Save</Dialog.Button>,
      }}
      data-testid="dialog-user-form"
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 overflow-y-auto p-4">
        <Input
          type="email"
          placeholder="Email"
          {...form.register('email', {
            required: true,
            pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, message: 'Invalid email address' },
          })}
          readOnly
        />
        <Input placeholder="Name" {...form.register('name', { required: true })} />
        <Input placeholder="Bio" {...form.register('bio')} />
        <input type="submit" aria-hidden="true" hidden className="hidden" />
      </form>
    </Dialog>
  );
};

export default UserForm;
