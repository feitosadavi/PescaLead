import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 45000,
  workers: 1,
  use: {
    baseURL: 'http://127.0.0.1:8173',
    viewport: { width: 412, height: 915 },
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    launchOptions: { executablePath: process.env.PESCALEAD_CHROME ?? '/opt/google/chrome/chrome', args: ['--no-sandbox', '--disable-dev-shm-usage'] },
  },
  webServer: { command: 'python3 -m http.server 8173 --bind 127.0.0.1 --directory dist', url: 'http://127.0.0.1:8173', reuseExistingServer: !process.env.CI },
});
