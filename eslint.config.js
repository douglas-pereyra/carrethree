import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default [
  // 1. Ignora a pasta de build
  { ignores: ['dist'] },

  // 2. Configuração para o FRONTEND (pasta src) - Sem alterações
  {
    files: ['src/**/*.{js,jsx}'],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },

  // 3. Configuração para o BACKEND (pasta backend) - CORRIGIDA
  {
    files: ['backend/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.node, // Globais do Node.js (process, __dirname, etc.)
      },
      sourceType: 'module', // DIZENDO AO ESLINT QUE O BACKEND AGORA USA "import/export"
    },
    rules: {
      ...js.configs.recommended.rules,
      'no-unused-vars': ['warn'],
    },
  },
];