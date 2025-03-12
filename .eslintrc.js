module.exports = {
  root: true,
  // This tells ESLint to load the config from the package `eslint-config-custom`
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react', 'react-hooks'],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  ignorePatterns: [
    'node_modules/',
    'dist/',
    ".next/",
    "build/",
    "**/*.d.ts",
    "coverage/",
    ".turbo/",
  ],
  rules: {
    // Add custom rules here
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
  },
  overrides: [
    // Customize rules for specific packages or apps
    {
      files: ['packages/*/src/**/*.{ts,tsx}'],
      rules: {
        // Rules specific to packages
      },
    },
    {
      files: ['apps/*/src/**/*.{ts,tsx}'],
      rules: {
        // Rules specific to apps
      },
    },
  ],
}; 