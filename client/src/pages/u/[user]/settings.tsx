import React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from 'react-query';
import { authApi } from 'apis/authApi';
import Custom404 from 'pages/404';
import { notify } from 'lib/notify';
import { Input } from 'ui/Input';
import { Button } from 'ui/Button';
import Header from 'ui/Header';
import { useUserStore } from 'storage/useUserStore';
import { UserInterface } from 'interfaces';
import style from 'styles/pages/user.module.scss';

const SettingsPage: NextPage = () => {
  const router = useRouter();
  const { signAccess } = useUserStore();
  const user = useQuery('user', () => authApi.me(signAccess));
  const { register, handleSubmit, reset } = useForm<UserInterface>({ defaultValues: { ...user.data } });
  React.useEffect(() => {
    if (user.data) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { signAccess, ...data } = user.data;
      reset(data);
    }
  }, [user.data]);

  const callUpdate = useMutation(authApi.update);
  const onSubmit = async (payload: UserInterface) => {
    try {
      await callUpdate.mutateAsync({ data: payload, token: signAccess });
      notify('Account settings saved');
    } catch (error) {
      notify('Failed to save account settings');
    }
  };

  if (!user.data) return <Custom404 />;
  return (
    <>
      <Header>
        <Button onClick={() => router.push(`/u/${user.data.id}`)} title="Close" variant="icon">
          <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="currentColor">
            <path d="M0 0h24v24H0V0z" fill="none" />
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
          </svg>
        </Button>
        <span>
          <strong>Account Settings</strong>
        </span>
        <button onClick={handleSubmit(onSubmit)}>Save</button>
      </Header>
      <div className="container">
        <form className={style.settings}>
          <Input label="Email" {...register('email', { required: true })} />
          <Input label="Name" {...register('name', { required: true })} />
          <Input label="Bio" {...register('bio', { required: true })} />
        </form>
      </div>
    </>
  );
};

// SettingsPage.getInitialProps = async ({ query }) => {
//   const pagekey = typeof query.user === 'string' ? query.user : '';
//   const queryClient = new QueryClient();
//   if (pagekey) await queryClient.prefetchQuery('user', () => authApi.me());
//   return { pagekey, dehydratedState: dehydrate(queryClient) };
// };

export default SettingsPage;
