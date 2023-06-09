module.exports = {
  '**/*.js': 'eslint --config .eslintrc.js --fix',
  '**/*.json': 'prettier --write',
  '**/*.md': 'prettier --write',
  '**/*.ts': [
    () => 'tsc -p tsconfig.json --noEmit',
    'eslint --config .eslintrc.js --fix',
  ],
}
