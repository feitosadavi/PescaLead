import { describe, expect, it, vi } from 'vitest';
vi.mock('@react-native-async-storage/async-storage', () => ({ default: { getItem: vi.fn(), setItem: vi.fn() } }));
import { createRepository, STORAGE_KEY } from '../src/storage/repository';
import { initialState } from '../src/domain/models';

describe('persistência', () => {
  it('serializa gravações e não reverte para uma versão antiga por corrida', async () => {
    const writes: string[] = [];
    const adapter = { getItem: async () => null, setItem: async (_: string, raw: string) => { await new Promise(r => setTimeout(r, JSON.parse(raw).settings.resultLimit === 1 ? 20 : 0)); writes.push(raw); } };
    const repo = createRepository(adapter);
    await Promise.all([repo.save({ ...initialState(), settings: { ...initialState().settings, resultLimit: 1 } }), repo.save({ ...initialState(), settings: { ...initialState().settings, resultLimit: 2 } })]);
    expect(JSON.parse(writes[1]!).settings.resultLimit).toBe(2);
  });
  it('não apaga armazenamento inválido durante o carregamento', async () => {
    const setItem = vi.fn();
    const repo = createRepository({ getItem: async key => key === STORAGE_KEY ? '{"version":99}' : null, setItem });
    await expect(repo.load()).rejects.toThrow('gravação está suspensa');
    expect(setItem).not.toHaveBeenCalled();
  });
  it('continua permitindo uma gravação posterior após falha anterior', async () => {
    const setItem = vi.fn().mockRejectedValueOnce(new Error('disco cheio')).mockResolvedValueOnce(undefined);
    const repo = createRepository({ getItem: async () => null, setItem });
    await expect(repo.save(initialState())).rejects.toThrow('disco cheio');
    await expect(repo.save(initialState())).resolves.toBeUndefined();
  });
});
