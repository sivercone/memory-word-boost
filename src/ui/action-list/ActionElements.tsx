import clsx from 'clsx';
import Link, { LinkProps } from 'next/link';
import React from 'react';
import { twMerge } from 'tailwind-merge';

const actionElementCommonStyles = clsx(
  'flex items-center',
  'w-full space-x-4 px-4 py-2',
  'text-left',
  'bg-transparent select-none text-onSurface',
  'hover:bg-surfaceDim focus-visible:bg-surfaceDim focus-visible:shadow-none',
  'transition-colors',
);

export const HeaderTitle = ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
  return <h2 className={twMerge('text-xl font-medium text-onBackground', className)} {...props} />;
};

interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isFirst: boolean;
}

export const ActionButton = ({ isFirst = false, className, ...props }: ActionButtonProps) => {
  return (
    <>
      {!isFirst && <div className="h-px bg-outline" />}
      <button className={twMerge(actionElementCommonStyles, className)} {...props} />
    </>
  );
};

interface ActionLinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>, LinkProps {
  isFirst: boolean;
}

export const ActionLink = ({ isFirst = false, className, ...props }: ActionLinkProps) => {
  return (
    <>
      {!isFirst && <div className="h-px bg-outline" />}
      <Link className={twMerge(actionElementCommonStyles, className)} {...props} />
    </>
  );
};
