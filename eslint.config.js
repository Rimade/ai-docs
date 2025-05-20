/** @type {import('eslint').Linter.FlatConfig[]} */
import js from '@eslint/js';
import nextPlugin from '@next/eslint-plugin-next';
import { FlatCompat } from '@eslint/eslintrc';
import path from 'path';
import { fileURLToPath } from 'url';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

// Для работы __dirname в ESM
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended
});

export default [
  js.configs.recommended,
  ...compat.extends('next/core-web-vitals'),
  {
    ignores: ['node_modules/**', '.next/**', 'dist/**', 'build/**']
  },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      globals: {
        React: 'readonly',
        NodeJS: 'readonly'
      }
    },
    plugins: {
      '@next/next': nextPlugin
    },
    rules: {
      // Базовые правила
      'no-unused-vars': 'warn',
      'no-undef': 'error',
      'import/no-anonymous-default-export': 'warn'
    }
  },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json'
      },
      globals: {
        React: 'readonly',
        NodeJS: 'readonly'
      }
    },
    plugins: {
      '@typescript-eslint': tseslint
    },
    rules: {
      // TypeScript-специфичные правила
      '@typescript-eslint/no-unused-vars': 'warn',
      // Отключаем строгую проверку типов any
      '@typescript-eslint/no-explicit-any': 'warn',
      // Требуем импорты типов с import type
      '@typescript-eslint/consistent-type-imports': 'error',
      'react/jsx-no-undef': 'off'
    }
  }
];
