import React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useForm, useFieldArray, UseFieldArrayAppend } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { setApi } from 'apis/setApi';
import { useUserStore } from 'storage/useUserStore';
import { Modal, ModalActions, ModalBody } from 'ui/Modal';
import { Input } from 'ui/Input';
import { Button } from 'ui/Button';
import { CardInterface, SetInterfaceDraft } from 'interfaces';
import style from 'styles/pages/createset.module.scss';
import { Toggle } from 'ui/Toggle';
import { AnimatePresence, motion } from 'framer-motion';
import { growUpMotions } from 'lib/staticData';
import Header from 'ui/Header';

const SetForm: NextPage<{ setFigure?: SetInterfaceDraft }> = ({ setFigure }) => {
  const router = useRouter();
  const { user, signAccess } = useUserStore();

  const { register, handleSubmit, control, setValue } = useForm<SetInterfaceDraft & { tags: string | string[] }>({
    defaultValues: {
      ...setFigure,
      user,
      tags: setFigure?.tags?.join(', '),
      cards: !setFigure?.id ? [{ order: 0, term: '', definition: '' }] : setFigure.cards,
    },
  });
  const { fields, append, remove } = useFieldArray({ name: 'cards', control });

  const queryClient = useQueryClient();
  const save = useMutation(setApi.save, { onSuccess: () => queryClient.invalidateQueries('sets') });
  const onSubmit = async (payload: SetInterfaceDraft) => {
    if (payload.cards.length < 2) return toggleModalShown();
    const data = {
      ...payload,
      cards: payload.cards.map((c, i) => ({
        order: c.order ? c.order : i,
        term: c.term?.replace(/^\s+|\s+$/g, '').replace(/\s+/g, ' ') || '',
        definition: c.definition?.replace(/^\s+|\s+$/g, '').replace(/\s+/g, ' ') || '',
      })),
    };

    try {
      await save.mutateAsync({ data, token: signAccess });
    } catch (error) {}
  };

  React.useEffect(() => {
    if (save.isSuccess) router.push(`/${save.data}`);
  }, [save]);

  const [isModalShown, setIsModalShown] = React.useState(false);
  const toggleModalShown = () => setIsModalShown(!isModalShown);

  const [isImportShown, setIsImportShown] = React.useState(false);

  const flipCardValues = () => {
    const flippedFields = fields.map((obj) => ({ ...obj, term: obj.definition, definition: obj.term }));
    setValue('cards', flippedFields);
  };

  return (
    <>
      <Header style={isImportShown ? { zIndex: 0 } : undefined}>
        <Button onClick={() => router.push(setFigure?.id ? `/${setFigure.id}` : '/')} title="close" variant="icon">
          <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="currentColor">
            <path d="M0 0h24v24H0V0z" fill="none" />
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
          </svg>
        </Button>
        <span>
          <strong>{setFigure && setFigure.id ? 'Update study set' : 'Create study set'}</strong>
        </span>
        <button onClick={handleSubmit(onSubmit)}>Save</button>
      </Header>
      <div className="container" style={isImportShown ? { overflow: 'hidden', maxHeight: 'calc(100% - 50px)' } : undefined}>
        <form autoComplete="off" className={style.form}>
          <Input label="Title" {...register('title', { required: true })} />
          <Input label="Tags (through comma)" {...register('tags', { required: true })} placeholder="en, ua" />
          <Input label="Description (optional)" {...register('description')} />
        </form>
        <div className={style.actions}>
          <button onClick={() => setIsImportShown(true)} type="button">
            <span>
              <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" fill="currentColor">
                <path d="M4 20q-.825 0-1.412-.587Q2 18.825 2 18V6q0-.825.588-1.412Q3.175 4 4 4h5v2H4v12h16V6h-5V4h5q.825 0 1.413.588Q22 5.175 22 6v12q0 .825-.587 1.413Q20.825 20 20 20Zm8-4.6-5-5L8.4 9l2.6 2.6V4h2v7.6L15.6 9l1.4 1.4Z" />
              </svg>
            </span>
            <p>Import cards</p>
          </button>
          <button onClick={flipCardValues} type="button">
            <span>
              <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" fill="currentColor">
                <path d="M5.1 16.05q-.55-.95-.825-1.95Q4 13.1 4 12.05q0-3.35 2.325-5.7T12 4h.175l-1.6-1.6 1.4-1.4 4 4-4 4-1.4-1.4 1.6-1.6H12Q9.5 6 7.75 7.762 6 9.525 6 12.05q0 .65.15 1.275.15.625.45 1.225ZM12.025 23l-4-4 4-4 1.4 1.4-1.6 1.6H12q2.5 0 4.25-1.762Q18 14.475 18 11.95q0-.65-.15-1.275-.15-.625-.45-1.225l1.5-1.5q.55.95.825 1.95.275 1 .275 2.05 0 3.35-2.325 5.7T12 20h-.175l1.6 1.6Z" />
              </svg>
            </span>
            <p>Flip terms and definitions</p>
          </button>
        </div>
        <ul className={style.cards}>
          {fields.map((content, i) => (
            <li key={content.id} className={style.cards__block}>
              <Input label="Term" {...register(`cards.${i}.term`, { required: true })} />
              <Input label="Definition" {...register(`cards.${i}.definition`, { required: true })} />
              <Button onClick={() => remove(i)} type="button" title="remove" variant="icon">
                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="currentColor">
                  <path d="M0 0h24v24H0V0z" fill="none" />
                  <path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z" />
                </svg>
              </Button>
            </li>
          ))}
          <li style={{ textAlign: 'center' }}>
            <Button onClick={() => append({ order: fields.length, term: '', definition: '' })} type="button">
              ADD CARD
            </Button>
          </li>
        </ul>
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
      <AnimatePresence>
        {isImportShown ? <Import setIsImportShown={setIsImportShown} insertImport={append} /> : undefined}
      </AnimatePresence>
    </>
  );
};

