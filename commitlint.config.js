// Formato: tipo(ámbito): mensaje en primera persona y en pasado.
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'refactor', 'test', 'docs', 'chore', 'ci', 'build', 'style', 'perf'],
    ],
    'type-case': [2, 'always', 'lower-case'],
    'header-max-length': [2, 'always', 120],
  },
};
