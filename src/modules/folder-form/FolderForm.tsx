import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { notify } from '@src/lib';
import { useLocalStore } from '@src/stores';
import * as Types from '@src/types';
import { Dialog } from '@src/ui';

interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
  data?: Types.FolderForm;
}

const FolderForm: React.FC<Props> = ({ open, setOpen, data }) => {
  const router = useRouter();
  const { user, folders, ...localStore } = useLocalStore();
  const form = useForm<Types.FolderForm>();

  const onSubmit = (data: Types.FolderForm) => {
    if (!user) return;
    try {
      const nextFolders = folders.filter((item) => item.id !== data.id);
      const currFolder = data.id ? folders.find((item) => item.id === data.id) : null;
      const saveFolder = {
        ...currFolder,
        ...data,
        id: currFolder?.id || crypto.randomUUID(),
        setIds: currFolder?.setIds || [],
        userId: user.id,
        createdAt: currFolder?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } satisfies Types.FolderModel;

      localStore.setValues({ folders: [...nextFolders, saveFolder] });
      setOpen(false);
      form.reset();
      if (router.pathname !== `/sets?folder=${saveFolder.id}`) router.push(`/sets?folder=${saveFolder.id}`);
    } catch (error) {
      console.error(error);
      notify('Hmm, something went wrong, please try again later.');
    }
  };

  useEffect(() => {
    if (data?.id) form.reset(data);
    else form.reset({ id: '', name: '', description: '' });
  }, [data, open]);

  return (
    <Dialog
      open={open}
      setOpen={setOpen}
      header={{
        title: data?.id ? 'Edit Folder' : 'New Folder',
        left: <Dialog.Button onClick={() => setOpen(false)}>Cancel</Dialog.Button>,
        right: <Dialog.Button onClick={form.handleSubmit(onSubmit)}>Save</Dialog.Button>,
      }}
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="p-4 flex flex-col gap-4 overflow-y-auto">
        <input
          placeholder="Name"
          {...form.register('name', { required: true })}
          className="border border-gray-200 border-solid p-2 rounded-lg bg-white"
        />
        <input
          placeholder="Description"
          {...form.register('description')}
          className="border border-gray-200 border-solid p-2 rounded-lg bg-white"
        />
        <input type="submit" aria-hidden="true" hidden />
      </form>
    </Dialog>
  );
};

export default FolderForm;
