import 'styles/globals.scss';
import Head from 'next/head';
import type { AppProps } from 'next/app';
import { QueryClientProvider, Hydrate } from 'react-query';
import { AnimatePresence } from 'framer-motion';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import { Header } from 'components/Header';
import { PageTransition } from 'components/PageTransition';
import { queryClient } from 'utils/queryClient';

function MyApp({ Component, pageProps, router }: AppProps) {
   return (
      <QueryClientProvider client={queryClient}>
         <Hydrate state={pageProps.dehydratedState}>
            <Head>
               <title>MWB</title>
            </Head>
            {true ? <Header /> : undefined}
            <AnimatePresence exitBeforeEnter>
               <PageTransition key={router.route}>
                  <Component {...pageProps} />
               </PageTransition>
            </AnimatePresence>
            <ToastContainer
               progressStyle={{ background: 'var(--yellow)' }}
               position="bottom-right"
               autoClose={6000}
               draggable={false}
            />
         </Hydrate>
      </QueryClientProvider>
   );
}
export default MyApp;
