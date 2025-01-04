declare namespace chrome {
  export namespace storage {
    export interface StorageArea {
      get(keys: string | string[] | object | null, callback: (items: { [key: string]: any }) => void): void;
      set(items: object, callback?: () => void): void;
    }

    export const sync: StorageArea;
  }
}
