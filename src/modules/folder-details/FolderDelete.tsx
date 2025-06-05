import { useRouter } from 'next/router';

import { utils } from '@src/lib';
import { useLocalStore } from '@src/stores';
import * as Types from '@src/types';
import { Dialog } from '@src/ui';

interface Props extends Pick<React.ComponentProps<typeof Dialog>, 'open' | 'close'> {
  data: Types.FolderModel;
}

const FolderDelete: React.FC<Props> = ({ open, close, data }) => {
  const router = useRouter();
  const localStore = useLocalStore();

  const onDelete = () => {
    try {
      localStore.setValues({ folders: localStore.folders.filter((item) => item.id !== data.id) });
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
        title: 'Delete Folder',
        left: <Dialog.Button onClick={close}>Cancel</Dialog.Button>,
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

export default FolderDelete;
