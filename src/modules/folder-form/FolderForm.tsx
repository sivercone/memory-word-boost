import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { utils } from '@src/lib';
import { useLocalStore } from '@src/stores';
import * as Types from '@src/types';
import { Dialog, Input } from '@src/ui';

interface Props extends Pick<React.ComponentProps<typeof Dialog>, 'open' | 'close'> {
  data?: Types.FolderForm;
}

const FolderForm: React.FC<Props> = ({ open, close, data }) => {
  const router = useRouter();
  const { user, folders, ...localStore } = useLocalStore();
  const form = useForm<Types.FolderForm>();

  const handleClose = (folderId?: string) => {
    close();
    if (!data) {
      if (folderId) router.replace({ pathname: router.pathname, query: { folder: folderId } });
      else router.push('/');
    }
  };

  const onSubmit = async (data: Types.FolderForm) => {
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

      form.reset();
      handleClose(saveFolder.id);
    } catch (error) {
      utils.func.handleError(error);
    }
  };

  useEffect(() => {
    if (data?.id) form.reset(data);
    else form.reset({ id: '', name: '', description: '' });
  }, [data, open]);

  return (
    <Dialog
      open={open}
      close={() => handleClose()}
      header={{
        title: data?.id ? 'Edit Folder' : 'New Folder',
        left: <Dialog.Button onClick={() => handleClose()}>Cancel</Dialog.Button>,
        right: <Dialog.Button onClick={form.handleSubmit(onSubmit)}>Save</Dialog.Button>,
      }}
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 overflow-y-auto p-4">
        <Input placeholder="Name" {...form.register('name', { required: true })} />
        <Input placeholder="Description" {...form.register('description')} />
        <input type="submit" aria-hidden="true" hidden />
      </form>
    </Dialog>
  );
};

export default FolderForm;
