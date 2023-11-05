import { DetailedHTMLProps, ButtonHTMLAttributes } from 'react';
import * as DialogRX from '@radix-ui/react-dialog';
import { ButtonSquare } from './Buttons';

interface DialogProps {
  defaultOpen?: boolean;
  open: boolean;
  setOpen: (value: boolean) => void;
  header: { title: React.ReactNode; left: React.ReactNode; right: React.ReactNode };
  children: React.ReactNode;
}

function Dialog({ defaultOpen, open, setOpen, header, children }: DialogProps) {
  return (
    <DialogRX.Root open={open} onOpenChange={setOpen} defaultOpen={defaultOpen}>
      <DialogRX.Portal>
        <DialogRX.Overlay
          className={`z-50 bg-gray-800 bg-opacity-50 data-[state=open]:animate-fadeIn fixed inset-0 ${
            open ? 'animate-fadeIn' : 'animate-fadeOut'
          }`}
        />

        <DialogRX.Content
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
        </DialogRX.Content>
      </DialogRX.Portal>
    </DialogRX.Root>
  );
}

const DialogButton: React.FC<DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>> = ({
  children,
  ...props
}) => {
  return (
    // eslint-disable-next-line
    // @ts-ignore -- types don't play a big role here
    <ButtonSquare {...props}>
      <span className="font-medium">{children}</span>
    </ButtonSquare>
  );
};
const DialogTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <DialogRX.Title className="mx-auto text-lg">{children}</DialogRX.Title>;
};

Dialog.Button = DialogButton;
Dialog.Title = DialogTitle;

export default Dialog;
