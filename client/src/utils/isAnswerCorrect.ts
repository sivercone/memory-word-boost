// @todo - check behaviour for special characters in sim apps (`ʼ;)
export const isAnswerCorrect = (term: string, answer: string): boolean => {
  const t = term
    .toLowerCase()
    .replace(/^\s+|\s+$/g, '')
    .replace(/\s+/g, ' ');

  const a = answer
    .toLowerCase()
    .replace(/^\s+|\s+$/g, '')
    .replace(/\s+/g, ' ');

  return t === a;
};
