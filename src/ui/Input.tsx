import { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={twMerge(
        'p-2',
        'bg-surface text-onSurface',
        'rounded-lg border border-solid border-outline',
        'read-only:bg-background read-only:text-onBackground',
        className,
      )}
      {...props}
    />
  );
});

Input.displayName = 'Input';

export default Input;
