'use babel';

const prettier = require('../dependencies/prettier');

const defaultBabylonOptions = {
  sourceType: 'module',
  allowImportExportEverywhere: true,
  allowReturnOutsideFunction: true,
  plugins: [
    'jsx',
    'flow',
    'doExpressions',
    'objectRestSpread',
    'decorators',
    'classProperties',
    'exportDefaultFrom',
    'exportNamespaceFrom',
    'asyncGenerators',
    'functionBind',
    'functionSent',
    'dynamicImport',
    'numericSeparator',
    'importMeta',
    'optionalCatchBinding',
    'optionalChaining',
    'classPrivateProperties',
    'pipelineOperator',
    'nullishCoalescingOperator',
  ],
};

const babelPluginsFromLenient = ['lenient'];
const babelPluginsFromJS = [];

const defaultPrettierOptions = {
  bracketSpacing: false,
  jsxBracketSameLine: true,
  singleQuote: true,
  trailingComma: 'all',
};

const prettierOptionsToLenient = {
  lenient: true,
  semi: false,
};

const prettierOptionsToJS = {
  semi: true,
};

const parser = plugins => {
  const babylonOptions = {
    ...defaultBabylonOptions,
    plugins: [...defaultBabylonOptions.plugins, ...plugins],
  };
  return {
    parser: (text, {babylon}, options) =>
      babylon(text, {}, options, babylonOptions),
  };
};

const jsToLenientOptions = {
  ...defaultPrettierOptions,
  ...prettierOptionsToLenient,
  ...parser(babelPluginsFromJS),
};

export const jsToLenient = text => prettier.format(text, jsToLenientOptions);

const lenientToJSOptions = {
  ...defaultPrettierOptions,
  ...prettierOptionsToJS,
  ...parser(babelPluginsFromLenient),
};

export const lenientToJS = text => prettier.format(text, lenientToJSOptions);

const lenientToLenientOptions = {
  ...defaultPrettierOptions,
  ...prettierOptionsToLenient,
  ...parser(babelPluginsFromLenient),
};

export const lenientToLenient = text =>
  prettier.format(text, lenientToLenientOptions);
