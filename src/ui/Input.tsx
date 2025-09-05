import { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, placeholder, 'aria-label': ariaLabel, required, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={twMerge(
          'p-2',
          'bg-surface text-onSurface',
          'rounded-lg border border-solid border-outline',
          'read-only:bg-background read-only:text-onBackground',
          'disabled:bg-background disabled:text-onBackground',
          className,
        )}
        aria-label={ariaLabel || placeholder}
        aria-required={required}
        placeholder={placeholder}
        required={required}
        {...props}
      />
    );
  },
);

Input.displayName = 'Input';

export default Input;
