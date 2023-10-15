import React from 'react';
import * as Dropdown from '@radix-ui/react-dropdown-menu';

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
          className={`data-[side=bottom]:animate-slideUpAndFade min-w-[220px] bg-white rounded-md p-2 shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform]`}
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

const DropdownItem: React.FC<{ children: React.ReactNode; onClick?: React.MouseEventHandler<HTMLDivElement> }> = ({
  children,
  onClick,
}) => {
  return (
    <Dropdown.Item
      onClick={onClick}
      className="flex gap-2 items-center p-3 cursor-pointer select-none outline-none data-[highlighted]:bg-gray-50 rounded-md data-[disabled]:pointer-events-none"
    >
      {children}
    </Dropdown.Item>
  );
};

DropdownMenu.Item = DropdownItem;

export default DropdownMenu;
