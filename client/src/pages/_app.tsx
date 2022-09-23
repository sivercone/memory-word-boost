import 'styles/globals.scss';
import Head from 'next/head';
import type { AppProps } from 'next/app';
import { QueryClientProvider, Hydrate } from 'react-query';
import { AnimatePresence } from 'framer-motion';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import { PageTransition } from 'components/PageTransition';
import { queryClient } from 'utils/queryClient';
import { AuthCheck } from 'components/AuthCheck';
import BottomNavigation from 'ui/BottomNavigation';
import Header from 'ui/Header';

function MyApp({ Component, pageProps, router }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <Head>
          <title>MWB</title>
          <link rel="manifest" href="/manifest.json" />
        </Head>
        <Header />
        <AnimatePresence mode="wait">
          <PageTransition key={router.route}>
            <Component {...pageProps} />
            <AuthCheck />
          </PageTransition>
        </AnimatePresence>
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
