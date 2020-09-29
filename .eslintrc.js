module.exports = {
  "root": true,
  "env": {
    es6: true,
    browser: true,
    node: true
  },
  'extends': [
    `plugin:vue/essential`,
    `eslint:recommended`,
  ],
  "parserOptions": {
    ecmaVersion: 2020
  },
  "rules": {
    'no-console': process.env.NODE_ENV === `production` ? `warn` : `off`,
    'no-debugger': process.env.NODE_ENV === `production` ? `warn` : `off`
  }
};
