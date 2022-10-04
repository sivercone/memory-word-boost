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
      <label className={`${scss.input} ${className || ''}`} style={style}>
        <span>{label}</span>
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {customInput ? customInput : isTextArea ? <textarea ref={ref as any} {...(props as any)} /> : <input ref={ref} {...props} />}
        {error ? (
          <div>
            <span>{error}</span>
          </div>
        ) : undefined}
      </label>
    );
  },
);

Input.displayName = 'Input';
