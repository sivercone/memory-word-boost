import { QueryClient } from 'react-query';
import { notify } from './notify';

export const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      onError: (e) => {
        if ('message' in (e as Error)) notify((e as Error).message);
      },
    },
    queries: {
      refetchOnWindowFocus: true,
      retry: false,
      staleTime: 60 * 1000 * 5,
      onError: (e) => {
        if ('message' in (e as Error)) notify((e as Error).message);
      },
    },
  },
});
