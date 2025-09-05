import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';

import { upsertUser } from '@src/lib/utils/array';
import { handleError } from '@src/lib/utils/func';
import { useLocalStore } from '@src/stores';
import * as Types from '@src/types';
import { Button, Input, Logo } from '@src/ui';

const Login: NextPage = () => {
  const router = useRouter();
  const form = useForm<Types.LoginForm>();
  const localStore = useLocalStore();

  const onSubmit = (formData: Types.LoginForm) => {
    try {
      localStore.setValues((prev) => {
        const res = upsertUser({ users: prev.users, data: formData, allowCreate: true });
        return { ...prev, userId: res.userId, users: res.users } satisfies Parameters<typeof localStore.setValues>[0];
      });
      router.replace('/');
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <div className="flex h-full flex-col-reverse lg:flex-row">
      <div className="hidden flex-1 flex-col gap-4 bg-primary-900 p-4 lg:flex lg:px-8 lg:py-10">
        <Logo as="h1" variant="light" size="xl" />
        <p className="mt-auto text-lg leading-relaxed text-white/90">Web app designed to catalyze the learning process.</p>
      </div>

      <div className="flex-1 p-4 lg:px-8 lg:py-10">
        <Logo as="h1" variant="dark" size="xl" className="lg:hidden" />
        <form onSubmit={form.handleSubmit(onSubmit)} className="mx-auto flex h-full max-w-lg flex-col justify-center gap-4">
          <h2 className="text-center text-2xl font-medium text-onSurface">Log in or Sign up</h2>
          <Input
            type="email"
            placeholder="Email"
            {...form.register('email', { required: true })}
            autoComplete="email"
            data-testid="input-email"
          />
          <Input
            type="password"
            placeholder="Password"
            {...form.register('password', { required: true })}
            autoComplete="current-password"
            data-testid="input-password"
          />
          <Button type="submit" data-testid="button-submit">
            <span className="font-medium">Enter</span>
          </Button>
          <button
            onClick={() => onSubmit({ email: 'guest@sivercone.com', password: '1234' })}
            className="w-fit self-center font-medium text-primary-800 underline-offset-2 hover:underline"
            data-testid="button-continue-as-guest"
          >
            Continue as Guest
          </button>
          <p className="text-balance text-center text-xs text-onBackground">
            This application currently runs locally, and all data is stored in your browser&#39;s web storage. We do not store any
            credentials on our servers.
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
