export const trimExtraSpaces = (str: string): string => {
  return str.replace(/^\s+|\s+$/g, '').replace(/\s+/g, ' ');
};
