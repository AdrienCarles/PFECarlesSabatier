import js from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import jsdocPlugin from 'eslint-plugin-jsdoc';
import noUnsanitizedPlugin from 'eslint-plugin-no-unsanitized';
import prettierPlugin from 'eslint-plugin-prettier';
import promisePlugin from 'eslint-plugin-promise';
import securityPlugin from 'eslint-plugin-security';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    files: ['**/*.js'],
    plugins: {
      import: importPlugin,
      jsdoc: jsdocPlugin,
      'no-unsanitized': noUnsanitizedPlugin,
      prettier: prettierPlugin,
      promise: promisePlugin,
      security: securityPlugin,
    },
    rules: {
      // Base ESLint rules
      'no-console': 'warn',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-duplicate-imports': 'error',

      // Security rules
      'security/detect-object-injection': 'warn',
      'security/detect-non-literal-fs-filename': 'warn',
      'security/detect-eval-with-expression': 'error',
      'security/detect-no-csrf-before-method-override': 'error',
      'security/detect-possible-timing-attacks': 'warn',

      // Promise rules
      'promise/always-return': 'warn',
      'promise/no-return-wrap': 'error',
      'promise/param-names': 'error',
      'promise/catch-or-return': 'error',

      // Import rules
      'import/no-unresolved': 'error',
      'import/named': 'error',
      'import/default': 'error',
      'import/namespace': 'error',
      'import/order': ['warn', { groups: ['builtin', 'external', 'internal'] }],
    },
  },
  {
    // Configuration spécifique pour les tests
    files: ['**/*.test.js', '**/*.spec.js', '**/tests/**/*.js'],
    rules: {
      'no-unused-expressions': 'off',
      'security/detect-object-injection': 'off',
    },
  },
  {
    // Configuration pour les fichiers de configuration
    files: ['*.config.js', 'config/**/*.js'],
    rules: {
      'no-console': 'off',
    },
  },
];
