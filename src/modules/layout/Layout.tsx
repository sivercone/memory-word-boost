import Head from 'next/head';
import { useRouter } from 'next/router';

import { useInitiateDefaultData } from '@src/lib/hooks';

import Navigation from './Navigation';

const Layout = ({ children }: React.PropsWithChildren): React.ReactElement => {
  const { pathname } = useRouter();
  useInitiateDefaultData();

  if (pathname === '/login') return <>{children}</>;
  return (
    <>
      <Head>
        <meta name="theme-color" content="#ffffff" />
      </Head>
      <Navigation />
      {children}
    </>
  );
};
export default Layout;
