import format from 'date-fns/format';

interface Props {
  createdAt: string;
  pattern: 'dd MMMM yyyy' | 'dd MMM yyyy';
}

export const formatDate = ({ createdAt, pattern }: Props) => {
  return format(new Date(createdAt), pattern);
};
