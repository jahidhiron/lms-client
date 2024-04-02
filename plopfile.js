const { camelCase, pascalCase, snakeCase, paramCase } = require('change-case');
const path = require('path');

module.exports = (plop) => {
  plop.setHelper('camelCase', (text) => camelCase(text));
  plop.setHelper('pascalCase', (text) => pascalCase(text));
  plop.setHelper('snakeCase', (text) => snakeCase(text));
  plop.setHelper('kebabCase', (text) => paramCase(text));
  plop.setHelper(
    'titleCase',
    (text) => text.charAt(0).toUpperCase() + text.slice(1)
  );
  plop.setHelper('componentPath', (compName) => {
    const pascalCaseName = plop.getHelper('pascalCase')(compName);
    return path.join('src', 'components', 'core', pascalCaseName);
  });

  plop.setGenerator('feature', {
    description: 'Generate common files and boilerplate code for a feature',
    prompts: [
      {
        type: 'input',
        name: 'featureName',
        message: 'Enter the name of the feature (in singular form):',
      },
      {
        type: 'input',
        name: 'featureNameInPlural',
        message: 'Enter the name of the feature (in plural form):',
      },
    ],
    actions: [
      {
        type: 'addMany',
        destination: 'src/libs/features/{{ featureName }}',
        base: 'templates/features',
        templateFiles: 'templates/features/*',
      },
    ],
  });

  plop.setGenerator('component', {
    description: 'Generate files and boilerplate code for a core component',
    prompts: [
      {
        type: 'input',
        name: 'folderName',
        message: 'Folder Name: ',
      },
      {
        type: 'input',
        name: 'compName',
        message: 'Component Name: ',
      },
    ],
    actions: [
      {
        type: 'addMany',
        destination: 'src/components/{{folderName}}/{{pascalCase compName}}',
        base: 'templates/core',
        templateFiles: 'templates/core/**',
      },
    ],
  });
};
