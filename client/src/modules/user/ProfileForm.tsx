import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { authApi } from 'apis/authApi';
import { notify } from 'lib/notify';
import { useUserStore } from 'storage/useUserStore';
import { UserInterface } from 'interfaces';

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
    <Dialog.Root open={open} onOpenChange={setOpen} defaultOpen={router.pathname === '/user/[id]/edit'}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-gray-800 bg-opacity-50 data-[state=open]:animate-overlayShow fixed inset-0" />

        <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-gray-50 shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none flex flex-col overflow-hidden">
          <div className="flex items-center border-b border-b-gray-200 bg-white p-4">
            <Dialog.Close asChild>
              <button className="border border-gray-200 border-solid p-2 rounded-lg">Close</button>
            </Dialog.Close>
            <Dialog.Title className="mx-auto text-lg">Edit profile</Dialog.Title>
            <button onClick={handleSubmit(onSubmit)} className="border border-gray-200 border-solid p-2 rounded-lg">
              Save
            </button>
          </div>

          <form className="p-4 flex flex-col gap-4 overflow-y-auto">
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
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default ProfileForm;
