import React from 'react';
import { NextPage } from 'next';
import { useForm } from 'react-hook-form';
import { dehydrate, QueryClient, useMutation, useQuery } from 'react-query';
import { authApi } from 'api/authApi';
import { UserInterface } from 'interfaces';
import Custom404 from 'pages/404';
import style from 'styles/pages/user.module.scss';

const SettingsPage: NextPage<{ pagekey: string }> = ({ pagekey }) => {
  const user = useQuery('user', () => authApi.me());
  const { register, handleSubmit, reset } = useForm<UserInterface>({ defaultValues: { ...user.data } });
  React.useEffect(() => {
    if (user.data) reset(user.data);
  }, [user.data, reset]);

  const callUpdate = useMutation(authApi.update);
  const onSubmit = async (payload: UserInterface) => {
    try {
      await callUpdate.mutateAsync(payload);
    } catch (error) {}
  };

  if (!user.data) return <Custom404 />;
  return (
    <div className="container">
      <div className={style.settings}>
        <header className={style.settings__header}>
          <span>Account Settings</span>
        </header>
        <form onSubmit={handleSubmit(onSubmit)} className={style.settings__form}>
          <label className="input">
            <span>Email</span>
            <input {...register('email')} required />
          </label>
          <label className="input">
            <span>Name</span>
            <input {...register('name')} required />
          </label>
          <label className="input">
            <span>Bio</span>
            <input {...register('bio')} />
          </label>
          <button type="submit" className="button button_dark">
            Save
          </button>
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
