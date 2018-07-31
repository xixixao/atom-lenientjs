'use babel';

const babylon = require('../dependencies/parser-babylon');
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
  plugins: [babylon],
};

const prettierOptionsToLenient = {
  lenient: true,
  semi: false,
};

const prettierOptionsToJS = {
  semi: true,
};

const parser = (plugins, language) => {
  const babylonOptions = {
    ...defaultBabylonOptions,
    plugins: [...defaultBabylonOptions.plugins, ...plugins],
  };
  const isJSON = language === 'json';
  const parser = (text, {babylon}) =>
    babylon(text, {}, isJSON ? {parser: 'json'} : {}, babylonOptions);
  parser.printer = isJSON ? 'json' : 'js';
  return {parser};
};

// Options:
//    "language": 'js' or 'json'
export default ({language}) => {
  const jsToLenientOptions = {
    ...defaultPrettierOptions,
    ...prettierOptionsToLenient,
    ...parser(babelPluginsFromJS, language),
  };

  const jsToLenient = text => prettier.format(text, jsToLenientOptions);

  const lenientToJSOptions = {
    ...defaultPrettierOptions,
    ...prettierOptionsToJS,
    ...parser(babelPluginsFromLenient, language),
  };

  const lenientToJS = text => prettier.format(text, lenientToJSOptions);

  const lenientToLenientOptions = {
    ...defaultPrettierOptions,
    ...prettierOptionsToLenient,
    ...parser(babelPluginsFromLenient, language),
  };

  const lenientToLenient = text =>
    prettier.format(text, lenientToLenientOptions);

  return {jsToLenient, lenientToJS, lenientToLenient};
};
