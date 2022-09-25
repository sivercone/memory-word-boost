import React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useForm, useFieldArray } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { setApi } from 'api/setApi';
import { useUserStore } from 'storage/useUserStore';
import { Modal, ModalActions, ModalBody } from 'ui/Modal';
import { Input } from 'ui/Input';
import { Button } from 'ui/Button';
import { SetInterfaceDraft } from 'interfaces';
import style from 'styles/pages/createset.module.scss';

const SetEditing: NextPage<{ setFigure?: SetInterfaceDraft }> = ({ setFigure }) => {
  const router = useRouter();
  const { user } = useUserStore();
  const { register, handleSubmit, control } = useForm<SetInterfaceDraft>({
    defaultValues: { ...setFigure, user, cards: [{ term: '', definition: '' }] },
  });
  const { fields, append, remove } = useFieldArray({ name: 'cards', control });

  const queryClient = useQueryClient();
  const save = useMutation(setApi.save, { onSuccess: () => queryClient.invalidateQueries('sets') });
  const onSubmit = async (payload: SetInterfaceDraft) => {
    if (payload.cards.length < 2) return toggleModalShown();
    try {
      await save.mutateAsync(payload);
    } catch (error) {}
  };

  React.useEffect(() => {
    if (save.isSuccess) router.push(`/${save.data}`);
  }, [save, router]);

  const [isModalShown, setIsModalShown] = React.useState(false);
  const toggleModalShown = () => setIsModalShown(!isModalShown);

  return (
    <>
      <header className={style.header}>
        <div className={style.header__inner}>
          <div>
            <Button onClick={() => router.push(setFigure?.id ? `/${setFigure.id}` : '/')} title="close" variant="icon">
              <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="currentColor">
                <path d="M0 0h24v24H0V0z" fill="none" />
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
              </svg>
            </Button>
            <p>{setFigure && setFigure.id ? 'Update study set' : 'Create study set'}</p>
          </div>
          <button onClick={handleSubmit(onSubmit)}>Save</button>
        </div>
      </header>
      <div className={`container ${style.class}`}>
        <form autoComplete="off">
          <div className={style.class__general}>
            <Input label="Title" {...register('title')} required />
            <Input label="Tags (through comma)" {...register('tags')} />
            <Input label="Description (optional)" {...register('description')} />
          </div>

          <ul className={style.cards}>
            {fields.map((content, i) => (
              <li key={content.id} className={style.cards__block}>
                <Input label="Term" {...register(`cards.${i}.term`)} required />
                <Input label="Definition" {...register(`cards.${i}.definition`)} required />
                <Button onClick={() => remove(i)} type="button" title="remove" variant="icon">
                  <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="currentColor">
                    <path d="M0 0h24v24H0V0z" fill="none" />
                    <path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z" />
                  </svg>
                </Button>
              </li>
            ))}
            <li style={{ textAlign: 'center' }}>
              <Button onClick={() => append({ term: '', definition: '' })} type="button">
                ADD CARD
              </Button>
            </li>
          </ul>
        </form>
        <Modal isOpen={isModalShown} onClose={toggleModalShown}>
          <ModalBody>
            <h3>Information</h3>
            <p>You need to add at least two cards to create a study set</p>
          </ModalBody>
          <ModalActions>
            <button onClick={toggleModalShown}>OK</button>
          </ModalActions>
        </Modal>
      </div>
    </>
  );
};

export default SetEditing;
