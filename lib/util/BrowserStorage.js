export function setSessionStorage(key, value) {
  if (typeof window !== "undefined") {
    sessionStorage.setItem(key, JSON.stringify(value));
  }
}

export function setLocalStorage(key, value) {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(value));
  }
}

export function getSessionStorage(key) {
  if (typeof window !== "undefined") {
    const stored = sessionStorage.getItem(key);
    if (!stored) {
      // throw new Error(`Browser Storage Error: '${key}' does not exist`);
    }
    return JSON.parse(stored);
  }
}

export function getLocalStorage(key) {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(key);
    if (!stored) {
      // throw new Error(`Browser Storage Error: '${key}' does not exist`);
    }
    return JSON.parse(stored);
  }
}
