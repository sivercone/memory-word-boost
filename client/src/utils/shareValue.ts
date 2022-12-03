import { notify } from './notify';

export const shareValue = async (payload: string) => {
  let canShare = true;
  try {
    await navigator.share({ url: payload });
  } catch (error) {
    canShare = false;
  }
  if (!canShare) {
    try {
      await navigator.clipboard.writeText(payload);
      notify('Link copied to clipboard');
    } catch (error) {}
  }
};
