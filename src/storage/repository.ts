import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState, initialState, StateSchema } from '../domain/models';

export const STORAGE_KEY = 'pescalead.state.v1';
export interface StorageAdapter { getItem(key: string): Promise<string | null>; setItem(key: string, value: string): Promise<void> }

export function createRepository(adapter: StorageAdapter) {
  let queue = Promise.resolve();
  return {
    async load(): Promise<AppState> {
      const raw = await adapter.getItem(STORAGE_KEY);
      if (!raw) return initialState();
      const result = StateSchema.safeParse(JSON.parse(raw));
      if (!result.success) throw new Error('Os dados locais não passaram na validação. A gravação está suspensa para preservar o arquivo.');
      return result.data;
    },
    save(state: AppState): Promise<void> {
      const serialized = JSON.stringify(StateSchema.parse(state));
      const next = queue.catch(() => {}).then(() => adapter.setItem(STORAGE_KEY, serialized));
      queue = next;
      return next;
    },
  };
}

export const repository = createRepository(AsyncStorage);
