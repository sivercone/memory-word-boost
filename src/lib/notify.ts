import { ExternalToast, toast } from 'sonner';

const notify = (message: string, options?: ExternalToast) =>
  toast(message, {
    position: 'bottom-right',
    duration: 6000,
    ...options,
  });

export default notify;
