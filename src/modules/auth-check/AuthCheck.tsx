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
  const unauthenticated = !localStore.user && router.pathname !== '/login';

  useEffect(() => {
    if (isClient && unauthenticated) router.replace('/login');
  }, [isClient]);

  return (
    <Dialog.Root open={unauthenticated}>
      <Dialog.Portal>
        <Dialog.Overlay
          asChild
          className={clsx(
            'z-50 absolute inset-0',
            'size-full flex items-center justify-center',
            'animate-fadeIn bg-white select-none outline-none',
          )}
        >
          <Dialog.Content role="status">
            <VisuallyHidden.Root>
              <Dialog.Title />
              <Dialog.Description />
            </VisuallyHidden.Root>
            <Spinner className="mx-auto m-y-8 h-8" />
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default AuthCheck;
