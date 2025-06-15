import * as Dropdown from '@radix-ui/react-dropdown-menu';
import clsx from 'clsx';
import React from 'react';
import { twMerge } from 'tailwind-merge';

interface DropdownProps<T> {
  trigger: React.ReactNode;
  options: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor: (item: T, index: number) => string;
}

function DropdownMenu<T>({ trigger, options, renderItem, keyExtractor }: DropdownProps<T>) {
  if (!options.length) return null;

  return (
    <Dropdown.Root>
      <Dropdown.Trigger asChild>{trigger}</Dropdown.Trigger>

      <Dropdown.Portal>
        <Dropdown.Content
          className={clsx(
            'z-50 mx-2 min-w-[220px] p-2 lg:mx-auto',
            'rounded-md bg-surface text-onSurface',
            'data-[side=bottom]:animate-slideUpAndFade',
            'shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)]',
            'will-change-[opacity,transform]',
          )}
          sideOffset={5}
        >
          {options.map((item, index) => (
            <React.Fragment key={keyExtractor(item, index)}>{renderItem(item, index)}</React.Fragment>
          ))}
        </Dropdown.Content>
      </Dropdown.Portal>
    </Dropdown.Root>
  );
}

const DropdownItem = ({
  children,
  onClick,
  className,
  ...props
}: Dropdown.DropdownMenuItemProps & React.RefAttributes<HTMLDivElement>) => {
  return (
    <Dropdown.Item
      onClick={onClick}
      className={twMerge(
        'flex items-center gap-2 p-3',
        'rounded-md',
        'data-[disabled]:pointer-events-none data-[highlighted]:bg-surfaceDim',
        'cursor-pointer select-none outline-none',
        'data-[highlighted]:z-[1] data-[highlighted]:shadow-[0_0_0_2px] data-[highlighted]:shadow-primary-400',
        className,
      )}
      {...props}
    >
      {children}
    </Dropdown.Item>
  );
};

DropdownMenu.Item = DropdownItem;

export default DropdownMenu;
