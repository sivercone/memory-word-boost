import format from 'date-fns/format';
import { notify } from './notify';

interface FormatDateProps {
  createdAt: string;
  pattern: 'dd MMMM yyyy' | 'dd MMM yyyy';
}

// @todo - check behaviour for special characters in sim apps (`ʼ;)
export const isAnswerCorrect = (term: string, answer: string): boolean => {
  const t = term
    .toLowerCase()
    .replace(/^\s+|\s+$/g, '')
    .replace(/\s+/g, ' ');

  const a = answer
    .toLowerCase()
    .replace(/^\s+|\s+$/g, '')
    .replace(/\s+/g, ' ');

  return t === a;
};

export const shareValue = async (payload: string) => {
  let canShare = true;
  try {
    await navigator.share({ url: payload });
  } catch (error) {
    canShare = false;
  }
  if (!canShare) {
    try {
      await navigator.clipboard.writeText(payload);
      notify('Link copied to clipboard');
    } catch (error) {}
  }
};

export const fontSizeBasedOnLength = (length: number) => {
  if (length > 100) return '1.25rem';
  else return '1.5rem';
};

export const formatDate = ({ createdAt, pattern }: FormatDateProps) => {
  return format(new Date(createdAt), pattern);
};
