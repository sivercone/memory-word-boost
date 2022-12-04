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

export const localMemory = {
  get(key: string) {
    const value = typeof window !== 'undefined' ? localStorage.getItem(key) : null;
    const parsedJSON = value ? JSON.parse(value) : null;
    return parsedJSON;
  },

  set(key: string, data: unknown) {
    localStorage.setItem(key, JSON.stringify(data));
  },

  remove(key: string) {
    localStorage.removeItem(key);
  },
};
