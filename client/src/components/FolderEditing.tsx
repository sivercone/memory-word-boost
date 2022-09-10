import React from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { folderApi } from 'api/folderApi';
import { FolderInterface, UserInterface } from 'interfaces';
import { useUserStore } from 'storage/useUserStore';
import { Modal, ModalBody, ModalInputs, ModalActions } from 'ui/Modal';
import { Input } from 'ui/Input';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  folderFigure?: FolderInterface;
}

interface SingleFolderInterface {
  id: string;
  name: string;
  description: string;
  user: UserInterface;
  createdAt?: string;
  updatedAt?: string;
}

export const FolderEditing: React.FC<Props> = ({ isOpen, onClose, folderFigure }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useUserStore();
  const { register, handleSubmit, reset } = useForm<SingleFolderInterface>({ defaultValues: { ...folderFigure, user } }); // https://stackoverflow.com/a/64307087
  const create = useMutation(folderApi.create);
  const update = useMutation(folderApi.update, { onSuccess: () => queryClient.invalidateQueries(['folder', folderFigure?.id]) });
  const onSubmit = async (data: FolderInterface) => {
    if (user) data.user = user;
    try {
      if (folderFigure && folderFigure.id) await update.mutateAsync(data);
      else await create.mutateAsync(data);
      onClose();
      reset();
    } catch (error) {}
  };

  React.useEffect(() => {
    if (create.isSuccess) router.push(`/folder/${create.data}`);
  }, [create, router]);

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
