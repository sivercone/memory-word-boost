import React from 'react';
import scss from 'styles/components/input.module.scss';

interface InputProps extends React.ComponentPropsWithoutRef<'input'> {
  label: string;
  isTextArea?: boolean;
  error?: string;
  customInput?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, isTextArea, error, customInput, style, className, ...props }, ref) => {
    return (
      <div className={`${scss.input} ${className || ''}`} style={style}>
        <label>
          {isTextArea || customInput ? <span>{label}</span> : undefined}
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {customInput ? (
            customInput
          ) : isTextArea ? (
            <textarea ref={ref as any} {...(props as any)} />
          ) : (
            <input ref={ref} {...props} placeholder={label} />
          )}
        </label>
        {error ? (
          <div>
            <span>{error}</span>
          </div>
        ) : undefined}
      </div>
    );
  },
);

Input.displayName = 'Input';
