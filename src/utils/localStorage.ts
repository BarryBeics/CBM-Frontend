export const saveToLocalStorage = <T>(key: string, data: T): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const loadFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : defaultValue;
};

// Load reveal codes with type safety and default value
export const loadRevealCodes = (): string[] => {
  return loadFromLocalStorage<string[]>('revealCodes', []);
};

// Save reveal codes to localStorage
export const saveRevealCodes = (codes: string[]): void => {
  saveToLocalStorage<string[]>('revealCodes', codes);
};
