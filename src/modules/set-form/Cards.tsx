import clsx from 'clsx';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';

import { useScroll } from '@src/lib/hooks';
import { useRuntimeStore } from '@src/stores';
import * as Types from '@src/types';
import { Button, ButtonLink, Textarea, Icons, Banner } from '@src/ui';

const Cards: React.FC = () => {
  const { scrolled } = useScroll();
  const router = useRouter();
  const { studySetDraft, ...rtStore } = useRuntimeStore();
  const form = useForm<Pick<Types.SetModel, 'cards'>>();
  const fieldArray = useFieldArray({ name: 'cards', control: form.control });

  const [tipBannerShown, showTipBanner] = useState<boolean>(true);

  const flipCards = () => {
    const flippedCards = form.watch('cards').map((card) => ({ ...card, front: card.back, back: card.front }));
    form.reset({ cards: flippedCards });
  };

  /**
   * Handles pasting a 2-column table into the 'Front' input.
   *
   * Populates the current card with the first row,
   * and appends new cards for the remaining rows.
   * Falls back to default behavior if data isn't tab-separated.
   *
   * @param i - Index of the current card.
   * @param event - Clipboard paste event.
   */
  const handlePaste = (i: number, event: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const pastedData = event.clipboardData.getData('text');
    if (!pastedData.includes('\t')) {
      return;
    }

    event.preventDefault();
    const pastedRows = pastedData.split('\n');

    if (pastedRows.length > 0) {
      const [firstFront, firstBack] = pastedRows[0].split('\t');

      // Fill current card's front with the first column of the first row and back with the second column
      form.reset((prev) => {
        const cardsCopy = [...prev.cards];
        cardsCopy[i].front = firstFront;
        cardsCopy[i].back = firstBack;
        return { cards: cardsCopy };
      });

      // For the remaining rows, append them as new cards
      for (let j = 1; j < pastedRows.length; j++) {
        const [front, back] = pastedRows[j].split('\t');
        fieldArray.append({ order: fieldArray.fields.length + j, front, back });
      }
    }
  };

  useEffect(() => form.reset(studySetDraft), [form.reset, studySetDraft]);
  useEffect(() => {
    return () => rtStore.setValues({ studySetDraft: { ...studySetDraft, cards: form.watch('cards') } });
  }, []);

  return (
    <>
      <div className={clsx('sticky z-10 top-0', scrolled && 'bg-surface border-b border-b-outline')}>
        <div className="p-4 flex items-center gap-2 max-w-3xl mx-auto">
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

      <div className="max-w-3xl mx-auto p-4">
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
            <li key={content.id} className="flex gap-4 items-end">
              <div className="flex flex-col justify-center items-center gap-4">
                <p className="text-onBackground text-sm">{i + 1}</p>
                <Button onClick={() => fieldArray.remove(i)} title="Remove">
                  <Icons.Minus />
                </Button>
              </div>
              <div className="flex flex-col border border-outline border-solid rounded-lg bg-surface w-full">
                <Textarea
                  placeholder="Front"
                  {...form.register(`cards.${i}.front`, { required: true })}
                  className="p-2 rounded-t-lg"
                  rows={1}
                  onPaste={(e) => handlePaste(i, e)}
                />
                <hr className="border-outline" />
                <Textarea
                  placeholder="Back"
                  {...form.register(`cards.${i}.back`, { required: true })}
                  className="p-2 rounded-b-lg"
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
