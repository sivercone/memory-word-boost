import { twMerge } from 'tailwind-merge';

import { Button } from './Button';
import Icons from './Icons';

interface Props {
  title: string;
  body: React.ReactNode;
  close?: () => void;
  visible?: boolean;
  className?: string;
}

const Banner: React.FC<Props> = ({ title, body, close, visible = true, className }) => {
  if (!visible) return null;
  return (
    <div className={twMerge('flex flex-col gap-2.5 rounded-lg border border-solid border-outline bg-surface px-4 py-2.5', className)}>
      <div className="flex items-center justify-between gap-4">
        <h3 className="font-medium text-onSurface">{title}</h3>
        <Button onClick={close} shape="pill">
          <Icons.Close size={16} className="fill-onBackground" />
        </Button>
      </div>
      <div className="text-pretty fill-onBackground">{body}</div>
    </div>
  );
};

export default Banner;
