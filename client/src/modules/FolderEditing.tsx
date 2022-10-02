import React from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { folderApi } from 'apis/folderApi';
import { FolderInterfaceDraft } from 'interfaces';
import { useUserStore } from 'storage/useUserStore';
import { Modal, ModalBody, ModalInputs, ModalActions } from 'ui/Modal';
import { Input } from 'ui/Input';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  folderFigure?: FolderInterfaceDraft;
}

export const FolderEditing: React.FC<Props> = ({ isOpen, onClose, folderFigure }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, signAccess } = useUserStore();
  const { register, handleSubmit, reset } = useForm<FolderInterfaceDraft>({ defaultValues: { ...folderFigure, user } }); // https://stackoverflow.com/a/64307087
  const save = useMutation(folderApi.save, { onSuccess: () => queryClient.invalidateQueries(['folder', folderFigure?.id]) });
  const onSubmit = async (data: FolderInterfaceDraft) => {
    if (user) data.user = user;
    try {
      await save.mutateAsync({ data, token: signAccess });
      onClose();
      reset();
    } catch (error) {}
  };

  React.useEffect(() => {
    if (save.isSuccess && router.pathname !== `/folder/${save.data}`) router.push(`/folder/${save.data}`);
  }, [save.isSuccess, router.pathname]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <ModalBody>
          <h3>{folderFigure && folderFigure.id ? 'Update folder' : 'Create a new folder'}</h3>
          <ModalInputs>
            <Input label="Name" {...register('name')} autoFocus required />
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
