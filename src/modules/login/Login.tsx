import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';

import { utils } from '@src/lib';
import { useLocalStore } from '@src/stores';
import * as Types from '@src/types';
import { Button, Input } from '@src/ui';

const Login: NextPage = () => {
  const router = useRouter();
  const form = useForm<Types.LoginForm>();
  const localStore = useLocalStore();

  const onSubmit = (formData: Types.LoginForm) => {
    try {
      localStore.setValues((prev) => {
        const res = utils.array.upsertUser({ users: prev.users, data: formData, allowCreate: true });
        return { ...prev, userId: res.userId, users: res.users } satisfies Parameters<typeof localStore.setValues>[0];
      });
      router.replace('/');
    } catch (error) {
      utils.func.handleError(error);
    }
  };

  return (
    <div className="flex h-full flex-col-reverse lg:flex-row">
      <div className="hidden flex-1 flex-col gap-4 bg-primary-900 p-4 lg:flex lg:px-8 lg:py-10">
        <h1 className="flex select-none items-center gap-1">
          <span
            className="bg-gradient-to-br from-primary-500 to-white/90 box-decoration-slice bg-clip-text text-xl font-semibold text-transparent"
            style={{ letterSpacing: '-0.9px', lineHeight: '0.8' }}
          >
            PROJECT MWB
          </span>
          <span className="rounded-lg bg-background px-1 text-xs font-medium text-onSurface" style={{ letterSpacing: '-0.8px' }}>
            Prototype
          </span>
        </h1>
        <p className="mt-auto text-lg leading-relaxed text-white/90">Web app designed to catalyze the learning process.</p>
      </div>

      <div className="flex-1 p-4 lg:px-8 lg:py-10">
        <h1 className="flex select-none items-center gap-1 lg:hidden">
          <span
            className="bg-gradient-to-br from-primary-500 to-[#111827] box-decoration-slice bg-clip-text text-xl font-semibold text-transparent"
            style={{ letterSpacing: '-0.9px', lineHeight: '0.8' }}
          >
            PROJECT MWB
          </span>
          <span className="rounded-lg bg-background px-1 text-xs font-medium text-[#6b7280]" style={{ letterSpacing: '-0.8px' }}>
            Prototype
          </span>
        </h1>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mx-auto flex h-full max-w-lg flex-col justify-center gap-4">
          <h2 className="text-center text-2xl font-medium text-onSurface">Log in or Sign up</h2>
          <Input type="email" placeholder="Email" {...form.register('email', { required: true })} data-testid="input.email" />
          <Input
            type="password"
            placeholder="Password"
            {...form.register('password', { required: true })}
            data-testid="input.password"
          />
          <Button type="submit" data-testid="button.submit">
            <span className="font-medium">Enter</span>
          </Button>
          <p className="text-center text-xs text-onBackground">
            This application currently runs locally, and all data is stored in your browser&#39;s web storage. We do not store any
            credentials on our servers.
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
