import * as Primitive from '@radix-ui/react-dialog';
import { DetailedHTMLProps, ButtonHTMLAttributes } from 'react';

import { Button } from './Button';

interface DialogProps {
  defaultOpen?: boolean;
  open: boolean;
  setOpen: (value: boolean) => void;
  header: { title: React.ReactNode; left: React.ReactNode; right: React.ReactNode };
  children: React.ReactNode;
}

function Dialog({ defaultOpen, open, setOpen, header, children }: DialogProps) {
  return (
    <Primitive.Root open={open} onOpenChange={setOpen} defaultOpen={defaultOpen}>
      <Primitive.Portal>
        <Primitive.Overlay
          className={`z-50 bg-gray-800 bg-opacity-50 data-[state=open]:animate-fadeIn fixed inset-0 ${
            open ? 'animate-fadeIn' : 'animate-fadeOut'
          }`}
        />

        <Primitive.Content
          className={`${
            open ? 'animate-scaleIn' : 'animate-scaleOut'
          } z-50 data-[state=open]:animate-scaleIn fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-gray-50 shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none flex flex-col overflow-hidden`}
        >
          <div className="flex items-center border-b border-b-gray-200 bg-white p-4">
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
const DialogTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <Primitive.Title className="mx-auto text-lg">{children}</Primitive.Title>;
};

Dialog.Button = DialogButton;
Dialog.Title = DialogTitle;

export default Dialog;
