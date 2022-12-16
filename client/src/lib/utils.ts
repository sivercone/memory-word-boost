import format from 'date-fns/format';
import { FolderInterface, FolderInterfaceDraft, SetInterface, SetInterfaceDraft } from 'interfaces';
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

const dummyUser = { id: 'unknown', name: 'user', email: 'you@domain.com', bio: '', avatar: '', createdAt: '', updatedAt: '' };
export const generateEntity = {
  set(payload: SetInterfaceDraft & Partial<SetInterface>): SetInterface {
    const obj = {
      ...payload,
      id: payload.id || Date.now().toString(),
      tags: (payload.tags as unknown as string).replace(/\s+/g, '').split(','),
      user: dummyUser,
      folders: payload.folders || [],
      createdAt: payload.createdAt || new Date(Date.now()).toISOString(),
      updatedAt: new Date(Date.now()).toISOString(),
    };
    return obj;
  },

  folder(payload: FolderInterfaceDraft & Partial<FolderInterface>): FolderInterface {
    const obj = {
      ...payload,
      id: payload.id || Date.now().toString(),
      sets: payload.sets || [],
      user: dummyUser,
      createdAt: payload.createdAt || new Date(Date.now()).toISOString(),
      updatedAt: new Date(Date.now()).toISOString(),
    };
    return obj;
  },
};
