import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Toaster } from 'sonner';

import AuthCheck from '@src/modules/auth-check';
import Layout from '@src/modules/layout';
import { Icons } from '@src/ui';

import '@src/style.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Project MWB</title>
        <meta name="description" content="Web app designed to catalyze the learning process." />
        <meta name="robots" content="index, follow" />
      </Head>
      <AuthCheck />
      <Layout>
        <Component {...pageProps} />
      </Layout>
      <Toaster
        className="font-sans"
        toastOptions={{ classNames: { title: 'text-base', closeButton: 'drop-shadow' } }}
        icons={{ close: <Icons.Close /> }}
        visibleToasts={8}
        closeButton
      />
    </>
  );
}

export default MyApp;
