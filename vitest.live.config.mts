import { defineConfig } from 'vitest/config';

export default defineConfig({ test: { include: ['integration-live/**/*.test.ts'], environment: 'node', testTimeout: 120000 } });
