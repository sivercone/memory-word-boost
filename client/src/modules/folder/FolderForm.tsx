import React from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { folderApi } from '@src/apis';
import { FolderInterfaceDraft } from '@src/interfaces';
import { useUserStore } from '@src/stores';
import { notify } from '@src/lib';
import { Dialog } from '@src/ui';

interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
  data?: FolderInterfaceDraft;
}

export const FolderForm: React.FC<Props> = ({ open, setOpen, data }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useUserStore();
  const { register, handleSubmit, reset } = useForm<FolderInterfaceDraft>();
  const save = useMutation(folderApi.save);

  const onSubmit = async (data: FolderInterfaceDraft) => {
    try {
      const folderId = await save.mutateAsync(data);
      setOpen(false);
      reset();
      queryClient.invalidateQueries(['folder', folderId]);
      if (user) queryClient.invalidateQueries(['folders', user.id]);
      if (router.pathname !== `/sets?folder=${folderId}`) router.push(`/sets?folder=${folderId}`);
    } catch (error) {
      console.error(error);
      notify('Hmm, something went wrong, please try again later.');
    }
  };

  React.useEffect(() => {
    if (data?.id) reset(data);
    else reset({ id: '', name: '', description: '' });
  }, [data, open]);

  return (
    <Dialog
      open={open}
      setOpen={setOpen}
      header={{
        title: data?.id ? 'Edit Folder' : 'New Folder',
        left: <Dialog.Button onClick={() => setOpen(false)}>Cancel</Dialog.Button>,
        right: <Dialog.Button onClick={handleSubmit(onSubmit)}>Save</Dialog.Button>,
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="p-4 flex flex-col gap-4 overflow-y-auto">
        <input
          placeholder="Name"
          {...register('name', { required: true })}
          className="border border-gray-200 border-solid p-2 rounded-lg bg-white"
        />
        <input
          placeholder="Description"
          {...register('description')}
          className="border border-gray-200 border-solid p-2 rounded-lg bg-white"
        />
        <input type="submit" aria-hidden="true" hidden />
      </form>
    </Dialog>
  );
};
