module.exports = {
  'env': {
    'browser': true,
    'es6': true
  },
  'extends': 'eslint:recommended',
  'parserOptions': {
    'ecmaVersion': 2018,
    'sourceType': 'module'
  },
  'rules': {
    'eqeqeq': ['error', 'always'],
    'func-names': 'error',
    'no-implicit-coercion': 'error',
    'no-useless-return': 'error',
    'radix': 'error',
    'valid-jsdoc': 'error'
  }
}
