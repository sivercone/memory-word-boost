import { useRouter } from 'next/router';
import React from 'react';

import { notify } from '@src/lib';
import { useLocalStore } from '@src/stores';
import * as Types from '@src/types';
import { Dialog } from '@src/ui';

interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
  data: Types.SetModel;
}

const SetDelete: React.FC<Props> = ({ open, setOpen, data }) => {
  const router = useRouter();
  const localStore = useLocalStore();

  const onDelete = () => {
    try {
      localStore.setValues({ sets: localStore.sets.filter((item) => item.id !== data.id) });
      router.push('/');
    } catch (error) {
      console.error(error);
      notify('Hmm, something went wrong, please try again later.');
    }
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
        <p className="leading-relaxed">Are you sure you want to delete &#39;{data.name}&#39;?</p>
      </div>
    </Dialog>
  );
};

export default SetDelete;
