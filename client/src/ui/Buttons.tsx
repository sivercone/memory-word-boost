import Link from 'next/link';
import { UrlObject } from 'url';
import { forwardRef, ButtonHTMLAttributes, DetailedHTMLProps } from 'react';

type ButtonProps = DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
  href?: UrlObject | string;
  // loading?: boolean;
};

const commonStyles = 'transition-colors hover:bg-gray-50';

export const ButtonSquare = forwardRef<HTMLButtonElement, ButtonProps>(({ children, className, href, ...props }, ref) => {
  const baseClasses = `flex justify-center items-center text-center bg-white border border-gray-200 border-solid p-2 rounded-lg ${commonStyles} ${className}`;

  if (href) {
    return (
      <>
        {/* eslint-disable-next-line*/}
        {/* @ts-ignore */} {/* types doesn't matter here */}
        <Link href={href} legacyBehavior={false} className={baseClasses} {...props}>
          {children}
        </Link>
      </>
    );
  }

  return (
    <button ref={ref} className={baseClasses} {...props}>
      {children}
    </button>
  );
});

export const ButtonCircle = forwardRef<HTMLButtonElement, ButtonProps>(({ children, className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={`relative bg-white w-[32px] h-[32px] rounded-full border border-gray-200 py-2 border-solid items-center justify-center flex ${commonStyles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
});
