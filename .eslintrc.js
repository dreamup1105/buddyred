module.exports = {
  extends: [require.resolve('@umijs/fabric/dist/eslint')],
  rules: {
    'no-console': ['error', { allow: ['warn', 'error', 'log'] }],
    'react-hooks/exhaustive-deps': 'off'
  },
  globals: {
    page: true,
    REACT_APP_ENV: true,
  },
};
