import type { AppProps } from 'next/app';
import { Toaster } from 'sonner';

import { NextHead } from '@src/lib';
import AuthCheck from '@src/modules/auth-check';
import Layout from '@src/modules/layout';
import { Icons } from '@src/ui';

import '@src/style.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <NextHead />
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
