import type { AppProps } from 'next/app';
import { QueryClientProvider, Hydrate } from 'react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import { queryClient } from '@src/lib/queryClient';
import { AuthCheck } from '@src/modules/AuthCheck';
import { NextHead } from '@src/modules/NextHead';
import { Layout } from '@src/ui';
import '@src/style.css';

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
