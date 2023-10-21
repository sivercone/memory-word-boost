import format from 'date-fns/format';

interface FormatDateProps {
  createdAt: string;
  pattern: 'dd MMMM yyyy' | 'dd MMM yyyy';
}

export const formatDate = ({ createdAt, pattern }: FormatDateProps) => {
  return format(new Date(createdAt), pattern);
};
