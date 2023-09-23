import React from 'react';
import { useRouter } from 'next/router';
import { useMutation, useQueryClient } from 'react-query';
import { setApi } from '@src/apis';
import { SetInterface } from '@src/interfaces';
import { useUserStore } from '@src/storage/useUserStore';
import { notify } from '@src/lib/notify';
import { Dialog } from '@src/ui';

interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
  data: SetInterface;
}

export const SetDelete: React.FC<Props> = ({ open, setOpen, data }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { signAccess } = useUserStore();

  const fetchDelete = useMutation(setApi.delete, {
    onSuccess: () => {
      queryClient.invalidateQueries('sets');
      return router.push('/');
    },
  });
  const onDelete = async () => {
    await fetchDelete.mutateAsync({ id: data.id, token: signAccess }).catch((error) => {
      console.error(error);
      notify('Hmm, something went wrong, please try again later.');
    });
  };

  return (
    <Dialog
      open={open}
      setOpen={setOpen}
      header={{
        title: 'Delete Set',
        left: <Dialog.Button onClick={() => setOpen(false)}>Cancel</Dialog.Button>,
        right: <Dialog.Button onClick={onDelete}>Delete</Dialog.Button>,
      }}
    >
      <div className="px-4 py-20 text-center text-lg">
        <p className="leading-relaxed">Are you sure you want to delete &#39;{data.title}&#39;?</p>
      </div>
    </Dialog>
  );
};
