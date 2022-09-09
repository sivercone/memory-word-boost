import React from 'react';
import { NextPage } from 'next';
import { useForm } from 'react-hook-form';
import { dehydrate, QueryClient, useMutation, useQuery } from 'react-query';
import { authApi } from 'api/authApi';
import { UserInterface } from 'interfaces';
import Custom404 from 'pages/404';
import style from 'styles/pages/user.module.scss';
import { notify } from 'utils/notify';
import { Input } from 'ui/Input';
import { Button } from 'ui/Button';

const SettingsPage: NextPage = () => {
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
    <div className="container">
      <div className={style.settings}>
        <header className={style.settings__header}>
          <span>Account Settings</span>
        </header>
        <form onSubmit={handleSubmit(onSubmit)} className={style.settings__form}>
          <Input label="Email" {...register('email')} required />
          <Input label="Name" {...register('name')} required />
          <Input label="Bio" {...register('bio')} required />
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button type="submit" variant="outlined">
              Save
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

SettingsPage.getInitialProps = async ({ query }) => {
  const pagekey = typeof query.user === 'string' ? query.user : '';
  const queryClient = new QueryClient();
  if (pagekey) await queryClient.prefetchQuery('user', () => authApi.me());
  return { pagekey, dehydratedState: dehydrate(queryClient) };
};

export default SettingsPage;
