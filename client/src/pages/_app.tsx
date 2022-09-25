import 'styles/globals.scss';
import Head from 'next/head';
import type { AppProps } from 'next/app';
import { QueryClientProvider, Hydrate } from 'react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import { queryClient } from 'utils/queryClient';
import { AuthCheck } from 'components/AuthCheck';
import BottomNavigation from 'ui/BottomNavigation';
import Header from 'ui/Header';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <Head>
          <title>PROJ MWB</title>
        </Head>
        <Header />
        <Component {...pageProps} />
        <AuthCheck />
        <BottomNavigation />
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
