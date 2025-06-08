import { useRouter } from 'next/router';

import { utils } from '@src/lib';
import { useLocalStore } from '@src/stores';
import * as Types from '@src/types';
import { Dialog } from '@src/ui';

interface Props extends Pick<React.ComponentProps<typeof Dialog>, 'open' | 'close'> {
  data: Types.SetModel;
}

const SetDelete: React.FC<Props> = ({ open, close, data }) => {
  const router = useRouter();
  const localStore = useLocalStore();

  const onDelete = () => {
    try {
      localStore.setValues({ sets: localStore.sets.filter((item) => item.id !== data.id) });
      router.push('/');
    } catch (error) {
      utils.func.handleError(error);
    }
  };

  return (
    <Dialog
      open={open}
      close={close}
      header={{
        title: 'Delete Set',
        left: <Dialog.Button onClick={close}>Cancel</Dialog.Button>,
        right: <Dialog.Button onClick={onDelete}>Delete</Dialog.Button>,
      }}
    >
      <div className="px-4 py-20 text-center text-lg text-onSurface">
        <p className="leading-relaxed">Are you sure you want to delete &#39;{data.name}&#39;?</p>
      </div>
    </Dialog>
  );
};

export default SetDelete;
