import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';

import { useScroll } from '@src/lib/hooks';
import { useRuntimeStore } from '@src/stores';
import * as Types from '@src/types';
import { Button, ButtonLink, Textarea, Icons } from '@src/ui';

const Cards: React.FC = () => {
  const { scrolled } = useScroll();
  const router = useRouter();
  const { studySetDraft, ...rtStore } = useRuntimeStore();
  const form = useForm<Pick<Types.SetModel, 'cards'>>();
  const { fields, append, remove } = useFieldArray({ name: 'cards', control: form.control });

  useEffect(() => form.reset(studySetDraft), [form.reset, studySetDraft]);

  useEffect(() => {
    return () => rtStore.setValues({ studySetDraft: { ...studySetDraft, cards: form.watch('cards') } });
  }, []);

  const flipCards = () => {
    const flippedCards = form.watch('cards').map((card) => ({ ...card, front: card.back, back: card.front }));
    form.reset({ cards: flippedCards });
  };

  /**
   * Handles the paste event for the 'Front' textarea.
   *
   * This function checks if the pasted data is from a two-column table format,
   * where the first column represents the front of the card, and the second column
   * represents the back. If so, it populates the cards accordingly:
   * - The current card will be filled with the first row's data.
   * - Any subsequent rows in the pasted data will result in new cards being appended.
   *
   * If the pasted data is not from a two-column table, the function falls back to the
   * default paste behavior.
   *
   * @param {number} i - The index of the current card in the cards list.
   * @param {React.ClipboardEvent<HTMLTextAreaElement>} event - The clipboard paste event.
   */
  const handlePaste = (i: number, event: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const pastedData = event.clipboardData.getData('text');
    if (!pastedData.includes('\t')) {
      // If the pasted data doesn't contain a tab, it's not from a two-column table.
      // So, allow the default behavior for the textarea.
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
        append({ order: fields.length + j, front, back });
      }
    }
  };

  return (
    <>
      <div className={`sticky z-10 top-0 ${scrolled ? 'bg-white border-b border-b-gray-200' : ''}`}>
        <div className="p-4 flex items-center gap-2 max-w-3xl mx-auto">
          <h1 className="text-2xl font-medium">Cards</h1>
          <div className="ml-auto flex items-center gap-4">
            <ButtonLink href={{ pathname: router.pathname, query: studySetDraft.id && { id: router.query.id } }} title="Back">
              <Icons.ArrowLeft />
            </ButtonLink>
            <Button onClick={flipCards} title="Flip Cards">
              <Icons.SwapVert />
            </Button>
            <Button onClick={() => append({ order: fields.length, front: '', back: '' })} title="Add Card">
              <Icons.Plus />
            </Button>
          </div>
        </div>
      </div>

      <ul className="max-w-3xl mx-auto flex flex-col gap-4 p-4">
        {fields.map((content, i) => (
          <li key={content.id} className="flex gap-4 items-end">
            <div className="flex flex-col justify-center items-center gap-4">
              <p className="text-gray-600 text-sm">{i + 1}</p>
              <Button onClick={() => remove(i)} title="Remove">
                <Icons.Minus />
              </Button>
            </div>
            <div className="flex flex-col border border-gray-200 border-solid rounded-lg bg-white w-full">
              <Textarea
                placeholder="Front (Tip: You can paste 2-column table data here!)"
                {...form.register(`cards.${i}.front`, { required: true })}
                className="p-2 rounded-t-lg"
                rows={1}
                onPaste={(e) => handlePaste(i, e)}
              />
              <hr className="border-gray-200" />
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
    </>
  );
};

export default Cards;
