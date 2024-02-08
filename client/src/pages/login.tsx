import { NextPage } from 'next';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { useMutation, useQueryClient } from 'react-query';
import { ButtonSquare } from '@src/ui';
import { authApi } from '@src/apis';
import { consts } from '@src/lib';

const Login: NextPage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { register, handleSubmit } = useForm<{ email: string; password: string }>();
  const auth = useMutation(authApi.login, {
    onSuccess: () => {
      sessionStorage.setItem('logged', 'yes');
      queryClient.invalidateQueries();
      router.replace('/');
    },
  });
  const onSubmit = async (data: { email: string; password: string }) => {
    await auth.mutateAsync(data).catch((error) => console.log(error));
  };

  return (
    <div className="flex h-full flex-col-reverse lg:flex-row">
      <div className="hidden flex-1 lg:flex flex-col bg-violet-900 p-4 lg:px-8 lg:py-10 gap-4">
        <h1 className="flex gap-1 items-center select-none">
          <span
            className="text-xl font-semibold bg-gradient-to-br from-violet-500 to-gray-50 box-decoration-slice bg-clip-text text-transparent"
            style={{ letterSpacing: '-0.9px', lineHeight: '0.8' }}
          >
            PROJECT MWB
          </span>
          <span className="bg-gray-100 text-xs font-medium rounded-lg px-1 text-gray-800" style={{ letterSpacing: '-0.8px' }}>
            Prototype
          </span>
        </h1>
        <p className="mt-auto text-gray-50 leading-relaxed text-lg">Web app designed to catalyze the learning process.</p>
      </div>

      <div className="flex-1 p-4 lg:px-8 lg:py-10">
        <h1 className="lg:hidden flex gap-1 items-center select-none">
          <span
            className="text-xl font-semibold bg-gradient-to-br from-violet-500 to-gray-900 box-decoration-slice bg-clip-text text-transparent"
            style={{ letterSpacing: '-0.9px', lineHeight: '0.8' }}
          >
            PROJECT MWB
          </span>
          <span className="bg-gray-100 text-xs font-medium rounded-lg px-1 text-gray-500" style={{ letterSpacing: '-0.8px' }}>
            Prototype
          </span>
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg mx-auto flex flex-col gap-4 justify-center h-full">
          <h2 className="font-medium text-2xl text-center">Log in or Sign up</h2>
          <input
            type="email"
            placeholder="Email"
            {...register('email', { required: true })}
            className="border border-gray-200 border-solid p-2 rounded-lg bg-white"
            data-testid="input.email"
          />
          <input
            type="password"
            placeholder="Password"
            {...register('password', { required: true })}
            className="border border-gray-200 border-solid p-2 rounded-lg bg-white"
            data-testid="input.password"
          />
          <ButtonSquare disabled={auth.isLoading} data-testid="button.submit">
            <span className="font-medium">{auth.isLoading ? 'Entering..' : 'Enter'}</span>
          </ButtonSquare>
          {consts.isBackendLess && (
            <p className="text-center text-gray-600 text-xs">
              This application currently runs locally, and all data is stored in your browser&#39;s local storage. We do not store any
              credentials on our servers.
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
