import { NextPage } from 'next';
import { useForm } from 'react-hook-form';
import { ButtonSquare } from '@src/ui';
import { useMutation } from 'react-query';
import { authApi } from '@src/apis';
import { useRouter } from 'next/router';

const Login: NextPage = () => {
  const router = useRouter();
  const { register, handleSubmit } = useForm<{ email: string; password: string }>();
  const auth = useMutation(authApi.login, {
    onSuccess: () => {
      sessionStorage.setItem('logged', 'yes');
      router.replace('/');
    },
  });
  const onSubmit = async (data: { email: string; password: string }) => {
    try {
      await auth.mutateAsync(data);
    } catch (error) {
      console.log(error);
    }
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
          />
          <input
            type="password"
            placeholder="Password"
            {...register('password', { required: true })}
            className="border border-gray-200 border-solid p-2 rounded-lg bg-white"
          />
          <ButtonSquare disabled={auth.isLoading}>
            <span className="font-medium">{auth.isLoading ? 'Entering..' : 'Enter'}</span>
          </ButtonSquare>
        </form>
      </div>
    </div>
  );
};

export default Login;