interface ImportProps {
  setIsImportShown: React.Dispatch<React.SetStateAction<boolean>>;
  insertImport: UseFieldArrayAppend<SetInterfaceDraft, 'cards'>;
}
const Import: React.FC<ImportProps> = ({ setIsImportShown, insertImport }) => {
  const [cards, setCards] = React.useState<CardInterface[]>([]);
  const [formState, setFormState] = React.useState<{ input: string; betweenTermDef: string; betweenCard: string }>({
    input: '',
    betweenTermDef: '\t',
    betweenCard: '\n',
  });
  const toggleBetweenTermDef = () => {
    if (formState.betweenTermDef !== '\t') setFormState((prev) => ({ ...prev, betweenTermDef: '\t' }));
    else setFormState((prev) => ({ ...prev, betweenTermDef: ',' }));
  };
  const toggleBetweenCard = () => {
    if (formState.betweenCard !== '\n') setFormState((prev) => ({ ...prev, betweenCard: '\n' }));
    else setFormState((prev) => ({ ...prev, betweenCard: ';' }));
  };

  const setImportValues = (payload: string) => {
    setFormState((prev) => ({ ...prev, input: payload }));
    const data = payload
      .split(formState.betweenCard)
      .map((t) => {
        const card = t.split(formState.betweenTermDef);
        if (card[0]?.length) return { term: card[0], definition: card[1] };
      })
      .filter((obj) => !!obj);
    setCards(data as unknown as CardInterface[]);
  };
  React.useEffect(() => {
    if (formState.input) setImportValues(formState.input);
  }, [formState.betweenCard, formState.betweenTermDef]);

  const onSave = () => {
    insertImport(
      cards.map(({ term, definition, ...rest }) => ({
        ...rest,
        term: term?.replace(/^\s+|\s+$/g, '').replace(/\s+/g, ' ') || '',
        definition: definition?.replace(/^\s+|\s+$/g, '').replace(/\s+/g, ' ') || '', // @todo - refactor, used here twice
      })),
    );
    setIsImportShown(false);
  };

  return (
    <motion.div className={style.import} variants={growUpMotions} initial="init" animate="anim" exit="init">
      <Header>
        <button onClick={() => setIsImportShown(false)}>Cancel</button>
        <button onClick={onSave}>Import</button>
      </Header>
      <div className={style.import__content}>
        <Input
          value={formState.input}
          onChange={(event) => setImportValues(event.target.value)}
          label="Copy and paste your data here (from Word, Excel, Google Docs, etc.)"
          isTextArea
          placeholder={`Term 1	Definition 1\nTerm 2	Definition 2\nTerm 3	Definition 3`}
        />
        <div className={style.import__structure}>
          <div>
            <p>Between term and definition</p>
            <ul>
              <li>
                <Toggle onChange={toggleBetweenTermDef} checked={formState.betweenTermDef === '\t'} label="Tab" />
              </li>
              <li>
                <Toggle onChange={toggleBetweenTermDef} checked={formState.betweenTermDef === ','} label="Comma" />
              </li>
            </ul>
          </div>
          <div>
            <p>Between cards</p>
            <ul>
              <li>
                <Toggle onChange={toggleBetweenCard} checked={formState.betweenCard === '\n'} label="New line" />
              </li>
              <li>
                <Toggle onChange={toggleBetweenCard} checked={formState.betweenCard === ';'} label="Semicolon" />
              </li>
            </ul>
          </div>
        </div>
        <p>{cards.length ? `Preview (${cards.length} card${cards.length > 1 ? 's' : ''})` : 'Nothing to preview yet.'}</p>
        <ul className={style.cards}>
          {cards.map((content, i) => (
            <li key={content.term + content.definition + i} className={style.cards__block}>
              <Input label="Term" defaultValue={content.term} disabled />
              <Input label="Definition" defaultValue={content.definition} disabled />
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

export default SetForm;
