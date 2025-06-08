import type { AppProps } from 'next/app';
import Router from 'next/router';
import NProgress from 'nprogress';
import { ToastContainer } from 'react-toastify';

import { NextHead } from '@src/lib';
import AuthCheck from '@src/modules/auth-check';
import Layout from '@src/modules/layout';

import '@src/style.css';
import 'nprogress/nprogress.css';
import 'react-toastify/dist/ReactToastify.min.css';

NProgress.configure({ showSpinner: false });
Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <NextHead />
      <AuthCheck />
      <Layout>
        <Component {...pageProps} />
      </Layout>
      <ToastContainer
        progressStyle={{ background: 'var(--color-primary-600)' }}
        position="bottom-right"
        autoClose={6000}
        draggable={false}
      />
    </>
  );
}
export default MyApp;
