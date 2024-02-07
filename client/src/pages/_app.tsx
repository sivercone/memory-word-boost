import type { AppProps } from 'next/app';
import { QueryClientProvider, Hydrate } from 'react-query';
import Router from 'next/router';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { queryClient } from '@src/lib';
import { AuthCheck } from '@src/modules/AuthCheck';
import { NextHead } from '@src/modules/NextHead';
import { Layout } from '@src/ui';
import '@src/style.css';

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <NextHead />
        <AuthCheck />
        <Layout>
          <Component {...pageProps} />
        </Layout>
        <ToastContainer
          progressStyle={{ background: 'var(--color-primary)' }}
          position="bottom-right"
          autoClose={6000}
          draggable={false}
        />
      </Hydrate>
    </QueryClientProvider>
  );
}
export default MyApp;
