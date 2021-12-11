import { folderApi } from 'api/folderApi';
import { FolderInterface } from 'interfaces';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { Modal, ModalBody, ModalInputs, ModalActions } from './Modal';

interface Props {
  isOpen: boolean;
  toggleShown: () => void;
  folderFigure?: FolderInterface;
}

export const FolderEditing: React.FC<Props> = ({ isOpen, toggleShown, folderFigure }) => {
  const { register, handleSubmit } = useForm<FolderInterface>({ defaultValues: folderFigure });
  const queryClient = useQueryClient();
  const create = useMutation(folderApi.create);
  const update = useMutation(folderApi.update, { onSuccess: () => queryClient.invalidateQueries(['folder', folderFigure?._id]) });
  const onSubmit = async (data: FolderInterface) => {
    try {
      if (folderFigure && folderFigure._id) await update.mutateAsync(data);
      else await create.mutateAsync(data);
      toggleShown();
    } catch (error) {}
  };
  return (
    <Modal isOpen={isOpen} onClose={toggleShown}>
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <ModalBody>
          <h3>Create a new folder</h3>
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
          <button onClick={toggleShown} type="button">
            Cancel
          </button>
          <button type="submit">{folderFigure && folderFigure._id ? 'Update' : 'Create'}</button>
        </ModalActions>
      </form>
    </Modal>
  );
};
