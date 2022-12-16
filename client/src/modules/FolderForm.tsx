import React from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { folderApi } from 'apis/folderApi';
import { FolderInterfaceDraft } from 'interfaces';
import { useUserStore } from 'storage/useUserStore';
import { Modal, ModalBody, ModalInputs, ModalActions } from 'ui/Modal';
import { Input } from 'ui/Input';
import { notify } from 'lib/notify';
import { useLocalStore } from 'storage/useLocalStore';
import { isBackendLess } from 'lib/staticData';
import { generateEntity } from 'lib/utils';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  folderFigure?: FolderInterfaceDraft;
}

export const FolderForm: React.FC<Props> = ({ isOpen, onClose, folderFigure }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, signAccess } = useUserStore();
  const { setLocalFolders, localFolders } = useLocalStore();

  const { register, handleSubmit, reset } = useForm<FolderInterfaceDraft>({ defaultValues: { ...folderFigure, user } }); // https://stackoverflow.com/a/64307087
  const save = useMutation(folderApi.save, {
    onSuccess: (data) => {
      if (router.pathname !== `/folder/${data}`) router.push(`/folder/${data}`);
      notify('Successfully saved folder');
      queryClient.invalidateQueries('userFolders');
      return queryClient.invalidateQueries(['folder', data]);
    },
  });
  const onSubmit = async (data: FolderInterfaceDraft) => {
    if (user) data.user = user;
    if (isBackendLess) {
      const generatedFolder = generateEntity.folder(data);
      setLocalFolders([...localFolders.filter(({ id }) => id !== generatedFolder.id), generatedFolder]);
      onClose();
      reset();
      if (router.pathname !== `/folder/${generatedFolder.id}`) router.push(`/folder/${generatedFolder.id}`);
    } else {
      try {
        await save.mutateAsync({ data, token: signAccess });
        onClose();
        reset();
      } catch (error) {}
    }
  };

  React.useEffect(() => {
    if (folderFigure) reset({ ...folderFigure, user });
  }, [folderFigure, user]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <ModalBody>
          <h3>{folderFigure && folderFigure.id ? 'Update folder' : 'Create a new folder'}</h3>
          <ModalInputs>
            <Input label="Name" {...register('name', { required: true })} />
            <Input label="Description (optional)" {...register('description')} />
          </ModalInputs>
        </ModalBody>
        <ModalActions>
          <button onClick={onClose} type="button">
            Cancel
          </button>
          <button type="submit">{folderFigure && folderFigure.id ? 'Update' : 'Create'}</button>
        </ModalActions>
      </form>
    </Modal>
  );
};
