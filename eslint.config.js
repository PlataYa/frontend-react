const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    files: ['cypress/**/*.cy.{js,ts}'],
    languageOptions: {
      globals: {
        cy: true,
        Cypress: true,
      },
    },
  },
  {
    ignores: ['dist/*'],
  },
]);
