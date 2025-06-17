import * as Primitive from '@radix-ui/react-dialog';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import clsx from 'clsx';
import { DetailedHTMLProps, ButtonHTMLAttributes } from 'react';

import { Button } from './Button';

interface DialogProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultOpen?: boolean;
  open: boolean;
  close: () => void;
  header: { title: React.ReactNode; left: React.ReactNode; right: React.ReactNode };
}

function Dialog({ defaultOpen, open, close, header, children, className, ...props }: DialogProps) {
  return (
    <Primitive.Root open={open} defaultOpen={defaultOpen} modal>
      <Primitive.Portal>
        <Primitive.Overlay
          onClick={close}
          className={clsx(
            open ? 'animate-fadeIn' : 'animate-fadeOut',
            'fixed inset-0 z-50',
            'bg-overlay bg-opacity-50',
            'data-[state=open]:animate-fadeIn',
          )}
        />

        <Primitive.Content
          onEscapeKeyDown={close}
          className={clsx(
            open ? 'animate-scaleIn' : 'animate-scaleOut',
            'fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%]',
            'flex flex-col',
            'max-h-[85vh] w-[90vw] max-w-[450px]',
            'overflow-hidden rounded-[6px] bg-background focus:outline-none',
            'data-[state=open]:animate-scaleIn',
            'shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px]',
            className,
          )}
          {...props}
        >
          <VisuallyHidden.Root>
            {typeof header.title !== 'string' && <Primitive.Title />}
            <Primitive.Description />
          </VisuallyHidden.Root>
          <div className="flex items-center border-b border-b-outline bg-surface p-4 text-onSurface">
            {header.left}
            {typeof header.title === 'string' ? <Dialog.Title>{header.title}</Dialog.Title> : header.title}
            {header.right}
          </div>
          {children}
        </Primitive.Content>
      </Primitive.Portal>
    </Primitive.Root>
  );
}

const DialogButton: React.FC<DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>> = ({
  children,
  ...props
}) => {
  return (
    <Button {...props}>
      <span className="font-medium">{children}</span>
    </Button>
  );
};
const DialogTitle = ({ children }: React.PropsWithChildren) => {
  return <Primitive.Title className="mx-auto text-lg">{children}</Primitive.Title>;
};

Dialog.Button = DialogButton;
Dialog.Title = DialogTitle;

export default Dialog;
