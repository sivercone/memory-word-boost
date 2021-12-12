import { folderApi } from 'api/folderApi';
import { FolderInterface } from 'interfaces';
import { useRouter } from 'next/dist/client/router';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { Modal, ModalBody, ModalInputs, ModalActions } from './Modal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  folderFigure?: FolderInterface;
}

interface SingleFolderInterface {
  id: string;
  name: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
}

export const FolderEditing: React.FC<Props> = ({ isOpen, onClose, folderFigure }) => {
  const { register, handleSubmit, reset } = useForm<SingleFolderInterface>({ defaultValues: folderFigure });
  const queryClient = useQueryClient();
  const router = useRouter();
  const create = useMutation(folderApi.create);
  const update = useMutation(folderApi.update, { onSuccess: () => queryClient.invalidateQueries(['folder', folderFigure?.id]) });
  const onSubmit = async (data: FolderInterface) => {
    try {
      if (folderFigure && folderFigure.id) await update.mutateAsync(data);
      else await create.mutateAsync(data);
      onClose();
      reset();
    } catch (error) {}
  };

  React.useEffect(() => {
    if (create.isSuccess) router.push(`/folder/${create.data}`);
  }, [create.isSuccess]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <ModalBody>
          <h3>{folderFigure && folderFigure.id ? 'Update folder' : 'Create a new folder'}</h3>
          <ModalInputs>
            <label className="input">
              <span>Name</span>
              <input {...register('name')} />
            </label>
            <label className="input">
              <span>Description (optional)</span>
              <input {...register('description')} />
            </label>
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
