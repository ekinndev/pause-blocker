interface StorageAPI {
  get: (keys: string[], callback: (items: { [key: string]: any }) => void) => void;
  set: (items: { [key: string]: any }, callback?: () => void) => void;
}

const mockStorage: { [key: string]: any } = {
  whitelist: [],
};

const mockStorageAPI: StorageAPI = {
  get: (keys: string[], callback) => {
    const result: { [key: string]: any } = {};
    keys.forEach(key => {
      result[key] = mockStorage[key];
    });
    callback(result);
  },
  set: (items: { [key: string]: any }, callback?: () => void) => {
    Object.assign(mockStorage, items);
    if (callback) callback();
  },
};

const isDevelopment = import.meta.env.DEV;
const storage = isDevelopment ? mockStorageAPI : chrome.storage.sync;

export const chromeStorage = {
  get: (keys: string[]): Promise<{ [key: string]: any }> => {
    return new Promise(resolve => {
      storage.get(keys, result => {
        resolve(result);
      });
    });
  },
  set: (items: { [key: string]: any }): Promise<void> => {
    return new Promise(resolve => {
      storage.set(items, () => {
        resolve();
      });
    });
  },
};
