import type { AppProps } from 'next/app';
import { QueryClientProvider, Hydrate } from 'react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import { queryClient } from 'lib/queryClient';
import { AuthCheck } from 'modules/AuthCheck';
import { NextHead } from 'modules/NextHead';
import 'styles/style.scss';
import { Layout } from '@src/ui';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <NextHead />
        <Layout>
          <Component {...pageProps} />
        </Layout>
        <AuthCheck />
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
