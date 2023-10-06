import React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useForm, useFieldArray, UseFieldArrayAppend } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { setApi } from 'apis/setApi';
import { useUserStore } from 'storage/useUserStore';
import { Input } from 'ui/Input';
import { Button } from 'ui/Button';
import { CardInterface, SetInterfaceDraft } from 'interfaces';
import style from 'styles/pages/createset.module.scss';
import { Toggle } from 'ui/Toggle';
import { AnimatePresence, motion } from 'framer-motion';
import { growUpMotions } from 'lib/staticData';
import Header from 'ui/Header';
import { ChevronRightIcon, MinusIcon } from '@src/ui/Icons';
import Textarea from '@src/ui/Textarea';
import Link from 'next/link';

const SetForm: NextPage = () => {
  //   const router = useRouter();
  //   const { user, signAccess } = useUserStore();

  //   const { register, handleSubmit, control, setValue } = useForm<SetInterfaceDraft & { tags: string | string[] }>();
  //   const { fields, append, remove } = useFieldArray({ name: 'cards', control });

  //   const queryClient = useQueryClient();
  //   const save = useMutation(setApi.save, { onSuccess: () => queryClient.invalidateQueries('sets') });
  //   const onSubmit = async (payload: SetInterfaceDraft) => {
  //     if (payload.cards.length < 2) return toggleModalShown();
  //     const data = {
  //       ...payload,
  //       cards: payload.cards.map((c, i) => ({
  //         order: c.order ? c.order : i,
  //         term: c.term?.replace(/^\s+|\s+$/g, '').replace(/\s+/g, ' ') || '',
  //         definition: c.definition?.replace(/^\s+|\s+$/g, '').replace(/\s+/g, ' ') || '',
  //       })),
  //     };

  //     try {
  //       await save.mutateAsync({ data, token: signAccess });
  //     } catch (error) {}
  //   };

  //   React.useEffect(() => {
  //     if (save.isSuccess) router.push(`/${save.data}`);
  //   }, [save]);

  //   const [isModalShown, setIsModalShown] = React.useState(false);
  //   const toggleModalShown = () => setIsModalShown(!isModalShown);

  //   const [isImportShown, setIsImportShown] = React.useState(false);

  //   const flipCardValues = () => {
  //     const flippedFields = fields.map((obj) => ({ ...obj, term: obj.definition, definition: obj.term }));
  //     setValue('cards', flippedFields);
  //   };

  return (
    <>
      <SetGeneral />
      {/* <ul className="flex flex-col gap-4">
          {fields.map((content, i) => (
            <li key={content.id} className="flex gap-4">
              <div className="flex flex-col border border-gray-200 border-solid overflow-hidden rounded-lg bg-white w-full">
                <Textarea
                  placeholder="Front"
                  {...register(`cards.${i}.term`, { required: true })}
                  className="p-2 outline-none"
                  rows={1}
                />
                <hr className="border-gray-200" />
                <Textarea
                  placeholder="Back"
                  {...register(`cards.${i}.definition`, { required: true })}
                  className="p-2 outline-none"
                  rows={1}
                />
              </div>
              <button
                title="Remove"
                onClick={() => remove(i)}
                className="w-[32px] h-[32px] rounded-full border bg-white border-gray-200 py-2 border-solid items-center justify-center flex"
              >
                <MinusIcon />
              </button>
            </li>
          ))}
        </ul>

        <Button onClick={() => append({ order: fields.length, term: '', definition: '' })} type="button">
          ADD CARD
        </Button> */}
    </>
  );
};

const SetGeneral = () => {
  const router = useRouter();
  const { register, handleSubmit } = useForm<SetInterfaceDraft & { tags: string | string[] }>();

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-4 py-4 px-4">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-medium">New Set</h1>
        <button className="ml-auto bg-white border border-gray-200 border-solid p-2 rounded-lg">Save</button>
      </div>
      <form autoComplete="off" className={style.form}>
        <input
          placeholder="Name"
          {...register('title', { required: true })}
          className="border border-gray-200 border-solid p-2 rounded-lg bg-white"
        />
        <input
          placeholder="Description"
          {...register('description')}
          className="border border-gray-200 border-solid p-2 rounded-lg bg-white"
        />
      </form>

      {[
        {
          id: 'cards',
          name: 'Cards',
          lore: 'Create, edit or remove cards in your Set. Personalize each card with unique content to facilitate your learning journey.',
          href: `${router.pathname}?tab=cards`,
        },
        {
          id: 'folders',
          name: 'Folders',
          lore: 'Organize your Set by adding it to specific folders. Keep your study materials neat and easily accessible by grouping related Sets together.',
          href: `${router.pathname}?tab=folders`,
        },
      ].map((item) => (
        <Link
          key={item.id}
          href={item.href}
          className="p-4 flex flex-col gap-1 border border-gray-200 border-solid overflow-hidden rounded-lg bg-white w-full"
          legacyBehavior={false}
        >
          <div className="flex items-center">
            <span className="font-medium">{item.name}</span>
            <ChevronRightIcon className="ml-auto fill-gray-600" />
          </div>
          <span className="block text-sm max-w-[89%] text-gray-600">{item.lore}</span>
        </Link>
      ))}
    </div>
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
