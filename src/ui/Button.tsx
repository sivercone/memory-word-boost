import clsx from 'clsx';
import Link, { LinkProps } from 'next/link';
import { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

type ButtonVariant = 'elevated' | 'filled' | 'tonal' | 'outlined';
type AlignVariant = 'start' | 'center';
type ShapeVariant = 'square' | 'pill';

function getButtonClasses(variant: ButtonVariant, align: AlignVariant, shape: ShapeVariant, className?: string) {
  return twMerge(
    clsx(
      // Base classes shared by all buttons/links
      'flex',
      'font-medium',
      'transition-colors hover:bg-surfaceDim select-none',
      'disabled:cursor-default disabled:hover:bg-white',

      // Variant-specific classes
      {
        elevated: '',
        filled: 'bg-surface text-onSurface border border-outline border-solid shadow-sm',
        tonal: '',
        outlined: '',
      }[variant],

      {
        start: 'text-left',
        center: 'justify-center text-center',
      }[align],

      {
        square: 'items-center p-2 rounded-lg',
        pill: 'size-[32px] rounded-full py-2 items-center relative',
      }[shape],

      // Merge any className passed in
      className,
    ),
  );
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  align?: AlignVariant;
  shape?: ShapeVariant;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'filled', align = 'center', shape = 'square', className, ...rest }, ref) => {
    return <button ref={ref} className={getButtonClasses(variant, align, shape, className)} type="button" {...rest} />;
  },
);

Button.displayName = 'Button';

interface ButtonLinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>, LinkProps {
  variant?: ButtonVariant;
  align?: AlignVariant;
  shape?: ShapeVariant;
}

export const ButtonLink = ({ variant = 'filled', align = 'center', shape = 'square', href, className, ...rest }: ButtonLinkProps) => {
  const isExternal = typeof href === 'string' && (/^https?:\/\//.test(href) || href.startsWith('mailto:'));
  const classes = getButtonClasses(variant, align, shape, className);

  if (isExternal) {
    return <a href={href} className={classes} rel={rest.target === '_blank' ? 'noreferrer noopener' : rest.rel} {...rest} />;
  } else {
    return <Link href={href} className={classes} {...rest} />;
  }
};
