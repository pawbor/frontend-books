const ERROR = 2;

module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
    node: true,
    jest: true,
  },
  plugins: ['react'],
  extends: 'eslint:recommended',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2017,
    sourceType: 'module',
  },
  globals: {
    __DEBUG__: false,
  },
  settings: {
    react: {
      pragma: 'jsx',
    },
  },
  rules: {
    'no-console': [
      ERROR,
      {
        allow: ['warn', 'error'],
      },
    ],
    'react/jsx-no-undef': ERROR,
    'react/jsx-uses-vars': ERROR,
    'react/jsx-uses-react': ERROR,
    'react/react-in-jsx-scope': ERROR,
  },
  overrides: [
    {
      files: ['*.test.js'],
      env: {
        jest: true,
      },
      globals: {
        __DEBUG__: true,
      },
    },
  ],
};
