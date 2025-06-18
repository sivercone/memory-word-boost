import { FALLBACK_ERROR_MESSAGE } from '../datus';
import notify from '../notify';

export function handleError(error: unknown): void {
  const extractErrorMessage = (error: unknown): string => {
    return (error as Error)?.message || FALLBACK_ERROR_MESSAGE;
  };

  console.error('Something went wrong:', error);
  notify(extractErrorMessage(error));
}
