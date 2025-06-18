import clsx from 'clsx';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';

import { utils } from '@src/lib';
import { useScroll } from '@src/lib/hooks';
import { useRuntimeStore } from '@src/stores';
import * as Types from '@src/types';
import { Button, ButtonLink, Textarea, Icons, Banner } from '@src/ui';

const Cards: React.FC = () => {
  const router = useRouter();
  const { scrolled } = useScroll();
  const { studySetDraft, ...rtStore } = useRuntimeStore();
  const form = useForm<Pick<Types.SetModel, 'cards'>>();
  const fieldArray = useFieldArray({ name: 'cards', control: form.control });

  const [tipBannerShown, showTipBanner] = useState<boolean>(true);

  const flipCards = () => {
    const flippedCards = form.getValues('cards').map((card) => ({ ...card, front: card.back, back: card.front }));
    form.setValue('cards', flippedCards, { shouldDirty: true });
  };

  const handlePaste = (i: number, event: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const pastedData = event.clipboardData.getData('text');
    if (!pastedData.includes('\t')) return;

    event.preventDefault();
    const pastedRows = pastedData.split('\n');

    if (pastedRows.length > 0) {
      const [firstFront, firstBack] = pastedRows[0].split('\t');

      // Fill current card's front with the first column of the first row and back with the second column
      form.reset(
        (prev) => {
          const cardsCopy = [...prev.cards];
          cardsCopy[i].front = firstFront;
          cardsCopy[i].back = firstBack;
          return { cards: cardsCopy };
        },
        { keepDirty: true },
      );

      // For the remaining rows, append them as new cards
      const currentCards = form.getValues('cards');
      let nextOrder = Math.max(0, ...currentCards.map((c) => c.order ?? 0)) + 1;
      for (let j = 1; j < pastedRows.length; j++) {
        const [front, back] = pastedRows[j].split('\t');
        fieldArray.append({ order: nextOrder++, front, back });
      }
    }
  };

  useEffect(() => {
    if (studySetDraft.id) form.reset({ cards: studySetDraft.cards });
  }, [form.reset, studySetDraft]);

  useEffect(() => {
    return () => {
      if (form.formState.isDirty)
        rtStore.setValues({
          studySetDraft: {
            ...studySetDraft,
            cards: form
              .getValues('cards')
              .filter(({ front, back }) => utils.string.trimExtraSpaces(front) && utils.string.trimExtraSpaces(back)),
          },
        });
    };
  }, []);

  return (
    <>
      <div
        className={clsx(
          'sticky top-0 z-10',
          scrolled && 'border-b border-b-outline bg-surface',
          'transition-colors duration-500 ease-out',
        )}
      >
        <div className="mx-auto flex max-w-3xl items-center gap-2 p-4">
          <h1 className="text-2xl font-medium text-onSurface">Cards</h1>
          <div className="ml-auto flex items-center gap-4">
            <ButtonLink href={{ pathname: router.pathname, query: studySetDraft.id && { id: router.query.id } }} title="Back">
              <Icons.ArrowLeft />
            </ButtonLink>
            <Button onClick={flipCards} title="Flip Cards">
              <Icons.SwapVert />
            </Button>
            <Button onClick={() => fieldArray.append({ order: fieldArray.fields.length, front: '', back: '' })} title="Add Card">
              <Icons.Plus />
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl p-4">
        <Banner
          visible={tipBannerShown}
          close={() => showTipBanner(false)}
          title="Tip"
          body={
            <p>
              You can paste a 2-column table (e.g. from Excel or Google Sheets) into the <em>Front</em> input — all flashcard pairs
              will be added automatically.
            </p>
          }
          className="mb-8"
        />

        <ul className="flex flex-col gap-4">
          {fieldArray.fields.map((content, i) => (
            <li key={content.id} className="flex items-end gap-4">
              <div className="flex flex-col items-center justify-center gap-4">
                <p className="text-sm text-onBackground">{i + 1}</p>
                <Button onClick={() => fieldArray.remove(i)} title="Remove">
                  <Icons.Minus />
                </Button>
              </div>
              <div className="flex w-full flex-col rounded-lg border border-solid border-outline bg-surface text-onSurface">
                <Textarea
                  placeholder="Front"
                  {...form.register(`cards.${i}.front`, { required: true })}
                  className="rounded-t-lg p-2"
                  rows={1}
                  onPaste={(e) => handlePaste(i, e)}
                />
                <hr className="border-outline" />
                <Textarea
                  placeholder="Back"
                  {...form.register(`cards.${i}.back`, { required: true })}
                  className="rounded-b-lg p-2"
                  rows={1}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Cards;
