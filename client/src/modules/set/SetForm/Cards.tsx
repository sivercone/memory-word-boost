import React from 'react';
import { SetInterface } from '@src/interfaces';
import { Textarea } from '@src/ui';
import { ArrowLeftIcon, MinusIcon, PlusIcon, SwapVertIcon } from '@src/ui/Icons';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useFieldArray, useForm } from 'react-hook-form';
import { useSetStore } from '@src/storage/useSetStore';
import { useScroll } from '@src/lib/hooks';

const Cards: React.FC = () => {
  const { scrolled } = useScroll();
  const router = useRouter();
  const { setCurrStudySet, currStudySet } = useSetStore();
  const { register, control, reset, watch } = useForm<Pick<SetInterface, 'cards'>>();
  const { fields, append, remove } = useFieldArray({ name: 'cards', control });
  React.useEffect(() => {
    reset(currStudySet);
  }, [reset, currStudySet]);
  React.useEffect(() => {
    return () => {
      setCurrStudySet({ cards: watch('cards') });
    };
  }, []);

  const flipCards = () => {
    const flippedCards = watch('cards').map((card) => ({ ...card, term: card.definition, definition: card.term }));
    reset({ cards: flippedCards });
  };

  return (
    <>
      <div className={`sticky top-0 ${scrolled ? 'bg-white border-b border-b-gray-200' : ''}`}>
        <div className="p-4 flex items-center gap-2 max-w-3xl mx-auto">
          <h1 className="text-2xl font-medium">Cards</h1>
          <div className="ml-auto flex items-center gap-4">
            <Link
              href={{ pathname: router.pathname, query: currStudySet?.id && { id: router.query.id } }}
              legacyBehavior={false}
              title="Back"
              className="bg-white border border-gray-200 border-solid p-2 rounded-lg"
            >
              <ArrowLeftIcon />
            </Link>
            <button
              onClick={flipCards}
              title="Flip Cards"
              className="ml-auto bg-white border border-gray-200 border-solid p-2 rounded-lg"
            >
              <SwapVertIcon />
            </button>
            <button
              title="Add Card"
              onClick={() => append({ order: fields.length, term: '', definition: '' })}
              className="ml-auto bg-white border border-gray-200 border-solid p-2 rounded-lg"
            >
              <PlusIcon />
            </button>
          </div>
        </div>
      </div>

      <ul className="max-w-3xl mx-auto flex flex-col gap-4 p-4">
        {fields.map((content, i) => (
          <li key={content.id} className="flex gap-4 items-end">
            <div className="flex flex-col justify-center items-center gap-4">
              <p className="text-gray-600 text-sm">{i + 1}</p>
              <button title="Remove" onClick={() => remove(i)} className="bg-white border border-gray-200 border-solid p-2 rounded-lg">
                <MinusIcon />
              </button>
            </div>
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
          </li>
        ))}
      </ul>
    </>
  );
};

export default Cards;
