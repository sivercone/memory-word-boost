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

  const onSubmit = (data: Types.LoginForm) => {
    try {
      localStore.setValues({
        user: {
          id: crypto.randomUUID(),
          email: data.email,
          name: '',
          bio: '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      });
      router.replace('/');
    } catch (error) {
      utils.func.handleError(error);
    }
  };

  return (
    <div className="flex h-full flex-col-reverse lg:flex-row">
      <div className="hidden flex-1 lg:flex flex-col bg-primary-900 p-4 lg:px-8 lg:py-10 gap-4">
        <h1 className="flex gap-1 items-center select-none">
          <span
            className="text-xl font-semibold bg-gradient-to-br from-primary-500 to-white/90 box-decoration-slice bg-clip-text text-transparent"
            style={{ letterSpacing: '-0.9px', lineHeight: '0.8' }}
          >
            PROJECT MWB
          </span>
          <span className="bg-background text-xs font-medium rounded-lg px-1 text-onSurface" style={{ letterSpacing: '-0.8px' }}>
            Prototype
          </span>
        </h1>
        <p className="mt-auto text-white/90 leading-relaxed text-lg">Web app designed to catalyze the learning process.</p>
      </div>

      <div className="flex-1 p-4 lg:px-8 lg:py-10">
        <h1 className="lg:hidden flex gap-1 items-center select-none">
          <span
            className="text-xl font-semibold bg-gradient-to-br from-primary-500 to-[#111827] box-decoration-slice bg-clip-text text-transparent"
            style={{ letterSpacing: '-0.9px', lineHeight: '0.8' }}
          >
            PROJECT MWB
          </span>
          <span className="bg-background text-xs font-medium rounded-lg px-1 text-[#6b7280]" style={{ letterSpacing: '-0.8px' }}>
            Prototype
          </span>
        </h1>
        <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-lg mx-auto flex flex-col gap-4 justify-center h-full">
          <h2 className="font-medium text-2xl text-center text-onSurface">Log in or Sign up</h2>
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
          <p className="text-center text-onBackground text-xs">
            This application currently runs locally, and all data is stored in your browser&#39;s web storage. We do not store any
            credentials on our servers.
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
