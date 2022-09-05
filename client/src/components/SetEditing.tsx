import React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useForm, useFieldArray } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import style from 'styles/pages/createset.module.scss';
import { setApi } from 'api/setApi';
import { SetInterface, UserInterface } from 'interfaces';
import { useUserStore } from 'storage/useUserStore';
import { Modal, ModalActions, ModalBody } from 'ui/Modal';
import { Input } from 'ui/Input';

interface SetFigure {
  id?: string;
  title?: string;
  description?: string;
  tags?: string[];
  cards?: { term?: string; definition?: string }[];
  user: UserInterface;
  createdAt?: string;
  updateddAt?: string;
}

const SetEditing: NextPage<{ setFigure?: SetFigure }> = ({ setFigure }) => {
  const router = useRouter();
  const { user } = useUserStore();
  const { register, handleSubmit, control } = useForm<SetFigure>({ defaultValues: { ...setFigure, user } });
  const { fields, append, remove } = useFieldArray({ name: 'cards', control });

  const queryClient = useQueryClient();
  const create = useMutation(setApi.create);
  const update = useMutation(setApi.update, { onSuccess: () => queryClient.invalidateQueries('sets') });
  const onSubmit = async (payload: SetInterface) => {
    console.log('s', payload);
    if (payload.cards.length < 2) return toggleModalShown();
    try {
      if (setFigure && setFigure.id) await update.mutateAsync(payload);
      else await create.mutateAsync(payload);
    } catch (error) {}
  };

  React.useEffect(() => {
    if (update.isSuccess) router.push(`/${update.data}`);
    if (create.isSuccess) router.push(`/${create.data}`);
  }, [update, create, router]);

  const [isModalShown, setIsModalShown] = React.useState(false);
  const toggleModalShown = () => setIsModalShown(!isModalShown);

  return (
    <div className={`container ${style.class}`}>
      <div className={style.class__header}>
        <span>{setFigure && setFigure.id ? 'Update study set' : 'Create a new study set'}</span>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <div className={style.class__general}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Input label="Title" {...register('title')} required />
            <Input label="Description" {...register('description')} />
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Input label="Tags (through comma)" {...register('tags')} />
            <button className="button button_dark" type="submit">
              <span>{setFigure && setFigure.id ? 'update' : 'create'}</span>
            </button>
          </div>
        </div>

        <ul className={style.cards}>
          {fields.map((content, i) => (
            <li key={content.id} className={style.cards__block}>
              <input type="text" placeholder="term" {...register(`cards.${i}.term`)} required />
              <input type="text" placeholder="definition" {...register(`cards.${i}.definition`)} required />
              <button onClick={() => remove(i)} type="button" title="delete">
                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="#cccccc">
                  <path d="M0 0h24v24H0V0z" fill="none" />
                  <path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z" />
                </svg>
              </button>
            </li>
          ))}
          <li style={{ textAlign: 'center' }}>
            <button onClick={() => append({ term: '', definition: '' })} className="button button_dark" type="button">
              <span>add card</span>
            </button>
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
  );
};

export default SetEditing;
