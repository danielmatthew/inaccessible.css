const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: 'test',
  reporter: process.env.CI ? 'github' : 'list',
  use: { browserName: 'chromium' },
});
