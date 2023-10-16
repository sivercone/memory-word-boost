import React from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { authApi } from '@src/apis/authApi';
import { notify } from '@src/lib/notify';
import { useUserStore } from '@src/stores';
import { UserInterface } from '@src/interfaces';
import { Dialog } from '@src/ui';

const ProfileForm: React.FC<{ open: boolean; setOpen: (value: boolean) => void }> = ({ open, setOpen }) => {
  const router = useRouter();
  const { signAccess } = useUserStore();
  const queryClient = useQueryClient();
  const mutation = useMutation(authApi.update);
  const { data: userData } = useQuery('user', () => authApi.me(signAccess));
  const { register, handleSubmit, reset } = useForm<UserInterface>({ defaultValues: { ...userData } });

  React.useEffect(() => {
    if (userData) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { signAccess, ...data } = userData;
      reset(data);
    }
  }, [userData]);

  const onSubmit = async (payload: UserInterface) => {
    try {
      await mutation.mutateAsync({ data: payload, token: signAccess });
      queryClient.invalidateQueries('user');
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
        right: <Dialog.Button onClick={handleSubmit(onSubmit)}>Save</Dialog.Button>,
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="p-4 flex flex-col gap-4 overflow-y-auto">
        <input
          type="email"
          placeholder="Email"
          {...register('email', {
            required: true,
            pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, message: 'Invalid email address' },
          })}
          className="border border-gray-200 border-solid p-2 rounded-lg bg-white"
        />
        <input
          placeholder="Name"
          {...register('name', { required: true })}
          className="border border-gray-200 border-solid p-2 rounded-lg bg-white"
        />
        <input placeholder="Bio" {...register('bio')} className="border border-gray-200 border-solid p-2 rounded-lg bg-white" />
        <input type="submit" aria-hidden="true" style={{ display: 'none' }} />
      </form>
    </Dialog>
  );
};

export default ProfileForm;
