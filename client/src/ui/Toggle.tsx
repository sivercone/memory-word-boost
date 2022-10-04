import React from 'react';
import scss from 'styles/components/toggle.module.scss';

interface ToggleProps extends React.ComponentPropsWithoutRef<'input'> {
  label: string;
}

export const Toggle = React.forwardRef<HTMLInputElement, ToggleProps>(({ label, style, className, ...props }, ref) => {
  return (
    <label className={`${scss.toggle} ${className || ''}`} style={style}>
      <span>{label}</span>
      <input type="checkbox" ref={ref} {...props} />
    </label>
  );
});

Toggle.displayName = 'Toggle';
