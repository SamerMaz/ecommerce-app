import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
const config = [
  {
    files: ['**/*.ts', '**/*.js'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      parser: tsParser,
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      ...prettierConfig.rules, // Disable rules that conflict with Prettier
      'prettier/prettier': 'error',
    },
  },
];

export default config;
