export const sessionMemory = {
  get(key: string) {
    const value = typeof window !== 'undefined' ? sessionStorage.getItem(key) : null;
    if (value) return value;
  },

  set(key: string, value: string) {
    sessionStorage.setItem(key, value);
  },

  remove(key: string) {
    sessionStorage.removeItem(key);
  },
};
