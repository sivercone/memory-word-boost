import * as Dialog from '@radix-ui/react-dialog';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { useIsClient } from '@src/lib/hooks';
import { useLocalStore } from '@src/stores';
import { Spinner } from '@src/ui';

const AuthCheck: React.FC = () => {
  const router = useRouter();
  const localStore = useLocalStore();
  const isClient = useIsClient();
  const unauthenticated = !localStore.userId && router.pathname !== '/login';

  useEffect(() => {
    if (isClient && unauthenticated) router.replace('/login');
  }, [isClient]);

  return (
    <Dialog.Root open={unauthenticated}>
      <Dialog.Portal>
        <Dialog.Overlay
          asChild
          className={clsx(
            'absolute inset-0 z-50',
            'flex size-full items-center justify-center',
            'animate-fadeIn select-none bg-white outline-none',
          )}
        >
          <Dialog.Content role="status">
            <VisuallyHidden.Root>
              <Dialog.Title />
              <Dialog.Description />
            </VisuallyHidden.Root>
            <Spinner className="m-y-8 mx-auto h-8" />
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default AuthCheck;
