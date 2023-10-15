import React from 'react';
import Link from 'next/link';

interface ActionListProps<T> {
  data: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor: (item: T, index: number) => string;
  header?: { title: React.ReactNode; action?: React.ReactNode };
  footer?: string;
  placeholder?: React.ReactNode;
}

function ActionList<T>({ data, renderItem, keyExtractor, header, footer, placeholder }: ActionListProps<T>) {
  return (
    <div className="space-y-2">
      {header ? (
        <div className="flex justify-between items-center bg-transparent">
          <HeaderTitle>{header.title}</HeaderTitle>
          {header.action}
        </div>
      ) : null}
      {data.length ? (
        <>
          <div className={`rounded-lg bg-white border border-gray-200 overflow-hidden`}>
            {data.map((item, index) => (
              <div key={keyExtractor(item, index)} className="bg-transparent">
                {renderItem(item, index)}
              </div>
            ))}
          </div>
          {footer ? (
            <div className="px-2">
              <span className="text-xs">{footer}</span>
            </div>
          ) : null}
        </>
      ) : (
        <p className="text-gray-600">{placeholder}</p>
      )}
    </div>
  );
}

type Button = React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
  children: React.ReactNode;
  isFirst: boolean;
};
const ActionButton: React.FC<Button> = ({ children, isFirst = false, ...otherProps }) => {
  return (
    <>
      {!isFirst ? <div className="h-px bg-gray-200" /> : null}
      <button
        {...otherProps}
        className="flex space-x-4 items-center px-4 py-2 bg-transparent text-left w-full transition-colors hover:bg-gray-50 select-none focus-visible:bg-gray-50 focus-visible:shadow-none"
      >
        {children}
      </button>
    </>
  );
};

const ActionLink: React.FC<{ children: React.ReactNode; href: string; isFirst: boolean }> = ({
  children,
  href,
  isFirst = false,
  ...otherProps
}) => {
  return (
    <>
      {!isFirst ? <div className="h-px bg-gray-200" /> : null}
      <Link href={href} {...otherProps}>
        <a className="flex space-x-4 items-center px-4 py-2 bg-transparent text-left w-full transition-colors hover:bg-gray-50 select-none focus-visible:bg-gray-50 focus-visible:shadow-none">
          {children}
        </a>
      </Link>
    </>
  );
};

const HeaderLink: React.FC<any> = ({ children, ...otherProps }) => (
  <Link {...otherProps}>
    <a className="font-medium tracking-wider uppercase text-xs text-onBackgroundDim">{children}</a>
  </Link>
);

const HeaderButton: React.FC<any> = ({ children, ...otherProps }) => (
  <button {...otherProps} className="font-medium tracking-wider uppercase text-xs text-onBackgroundDim">
    {children}
  </button>
);

const HeaderTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
  return <h2 className={`text-xl font-medium text-gray-600 ${className}`}>{children}</h2>;
};

ActionList.Button = ActionButton;
ActionList.Link = ActionLink;
ActionList.HeaderLink = HeaderLink;
ActionList.HeaderButton = HeaderButton;
ActionList.HeaderTitle = HeaderTitle;

export default ActionList;
