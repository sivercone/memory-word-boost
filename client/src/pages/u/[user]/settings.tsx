import React from 'react';
import { NextPage } from 'next';
import { useForm } from 'react-hook-form';
import { dehydrate, QueryClient, useMutation, useQuery } from 'react-query';
import { authApi } from 'apis/authApi';
import { UserInterface } from 'interfaces';
import Custom404 from 'pages/404';
import style from 'styles/pages/user.module.scss';
import { notify } from 'utils/notify';
import { Input } from 'ui/Input';
import { Button } from 'ui/Button';
import { useRouter } from 'next/router';

const SettingsPage: NextPage = () => {
  const router = useRouter();
  const user = useQuery('user', () => authApi.me());
  const { register, handleSubmit, reset } = useForm<UserInterface>({ defaultValues: { ...user.data } });
  React.useEffect(() => {
    if (user.data) reset(user.data);
  }, [user.data, reset]);

  const callUpdate = useMutation(authApi.update);
  const onSubmit = async (payload: UserInterface) => {
    try {
      await callUpdate.mutateAsync(payload);
      notify('Account settings saved');
    } catch (error) {
      notify('Failed to save account settings');
    }
  };

  if (!user.data) return <Custom404 />;
  return (
    <>
      <header className={style.header}>
        <div className={style.header__inner}>
          <div>
            <Button onClick={() => router.push(`/u/${user.data.id}`)} title="close" variant="icon">
              <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="currentColor">
                <path d="M0 0h24v24H0V0z" fill="none" />
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
              </svg>
            </Button>
            <p>Account Settings</p>
          </div>
          <button onClick={handleSubmit(onSubmit)}>Save</button>
        </div>
      </header>
      <div className="container">
        <form className={style.settings}>
          <Input label="Email" {...register('email')} required />
          <Input label="Name" {...register('name')} required />
          <Input label="Bio" {...register('bio')} required />
        </form>
      </div>
    </>
  );
};

SettingsPage.getInitialProps = async ({ query }) => {
  const pagekey = typeof query.user === 'string' ? query.user : '';
  const queryClient = new QueryClient();
  if (pagekey) await queryClient.prefetchQuery('user', () => authApi.me());
  return { pagekey, dehydratedState: dehydrate(queryClient) };
};

export default SettingsPage;
