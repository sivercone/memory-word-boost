import React from 'react';
import { useRouter } from 'next/router';
import { useMutation, useQueryClient } from 'react-query';
import { folderApi } from '@src/apis';
import { FolderInterface } from '@src/interfaces';
import { notify } from '@src/lib';
import { Dialog } from '@src/ui';
import { useUserStore } from '@src/stores';

interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
  data: FolderInterface;
}

export const FolderDelete: React.FC<Props> = ({ open, setOpen, data }) => {
  const router = useRouter();
  const { user } = useUserStore();
  const queryClient = useQueryClient();

  const fetchDelete = useMutation(folderApi.delete, {
    onSuccess: () => {
      queryClient.invalidateQueries(['folders', user?.id]);
      return router.push('/');
    },
  });
  const onDelete = async () => {
    await fetchDelete.mutateAsync(data.id).catch((error) => {
      console.error(error);
      notify('Hmm, something went wrong, please try again later.');
    });
  };

  return (
    <Dialog
      open={open}
      setOpen={setOpen}
      header={{
        title: 'Delete Folder',
        left: <Dialog.Button onClick={() => setOpen(false)}>Cancel</Dialog.Button>,
        right: <Dialog.Button onClick={onDelete}>Delete</Dialog.Button>,
      }}
    >
      <div className="px-4 py-20 text-center text-lg">
        <p className="leading-relaxed">Are you sure you want to delete &#39;{data.name}&#39;?</p>
        <p className="leading-relaxed">Sets in this folder will not be deleted.</p>
      </div>
    </Dialog>
  );
};
