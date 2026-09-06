import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['src/**/*.spec.ts', 'scripts/**/*.spec.mjs'],
    environment: 'node',
    globalSetup: ['scripts/test-global-setup.mjs'],
  },
})
