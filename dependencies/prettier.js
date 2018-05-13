'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var path = _interopDefault(require('path'));
var assert = _interopDefault(require('assert'));
var os = _interopDefault(require('os'));
var fs = _interopDefault(require('fs'));
var util = _interopDefault(require('util'));
var events = _interopDefault(require('events'));
var thirdParty = require('./third-party');
var thirdParty__default = thirdParty['default'];

var name = "prettier";
var version$1 = "1.12.1";
var description = "Prettier is an opinionated code formatter";
var bin = {"prettier":"./bin/prettier.js"};
var repository = "prettier/prettier";
var homepage = "https://prettier.io";
var author = "James Long";
var license = "MIT";
var main = "./index.js";
var engines = {"node":">=4"};
var dependencies = {"@babel/code-frame":"7.0.0-beta.40","@glimmer/syntax":"0.30.3","babylon":"7.0.0-beta.34","camelcase":"4.1.0","chalk":"2.1.0","cjk-regex":"1.0.2","cosmiconfig":"3.1.0","dashify":"0.2.2","dedent":"0.7.0","diff":"3.2.0","editorconfig":"0.15.0","editorconfig-to-prettier":"0.0.6","emoji-regex":"6.5.1","escape-string-regexp":"1.0.5","esutils":"2.0.2","find-parent-dir":"0.3.0","find-project-root":"1.1.1","flow-parser":"0.70","get-stream":"3.0.0","globby":"6.1.0","graphql":"0.13.2","html-tag-names":"1.1.2","ignore":"3.3.7","jest-docblock":"22.2.2","json-stable-stringify":"1.0.1","leven":"2.1.0","lodash.uniqby":"4.7.0","mem":"1.1.0","minimatch":"3.0.4","minimist":"1.2.0","parse5":"3.0.3","postcss-less":"1.1.5","postcss-media-query-parser":"0.2.3","postcss-scss":"1.0.5","postcss-selector-parser":"2.2.3","postcss-values-parser":"1.5.0","remark-frontmatter":"1.1.0","remark-parse":"5.0.0","resolve":"1.5.0","semver":"5.4.1","string-width":"2.1.1","typescript":"2.9.0-dev.20180421","typescript-eslint-parser":"eslint/typescript-eslint-parser#2960b002746c01fb9cb15bb5f4c1e7e925c6519a","unicode-regex":"1.0.1","unified":"6.1.6"};
var devDependencies = {"babel-cli":"6.24.1","babel-preset-es2015":"6.24.1","codecov":"2.2.0","cross-env":"5.0.5","eslint":"4.18.2","eslint-config-prettier":"2.9.0","eslint-friendly-formatter":"3.0.0","eslint-plugin-import":"2.9.0","eslint-plugin-prettier":"2.6.0","eslint-plugin-react":"7.7.0","jest":"21.1.0","mkdirp":"0.5.1","prettier":"1.12.1","prettylint":"1.0.0","rimraf":"2.6.2","rollup":"0.47.6","rollup-plugin-commonjs":"8.2.6","rollup-plugin-json":"2.1.1","rollup-plugin-node-builtins":"2.0.0","rollup-plugin-node-globals":"1.1.0","rollup-plugin-node-resolve":"2.0.0","rollup-plugin-replace":"1.2.1","shelljs":"0.8.1","snapshot-diff":"0.2.2","strip-ansi":"4.0.0","tempy":"0.2.1","uglify-es":"3.3.9","webpack":"2.6.1"};
var scripts = {"prepublishOnly":"echo \"Error: must publish from dist/\" && exit 1","prepare-release":"yarn && yarn build && yarn test:dist","test":"jest","test:dist":"node ./scripts/test-dist.js","test:lenient":"jest --testRegex 'tests/lenient(-compat)?-(to|from)-js/jsfmt\\.spec\\.js$'","test-integration":"jest tests_integration","lint":"cross-env EFF_NO_LINK_RULES=true eslint . --format node_modules/eslint-friendly-formatter","lint-docs":"prettylint {.,docs,website,website/blog}/*.md","build":"node ./scripts/build/build.js","build-docs":"node ./scripts/build/build-docs.js","check-deps":"node ./scripts/check-deps.js"};
var _package = {
	name: name,
	version: version$1,
	description: description,
	bin: bin,
	repository: repository,
	homepage: homepage,
	author: author,
	license: license,
	main: main,
	engines: engines,
	dependencies: dependencies,
	devDependencies: devDependencies,
	scripts: scripts
};

var _package$1 = Object.freeze({
	name: name,
	version: version$1,
	description: description,
	bin: bin,
	repository: repository,
	homepage: homepage,
	author: author,
	license: license,
	main: main,
	engines: engines,
	dependencies: dependencies,
	devDependencies: devDependencies,
	scripts: scripts,
	default: _package
});

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};



function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var base = createCommonjsModule(function (module, exports) {
/*istanbul ignore start*/'use strict';

exports.__esModule = true;
exports['default'] = /*istanbul ignore end*/Diff;
function Diff() {}

Diff.prototype = { /*istanbul ignore start*/
  /*istanbul ignore end*/diff: function diff(oldString, newString) {
    /*istanbul ignore start*/var /*istanbul ignore end*/options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

    var callback = options.callback;
    if (typeof options === 'function') {
      callback = options;
      options = {};
    }
    this.options = options;

    var self = this;

    function done(value) {
      if (callback) {
        setTimeout(function () {
          callback(undefined, value);
        }, 0);
        return true;
      } else {
        return value;
      }
    }

    // Allow subclasses to massage the input prior to running
    oldString = this.castInput(oldString);
    newString = this.castInput(newString);

    oldString = this.removeEmpty(this.tokenize(oldString));
    newString = this.removeEmpty(this.tokenize(newString));

    var newLen = newString.length,
        oldLen = oldString.length;
    var editLength = 1;
    var maxEditLength = newLen + oldLen;
    var bestPath = [{ newPos: -1, components: [] }];

    // Seed editLength = 0, i.e. the content starts with the same values
    var oldPos = this.extractCommon(bestPath[0], newString, oldString, 0);
    if (bestPath[0].newPos + 1 >= newLen && oldPos + 1 >= oldLen) {
      // Identity per the equality and tokenizer
      return done([{ value: this.join(newString), count: newString.length }]);
    }

    // Main worker method. checks all permutations of a given edit length for acceptance.
    function execEditLength() {
      for (var diagonalPath = -1 * editLength; diagonalPath <= editLength; diagonalPath += 2) {
        var basePath = /*istanbul ignore start*/void 0;
        var addPath = bestPath[diagonalPath - 1],
            removePath = bestPath[diagonalPath + 1],
            _oldPos = (removePath ? removePath.newPos : 0) - diagonalPath;
        if (addPath) {
          // No one else is going to attempt to use this value, clear it
          bestPath[diagonalPath - 1] = undefined;
        }

        var canAdd = addPath && addPath.newPos + 1 < newLen,
            canRemove = removePath && 0 <= _oldPos && _oldPos < oldLen;
        if (!canAdd && !canRemove) {
          // If this path is a terminal then prune
          bestPath[diagonalPath] = undefined;
          continue;
        }

        // Select the diagonal that we want to branch from. We select the prior
        // path whose position in the new string is the farthest from the origin
        // and does not pass the bounds of the diff graph
        if (!canAdd || canRemove && addPath.newPos < removePath.newPos) {
          basePath = clonePath(removePath);
          self.pushComponent(basePath.components, undefined, true);
        } else {
          basePath = addPath; // No need to clone, we've pulled it from the list
          basePath.newPos++;
          self.pushComponent(basePath.components, true, undefined);
        }

        _oldPos = self.extractCommon(basePath, newString, oldString, diagonalPath);

        // If we have hit the end of both strings, then we are done
        if (basePath.newPos + 1 >= newLen && _oldPos + 1 >= oldLen) {
          return done(buildValues(self, basePath.components, newString, oldString, self.useLongestToken));
        } else {
          // Otherwise track this path as a potential candidate and continue.
          bestPath[diagonalPath] = basePath;
        }
      }

      editLength++;
    }

    // Performs the length of edit iteration. Is a bit fugly as this has to support the
    // sync and async mode which is never fun. Loops over execEditLength until a value
    // is produced.
    if (callback) {
      (function exec() {
        setTimeout(function () {
          // This should not happen, but we want to be safe.
          /* istanbul ignore next */
          if (editLength > maxEditLength) {
            return callback();
          }

          if (!execEditLength()) {
            exec();
          }
        }, 0);
      })();
    } else {
      while (editLength <= maxEditLength) {
        var ret = execEditLength();
        if (ret) {
          return ret;
        }
      }
    }
  },
  /*istanbul ignore start*/ /*istanbul ignore end*/pushComponent: function pushComponent(components, added, removed) {
    var last = components[components.length - 1];
    if (last && last.added === added && last.removed === removed) {
      // We need to clone here as the component clone operation is just
      // as shallow array clone
      components[components.length - 1] = { count: last.count + 1, added: added, removed: removed };
    } else {
      components.push({ count: 1, added: added, removed: removed });
    }
  },
  /*istanbul ignore start*/ /*istanbul ignore end*/extractCommon: function extractCommon(basePath, newString, oldString, diagonalPath) {
    var newLen = newString.length,
        oldLen = oldString.length,
        newPos = basePath.newPos,
        oldPos = newPos - diagonalPath,
        commonCount = 0;
    while (newPos + 1 < newLen && oldPos + 1 < oldLen && this.equals(newString[newPos + 1], oldString[oldPos + 1])) {
      newPos++;
      oldPos++;
      commonCount++;
    }

    if (commonCount) {
      basePath.components.push({ count: commonCount });
    }

    basePath.newPos = newPos;
    return oldPos;
  },
  /*istanbul ignore start*/ /*istanbul ignore end*/equals: function equals(left, right) {
    return left === right;
  },
  /*istanbul ignore start*/ /*istanbul ignore end*/removeEmpty: function removeEmpty(array) {
    var ret = [];
    for (var i = 0; i < array.length; i++) {
      if (array[i]) {
        ret.push(array[i]);
      }
    }
    return ret;
  },
  /*istanbul ignore start*/ /*istanbul ignore end*/castInput: function castInput(value) {
    return value;
  },
  /*istanbul ignore start*/ /*istanbul ignore end*/tokenize: function tokenize(value) {
    return value.split('');
  },
  /*istanbul ignore start*/ /*istanbul ignore end*/join: function join(chars) {
    return chars.join('');
  }
};

function buildValues(diff, components, newString, oldString, useLongestToken) {
  var componentPos = 0,
      componentLen = components.length,
      newPos = 0,
      oldPos = 0;

  for (; componentPos < componentLen; componentPos++) {
    var component = components[componentPos];
    if (!component.removed) {
      if (!component.added && useLongestToken) {
        var value = newString.slice(newPos, newPos + component.count);
        value = value.map(function (value, i) {
          var oldValue = oldString[oldPos + i];
          return oldValue.length > value.length ? oldValue : value;
        });

        component.value = diff.join(value);
      } else {
        component.value = diff.join(newString.slice(newPos, newPos + component.count));
      }
      newPos += component.count;

      // Common case
      if (!component.added) {
        oldPos += component.count;
      }
    } else {
      component.value = diff.join(oldString.slice(oldPos, oldPos + component.count));
      oldPos += component.count;

      // Reverse add and remove so removes are output first to match common convention
      // The diffing algorithm is tied to add then remove output and this is the simplest
      // route to get the desired output with minimal overhead.
      if (componentPos && components[componentPos - 1].added) {
        var tmp = components[componentPos - 1];
        components[componentPos - 1] = components[componentPos];
        components[componentPos] = tmp;
      }
    }
  }

  // Special case handle for when one terminal is ignored. For this case we merge the
  // terminal into the prior string and drop the change.
  var lastComponent = components[componentLen - 1];
  if (componentLen > 1 && (lastComponent.added || lastComponent.removed) && diff.equals('', lastComponent.value)) {
    components[componentLen - 2].value += lastComponent.value;
    components.pop();
  }

  return components;
}

function clonePath(path$$1) {
  return { newPos: path$$1.newPos, components: path$$1.components.slice(0) };
}

});

unwrapExports(base);

var character = createCommonjsModule(function (module, exports) {
/*istanbul ignore start*/'use strict';

exports.__esModule = true;
exports.characterDiff = undefined;
exports. /*istanbul ignore end*/diffChars = diffChars;



/*istanbul ignore start*/
var _base2 = _interopRequireDefault(base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/*istanbul ignore end*/var characterDiff = /*istanbul ignore start*/exports. /*istanbul ignore end*/characterDiff = new /*istanbul ignore start*/_base2['default']();
function diffChars(oldStr, newStr, callback) {
  return characterDiff.diff(oldStr, newStr, callback);
}

});

unwrapExports(character);

var params = createCommonjsModule(function (module, exports) {
/*istanbul ignore start*/'use strict';

exports.__esModule = true;
exports. /*istanbul ignore end*/generateOptions = generateOptions;
function generateOptions(options, defaults) {
  if (typeof options === 'function') {
    defaults.callback = options;
  } else if (options) {
    for (var name in options) {
      /* istanbul ignore else */
      if (options.hasOwnProperty(name)) {
        defaults[name] = options[name];
      }
    }
  }
  return defaults;
}

});

unwrapExports(params);

var word = createCommonjsModule(function (module, exports) {
/*istanbul ignore start*/'use strict';

exports.__esModule = true;
exports.wordDiff = undefined;
exports. /*istanbul ignore end*/diffWords = diffWords;
/*istanbul ignore start*/exports. /*istanbul ignore end*/diffWordsWithSpace = diffWordsWithSpace;



/*istanbul ignore start*/
var _base2 = _interopRequireDefault(base);

/*istanbul ignore end*/


/*istanbul ignore start*/
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/*istanbul ignore end*/

// Based on https://en.wikipedia.org/wiki/Latin_script_in_Unicode
//
// Ranges and exceptions:
// Latin-1 Supplement, 0080–00FF
//  - U+00D7  × Multiplication sign
//  - U+00F7  ÷ Division sign
// Latin Extended-A, 0100–017F
// Latin Extended-B, 0180–024F
// IPA Extensions, 0250–02AF
// Spacing Modifier Letters, 02B0–02FF
//  - U+02C7  ˇ &#711;  Caron
//  - U+02D8  ˘ &#728;  Breve
//  - U+02D9  ˙ &#729;  Dot Above
//  - U+02DA  ˚ &#730;  Ring Above
//  - U+02DB  ˛ &#731;  Ogonek
//  - U+02DC  ˜ &#732;  Small Tilde
//  - U+02DD  ˝ &#733;  Double Acute Accent
// Latin Extended Additional, 1E00–1EFF
var extendedWordChars = /^[A-Za-z\xC0-\u02C6\u02C8-\u02D7\u02DE-\u02FF\u1E00-\u1EFF]+$/;

var reWhitespace = /\S/;

var wordDiff = /*istanbul ignore start*/exports. /*istanbul ignore end*/wordDiff = new /*istanbul ignore start*/_base2['default']();
wordDiff.equals = function (left, right) {
  return left === right || this.options.ignoreWhitespace && !reWhitespace.test(left) && !reWhitespace.test(right);
};
wordDiff.tokenize = function (value) {
  var tokens = value.split(/(\s+|\b)/);

  // Join the boundary splits that we do not consider to be boundaries. This is primarily the extended Latin character set.
  for (var i = 0; i < tokens.length - 1; i++) {
    // If we have an empty string in the next field and we have only word chars before and after, merge
    if (!tokens[i + 1] && tokens[i + 2] && extendedWordChars.test(tokens[i]) && extendedWordChars.test(tokens[i + 2])) {
      tokens[i] += tokens[i + 2];
      tokens.splice(i + 1, 2);
      i--;
    }
  }

  return tokens;
};

function diffWords(oldStr, newStr, callback) {
  var options = /*istanbul ignore start*/(0, params.generateOptions) /*istanbul ignore end*/(callback, { ignoreWhitespace: true });
  return wordDiff.diff(oldStr, newStr, options);
}
function diffWordsWithSpace(oldStr, newStr, callback) {
  return wordDiff.diff(oldStr, newStr, callback);
}

});

unwrapExports(word);

var line = createCommonjsModule(function (module, exports) {
/*istanbul ignore start*/'use strict';

exports.__esModule = true;
exports.lineDiff = undefined;
exports. /*istanbul ignore end*/diffLines = diffLines;
/*istanbul ignore start*/exports. /*istanbul ignore end*/diffTrimmedLines = diffTrimmedLines;



/*istanbul ignore start*/
var _base2 = _interopRequireDefault(base);

/*istanbul ignore end*/


/*istanbul ignore start*/
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/*istanbul ignore end*/var lineDiff = /*istanbul ignore start*/exports. /*istanbul ignore end*/lineDiff = new /*istanbul ignore start*/_base2['default']();
lineDiff.tokenize = function (value) {
  var retLines = [],
      linesAndNewlines = value.split(/(\n|\r\n)/);

  // Ignore the final empty token that occurs if the string ends with a new line
  if (!linesAndNewlines[linesAndNewlines.length - 1]) {
    linesAndNewlines.pop();
  }

  // Merge the content and line separators into single tokens
  for (var i = 0; i < linesAndNewlines.length; i++) {
    var line = linesAndNewlines[i];

    if (i % 2 && !this.options.newlineIsToken) {
      retLines[retLines.length - 1] += line;
    } else {
      if (this.options.ignoreWhitespace) {
        line = line.trim();
      }
      retLines.push(line);
    }
  }

  return retLines;
};

function diffLines(oldStr, newStr, callback) {
  return lineDiff.diff(oldStr, newStr, callback);
}
function diffTrimmedLines(oldStr, newStr, callback) {
  var options = /*istanbul ignore start*/(0, params.generateOptions) /*istanbul ignore end*/(callback, { ignoreWhitespace: true });
  return lineDiff.diff(oldStr, newStr, options);
}

});

unwrapExports(line);

var sentence = createCommonjsModule(function (module, exports) {
/*istanbul ignore start*/'use strict';

exports.__esModule = true;
exports.sentenceDiff = undefined;
exports. /*istanbul ignore end*/diffSentences = diffSentences;



/*istanbul ignore start*/
var _base2 = _interopRequireDefault(base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/*istanbul ignore end*/var sentenceDiff = /*istanbul ignore start*/exports. /*istanbul ignore end*/sentenceDiff = new /*istanbul ignore start*/_base2['default']();
sentenceDiff.tokenize = function (value) {
  return value.split(/(\S.+?[.!?])(?=\s+|$)/);
};

function diffSentences(oldStr, newStr, callback) {
  return sentenceDiff.diff(oldStr, newStr, callback);
}

});

unwrapExports(sentence);

var css = createCommonjsModule(function (module, exports) {
/*istanbul ignore start*/'use strict';

exports.__esModule = true;
exports.cssDiff = undefined;
exports. /*istanbul ignore end*/diffCss = diffCss;



/*istanbul ignore start*/
var _base2 = _interopRequireDefault(base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/*istanbul ignore end*/var cssDiff = /*istanbul ignore start*/exports. /*istanbul ignore end*/cssDiff = new /*istanbul ignore start*/_base2['default']();
cssDiff.tokenize = function (value) {
  return value.split(/([{}:;,]|\s+)/);
};

function diffCss(oldStr, newStr, callback) {
  return cssDiff.diff(oldStr, newStr, callback);
}

});

unwrapExports(css);

var json = createCommonjsModule(function (module, exports) {
/*istanbul ignore start*/'use strict';

exports.__esModule = true;
exports.jsonDiff = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports. /*istanbul ignore end*/diffJson = diffJson;
/*istanbul ignore start*/exports. /*istanbul ignore end*/canonicalize = canonicalize;



/*istanbul ignore start*/
var _base2 = _interopRequireDefault(base);

/*istanbul ignore end*/


/*istanbul ignore start*/
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/*istanbul ignore end*/

var objectPrototypeToString = Object.prototype.toString;

var jsonDiff = /*istanbul ignore start*/exports. /*istanbul ignore end*/jsonDiff = new /*istanbul ignore start*/_base2['default']();
// Discriminate between two lines of pretty-printed, serialized JSON where one of them has a
// dangling comma and the other doesn't. Turns out including the dangling comma yields the nicest output:
jsonDiff.useLongestToken = true;

jsonDiff.tokenize = /*istanbul ignore start*/line.lineDiff. /*istanbul ignore end*/tokenize;
jsonDiff.castInput = function (value) {
  /*istanbul ignore start*/var /*istanbul ignore end*/undefinedReplacement = this.options.undefinedReplacement;


  return typeof value === 'string' ? value : JSON.stringify(canonicalize(value), function (k, v) {
    if (typeof v === 'undefined') {
      return undefinedReplacement;
    }

    return v;
  }, '  ');
};
jsonDiff.equals = function (left, right) {
  return (/*istanbul ignore start*/_base2['default']. /*istanbul ignore end*/prototype.equals(left.replace(/,([\r\n])/g, '$1'), right.replace(/,([\r\n])/g, '$1'))
  );
};

function diffJson(oldObj, newObj, options) {
  return jsonDiff.diff(oldObj, newObj, options);
}

// This function handles the presence of circular references by bailing out when encountering an
// object that is already on the "stack" of items being processed.
function canonicalize(obj, stack, replacementStack) {
  stack = stack || [];
  replacementStack = replacementStack || [];

  var i = /*istanbul ignore start*/void 0;

  for (i = 0; i < stack.length; i += 1) {
    if (stack[i] === obj) {
      return replacementStack[i];
    }
  }

  var canonicalizedObj = /*istanbul ignore start*/void 0;

  if ('[object Array]' === objectPrototypeToString.call(obj)) {
    stack.push(obj);
    canonicalizedObj = new Array(obj.length);
    replacementStack.push(canonicalizedObj);
    for (i = 0; i < obj.length; i += 1) {
      canonicalizedObj[i] = canonicalize(obj[i], stack, replacementStack);
    }
    stack.pop();
    replacementStack.pop();
    return canonicalizedObj;
  }

  if (obj && obj.toJSON) {
    obj = obj.toJSON();
  }

  if ( /*istanbul ignore start*/(typeof /*istanbul ignore end*/obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' && obj !== null) {
    stack.push(obj);
    canonicalizedObj = {};
    replacementStack.push(canonicalizedObj);
    var sortedKeys = [],
        key = /*istanbul ignore start*/void 0;
    for (key in obj) {
      /* istanbul ignore else */
      if (obj.hasOwnProperty(key)) {
        sortedKeys.push(key);
      }
    }
    sortedKeys.sort();
    for (i = 0; i < sortedKeys.length; i += 1) {
      key = sortedKeys[i];
      canonicalizedObj[key] = canonicalize(obj[key], stack, replacementStack);
    }
    stack.pop();
    replacementStack.pop();
  } else {
    canonicalizedObj = obj;
  }
  return canonicalizedObj;
}

});

unwrapExports(json);

var array = createCommonjsModule(function (module, exports) {
/*istanbul ignore start*/'use strict';

exports.__esModule = true;
exports.arrayDiff = undefined;
exports. /*istanbul ignore end*/diffArrays = diffArrays;



/*istanbul ignore start*/
var _base2 = _interopRequireDefault(base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/*istanbul ignore end*/var arrayDiff = /*istanbul ignore start*/exports. /*istanbul ignore end*/arrayDiff = new /*istanbul ignore start*/_base2['default']();
arrayDiff.tokenize = arrayDiff.join = function (value) {
  return value.slice();
};

function diffArrays(oldArr, newArr, callback) {
  return arrayDiff.diff(oldArr, newArr, callback);
}

});

unwrapExports(array);

var parse = createCommonjsModule(function (module, exports) {
/*istanbul ignore start*/'use strict';

exports.__esModule = true;
exports. /*istanbul ignore end*/parsePatch = parsePatch;
function parsePatch(uniDiff) {
  /*istanbul ignore start*/var /*istanbul ignore end*/options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var diffstr = uniDiff.split(/\r\n|[\n\v\f\r\x85]/),
      delimiters = uniDiff.match(/\r\n|[\n\v\f\r\x85]/g) || [],
      list = [],
      i = 0;

  function parseIndex() {
    var index = {};
    list.push(index);

    // Parse diff metadata
    while (i < diffstr.length) {
      var line = diffstr[i];

      // File header found, end parsing diff metadata
      if (/^(\-\-\-|\+\+\+|@@)\s/.test(line)) {
        break;
      }

      // Diff index
      var header = /^(?:Index:|diff(?: -r \w+)+)\s+(.+?)\s*$/.exec(line);
      if (header) {
        index.index = header[1];
      }

      i++;
    }

    // Parse file headers if they are defined. Unified diff requires them, but
    // there's no technical issues to have an isolated hunk without file header
    parseFileHeader(index);
    parseFileHeader(index);

    // Parse hunks
    index.hunks = [];

    while (i < diffstr.length) {
      var _line = diffstr[i];

      if (/^(Index:|diff|\-\-\-|\+\+\+)\s/.test(_line)) {
        break;
      } else if (/^@@/.test(_line)) {
        index.hunks.push(parseHunk());
      } else if (_line && options.strict) {
        // Ignore unexpected content unless in strict mode
        throw new Error('Unknown line ' + (i + 1) + ' ' + JSON.stringify(_line));
      } else {
        i++;
      }
    }
  }

  // Parses the --- and +++ headers, if none are found, no lines
  // are consumed.
  function parseFileHeader(index) {
    var headerPattern = /^(---|\+\+\+)\s+([\S ]*)(?:\t(.*?)\s*)?$/;
    var fileHeader = headerPattern.exec(diffstr[i]);
    if (fileHeader) {
      var keyPrefix = fileHeader[1] === '---' ? 'old' : 'new';
      index[keyPrefix + 'FileName'] = fileHeader[2];
      index[keyPrefix + 'Header'] = fileHeader[3];

      i++;
    }
  }

  // Parses a hunk
  // This assumes that we are at the start of a hunk.
  function parseHunk() {
    var chunkHeaderIndex = i,
        chunkHeaderLine = diffstr[i++],
        chunkHeader = chunkHeaderLine.split(/@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@/);

    var hunk = {
      oldStart: +chunkHeader[1],
      oldLines: +chunkHeader[2] || 1,
      newStart: +chunkHeader[3],
      newLines: +chunkHeader[4] || 1,
      lines: [],
      linedelimiters: []
    };

    var addCount = 0,
        removeCount = 0;
    for (; i < diffstr.length; i++) {
      // Lines starting with '---' could be mistaken for the "remove line" operation
      // But they could be the header for the next file. Therefore prune such cases out.
      if (diffstr[i].indexOf('--- ') === 0 && i + 2 < diffstr.length && diffstr[i + 1].indexOf('+++ ') === 0 && diffstr[i + 2].indexOf('@@') === 0) {
        break;
      }
      var operation = diffstr[i][0];

      if (operation === '+' || operation === '-' || operation === ' ' || operation === '\\') {
        hunk.lines.push(diffstr[i]);
        hunk.linedelimiters.push(delimiters[i] || '\n');

        if (operation === '+') {
          addCount++;
        } else if (operation === '-') {
          removeCount++;
        } else if (operation === ' ') {
          addCount++;
          removeCount++;
        }
      } else {
        break;
      }
    }

    // Handle the empty block count case
    if (!addCount && hunk.newLines === 1) {
      hunk.newLines = 0;
    }
    if (!removeCount && hunk.oldLines === 1) {
      hunk.oldLines = 0;
    }

    // Perform optional sanity checking
    if (options.strict) {
      if (addCount !== hunk.newLines) {
        throw new Error('Added line count did not match for hunk at line ' + (chunkHeaderIndex + 1));
      }
      if (removeCount !== hunk.oldLines) {
        throw new Error('Removed line count did not match for hunk at line ' + (chunkHeaderIndex + 1));
      }
    }

    return hunk;
  }

  while (i < diffstr.length) {
    parseIndex();
  }

  return list;
}

});

unwrapExports(parse);

var distanceIterator = createCommonjsModule(function (module, exports) {
/*istanbul ignore start*/"use strict";

exports.__esModule = true;

exports["default"] = /*istanbul ignore end*/function (start, minLine, maxLine) {
  var wantForward = true,
      backwardExhausted = false,
      forwardExhausted = false,
      localOffset = 1;

  return function iterator() {
    if (wantForward && !forwardExhausted) {
      if (backwardExhausted) {
        localOffset++;
      } else {
        wantForward = false;
      }

      // Check if trying to fit beyond text length, and if not, check it fits
      // after offset location (or desired location on first iteration)
      if (start + localOffset <= maxLine) {
        return localOffset;
      }

      forwardExhausted = true;
    }

    if (!backwardExhausted) {
      if (!forwardExhausted) {
        wantForward = true;
      }

      // Check if trying to fit before text beginning, and if not, check it fits
      // before offset location
      if (minLine <= start - localOffset) {
        return -localOffset++;
      }

      backwardExhausted = true;
      return iterator();
    }

    // We tried to fit hunk before text beginning and beyond text lenght, then
    // hunk can't fit on the text. Return undefined
  };
};

});

unwrapExports(distanceIterator);

var apply = createCommonjsModule(function (module, exports) {
/*istanbul ignore start*/'use strict';

exports.__esModule = true;
exports. /*istanbul ignore end*/applyPatch = applyPatch;
/*istanbul ignore start*/exports. /*istanbul ignore end*/applyPatches = applyPatches;





/*istanbul ignore start*/
var _distanceIterator2 = _interopRequireDefault(distanceIterator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/*istanbul ignore end*/function applyPatch(source, uniDiff) {
  /*istanbul ignore start*/var /*istanbul ignore end*/options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  if (typeof uniDiff === 'string') {
    uniDiff = /*istanbul ignore start*/(0, parse.parsePatch) /*istanbul ignore end*/(uniDiff);
  }

  if (Array.isArray(uniDiff)) {
    if (uniDiff.length > 1) {
      throw new Error('applyPatch only works with a single input.');
    }

    uniDiff = uniDiff[0];
  }

  // Apply the diff to the input
  var lines = source.split(/\r\n|[\n\v\f\r\x85]/),
      delimiters = source.match(/\r\n|[\n\v\f\r\x85]/g) || [],
      hunks = uniDiff.hunks,
      compareLine = options.compareLine || function (lineNumber, line, operation, patchContent) /*istanbul ignore start*/{
    return (/*istanbul ignore end*/line === patchContent
    );
  },
      errorCount = 0,
      fuzzFactor = options.fuzzFactor || 0,
      minLine = 0,
      offset = 0,
      removeEOFNL = /*istanbul ignore start*/void 0 /*istanbul ignore end*/,
      addEOFNL = /*istanbul ignore start*/void 0;

  /**
   * Checks if the hunk exactly fits on the provided location
   */
  function hunkFits(hunk, toPos) {
    for (var j = 0; j < hunk.lines.length; j++) {
      var line = hunk.lines[j],
          operation = line[0],
          content = line.substr(1);

      if (operation === ' ' || operation === '-') {
        // Context sanity check
        if (!compareLine(toPos + 1, lines[toPos], operation, content)) {
          errorCount++;

          if (errorCount > fuzzFactor) {
            return false;
          }
        }
        toPos++;
      }
    }

    return true;
  }

  // Search best fit offsets for each hunk based on the previous ones
  for (var i = 0; i < hunks.length; i++) {
    var hunk = hunks[i],
        maxLine = lines.length - hunk.oldLines,
        localOffset = 0,
        toPos = offset + hunk.oldStart - 1;

    var iterator = /*istanbul ignore start*/(0, _distanceIterator2['default']) /*istanbul ignore end*/(toPos, minLine, maxLine);

    for (; localOffset !== undefined; localOffset = iterator()) {
      if (hunkFits(hunk, toPos + localOffset)) {
        hunk.offset = offset += localOffset;
        break;
      }
    }

    if (localOffset === undefined) {
      return false;
    }

    // Set lower text limit to end of the current hunk, so next ones don't try
    // to fit over already patched text
    minLine = hunk.offset + hunk.oldStart + hunk.oldLines;
  }

  // Apply patch hunks
  for (var _i = 0; _i < hunks.length; _i++) {
    var _hunk = hunks[_i],
        _toPos = _hunk.offset + _hunk.newStart - 1;
    if (_hunk.newLines == 0) {
      _toPos++;
    }

    for (var j = 0; j < _hunk.lines.length; j++) {
      var line = _hunk.lines[j],
          operation = line[0],
          content = line.substr(1),
          delimiter = _hunk.linedelimiters[j];

      if (operation === ' ') {
        _toPos++;
      } else if (operation === '-') {
        lines.splice(_toPos, 1);
        delimiters.splice(_toPos, 1);
        /* istanbul ignore else */
      } else if (operation === '+') {
          lines.splice(_toPos, 0, content);
          delimiters.splice(_toPos, 0, delimiter);
          _toPos++;
        } else if (operation === '\\') {
          var previousOperation = _hunk.lines[j - 1] ? _hunk.lines[j - 1][0] : null;
          if (previousOperation === '+') {
            removeEOFNL = true;
          } else if (previousOperation === '-') {
            addEOFNL = true;
          }
        }
    }
  }

  // Handle EOFNL insertion/removal
  if (removeEOFNL) {
    while (!lines[lines.length - 1]) {
      lines.pop();
      delimiters.pop();
    }
  } else if (addEOFNL) {
    lines.push('');
    delimiters.push('\n');
  }
  for (var _k = 0; _k < lines.length - 1; _k++) {
    lines[_k] = lines[_k] + delimiters[_k];
  }
  return lines.join('');
}

// Wrapper that supports multiple file patches via callbacks.
function applyPatches(uniDiff, options) {
  if (typeof uniDiff === 'string') {
    uniDiff = /*istanbul ignore start*/(0, parse.parsePatch) /*istanbul ignore end*/(uniDiff);
  }

  var currentIndex = 0;
  function processIndex() {
    var index = uniDiff[currentIndex++];
    if (!index) {
      return options.complete();
    }

    options.loadFile(index, function (err, data) {
      if (err) {
        return options.complete(err);
      }

      var updatedContent = applyPatch(data, index, options);
      options.patched(index, updatedContent, function (err) {
        if (err) {
          return options.complete(err);
        }

        processIndex();
      });
    });
  }
  processIndex();
}

});

unwrapExports(apply);

var create = createCommonjsModule(function (module, exports) {
/*istanbul ignore start*/'use strict';

exports.__esModule = true;
exports. /*istanbul ignore end*/structuredPatch = structuredPatch;
/*istanbul ignore start*/exports. /*istanbul ignore end*/createTwoFilesPatch = createTwoFilesPatch;
/*istanbul ignore start*/exports. /*istanbul ignore end*/createPatch = createPatch;



/*istanbul ignore start*/
function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/*istanbul ignore end*/function structuredPatch(oldFileName, newFileName, oldStr, newStr, oldHeader, newHeader, options) {
  if (!options) {
    options = {};
  }
  if (typeof options.context === 'undefined') {
    options.context = 4;
  }

  var diff = /*istanbul ignore start*/(0, line.diffLines) /*istanbul ignore end*/(oldStr, newStr, options);
  diff.push({ value: '', lines: [] }); // Append an empty value to make cleanup easier

  function contextLines(lines) {
    return lines.map(function (entry) {
      return ' ' + entry;
    });
  }

  var hunks = [];
  var oldRangeStart = 0,
      newRangeStart = 0,
      curRange = [],
      oldLine = 1,
      newLine = 1;
  /*istanbul ignore start*/
  var _loop = function _loop( /*istanbul ignore end*/i) {
    var current = diff[i],
        lines = current.lines || current.value.replace(/\n$/, '').split('\n');
    current.lines = lines;

    if (current.added || current.removed) {
      /*istanbul ignore start*/
      var _curRange;

      /*istanbul ignore end*/
      // If we have previous context, start with that
      if (!oldRangeStart) {
        var prev = diff[i - 1];
        oldRangeStart = oldLine;
        newRangeStart = newLine;

        if (prev) {
          curRange = options.context > 0 ? contextLines(prev.lines.slice(-options.context)) : [];
          oldRangeStart -= curRange.length;
          newRangeStart -= curRange.length;
        }
      }

      // Output our changes
      /*istanbul ignore start*/(_curRange = /*istanbul ignore end*/curRange).push. /*istanbul ignore start*/apply /*istanbul ignore end*/( /*istanbul ignore start*/_curRange /*istanbul ignore end*/, /*istanbul ignore start*/_toConsumableArray( /*istanbul ignore end*/lines.map(function (entry) {
        return (current.added ? '+' : '-') + entry;
      })));

      // Track the updated file position
      if (current.added) {
        newLine += lines.length;
      } else {
        oldLine += lines.length;
      }
    } else {
      // Identical context lines. Track line changes
      if (oldRangeStart) {
        // Close out any changes that have been output (or join overlapping)
        if (lines.length <= options.context * 2 && i < diff.length - 2) {
          /*istanbul ignore start*/
          var _curRange2;

          /*istanbul ignore end*/
          // Overlapping
          /*istanbul ignore start*/(_curRange2 = /*istanbul ignore end*/curRange).push. /*istanbul ignore start*/apply /*istanbul ignore end*/( /*istanbul ignore start*/_curRange2 /*istanbul ignore end*/, /*istanbul ignore start*/_toConsumableArray( /*istanbul ignore end*/contextLines(lines)));
        } else {
          /*istanbul ignore start*/
          var _curRange3;

          /*istanbul ignore end*/
          // end the range and output
          var contextSize = Math.min(lines.length, options.context);
          /*istanbul ignore start*/(_curRange3 = /*istanbul ignore end*/curRange).push. /*istanbul ignore start*/apply /*istanbul ignore end*/( /*istanbul ignore start*/_curRange3 /*istanbul ignore end*/, /*istanbul ignore start*/_toConsumableArray( /*istanbul ignore end*/contextLines(lines.slice(0, contextSize))));

          var hunk = {
            oldStart: oldRangeStart,
            oldLines: oldLine - oldRangeStart + contextSize,
            newStart: newRangeStart,
            newLines: newLine - newRangeStart + contextSize,
            lines: curRange
          };
          if (i >= diff.length - 2 && lines.length <= options.context) {
            // EOF is inside this hunk
            var oldEOFNewline = /\n$/.test(oldStr);
            var newEOFNewline = /\n$/.test(newStr);
            if (lines.length == 0 && !oldEOFNewline) {
              // special case: old has no eol and no trailing context; no-nl can end up before adds
              curRange.splice(hunk.oldLines, 0, '\\ No newline at end of file');
            } else if (!oldEOFNewline || !newEOFNewline) {
              curRange.push('\\ No newline at end of file');
            }
          }
          hunks.push(hunk);

          oldRangeStart = 0;
          newRangeStart = 0;
          curRange = [];
        }
      }
      oldLine += lines.length;
      newLine += lines.length;
    }
  };

  for (var i = 0; i < diff.length; i++) {
    /*istanbul ignore start*/
    _loop( /*istanbul ignore end*/i);
  }

  return {
    oldFileName: oldFileName, newFileName: newFileName,
    oldHeader: oldHeader, newHeader: newHeader,
    hunks: hunks
  };
}

function createTwoFilesPatch(oldFileName, newFileName, oldStr, newStr, oldHeader, newHeader, options) {
  var diff = structuredPatch(oldFileName, newFileName, oldStr, newStr, oldHeader, newHeader, options);

  var ret = [];
  if (oldFileName == newFileName) {
    ret.push('Index: ' + oldFileName);
  }
  ret.push('===================================================================');
  ret.push('--- ' + diff.oldFileName + (typeof diff.oldHeader === 'undefined' ? '' : '\t' + diff.oldHeader));
  ret.push('+++ ' + diff.newFileName + (typeof diff.newHeader === 'undefined' ? '' : '\t' + diff.newHeader));

  for (var i = 0; i < diff.hunks.length; i++) {
    var hunk = diff.hunks[i];
    ret.push('@@ -' + hunk.oldStart + ',' + hunk.oldLines + ' +' + hunk.newStart + ',' + hunk.newLines + ' @@');
    ret.push.apply(ret, hunk.lines);
  }

  return ret.join('\n') + '\n';
}

function createPatch(fileName, oldStr, newStr, oldHeader, newHeader, options) {
  return createTwoFilesPatch(fileName, fileName, oldStr, newStr, oldHeader, newHeader, options);
}

});

unwrapExports(create);

var dmp = createCommonjsModule(function (module, exports) {
/*istanbul ignore start*/"use strict";

exports.__esModule = true;
exports. /*istanbul ignore end*/convertChangesToDMP = convertChangesToDMP;
// See: http://code.google.com/p/google-diff-match-patch/wiki/API
function convertChangesToDMP(changes) {
  var ret = [],
      change = /*istanbul ignore start*/void 0 /*istanbul ignore end*/,
      operation = /*istanbul ignore start*/void 0;
  for (var i = 0; i < changes.length; i++) {
    change = changes[i];
    if (change.added) {
      operation = 1;
    } else if (change.removed) {
      operation = -1;
    } else {
      operation = 0;
    }

    ret.push([operation, change.value]);
  }
  return ret;
}

});

unwrapExports(dmp);

var xml = createCommonjsModule(function (module, exports) {
/*istanbul ignore start*/'use strict';

exports.__esModule = true;
exports. /*istanbul ignore end*/convertChangesToXML = convertChangesToXML;
function convertChangesToXML(changes) {
  var ret = [];
  for (var i = 0; i < changes.length; i++) {
    var change = changes[i];
    if (change.added) {
      ret.push('<ins>');
    } else if (change.removed) {
      ret.push('<del>');
    }

    ret.push(escapeHTML(change.value));

    if (change.added) {
      ret.push('</ins>');
    } else if (change.removed) {
      ret.push('</del>');
    }
  }
  return ret.join('');
}

function escapeHTML(s) {
  var n = s;
  n = n.replace(/&/g, '&amp;');
  n = n.replace(/</g, '&lt;');
  n = n.replace(/>/g, '&gt;');
  n = n.replace(/"/g, '&quot;');

  return n;
}

});

unwrapExports(xml);

var lib = createCommonjsModule(function (module, exports) {
/*istanbul ignore start*/'use strict';

exports.__esModule = true;
exports.canonicalize = exports.convertChangesToXML = exports.convertChangesToDMP = exports.parsePatch = exports.applyPatches = exports.applyPatch = exports.createPatch = exports.createTwoFilesPatch = exports.structuredPatch = exports.diffArrays = exports.diffJson = exports.diffCss = exports.diffSentences = exports.diffTrimmedLines = exports.diffLines = exports.diffWordsWithSpace = exports.diffWords = exports.diffChars = exports.Diff = undefined;
/*istanbul ignore end*/


/*istanbul ignore start*/
var _base2 = _interopRequireDefault(base);

/*istanbul ignore end*/
























/*istanbul ignore start*/
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports. /*istanbul ignore end*/Diff = _base2['default'];
/*istanbul ignore start*/exports. /*istanbul ignore end*/diffChars = character.diffChars;
/*istanbul ignore start*/exports. /*istanbul ignore end*/diffWords = word.diffWords;
/*istanbul ignore start*/exports. /*istanbul ignore end*/diffWordsWithSpace = word.diffWordsWithSpace;
/*istanbul ignore start*/exports. /*istanbul ignore end*/diffLines = line.diffLines;
/*istanbul ignore start*/exports. /*istanbul ignore end*/diffTrimmedLines = line.diffTrimmedLines;
/*istanbul ignore start*/exports. /*istanbul ignore end*/diffSentences = sentence.diffSentences;
/*istanbul ignore start*/exports. /*istanbul ignore end*/diffCss = css.diffCss;
/*istanbul ignore start*/exports. /*istanbul ignore end*/diffJson = json.diffJson;
/*istanbul ignore start*/exports. /*istanbul ignore end*/diffArrays = array.diffArrays;
/*istanbul ignore start*/exports. /*istanbul ignore end*/structuredPatch = create.structuredPatch;
/*istanbul ignore start*/exports. /*istanbul ignore end*/createTwoFilesPatch = create.createTwoFilesPatch;
/*istanbul ignore start*/exports. /*istanbul ignore end*/createPatch = create.createPatch;
/*istanbul ignore start*/exports. /*istanbul ignore end*/applyPatch = apply.applyPatch;
/*istanbul ignore start*/exports. /*istanbul ignore end*/applyPatches = apply.applyPatches;
/*istanbul ignore start*/exports. /*istanbul ignore end*/parsePatch = parse.parsePatch;
/*istanbul ignore start*/exports. /*istanbul ignore end*/convertChangesToDMP = dmp.convertChangesToDMP;
/*istanbul ignore start*/exports. /*istanbul ignore end*/convertChangesToXML = xml.convertChangesToXML;
/*istanbul ignore start*/exports. /*istanbul ignore end*/canonicalize = json.canonicalize; /* See LICENSE file for terms of use */

/*
 * Text diff implementation.
 *
 * This library supports the following APIS:
 * JsDiff.diffChars: Character by character diff
 * JsDiff.diffWords: Word (as defined by \b regex) diff which ignores whitespace
 * JsDiff.diffLines: Line based diff
 *
 * JsDiff.diffCss: Diff targeted at CSS content
 *
 * These methods are based on the implementation proposed in
 * "An O(ND) Difference Algorithm and its Variations" (Myers, 1986).
 * http://citeseerx.ist.psu.edu/viewdoc/summary?doi=10.1.1.4.6927
 */

});

unwrapExports(lib);

var semver = createCommonjsModule(function (module, exports) {
exports = module.exports = SemVer;

// The debug function is excluded entirely from the minified version.
/* nomin */ var debug;
/* nomin */ if (typeof process === 'object' &&
    /* nomin */ process.env &&
    /* nomin */ process.env.NODE_DEBUG &&
    /* nomin */ /\bsemver\b/i.test(process.env.NODE_DEBUG))
  /* nomin */ debug = function() {
    /* nomin */ var args = Array.prototype.slice.call(arguments, 0);
    /* nomin */ args.unshift('SEMVER');
    /* nomin */ console.log.apply(console, args);
    /* nomin */ };
/* nomin */ else
  /* nomin */ debug = function() {};

// Note: this is the semver.org version of the spec that it implements
// Not necessarily the package version of this code.
exports.SEMVER_SPEC_VERSION = '2.0.0';

var MAX_LENGTH = 256;
var MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || 9007199254740991;

// The actual regexps go on exports.re
var re = exports.re = [];
var src = exports.src = [];
var R = 0;

// The following Regular Expressions can be used for tokenizing,
// validating, and parsing SemVer version strings.

// ## Numeric Identifier
// A single `0`, or a non-zero digit followed by zero or more digits.

var NUMERICIDENTIFIER = R++;
src[NUMERICIDENTIFIER] = '0|[1-9]\\d*';
var NUMERICIDENTIFIERLOOSE = R++;
src[NUMERICIDENTIFIERLOOSE] = '[0-9]+';


// ## Non-numeric Identifier
// Zero or more digits, followed by a letter or hyphen, and then zero or
// more letters, digits, or hyphens.

var NONNUMERICIDENTIFIER = R++;
src[NONNUMERICIDENTIFIER] = '\\d*[a-zA-Z-][a-zA-Z0-9-]*';


// ## Main Version
// Three dot-separated numeric identifiers.

var MAINVERSION = R++;
src[MAINVERSION] = '(' + src[NUMERICIDENTIFIER] + ')\\.' +
                   '(' + src[NUMERICIDENTIFIER] + ')\\.' +
                   '(' + src[NUMERICIDENTIFIER] + ')';

var MAINVERSIONLOOSE = R++;
src[MAINVERSIONLOOSE] = '(' + src[NUMERICIDENTIFIERLOOSE] + ')\\.' +
                        '(' + src[NUMERICIDENTIFIERLOOSE] + ')\\.' +
                        '(' + src[NUMERICIDENTIFIERLOOSE] + ')';

// ## Pre-release Version Identifier
// A numeric identifier, or a non-numeric identifier.

var PRERELEASEIDENTIFIER = R++;
src[PRERELEASEIDENTIFIER] = '(?:' + src[NUMERICIDENTIFIER] +
                            '|' + src[NONNUMERICIDENTIFIER] + ')';

var PRERELEASEIDENTIFIERLOOSE = R++;
src[PRERELEASEIDENTIFIERLOOSE] = '(?:' + src[NUMERICIDENTIFIERLOOSE] +
                                 '|' + src[NONNUMERICIDENTIFIER] + ')';


// ## Pre-release Version
// Hyphen, followed by one or more dot-separated pre-release version
// identifiers.

var PRERELEASE = R++;
src[PRERELEASE] = '(?:-(' + src[PRERELEASEIDENTIFIER] +
                  '(?:\\.' + src[PRERELEASEIDENTIFIER] + ')*))';

var PRERELEASELOOSE = R++;
src[PRERELEASELOOSE] = '(?:-?(' + src[PRERELEASEIDENTIFIERLOOSE] +
                       '(?:\\.' + src[PRERELEASEIDENTIFIERLOOSE] + ')*))';

// ## Build Metadata Identifier
// Any combination of digits, letters, or hyphens.

var BUILDIDENTIFIER = R++;
src[BUILDIDENTIFIER] = '[0-9A-Za-z-]+';

// ## Build Metadata
// Plus sign, followed by one or more period-separated build metadata
// identifiers.

var BUILD = R++;
src[BUILD] = '(?:\\+(' + src[BUILDIDENTIFIER] +
             '(?:\\.' + src[BUILDIDENTIFIER] + ')*))';


// ## Full Version String
// A main version, followed optionally by a pre-release version and
// build metadata.

// Note that the only major, minor, patch, and pre-release sections of
// the version string are capturing groups.  The build metadata is not a
// capturing group, because it should not ever be used in version
// comparison.

var FULL = R++;
var FULLPLAIN = 'v?' + src[MAINVERSION] +
                src[PRERELEASE] + '?' +
                src[BUILD] + '?';

src[FULL] = '^' + FULLPLAIN + '$';

// like full, but allows v1.2.3 and =1.2.3, which people do sometimes.
// also, 1.0.0alpha1 (prerelease without the hyphen) which is pretty
// common in the npm registry.
var LOOSEPLAIN = '[v=\\s]*' + src[MAINVERSIONLOOSE] +
                 src[PRERELEASELOOSE] + '?' +
                 src[BUILD] + '?';

var LOOSE = R++;
src[LOOSE] = '^' + LOOSEPLAIN + '$';

var GTLT = R++;
src[GTLT] = '((?:<|>)?=?)';

// Something like "2.*" or "1.2.x".
// Note that "x.x" is a valid xRange identifer, meaning "any version"
// Only the first item is strictly required.
var XRANGEIDENTIFIERLOOSE = R++;
src[XRANGEIDENTIFIERLOOSE] = src[NUMERICIDENTIFIERLOOSE] + '|x|X|\\*';
var XRANGEIDENTIFIER = R++;
src[XRANGEIDENTIFIER] = src[NUMERICIDENTIFIER] + '|x|X|\\*';

var XRANGEPLAIN = R++;
src[XRANGEPLAIN] = '[v=\\s]*(' + src[XRANGEIDENTIFIER] + ')' +
                   '(?:\\.(' + src[XRANGEIDENTIFIER] + ')' +
                   '(?:\\.(' + src[XRANGEIDENTIFIER] + ')' +
                   '(?:' + src[PRERELEASE] + ')?' +
                   src[BUILD] + '?' +
                   ')?)?';

var XRANGEPLAINLOOSE = R++;
src[XRANGEPLAINLOOSE] = '[v=\\s]*(' + src[XRANGEIDENTIFIERLOOSE] + ')' +
                        '(?:\\.(' + src[XRANGEIDENTIFIERLOOSE] + ')' +
                        '(?:\\.(' + src[XRANGEIDENTIFIERLOOSE] + ')' +
                        '(?:' + src[PRERELEASELOOSE] + ')?' +
                        src[BUILD] + '?' +
                        ')?)?';

var XRANGE = R++;
src[XRANGE] = '^' + src[GTLT] + '\\s*' + src[XRANGEPLAIN] + '$';
var XRANGELOOSE = R++;
src[XRANGELOOSE] = '^' + src[GTLT] + '\\s*' + src[XRANGEPLAINLOOSE] + '$';

// Tilde ranges.
// Meaning is "reasonably at or greater than"
var LONETILDE = R++;
src[LONETILDE] = '(?:~>?)';

var TILDETRIM = R++;
src[TILDETRIM] = '(\\s*)' + src[LONETILDE] + '\\s+';
re[TILDETRIM] = new RegExp(src[TILDETRIM], 'g');
var tildeTrimReplace = '$1~';

var TILDE = R++;
src[TILDE] = '^' + src[LONETILDE] + src[XRANGEPLAIN] + '$';
var TILDELOOSE = R++;
src[TILDELOOSE] = '^' + src[LONETILDE] + src[XRANGEPLAINLOOSE] + '$';

// Caret ranges.
// Meaning is "at least and backwards compatible with"
var LONECARET = R++;
src[LONECARET] = '(?:\\^)';

var CARETTRIM = R++;
src[CARETTRIM] = '(\\s*)' + src[LONECARET] + '\\s+';
re[CARETTRIM] = new RegExp(src[CARETTRIM], 'g');
var caretTrimReplace = '$1^';

var CARET = R++;
src[CARET] = '^' + src[LONECARET] + src[XRANGEPLAIN] + '$';
var CARETLOOSE = R++;
src[CARETLOOSE] = '^' + src[LONECARET] + src[XRANGEPLAINLOOSE] + '$';

// A simple gt/lt/eq thing, or just "" to indicate "any version"
var COMPARATORLOOSE = R++;
src[COMPARATORLOOSE] = '^' + src[GTLT] + '\\s*(' + LOOSEPLAIN + ')$|^$';
var COMPARATOR = R++;
src[COMPARATOR] = '^' + src[GTLT] + '\\s*(' + FULLPLAIN + ')$|^$';


// An expression to strip any whitespace between the gtlt and the thing
// it modifies, so that `> 1.2.3` ==> `>1.2.3`
var COMPARATORTRIM = R++;
src[COMPARATORTRIM] = '(\\s*)' + src[GTLT] +
                      '\\s*(' + LOOSEPLAIN + '|' + src[XRANGEPLAIN] + ')';

// this one has to use the /g flag
re[COMPARATORTRIM] = new RegExp(src[COMPARATORTRIM], 'g');
var comparatorTrimReplace = '$1$2$3';


// Something like `1.2.3 - 1.2.4`
// Note that these all use the loose form, because they'll be
// checked against either the strict or loose comparator form
// later.
var HYPHENRANGE = R++;
src[HYPHENRANGE] = '^\\s*(' + src[XRANGEPLAIN] + ')' +
                   '\\s+-\\s+' +
                   '(' + src[XRANGEPLAIN] + ')' +
                   '\\s*$';

var HYPHENRANGELOOSE = R++;
src[HYPHENRANGELOOSE] = '^\\s*(' + src[XRANGEPLAINLOOSE] + ')' +
                        '\\s+-\\s+' +
                        '(' + src[XRANGEPLAINLOOSE] + ')' +
                        '\\s*$';

// Star ranges basically just allow anything at all.
var STAR = R++;
src[STAR] = '(<|>)?=?\\s*\\*';

// Compile to actual regexp objects.
// All are flag-free, unless they were created above with a flag.
for (var i = 0; i < R; i++) {
  debug(i, src[i]);
  if (!re[i])
    re[i] = new RegExp(src[i]);
}

exports.parse = parse;
function parse(version, loose) {
  if (version instanceof SemVer)
    return version;

  if (typeof version !== 'string')
    return null;

  if (version.length > MAX_LENGTH)
    return null;

  var r = loose ? re[LOOSE] : re[FULL];
  if (!r.test(version))
    return null;

  try {
    return new SemVer(version, loose);
  } catch (er) {
    return null;
  }
}

exports.valid = valid;
function valid(version, loose) {
  var v = parse(version, loose);
  return v ? v.version : null;
}


exports.clean = clean;
function clean(version, loose) {
  var s = parse(version.trim().replace(/^[=v]+/, ''), loose);
  return s ? s.version : null;
}

exports.SemVer = SemVer;

function SemVer(version, loose) {
  if (version instanceof SemVer) {
    if (version.loose === loose)
      return version;
    else
      version = version.version;
  } else if (typeof version !== 'string') {
    throw new TypeError('Invalid Version: ' + version);
  }

  if (version.length > MAX_LENGTH)
    throw new TypeError('version is longer than ' + MAX_LENGTH + ' characters')

  if (!(this instanceof SemVer))
    return new SemVer(version, loose);

  debug('SemVer', version, loose);
  this.loose = loose;
  var m = version.trim().match(loose ? re[LOOSE] : re[FULL]);

  if (!m)
    throw new TypeError('Invalid Version: ' + version);

  this.raw = version;

  // these are actually numbers
  this.major = +m[1];
  this.minor = +m[2];
  this.patch = +m[3];

  if (this.major > MAX_SAFE_INTEGER || this.major < 0)
    throw new TypeError('Invalid major version')

  if (this.minor > MAX_SAFE_INTEGER || this.minor < 0)
    throw new TypeError('Invalid minor version')

  if (this.patch > MAX_SAFE_INTEGER || this.patch < 0)
    throw new TypeError('Invalid patch version')

  // numberify any prerelease numeric ids
  if (!m[4])
    this.prerelease = [];
  else
    this.prerelease = m[4].split('.').map(function(id) {
      if (/^[0-9]+$/.test(id)) {
        var num = +id;
        if (num >= 0 && num < MAX_SAFE_INTEGER)
          return num;
      }
      return id;
    });

  this.build = m[5] ? m[5].split('.') : [];
  this.format();
}

SemVer.prototype.format = function() {
  this.version = this.major + '.' + this.minor + '.' + this.patch;
  if (this.prerelease.length)
    this.version += '-' + this.prerelease.join('.');
  return this.version;
};

SemVer.prototype.toString = function() {
  return this.version;
};

SemVer.prototype.compare = function(other) {
  debug('SemVer.compare', this.version, this.loose, other);
  if (!(other instanceof SemVer))
    other = new SemVer(other, this.loose);

  return this.compareMain(other) || this.comparePre(other);
};

SemVer.prototype.compareMain = function(other) {
  if (!(other instanceof SemVer))
    other = new SemVer(other, this.loose);

  return compareIdentifiers(this.major, other.major) ||
         compareIdentifiers(this.minor, other.minor) ||
         compareIdentifiers(this.patch, other.patch);
};

SemVer.prototype.comparePre = function(other) {
  if (!(other instanceof SemVer))
    other = new SemVer(other, this.loose);

  // NOT having a prerelease is > having one
  if (this.prerelease.length && !other.prerelease.length)
    return -1;
  else if (!this.prerelease.length && other.prerelease.length)
    return 1;
  else if (!this.prerelease.length && !other.prerelease.length)
    return 0;

  var i = 0;
  do {
    var a = this.prerelease[i];
    var b = other.prerelease[i];
    debug('prerelease compare', i, a, b);
    if (a === undefined && b === undefined)
      return 0;
    else if (b === undefined)
      return 1;
    else if (a === undefined)
      return -1;
    else if (a === b)
      continue;
    else
      return compareIdentifiers(a, b);
  } while (++i);
};

// preminor will bump the version up to the next minor release, and immediately
// down to pre-release. premajor and prepatch work the same way.
SemVer.prototype.inc = function(release, identifier) {
  switch (release) {
    case 'premajor':
      this.prerelease.length = 0;
      this.patch = 0;
      this.minor = 0;
      this.major++;
      this.inc('pre', identifier);
      break;
    case 'preminor':
      this.prerelease.length = 0;
      this.patch = 0;
      this.minor++;
      this.inc('pre', identifier);
      break;
    case 'prepatch':
      // If this is already a prerelease, it will bump to the next version
      // drop any prereleases that might already exist, since they are not
      // relevant at this point.
      this.prerelease.length = 0;
      this.inc('patch', identifier);
      this.inc('pre', identifier);
      break;
    // If the input is a non-prerelease version, this acts the same as
    // prepatch.
    case 'prerelease':
      if (this.prerelease.length === 0)
        this.inc('patch', identifier);
      this.inc('pre', identifier);
      break;

    case 'major':
      // If this is a pre-major version, bump up to the same major version.
      // Otherwise increment major.
      // 1.0.0-5 bumps to 1.0.0
      // 1.1.0 bumps to 2.0.0
      if (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0)
        this.major++;
      this.minor = 0;
      this.patch = 0;
      this.prerelease = [];
      break;
    case 'minor':
      // If this is a pre-minor version, bump up to the same minor version.
      // Otherwise increment minor.
      // 1.2.0-5 bumps to 1.2.0
      // 1.2.1 bumps to 1.3.0
      if (this.patch !== 0 || this.prerelease.length === 0)
        this.minor++;
      this.patch = 0;
      this.prerelease = [];
      break;
    case 'patch':
      // If this is not a pre-release version, it will increment the patch.
      // If it is a pre-release it will bump up to the same patch version.
      // 1.2.0-5 patches to 1.2.0
      // 1.2.0 patches to 1.2.1
      if (this.prerelease.length === 0)
        this.patch++;
      this.prerelease = [];
      break;
    // This probably shouldn't be used publicly.
    // 1.0.0 "pre" would become 1.0.0-0 which is the wrong direction.
    case 'pre':
      if (this.prerelease.length === 0)
        this.prerelease = [0];
      else {
        var i = this.prerelease.length;
        while (--i >= 0) {
          if (typeof this.prerelease[i] === 'number') {
            this.prerelease[i]++;
            i = -2;
          }
        }
        if (i === -1) // didn't increment anything
          this.prerelease.push(0);
      }
      if (identifier) {
        // 1.2.0-beta.1 bumps to 1.2.0-beta.2,
        // 1.2.0-beta.fooblz or 1.2.0-beta bumps to 1.2.0-beta.0
        if (this.prerelease[0] === identifier) {
          if (isNaN(this.prerelease[1]))
            this.prerelease = [identifier, 0];
        } else
          this.prerelease = [identifier, 0];
      }
      break;

    default:
      throw new Error('invalid increment argument: ' + release);
  }
  this.format();
  this.raw = this.version;
  return this;
};

exports.inc = inc;
function inc(version, release, loose, identifier) {
  if (typeof(loose) === 'string') {
    identifier = loose;
    loose = undefined;
  }

  try {
    return new SemVer(version, loose).inc(release, identifier).version;
  } catch (er) {
    return null;
  }
}

exports.diff = diff;
function diff(version1, version2) {
  if (eq(version1, version2)) {
    return null;
  } else {
    var v1 = parse(version1);
    var v2 = parse(version2);
    if (v1.prerelease.length || v2.prerelease.length) {
      for (var key in v1) {
        if (key === 'major' || key === 'minor' || key === 'patch') {
          if (v1[key] !== v2[key]) {
            return 'pre'+key;
          }
        }
      }
      return 'prerelease';
    }
    for (var key in v1) {
      if (key === 'major' || key === 'minor' || key === 'patch') {
        if (v1[key] !== v2[key]) {
          return key;
        }
      }
    }
  }
}

exports.compareIdentifiers = compareIdentifiers;

var numeric = /^[0-9]+$/;
function compareIdentifiers(a, b) {
  var anum = numeric.test(a);
  var bnum = numeric.test(b);

  if (anum && bnum) {
    a = +a;
    b = +b;
  }

  return (anum && !bnum) ? -1 :
         (bnum && !anum) ? 1 :
         a < b ? -1 :
         a > b ? 1 :
         0;
}

exports.rcompareIdentifiers = rcompareIdentifiers;
function rcompareIdentifiers(a, b) {
  return compareIdentifiers(b, a);
}

exports.major = major;
function major(a, loose) {
  return new SemVer(a, loose).major;
}

exports.minor = minor;
function minor(a, loose) {
  return new SemVer(a, loose).minor;
}

exports.patch = patch;
function patch(a, loose) {
  return new SemVer(a, loose).patch;
}

exports.compare = compare;
function compare(a, b, loose) {
  return new SemVer(a, loose).compare(new SemVer(b, loose));
}

exports.compareLoose = compareLoose;
function compareLoose(a, b) {
  return compare(a, b, true);
}

exports.rcompare = rcompare;
function rcompare(a, b, loose) {
  return compare(b, a, loose);
}

exports.sort = sort;
function sort(list, loose) {
  return list.sort(function(a, b) {
    return exports.compare(a, b, loose);
  });
}

exports.rsort = rsort;
function rsort(list, loose) {
  return list.sort(function(a, b) {
    return exports.rcompare(a, b, loose);
  });
}

exports.gt = gt;
function gt(a, b, loose) {
  return compare(a, b, loose) > 0;
}

exports.lt = lt;
function lt(a, b, loose) {
  return compare(a, b, loose) < 0;
}

exports.eq = eq;
function eq(a, b, loose) {
  return compare(a, b, loose) === 0;
}

exports.neq = neq;
function neq(a, b, loose) {
  return compare(a, b, loose) !== 0;
}

exports.gte = gte;
function gte(a, b, loose) {
  return compare(a, b, loose) >= 0;
}

exports.lte = lte;
function lte(a, b, loose) {
  return compare(a, b, loose) <= 0;
}

exports.cmp = cmp;
function cmp(a, op, b, loose) {
  var ret;
  switch (op) {
    case '===':
      if (typeof a === 'object') a = a.version;
      if (typeof b === 'object') b = b.version;
      ret = a === b;
      break;
    case '!==':
      if (typeof a === 'object') a = a.version;
      if (typeof b === 'object') b = b.version;
      ret = a !== b;
      break;
    case '': case '=': case '==': ret = eq(a, b, loose); break;
    case '!=': ret = neq(a, b, loose); break;
    case '>': ret = gt(a, b, loose); break;
    case '>=': ret = gte(a, b, loose); break;
    case '<': ret = lt(a, b, loose); break;
    case '<=': ret = lte(a, b, loose); break;
    default: throw new TypeError('Invalid operator: ' + op);
  }
  return ret;
}

exports.Comparator = Comparator;
function Comparator(comp, loose) {
  if (comp instanceof Comparator) {
    if (comp.loose === loose)
      return comp;
    else
      comp = comp.value;
  }

  if (!(this instanceof Comparator))
    return new Comparator(comp, loose);

  debug('comparator', comp, loose);
  this.loose = loose;
  this.parse(comp);

  if (this.semver === ANY)
    this.value = '';
  else
    this.value = this.operator + this.semver.version;

  debug('comp', this);
}

var ANY = {};
Comparator.prototype.parse = function(comp) {
  var r = this.loose ? re[COMPARATORLOOSE] : re[COMPARATOR];
  var m = comp.match(r);

  if (!m)
    throw new TypeError('Invalid comparator: ' + comp);

  this.operator = m[1];
  if (this.operator === '=')
    this.operator = '';

  // if it literally is just '>' or '' then allow anything.
  if (!m[2])
    this.semver = ANY;
  else
    this.semver = new SemVer(m[2], this.loose);
};

Comparator.prototype.toString = function() {
  return this.value;
};

Comparator.prototype.test = function(version) {
  debug('Comparator.test', version, this.loose);

  if (this.semver === ANY)
    return true;

  if (typeof version === 'string')
    version = new SemVer(version, this.loose);

  return cmp(version, this.operator, this.semver, this.loose);
};

Comparator.prototype.intersects = function(comp, loose) {
  if (!(comp instanceof Comparator)) {
    throw new TypeError('a Comparator is required');
  }

  var rangeTmp;

  if (this.operator === '') {
    rangeTmp = new Range(comp.value, loose);
    return satisfies(this.value, rangeTmp, loose);
  } else if (comp.operator === '') {
    rangeTmp = new Range(this.value, loose);
    return satisfies(comp.semver, rangeTmp, loose);
  }

  var sameDirectionIncreasing =
    (this.operator === '>=' || this.operator === '>') &&
    (comp.operator === '>=' || comp.operator === '>');
  var sameDirectionDecreasing =
    (this.operator === '<=' || this.operator === '<') &&
    (comp.operator === '<=' || comp.operator === '<');
  var sameSemVer = this.semver.version === comp.semver.version;
  var differentDirectionsInclusive =
    (this.operator === '>=' || this.operator === '<=') &&
    (comp.operator === '>=' || comp.operator === '<=');
  var oppositeDirectionsLessThan =
    cmp(this.semver, '<', comp.semver, loose) &&
    ((this.operator === '>=' || this.operator === '>') &&
    (comp.operator === '<=' || comp.operator === '<'));
  var oppositeDirectionsGreaterThan =
    cmp(this.semver, '>', comp.semver, loose) &&
    ((this.operator === '<=' || this.operator === '<') &&
    (comp.operator === '>=' || comp.operator === '>'));

  return sameDirectionIncreasing || sameDirectionDecreasing ||
    (sameSemVer && differentDirectionsInclusive) ||
    oppositeDirectionsLessThan || oppositeDirectionsGreaterThan;
};


exports.Range = Range;
function Range(range, loose) {
  if (range instanceof Range) {
    if (range.loose === loose) {
      return range;
    } else {
      return new Range(range.raw, loose);
    }
  }

  if (range instanceof Comparator) {
    return new Range(range.value, loose);
  }

  if (!(this instanceof Range))
    return new Range(range, loose);

  this.loose = loose;

  // First, split based on boolean or ||
  this.raw = range;
  this.set = range.split(/\s*\|\|\s*/).map(function(range) {
    return this.parseRange(range.trim());
  }, this).filter(function(c) {
    // throw out any that are not relevant for whatever reason
    return c.length;
  });

  if (!this.set.length) {
    throw new TypeError('Invalid SemVer Range: ' + range);
  }

  this.format();
}

Range.prototype.format = function() {
  this.range = this.set.map(function(comps) {
    return comps.join(' ').trim();
  }).join('||').trim();
  return this.range;
};

Range.prototype.toString = function() {
  return this.range;
};

Range.prototype.parseRange = function(range) {
  var loose = this.loose;
  range = range.trim();
  debug('range', range, loose);
  // `1.2.3 - 1.2.4` => `>=1.2.3 <=1.2.4`
  var hr = loose ? re[HYPHENRANGELOOSE] : re[HYPHENRANGE];
  range = range.replace(hr, hyphenReplace);
  debug('hyphen replace', range);
  // `> 1.2.3 < 1.2.5` => `>1.2.3 <1.2.5`
  range = range.replace(re[COMPARATORTRIM], comparatorTrimReplace);
  debug('comparator trim', range, re[COMPARATORTRIM]);

  // `~ 1.2.3` => `~1.2.3`
  range = range.replace(re[TILDETRIM], tildeTrimReplace);

  // `^ 1.2.3` => `^1.2.3`
  range = range.replace(re[CARETTRIM], caretTrimReplace);

  // normalize spaces
  range = range.split(/\s+/).join(' ');

  // At this point, the range is completely trimmed and
  // ready to be split into comparators.

  var compRe = loose ? re[COMPARATORLOOSE] : re[COMPARATOR];
  var set = range.split(' ').map(function(comp) {
    return parseComparator(comp, loose);
  }).join(' ').split(/\s+/);
  if (this.loose) {
    // in loose mode, throw out any that are not valid comparators
    set = set.filter(function(comp) {
      return !!comp.match(compRe);
    });
  }
  set = set.map(function(comp) {
    return new Comparator(comp, loose);
  });

  return set;
};

Range.prototype.intersects = function(range, loose) {
  if (!(range instanceof Range)) {
    throw new TypeError('a Range is required');
  }

  return this.set.some(function(thisComparators) {
    return thisComparators.every(function(thisComparator) {
      return range.set.some(function(rangeComparators) {
        return rangeComparators.every(function(rangeComparator) {
          return thisComparator.intersects(rangeComparator, loose);
        });
      });
    });
  });
};

// Mostly just for testing and legacy API reasons
exports.toComparators = toComparators;
function toComparators(range, loose) {
  return new Range(range, loose).set.map(function(comp) {
    return comp.map(function(c) {
      return c.value;
    }).join(' ').trim().split(' ');
  });
}

// comprised of xranges, tildes, stars, and gtlt's at this point.
// already replaced the hyphen ranges
// turn into a set of JUST comparators.
function parseComparator(comp, loose) {
  debug('comp', comp);
  comp = replaceCarets(comp, loose);
  debug('caret', comp);
  comp = replaceTildes(comp, loose);
  debug('tildes', comp);
  comp = replaceXRanges(comp, loose);
  debug('xrange', comp);
  comp = replaceStars(comp, loose);
  debug('stars', comp);
  return comp;
}

function isX(id) {
  return !id || id.toLowerCase() === 'x' || id === '*';
}

// ~, ~> --> * (any, kinda silly)
// ~2, ~2.x, ~2.x.x, ~>2, ~>2.x ~>2.x.x --> >=2.0.0 <3.0.0
// ~2.0, ~2.0.x, ~>2.0, ~>2.0.x --> >=2.0.0 <2.1.0
// ~1.2, ~1.2.x, ~>1.2, ~>1.2.x --> >=1.2.0 <1.3.0
// ~1.2.3, ~>1.2.3 --> >=1.2.3 <1.3.0
// ~1.2.0, ~>1.2.0 --> >=1.2.0 <1.3.0
function replaceTildes(comp, loose) {
  return comp.trim().split(/\s+/).map(function(comp) {
    return replaceTilde(comp, loose);
  }).join(' ');
}

function replaceTilde(comp, loose) {
  var r = loose ? re[TILDELOOSE] : re[TILDE];
  return comp.replace(r, function(_, M, m, p, pr) {
    debug('tilde', comp, _, M, m, p, pr);
    var ret;

    if (isX(M))
      ret = '';
    else if (isX(m))
      ret = '>=' + M + '.0.0 <' + (+M + 1) + '.0.0';
    else if (isX(p))
      // ~1.2 == >=1.2.0 <1.3.0
      ret = '>=' + M + '.' + m + '.0 <' + M + '.' + (+m + 1) + '.0';
    else if (pr) {
      debug('replaceTilde pr', pr);
      if (pr.charAt(0) !== '-')
        pr = '-' + pr;
      ret = '>=' + M + '.' + m + '.' + p + pr +
            ' <' + M + '.' + (+m + 1) + '.0';
    } else
      // ~1.2.3 == >=1.2.3 <1.3.0
      ret = '>=' + M + '.' + m + '.' + p +
            ' <' + M + '.' + (+m + 1) + '.0';

    debug('tilde return', ret);
    return ret;
  });
}

// ^ --> * (any, kinda silly)
// ^2, ^2.x, ^2.x.x --> >=2.0.0 <3.0.0
// ^2.0, ^2.0.x --> >=2.0.0 <3.0.0
// ^1.2, ^1.2.x --> >=1.2.0 <2.0.0
// ^1.2.3 --> >=1.2.3 <2.0.0
// ^1.2.0 --> >=1.2.0 <2.0.0
function replaceCarets(comp, loose) {
  return comp.trim().split(/\s+/).map(function(comp) {
    return replaceCaret(comp, loose);
  }).join(' ');
}

function replaceCaret(comp, loose) {
  debug('caret', comp, loose);
  var r = loose ? re[CARETLOOSE] : re[CARET];
  return comp.replace(r, function(_, M, m, p, pr) {
    debug('caret', comp, _, M, m, p, pr);
    var ret;

    if (isX(M))
      ret = '';
    else if (isX(m))
      ret = '>=' + M + '.0.0 <' + (+M + 1) + '.0.0';
    else if (isX(p)) {
      if (M === '0')
        ret = '>=' + M + '.' + m + '.0 <' + M + '.' + (+m + 1) + '.0';
      else
        ret = '>=' + M + '.' + m + '.0 <' + (+M + 1) + '.0.0';
    } else if (pr) {
      debug('replaceCaret pr', pr);
      if (pr.charAt(0) !== '-')
        pr = '-' + pr;
      if (M === '0') {
        if (m === '0')
          ret = '>=' + M + '.' + m + '.' + p + pr +
                ' <' + M + '.' + m + '.' + (+p + 1);
        else
          ret = '>=' + M + '.' + m + '.' + p + pr +
                ' <' + M + '.' + (+m + 1) + '.0';
      } else
        ret = '>=' + M + '.' + m + '.' + p + pr +
              ' <' + (+M + 1) + '.0.0';
    } else {
      debug('no pr');
      if (M === '0') {
        if (m === '0')
          ret = '>=' + M + '.' + m + '.' + p +
                ' <' + M + '.' + m + '.' + (+p + 1);
        else
          ret = '>=' + M + '.' + m + '.' + p +
                ' <' + M + '.' + (+m + 1) + '.0';
      } else
        ret = '>=' + M + '.' + m + '.' + p +
              ' <' + (+M + 1) + '.0.0';
    }

    debug('caret return', ret);
    return ret;
  });
}

function replaceXRanges(comp, loose) {
  debug('replaceXRanges', comp, loose);
  return comp.split(/\s+/).map(function(comp) {
    return replaceXRange(comp, loose);
  }).join(' ');
}

function replaceXRange(comp, loose) {
  comp = comp.trim();
  var r = loose ? re[XRANGELOOSE] : re[XRANGE];
  return comp.replace(r, function(ret, gtlt, M, m, p, pr) {
    debug('xRange', comp, ret, gtlt, M, m, p, pr);
    var xM = isX(M);
    var xm = xM || isX(m);
    var xp = xm || isX(p);
    var anyX = xp;

    if (gtlt === '=' && anyX)
      gtlt = '';

    if (xM) {
      if (gtlt === '>' || gtlt === '<') {
        // nothing is allowed
        ret = '<0.0.0';
      } else {
        // nothing is forbidden
        ret = '*';
      }
    } else if (gtlt && anyX) {
      // replace X with 0
      if (xm)
        m = 0;
      if (xp)
        p = 0;

      if (gtlt === '>') {
        // >1 => >=2.0.0
        // >1.2 => >=1.3.0
        // >1.2.3 => >= 1.2.4
        gtlt = '>=';
        if (xm) {
          M = +M + 1;
          m = 0;
          p = 0;
        } else if (xp) {
          m = +m + 1;
          p = 0;
        }
      } else if (gtlt === '<=') {
        // <=0.7.x is actually <0.8.0, since any 0.7.x should
        // pass.  Similarly, <=7.x is actually <8.0.0, etc.
        gtlt = '<';
        if (xm)
          M = +M + 1;
        else
          m = +m + 1;
      }

      ret = gtlt + M + '.' + m + '.' + p;
    } else if (xm) {
      ret = '>=' + M + '.0.0 <' + (+M + 1) + '.0.0';
    } else if (xp) {
      ret = '>=' + M + '.' + m + '.0 <' + M + '.' + (+m + 1) + '.0';
    }

    debug('xRange return', ret);

    return ret;
  });
}

// Because * is AND-ed with everything else in the comparator,
// and '' means "any version", just remove the *s entirely.
function replaceStars(comp, loose) {
  debug('replaceStars', comp, loose);
  // Looseness is ignored here.  star is always as loose as it gets!
  return comp.trim().replace(re[STAR], '');
}

// This function is passed to string.replace(re[HYPHENRANGE])
// M, m, patch, prerelease, build
// 1.2 - 3.4.5 => >=1.2.0 <=3.4.5
// 1.2.3 - 3.4 => >=1.2.0 <3.5.0 Any 3.4.x will do
// 1.2 - 3.4 => >=1.2.0 <3.5.0
function hyphenReplace($0,
                       from, fM, fm, fp, fpr, fb,
                       to, tM, tm, tp, tpr, tb) {

  if (isX(fM))
    from = '';
  else if (isX(fm))
    from = '>=' + fM + '.0.0';
  else if (isX(fp))
    from = '>=' + fM + '.' + fm + '.0';
  else
    from = '>=' + from;

  if (isX(tM))
    to = '';
  else if (isX(tm))
    to = '<' + (+tM + 1) + '.0.0';
  else if (isX(tp))
    to = '<' + tM + '.' + (+tm + 1) + '.0';
  else if (tpr)
    to = '<=' + tM + '.' + tm + '.' + tp + '-' + tpr;
  else
    to = '<=' + to;

  return (from + ' ' + to).trim();
}


// if ANY of the sets match ALL of its comparators, then pass
Range.prototype.test = function(version) {
  if (!version)
    return false;

  if (typeof version === 'string')
    version = new SemVer(version, this.loose);

  for (var i = 0; i < this.set.length; i++) {
    if (testSet(this.set[i], version))
      return true;
  }
  return false;
};

function testSet(set, version) {
  for (var i = 0; i < set.length; i++) {
    if (!set[i].test(version))
      return false;
  }

  if (version.prerelease.length) {
    // Find the set of versions that are allowed to have prereleases
    // For example, ^1.2.3-pr.1 desugars to >=1.2.3-pr.1 <2.0.0
    // That should allow `1.2.3-pr.2` to pass.
    // However, `1.2.4-alpha.notready` should NOT be allowed,
    // even though it's within the range set by the comparators.
    for (var i = 0; i < set.length; i++) {
      debug(set[i].semver);
      if (set[i].semver === ANY)
        continue;

      if (set[i].semver.prerelease.length > 0) {
        var allowed = set[i].semver;
        if (allowed.major === version.major &&
            allowed.minor === version.minor &&
            allowed.patch === version.patch)
          return true;
      }
    }

    // Version has a -pre, but it's not one of the ones we like.
    return false;
  }

  return true;
}

exports.satisfies = satisfies;
function satisfies(version, range, loose) {
  try {
    range = new Range(range, loose);
  } catch (er) {
    return false;
  }
  return range.test(version);
}

exports.maxSatisfying = maxSatisfying;
function maxSatisfying(versions, range, loose) {
  var max = null;
  var maxSV = null;
  try {
    var rangeObj = new Range(range, loose);
  } catch (er) {
    return null;
  }
  versions.forEach(function (v) {
    if (rangeObj.test(v)) { // satisfies(v, range, loose)
      if (!max || maxSV.compare(v) === -1) { // compare(max, v, true)
        max = v;
        maxSV = new SemVer(max, loose);
      }
    }
  });
  return max;
}

exports.minSatisfying = minSatisfying;
function minSatisfying(versions, range, loose) {
  var min = null;
  var minSV = null;
  try {
    var rangeObj = new Range(range, loose);
  } catch (er) {
    return null;
  }
  versions.forEach(function (v) {
    if (rangeObj.test(v)) { // satisfies(v, range, loose)
      if (!min || minSV.compare(v) === 1) { // compare(min, v, true)
        min = v;
        minSV = new SemVer(min, loose);
      }
    }
  });
  return min;
}

exports.validRange = validRange;
function validRange(range, loose) {
  try {
    // Return '*' instead of '' so that truthiness works.
    // This will throw if it's invalid anyway
    return new Range(range, loose).range || '*';
  } catch (er) {
    return null;
  }
}

// Determine if version is less than all the versions possible in the range
exports.ltr = ltr;
function ltr(version, range, loose) {
  return outside(version, range, '<', loose);
}

// Determine if version is greater than all the versions possible in the range.
exports.gtr = gtr;
function gtr(version, range, loose) {
  return outside(version, range, '>', loose);
}

exports.outside = outside;
function outside(version, range, hilo, loose) {
  version = new SemVer(version, loose);
  range = new Range(range, loose);

  var gtfn, ltefn, ltfn, comp, ecomp;
  switch (hilo) {
    case '>':
      gtfn = gt;
      ltefn = lte;
      ltfn = lt;
      comp = '>';
      ecomp = '>=';
      break;
    case '<':
      gtfn = lt;
      ltefn = gte;
      ltfn = gt;
      comp = '<';
      ecomp = '<=';
      break;
    default:
      throw new TypeError('Must provide a hilo val of "<" or ">"');
  }

  // If it satisifes the range it is not outside
  if (satisfies(version, range, loose)) {
    return false;
  }

  // From now on, variable terms are as if we're in "gtr" mode.
  // but note that everything is flipped for the "ltr" function.

  for (var i = 0; i < range.set.length; ++i) {
    var comparators = range.set[i];

    var high = null;
    var low = null;

    comparators.forEach(function(comparator) {
      if (comparator.semver === ANY) {
        comparator = new Comparator('>=0.0.0');
      }
      high = high || comparator;
      low = low || comparator;
      if (gtfn(comparator.semver, high.semver, loose)) {
        high = comparator;
      } else if (ltfn(comparator.semver, low.semver, loose)) {
        low = comparator;
      }
    });

    // If the edge version comparator has a operator then our version
    // isn't outside it
    if (high.operator === comp || high.operator === ecomp) {
      return false;
    }

    // If the lowest version comparator has an operator and our version
    // is less than it then it isn't higher than the range
    if ((!low.operator || low.operator === comp) &&
        ltefn(version, low.semver)) {
      return false;
    } else if (low.operator === ecomp && ltfn(version, low.semver)) {
      return false;
    }
  }
  return true;
}

exports.prerelease = prerelease;
function prerelease(version, loose) {
  var parsed = parse(version, loose);
  return (parsed && parsed.prerelease.length) ? parsed.prerelease : null;
}

exports.intersects = intersects;
function intersects(r1, r2, loose) {
  r1 = new Range(r1, loose);
  r2 = new Range(r2, loose);
  return r1.intersects(r2)
}
});

var arrayify = function(object, keyName) {
  return Object.keys(object).reduce(
    (array, key) =>
      array.concat(Object.assign({ [keyName]: key }, object[key])),
    []
  );
};

var dedent_1 = createCommonjsModule(function (module) {
"use strict";

function dedent(strings) {

  var raw = void 0;
  if (typeof strings === "string") {
    // dedent can be used as a plain function
    raw = [strings];
  } else {
    raw = strings.raw;
  }

  // first, perform interpolation
  var result = "";
  for (var i = 0; i < raw.length; i++) {
    result += raw[i].
    // join lines when there is a suppressed newline
    replace(/\\\n[ \t]*/g, "").

    // handle escaped backticks
    replace(/\\`/g, "`");

    if (i < (arguments.length <= 1 ? 0 : arguments.length - 1)) {
      result += arguments.length <= i + 1 ? undefined : arguments[i + 1];
    }
  }

  // now strip indentation
  var lines = result.split("\n");
  var mindent = null;
  lines.forEach(function (l) {
    var m = l.match(/^(\s+)\S+/);
    if (m) {
      var indent = m[1].length;
      if (!mindent) {
        // this is the first indented line
        mindent = indent;
      } else {
        mindent = Math.min(mindent, indent);
      }
    }
  });

  if (mindent !== null) {
    result = lines.map(function (l) {
      return l[0] === " " ? l.slice(mindent) : l;
    }).join("\n");
  }

  // dedent eats leading and trailing whitespace too
  result = result.trim();

  // handle escaped newlines at the end to ensure they don't get stripped too
  return result.replace(/\\n/g, "\n");
}

{
  module.exports = dedent;
}
});

const CATEGORY_CONFIG = "Config";
const CATEGORY_EDITOR = "Editor";
const CATEGORY_FORMAT = "Format";
const CATEGORY_OTHER = "Other";
const CATEGORY_OUTPUT = "Output";
const CATEGORY_GLOBAL = "Global";
const CATEGORY_SPECIAL = "Special";

/**
 * @typedef {Object} OptionInfo
 * @property {string} since - available since version
 * @property {string} category
 * @property {'int' | 'boolean' | 'choice' | 'path'} type
 * @property {boolean} array - indicate it's an array of the specified type
 * @property {boolean?} deprecated - deprecated since version
 * @property {OptionRedirectInfo?} redirect - redirect deprecated option
 * @property {string} description
 * @property {string?} oppositeDescription - for `false` option
 * @property {OptionValueInfo} default
 * @property {OptionRangeInfo?} range - for type int
 * @property {OptionChoiceInfo?} choices - for type choice
 * @property {(value: any) => boolean} exception
 *
 * @typedef {number | boolean | string} OptionValue
 * @typedef {OptionValue | [{ value: OptionValue[] }] | Array<{ since: string, value: OptionValue}>} OptionValueInfo
 *
 * @typedef {Object} OptionRedirectInfo
 * @property {string} option
 * @property {OptionValue} value
 *
 * @typedef {Object} OptionRangeInfo
 * @property {number} start - recommended range start
 * @property {number} end - recommended range end
 * @property {number} step - recommended range step
 *
 * @typedef {Object} OptionChoiceInfo
 * @property {boolean | string} value - boolean for the option that is originally boolean type
 * @property {string?} description - undefined if redirect
 * @property {string?} since - undefined if available since the first version of the option
 * @property {string?} deprecated - deprecated since version
 * @property {OptionValueInfo?} redirect - redirect deprecated value
 *
 * @property {string?} cliName
 * @property {string?} cliCategory
 * @property {string?} cliDescription
 */
/** @type {{ [name: string]: OptionInfo } */
const options$2 = {
  cursorOffset: {
    since: "1.4.0",
    category: CATEGORY_SPECIAL,
    type: "int",
    default: -1,
    range: { start: -1, end: Infinity, step: 1 },
    description: dedent_1`
      Print (to stderr) where a cursor at the given position would move to after formatting.
      This option cannot be used with --range-start and --range-end.
    `,
    cliCategory: CATEGORY_EDITOR
  },
  filepath: {
    since: "1.4.0",
    category: CATEGORY_SPECIAL,
    type: "path",
    default: undefined,
    description:
      "Specify the input filepath. This will be used to do parser inference.",
    cliName: "stdin-filepath",
    cliCategory: CATEGORY_OTHER,
    cliDescription: "Path to the file to pretend that stdin comes from."
  },
  insertPragma: {
    since: "1.8.0",
    category: CATEGORY_SPECIAL,
    type: "boolean",
    default: false,
    description: "Insert @format pragma into file's first docblock comment.",
    cliCategory: CATEGORY_OTHER
  },
  parser: {
    since: "0.0.10",
    category: CATEGORY_GLOBAL,
    type: "choice",
    default: "babylon",
    description: "Which parser to use.",
    exception: value =>
      typeof value === "string" || typeof value === "function",
    choices: [
      { value: "flow", description: "Flow" },
      { value: "babylon", description: "JavaScript" },
      { value: "typescript", since: "1.4.0", description: "TypeScript" },
      { value: "css", since: "1.7.1", description: "CSS" },
      {
        value: "postcss",
        since: "1.4.0",
        description: "CSS/Less/SCSS",
        deprecated: "1.7.1",
        redirect: "css"
      },
      { value: "less", since: "1.7.1", description: "Less" },
      { value: "scss", since: "1.7.1", description: "SCSS" },
      { value: "json", since: "1.5.0", description: "JSON" },
      { value: "json5", since: "1.13.0", description: "JSON5" },
      { value: "graphql", since: "1.5.0", description: "GraphQL" },
      { value: "markdown", since: "1.8.0", description: "Markdown" },
      { value: "vue", since: "1.10.0", description: "Vue" }
    ]
  },
  plugins: {
    since: "1.10.0",
    type: "path",
    array: true,
    default: [{ value: [] }],
    category: CATEGORY_GLOBAL,
    description:
      "Add a plugin. Multiple plugins can be passed as separate `--plugin`s.",
    exception: value => typeof value === "string" || typeof value === "object",
    cliName: "plugin",
    cliCategory: CATEGORY_CONFIG
  },
  pluginSearchDirs: {
    since: "1.13.0",
    type: "path",
    array: true,
    default: [{ value: [] }],
    category: CATEGORY_GLOBAL,
    description: dedent_1`
      Custom directory that contains prettier plugins in node_modules subdirectory.
      Overrides default behavior when plugins are searched relatively to the location of Prettier.
      Multiple values are accepted.
    `,
    exception: value => typeof value === "string" || typeof value === "object",
    cliName: "plugin-search-dir",
    cliCategory: CATEGORY_CONFIG
  },
  printWidth: {
    since: "0.0.0",
    category: CATEGORY_GLOBAL,
    type: "int",
    default: 80,
    description: "The line length where Prettier will try wrap.",
    range: { start: 0, end: Infinity, step: 1 }
  },
  rangeEnd: {
    since: "1.4.0",
    category: CATEGORY_SPECIAL,
    type: "int",
    default: Infinity,
    range: { start: 0, end: Infinity, step: 1 },
    description: dedent_1`
      Format code ending at a given character offset (exclusive).
      The range will extend forwards to the end of the selected statement.
      This option cannot be used with --cursor-offset.
    `,
    cliCategory: CATEGORY_EDITOR
  },
  rangeStart: {
    since: "1.4.0",
    category: CATEGORY_SPECIAL,
    type: "int",
    default: 0,
    range: { start: 0, end: Infinity, step: 1 },
    description: dedent_1`
      Format code starting at a given character offset.
      The range will extend backwards to the start of the first line containing the selected statement.
      This option cannot be used with --cursor-offset.
    `,
    cliCategory: CATEGORY_EDITOR
  },
  requirePragma: {
    since: "1.7.0",
    category: CATEGORY_SPECIAL,
    type: "boolean",
    default: false,
    description: dedent_1`
      Require either '@prettier' or '@format' to be present in the file's first docblock comment
      in order for it to be formatted.
    `,
    cliCategory: CATEGORY_OTHER
  },
  tabWidth: {
    type: "int",
    category: CATEGORY_GLOBAL,
    default: 2,
    description: "Number of spaces per indentation level.",
    range: { start: 0, end: Infinity, step: 1 }
  },
  useFlowParser: {
    since: "0.0.0",
    category: CATEGORY_GLOBAL,
    type: "boolean",
    default: false,
    deprecated: "0.0.10",
    description: "Use flow parser.",
    redirect: { option: "parser", value: "flow" },
    cliName: "flow-parser"
  },
  useTabs: {
    since: "1.0.0",
    category: CATEGORY_GLOBAL,
    type: "boolean",
    default: false,
    description: "Indent with tabs instead of spaces."
  }
};

var coreOptions$1 = {
  CATEGORY_CONFIG,
  CATEGORY_EDITOR,
  CATEGORY_FORMAT,
  CATEGORY_OTHER,
  CATEGORY_OUTPUT,
  CATEGORY_GLOBAL,
  CATEGORY_SPECIAL,
  options: options$2
};

var require$$0 = ( _package$1 && _package ) || _package$1;

const currentVersion = require$$0.version;
const coreOptions = coreOptions$1.options;

function getSupportInfo$2(version, opts) {
  opts = Object.assign(
    {
      plugins: [],
      showUnreleased: false,
      showDeprecated: false,
      showInternal: false
    },
    opts
  );

  if (!version) {
    version = currentVersion;
  }

  const plugins = opts.plugins;

  const options = arrayify(
    Object.assign(
      plugins.reduce(
        (currentOptions, plugin) =>
          Object.assign(currentOptions, plugin.options),
        {}
      ),
      coreOptions
    ),
    "name"
  )
    .sort((a, b) => (a.name === b.name ? 0 : a.name < b.name ? -1 : 1))
    .filter(filterSince)
    .filter(filterDeprecated)
    .map(mapDeprecated)
    .map(mapInternal)
    .map(option => {
      const newOption = Object.assign({}, option);

      if (Array.isArray(newOption.default)) {
        newOption.default =
          newOption.default.length === 1
            ? newOption.default[0].value
            : newOption.default
                .filter(filterSince)
                .sort((info1, info2) =>
                  semver.compare(info2.since, info1.since)
                )[0].value;
      }

      if (Array.isArray(newOption.choices)) {
        newOption.choices = newOption.choices
          .filter(filterSince)
          .filter(filterDeprecated)
          .map(mapDeprecated);
      }

      return newOption;
    })
    .map(option => {
      const filteredPlugins = plugins.filter(
        plugin => plugin.defaultOptions && plugin.defaultOptions[option.name]
      );
      const pluginDefaults = filteredPlugins.reduce((reduced, plugin) => {
        reduced[plugin.name] = plugin.defaultOptions[option.name];
        return reduced;
      }, {});
      return Object.assign(option, { pluginDefaults });
    });

  const usePostCssParser = semver.lt(version, "1.7.1");

  const languages = plugins
    .reduce((all, plugin) => all.concat(plugin.languages), [])
    .filter(
      language =>
        language.since
          ? semver.gte(version, language.since)
          : language.since !== null
    )
    .map(language => {
      // Prevent breaking changes
      if (language.name === "Markdown") {
        return Object.assign({}, language, {
          parsers: ["markdown"]
        });
      }
      if (language.name === "TypeScript") {
        return Object.assign({}, language, {
          parsers: ["typescript"]
        });
      }

      if (usePostCssParser && language.group === "CSS") {
        return Object.assign({}, language, {
          parsers: ["postcss"]
        });
      }
      return language;
    });

  return { languages, options };

  function filterSince(object) {
    return (
      opts.showUnreleased ||
      !("since" in object) ||
      (object.since && semver.gte(version, object.since))
    );
  }
  function filterDeprecated(object) {
    return (
      opts.showDeprecated ||
      !("deprecated" in object) ||
      (object.deprecated && semver.lt(version, object.deprecated))
    );
  }
  function mapDeprecated(object) {
    if (!object.deprecated || opts.showDeprecated) {
      return object;
    }
    const newObject = Object.assign({}, object);
    delete newObject.deprecated;
    delete newObject.redirect;
    return newObject;
  }
  function mapInternal(object) {
    if (opts.showInternal) {
      return object;
    }
    const newObject = Object.assign({}, object);
    delete newObject.cliName;
    delete newObject.cliCategory;
    delete newObject.cliDescription;
    return newObject;
  }
}

var support = {
  getSupportInfo: getSupportInfo$2
};

/* eslint-disable no-nested-ternary */
var arr = [];
var charCodeCache = [];

var leven = function (a, b) {
	if (a === b) {
		return 0;
	}

	var swap = a;

	// Swapping the strings if `a` is longer than `b` so we know which one is the
	// shortest & which one is the longest
	if (a.length > b.length) {
		a = b;
		b = swap;
	}

	var aLen = a.length;
	var bLen = b.length;

	if (aLen === 0) {
		return bLen;
	}

	if (bLen === 0) {
		return aLen;
	}

	// Performing suffix trimming:
	// We can linearly drop suffix common to both strings since they
	// don't increase distance at all
	// Note: `~-` is the bitwise way to perform a `- 1` operation
	while (aLen > 0 && (a.charCodeAt(~-aLen) === b.charCodeAt(~-bLen))) {
		aLen--;
		bLen--;
	}

	if (aLen === 0) {
		return bLen;
	}

	// Performing prefix trimming
	// We can linearly drop prefix common to both strings since they
	// don't increase distance at all
	var start = 0;

	while (start < aLen && (a.charCodeAt(start) === b.charCodeAt(start))) {
		start++;
	}

	aLen -= start;
	bLen -= start;

	if (aLen === 0) {
		return bLen;
	}

	var bCharCode;
	var ret;
	var tmp;
	var tmp2;
	var i = 0;
	var j = 0;

	while (i < aLen) {
		charCodeCache[start + i] = a.charCodeAt(start + i);
		arr[i] = ++i;
	}

	while (j < bLen) {
		bCharCode = b.charCodeAt(start + j);
		tmp = j++;
		ret = j;

		for (i = 0; i < aLen; i++) {
			tmp2 = bCharCode === charCodeCache[start + i] ? tmp : tmp + 1;
			tmp = arr[i];
			ret = arr[i] = tmp > ret ? tmp2 > ret ? ret + 1 : tmp2 : tmp2 > tmp ? tmp + 1 : tmp2;
		}
	}

	return ret;
};

function apiDescriptor(name, value) {
  return arguments.length === 1
    ? JSON.stringify(name)
    : `\`{ ${apiDescriptor(name)}: ${JSON.stringify(value)} }\``;
}

function cliDescriptor(name, value) {
  return value === false
    ? `\`--no-${name}\``
    : value === true || arguments.length === 1
      ? `\`--${name}\``
      : value === ""
        ? `\`--${name}\` without an argument`
        : `\`--${name}=${value}\``;
}

var optionsDescriptor = {
  apiDescriptor,
  cliDescriptor
};

function validateOption(value, optionInfo, opts) {
  opts = opts || {};
  const descriptor = opts.descriptor || optionsDescriptor.apiDescriptor;

  if (
    typeof optionInfo.exception === "function" &&
    optionInfo.exception(value)
  ) {
    return;
  }

  try {
    validateOptionType(value, optionInfo);
  } catch (error) {
    throw new Error(
      `Invalid \`${descriptor(optionInfo.name)}\` value. ${
        error.message
      }, but received \`${JSON.stringify(value)}\`.`
    );
  }
}

function validateOptionType(value, optionInfo) {
  if (optionInfo.array) {
    if (!Array.isArray(value)) {
      throw new Error(`Expected an array`);
    }
    value.forEach(v =>
      validateOptionType(v, Object.assign({}, optionInfo, { array: false }))
    );
  } else {
    switch (optionInfo.type) {
      case "int":
        validateIntOption(value);
        break;
      case "boolean":
        validateBooleanOption(value);
        break;
      case "choice":
        validateChoiceOption(value, optionInfo.choices);
        break;
    }
  }
}

function validateBooleanOption(value) {
  if (typeof value !== "boolean") {
    throw new Error(`Expected a boolean`);
  }
}

function validateIntOption(value) {
  if (
    !(
      typeof value === "number" &&
      Math.floor(value) === value &&
      value >= 0 &&
      value !== Infinity
    )
  ) {
    throw new Error(`Expected an integer`);
  }
}

function validateChoiceOption(value, choiceInfos) {
  if (!choiceInfos.some(choiceInfo => choiceInfo.value === value)) {
    const choices = choiceInfos
      .filter(choiceInfo => !choiceInfo.deprecated)
      .map(choiceInfo => JSON.stringify(choiceInfo.value))
      .sort();
    const head = choices.slice(0, -2);
    const tail = choices.slice(-2);
    throw new Error(`Expected ${head.concat(tail.join(" or ")).join(", ")}`);
  }
}

var optionsValidator = { validateOption };

function normalizeOptions$1(options, optionInfos, opts) {
  opts = opts || {};
  const logger =
    opts.logger === false
      ? { warn() {} }
      : opts.logger !== undefined
        ? opts.logger
        : console;
  const descriptor = opts.descriptor || optionsDescriptor.apiDescriptor;
  const passThrough = opts.passThrough || [];

  const optionInfoMap = optionInfos.reduce(
    (reduced, optionInfo) =>
      Object.assign(reduced, { [optionInfo.name]: optionInfo }),
    {}
  );
  const normalizedOptions = Object.keys(options).reduce((newOptions, key) => {
    const optionInfo = optionInfoMap[key];

    let optionName = key;
    let optionValue = options[key];

    if (!optionInfo) {
      if (passThrough === true || passThrough.indexOf(optionName) !== -1) {
        newOptions[optionName] = optionValue;
      } else {
        logger.warn(
          createUnknownOptionMessage(
            optionName,
            optionValue,
            optionInfos,
            descriptor
          )
        );
      }
      return newOptions;
    }

    if (!optionInfo.deprecated) {
      optionValue = normalizeOption(optionValue, optionInfo);
    } else if (typeof optionInfo.redirect === "string") {
      logger.warn(createRedirectOptionMessage(optionInfo, descriptor));
      optionName = optionInfo.redirect;
    } else if (optionValue) {
      logger.warn(createRedirectOptionMessage(optionInfo, descriptor));
      optionValue = optionInfo.redirect.value;
      optionName = optionInfo.redirect.option;
    }

    if (optionInfo.choices) {
      const choiceInfo = optionInfo.choices.find(
        choice => choice.value === optionValue
      );
      if (choiceInfo && choiceInfo.deprecated) {
        logger.warn(
          createRedirectChoiceMessage(optionInfo, choiceInfo, descriptor)
        );
        optionValue = choiceInfo.redirect;
      }
    }

    if (optionInfo.array && !Array.isArray(optionValue)) {
      optionValue = [optionValue];
    }

    if (optionValue !== optionInfo.default) {
      optionsValidator.validateOption(optionValue, optionInfoMap[optionName], {
        descriptor
      });
    }

    newOptions[optionName] = optionValue;
    return newOptions;
  }, {});

  return normalizedOptions;
}

function normalizeOption(option, optionInfo) {
  return optionInfo.type === "int" ? Number(option) : option;
}

function createUnknownOptionMessage(key, value, optionInfos, descriptor) {
  const messages = [`Ignored unknown option ${descriptor(key, value)}.`];

  const suggestedOptionInfo = optionInfos.find(
    optionInfo => leven(optionInfo.name, key) < 3
  );
  if (suggestedOptionInfo) {
    messages.push(`Did you mean ${JSON.stringify(suggestedOptionInfo.name)}?`);
  }

  return messages.join(" ");
}

function createRedirectOptionMessage(optionInfo, descriptor) {
  return `${descriptor(
    optionInfo.name
  )} is deprecated. Prettier now treats it as ${
    typeof optionInfo.redirect === "string"
      ? descriptor(optionInfo.redirect)
      : descriptor(optionInfo.redirect.option, optionInfo.redirect.value)
  }.`;
}

function createRedirectChoiceMessage(optionInfo, choiceInfo, descriptor) {
  return `${descriptor(
    optionInfo.name,
    choiceInfo.value
  )} is deprecated. Prettier now treats it as ${descriptor(
    optionInfo.name,
    choiceInfo.redirect
  )}.`;
}

function normalizeApiOptions(options, optionInfos, opts) {
  return normalizeOptions$1(
    options,
    optionInfos,
    Object.assign({ descriptor: optionsDescriptor.apiDescriptor }, opts)
  );
}

function normalizeCliOptions(options, optionInfos, opts) {
  const args = options["_"] || [];

  const newOptions = normalizeOptions$1(
    Object.keys(options).reduce(
      (reduced, key) =>
        Object.assign(
          reduced,
          key.length === 1 // omit alias
            ? null
            : { [key]: options[key] }
        ),
      {}
    ),
    optionInfos,
    Object.assign({ descriptor: optionsDescriptor.cliDescriptor }, opts)
  );
  newOptions["_"] = args;

  return newOptions;
}

var optionsNormalizer = {
  normalizeApiOptions,
  normalizeCliOptions
};

class ConfigError$1 extends Error {}
class DebugError extends Error {}

var errors = {
  ConfigError: ConfigError$1,
  DebugError
};

function concat$2(parts) {
  return { type: "concat", parts };
}

function indent$2(contents) {
  return { type: "indent", contents };
}

function align$1(n, contents) {
  return { type: "align", contents, n };
}

function group$1(contents, opts) {
  opts = opts || {};

  return {
    type: "group",
    contents: contents,
    break: !!opts.shouldBreak,
    expandedStates: opts.expandedStates
  };
}

function dedentToRoot(contents) {
  return align$1(-Infinity, contents);
}

function markAsRoot(contents) {
  return align$1({ type: "root" }, contents);
}

function dedent$2(contents) {
  return align$1(-1, contents);
}

function conditionalGroup$1(states, opts) {
  return group$1(
    states[0],
    Object.assign(opts || {}, { expandedStates: states })
  );
}

function fill$1(parts) {
  return { type: "fill", parts };
}

function ifBreak$1(breakContents, flatContents) {
  return { type: "if-break", breakContents, flatContents };
}

function lineSuffix$1(contents) {
  return { type: "line-suffix", contents };
}

const lineSuffixBoundary$1 = { type: "line-suffix-boundary" };
const breakParent$2 = { type: "break-parent" };
const line$3 = { type: "line" };
const softline$1 = { type: "line", soft: true };
const hardline$2 = concat$2([{ type: "line", hard: true }, breakParent$2]);
const singleLine$1 = { type: "line", single: true };
const singleSoftLine$1 = { type: "line", soft: true, single: true };
const singleHardLine$2 = concat$2([
  { type: "line", hard: true, single: true },
  breakParent$2
]);
const literalline$1 = concat$2([
  { type: "line", hard: true, literal: true },
  breakParent$2
]);
const cursor$1 = { type: "cursor", placeholder: Symbol("cursor") };

function join$2(sep, arr) {
  const res = [];

  for (let i = 0; i < arr.length; i++) {
    if (i !== 0) {
      res.push(sep);
    }

    res.push(arr[i]);
  }

  return concat$2(res);
}

function addAlignmentToDoc$1(doc, size, tabWidth) {
  let aligned = doc;
  if (size > 0) {
    // Use indent to add tabs for all the levels of tabs we need
    for (let i = 0; i < Math.floor(size / tabWidth); ++i) {
      aligned = indent$2(aligned);
    }
    // Use align for all the spaces that are needed
    aligned = align$1(size % tabWidth, aligned);
    // size is absolute from 0 and not relative to the current
    // indentation, so we use -Infinity to reset the indentation to 0
    aligned = align$1(-Infinity, aligned);
  }
  return aligned;
}

var docBuilders$2 = {
  concat: concat$2,
  join: join$2,
  line: line$3,
  softline: softline$1,
  hardline: hardline$2,
  singleLine: singleLine$1,
  singleSoftLine: singleSoftLine$1,
  singleHardLine: singleHardLine$2,
  literalline: literalline$1,
  group: group$1,
  conditionalGroup: conditionalGroup$1,
  fill: fill$1,
  lineSuffix: lineSuffix$1,
  lineSuffixBoundary: lineSuffixBoundary$1,
  cursor: cursor$1,
  breakParent: breakParent$2,
  ifBreak: ifBreak$1,
  indent: indent$2,
  align: align$1,
  addAlignmentToDoc: addAlignmentToDoc$1,
  markAsRoot,
  dedentToRoot,
  dedent: dedent$2
};

var ansiRegex = createCommonjsModule(function (module) {
'use strict';

module.exports = () => {
	const pattern = [
		'[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:[a-zA-Z\\d]*(?:;[a-zA-Z\\d]*)*)?\\u0007)',
		'(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PRZcf-ntqry=><~]))'
	].join('|');

	return new RegExp(pattern, 'g');
};
});

var stripAnsi = input => typeof input === 'string' ? input.replace(ansiRegex(), '') : input;

var isFullwidthCodePoint = createCommonjsModule(function (module) {
'use strict';
/* eslint-disable yoda */
module.exports = x => {
	if (Number.isNaN(x)) {
		return false;
	}

	// code points are derived from:
	// http://www.unix.org/Public/UNIDATA/EastAsianWidth.txt
	if (
		x >= 0x1100 && (
			x <= 0x115f ||  // Hangul Jamo
			x === 0x2329 || // LEFT-POINTING ANGLE BRACKET
			x === 0x232a || // RIGHT-POINTING ANGLE BRACKET
			// CJK Radicals Supplement .. Enclosed CJK Letters and Months
			(0x2e80 <= x && x <= 0x3247 && x !== 0x303f) ||
			// Enclosed CJK Letters and Months .. CJK Unified Ideographs Extension A
			(0x3250 <= x && x <= 0x4dbf) ||
			// CJK Unified Ideographs .. Yi Radicals
			(0x4e00 <= x && x <= 0xa4c6) ||
			// Hangul Jamo Extended-A
			(0xa960 <= x && x <= 0xa97c) ||
			// Hangul Syllables
			(0xac00 <= x && x <= 0xd7a3) ||
			// CJK Compatibility Ideographs
			(0xf900 <= x && x <= 0xfaff) ||
			// Vertical Forms
			(0xfe10 <= x && x <= 0xfe19) ||
			// CJK Compatibility Forms .. Small Form Variants
			(0xfe30 <= x && x <= 0xfe6b) ||
			// Halfwidth and Fullwidth Forms
			(0xff01 <= x && x <= 0xff60) ||
			(0xffe0 <= x && x <= 0xffe6) ||
			// Kana Supplement
			(0x1b000 <= x && x <= 0x1b001) ||
			// Enclosed Ideographic Supplement
			(0x1f200 <= x && x <= 0x1f251) ||
			// CJK Unified Ideographs Extension B .. Tertiary Ideographic Plane
			(0x20000 <= x && x <= 0x3fffd)
		)
	) {
		return true;
	}

	return false;
};
});

var stringWidth = createCommonjsModule(function (module) {
'use strict';



module.exports = str => {
	if (typeof str !== 'string' || str.length === 0) {
		return 0;
	}

	str = stripAnsi(str);

	let width = 0;

	for (let i = 0; i < str.length; i++) {
		const code = str.codePointAt(i);

		// Ignore control characters
		if (code <= 0x1F || (code >= 0x7F && code <= 0x9F)) {
			continue;
		}

		// Ignore combining characters
		if (code >= 0x300 && code <= 0x36F) {
			continue;
		}

		// Surrogates
		if (code > 0xFFFF) {
			i++;
		}

		width += isFullwidthCodePoint(code) ? 2 : 1;
	}

	return width;
};
});

var emojiRegex$1 = function () {
	// https://mathiasbynens.be/notes/es-unicode-property-escapes#emoji
	return (/\uD83C\uDFF4\uDB40\uDC67\uDB40\uDC62(?:\uDB40\uDC65\uDB40\uDC6E\uDB40\uDC67|\uDB40\uDC77\uDB40\uDC6C\uDB40\uDC73|\uDB40\uDC73\uDB40\uDC63\uDB40\uDC74)\uDB40\uDC7F|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|\uD83D\uDC68(?:\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83D\uDC68|(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|[\u2695\u2696\u2708]\uFE0F|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92])|(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2695\u2696\u2708]\uFE0F|(?:\uD83C[\uDFFB-\uDFFF])\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]))|\uD83D\uDC69\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D(?:\uD83D[\uDC68\uDC69])|\uD83D[\uDC68\uDC69])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92])|\uD83D\uDC69\u200D\uD83D\uDC66\u200D\uD83D\uDC66|(?:\uD83D\uDC41\uFE0F\u200D\uD83D\uDDE8|\uD83D\uDC69(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2695\u2696\u2708]|(?:(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)\uFE0F|\uD83D\uDC6F|\uD83E[\uDD3C\uDDDE\uDDDF])\u200D[\u2640\u2642]|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3D\uDD3E\uDDD6-\uDDDD])(?:(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|\u200D[\u2640\u2642])|\uD83D\uDC69\u200D[\u2695\u2696\u2708])\uFE0F|\uD83D\uDC69\u200D\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D[\uDC66\uDC67])|\uD83D\uDC68(?:\u200D(?:(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D[\uDC66\uDC67])|\uD83D[\uDC66\uDC67])|\uD83C[\uDFFB-\uDFFF])|\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08|\uD83D\uDC69\u200D\uD83D\uDC67|\uD83D\uDC69(?:\uD83C[\uDFFB-\uDFFF])\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92])|\uD83D\uDC69\u200D\uD83D\uDC66|\uD83C\uDDF4\uD83C\uDDF2|\uD83C\uDDFD\uD83C\uDDF0|\uD83C\uDDF6\uD83C\uDDE6|\uD83D\uDC69(?:\uD83C[\uDFFB-\uDFFF])|\uD83C\uDDFC(?:\uD83C[\uDDEB\uDDF8])|\uD83C\uDDEB(?:\uD83C[\uDDEE-\uDDF0\uDDF2\uDDF4\uDDF7])|\uD83C\uDDE9(?:\uD83C[\uDDEA\uDDEC\uDDEF\uDDF0\uDDF2\uDDF4\uDDFF])|\uD83C\uDDE7(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEF\uDDF1-\uDDF4\uDDF6-\uDDF9\uDDFB\uDDFC\uDDFE\uDDFF])|\uD83C\uDDF1(?:\uD83C[\uDDE6-\uDDE8\uDDEE\uDDF0\uDDF7-\uDDFB\uDDFE])|\uD83C\uDDFE(?:\uD83C[\uDDEA\uDDF9])|\uD83C\uDDF9(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDED\uDDEF-\uDDF4\uDDF7\uDDF9\uDDFB\uDDFC\uDDFF])|\uD83C\uDDF5(?:\uD83C[\uDDE6\uDDEA-\uDDED\uDDF0-\uDDF3\uDDF7-\uDDF9\uDDFC\uDDFE])|\uD83C\uDDEF(?:\uD83C[\uDDEA\uDDF2\uDDF4\uDDF5])|\uD83C\uDDED(?:\uD83C[\uDDF0\uDDF2\uDDF3\uDDF7\uDDF9\uDDFA])|\uD83C\uDDEE(?:\uD83C[\uDDE8-\uDDEA\uDDF1-\uDDF4\uDDF6-\uDDF9])|\uD83C\uDDFB(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDEE\uDDF3\uDDFA])|\uD83C\uDDEC(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEE\uDDF1-\uDDF3\uDDF5-\uDDFA\uDDFC\uDDFE])|\uD83C\uDDF7(?:\uD83C[\uDDEA\uDDF4\uDDF8\uDDFA\uDDFC])|\uD83C\uDDEA(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDED\uDDF7-\uDDFA])|\uD83C\uDDFA(?:\uD83C[\uDDE6\uDDEC\uDDF2\uDDF3\uDDF8\uDDFE\uDDFF])|\uD83C\uDDE8(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDEE\uDDF0-\uDDF5\uDDF7\uDDFA-\uDDFF])|\uD83C\uDDE6(?:\uD83C[\uDDE8-\uDDEC\uDDEE\uDDF1\uDDF2\uDDF4\uDDF6-\uDDFA\uDDFC\uDDFD\uDDFF])|[#\*0-9]\uFE0F\u20E3|\uD83C\uDDF8(?:\uD83C[\uDDE6-\uDDEA\uDDEC-\uDDF4\uDDF7-\uDDF9\uDDFB\uDDFD-\uDDFF])|\uD83C\uDDFF(?:\uD83C[\uDDE6\uDDF2\uDDFC])|\uD83C\uDDF0(?:\uD83C[\uDDEA\uDDEC-\uDDEE\uDDF2\uDDF3\uDDF5\uDDF7\uDDFC\uDDFE\uDDFF])|\uD83C\uDDF3(?:\uD83C[\uDDE6\uDDE8\uDDEA-\uDDEC\uDDEE\uDDF1\uDDF4\uDDF5\uDDF7\uDDFA\uDDFF])|\uD83C\uDDF2(?:\uD83C[\uDDE6\uDDE8-\uDDED\uDDF0-\uDDFF])|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3D\uDD3E\uDDD6-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u261D\u270A-\u270D]|\uD83C[\uDF85\uDFC2\uDFC7]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66\uDC67\uDC70\uDC72\uDC74-\uDC76\uDC78\uDC7C\uDC83\uDC85\uDCAA\uDD74\uDD7A\uDD90\uDD95\uDD96\uDE4C\uDE4F\uDEC0\uDECC]|\uD83E[\uDD18-\uDD1C\uDD1E\uDD1F\uDD30-\uDD36\uDDD1-\uDDD5])(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u261D\u26F9\u270A-\u270D]|\uD83C[\uDF85\uDFC2-\uDFC4\uDFC7\uDFCA-\uDFCC]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66-\uDC69\uDC6E\uDC70-\uDC78\uDC7C\uDC81-\uDC83\uDC85-\uDC87\uDCAA\uDD74\uDD75\uDD7A\uDD90\uDD95\uDD96\uDE45-\uDE47\uDE4B-\uDE4F\uDEA3\uDEB4-\uDEB6\uDEC0\uDECC]|\uD83E[\uDD18-\uDD1C\uDD1E\uDD1F\uDD26\uDD30-\uDD39\uDD3D\uDD3E\uDDD1-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])?|(?:[\u231A\u231B\u23E9-\u23EC\u23F0\u23F3\u25FD\u25FE\u2614\u2615\u2648-\u2653\u267F\u2693\u26A1\u26AA\u26AB\u26BD\u26BE\u26C4\u26C5\u26CE\u26D4\u26EA\u26F2\u26F3\u26F5\u26FA\u26FD\u2705\u270A\u270B\u2728\u274C\u274E\u2753-\u2755\u2757\u2795-\u2797\u27B0\u27BF\u2B1B\u2B1C\u2B50\u2B55]|\uD83C[\uDC04\uDCCF\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE1A\uDE2F\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF7C\uDF7E-\uDF93\uDFA0-\uDFCA\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF4\uDFF8-\uDFFF]|\uD83D[\uDC00-\uDC3E\uDC40\uDC42-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDD7A\uDD95\uDD96\uDDA4\uDDFB-\uDE4F\uDE80-\uDEC5\uDECC\uDED0-\uDED2\uDEEB\uDEEC\uDEF4-\uDEF8]|\uD83E[\uDD10-\uDD3A\uDD3C-\uDD3E\uDD40-\uDD45\uDD47-\uDD4C\uDD50-\uDD6B\uDD80-\uDD97\uDDC0\uDDD0-\uDDE6])|(?:[#\*0-9\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614\u2615\u2618\u261D\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u2660\u2663\u2665\u2666\u2668\u267B\u267F\u2692-\u2697\u2699\u269B\u269C\u26A0\u26A1\u26AA\u26AB\u26B0\u26B1\u26BD\u26BE\u26C4\u26C5\u26C8\u26CE\u26CF\u26D1\u26D3\u26D4\u26E9\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC04\uDCCF\uDD70\uDD71\uDD7E\uDD7F\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE02\uDE1A\uDE2F\uDE32-\uDE3A\uDE50\uDE51\uDF00-\uDF21\uDF24-\uDF93\uDF96\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFF]|\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F\uDD70\uDD73-\uDD7A\uDD87\uDD8A-\uDD8D\uDD90\uDD95\uDD96\uDDA4\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED2\uDEE0-\uDEE5\uDEE9\uDEEB\uDEEC\uDEF0\uDEF3-\uDEF8]|\uD83E[\uDD10-\uDD3A\uDD3C-\uDD3E\uDD40-\uDD45\uDD47-\uDD4C\uDD50-\uDD6B\uDD80-\uDD97\uDDC0\uDDD0-\uDDE6])\uFE0F/g
	);
};

var matchOperatorsRe = /[|\\{}()[\]^$+*?.]/g;

var escapeStringRegexp = function (str) {
	if (typeof str !== 'string') {
		throw new TypeError('Expected a string');
	}

	return str.replace(matchOperatorsRe, '\\$&');
};

var punctuation_ranges = [
    // http://www.unicode.org/charts/PDF/U3000.pdf CJK Symbols and Punctuation
    [0x3000, 0x303f],
    // http://www.unicode.org/charts/PDF/UAC00.pdf Hangul Syllables
    [0xac00, 0xd7af],
    // http://www.unicode.org/charts/PDF/UFE10.pdf Vertical Forms
    [0xfe10, 0xfe1f],
    // http://www.unicode.org/charts/PDF/UFE30.pdf CJK Compatibility Forms
    // http://www.unicode.org/charts/PDF/UFE50.pdf Small Form Variants
    [0xfe30, 0xfe6f],
    // http://www.unicode.org/charts/PDF/UFF00.pdf Halfwidth and Fullwidth Forms
    [0xff00, 0xff60],
    [0xffe0, 0xffef],
];
var character_ranges = [
    // http://www.unicode.org/charts/PDF/U1100.pdf Hangul Jamo
    [0x1100, 0x11ff],
    // http://www.unicode.org/charts/PDF/U2E80.pdf CJK Radicals Supplement
    // http://www.unicode.org/charts/PDF/U2F00.pdf Kangxi Radicals
    [0x2e80, 0x2fdf],
    // http://www.unicode.org/charts/PDF/U3040.pdf Hiragana
    // http://www.unicode.org/charts/PDF/U30A0.pdf Katakana
    // http://www.unicode.org/charts/PDF/U3100.pdf Bopomofo
    // http://www.unicode.org/charts/PDF/U3130.pdf Hangul Compatibility Jamo
    [0x3040, 0x318f],
    // http://www.unicode.org/charts/PDF/U3200.pdf Enclosed CJK Letters and Months
    // http://www.unicode.org/charts/PDF/U3300.pdf CJK Compatibility
    // http://www.unicode.org/charts/PDF/U3400.pdf CJK Unified Ideographs Extension A
    [0x3200, 0x4dbf],
    // http://www.unicode.org/charts/PDF/U4E00.pdf CJK Unified Ideographs (Han)
    [0x4e00, 0x9fff],
    // http://www.unicode.org/charts/PDF/UA960.pdf Hangul Jamo Extended-A
    [0xa960, 0xa97f],
    // http://www.unicode.org/charts/PDF/UF900.pdf CJK Compatibility Ideographs
    [0xf900, 0xfaff],
];
function get_regex() {
    return create_regex(character_ranges.concat(punctuation_ranges));
}
// istanbul ignore next
// tslint:disable-next-line:no-namespace
(function (get_regex) {
    function punctuations() {
        return create_regex(punctuation_ranges);
    }
    get_regex.punctuations = punctuations;
    function characters() {
        return create_regex(character_ranges);
    }
    get_regex.characters = characters;
})(get_regex || (get_regex = {}));
function create_regex(ranges) {
    return new RegExp("[" + ranges.map(get_bracket_content).reduce(function (a, b) { return a + b; }) + "]", 'g');
}
function get_bracket_content(range) {
    return get_escaped_unicode(range[0]) + "-" + get_escaped_unicode(range[1]);
}
function get_escaped_unicode(num) {
    return "\\u" + num.toString(16);
}
var lib$1 = get_regex;

var data_generated = createCommonjsModule(function (module, exports) {
"use strict";
exports.__esModule = true;
exports.get_data = function () { return ({ "Pc": [[95, 95], [8255, 8256], [8276, 8276], [65075, 65076], [65101, 65103], [65343, 65343]], "Pe": [[41, 41], [93, 93], [125, 125], [3899, 3899], [3901, 3901], [5788, 5788], [8262, 8262], [8318, 8318], [8334, 8334], [8969, 8969], [8971, 8971], [9002, 9002], [10089, 10089], [10091, 10091], [10093, 10093], [10095, 10095], [10097, 10097], [10099, 10099], [10101, 10101], [10182, 10182], [10215, 10215], [10217, 10217], [10219, 10219], [10221, 10221], [10223, 10223], [10628, 10628], [10630, 10630], [10632, 10632], [10634, 10634], [10636, 10636], [10638, 10638], [10640, 10640], [10642, 10642], [10644, 10644], [10646, 10646], [10648, 10648], [10713, 10713], [10715, 10715], [10749, 10749], [11811, 11811], [11813, 11813], [11815, 11815], [11817, 11817], [12297, 12297], [12299, 12299], [12301, 12301], [12303, 12303], [12305, 12305], [12309, 12309], [12311, 12311], [12313, 12313], [12315, 12315], [12318, 12319], [64830, 64830], [65048, 65048], [65078, 65078], [65080, 65080], [65082, 65082], [65084, 65084], [65086, 65086], [65088, 65088], [65090, 65090], [65092, 65092], [65096, 65096], [65114, 65114], [65116, 65116], [65118, 65118], [65289, 65289], [65341, 65341], [65373, 65373], [65376, 65376], [65379, 65379]], "Ps": [[40, 40], [91, 91], [123, 123], [3898, 3898], [3900, 3900], [5787, 5787], [8218, 8218], [8222, 8222], [8261, 8261], [8317, 8317], [8333, 8333], [8968, 8968], [8970, 8970], [9001, 9001], [10088, 10088], [10090, 10090], [10092, 10092], [10094, 10094], [10096, 10096], [10098, 10098], [10100, 10100], [10181, 10181], [10214, 10214], [10216, 10216], [10218, 10218], [10220, 10220], [10222, 10222], [10627, 10627], [10629, 10629], [10631, 10631], [10633, 10633], [10635, 10635], [10637, 10637], [10639, 10639], [10641, 10641], [10643, 10643], [10645, 10645], [10647, 10647], [10712, 10712], [10714, 10714], [10748, 10748], [11810, 11810], [11812, 11812], [11814, 11814], [11816, 11816], [11842, 11842], [12296, 12296], [12298, 12298], [12300, 12300], [12302, 12302], [12304, 12304], [12308, 12308], [12310, 12310], [12312, 12312], [12314, 12314], [12317, 12317], [64831, 64831], [65047, 65047], [65077, 65077], [65079, 65079], [65081, 65081], [65083, 65083], [65085, 65085], [65087, 65087], [65089, 65089], [65091, 65091], [65095, 65095], [65113, 65113], [65115, 65115], [65117, 65117], [65288, 65288], [65339, 65339], [65371, 65371], [65375, 65375], [65378, 65378]], "Lm": [[688, 705], [710, 721], [736, 740], [748, 748], [750, 750], [884, 884], [890, 890], [1369, 1369], [1600, 1600], [1765, 1766], [2036, 2037], [2042, 2042], [2074, 2074], [2084, 2084], [2088, 2088], [2417, 2417], [3654, 3654], [3782, 3782], [4348, 4348], [6103, 6103], [6211, 6211], [6823, 6823], [7288, 7293], [7468, 7530], [7544, 7544], [7579, 7615], [8305, 8305], [8319, 8319], [8336, 8348], [11388, 11389], [11631, 11631], [11823, 11823], [12293, 12293], [12337, 12341], [12347, 12347], [12445, 12446], [12540, 12542], [40981, 40981], [42232, 42237], [42508, 42508], [42623, 42623], [42652, 42653], [42775, 42783], [42864, 42864], [42888, 42888], [43000, 43001], [43471, 43471], [43494, 43494], [43632, 43632], [43741, 43741], [43763, 43764], [43868, 43871], [65392, 65392], [65438, 65439]], "Mc": [[2307, 2307], [2363, 2363], [2366, 2368], [2377, 2380], [2382, 2383], [2434, 2435], [2494, 2496], [2503, 2504], [2507, 2508], [2519, 2519], [2563, 2563], [2622, 2624], [2691, 2691], [2750, 2752], [2761, 2761], [2763, 2764], [2818, 2819], [2878, 2878], [2880, 2880], [2887, 2888], [2891, 2892], [2903, 2903], [3006, 3007], [3009, 3010], [3014, 3016], [3018, 3020], [3031, 3031], [3073, 3075], [3137, 3140], [3202, 3203], [3262, 3262], [3264, 3268], [3271, 3272], [3274, 3275], [3285, 3286], [3330, 3331], [3390, 3392], [3398, 3400], [3402, 3404], [3415, 3415], [3458, 3459], [3535, 3537], [3544, 3551], [3570, 3571], [3902, 3903], [3967, 3967], [4139, 4140], [4145, 4145], [4152, 4152], [4155, 4156], [4182, 4183], [4194, 4196], [4199, 4205], [4227, 4228], [4231, 4236], [4239, 4239], [4250, 4252], [6070, 6070], [6078, 6085], [6087, 6088], [6435, 6438], [6441, 6443], [6448, 6449], [6451, 6456], [6681, 6682], [6741, 6741], [6743, 6743], [6753, 6753], [6755, 6756], [6765, 6770], [6916, 6916], [6965, 6965], [6971, 6971], [6973, 6977], [6979, 6980], [7042, 7042], [7073, 7073], [7078, 7079], [7082, 7082], [7143, 7143], [7146, 7148], [7150, 7150], [7154, 7155], [7204, 7211], [7220, 7221], [7393, 7393], [7410, 7411], [7415, 7415], [12334, 12335], [43043, 43044], [43047, 43047], [43136, 43137], [43188, 43203], [43346, 43347], [43395, 43395], [43444, 43445], [43450, 43451], [43453, 43456], [43567, 43568], [43571, 43572], [43597, 43597], [43643, 43643], [43645, 43645], [43755, 43755], [43758, 43759], [43765, 43765], [44003, 44004], [44006, 44007], [44009, 44010], [44012, 44012]], "Zp": [[8233, 8233]], "Sc": [[36, 36], [162, 165], [1423, 1423], [1547, 1547], [2546, 2547], [2555, 2555], [2801, 2801], [3065, 3065], [3647, 3647], [6107, 6107], [8352, 8383], [43064, 43064], [65020, 65020], [65129, 65129], [65284, 65284], [65504, 65505], [65509, 65510]], "Me": [[1160, 1161], [6846, 6846], [8413, 8416], [8418, 8420], [42608, 42610]], "Sk": [[94, 94], [96, 96], [168, 168], [175, 175], [180, 180], [184, 184], [706, 709], [722, 735], [741, 747], [749, 749], [751, 767], [885, 885], [900, 901], [8125, 8125], [8127, 8129], [8141, 8143], [8157, 8159], [8173, 8175], [8189, 8190], [12443, 12444], [42752, 42774], [42784, 42785], [42889, 42890], [43867, 43867], [64434, 64449], [65342, 65342], [65344, 65344], [65507, 65507]], "Cs": [[55296, 55296], [56191, 56192], [56319, 56320], [57343, 57343]], "Nl": [[5870, 5872], [8544, 8578], [8581, 8584], [12295, 12295], [12321, 12329], [12344, 12346], [42726, 42735]], "So": [[166, 166], [169, 169], [174, 174], [176, 176], [1154, 1154], [1421, 1422], [1550, 1551], [1758, 1758], [1769, 1769], [1789, 1790], [2038, 2038], [2554, 2554], [2928, 2928], [3059, 3064], [3066, 3066], [3199, 3199], [3407, 3407], [3449, 3449], [3841, 3843], [3859, 3859], [3861, 3863], [3866, 3871], [3892, 3892], [3894, 3894], [3896, 3896], [4030, 4037], [4039, 4044], [4046, 4047], [4053, 4056], [4254, 4255], [5008, 5017], [6464, 6464], [6622, 6655], [7009, 7018], [7028, 7036], [8448, 8449], [8451, 8454], [8456, 8457], [8468, 8468], [8470, 8471], [8478, 8483], [8485, 8485], [8487, 8487], [8489, 8489], [8494, 8494], [8506, 8507], [8522, 8522], [8524, 8525], [8527, 8527], [8586, 8587], [8597, 8601], [8604, 8607], [8609, 8610], [8612, 8613], [8615, 8621], [8623, 8653], [8656, 8657], [8659, 8659], [8661, 8691], [8960, 8967], [8972, 8991], [8994, 9000], [9003, 9083], [9085, 9114], [9140, 9179], [9186, 9254], [9280, 9290], [9372, 9449], [9472, 9654], [9656, 9664], [9666, 9719], [9728, 9838], [9840, 10087], [10132, 10175], [10240, 10495], [11008, 11055], [11077, 11078], [11085, 11123], [11126, 11157], [11160, 11193], [11197, 11208], [11210, 11218], [11244, 11247], [11493, 11498], [11904, 11929], [11931, 12019], [12032, 12245], [12272, 12283], [12292, 12292], [12306, 12307], [12320, 12320], [12342, 12343], [12350, 12351], [12688, 12689], [12694, 12703], [12736, 12771], [12800, 12830], [12842, 12871], [12880, 12880], [12896, 12927], [12938, 12976], [12992, 13054], [13056, 13311], [19904, 19967], [42128, 42182], [43048, 43051], [43062, 43063], [43065, 43065], [43639, 43641], [65021, 65021], [65508, 65508], [65512, 65512], [65517, 65518], [65532, 65533]], "Lt": [[453, 453], [456, 456], [459, 459], [498, 498], [8072, 8079], [8088, 8095], [8104, 8111], [8124, 8124], [8140, 8140], [8188, 8188]], "Zl": [[8232, 8232]], "Lo": [[170, 170], [186, 186], [443, 443], [448, 451], [660, 660], [1488, 1514], [1520, 1522], [1568, 1599], [1601, 1610], [1646, 1647], [1649, 1747], [1749, 1749], [1774, 1775], [1786, 1788], [1791, 1791], [1808, 1808], [1810, 1839], [1869, 1957], [1969, 1969], [1994, 2026], [2048, 2069], [2112, 2136], [2144, 2154], [2208, 2228], [2230, 2237], [2308, 2361], [2365, 2365], [2384, 2384], [2392, 2401], [2418, 2432], [2437, 2444], [2447, 2448], [2451, 2472], [2474, 2480], [2482, 2482], [2486, 2489], [2493, 2493], [2510, 2510], [2524, 2525], [2527, 2529], [2544, 2545], [2556, 2556], [2565, 2570], [2575, 2576], [2579, 2600], [2602, 2608], [2610, 2611], [2613, 2614], [2616, 2617], [2649, 2652], [2654, 2654], [2674, 2676], [2693, 2701], [2703, 2705], [2707, 2728], [2730, 2736], [2738, 2739], [2741, 2745], [2749, 2749], [2768, 2768], [2784, 2785], [2809, 2809], [2821, 2828], [2831, 2832], [2835, 2856], [2858, 2864], [2866, 2867], [2869, 2873], [2877, 2877], [2908, 2909], [2911, 2913], [2929, 2929], [2947, 2947], [2949, 2954], [2958, 2960], [2962, 2965], [2969, 2970], [2972, 2972], [2974, 2975], [2979, 2980], [2984, 2986], [2990, 3001], [3024, 3024], [3077, 3084], [3086, 3088], [3090, 3112], [3114, 3129], [3133, 3133], [3160, 3162], [3168, 3169], [3200, 3200], [3205, 3212], [3214, 3216], [3218, 3240], [3242, 3251], [3253, 3257], [3261, 3261], [3294, 3294], [3296, 3297], [3313, 3314], [3333, 3340], [3342, 3344], [3346, 3386], [3389, 3389], [3406, 3406], [3412, 3414], [3423, 3425], [3450, 3455], [3461, 3478], [3482, 3505], [3507, 3515], [3517, 3517], [3520, 3526], [3585, 3632], [3634, 3635], [3648, 3653], [3713, 3714], [3716, 3716], [3719, 3720], [3722, 3722], [3725, 3725], [3732, 3735], [3737, 3743], [3745, 3747], [3749, 3749], [3751, 3751], [3754, 3755], [3757, 3760], [3762, 3763], [3773, 3773], [3776, 3780], [3804, 3807], [3840, 3840], [3904, 3911], [3913, 3948], [3976, 3980], [4096, 4138], [4159, 4159], [4176, 4181], [4186, 4189], [4193, 4193], [4197, 4198], [4206, 4208], [4213, 4225], [4238, 4238], [4304, 4346], [4349, 4680], [4682, 4685], [4688, 4694], [4696, 4696], [4698, 4701], [4704, 4744], [4746, 4749], [4752, 4784], [4786, 4789], [4792, 4798], [4800, 4800], [4802, 4805], [4808, 4822], [4824, 4880], [4882, 4885], [4888, 4954], [4992, 5007], [5121, 5740], [5743, 5759], [5761, 5786], [5792, 5866], [5873, 5880], [5888, 5900], [5902, 5905], [5920, 5937], [5952, 5969], [5984, 5996], [5998, 6000], [6016, 6067], [6108, 6108], [6176, 6210], [6212, 6263], [6272, 6276], [6279, 6312], [6314, 6314], [6320, 6389], [6400, 6430], [6480, 6509], [6512, 6516], [6528, 6571], [6576, 6601], [6656, 6678], [6688, 6740], [6917, 6963], [6981, 6987], [7043, 7072], [7086, 7087], [7098, 7141], [7168, 7203], [7245, 7247], [7258, 7287], [7401, 7404], [7406, 7409], [7413, 7414], [8501, 8504], [11568, 11623], [11648, 11670], [11680, 11686], [11688, 11694], [11696, 11702], [11704, 11710], [11712, 11718], [11720, 11726], [11728, 11734], [11736, 11742], [12294, 12294], [12348, 12348], [12353, 12438], [12447, 12447], [12449, 12538], [12543, 12543], [12549, 12590], [12593, 12686], [12704, 12730], [12784, 12799], [13312, 13312], [19893, 19893], [19968, 19968], [40938, 40938], [40960, 40980], [40982, 42124], [42192, 42231], [42240, 42507], [42512, 42527], [42538, 42539], [42606, 42606], [42656, 42725], [42895, 42895], [42999, 42999], [43003, 43009], [43011, 43013], [43015, 43018], [43020, 43042], [43072, 43123], [43138, 43187], [43250, 43255], [43259, 43259], [43261, 43261], [43274, 43301], [43312, 43334], [43360, 43388], [43396, 43442], [43488, 43492], [43495, 43503], [43514, 43518], [43520, 43560], [43584, 43586], [43588, 43595], [43616, 43631], [43633, 43638], [43642, 43642], [43646, 43695], [43697, 43697], [43701, 43702], [43705, 43709], [43712, 43712], [43714, 43714], [43739, 43740], [43744, 43754], [43762, 43762], [43777, 43782], [43785, 43790], [43793, 43798], [43808, 43814], [43816, 43822], [43968, 44002], [44032, 44032], [55203, 55203], [55216, 55238], [55243, 55291], [63744, 64109], [64112, 64217], [64285, 64285], [64287, 64296], [64298, 64310], [64312, 64316], [64318, 64318], [64320, 64321], [64323, 64324], [64326, 64433], [64467, 64829], [64848, 64911], [64914, 64967], [65008, 65019], [65136, 65140], [65142, 65276], [65382, 65391], [65393, 65437], [65440, 65470], [65474, 65479], [65482, 65487], [65490, 65495], [65498, 65500]], "Mn": [[768, 879], [1155, 1159], [1425, 1469], [1471, 1471], [1473, 1474], [1476, 1477], [1479, 1479], [1552, 1562], [1611, 1631], [1648, 1648], [1750, 1756], [1759, 1764], [1767, 1768], [1770, 1773], [1809, 1809], [1840, 1866], [1958, 1968], [2027, 2035], [2070, 2073], [2075, 2083], [2085, 2087], [2089, 2093], [2137, 2139], [2260, 2273], [2275, 2306], [2362, 2362], [2364, 2364], [2369, 2376], [2381, 2381], [2385, 2391], [2402, 2403], [2433, 2433], [2492, 2492], [2497, 2500], [2509, 2509], [2530, 2531], [2561, 2562], [2620, 2620], [2625, 2626], [2631, 2632], [2635, 2637], [2641, 2641], [2672, 2673], [2677, 2677], [2689, 2690], [2748, 2748], [2753, 2757], [2759, 2760], [2765, 2765], [2786, 2787], [2810, 2815], [2817, 2817], [2876, 2876], [2879, 2879], [2881, 2884], [2893, 2893], [2902, 2902], [2914, 2915], [2946, 2946], [3008, 3008], [3021, 3021], [3072, 3072], [3134, 3136], [3142, 3144], [3146, 3149], [3157, 3158], [3170, 3171], [3201, 3201], [3260, 3260], [3263, 3263], [3270, 3270], [3276, 3277], [3298, 3299], [3328, 3329], [3387, 3388], [3393, 3396], [3405, 3405], [3426, 3427], [3530, 3530], [3538, 3540], [3542, 3542], [3633, 3633], [3636, 3642], [3655, 3662], [3761, 3761], [3764, 3769], [3771, 3772], [3784, 3789], [3864, 3865], [3893, 3893], [3895, 3895], [3897, 3897], [3953, 3966], [3968, 3972], [3974, 3975], [3981, 3991], [3993, 4028], [4038, 4038], [4141, 4144], [4146, 4151], [4153, 4154], [4157, 4158], [4184, 4185], [4190, 4192], [4209, 4212], [4226, 4226], [4229, 4230], [4237, 4237], [4253, 4253], [4957, 4959], [5906, 5908], [5938, 5940], [5970, 5971], [6002, 6003], [6068, 6069], [6071, 6077], [6086, 6086], [6089, 6099], [6109, 6109], [6155, 6157], [6277, 6278], [6313, 6313], [6432, 6434], [6439, 6440], [6450, 6450], [6457, 6459], [6679, 6680], [6683, 6683], [6742, 6742], [6744, 6750], [6752, 6752], [6754, 6754], [6757, 6764], [6771, 6780], [6783, 6783], [6832, 6845], [6912, 6915], [6964, 6964], [6966, 6970], [6972, 6972], [6978, 6978], [7019, 7027], [7040, 7041], [7074, 7077], [7080, 7081], [7083, 7085], [7142, 7142], [7144, 7145], [7149, 7149], [7151, 7153], [7212, 7219], [7222, 7223], [7376, 7378], [7380, 7392], [7394, 7400], [7405, 7405], [7412, 7412], [7416, 7417], [7616, 7673], [7675, 7679], [8400, 8412], [8417, 8417], [8421, 8432], [11503, 11505], [11647, 11647], [11744, 11775], [12330, 12333], [12441, 12442], [42607, 42607], [42612, 42621], [42654, 42655], [42736, 42737], [43010, 43010], [43014, 43014], [43019, 43019], [43045, 43046], [43204, 43205], [43232, 43249], [43302, 43309], [43335, 43345], [43392, 43394], [43443, 43443], [43446, 43449], [43452, 43452], [43493, 43493], [43561, 43566], [43569, 43570], [43573, 43574], [43587, 43587], [43596, 43596], [43644, 43644], [43696, 43696], [43698, 43700], [43703, 43704], [43710, 43711], [43713, 43713], [43756, 43757], [43766, 43766], [44005, 44005], [44008, 44008], [44013, 44013], [64286, 64286], [65024, 65039], [65056, 65071]], "Po": [[33, 35], [37, 39], [42, 42], [44, 44], [46, 47], [58, 59], [63, 64], [92, 92], [161, 161], [167, 167], [182, 183], [191, 191], [894, 894], [903, 903], [1370, 1375], [1417, 1417], [1472, 1472], [1475, 1475], [1478, 1478], [1523, 1524], [1545, 1546], [1548, 1549], [1563, 1563], [1566, 1567], [1642, 1645], [1748, 1748], [1792, 1805], [2039, 2041], [2096, 2110], [2142, 2142], [2404, 2405], [2416, 2416], [2557, 2557], [2800, 2800], [3572, 3572], [3663, 3663], [3674, 3675], [3844, 3858], [3860, 3860], [3973, 3973], [4048, 4052], [4057, 4058], [4170, 4175], [4347, 4347], [4960, 4968], [5741, 5742], [5867, 5869], [5941, 5942], [6100, 6102], [6104, 6106], [6144, 6149], [6151, 6154], [6468, 6469], [6686, 6687], [6816, 6822], [6824, 6829], [7002, 7008], [7164, 7167], [7227, 7231], [7294, 7295], [7360, 7367], [7379, 7379], [8214, 8215], [8224, 8231], [8240, 8248], [8251, 8254], [8257, 8259], [8263, 8273], [8275, 8275], [8277, 8286], [11513, 11516], [11518, 11519], [11632, 11632], [11776, 11777], [11782, 11784], [11787, 11787], [11790, 11798], [11800, 11801], [11803, 11803], [11806, 11807], [11818, 11822], [11824, 11833], [11836, 11839], [11841, 11841], [11843, 11849], [12289, 12291], [12349, 12349], [12539, 12539], [42238, 42239], [42509, 42511], [42611, 42611], [42622, 42622], [42738, 42743], [43124, 43127], [43214, 43215], [43256, 43258], [43260, 43260], [43310, 43311], [43359, 43359], [43457, 43469], [43486, 43487], [43612, 43615], [43742, 43743], [43760, 43761], [44011, 44011], [65040, 65046], [65049, 65049], [65072, 65072], [65093, 65094], [65097, 65100], [65104, 65106], [65108, 65111], [65119, 65121], [65128, 65128], [65130, 65131], [65281, 65283], [65285, 65287], [65290, 65290], [65292, 65292], [65294, 65295], [65306, 65307], [65311, 65312], [65340, 65340], [65377, 65377], [65380, 65381]], "Co": [[57344, 57344], [63743, 63743]], "Sm": [[43, 43], [60, 62], [124, 124], [126, 126], [172, 172], [177, 177], [215, 215], [247, 247], [1014, 1014], [1542, 1544], [8260, 8260], [8274, 8274], [8314, 8316], [8330, 8332], [8472, 8472], [8512, 8516], [8523, 8523], [8592, 8596], [8602, 8603], [8608, 8608], [8611, 8611], [8614, 8614], [8622, 8622], [8654, 8655], [8658, 8658], [8660, 8660], [8692, 8959], [8992, 8993], [9084, 9084], [9115, 9139], [9180, 9185], [9655, 9655], [9665, 9665], [9720, 9727], [9839, 9839], [10176, 10180], [10183, 10213], [10224, 10239], [10496, 10626], [10649, 10711], [10716, 10747], [10750, 11007], [11056, 11076], [11079, 11084], [64297, 64297], [65122, 65122], [65124, 65126], [65291, 65291], [65308, 65310], [65372, 65372], [65374, 65374], [65506, 65506], [65513, 65516]], "Pf": [[187, 187], [8217, 8217], [8221, 8221], [8250, 8250], [11779, 11779], [11781, 11781], [11786, 11786], [11789, 11789], [11805, 11805], [11809, 11809]], "Cc": [[0, 31], [127, 159]], "Pi": [[171, 171], [8216, 8216], [8219, 8220], [8223, 8223], [8249, 8249], [11778, 11778], [11780, 11780], [11785, 11785], [11788, 11788], [11804, 11804], [11808, 11808]], "Lu": [[65, 90], [192, 214], [216, 222], [256, 256], [258, 258], [260, 260], [262, 262], [264, 264], [266, 266], [268, 268], [270, 270], [272, 272], [274, 274], [276, 276], [278, 278], [280, 280], [282, 282], [284, 284], [286, 286], [288, 288], [290, 290], [292, 292], [294, 294], [296, 296], [298, 298], [300, 300], [302, 302], [304, 304], [306, 306], [308, 308], [310, 310], [313, 313], [315, 315], [317, 317], [319, 319], [321, 321], [323, 323], [325, 325], [327, 327], [330, 330], [332, 332], [334, 334], [336, 336], [338, 338], [340, 340], [342, 342], [344, 344], [346, 346], [348, 348], [350, 350], [352, 352], [354, 354], [356, 356], [358, 358], [360, 360], [362, 362], [364, 364], [366, 366], [368, 368], [370, 370], [372, 372], [374, 374], [376, 377], [379, 379], [381, 381], [385, 386], [388, 388], [390, 391], [393, 395], [398, 401], [403, 404], [406, 408], [412, 413], [415, 416], [418, 418], [420, 420], [422, 423], [425, 425], [428, 428], [430, 431], [433, 435], [437, 437], [439, 440], [444, 444], [452, 452], [455, 455], [458, 458], [461, 461], [463, 463], [465, 465], [467, 467], [469, 469], [471, 471], [473, 473], [475, 475], [478, 478], [480, 480], [482, 482], [484, 484], [486, 486], [488, 488], [490, 490], [492, 492], [494, 494], [497, 497], [500, 500], [502, 504], [506, 506], [508, 508], [510, 510], [512, 512], [514, 514], [516, 516], [518, 518], [520, 520], [522, 522], [524, 524], [526, 526], [528, 528], [530, 530], [532, 532], [534, 534], [536, 536], [538, 538], [540, 540], [542, 542], [544, 544], [546, 546], [548, 548], [550, 550], [552, 552], [554, 554], [556, 556], [558, 558], [560, 560], [562, 562], [570, 571], [573, 574], [577, 577], [579, 582], [584, 584], [586, 586], [588, 588], [590, 590], [880, 880], [882, 882], [886, 886], [895, 895], [902, 902], [904, 906], [908, 908], [910, 911], [913, 929], [931, 939], [975, 975], [978, 980], [984, 984], [986, 986], [988, 988], [990, 990], [992, 992], [994, 994], [996, 996], [998, 998], [1000, 1000], [1002, 1002], [1004, 1004], [1006, 1006], [1012, 1012], [1015, 1015], [1017, 1018], [1021, 1071], [1120, 1120], [1122, 1122], [1124, 1124], [1126, 1126], [1128, 1128], [1130, 1130], [1132, 1132], [1134, 1134], [1136, 1136], [1138, 1138], [1140, 1140], [1142, 1142], [1144, 1144], [1146, 1146], [1148, 1148], [1150, 1150], [1152, 1152], [1162, 1162], [1164, 1164], [1166, 1166], [1168, 1168], [1170, 1170], [1172, 1172], [1174, 1174], [1176, 1176], [1178, 1178], [1180, 1180], [1182, 1182], [1184, 1184], [1186, 1186], [1188, 1188], [1190, 1190], [1192, 1192], [1194, 1194], [1196, 1196], [1198, 1198], [1200, 1200], [1202, 1202], [1204, 1204], [1206, 1206], [1208, 1208], [1210, 1210], [1212, 1212], [1214, 1214], [1216, 1217], [1219, 1219], [1221, 1221], [1223, 1223], [1225, 1225], [1227, 1227], [1229, 1229], [1232, 1232], [1234, 1234], [1236, 1236], [1238, 1238], [1240, 1240], [1242, 1242], [1244, 1244], [1246, 1246], [1248, 1248], [1250, 1250], [1252, 1252], [1254, 1254], [1256, 1256], [1258, 1258], [1260, 1260], [1262, 1262], [1264, 1264], [1266, 1266], [1268, 1268], [1270, 1270], [1272, 1272], [1274, 1274], [1276, 1276], [1278, 1278], [1280, 1280], [1282, 1282], [1284, 1284], [1286, 1286], [1288, 1288], [1290, 1290], [1292, 1292], [1294, 1294], [1296, 1296], [1298, 1298], [1300, 1300], [1302, 1302], [1304, 1304], [1306, 1306], [1308, 1308], [1310, 1310], [1312, 1312], [1314, 1314], [1316, 1316], [1318, 1318], [1320, 1320], [1322, 1322], [1324, 1324], [1326, 1326], [1329, 1366], [4256, 4293], [4295, 4295], [4301, 4301], [5024, 5109], [7680, 7680], [7682, 7682], [7684, 7684], [7686, 7686], [7688, 7688], [7690, 7690], [7692, 7692], [7694, 7694], [7696, 7696], [7698, 7698], [7700, 7700], [7702, 7702], [7704, 7704], [7706, 7706], [7708, 7708], [7710, 7710], [7712, 7712], [7714, 7714], [7716, 7716], [7718, 7718], [7720, 7720], [7722, 7722], [7724, 7724], [7726, 7726], [7728, 7728], [7730, 7730], [7732, 7732], [7734, 7734], [7736, 7736], [7738, 7738], [7740, 7740], [7742, 7742], [7744, 7744], [7746, 7746], [7748, 7748], [7750, 7750], [7752, 7752], [7754, 7754], [7756, 7756], [7758, 7758], [7760, 7760], [7762, 7762], [7764, 7764], [7766, 7766], [7768, 7768], [7770, 7770], [7772, 7772], [7774, 7774], [7776, 7776], [7778, 7778], [7780, 7780], [7782, 7782], [7784, 7784], [7786, 7786], [7788, 7788], [7790, 7790], [7792, 7792], [7794, 7794], [7796, 7796], [7798, 7798], [7800, 7800], [7802, 7802], [7804, 7804], [7806, 7806], [7808, 7808], [7810, 7810], [7812, 7812], [7814, 7814], [7816, 7816], [7818, 7818], [7820, 7820], [7822, 7822], [7824, 7824], [7826, 7826], [7828, 7828], [7838, 7838], [7840, 7840], [7842, 7842], [7844, 7844], [7846, 7846], [7848, 7848], [7850, 7850], [7852, 7852], [7854, 7854], [7856, 7856], [7858, 7858], [7860, 7860], [7862, 7862], [7864, 7864], [7866, 7866], [7868, 7868], [7870, 7870], [7872, 7872], [7874, 7874], [7876, 7876], [7878, 7878], [7880, 7880], [7882, 7882], [7884, 7884], [7886, 7886], [7888, 7888], [7890, 7890], [7892, 7892], [7894, 7894], [7896, 7896], [7898, 7898], [7900, 7900], [7902, 7902], [7904, 7904], [7906, 7906], [7908, 7908], [7910, 7910], [7912, 7912], [7914, 7914], [7916, 7916], [7918, 7918], [7920, 7920], [7922, 7922], [7924, 7924], [7926, 7926], [7928, 7928], [7930, 7930], [7932, 7932], [7934, 7934], [7944, 7951], [7960, 7965], [7976, 7983], [7992, 7999], [8008, 8013], [8025, 8025], [8027, 8027], [8029, 8029], [8031, 8031], [8040, 8047], [8120, 8123], [8136, 8139], [8152, 8155], [8168, 8172], [8184, 8187], [8450, 8450], [8455, 8455], [8459, 8461], [8464, 8466], [8469, 8469], [8473, 8477], [8484, 8484], [8486, 8486], [8488, 8488], [8490, 8493], [8496, 8499], [8510, 8511], [8517, 8517], [8579, 8579], [11264, 11310], [11360, 11360], [11362, 11364], [11367, 11367], [11369, 11369], [11371, 11371], [11373, 11376], [11378, 11378], [11381, 11381], [11390, 11392], [11394, 11394], [11396, 11396], [11398, 11398], [11400, 11400], [11402, 11402], [11404, 11404], [11406, 11406], [11408, 11408], [11410, 11410], [11412, 11412], [11414, 11414], [11416, 11416], [11418, 11418], [11420, 11420], [11422, 11422], [11424, 11424], [11426, 11426], [11428, 11428], [11430, 11430], [11432, 11432], [11434, 11434], [11436, 11436], [11438, 11438], [11440, 11440], [11442, 11442], [11444, 11444], [11446, 11446], [11448, 11448], [11450, 11450], [11452, 11452], [11454, 11454], [11456, 11456], [11458, 11458], [11460, 11460], [11462, 11462], [11464, 11464], [11466, 11466], [11468, 11468], [11470, 11470], [11472, 11472], [11474, 11474], [11476, 11476], [11478, 11478], [11480, 11480], [11482, 11482], [11484, 11484], [11486, 11486], [11488, 11488], [11490, 11490], [11499, 11499], [11501, 11501], [11506, 11506], [42560, 42560], [42562, 42562], [42564, 42564], [42566, 42566], [42568, 42568], [42570, 42570], [42572, 42572], [42574, 42574], [42576, 42576], [42578, 42578], [42580, 42580], [42582, 42582], [42584, 42584], [42586, 42586], [42588, 42588], [42590, 42590], [42592, 42592], [42594, 42594], [42596, 42596], [42598, 42598], [42600, 42600], [42602, 42602], [42604, 42604], [42624, 42624], [42626, 42626], [42628, 42628], [42630, 42630], [42632, 42632], [42634, 42634], [42636, 42636], [42638, 42638], [42640, 42640], [42642, 42642], [42644, 42644], [42646, 42646], [42648, 42648], [42650, 42650], [42786, 42786], [42788, 42788], [42790, 42790], [42792, 42792], [42794, 42794], [42796, 42796], [42798, 42798], [42802, 42802], [42804, 42804], [42806, 42806], [42808, 42808], [42810, 42810], [42812, 42812], [42814, 42814], [42816, 42816], [42818, 42818], [42820, 42820], [42822, 42822], [42824, 42824], [42826, 42826], [42828, 42828], [42830, 42830], [42832, 42832], [42834, 42834], [42836, 42836], [42838, 42838], [42840, 42840], [42842, 42842], [42844, 42844], [42846, 42846], [42848, 42848], [42850, 42850], [42852, 42852], [42854, 42854], [42856, 42856], [42858, 42858], [42860, 42860], [42862, 42862], [42873, 42873], [42875, 42875], [42877, 42878], [42880, 42880], [42882, 42882], [42884, 42884], [42886, 42886], [42891, 42891], [42893, 42893], [42896, 42896], [42898, 42898], [42902, 42902], [42904, 42904], [42906, 42906], [42908, 42908], [42910, 42910], [42912, 42912], [42914, 42914], [42916, 42916], [42918, 42918], [42920, 42920], [42922, 42926], [42928, 42932], [42934, 42934], [65313, 65338]], "Pd": [[45, 45], [1418, 1418], [1470, 1470], [5120, 5120], [6150, 6150], [8208, 8213], [11799, 11799], [11802, 11802], [11834, 11835], [11840, 11840], [12316, 12316], [12336, 12336], [12448, 12448], [65073, 65074], [65112, 65112], [65123, 65123], [65293, 65293]], "Cf": [[173, 173], [1536, 1541], [1564, 1564], [1757, 1757], [1807, 1807], [2274, 2274], [6158, 6158], [8203, 8207], [8234, 8238], [8288, 8292], [8294, 8303], [65279, 65279], [65529, 65531]], "Nd": [[48, 57], [1632, 1641], [1776, 1785], [1984, 1993], [2406, 2415], [2534, 2543], [2662, 2671], [2790, 2799], [2918, 2927], [3046, 3055], [3174, 3183], [3302, 3311], [3430, 3439], [3558, 3567], [3664, 3673], [3792, 3801], [3872, 3881], [4160, 4169], [4240, 4249], [6112, 6121], [6160, 6169], [6470, 6479], [6608, 6617], [6784, 6793], [6800, 6809], [6992, 7001], [7088, 7097], [7232, 7241], [7248, 7257], [42528, 42537], [43216, 43225], [43264, 43273], [43472, 43481], [43504, 43513], [43600, 43609], [44016, 44025], [65296, 65305]], "Ll": [[97, 122], [181, 181], [223, 246], [248, 255], [257, 257], [259, 259], [261, 261], [263, 263], [265, 265], [267, 267], [269, 269], [271, 271], [273, 273], [275, 275], [277, 277], [279, 279], [281, 281], [283, 283], [285, 285], [287, 287], [289, 289], [291, 291], [293, 293], [295, 295], [297, 297], [299, 299], [301, 301], [303, 303], [305, 305], [307, 307], [309, 309], [311, 312], [314, 314], [316, 316], [318, 318], [320, 320], [322, 322], [324, 324], [326, 326], [328, 329], [331, 331], [333, 333], [335, 335], [337, 337], [339, 339], [341, 341], [343, 343], [345, 345], [347, 347], [349, 349], [351, 351], [353, 353], [355, 355], [357, 357], [359, 359], [361, 361], [363, 363], [365, 365], [367, 367], [369, 369], [371, 371], [373, 373], [375, 375], [378, 378], [380, 380], [382, 384], [387, 387], [389, 389], [392, 392], [396, 397], [402, 402], [405, 405], [409, 411], [414, 414], [417, 417], [419, 419], [421, 421], [424, 424], [426, 427], [429, 429], [432, 432], [436, 436], [438, 438], [441, 442], [445, 447], [454, 454], [457, 457], [460, 460], [462, 462], [464, 464], [466, 466], [468, 468], [470, 470], [472, 472], [474, 474], [476, 477], [479, 479], [481, 481], [483, 483], [485, 485], [487, 487], [489, 489], [491, 491], [493, 493], [495, 496], [499, 499], [501, 501], [505, 505], [507, 507], [509, 509], [511, 511], [513, 513], [515, 515], [517, 517], [519, 519], [521, 521], [523, 523], [525, 525], [527, 527], [529, 529], [531, 531], [533, 533], [535, 535], [537, 537], [539, 539], [541, 541], [543, 543], [545, 545], [547, 547], [549, 549], [551, 551], [553, 553], [555, 555], [557, 557], [559, 559], [561, 561], [563, 569], [572, 572], [575, 576], [578, 578], [583, 583], [585, 585], [587, 587], [589, 589], [591, 659], [661, 687], [881, 881], [883, 883], [887, 887], [891, 893], [912, 912], [940, 974], [976, 977], [981, 983], [985, 985], [987, 987], [989, 989], [991, 991], [993, 993], [995, 995], [997, 997], [999, 999], [1001, 1001], [1003, 1003], [1005, 1005], [1007, 1011], [1013, 1013], [1016, 1016], [1019, 1020], [1072, 1119], [1121, 1121], [1123, 1123], [1125, 1125], [1127, 1127], [1129, 1129], [1131, 1131], [1133, 1133], [1135, 1135], [1137, 1137], [1139, 1139], [1141, 1141], [1143, 1143], [1145, 1145], [1147, 1147], [1149, 1149], [1151, 1151], [1153, 1153], [1163, 1163], [1165, 1165], [1167, 1167], [1169, 1169], [1171, 1171], [1173, 1173], [1175, 1175], [1177, 1177], [1179, 1179], [1181, 1181], [1183, 1183], [1185, 1185], [1187, 1187], [1189, 1189], [1191, 1191], [1193, 1193], [1195, 1195], [1197, 1197], [1199, 1199], [1201, 1201], [1203, 1203], [1205, 1205], [1207, 1207], [1209, 1209], [1211, 1211], [1213, 1213], [1215, 1215], [1218, 1218], [1220, 1220], [1222, 1222], [1224, 1224], [1226, 1226], [1228, 1228], [1230, 1231], [1233, 1233], [1235, 1235], [1237, 1237], [1239, 1239], [1241, 1241], [1243, 1243], [1245, 1245], [1247, 1247], [1249, 1249], [1251, 1251], [1253, 1253], [1255, 1255], [1257, 1257], [1259, 1259], [1261, 1261], [1263, 1263], [1265, 1265], [1267, 1267], [1269, 1269], [1271, 1271], [1273, 1273], [1275, 1275], [1277, 1277], [1279, 1279], [1281, 1281], [1283, 1283], [1285, 1285], [1287, 1287], [1289, 1289], [1291, 1291], [1293, 1293], [1295, 1295], [1297, 1297], [1299, 1299], [1301, 1301], [1303, 1303], [1305, 1305], [1307, 1307], [1309, 1309], [1311, 1311], [1313, 1313], [1315, 1315], [1317, 1317], [1319, 1319], [1321, 1321], [1323, 1323], [1325, 1325], [1327, 1327], [1377, 1415], [5112, 5117], [7296, 7304], [7424, 7467], [7531, 7543], [7545, 7578], [7681, 7681], [7683, 7683], [7685, 7685], [7687, 7687], [7689, 7689], [7691, 7691], [7693, 7693], [7695, 7695], [7697, 7697], [7699, 7699], [7701, 7701], [7703, 7703], [7705, 7705], [7707, 7707], [7709, 7709], [7711, 7711], [7713, 7713], [7715, 7715], [7717, 7717], [7719, 7719], [7721, 7721], [7723, 7723], [7725, 7725], [7727, 7727], [7729, 7729], [7731, 7731], [7733, 7733], [7735, 7735], [7737, 7737], [7739, 7739], [7741, 7741], [7743, 7743], [7745, 7745], [7747, 7747], [7749, 7749], [7751, 7751], [7753, 7753], [7755, 7755], [7757, 7757], [7759, 7759], [7761, 7761], [7763, 7763], [7765, 7765], [7767, 7767], [7769, 7769], [7771, 7771], [7773, 7773], [7775, 7775], [7777, 7777], [7779, 7779], [7781, 7781], [7783, 7783], [7785, 7785], [7787, 7787], [7789, 7789], [7791, 7791], [7793, 7793], [7795, 7795], [7797, 7797], [7799, 7799], [7801, 7801], [7803, 7803], [7805, 7805], [7807, 7807], [7809, 7809], [7811, 7811], [7813, 7813], [7815, 7815], [7817, 7817], [7819, 7819], [7821, 7821], [7823, 7823], [7825, 7825], [7827, 7827], [7829, 7837], [7839, 7839], [7841, 7841], [7843, 7843], [7845, 7845], [7847, 7847], [7849, 7849], [7851, 7851], [7853, 7853], [7855, 7855], [7857, 7857], [7859, 7859], [7861, 7861], [7863, 7863], [7865, 7865], [7867, 7867], [7869, 7869], [7871, 7871], [7873, 7873], [7875, 7875], [7877, 7877], [7879, 7879], [7881, 7881], [7883, 7883], [7885, 7885], [7887, 7887], [7889, 7889], [7891, 7891], [7893, 7893], [7895, 7895], [7897, 7897], [7899, 7899], [7901, 7901], [7903, 7903], [7905, 7905], [7907, 7907], [7909, 7909], [7911, 7911], [7913, 7913], [7915, 7915], [7917, 7917], [7919, 7919], [7921, 7921], [7923, 7923], [7925, 7925], [7927, 7927], [7929, 7929], [7931, 7931], [7933, 7933], [7935, 7943], [7952, 7957], [7968, 7975], [7984, 7991], [8000, 8005], [8016, 8023], [8032, 8039], [8048, 8061], [8064, 8071], [8080, 8087], [8096, 8103], [8112, 8116], [8118, 8119], [8126, 8126], [8130, 8132], [8134, 8135], [8144, 8147], [8150, 8151], [8160, 8167], [8178, 8180], [8182, 8183], [8458, 8458], [8462, 8463], [8467, 8467], [8495, 8495], [8500, 8500], [8505, 8505], [8508, 8509], [8518, 8521], [8526, 8526], [8580, 8580], [11312, 11358], [11361, 11361], [11365, 11366], [11368, 11368], [11370, 11370], [11372, 11372], [11377, 11377], [11379, 11380], [11382, 11387], [11393, 11393], [11395, 11395], [11397, 11397], [11399, 11399], [11401, 11401], [11403, 11403], [11405, 11405], [11407, 11407], [11409, 11409], [11411, 11411], [11413, 11413], [11415, 11415], [11417, 11417], [11419, 11419], [11421, 11421], [11423, 11423], [11425, 11425], [11427, 11427], [11429, 11429], [11431, 11431], [11433, 11433], [11435, 11435], [11437, 11437], [11439, 11439], [11441, 11441], [11443, 11443], [11445, 11445], [11447, 11447], [11449, 11449], [11451, 11451], [11453, 11453], [11455, 11455], [11457, 11457], [11459, 11459], [11461, 11461], [11463, 11463], [11465, 11465], [11467, 11467], [11469, 11469], [11471, 11471], [11473, 11473], [11475, 11475], [11477, 11477], [11479, 11479], [11481, 11481], [11483, 11483], [11485, 11485], [11487, 11487], [11489, 11489], [11491, 11492], [11500, 11500], [11502, 11502], [11507, 11507], [11520, 11557], [11559, 11559], [11565, 11565], [42561, 42561], [42563, 42563], [42565, 42565], [42567, 42567], [42569, 42569], [42571, 42571], [42573, 42573], [42575, 42575], [42577, 42577], [42579, 42579], [42581, 42581], [42583, 42583], [42585, 42585], [42587, 42587], [42589, 42589], [42591, 42591], [42593, 42593], [42595, 42595], [42597, 42597], [42599, 42599], [42601, 42601], [42603, 42603], [42605, 42605], [42625, 42625], [42627, 42627], [42629, 42629], [42631, 42631], [42633, 42633], [42635, 42635], [42637, 42637], [42639, 42639], [42641, 42641], [42643, 42643], [42645, 42645], [42647, 42647], [42649, 42649], [42651, 42651], [42787, 42787], [42789, 42789], [42791, 42791], [42793, 42793], [42795, 42795], [42797, 42797], [42799, 42801], [42803, 42803], [42805, 42805], [42807, 42807], [42809, 42809], [42811, 42811], [42813, 42813], [42815, 42815], [42817, 42817], [42819, 42819], [42821, 42821], [42823, 42823], [42825, 42825], [42827, 42827], [42829, 42829], [42831, 42831], [42833, 42833], [42835, 42835], [42837, 42837], [42839, 42839], [42841, 42841], [42843, 42843], [42845, 42845], [42847, 42847], [42849, 42849], [42851, 42851], [42853, 42853], [42855, 42855], [42857, 42857], [42859, 42859], [42861, 42861], [42863, 42863], [42865, 42872], [42874, 42874], [42876, 42876], [42879, 42879], [42881, 42881], [42883, 42883], [42885, 42885], [42887, 42887], [42892, 42892], [42894, 42894], [42897, 42897], [42899, 42901], [42903, 42903], [42905, 42905], [42907, 42907], [42909, 42909], [42911, 42911], [42913, 42913], [42915, 42915], [42917, 42917], [42919, 42919], [42921, 42921], [42933, 42933], [42935, 42935], [43002, 43002], [43824, 43866], [43872, 43877], [43888, 43967], [64256, 64262], [64275, 64279], [65345, 65370]], "No": [[178, 179], [185, 185], [188, 190], [2548, 2553], [2930, 2935], [3056, 3058], [3192, 3198], [3416, 3422], [3440, 3448], [3882, 3891], [4969, 4988], [6128, 6137], [6618, 6618], [8304, 8304], [8308, 8313], [8320, 8329], [8528, 8543], [8585, 8585], [9312, 9371], [9450, 9471], [10102, 10131], [11517, 11517], [12690, 12693], [12832, 12841], [12872, 12879], [12881, 12895], [12928, 12937], [12977, 12991], [43056, 43061]], "Zs": [[32, 32], [160, 160], [5760, 5760], [8192, 8202], [8239, 8239], [8287, 8287], [12288, 12288]] }); };
});

unwrapExports(data_generated);

var utils = createCommonjsModule(function (module, exports) {
"use strict";
exports.__esModule = true;
function normalize_ranges(ranges) {
    return ranges
        .sort(function (_a, _b) {
        var start1 = _a[0];
        var start2 = _b[0];
        return start1 - start2;
    })
        .reduce(function (current, tuple, index) {
        if (index === 0) {
            return [tuple];
        }
        var _a = current[current.length - 1], last_start = _a[0], last_end = _a[1];
        var start = tuple[0], end = tuple[1];
        return last_end + 1 === start
            ? current.slice(0, -1).concat([[last_start, end]]) : current.concat([tuple]);
    }, []);
}
exports.normalize_ranges = normalize_ranges;
function build_regex(ranges, flag) {
    var pattern = ranges
        .map(function (_a) {
        var start = _a[0], end = _a[1];
        return start === end
            ? "\\u" + get_hex(start)
            : "\\u" + get_hex(start) + "-\\u" + get_hex(end);
    })
        .join('');
    return new RegExp("[" + pattern + "]", flag);
}
exports.build_regex = build_regex;
function get_hex(char_code) {
    var hex = char_code.toString(16);
    while (hex.length < 4) {
        hex = "0" + hex;
    }
    return hex;
}
});

unwrapExports(utils);

var lib$3 = function (categories, flag) {
    var data = data_generated.get_data();
    var ranges = categories.reduce(function (current, category) { return current.concat(data[category]); }, []);
    return utils.build_regex(utils.normalize_ranges(ranges), flag);
};

const emojiRegex = emojiRegex$1();




const cjkPattern = lib$1().source;

// http://spec.commonmark.org/0.25/#ascii-punctuation-character
const asciiPunctuationCharRange = escapeStringRegexp(
  "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~"
);

// http://spec.commonmark.org/0.25/#punctuation-character
const punctuationCharRange = `${asciiPunctuationCharRange}${lib$3([
  "Pc",
  "Pd",
  "Pe",
  "Pf",
  "Pi",
  "Po",
  "Ps"
]).source.slice(1, -1)}`; // remove bracket expression `[` and `]`

const punctuationRegex = new RegExp(`[${punctuationCharRange}]`);

function isExportDeclaration(node) {
  if (node) {
    switch (node.type) {
      case "ExportDefaultDeclaration":
      case "ExportDefaultSpecifier":
      case "DeclareExportDeclaration":
      case "ExportNamedDeclaration":
      case "ExportAllDeclaration":
        return true;
    }
  }

  return false;
}

function getParentExportDeclaration(path$$1) {
  const parentNode = path$$1.getParentNode();
  if (path$$1.getName() === "declaration" && isExportDeclaration(parentNode)) {
    return parentNode;
  }

  return null;
}

function getPenultimate(arr) {
  if (arr.length > 1) {
    return arr[arr.length - 2];
  }
  return null;
}

function getLast(arr) {
  if (arr.length > 0) {
    return arr[arr.length - 1];
  }
  return null;
}

function skip(chars) {
  return (text, index, opts) => {
    const backwards = opts && opts.backwards;

    // Allow `skip` functions to be threaded together without having
    // to check for failures (did someone say monads?).
    if (index === false) {
      return false;
    }

    const length = text.length;
    let cursor = index;
    while (cursor >= 0 && cursor < length) {
      const c = text.charAt(cursor);
      if (chars instanceof RegExp) {
        if (!chars.test(c)) {
          return cursor;
        }
      } else if (chars.indexOf(c) === -1) {
        return cursor;
      }

      backwards ? cursor-- : cursor++;
    }

    if (cursor === -1 || cursor === length) {
      // If we reached the beginning or end of the file, return the
      // out-of-bounds cursor. It's up to the caller to handle this
      // correctly. We don't want to indicate `false` though if it
      // actually skipped valid characters.
      return cursor;
    }
    return false;
  };
}

const skipWhitespace = skip(/\s/);
const skipSpaces = skip(" \t");
const skipToLineEnd = skip(",; \t");
const skipEverythingButNewLine = skip(/[^\r\n]/);

function skipInlineComment(text, index) {
  if (index === false) {
    return false;
  }

  if (text.charAt(index) === "/" && text.charAt(index + 1) === "*") {
    for (let i = index + 2; i < text.length; ++i) {
      if (text.charAt(i) === "*" && text.charAt(i + 1) === "/") {
        return i + 2;
      }
    }
  }
  return index;
}

function skipTrailingComment(text, index) {
  if (index === false) {
    return false;
  }

  if (text.charAt(index) === "/" && text.charAt(index + 1) === "/") {
    return skipEverythingButNewLine(text, index);
  }
  return index;
}

// This one doesn't use the above helper function because it wants to
// test \r\n in order and `skip` doesn't support ordering and we only
// want to skip one newline. It's simple to implement.
function skipNewline(text, index, opts) {
  const backwards = opts && opts.backwards;
  if (index === false) {
    return false;
  }

  const atIndex = text.charAt(index);
  if (backwards) {
    if (text.charAt(index - 1) === "\r" && atIndex === "\n") {
      return index - 2;
    }
    if (
      atIndex === "\n" ||
      atIndex === "\r" ||
      atIndex === "\u2028" ||
      atIndex === "\u2029"
    ) {
      return index - 1;
    }
  } else {
    if (atIndex === "\r" && text.charAt(index + 1) === "\n") {
      return index + 2;
    }
    if (
      atIndex === "\n" ||
      atIndex === "\r" ||
      atIndex === "\u2028" ||
      atIndex === "\u2029"
    ) {
      return index + 1;
    }
  }

  return index;
}

function hasNewline(text, index, opts) {
  opts = opts || {};
  const idx = skipSpaces(text, opts.backwards ? index - 1 : index, opts);
  const idx2 = skipNewline(text, idx, opts);
  return idx !== idx2;
}

function hasNewlineInRange(text, start, end) {
  for (let i = start; i < end; ++i) {
    if (text.charAt(i) === "\n") {
      return true;
    }
  }
  return false;
}

// Note: this function doesn't ignore leading comments unlike isNextLineEmpty
function isPreviousLineEmpty(text, node, locStart) {
  let idx = locStart(node) - 1;
  idx = skipSpaces(text, idx, { backwards: true });
  idx = skipNewline(text, idx, { backwards: true });
  idx = skipSpaces(text, idx, { backwards: true });
  const idx2 = skipNewline(text, idx, { backwards: true });
  return idx !== idx2;
}

function isNextLineEmptyAfterIndex(text, index) {
  let oldIdx = null;
  let idx = index;
  while (idx !== oldIdx) {
    // We need to skip all the potential trailing inline comments
    oldIdx = idx;
    idx = skipToLineEnd(text, idx);
    idx = skipInlineComment(text, idx);
    idx = skipSpaces(text, idx);
  }
  idx = skipTrailingComment(text, idx);
  idx = skipNewline(text, idx);
  return hasNewline(text, idx);
}

function isNextLineEmpty(text, node, locEnd) {
  return isNextLineEmptyAfterIndex(text, locEnd(node));
}

function getNextNonSpaceNonCommentCharacterIndex(text, node, locEnd) {
  let oldIdx = null;
  let idx = locEnd(node);
  while (idx !== oldIdx) {
    oldIdx = idx;
    idx = skipSpaces(text, idx);
    idx = skipInlineComment(text, idx);
    idx = skipTrailingComment(text, idx);
    idx = skipNewline(text, idx);
  }
  return idx;
}

function getNextNonSpaceNonCommentCharacter(text, node, locEnd) {
  return text.charAt(
    getNextNonSpaceNonCommentCharacterIndex(text, node, locEnd)
  );
}

function hasSpaces(text, index, opts) {
  opts = opts || {};
  const idx = skipSpaces(text, opts.backwards ? index - 1 : index, opts);
  return idx !== index;
}

// Super inefficient, needs to be cached.
function lineColumnToIndex(lineColumn, text) {
  let index = 0;
  for (let i = 0; i < lineColumn.line - 1; ++i) {
    index = text.indexOf("\n", index) + 1;
    if (index === -1) {
      return -1;
    }
  }
  return index + lineColumn.column;
}

function setLocStart(node, index) {
  if (node.range) {
    node.range[0] = index;
  } else {
    node.start = index;
  }
}

function setLocEnd(node, index) {
  if (node.range) {
    node.range[1] = index;
  } else {
    node.end = index;
  }
}

const PRECEDENCE = {};
[
  ["|>"],
  ["||", "??"],
  ["&&"],
  ["|"],
  ["^"],
  ["&"],
  ["==", "===", "!=", "!=="],
  ["<", ">", "<=", ">=", "in", "instanceof"],
  [">>", "<<", ">>>"],
  ["+", "-"],
  ["*", "/", "%"],
  ["**"]
].forEach((tier, i) => {
  tier.forEach(op => {
    PRECEDENCE[op] = i;
  });
});

function getPrecedence(op) {
  return PRECEDENCE[op];
}

const equalityOperators = {
  "==": true,
  "!=": true,
  "===": true,
  "!==": true
};
const additiveOperators = {
  "+": true,
  "-": true
};
const multiplicativeOperators = {
  "*": true,
  "/": true,
  "%": true
};
const bitshiftOperators = {
  ">>": true,
  ">>>": true,
  "<<": true
};

function shouldFlatten(parentOp, nodeOp) {
  if (getPrecedence(nodeOp) !== getPrecedence(parentOp)) {
    // x + y % z --> (x + y) % z
    if (nodeOp === "%" && !additiveOperators[parentOp]) {
      return true;
    }

    return false;
  }

  // ** is right-associative
  // x ** y ** z --> x ** (y ** z)
  if (parentOp === "**") {
    return false;
  }

  // x == y == z --> (x == y) == z
  if (equalityOperators[parentOp] && equalityOperators[nodeOp]) {
    return false;
  }

  // x * y % z --> (x * y) % z
  if (
    (nodeOp === "%" && multiplicativeOperators[parentOp]) ||
    (parentOp === "%" && multiplicativeOperators[nodeOp])
  ) {
    return false;
  }

  // x * y / z --> (x * y) / z
  // x / y * z --> (x / y) * z
  if (
    nodeOp !== parentOp &&
    multiplicativeOperators[nodeOp] &&
    multiplicativeOperators[parentOp]
  ) {
    return false;
  }

  // x << y << z --> (x << y) << z
  if (bitshiftOperators[parentOp] && bitshiftOperators[nodeOp]) {
    return false;
  }

  return true;
}

function isBitwiseOperator(operator) {
  return (
    !!bitshiftOperators[operator] ||
    operator === "|" ||
    operator === "^" ||
    operator === "&"
  );
}

// Tests if an expression starts with `{`, or (if forbidFunctionAndClass holds) `function` or `class`.
// Will be overzealous if there's already necessary grouping parentheses.
function startsWithNoLookaheadToken(node, forbidFunctionAndClass) {
  node = getLeftMost(node);
  switch (node.type) {
    // Hack. Remove after https://github.com/eslint/typescript-eslint-parser/issues/331
    case "ObjectPattern":
      return !forbidFunctionAndClass;
    case "FunctionExpression":
    case "ClassExpression":
      return forbidFunctionAndClass;
    case "ObjectExpression":
      return true;
    case "MemberExpression":
      return startsWithNoLookaheadToken(node.object, forbidFunctionAndClass);
    case "TaggedTemplateExpression":
      if (node.tag.type === "FunctionExpression") {
        // IIFEs are always already parenthesized
        return false;
      }
      return startsWithNoLookaheadToken(node.tag, forbidFunctionAndClass);
    case "CallExpression":
      if (node.callee.type === "FunctionExpression") {
        // IIFEs are always already parenthesized
        return false;
      }
      return startsWithNoLookaheadToken(node.callee, forbidFunctionAndClass);
    case "ConditionalExpression":
      return startsWithNoLookaheadToken(node.test, forbidFunctionAndClass);
    case "UpdateExpression":
      return (
        !node.prefix &&
        startsWithNoLookaheadToken(node.argument, forbidFunctionAndClass)
      );
    case "BindExpression":
      return (
        node.object &&
        startsWithNoLookaheadToken(node.object, forbidFunctionAndClass)
      );
    case "SequenceExpression":
      return startsWithNoLookaheadToken(
        node.expressions[0],
        forbidFunctionAndClass
      );
    case "TSAsExpression":
      return startsWithNoLookaheadToken(
        node.expression,
        forbidFunctionAndClass
      );
    default:
      return false;
  }
}

function getLeftMost(node) {
  if (node.left) {
    return getLeftMost(node.left);
  }
  return node;
}

function getAlignmentSize(value, tabWidth, startIndex) {
  startIndex = startIndex || 0;

  let size = 0;
  for (let i = startIndex; i < value.length; ++i) {
    if (value[i] === "\t") {
      // Tabs behave in a way that they are aligned to the nearest
      // multiple of tabWidth:
      // 0 -> 4, 1 -> 4, 2 -> 4, 3 -> 4
      // 4 -> 8, 5 -> 8, 6 -> 8, 7 -> 8 ...
      size = size + tabWidth - size % tabWidth;
    } else {
      size++;
    }
  }

  return size;
}

function getIndentSize(value, tabWidth) {
  const lastNewlineIndex = value.lastIndexOf("\n");
  if (lastNewlineIndex === -1) {
    return 0;
  }

  return getAlignmentSize(
    // All the leading whitespaces
    value.slice(lastNewlineIndex + 1).match(/^[ \t]*/)[0],
    tabWidth
  );
}

function printString(raw, options, isDirectiveLiteral) {
  // `rawContent` is the string exactly like it appeared in the input source
  // code, without its enclosing quotes.
  const rawContent = raw.slice(1, -1);

  const double = { quote: '"', regex: /"/g };
  const single = { quote: "'", regex: /'/g };

  const preferred = options.singleQuote ? single : double;
  const alternate = preferred === single ? double : single;

  let shouldUseAlternateQuote = false;
  let canChangeDirectiveQuotes = false;

  // If `rawContent` contains at least one of the quote preferred for enclosing
  // the string, we might want to enclose with the alternate quote instead, to
  // minimize the number of escaped quotes.
  // Also check for the alternate quote, to determine if we're allowed to swap
  // the quotes on a DirectiveLiteral.
  if (
    rawContent.includes(preferred.quote) ||
    rawContent.includes(alternate.quote)
  ) {
    const numPreferredQuotes = (rawContent.match(preferred.regex) || []).length;
    const numAlternateQuotes = (rawContent.match(alternate.regex) || []).length;

    shouldUseAlternateQuote = numPreferredQuotes > numAlternateQuotes;
  } else {
    canChangeDirectiveQuotes = true;
  }

  const enclosingQuote =
    options.parser === "json"
      ? double.quote
      : shouldUseAlternateQuote
        ? alternate.quote
        : preferred.quote;

  // Directives are exact code unit sequences, which means that you can't
  // change the escape sequences they use.
  // See https://github.com/prettier/prettier/issues/1555
  // and https://tc39.github.io/ecma262/#directive-prologue
  if (isDirectiveLiteral) {
    if (canChangeDirectiveQuotes) {
      return enclosingQuote + rawContent + enclosingQuote;
    }
    return raw;
  }

  // It might sound unnecessary to use `makeString` even if the string already
  // is enclosed with `enclosingQuote`, but it isn't. The string could contain
  // unnecessary escapes (such as in `"\'"`). Always using `makeString` makes
  // sure that we consistently output the minimum amount of escaped quotes.
  return makeString(
    rawContent,
    enclosingQuote,
    !(
      options.parser === "css" ||
      options.parser === "less" ||
      options.parser === "scss"
    )
  );
}

function makeString(rawContent, enclosingQuote, unescapeUnnecessaryEscapes) {
  const otherQuote = enclosingQuote === '"' ? "'" : '"';

  // Matches _any_ escape and unescaped quotes (both single and double).
  const regex = /\\([\s\S])|(['"])/g;

  // Escape and unescape single and double quotes as needed to be able to
  // enclose `rawContent` with `enclosingQuote`.
  const newContent = rawContent.replace(regex, (match, escaped, quote) => {
    // If we matched an escape, and the escaped character is a quote of the
    // other type than we intend to enclose the string with, there's no need for
    // it to be escaped, so return it _without_ the backslash.
    if (escaped === otherQuote) {
      return escaped;
    }

    // If we matched an unescaped quote and it is of the _same_ type as we
    // intend to enclose the string with, it must be escaped, so return it with
    // a backslash.
    if (quote === enclosingQuote) {
      return "\\" + quote;
    }

    if (quote) {
      return quote;
    }

    // Unescape any unnecessarily escaped character.
    // Adapted from https://github.com/eslint/eslint/blob/de0b4ad7bd820ade41b1f606008bea68683dc11a/lib/rules/no-useless-escape.js#L27
    return unescapeUnnecessaryEscapes &&
      /^[^\\nrvtbfux\r\n\u2028\u2029"'0-7]$/.test(escaped)
      ? escaped
      : "\\" + escaped;
  });

  return enclosingQuote + newContent + enclosingQuote;
}

function printNumber(rawNumber) {
  return (
    rawNumber
      .toLowerCase()
      // Remove unnecessary plus and zeroes from scientific notation.
      .replace(/^([+-]?[\d.]+e)(?:\+|(-))?0*(\d)/, "$1$2$3")
      // Remove unnecessary scientific notation (1e0).
      .replace(/^([+-]?[\d.]+)e[+-]?0+$/, "$1")
      // Make sure numbers always start with a digit.
      .replace(/^([+-])?\./, "$10.")
      // Remove extraneous trailing decimal zeroes.
      .replace(/(\.\d+?)0+(?=e|$)/, "$1")
      // Remove trailing dot.
      .replace(/\.(?=e|$)/, "")
  );
}

function getMaxContinuousCount(str, target) {
  const results = str.match(
    new RegExp(`(${escapeStringRegexp(target)})+`, "g")
  );

  if (results === null) {
    return 0;
  }

  return results.reduce(
    (maxCount, result) => Math.max(maxCount, result.length / target.length),
    0
  );
}

/**
 * split text into whitespaces and words
 * @param {string} text
 * @return {Array<{ type: "whitespace", value: " " | "\n" | "" } | { type: "word", value: string }>}
 */
function splitText(text) {
  const KIND_NON_CJK = "non-cjk";
  const KIND_CJK_CHARACTER = "cjk-character";
  const KIND_CJK_PUNCTUATION = "cjk-punctuation";

  const nodes = [];

  text
    .replace(new RegExp(`(${cjkPattern})\n(${cjkPattern})`, "g"), "$1$2")
    .split(/([ \t\n]+)/)
    .forEach((token, index, tokens) => {
      // whitespace
      if (index % 2 === 1) {
        nodes.push({
          type: "whitespace",
          value: /\n/.test(token) ? "\n" : " "
        });
        return;
      }

      // word separated by whitespace

      if ((index === 0 || index === tokens.length - 1) && token === "") {
        return;
      }

      token
        .split(new RegExp(`(${cjkPattern})`))
        .forEach((innerToken, innerIndex, innerTokens) => {
          if (
            (innerIndex === 0 || innerIndex === innerTokens.length - 1) &&
            innerToken === ""
          ) {
            return;
          }

          // non-CJK word
          if (innerIndex % 2 === 0) {
            if (innerToken !== "") {
              appendNode({
                type: "word",
                value: innerToken,
                kind: KIND_NON_CJK,
                hasLeadingPunctuation: punctuationRegex.test(innerToken[0]),
                hasTrailingPunctuation: punctuationRegex.test(
                  getLast(innerToken)
                )
              });
            }
            return;
          }

          // CJK character
          appendNode(
            punctuationRegex.test(innerToken)
              ? {
                  type: "word",
                  value: innerToken,
                  kind: KIND_CJK_PUNCTUATION,
                  hasLeadingPunctuation: true,
                  hasTrailingPunctuation: true
                }
              : {
                  type: "word",
                  value: innerToken,
                  kind: KIND_CJK_CHARACTER,
                  hasLeadingPunctuation: false,
                  hasTrailingPunctuation: false
                }
          );
        });
    });

  return nodes;

  function appendNode(node) {
    const lastNode = getLast(nodes);
    if (lastNode && lastNode.type === "word") {
      if (
        (lastNode.kind === KIND_NON_CJK &&
          node.kind === KIND_CJK_CHARACTER &&
          !lastNode.hasTrailingPunctuation) ||
        (lastNode.kind === KIND_CJK_CHARACTER &&
          node.kind === KIND_NON_CJK &&
          !node.hasLeadingPunctuation)
      ) {
        nodes.push({ type: "whitespace", value: " " });
      } else if (
        !isBetween(KIND_NON_CJK, KIND_CJK_PUNCTUATION) &&
        // disallow leading/trailing full-width whitespace
        ![lastNode.value, node.value].some(value => /\u3000/.test(value))
      ) {
        nodes.push({ type: "whitespace", value: "" });
      }
    }
    nodes.push(node);

    function isBetween(kind1, kind2) {
      return (
        (lastNode.kind === kind1 && node.kind === kind2) ||
        (lastNode.kind === kind2 && node.kind === kind1)
      );
    }
  }
}

function getStringWidth(text) {
  if (!text) {
    return 0;
  }

  // emojis are considered 2-char width for consistency
  // see https://github.com/sindresorhus/string-width/issues/11
  // for the reason why not implemented in `string-width`
  return stringWidth(text.replace(emojiRegex, "  "));
}

function hasIgnoreComment(path$$1) {
  const node = path$$1.getValue();
  return hasNodeIgnoreComment(node);
}

function hasNodeIgnoreComment(node) {
  return (
    node &&
    node.comments &&
    node.comments.length > 0 &&
    node.comments.some(comment => comment.value.trim() === "prettier-ignore")
  );
}

function addCommentHelper(node, comment) {
  const comments = node.comments || (node.comments = []);
  comments.push(comment);
  comment.printed = false;

  // For some reason, TypeScript parses `// x` inside of JSXText as a comment
  // We already "print" it via the raw text, we don't need to re-print it as a
  // comment
  if (node.type === "JSXText") {
    comment.printed = true;
  }
}

function addLeadingComment$1(node, comment) {
  comment.leading = true;
  comment.trailing = false;
  addCommentHelper(node, comment);
}

function addDanglingComment$1(node, comment) {
  comment.leading = false;
  comment.trailing = false;
  addCommentHelper(node, comment);
}

function addTrailingComment$1(node, comment) {
  comment.leading = false;
  comment.trailing = true;
  addCommentHelper(node, comment);
}

var util$1 = {
  punctuationRegex,
  punctuationCharRange,
  getStringWidth,
  splitText,
  getMaxContinuousCount,
  getPrecedence,
  shouldFlatten,
  isBitwiseOperator,
  isExportDeclaration,
  getParentExportDeclaration,
  getPenultimate,
  getLast,
  getNextNonSpaceNonCommentCharacterIndex,
  getNextNonSpaceNonCommentCharacter,
  skipWhitespace,
  skipSpaces,
  skipNewline,
  isNextLineEmptyAfterIndex,
  isNextLineEmpty,
  isPreviousLineEmpty,
  hasNewline,
  hasNewlineInRange,
  hasSpaces,
  setLocStart,
  setLocEnd,
  startsWithNoLookaheadToken,
  getAlignmentSize,
  getIndentSize,
  printString,
  printNumber,
  hasIgnoreComment,
  hasNodeIgnoreComment,
  lineColumnToIndex,
  makeString,
  addLeadingComment: addLeadingComment$1,
  addDanglingComment: addDanglingComment$1,
  addTrailingComment: addTrailingComment$1
};

const concat$3 = docBuilders$2.concat;
const fill$2 = docBuilders$2.fill;
const cursor$2 = docBuilders$2.cursor;

const MODE_BREAK = 1;
const MODE_FLAT = 2;

function rootIndent() {
  return { value: "", length: 0, queue: [] };
}

function makeIndent(ind, options) {
  return generateInd(ind, { type: "indent" }, options);
}

function makeAlign(ind, n, options) {
  return n === -Infinity
    ? ind.root || rootIndent()
    : n < 0
      ? generateInd(ind, { type: "dedent" }, options)
      : !n
        ? ind
        : n.type === "root"
          ? Object.assign({}, ind, { root: ind })
          : typeof n === "string"
            ? generateInd(ind, { type: "stringAlign", n }, options)
            : generateInd(ind, { type: "numberAlign", n }, options);
}

function generateInd(ind, newPart, options) {
  const queue =
    newPart.type === "dedent"
      ? ind.queue.slice(0, -1)
      : ind.queue.concat(newPart);

  let value = "";
  let length = 0;
  let lastTabs = 0;
  let lastSpaces = 0;

  for (const part of queue) {
    switch (part.type) {
      case "indent":
        flush();
        if (options.useTabs) {
          addTabs(1);
        } else {
          addSpaces(options.tabWidth);
        }
        break;
      case "stringAlign":
        flush();
        value += part.n;
        length += part.n.length;
        break;
      case "numberAlign":
        lastTabs += 1;
        lastSpaces += part.n;
        break;
      /* istanbul ignore next */
      default:
        throw new Error(`Unexpected type '${part.type}'`);
    }
  }

  flushSpaces();

  return Object.assign({}, ind, { value, length, queue });

  function addTabs(count) {
    value += "\t".repeat(count);
    length += options.tabWidth * count;
  }

  function addSpaces(count) {
    value += " ".repeat(count);
    length += count;
  }

  function flush() {
    if (options.useTabs) {
      flushTabs();
    } else {
      flushSpaces();
    }
  }

  function flushTabs() {
    if (lastTabs > 0) {
      addTabs(lastTabs);
    }
    resetLast();
  }

  function flushSpaces() {
    if (lastSpaces > 0) {
      addSpaces(lastSpaces);
    }
    resetLast();
  }

  function resetLast() {
    lastTabs = 0;
    lastSpaces = 0;
  }
}

function fits(next, restCommands, width, options, mustBeFlat) {
  let restIdx = restCommands.length;
  const cmds = [next];
  while (width >= 0) {
    if (cmds.length === 0) {
      if (restIdx === 0) {
        return true;
      }
      cmds.push(restCommands[restIdx - 1]);

      restIdx--;

      continue;
    }

    const x = cmds.pop();
    const ind = x[0];
    const mode = x[1];
    const doc = x[2];

    if (typeof doc === "string") {
      width -= util$1.getStringWidth(doc);
    } else {
      switch (doc.type) {
        case "concat":
          for (let i = doc.parts.length - 1; i >= 0; i--) {
            cmds.push([ind, mode, doc.parts[i]]);
          }

          break;
        case "indent":
          cmds.push([makeIndent(ind, options), mode, doc.contents]);

          break;
        case "align":
          cmds.push([makeAlign(ind, doc.n, options), mode, doc.contents]);

          break;
        case "group":
          if (mustBeFlat && doc.break) {
            return false;
          }
          cmds.push([ind, doc.break ? MODE_BREAK : mode, doc.contents]);

          break;
        case "fill":
          for (let i = doc.parts.length - 1; i >= 0; i--) {
            cmds.push([ind, mode, doc.parts[i]]);
          }

          break;
        case "if-break":
          if (mode === MODE_BREAK) {
            if (doc.breakContents) {
              cmds.push([ind, mode, doc.breakContents]);
            }
          }
          if (mode === MODE_FLAT) {
            if (doc.flatContents) {
              cmds.push([ind, mode, doc.flatContents]);
            }
          }

          break;
        case "line":
          switch (mode) {
            // fallthrough
            case MODE_FLAT:
              if (!doc.hard) {
                if (!doc.soft) {
                  width -= 1;
                }

                break;
              }
              return true;

            case MODE_BREAK:
              return true;
          }
          break;
      }
    }
  }
  return false;
}

function printDocToString$2(doc, options) {
  const width = options.printWidth;
  const newLine = options.newLine || "\n";
  let pos = 0;
  // cmds is basically a stack. We've turned a recursive call into a
  // while loop which is much faster. The while loop below adds new
  // cmds to the array instead of recursively calling `print`.
  const cmds = [[rootIndent(), MODE_BREAK, doc]];
  const out = [];
  let shouldRemeasure = false;
  let lineSuffix = [];
  let isPrevLineSingle = false;

  while (cmds.length !== 0) {
    const x = cmds.pop();
    const ind = x[0];
    const mode = x[1];
    const doc = x[2];

    if (typeof doc === "string") {
      out.push(doc);

      pos += util$1.getStringWidth(doc);
    } else {
      switch (doc.type) {
        case "cursor":
          out.push(cursor$2.placeholder);

          break;
        case "concat":
          for (let i = doc.parts.length - 1; i >= 0; i--) {
            cmds.push([ind, mode, doc.parts[i]]);
          }

          break;
        case "indent":
          cmds.push([makeIndent(ind, options), mode, doc.contents]);

          break;
        case "align":
          cmds.push([makeAlign(ind, doc.n, options), mode, doc.contents]);

          break;
        case "group":
          switch (mode) {
            case MODE_FLAT:
              if (!shouldRemeasure) {
                cmds.push([
                  ind,
                  doc.break ? MODE_BREAK : MODE_FLAT,
                  doc.contents
                ]);

                break;
              }
            // fallthrough

            case MODE_BREAK: {
              shouldRemeasure = false;

              const next = [ind, MODE_FLAT, doc.contents];
              const rem = width - pos;

              if (!doc.break && fits(next, cmds, rem, options)) {
                cmds.push(next);
              } else {
                // Expanded states are a rare case where a document
                // can manually provide multiple representations of
                // itself. It provides an array of documents
                // going from the least expanded (most flattened)
                // representation first to the most expanded. If a
                // group has these, we need to manually go through
                // these states and find the first one that fits.
                if (doc.expandedStates) {
                  const mostExpanded =
                    doc.expandedStates[doc.expandedStates.length - 1];

                  if (doc.break) {
                    cmds.push([ind, MODE_BREAK, mostExpanded]);

                    break;
                  } else {
                    for (let i = 1; i < doc.expandedStates.length + 1; i++) {
                      if (i >= doc.expandedStates.length) {
                        cmds.push([ind, MODE_BREAK, mostExpanded]);

                        break;
                      } else {
                        const state = doc.expandedStates[i];
                        const cmd = [ind, MODE_FLAT, state];

                        if (fits(cmd, cmds, rem, options)) {
                          cmds.push(cmd);

                          break;
                        }
                      }
                    }
                  }
                } else {
                  cmds.push([ind, MODE_BREAK, doc.contents]);
                }
              }

              break;
            }
          }
          break;
        // Fills each line with as much code as possible before moving to a new
        // line with the same indentation.
        //
        // Expects doc.parts to be an array of alternating content and
        // whitespace. The whitespace contains the linebreaks.
        //
        // For example:
        //   ["I", line, "love", line, "monkeys"]
        // or
        //   [{ type: group, ... }, softline, { type: group, ... }]
        //
        // It uses this parts structure to handle three main layout cases:
        // * The first two content items fit on the same line without
        //   breaking
        //   -> output the first content item and the whitespace "flat".
        // * Only the first content item fits on the line without breaking
        //   -> output the first content item "flat" and the whitespace with
        //   "break".
        // * Neither content item fits on the line without breaking
        //   -> output the first content item and the whitespace with "break".
        case "fill": {
          const rem = width - pos;

          const parts = doc.parts;
          if (parts.length === 0) {
            break;
          }

          const content = parts[0];
          const contentFlatCmd = [ind, MODE_FLAT, content];
          const contentBreakCmd = [ind, MODE_BREAK, content];
          const contentFits = fits(contentFlatCmd, [], rem, options, true);

          if (parts.length === 1) {
            if (contentFits) {
              cmds.push(contentFlatCmd);
            } else {
              cmds.push(contentBreakCmd);
            }
            break;
          }

          const whitespace = parts[1];
          const whitespaceFlatCmd = [ind, MODE_FLAT, whitespace];
          const whitespaceBreakCmd = [ind, MODE_BREAK, whitespace];

          if (parts.length === 2) {
            if (contentFits) {
              cmds.push(whitespaceFlatCmd);
              cmds.push(contentFlatCmd);
            } else {
              cmds.push(whitespaceBreakCmd);
              cmds.push(contentBreakCmd);
            }
            break;
          }

          // At this point we've handled the first pair (context, separator)
          // and will create a new fill doc for the rest of the content.
          // Ideally we wouldn't mutate the array here but coping all the
          // elements to a new array would make this algorithm quadratic,
          // which is unusable for large arrays (e.g. large texts in JSX).
          parts.splice(0, 2);
          const remainingCmd = [ind, mode, fill$2(parts)];

          const secondContent = parts[0];

          const firstAndSecondContentFlatCmd = [
            ind,
            MODE_FLAT,
            concat$3([content, whitespace, secondContent])
          ];
          const firstAndSecondContentFits = fits(
            firstAndSecondContentFlatCmd,
            [],
            rem,
            options,
            true
          );

          if (firstAndSecondContentFits) {
            cmds.push(remainingCmd);
            cmds.push(whitespaceFlatCmd);
            cmds.push(contentFlatCmd);
          } else if (contentFits) {
            cmds.push(remainingCmd);
            cmds.push(whitespaceBreakCmd);
            cmds.push(contentFlatCmd);
          } else {
            cmds.push(remainingCmd);
            cmds.push(whitespaceBreakCmd);
            cmds.push(contentBreakCmd);
          }
          break;
        }
        case "if-break":
          if (mode === MODE_BREAK) {
            if (doc.breakContents) {
              cmds.push([ind, mode, doc.breakContents]);
            }
          }
          if (mode === MODE_FLAT) {
            if (doc.flatContents) {
              cmds.push([ind, mode, doc.flatContents]);
            }
          }

          break;
        case "line-suffix":
          lineSuffix.push([ind, mode, doc.contents]);
          break;
        case "line-suffix-boundary":
          if (lineSuffix.length > 0) {
            cmds.push([ind, mode, { type: "line", hard: true }]);
          }
          break;
        case "line":
          switch (mode) {
            case MODE_FLAT:
              if (!doc.hard) {
                if (!doc.soft) {
                  out.push(" ");

                  pos += 1;
                }

                break;
              } else {
                // This line was forced into the output even if we
                // were in flattened mode, so we need to tell the next
                // group that no matter what, it needs to remeasure
                // because the previous measurement didn't accurately
                // capture the entire expression (this is necessary
                // for nested groups)
                shouldRemeasure = true;
              }
            // fallthrough

            case MODE_BREAK:
              if (lineSuffix.length) {
                cmds.push([ind, mode, doc]);
                [].push.apply(cmds, lineSuffix.reverse());
                lineSuffix = [];
                break;
              }

              if (doc.literal) {
                if (ind.root) {
                  out.push(newLine, ind.root.value);
                  pos = ind.root.length;
                } else {
                  out.push(newLine);
                  pos = 0;
                }
              } else {
                if (out.length > 0) {
                  // Trim whitespace at the end of line
                  while (
                    (out.length > 0 &&
                      typeof out[out.length - 1] === "string" &&
                      out[out.length - 1].match(/^[^\S\n]*$/)) ||
                    (doc.single &&
                      typeof out[out.length - 1] === "string" &&
                      out[out.length - 1].match(/^\n\s*$/) &&
                      (isPrevLineSingle ||
                        (out.length > 1 &&
                          typeof out[out.length - 2] === "string" &&
                          out[out.length - 2].match(/\n\s*$/))))
                  ) {
                    out.pop();
                  }

                  if (
                    out.length &&
                    typeof out[out.length - 1] === "string" &&
                    (options.parser !== "markdown" ||
                      // preserve markdown's `break` node (two trailing spaces)
                      !/\S {2}$/.test(out[out.length - 1]))
                  ) {
                    out[out.length - 1] = out[out.length - 1].replace(
                      /[^\S\n]*$/,
                      ""
                    );
                  }
                }
                // This allows singleHardLine to keep a blank line in case
                // previous line is not a singleHardLine
                isPrevLineSingle = doc.single;

                out.push(newLine + ind.value);
                pos = ind.length;
              }
              break;
          }
          break;
        default:
      }
    }
  }

  const cursorPlaceholderIndex = out.indexOf(cursor$2.placeholder);
  if (cursorPlaceholderIndex !== -1) {
    const otherCursorPlaceholderIndex = out.indexOf(
      cursor$2.placeholder,
      cursorPlaceholderIndex + 1
    );
    const beforeCursor = out.slice(0, cursorPlaceholderIndex).join("");
    const aroundCursor = out
      .slice(cursorPlaceholderIndex + 1, otherCursorPlaceholderIndex)
      .join("");
    const afterCursor = out.slice(otherCursorPlaceholderIndex + 1).join("");

    return {
      formatted: beforeCursor + aroundCursor + afterCursor,
      cursorNodeStart: beforeCursor.length,
      cursorNodeText: aroundCursor
    };
  }

  return { formatted: out.join("") };
}

var docPrinter = { printDocToString: printDocToString$2 };

function traverseDoc(doc, onEnter, onExit, shouldTraverseConditionalGroups) {
  function traverseDocRec(doc) {
    let shouldRecurse = true;
    if (onEnter) {
      if (onEnter(doc) === false) {
        shouldRecurse = false;
      }
    }

    if (shouldRecurse) {
      if (doc.type === "concat" || doc.type === "fill") {
        for (let i = 0; i < doc.parts.length; i++) {
          traverseDocRec(doc.parts[i]);
        }
      } else if (doc.type === "if-break") {
        if (doc.breakContents) {
          traverseDocRec(doc.breakContents);
        }
        if (doc.flatContents) {
          traverseDocRec(doc.flatContents);
        }
      } else if (doc.type === "group" && doc.expandedStates) {
        if (shouldTraverseConditionalGroups) {
          doc.expandedStates.forEach(traverseDocRec);
        } else {
          traverseDocRec(doc.contents);
        }
      } else if (doc.contents) {
        traverseDocRec(doc.contents);
      }
    }

    if (onExit) {
      onExit(doc);
    }
  }

  traverseDocRec(doc);
}

function mapDoc(doc, cb) {
  if (doc.type === "concat" || doc.type === "fill") {
    const parts = doc.parts.map(part => mapDoc(part, cb));
    return cb(Object.assign({}, doc, { parts }));
  } else if (doc.type === "if-break") {
    const breakContents = doc.breakContents && mapDoc(doc.breakContents, cb);
    const flatContents = doc.flatContents && mapDoc(doc.flatContents, cb);
    return cb(Object.assign({}, doc, { breakContents, flatContents }));
  } else if (doc.contents) {
    const contents = mapDoc(doc.contents, cb);
    return cb(Object.assign({}, doc, { contents }));
  }
  return cb(doc);
}

function findInDoc(doc, fn, defaultValue) {
  let result = defaultValue;
  let hasStopped = false;
  traverseDoc(doc, doc => {
    const maybeResult = fn(doc);
    if (maybeResult !== undefined) {
      hasStopped = true;
      result = maybeResult;
    }
    if (hasStopped) {
      return false;
    }
  });
  return result;
}

function isEmpty$1(n) {
  return typeof n === "string" && n.length === 0;
}

function isLineNext$1(doc) {
  return findInDoc(
    doc,
    doc => {
      if (typeof doc === "string") {
        return false;
      }
      if (doc.type === "line") {
        return true;
      }
    },
    false
  );
}

function willBreak$1(doc) {
  return findInDoc(
    doc,
    doc => {
      if (doc.type === "group" && doc.break) {
        return true;
      }
      if (doc.type === "line" && doc.hard) {
        return true;
      }
      if (doc.type === "break-parent") {
        return true;
      }
    },
    false
  );
}

function breakParentGroup(groupStack) {
  if (groupStack.length > 0) {
    const parentGroup = groupStack[groupStack.length - 1];
    // Breaks are not propagated through conditional groups because
    // the user is expected to manually handle what breaks.
    if (!parentGroup.expandedStates) {
      parentGroup.break = true;
    }
  }
  return null;
}

function propagateBreaks(doc) {
  const alreadyVisited = new Map();
  const groupStack = [];
  traverseDoc(
    doc,
    doc => {
      if (doc.type === "break-parent") {
        breakParentGroup(groupStack);
      }
      if (doc.type === "group") {
        groupStack.push(doc);
        if (alreadyVisited.has(doc)) {
          return false;
        }
        alreadyVisited.set(doc, true);
      }
    },
    doc => {
      if (doc.type === "group") {
        const group = groupStack.pop();
        if (group.break) {
          breakParentGroup(groupStack);
        }
      }
    },
    /* shouldTraverseConditionalGroups */ true
  );
}

function removeLines(doc) {
  // Force this doc into flat mode by statically converting all
  // lines into spaces (or soft lines into nothing). Hard lines
  // should still output because there's too great of a chance
  // of breaking existing assumptions otherwise.
  return mapDoc(doc, d => {
    if (d.type === "line" && !d.hard) {
      return d.soft ? "" : " ";
    } else if (d.type === "if-break") {
      return d.flatContents || "";
    }
    return d;
  });
}

function stripTrailingHardline(doc) {
  // HACK remove ending hardline, original PR: #1984
  if (
    doc.type === "concat" &&
    doc.parts.length === 2 &&
    doc.parts[1].type === "concat" &&
    doc.parts[1].parts.length === 2 &&
    doc.parts[1].parts[0].hard &&
    doc.parts[1].parts[1].type === "break-parent"
  ) {
    return doc.parts[0];
  }
  return doc;
}

var docUtils$1 = {
  isEmpty: isEmpty$1,
  willBreak: willBreak$1,
  isLineNext: isLineNext$1,
  traverseDoc,
  mapDoc,
  propagateBreaks,
  removeLines,
  stripTrailingHardline
};

function flattenDoc(doc) {
  if (doc.type === "concat") {
    const res = [];

    for (let i = 0; i < doc.parts.length; ++i) {
      const doc2 = doc.parts[i];
      if (typeof doc2 !== "string" && doc2.type === "concat") {
        [].push.apply(res, flattenDoc(doc2).parts);
      } else {
        const flattened = flattenDoc(doc2);
        if (flattened !== "") {
          res.push(flattened);
        }
      }
    }

    return Object.assign({}, doc, { parts: res });
  } else if (doc.type === "if-break") {
    return Object.assign({}, doc, {
      breakContents:
        doc.breakContents != null ? flattenDoc(doc.breakContents) : null,
      flatContents:
        doc.flatContents != null ? flattenDoc(doc.flatContents) : null
    });
  } else if (doc.type === "group") {
    return Object.assign({}, doc, {
      contents: flattenDoc(doc.contents),
      expandedStates: doc.expandedStates
        ? doc.expandedStates.map(flattenDoc)
        : doc.expandedStates
    });
  } else if (doc.contents) {
    return Object.assign({}, doc, { contents: flattenDoc(doc.contents) });
  }
  return doc;
}

function printDoc(doc) {
  if (typeof doc === "string") {
    return JSON.stringify(doc);
  }

  if (doc.type === "line") {
    if (doc.literalline) {
      return "literalline";
    }
    if (doc.hard) {
      return "hardline";
    }
    if (doc.soft) {
      return "softline";
    }
    return "line";
  }

  if (doc.type === "break-parent") {
    return "breakParent";
  }

  if (doc.type === "concat") {
    return "[" + doc.parts.map(printDoc).join(", ") + "]";
  }

  if (doc.type === "indent") {
    return "indent(" + printDoc(doc.contents) + ")";
  }

  if (doc.type === "align") {
    return doc.n === -Infinity
      ? "dedentToRoot(" + printDoc(doc.contents) + ")"
      : doc.n < 0
        ? "dedent(" + printDoc(doc.contents) + ")"
        : doc.n.type === "root"
          ? "markAsRoot(" + printDoc(doc.contents) + ")"
          : "align(" +
            JSON.stringify(doc.n) +
            ", " +
            printDoc(doc.contents) +
            ")";
  }

  if (doc.type === "if-break") {
    return (
      "ifBreak(" +
      printDoc(doc.breakContents) +
      (doc.flatContents ? ", " + printDoc(doc.flatContents) : "") +
      ")"
    );
  }

  if (doc.type === "group") {
    if (doc.expandedStates) {
      return (
        "conditionalGroup(" +
        "[" +
        doc.expandedStates.map(printDoc).join(",") +
        "])"
      );
    }

    return (
      (doc.break ? "wrappedGroup" : "group") +
      "(" +
      printDoc(doc.contents) +
      ")"
    );
  }

  if (doc.type === "fill") {
    return "fill" + "(" + doc.parts.map(printDoc).join(", ") + ")";
  }

  if (doc.type === "line-suffix") {
    return "lineSuffix(" + printDoc(doc.contents) + ")";
  }

  if (doc.type === "line-suffix-boundary") {
    return "lineSuffixBoundary";
  }

  throw new Error("Unknown doc type " + doc.type);
}

var docDebug = {
  printDocToDebug: function(doc) {
    return printDoc(flattenDoc(doc));
  }
};

var doc = {
  builders: docBuilders$2,
  printer: docPrinter,
  utils: docUtils$1,
  debug: docDebug
};

function isNextLineEmpty$1(text, node, options) {
  return util$1.isNextLineEmpty(text, node, options.locEnd);
}

function getNextNonSpaceNonCommentCharacterIndex$1(text, node, options) {
  return util$1.getNextNonSpaceNonCommentCharacterIndex(
    text,
    node,
    options.locEnd
  );
}

var utilShared = {
  isNextLineEmpty: isNextLineEmpty$1,
  isNextLineEmptyAfterIndex: util$1.isNextLineEmptyAfterIndex,
  getNextNonSpaceNonCommentCharacterIndex: getNextNonSpaceNonCommentCharacterIndex$1,
  mapDoc: docUtils$1.mapDoc, // TODO: remove in 2.0, we already exposed it in docUtils
  makeString: util$1.makeString,
  addLeadingComment: util$1.addLeadingComment,
  addDanglingComment: util$1.addDanglingComment,
  addTrailingComment: util$1.addTrailingComment
};

const docBuilders$1 = doc.builders;
const concat$1 = docBuilders$1.concat;
const hardline$1 = docBuilders$1.hardline;
const singleHardLine$1 = docBuilders$1.singleHardLine;
const breakParent$1 = docBuilders$1.breakParent;
const indent$1 = docBuilders$1.indent;
const lineSuffix = docBuilders$1.lineSuffix;
const join$1 = docBuilders$1.join;
const cursor = docBuilders$1.cursor;


const childNodesCacheKey = Symbol("child-nodes");

const addLeadingComment = utilShared.addLeadingComment;
const addTrailingComment = utilShared.addTrailingComment;
const addDanglingComment = utilShared.addDanglingComment;

function getSortedChildNodes(node, text, options, resultArray) {
  if (!node) {
    return;
  }
  const printer = options.printer;
  const locStart = options.locStart;
  const locEnd = options.locEnd;

  if (resultArray) {
    if (node && printer.canAttachComment && printer.canAttachComment(node)) {
      // This reverse insertion sort almost always takes constant
      // time because we almost always (maybe always?) append the
      // nodes in order anyway.
      let i;
      for (i = resultArray.length - 1; i >= 0; --i) {
        if (
          locStart(resultArray[i]) <= locStart(node) &&
          locEnd(resultArray[i]) <= locEnd(node)
        ) {
          break;
        }
      }
      resultArray.splice(i + 1, 0, node);
      return;
    }
  } else if (node[childNodesCacheKey]) {
    return node[childNodesCacheKey];
  }

  let childNodes;

  if (printer.getCommentChildNodes) {
    childNodes = printer.getCommentChildNodes(node);
  } else if (node && typeof node === "object") {
    childNodes = Object.keys(node)
      .filter(
        n =>
          n !== "enclosingNode" &&
          n !== "precedingNode" &&
          n !== "followingNode"
      )
      .map(n => node[n]);
  }

  if (!childNodes) {
    return;
  }

  if (!resultArray) {
    Object.defineProperty(node, childNodesCacheKey, {
      value: (resultArray = []),
      enumerable: false
    });
  }

  childNodes.forEach(childNode => {
    getSortedChildNodes(childNode, text, options, resultArray);
  });

  return resultArray;
}

// As efficiently as possible, decorate the comment object with
// .precedingNode, .enclosingNode, and/or .followingNode properties, at
// least one of which is guaranteed to be defined.
function decorateComment(node, comment, text, options) {
  const locStart = options.locStart;
  const locEnd = options.locEnd;
  const childNodes = getSortedChildNodes(node, text, options);
  let precedingNode;
  let followingNode;
  // Time to dust off the old binary search robes and wizard hat.
  let left = 0;
  let right = childNodes.length;
  while (left < right) {
    const middle = (left + right) >> 1;
    const child = childNodes[middle];

    if (
      locStart(child) - locStart(comment) <= 0 &&
      locEnd(comment) - locEnd(child) <= 0
    ) {
      // The comment is completely contained by this child node.
      comment.enclosingNode = child;

      decorateComment(child, comment, text, options);
      return; // Abandon the binary search at this level.
    }

    if (locEnd(child) - locStart(comment) <= 0) {
      // This child node falls completely before the comment.
      // Because we will never consider this node or any nodes
      // before it again, this node must be the closest preceding
      // node we have encountered so far.
      precedingNode = child;
      left = middle + 1;
      continue;
    }

    if (locEnd(comment) - locStart(child) <= 0) {
      // This child node falls completely after the comment.
      // Because we will never consider this node or any nodes after
      // it again, this node must be the closest following node we
      // have encountered so far.
      followingNode = child;
      right = middle;
      continue;
    }

    /* istanbul ignore next */
    throw new Error("Comment location overlaps with node location");
  }

  // We don't want comments inside of different expressions inside of the same
  // template literal to move to another expression.
  if (
    comment.enclosingNode &&
    comment.enclosingNode.type === "TemplateLiteral"
  ) {
    const quasis = comment.enclosingNode.quasis;
    const commentIndex = findExpressionIndexForComment(
      quasis,
      comment,
      options
    );

    if (
      precedingNode &&
      findExpressionIndexForComment(quasis, precedingNode, options) !==
        commentIndex
    ) {
      precedingNode = null;
    }
    if (
      followingNode &&
      findExpressionIndexForComment(quasis, followingNode, options) !==
        commentIndex
    ) {
      followingNode = null;
    }
  }

  if (precedingNode) {
    comment.precedingNode = precedingNode;
  }

  if (followingNode) {
    comment.followingNode = followingNode;
  }
}

function attach(comments, ast, text, options) {
  if (!Array.isArray(comments)) {
    return;
  }

  const tiesToBreak = [];
  const locStart = options.locStart;
  const locEnd = options.locEnd;

  comments.forEach((comment, i) => {
    if (
      (options.parser === "json" || options.parser === "json5") &&
      locStart(comment) - locStart(ast) <= 0
    ) {
      addLeadingComment(ast, comment);
      return;
    }

    decorateComment(ast, comment, text, options);

    const precedingNode = comment.precedingNode;
    const enclosingNode = comment.enclosingNode;
    const followingNode = comment.followingNode;

    const pluginHandleOwnLineComment =
      options.printer.handleComments && options.printer.handleComments.ownLine
        ? options.printer.handleComments.ownLine
        : () => false;
    const pluginHandleEndOfLineComment =
      options.printer.handleComments && options.printer.handleComments.endOfLine
        ? options.printer.handleComments.endOfLine
        : () => false;
    const pluginHandleRemainingComment =
      options.printer.handleComments && options.printer.handleComments.remaining
        ? options.printer.handleComments.remaining
        : () => false;

    const isLastComment = comments.length - 1 === i;

    if (util$1.hasNewline(text, locStart(comment), { backwards: true })) {
      // If a comment exists on its own line, prefer a leading comment.
      // We also need to check if it's the first line of the file.
      if (
        pluginHandleOwnLineComment(comment, text, options, ast, isLastComment)
      ) {
        // We're good
      } else if (followingNode) {
        // Always a leading comment.
        addLeadingComment(followingNode, comment);
      } else if (precedingNode) {
        addTrailingComment(precedingNode, comment);
      } else if (enclosingNode) {
        addDanglingComment(enclosingNode, comment);
      } else {
        // There are no nodes, let's attach it to the root of the ast
        /* istanbul ignore next */
        addDanglingComment(ast, comment);
      }
    } else if (util$1.hasNewline(text, locEnd(comment))) {
      if (
        pluginHandleEndOfLineComment(comment, text, options, ast, isLastComment)
      ) {
        // We're good
      } else if (precedingNode) {
        // There is content before this comment on the same line, but
        // none after it, so prefer a trailing comment of the previous node.
        addTrailingComment(precedingNode, comment);
      } else if (followingNode) {
        addLeadingComment(followingNode, comment);
      } else if (enclosingNode) {
        addDanglingComment(enclosingNode, comment);
      } else {
        // There are no nodes, let's attach it to the root of the ast
        /* istanbul ignore next */
        addDanglingComment(ast, comment);
      }
    } else {
      if (
        pluginHandleRemainingComment(comment, text, options, ast, isLastComment)
      ) {
        // We're good
      } else if (precedingNode && followingNode) {
        // Otherwise, text exists both before and after the comment on
        // the same line. If there is both a preceding and following
        // node, use a tie-breaking algorithm to determine if it should
        // be attached to the next or previous node. In the last case,
        // simply attach the right node;
        const tieCount = tiesToBreak.length;
        if (tieCount > 0) {
          const lastTie = tiesToBreak[tieCount - 1];
          if (lastTie.followingNode !== comment.followingNode) {
            breakTies(tiesToBreak, text, options);
          }
        }
        tiesToBreak.push(comment);
      } else if (precedingNode) {
        addTrailingComment(precedingNode, comment);
      } else if (followingNode) {
        addLeadingComment(followingNode, comment);
      } else if (enclosingNode) {
        addDanglingComment(enclosingNode, comment);
      } else {
        // There are no nodes, let's attach it to the root of the ast
        /* istanbul ignore next */
        addDanglingComment(ast, comment);
      }
    }
  });

  breakTies(tiesToBreak, text, options);

  comments.forEach(comment => {
    // These node references were useful for breaking ties, but we
    // don't need them anymore, and they create cycles in the AST that
    // may lead to infinite recursion if we don't delete them here.
    delete comment.precedingNode;
    delete comment.enclosingNode;
    delete comment.followingNode;
  });
}

function breakTies(tiesToBreak, text, options) {
  const tieCount = tiesToBreak.length;
  if (tieCount === 0) {
    return;
  }

  const precedingNode = tiesToBreak[0].precedingNode;
  const followingNode = tiesToBreak[0].followingNode;
  let gapEndPos = options.locStart(followingNode);

  // Iterate backwards through tiesToBreak, examining the gaps
  // between the tied comments. In order to qualify as leading, a
  // comment must be separated from followingNode by an unbroken series of
  // gaps (or other comments). Gaps should only contain whitespace or open
  // parentheses.
  let indexOfFirstLeadingComment;
  for (
    indexOfFirstLeadingComment = tieCount;
    indexOfFirstLeadingComment > 0;
    --indexOfFirstLeadingComment
  ) {
    const comment = tiesToBreak[indexOfFirstLeadingComment - 1];
    assert.strictEqual(comment.precedingNode, precedingNode);
    assert.strictEqual(comment.followingNode, followingNode);

    const gap = text.slice(options.locEnd(comment), gapEndPos).trim();
    if (gap === "" || /^\(+$/.test(gap)) {
      gapEndPos = options.locStart(comment);
    } else {
      // The gap string contained something other than whitespace or open
      // parentheses.
      break;
    }
  }

  tiesToBreak.forEach((comment, i) => {
    if (i < indexOfFirstLeadingComment) {
      addTrailingComment(precedingNode, comment);
    } else {
      addLeadingComment(followingNode, comment);
    }
  });

  tiesToBreak.length = 0;
}

function printComment$1(commentPath, options) {
  const comment = commentPath.getValue();
  comment.printed = true;
  return options.printer.printComment(commentPath, options);
}

function findExpressionIndexForComment(quasis, comment, options) {
  const startPos = options.locStart(comment) - 1;

  for (let i = 1; i < quasis.length; ++i) {
    if (startPos < getQuasiRange(quasis[i]).start) {
      return i - 1;
    }
  }

  // We haven't found it, it probably means that some of the locations are off.
  // Let's just return the first one.
  /* istanbul ignore next */
  return 0;
}

function getQuasiRange(expr) {
  if (expr.start !== undefined) {
    // Babylon
    return { start: expr.start, end: expr.end };
  }
  // Flow
  return { start: expr.range[0], end: expr.range[1] };
}

function printLeadingComment(commentPath, print, options) {
  const comment = commentPath.getValue();
  const contents = printComment$1(commentPath, options);
  if (!contents) {
    return "";
  }
  const isBlock =
    options.printer.isBlockComment && options.printer.isBlockComment(comment);

  // Leading block comments should see if they need to stay on the
  // same line or not.
  if (isBlock) {
    return concat$1([
      contents,
      util$1.hasNewline(options.originalText, options.locEnd(comment))
        ? hardline$1
        : " "
    ]);
  }

  return concat$1([contents, hardline$1]);
}

function printTrailingComment(commentPath, print, options) {
  const comment = commentPath.getValue();
  const contents = printComment$1(commentPath, options);
  if (!contents) {
    return "";
  }
  const isBlock =
    options.printer.isBlockComment && options.printer.isBlockComment(comment);

  // We don't want the line to break
  // when the parentParentNode is a ClassDeclaration/-Expression
  // And the parentNode is in the superClass property
  const parentNode = commentPath.getNode(1);
  const parentParentNode = commentPath.getNode(2);
  const isParentSuperClass =
    parentParentNode &&
    (parentParentNode.type === "ClassDeclaration" ||
      parentParentNode.type === "ClassExpression") &&
    parentParentNode.superClass === parentNode;

  if (
    util$1.hasNewline(options.originalText, options.locStart(comment), {
      backwards: true
    })
  ) {
    // This allows comments at the end of nested structures:
    // {
    //   x: 1,
    //   y: 2
    //   // A comment
    // }
    // Those kinds of comments are almost always leading comments, but
    // here it doesn't go "outside" the block and turns it into a
    // trailing comment for `2`. We can simulate the above by checking
    // if this a comment on its own line; normal trailing comments are
    // always at the end of another expression.

    const isLineBeforeEmpty = util$1.isPreviousLineEmpty(
      options.originalText,
      comment,
      options.locStart
    );

    return lineSuffix(
      concat$1([
        isLineBeforeEmpty ? hardline$1 : "",
        options.lenient ? singleHardLine$1 : hardline$1,
        contents
      ])
    );
  } else if (isBlock || isParentSuperClass) {
    // Trailing block comments never need a newline
    return concat$1([" ", contents]);
  }

  return concat$1([lineSuffix(" " + contents), !isBlock ? breakParent$1 : ""]);
}

function printDanglingComments(path$$1, options, sameIndent, filter) {
  const parts = [];
  const node = path$$1.getValue();

  if (!node || !node.comments) {
    return "";
  }

  path$$1.each(commentPath => {
    const comment = commentPath.getValue();
    if (
      comment &&
      !comment.leading &&
      !comment.trailing &&
      (!filter || filter(comment))
    ) {
      parts.push(printComment$1(commentPath, options));
    }
  }, "comments");

  if (parts.length === 0) {
    return "";
  }

  if (sameIndent) {
    return join$1(hardline$1, parts);
  }
  return indent$1(concat$1([hardline$1, join$1(hardline$1, parts)]));
}

function prependCursorPlaceholder(path$$1, options, printed) {
  if (path$$1.getNode() === options.cursorNode && path$$1.getValue()) {
    return concat$1([cursor, printed, cursor]);
  }
  return printed;
}

function printComments(path$$1, print, options, needsSemi) {
  const value = path$$1.getValue();
  const printed = print(path$$1);
  const comments = value && value.comments;

  if (!comments || comments.length === 0) {
    return prependCursorPlaceholder(path$$1, options, printed);
  }

  const leadingParts = [];
  const trailingParts = [needsSemi ? ";" : "", printed];

  path$$1.each(commentPath => {
    const comment = commentPath.getValue();
    const leading = comment.leading;
    const trailing = comment.trailing;

    if (leading) {
      const contents = printLeadingComment(commentPath, print, options);
      if (!contents) {
        return;
      }
      leadingParts.push(contents);

      const text = options.originalText;
      if (
        util$1.hasNewline(
          text,
          util$1.skipNewline(text, options.locEnd(comment))
        )
      ) {
        leadingParts.push(hardline$1);
      }
    } else if (trailing) {
      trailingParts.push(printTrailingComment(commentPath, print, options));
    }
  }, "comments");

  return prependCursorPlaceholder(
    path$$1,
    options,
    concat$1(leadingParts.concat(trailingParts))
  );
}

var comments = {
  attach,
  printComments,
  printDanglingComments,
  getSortedChildNodes
};

var ast = createCommonjsModule(function (module) {
/*
  Copyright (C) 2013 Yusuke Suzuki <utatane.tea@gmail.com>

  Redistribution and use in source and binary forms, with or without
  modification, are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.

  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS 'AS IS'
  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
  ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

(function () {
    'use strict';

    function isExpression(node) {
        if (node == null) { return false; }
        switch (node.type) {
            case 'ArrayExpression':
            case 'AssignmentExpression':
            case 'BinaryExpression':
            case 'CallExpression':
            case 'ConditionalExpression':
            case 'FunctionExpression':
            case 'Identifier':
            case 'Literal':
            case 'LogicalExpression':
            case 'MemberExpression':
            case 'NewExpression':
            case 'ObjectExpression':
            case 'SequenceExpression':
            case 'ThisExpression':
            case 'UnaryExpression':
            case 'UpdateExpression':
                return true;
        }
        return false;
    }

    function isIterationStatement(node) {
        if (node == null) { return false; }
        switch (node.type) {
            case 'DoWhileStatement':
            case 'ForInStatement':
            case 'ForStatement':
            case 'WhileStatement':
                return true;
        }
        return false;
    }

    function isStatement(node) {
        if (node == null) { return false; }
        switch (node.type) {
            case 'BlockStatement':
            case 'BreakStatement':
            case 'ContinueStatement':
            case 'DebuggerStatement':
            case 'DoWhileStatement':
            case 'EmptyStatement':
            case 'ExpressionStatement':
            case 'ForInStatement':
            case 'ForStatement':
            case 'IfStatement':
            case 'LabeledStatement':
            case 'ReturnStatement':
            case 'SwitchStatement':
            case 'ThrowStatement':
            case 'TryStatement':
            case 'VariableDeclaration':
            case 'WhileStatement':
            case 'WithStatement':
                return true;
        }
        return false;
    }

    function isSourceElement(node) {
      return isStatement(node) || node != null && node.type === 'FunctionDeclaration';
    }

    function trailingStatement(node) {
        switch (node.type) {
        case 'IfStatement':
            if (node.alternate != null) {
                return node.alternate;
            }
            return node.consequent;

        case 'LabeledStatement':
        case 'ForStatement':
        case 'ForInStatement':
        case 'WhileStatement':
        case 'WithStatement':
            return node.body;
        }
        return null;
    }

    function isProblematicIfStatement(node) {
        var current;

        if (node.type !== 'IfStatement') {
            return false;
        }
        if (node.alternate == null) {
            return false;
        }
        current = node.consequent;
        do {
            if (current.type === 'IfStatement') {
                if (current.alternate == null)  {
                    return true;
                }
            }
            current = trailingStatement(current);
        } while (current);

        return false;
    }

    module.exports = {
        isExpression: isExpression,
        isStatement: isStatement,
        isIterationStatement: isIterationStatement,
        isSourceElement: isSourceElement,
        isProblematicIfStatement: isProblematicIfStatement,

        trailingStatement: trailingStatement
    };
}());
/* vim: set sw=4 ts=4 et tw=80 : */
});

var code = createCommonjsModule(function (module) {
/*
  Copyright (C) 2013-2014 Yusuke Suzuki <utatane.tea@gmail.com>
  Copyright (C) 2014 Ivan Nikulin <ifaaan@gmail.com>

  Redistribution and use in source and binary forms, with or without
  modification, are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.

  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
  ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

(function () {
    'use strict';

    var ES6Regex, ES5Regex, NON_ASCII_WHITESPACES, IDENTIFIER_START, IDENTIFIER_PART, ch;

    // See `tools/generate-identifier-regex.js`.
    ES5Regex = {
        // ECMAScript 5.1/Unicode v7.0.0 NonAsciiIdentifierStart:
        NonAsciiIdentifierStart: /[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0-\u08B2\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA7AD\uA7B0\uA7B1\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB5F\uAB64\uAB65\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]/,
        // ECMAScript 5.1/Unicode v7.0.0 NonAsciiIdentifierPart:
        NonAsciiIdentifierPart: /[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u0800-\u082D\u0840-\u085B\u08A0-\u08B2\u08E4-\u0963\u0966-\u096F\u0971-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C00-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58\u0C59\u0C60-\u0C63\u0C66-\u0C6F\u0C81-\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D01-\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D57\u0D60-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191E\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19D9\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1AB0-\u1ABD\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1CD0-\u1CD2\u1CD4-\u1CF6\u1CF8\u1CF9\u1D00-\u1DF5\u1DFC-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u200C\u200D\u203F\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u2E2F\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099\u309A\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66F\uA674-\uA67D\uA67F-\uA69D\uA69F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA7AD\uA7B0\uA7B1\uA7F7-\uA827\uA840-\uA873\uA880-\uA8C4\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA900-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uA9E0-\uA9FE\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB5F\uAB64\uAB65\uABC0-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE2D\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]/
    };

    ES6Regex = {
        // ECMAScript 6/Unicode v7.0.0 NonAsciiIdentifierStart:
        NonAsciiIdentifierStart: /[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0-\u08B2\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2118-\u211D\u2124\u2126\u2128\u212A-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309B-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA7AD\uA7B0\uA7B1\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB5F\uAB64\uAB65\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDE80-\uDE9C\uDEA0-\uDED0\uDF00-\uDF1F\uDF30-\uDF4A\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE4\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48]|\uD804[\uDC03-\uDC37\uDC83-\uDCAF\uDCD0-\uDCE8\uDD03-\uDD26\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDDA\uDE00-\uDE11\uDE13-\uDE2B\uDEB0-\uDEDE\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF5D-\uDF61]|\uD805[\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDD80-\uDDAE\uDE00-\uDE2F\uDE44\uDE80-\uDEAA]|\uD806[\uDCA0-\uDCDF\uDCFF\uDEC0-\uDEF8]|\uD808[\uDC00-\uDF98]|\uD809[\uDC00-\uDC6E]|[\uD80C\uD840-\uD868\uD86A-\uD86C][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDED0-\uDEED\uDF00-\uDF2F\uDF40-\uDF43\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50\uDF93-\uDF9F]|\uD82C[\uDC00\uDC01]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB]|\uD83A[\uDC00-\uDCC4]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D]|\uD87E[\uDC00-\uDE1D]/,
        // ECMAScript 6/Unicode v7.0.0 NonAsciiIdentifierPart:
        NonAsciiIdentifierPart: /[\xAA\xB5\xB7\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u0800-\u082D\u0840-\u085B\u08A0-\u08B2\u08E4-\u0963\u0966-\u096F\u0971-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C00-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58\u0C59\u0C60-\u0C63\u0C66-\u0C6F\u0C81-\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D01-\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D57\u0D60-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1369-\u1371\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191E\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19DA\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1AB0-\u1ABD\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1CD0-\u1CD2\u1CD4-\u1CF6\u1CF8\u1CF9\u1D00-\u1DF5\u1DFC-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u200C\u200D\u203F\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2118-\u211D\u2124\u2126\u2128\u212A-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66F\uA674-\uA67D\uA67F-\uA69D\uA69F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA7AD\uA7B0\uA7B1\uA7F7-\uA827\uA840-\uA873\uA880-\uA8C4\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA900-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uA9E0-\uA9FE\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB5F\uAB64\uAB65\uABC0-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE2D\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDDFD\uDE80-\uDE9C\uDEA0-\uDED0\uDEE0\uDF00-\uDF1F\uDF30-\uDF4A\uDF50-\uDF7A\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCA0-\uDCA9\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00-\uDE03\uDE05\uDE06\uDE0C-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE38-\uDE3A\uDE3F\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE6\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48]|\uD804[\uDC00-\uDC46\uDC66-\uDC6F\uDC7F-\uDCBA\uDCD0-\uDCE8\uDCF0-\uDCF9\uDD00-\uDD34\uDD36-\uDD3F\uDD50-\uDD73\uDD76\uDD80-\uDDC4\uDDD0-\uDDDA\uDE00-\uDE11\uDE13-\uDE37\uDEB0-\uDEEA\uDEF0-\uDEF9\uDF01-\uDF03\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3C-\uDF44\uDF47\uDF48\uDF4B-\uDF4D\uDF57\uDF5D-\uDF63\uDF66-\uDF6C\uDF70-\uDF74]|\uD805[\uDC80-\uDCC5\uDCC7\uDCD0-\uDCD9\uDD80-\uDDB5\uDDB8-\uDDC0\uDE00-\uDE40\uDE44\uDE50-\uDE59\uDE80-\uDEB7\uDEC0-\uDEC9]|\uD806[\uDCA0-\uDCE9\uDCFF\uDEC0-\uDEF8]|\uD808[\uDC00-\uDF98]|\uD809[\uDC00-\uDC6E]|[\uD80C\uD840-\uD868\uD86A-\uD86C][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE60-\uDE69\uDED0-\uDEED\uDEF0-\uDEF4\uDF00-\uDF36\uDF40-\uDF43\uDF50-\uDF59\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50-\uDF7E\uDF8F-\uDF9F]|\uD82C[\uDC00\uDC01]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99\uDC9D\uDC9E]|\uD834[\uDD65-\uDD69\uDD6D-\uDD72\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB\uDFCE-\uDFFF]|\uD83A[\uDC00-\uDCC4\uDCD0-\uDCD6]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D]|\uD87E[\uDC00-\uDE1D]|\uDB40[\uDD00-\uDDEF]/
    };

    function isDecimalDigit(ch) {
        return 0x30 <= ch && ch <= 0x39;  // 0..9
    }

    function isHexDigit(ch) {
        return 0x30 <= ch && ch <= 0x39 ||  // 0..9
            0x61 <= ch && ch <= 0x66 ||     // a..f
            0x41 <= ch && ch <= 0x46;       // A..F
    }

    function isOctalDigit(ch) {
        return ch >= 0x30 && ch <= 0x37;  // 0..7
    }

    // 7.2 White Space

    NON_ASCII_WHITESPACES = [
        0x1680, 0x180E,
        0x2000, 0x2001, 0x2002, 0x2003, 0x2004, 0x2005, 0x2006, 0x2007, 0x2008, 0x2009, 0x200A,
        0x202F, 0x205F,
        0x3000,
        0xFEFF
    ];

    function isWhiteSpace(ch) {
        return ch === 0x20 || ch === 0x09 || ch === 0x0B || ch === 0x0C || ch === 0xA0 ||
            ch >= 0x1680 && NON_ASCII_WHITESPACES.indexOf(ch) >= 0;
    }

    // 7.3 Line Terminators

    function isLineTerminator(ch) {
        return ch === 0x0A || ch === 0x0D || ch === 0x2028 || ch === 0x2029;
    }

    // 7.6 Identifier Names and Identifiers

    function fromCodePoint(cp) {
        if (cp <= 0xFFFF) { return String.fromCharCode(cp); }
        var cu1 = String.fromCharCode(Math.floor((cp - 0x10000) / 0x400) + 0xD800);
        var cu2 = String.fromCharCode(((cp - 0x10000) % 0x400) + 0xDC00);
        return cu1 + cu2;
    }

    IDENTIFIER_START = new Array(0x80);
    for(ch = 0; ch < 0x80; ++ch) {
        IDENTIFIER_START[ch] =
            ch >= 0x61 && ch <= 0x7A ||  // a..z
            ch >= 0x41 && ch <= 0x5A ||  // A..Z
            ch === 0x24 || ch === 0x5F;  // $ (dollar) and _ (underscore)
    }

    IDENTIFIER_PART = new Array(0x80);
    for(ch = 0; ch < 0x80; ++ch) {
        IDENTIFIER_PART[ch] =
            ch >= 0x61 && ch <= 0x7A ||  // a..z
            ch >= 0x41 && ch <= 0x5A ||  // A..Z
            ch >= 0x30 && ch <= 0x39 ||  // 0..9
            ch === 0x24 || ch === 0x5F;  // $ (dollar) and _ (underscore)
    }

    function isIdentifierStartES5(ch) {
        return ch < 0x80 ? IDENTIFIER_START[ch] : ES5Regex.NonAsciiIdentifierStart.test(fromCodePoint(ch));
    }

    function isIdentifierPartES5(ch) {
        return ch < 0x80 ? IDENTIFIER_PART[ch] : ES5Regex.NonAsciiIdentifierPart.test(fromCodePoint(ch));
    }

    function isIdentifierStartES6(ch) {
        return ch < 0x80 ? IDENTIFIER_START[ch] : ES6Regex.NonAsciiIdentifierStart.test(fromCodePoint(ch));
    }

    function isIdentifierPartES6(ch) {
        return ch < 0x80 ? IDENTIFIER_PART[ch] : ES6Regex.NonAsciiIdentifierPart.test(fromCodePoint(ch));
    }

    module.exports = {
        isDecimalDigit: isDecimalDigit,
        isHexDigit: isHexDigit,
        isOctalDigit: isOctalDigit,
        isWhiteSpace: isWhiteSpace,
        isLineTerminator: isLineTerminator,
        isIdentifierStartES5: isIdentifierStartES5,
        isIdentifierPartES5: isIdentifierPartES5,
        isIdentifierStartES6: isIdentifierStartES6,
        isIdentifierPartES6: isIdentifierPartES6
    };
}());
/* vim: set sw=4 ts=4 et tw=80 : */
});

var keyword = createCommonjsModule(function (module) {
/*
  Copyright (C) 2013 Yusuke Suzuki <utatane.tea@gmail.com>

  Redistribution and use in source and binary forms, with or without
  modification, are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.

  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
  ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

(function () {
    'use strict';

    var code$$1 = code;

    function isStrictModeReservedWordES6(id) {
        switch (id) {
        case 'implements':
        case 'interface':
        case 'package':
        case 'private':
        case 'protected':
        case 'public':
        case 'static':
        case 'let':
            return true;
        default:
            return false;
        }
    }

    function isKeywordES5(id, strict) {
        // yield should not be treated as keyword under non-strict mode.
        if (!strict && id === 'yield') {
            return false;
        }
        return isKeywordES6(id, strict);
    }

    function isKeywordES6(id, strict) {
        if (strict && isStrictModeReservedWordES6(id)) {
            return true;
        }

        switch (id.length) {
        case 2:
            return (id === 'if') || (id === 'in') || (id === 'do');
        case 3:
            return (id === 'var') || (id === 'for') || (id === 'new') || (id === 'try');
        case 4:
            return (id === 'this') || (id === 'else') || (id === 'case') ||
                (id === 'void') || (id === 'with') || (id === 'enum');
        case 5:
            return (id === 'while') || (id === 'break') || (id === 'catch') ||
                (id === 'throw') || (id === 'const') || (id === 'yield') ||
                (id === 'class') || (id === 'super');
        case 6:
            return (id === 'return') || (id === 'typeof') || (id === 'delete') ||
                (id === 'switch') || (id === 'export') || (id === 'import');
        case 7:
            return (id === 'default') || (id === 'finally') || (id === 'extends');
        case 8:
            return (id === 'function') || (id === 'continue') || (id === 'debugger');
        case 10:
            return (id === 'instanceof');
        default:
            return false;
        }
    }

    function isReservedWordES5(id, strict) {
        return id === 'null' || id === 'true' || id === 'false' || isKeywordES5(id, strict);
    }

    function isReservedWordES6(id, strict) {
        return id === 'null' || id === 'true' || id === 'false' || isKeywordES6(id, strict);
    }

    function isRestrictedWord(id) {
        return id === 'eval' || id === 'arguments';
    }

    function isIdentifierNameES5(id) {
        var i, iz, ch;

        if (id.length === 0) { return false; }

        ch = id.charCodeAt(0);
        if (!code$$1.isIdentifierStartES5(ch)) {
            return false;
        }

        for (i = 1, iz = id.length; i < iz; ++i) {
            ch = id.charCodeAt(i);
            if (!code$$1.isIdentifierPartES5(ch)) {
                return false;
            }
        }
        return true;
    }

    function decodeUtf16(lead, trail) {
        return (lead - 0xD800) * 0x400 + (trail - 0xDC00) + 0x10000;
    }

    function isIdentifierNameES6(id) {
        var i, iz, ch, lowCh, check;

        if (id.length === 0) { return false; }

        check = code$$1.isIdentifierStartES6;
        for (i = 0, iz = id.length; i < iz; ++i) {
            ch = id.charCodeAt(i);
            if (0xD800 <= ch && ch <= 0xDBFF) {
                ++i;
                if (i >= iz) { return false; }
                lowCh = id.charCodeAt(i);
                if (!(0xDC00 <= lowCh && lowCh <= 0xDFFF)) {
                    return false;
                }
                ch = decodeUtf16(ch, lowCh);
            }
            if (!check(ch)) {
                return false;
            }
            check = code$$1.isIdentifierPartES6;
        }
        return true;
    }

    function isIdentifierES5(id, strict) {
        return isIdentifierNameES5(id) && !isReservedWordES5(id, strict);
    }

    function isIdentifierES6(id, strict) {
        return isIdentifierNameES6(id) && !isReservedWordES6(id, strict);
    }

    module.exports = {
        isKeywordES5: isKeywordES5,
        isKeywordES6: isKeywordES6,
        isReservedWordES5: isReservedWordES5,
        isReservedWordES6: isReservedWordES6,
        isRestrictedWord: isRestrictedWord,
        isIdentifierNameES5: isIdentifierNameES5,
        isIdentifierNameES6: isIdentifierNameES6,
        isIdentifierES5: isIdentifierES5,
        isIdentifierES6: isIdentifierES6
    };
}());
/* vim: set sw=4 ts=4 et tw=80 : */
});

var utils$2 = createCommonjsModule(function (module, exports) {
/*
  Copyright (C) 2013 Yusuke Suzuki <utatane.tea@gmail.com>

  Redistribution and use in source and binary forms, with or without
  modification, are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.

  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
  ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/


(function () {
    'use strict';

    exports.ast = ast;
    exports.code = code;
    exports.keyword = keyword;
}());
/* vim: set sw=4 ts=4 et tw=80 : */
});

const doc$2 = doc;
const docUtils$4 = doc$2.utils;
const docBuilders$5 = doc$2.builders;
const indent$3 = docBuilders$5.indent;
const join$3 = docBuilders$5.join;
const hardline$3 = docBuilders$5.hardline;
const softline$2 = docBuilders$5.softline;
const literalline$2 = docBuilders$5.literalline;
const concat$4 = docBuilders$5.concat;
const dedentToRoot$1 = docBuilders$5.dedentToRoot;

function embed(path$$1, print, textToDoc /*, options */) {
  const node = path$$1.getValue();
  const parent = path$$1.getParentNode();
  const parentParent = path$$1.getParentNode(1);

  switch (node.type) {
    case "TemplateLiteral": {
      const isCss = [isStyledJsx, isStyledComponents, isCssProp].some(isIt =>
        isIt(path$$1)
      );

      if (isCss) {
        // Get full template literal with expressions replaced by placeholders
        const rawQuasis = node.quasis.map(q => q.value.raw);
        let placeholderID = 0;
        const text = rawQuasis.reduce((prevVal, currVal, idx) => {
          return idx == 0
            ? currVal
            : prevVal +
                "@prettier-placeholder-" +
                placeholderID++ +
                "-id" +
                currVal;
        }, "");
        const doc$$2 = textToDoc(text, { parser: "css" });
        return transformCssDoc(doc$$2, path$$1, print);
      }

      /*
       * react-relay and graphql-tag
       * graphql`...`
       * graphql.experimental`...`
       * gql`...`
       *
       * This intentionally excludes Relay Classic tags, as Prettier does not
       * support Relay Classic formatting.
       */
      if (isGraphQL(path$$1)) {
        const expressionDocs = node.expressions
          ? path$$1.map(print, "expressions")
          : [];

        const numQuasis = node.quasis.length;

        if (numQuasis === 1 && node.quasis[0].value.raw.trim() === "") {
          return "``";
        }

        const parts = [];

        for (let i = 0; i < numQuasis; i++) {
          const templateElement = node.quasis[i];
          const isFirst = i === 0;
          const isLast = i === numQuasis - 1;
          const text = templateElement.value.cooked;

          // Bail out if any of the quasis have an invalid escape sequence
          // (which would make the `cooked` value be `null` or `undefined`)
          if (typeof text !== "string") {
            return null;
          }

          const lines = text.split("\n");
          const numLines = lines.length;
          const expressionDoc = expressionDocs[i];

          const startsWithBlankLine =
            numLines > 2 && lines[0].trim() === "" && lines[1].trim() === "";
          const endsWithBlankLine =
            numLines > 2 &&
            lines[numLines - 1].trim() === "" &&
            lines[numLines - 2].trim() === "";

          const commentsAndWhitespaceOnly = lines.every(line =>
            /^\s*(?:#[^\r\n]*)?$/.test(line)
          );

          // Bail out if an interpolation occurs within a comment.
          if (!isLast && /#[^\r\n]*$/.test(lines[numLines - 1])) {
            return null;
          }

          let doc$$2 = null;

          if (commentsAndWhitespaceOnly) {
            doc$$2 = printGraphqlComments(lines);
          } else {
            try {
              doc$$2 = docUtils$4.stripTrailingHardline(
                textToDoc(text, { parser: "graphql" })
              );
            } catch (error) {
              if (process.env.PRETTIER_DEBUG) {
                throw error;
              }
              // Bail if any part fails to parse.
              return null;
            }
          }

          if (doc$$2) {
            doc$$2 = escapeBackticks(doc$$2);
            if (!isFirst && startsWithBlankLine) {
              parts.push("");
            }
            parts.push(doc$$2);
            if (!isLast && endsWithBlankLine) {
              parts.push("");
            }
          } else if (!isFirst && !isLast && startsWithBlankLine) {
            parts.push("");
          }

          if (expressionDoc) {
            parts.push(concat$4(["${", expressionDoc, "}"]));
          }
        }

        return concat$4([
          "`",
          indent$3(concat$4([hardline$3, join$3(hardline$3, parts)])),
          hardline$3,
          "`"
        ]);
      }

      break;
    }

    case "TemplateElement": {
      /**
       * md`...`
       * markdown`...`
       */
      if (
        parentParent &&
        (parentParent.type === "TaggedTemplateExpression" &&
          parent.quasis.length === 1 &&
          (parentParent.tag.type === "Identifier" &&
            (parentParent.tag.name === "md" ||
              parentParent.tag.name === "markdown")))
      ) {
        const text = parent.quasis[0].value.raw.replace(
          /((?:\\\\)*)\\`/g,
          (_, backslashes) => "\\".repeat(backslashes.length / 2) + "`"
        );
        const indentation = getIndentation(text);
        const hasIndent = indentation !== "";
        return concat$4([
          hasIndent
            ? indent$3(
                concat$4([
                  softline$2,
                  printMarkdown(
                    text.replace(new RegExp(`^${indentation}`, "gm"), "")
                  )
                ])
              )
            : concat$4([literalline$2, dedentToRoot$1(printMarkdown(text))]),
          softline$2
        ]);
      }

      break;
    }
  }

  function printMarkdown(text) {
    const doc$$2 = textToDoc(text, { parser: "markdown", __inJsTemplate: true });
    return docUtils$4.stripTrailingHardline(escapeBackticks(doc$$2));
  }
}

function getIndentation(str) {
  const firstMatchedIndent = str.match(/^([^\S\n]*)\S/m);
  return firstMatchedIndent === null ? "" : firstMatchedIndent[1];
}

function escapeBackticks(doc$$2) {
  return docUtils$4.mapDoc(doc$$2, currentDoc => {
    if (!currentDoc.parts) {
      return currentDoc;
    }

    const parts = [];

    currentDoc.parts.forEach(part => {
      if (typeof part === "string") {
        parts.push(part.replace(/(\\*)`/g, "$1$1\\`"));
      } else {
        parts.push(part);
      }
    });

    return Object.assign({}, currentDoc, { parts });
  });
}

function transformCssDoc(quasisDoc, path$$1, print) {
  const parentNode = path$$1.getValue();

  const isEmpty =
    parentNode.quasis.length === 1 && !parentNode.quasis[0].value.raw.trim();
  if (isEmpty) {
    return "``";
  }

  const expressionDocs = parentNode.expressions
    ? path$$1.map(print, "expressions")
    : [];
  const newDoc = replacePlaceholders(quasisDoc, expressionDocs);
  /* istanbul ignore if */
  if (!newDoc) {
    throw new Error("Couldn't insert all the expressions");
  }
  return concat$4([
    "`",
    indent$3(concat$4([hardline$3, docUtils$4.stripTrailingHardline(newDoc)])),
    softline$2,
    "`"
  ]);
}

// Search all the placeholders in the quasisDoc tree
// and replace them with the expression docs one by one
// returns a new doc with all the placeholders replaced,
// or null if it couldn't replace any expression
function replacePlaceholders(quasisDoc, expressionDocs) {
  if (!expressionDocs || !expressionDocs.length) {
    return quasisDoc;
  }

  const expressions = expressionDocs.slice();
  let replaceCounter = 0;
  const newDoc = docUtils$4.mapDoc(quasisDoc, doc$$2 => {
    if (!doc$$2 || !doc$$2.parts || !doc$$2.parts.length) {
      return doc$$2;
    }
    let parts = doc$$2.parts;
    const atIndex = parts.indexOf("@");
    const placeholderIndex = atIndex + 1;
    if (
      atIndex > -1 &&
      typeof parts[placeholderIndex] === "string" &&
      parts[placeholderIndex].startsWith("prettier-placeholder")
    ) {
      // If placeholder is split, join it
      const at = parts[atIndex];
      const placeholder = parts[placeholderIndex];
      const rest = parts.slice(placeholderIndex + 1);
      parts = parts
        .slice(0, atIndex)
        .concat([at + placeholder])
        .concat(rest);
    }
    const atPlaceholderIndex = parts.findIndex(
      part =>
        typeof part === "string" && part.startsWith("@prettier-placeholder")
    );
    if (atPlaceholderIndex > -1) {
      const placeholder = parts[atPlaceholderIndex];
      const rest = parts.slice(atPlaceholderIndex + 1);
      const placeholderMatch = placeholder.match(
        /@prettier-placeholder-(.+)-id([\s\S]*)/
      );
      const placeholderID = placeholderMatch[1];
      // When the expression has a suffix appended, like:
      // animation: linear ${time}s ease-out;
      const suffix = placeholderMatch[2];
      const expression = expressions[placeholderID];

      replaceCounter++;
      parts = parts
        .slice(0, atPlaceholderIndex)
        .concat(["${", expression, "}" + suffix])
        .concat(rest);
    }
    return Object.assign({}, doc$$2, {
      parts: parts
    });
  });

  return expressions.length === replaceCounter ? newDoc : null;
}

function printGraphqlComments(lines) {
  const parts = [];
  let seenComment = false;

  lines.map(textLine => textLine.trim()).forEach((textLine, i, array) => {
    // Lines are either whitespace only, or a comment (with poential whitespace
    // around it). Drop whitespace-only lines.
    if (textLine === "") {
      return;
    }

    if (array[i - 1] === "" && seenComment) {
      // If a non-first comment is preceded by a blank (whitespace only) line,
      // add in a blank line.
      parts.push(concat$4([hardline$3, textLine]));
    } else {
      parts.push(textLine);
    }

    seenComment = true;
  });

  // If `lines` was whitespace only, return `null`.
  return parts.length === 0 ? null : join$3(hardline$3, parts);
}

/**
 * Template literal in this context:
 * <style jsx>{`div{color:red}`}</style>
 */
function isStyledJsx(path$$1) {
  const node = path$$1.getValue();
  const parent = path$$1.getParentNode();
  const parentParent = path$$1.getParentNode(1);
  return (
    parentParent &&
    node.quasis &&
    parent.type === "JSXExpressionContainer" &&
    parentParent.type === "JSXElement" &&
    parentParent.openingElement.name.name === "style" &&
    parentParent.openingElement.attributes.some(
      attribute => attribute.name.name === "jsx"
    )
  );
}

/**
 * styled-components template literals
 */
function isStyledComponents(path$$1) {
  const parent = path$$1.getParentNode();

  if (!parent || parent.type !== "TaggedTemplateExpression") {
    return false;
  }

  const tag = parent.tag;

  switch (tag.type) {
    case "MemberExpression":
      return (
        // styled.foo``
        isStyledIdentifier(tag.object) ||
        // Component.extend``
        isStyledExtend(tag)
      );

    case "CallExpression":
      return (
        // styled(Component)``
        isStyledIdentifier(tag.callee) ||
        (tag.callee.type === "MemberExpression" &&
          ((tag.callee.object.type === "MemberExpression" &&
            // styled.foo.attr({})``
            (isStyledIdentifier(tag.callee.object.object) ||
              // Component.extend.attr({)``
              isStyledExtend(tag.callee.object))) ||
            // styled(Component).attr({})``
            (tag.callee.object.type === "CallExpression" &&
              isStyledIdentifier(tag.callee.object.callee))))
      );

    case "Identifier":
      // css``
      return tag.name === "css";

    default:
      return false;
  }
}

/**
 * JSX element with CSS prop
 */
function isCssProp(path$$1) {
  const parent = path$$1.getParentNode();
  const parentParent = path$$1.getParentNode(1);
  return (
    parentParent &&
    parent.type === "JSXExpressionContainer" &&
    parentParent.type === "JSXAttribute" &&
    parentParent.name.type === "JSXIdentifier" &&
    parentParent.name.name === "css"
  );
}

function isStyledIdentifier(node) {
  return node.type === "Identifier" && node.name === "styled";
}

function isStyledExtend(node) {
  return /^[A-Z]/.test(node.object.name) && node.property.name === "extend";
}

/*
 * react-relay and graphql-tag
 * graphql`...`
 * graphql.experimental`...`
 * gql`...`
 * GraphQL comment block
 *
 * This intentionally excludes Relay Classic tags, as Prettier does not
 * support Relay Classic formatting.
 */
function isGraphQL(path$$1) {
  const node = path$$1.getValue();
  const parent = path$$1.getParentNode();

  // This checks for a leading comment that is exactly `/* GraphQL */`
  // In order to be in line with other implementations of this comment tag
  // we will not trim the comment value and we will expect exactly one space on
  // either side of the GraphQL string
  // Also see ./clean.js
  const hasGraphQLComment =
    node.leadingComments &&
    node.leadingComments.some(
      comment =>
        comment.type === "CommentBlock" && comment.value === " GraphQL "
    );

  return (
    hasGraphQLComment ||
    (parent &&
      ((parent.type === "TaggedTemplateExpression" &&
        ((parent.tag.type === "MemberExpression" &&
          parent.tag.object.name === "graphql" &&
          parent.tag.property.name === "experimental") ||
          (parent.tag.type === "Identifier" &&
            (parent.tag.name === "gql" || parent.tag.name === "graphql")))) ||
        (parent.type === "CallExpression" &&
          parent.callee.type === "Identifier" &&
          parent.callee.name === "graphql")))
  );
}

var embed_1 = embed;

function clean(ast, newObj, parent) {
  [
    "leadingComments",
    "trailingComments",
    "extra",
    "start",
    "end",
    "flags"
  ].forEach(name => {
    delete newObj[name];
  });

  // We remove extra `;` and add them when needed
  if (ast.type === "EmptyStatement") {
    return null;
  }

  // We move text around, including whitespaces and add {" "}
  if (ast.type === "JSXText") {
    return null;
  }
  if (
    ast.type === "JSXExpressionContainer" &&
    ast.expression.type === "Literal" &&
    ast.expression.value === " "
  ) {
    return null;
  }

  // (TypeScript) Ignore `static` in `constructor(static p) {}`
  // and `export` in `constructor(export p) {}`
  if (
    ast.type === "TSParameterProperty" &&
    ast.accessibility === null &&
    !ast.readonly
  ) {
    return {
      type: "Identifier",
      name: ast.parameter.name,
      typeAnnotation: newObj.parameter.typeAnnotation,
      decorators: newObj.decorators
    };
  }

  // (TypeScript) ignore empty `specifiers` array
  if (
    ast.type === "TSNamespaceExportDeclaration" &&
    ast.specifiers &&
    ast.specifiers.length === 0
  ) {
    delete newObj.specifiers;
  }

  // (TypeScript) bypass TSParenthesizedType
  if (
    ast.type === "TSParenthesizedType" &&
    ast.typeAnnotation.type === "TSTypeAnnotation"
  ) {
    return newObj.typeAnnotation.typeAnnotation;
  }

  // We convert <div></div> to <div />
  if (ast.type === "JSXOpeningElement") {
    delete newObj.selfClosing;
  }
  if (ast.type === "JSXElement") {
    delete newObj.closingElement;
  }

  // We change {'key': value} into {key: value}
  if (
    (ast.type === "Property" ||
      ast.type === "ObjectProperty" ||
      ast.type === "MethodDefinition" ||
      ast.type === "ClassProperty" ||
      ast.type === "TSPropertySignature" ||
      ast.type === "ObjectTypeProperty") &&
    typeof ast.key === "object" &&
    ast.key &&
    (ast.key.type === "Literal" ||
      ast.key.type === "StringLiteral" ||
      ast.key.type === "Identifier")
  ) {
    delete newObj.key;
  }

  // Remove raw and cooked values from TemplateElement when it's CSS
  // styled-jsx
  if (
    ast.type === "JSXElement" &&
    ast.openingElement.name.name === "style" &&
    ast.openingElement.attributes.some(attr => attr.name.name === "jsx")
  ) {
    const templateLiterals = newObj.children
      .filter(
        child =>
          child.type === "JSXExpressionContainer" &&
          child.expression.type === "TemplateLiteral"
      )
      .map(container => container.expression);

    const quasis = templateLiterals.reduce(
      (quasis, templateLiteral) => quasis.concat(templateLiteral.quasis),
      []
    );

    quasis.forEach(q => delete q.value);
  }

  // CSS template literals in css prop
  if (
    ast.type === "JSXAttribute" &&
    ast.name.name === "css" &&
    ast.value.type === "JSXExpressionContainer" &&
    ast.value.expression.type === "TemplateLiteral"
  ) {
    newObj.value.expression.quasis.forEach(q => delete q.value);
  }

  // styled-components, graphql, markdown
  if (
    ast.type === "TaggedTemplateExpression" &&
    (ast.tag.type === "MemberExpression" ||
      (ast.tag.type === "Identifier" &&
        (ast.tag.name === "gql" ||
          ast.tag.name === "graphql" ||
          ast.tag.name === "css" ||
          ast.tag.name === "md" ||
          ast.tag.name === "markdown")) ||
      ast.tag.type === "CallExpression")
  ) {
    newObj.quasi.quasis.forEach(quasi => delete quasi.value);
  }
  if (ast.type === "TemplateLiteral") {
    // This checks for a leading comment that is exactly `/* GraphQL */`
    // In order to be in line with other implementations of this comment tag
    // we will not trim the comment value and we will expect exactly one space on
    // either side of the GraphQL string
    // Also see ./embed.js
    const hasGraphQLComment =
      ast.leadingComments &&
      ast.leadingComments.some(
        comment =>
          comment.type === "CommentBlock" && comment.value === " GraphQL "
      );
    if (
      hasGraphQLComment ||
      (parent.type === "CallExpression" && parent.callee.name === "graphql")
    ) {
      newObj.quasis.forEach(quasi => delete quasi.value);
    }
  }
}

var clean_1 = clean;

var detectNewline = createCommonjsModule(function (module) {
'use strict';
module.exports = function (str) {
	if (typeof str !== 'string') {
		throw new TypeError('Expected a string');
	}

	var newlines = (str.match(/(?:\r?\n)/g) || []);

	if (newlines.length === 0) {
		return null;
	}

	var crlf = newlines.filter(function (el) {
		return el === '\r\n';
	}).length;

	var lf = newlines.length - crlf;

	return crlf > lf ? '\r\n' : '\n';
};

module.exports.graceful = function (str) {
	return module.exports(str) || '\n';
};
});

var build = createCommonjsModule(function (module, exports) {
'use strict';Object.defineProperty(exports, "__esModule", { value: true });exports.
























extract = extract;exports.




strip = strip;exports.




parse = parse;exports.



parseWithComments = parseWithComments;exports.







































print = print;var _detectNewline;function _load_detectNewline() {return _detectNewline = _interopRequireDefault(detectNewline);}var _os;function _load_os() {return _os = os;}function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };} /**
                                                                                                                                                                                                                                                                                                    * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
                                                                                                                                                                                                                                                                                                    *
                                                                                                                                                                                                                                                                                                    * This source code is licensed under the MIT license found in the
                                                                                                                                                                                                                                                                                                    * LICENSE file in the root directory of this source tree.
                                                                                                                                                                                                                                                                                                    *
                                                                                                                                                                                                                                                                                                    * 
                                                                                                                                                                                                                                                                                                    */const commentEndRe = /\*\/$/;const commentStartRe = /^\/\*\*/;const docblockRe = /^\s*(\/\*\*?(.|\r?\n)*?\*\/)/;const lineCommentRe = /(^|\s+)\/\/([^\r\n]*)/g;const ltrimRe = /^\s*/;const rtrimRe = /\s*$/;const ltrimNewlineRe = /^(\r?\n)+/;const multilineRe = /(?:^|\r?\n) *(@[^\r\n]*?) *\r?\n *(?![^@\r\n]*\/\/[^]*)([^@\r\n\s][^@\r\n]+?) *\r?\n/g;const propertyRe = /(?:^|\r?\n) *@(\S+) *([^\r\n]*)/g;const stringStartRe = /(\r?\n|^) *\* ?/g;function extract(contents) {const match = contents.match(docblockRe);return match ? match[0].replace(ltrimRe, '') || '' : '';}function strip(contents) {const match = contents.match(docblockRe);return match && match[0] ? contents.substring(match[0].length) : contents;}function parse(docblock) {return parseWithComments(docblock).pragmas;}function parseWithComments(docblock) {const line = (0, (_detectNewline || _load_detectNewline()).default)(docblock) || (_os || _load_os()).EOL;docblock = docblock.replace(commentStartRe, '').replace(commentEndRe, '').replace(stringStartRe, '$1'); // Normalize multi-line directives
  let prev = '';while (prev !== docblock) {prev = docblock;docblock = docblock.replace(multilineRe, `${line}$1 $2${line}`);}docblock = docblock.replace(ltrimNewlineRe, '').replace(rtrimRe, '');const result = Object.create(null);const comments = docblock.replace(propertyRe, '').replace(ltrimNewlineRe, '').replace(rtrimRe, '');let match;while (match = propertyRe.exec(docblock)) {// strip linecomments from pragmas
    const nextPragma = match[2].replace(lineCommentRe, '');if (typeof result[match[1]] === 'string' || Array.isArray(result[match[1]])) {result[match[1]] = [].concat(result[match[1]], nextPragma);} else {result[match[1]] = nextPragma;}}return { comments, pragmas: result };}function print(_ref) {var _ref$comments = _ref.comments;let comments = _ref$comments === undefined ? '' : _ref$comments;var _ref$pragmas = _ref.pragmas;let pragmas = _ref$pragmas === undefined ? {} : _ref$pragmas;const line = (0, (_detectNewline || _load_detectNewline()).default)(comments) || (_os || _load_os()).EOL;const head = '/**';
  const start = ' *';
  const tail = ' */';

  const keys = Object.keys(pragmas);

  const printedObject = keys.
  map(key => printKeyValues(key, pragmas[key])).
  reduce((arr, next) => arr.concat(next), []).
  map(keyValue => start + ' ' + keyValue + line).
  join('');

  if (!comments) {
    if (keys.length === 0) {
      return '';
    }
    if (keys.length === 1 && !Array.isArray(pragmas[keys[0]])) {
      const value = pragmas[keys[0]];
      return `${head} ${printKeyValues(keys[0], value)[0]}${tail}`;
    }
  }

  const printedComments =
  comments.
  split(line).
  map(textLine => `${start} ${textLine}`).
  join(line) + line;

  return (
    head +
    line + (
    comments ? printedComments : '') + (
    comments && keys.length ? start + line : '') +
    printedObject +
    tail);

}

function printKeyValues(key, valueOrArray) {
  return [].concat(valueOrArray).map(value => `@${key} ${value}`.trim());
}
});

unwrapExports(build);

function hasPragma$1(text) {
  const pragmas = Object.keys(build.parse(build.extract(text)));
  return pragmas.indexOf("prettier") !== -1 || pragmas.indexOf("format") !== -1;
}

function insertPragma$1(text) {
  const parsedDocblock = build.parseWithComments(build.extract(text));
  const pragmas = Object.assign({ format: "" }, parsedDocblock.pragmas);
  const newDocblock = build.print({
    pragmas,
    comments: parsedDocblock.comments.replace(/^(\s+?\r?\n)+/, "") // remove leading newlines
  });
  const strippedText = build.strip(text);
  const separatingNewlines = strippedText.startsWith("\n") ? "\n" : "\n\n";
  return newDocblock + separatingNewlines + strippedText;
}

var pragma = {
  hasPragma: hasPragma$1,
  insertPragma: insertPragma$1
};

const addLeadingComment$2 = utilShared.addLeadingComment;
const addTrailingComment$2 = utilShared.addTrailingComment;
const addDanglingComment$2 = utilShared.addDanglingComment;

function handleOwnLineComment(comment, text, options, ast, isLastComment) {
  const precedingNode = comment.precedingNode;
  const enclosingNode = comment.enclosingNode;
  const followingNode = comment.followingNode;
  if (
    handleLastFunctionArgComments(
      text,
      precedingNode,
      enclosingNode,
      followingNode,
      comment,
      options
    ) ||
    handleMemberExpressionComments(enclosingNode, followingNode, comment) ||
    handleIfStatementComments(
      text,
      precedingNode,
      enclosingNode,
      followingNode,
      comment,
      options
    ) ||
    handleTryStatementComments(enclosingNode, followingNode, comment) ||
    handleClassComments(enclosingNode, precedingNode, followingNode, comment) ||
    handleImportSpecifierComments(enclosingNode, comment) ||
    handleForComments(enclosingNode, precedingNode, comment) ||
    handleUnionTypeComments(
      precedingNode,
      enclosingNode,
      followingNode,
      comment
    ) ||
    handleOnlyComments(enclosingNode, ast, comment, isLastComment) ||
    handleImportDeclarationComments(
      text,
      enclosingNode,
      precedingNode,
      comment,
      options
    ) ||
    handleAssignmentPatternComments(enclosingNode, comment) ||
    handleMethodNameComments(
      text,
      enclosingNode,
      precedingNode,
      comment,
      options
    )
  ) {
    return true;
  }
  return false;
}

function handleEndOfLineComment(comment, text, options, ast, isLastComment) {
  const precedingNode = comment.precedingNode;
  const enclosingNode = comment.enclosingNode;
  const followingNode = comment.followingNode;
  if (
    handleLastFunctionArgComments(
      text,
      precedingNode,
      enclosingNode,
      followingNode,
      comment,
      options
    ) ||
    handleConditionalExpressionComments(
      enclosingNode,
      precedingNode,
      followingNode,
      comment,
      text,
      options
    ) ||
    handleImportSpecifierComments(enclosingNode, comment) ||
    handleIfStatementComments(
      text,
      precedingNode,
      enclosingNode,
      followingNode,
      comment,
      options
    ) ||
    handleClassComments(enclosingNode, precedingNode, followingNode, comment) ||
    handleLabeledStatementComments(enclosingNode, comment) ||
    handleCallExpressionComments(precedingNode, enclosingNode, comment) ||
    handlePropertyComments(enclosingNode, comment) ||
    handleOnlyComments(enclosingNode, ast, comment, isLastComment) ||
    handleTypeAliasComments(enclosingNode, followingNode, comment) ||
    handleVariableDeclaratorComments(enclosingNode, followingNode, comment)
  ) {
    return true;
  }
  return false;
}

function handleRemainingComment(comment, text, options, ast, isLastComment) {
  const precedingNode = comment.precedingNode;
  const enclosingNode = comment.enclosingNode;
  const followingNode = comment.followingNode;
  if (
    handleIfStatementComments(
      text,
      precedingNode,
      enclosingNode,
      followingNode,
      comment,
      options
    ) ||
    handleObjectPropertyAssignment(enclosingNode, precedingNode, comment) ||
    handleCommentInEmptyParens(text, enclosingNode, comment, options) ||
    handleMethodNameComments(
      text,
      enclosingNode,
      precedingNode,
      comment,
      options
    ) ||
    handleOnlyComments(enclosingNode, ast, comment, isLastComment) ||
    handleCommentAfterArrowParams(text, enclosingNode, comment, options) ||
    handleFunctionNameComments(
      text,
      enclosingNode,
      precedingNode,
      comment,
      options
    ) ||
    handleTSMappedTypeComments(
      text,
      enclosingNode,
      precedingNode,
      followingNode,
      comment
    ) ||
    handleBreakAndContinueStatementComments(enclosingNode, comment)
  ) {
    return true;
  }
  return false;
}

function addBlockStatementFirstComment(node, comment) {
  const body = node.body.filter(n => n.type !== "EmptyStatement");
  if (body.length === 0) {
    addDanglingComment$2(node, comment);
  } else {
    addLeadingComment$2(body[0], comment);
  }
}

function addBlockOrNotComment(node, comment) {
  if (node.type === "BlockStatement") {
    addBlockStatementFirstComment(node, comment);
  } else {
    addLeadingComment$2(node, comment);
  }
}

// There are often comments before the else clause of if statements like
//
//   if (1) { ... }
//   // comment
//   else { ... }
//
// They are being attached as leading comments of the BlockExpression which
// is not well printed. What we want is to instead move the comment inside
// of the block and make it leadingComment of the first element of the block
// or dangling comment of the block if there is nothing inside
//
//   if (1) { ... }
//   else {
//     // comment
//     ...
//   }
function handleIfStatementComments(
  text,
  precedingNode,
  enclosingNode,
  followingNode,
  comment,
  options
) {
  if (
    !enclosingNode ||
    enclosingNode.type !== "IfStatement" ||
    !followingNode
  ) {
    return false;
  }

  // We unfortunately have no way using the AST or location of nodes to know
  // if the comment is positioned before the condition parenthesis:
  //   if (a /* comment */) {}
  // The only workaround I found is to look at the next character to see if
  // it is a ).
  const nextCharacter = util$1.getNextNonSpaceNonCommentCharacter(
    text,
    comment,
    options.locEnd
  );
  if (nextCharacter === ")") {
    addTrailingComment$2(precedingNode, comment);
    return true;
  }

  // Comments before `else`:
  // - treat as trailing comments of the consequent, if it's a BlockStatement
  // - treat as a dangling comment otherwise
  if (
    precedingNode === enclosingNode.consequent &&
    followingNode === enclosingNode.alternate
  ) {
    if (precedingNode.type === "BlockStatement") {
      addTrailingComment$2(precedingNode, comment);
    } else {
      addDanglingComment$2(enclosingNode, comment);
    }
    return true;
  }

  if (followingNode.type === "BlockStatement") {
    addBlockStatementFirstComment(followingNode, comment);
    return true;
  }

  if (followingNode.type === "IfStatement") {
    addBlockOrNotComment(followingNode.consequent, comment);
    return true;
  }

  // For comments positioned after the condition parenthesis in an if statement
  // before the consequent with or without brackets on, such as
  // if (a) /* comment */ {} or if (a) /* comment */ true,
  // we look at the next character to see if it is a { or if the following node
  // is the consequent for the if statement
  if (nextCharacter === "{" || enclosingNode.consequent === followingNode) {
    addLeadingComment$2(followingNode, comment);
    return true;
  }

  return false;
}

// Same as IfStatement but for TryStatement
function handleTryStatementComments(enclosingNode, followingNode, comment) {
  if (
    !enclosingNode ||
    enclosingNode.type !== "TryStatement" ||
    !followingNode
  ) {
    return false;
  }

  if (followingNode.type === "BlockStatement") {
    addBlockStatementFirstComment(followingNode, comment);
    return true;
  }

  if (followingNode.type === "TryStatement") {
    addBlockOrNotComment(followingNode.finalizer, comment);
    return true;
  }

  if (followingNode.type === "CatchClause") {
    addBlockOrNotComment(followingNode.body, comment);
    return true;
  }

  return false;
}

function handleMemberExpressionComments(enclosingNode, followingNode, comment) {
  if (
    enclosingNode &&
    enclosingNode.type === "MemberExpression" &&
    followingNode &&
    followingNode.type === "Identifier"
  ) {
    addLeadingComment$2(enclosingNode, comment);
    return true;
  }

  return false;
}

function handleConditionalExpressionComments(
  enclosingNode,
  precedingNode,
  followingNode,
  comment,
  text,
  options
) {
  const isSameLineAsPrecedingNode =
    precedingNode &&
    !util$1.hasNewlineInRange(
      text,
      options.locEnd(precedingNode),
      options.locStart(comment)
    );

  if (
    (!precedingNode || !isSameLineAsPrecedingNode) &&
    enclosingNode &&
    enclosingNode.type === "ConditionalExpression" &&
    followingNode
  ) {
    addLeadingComment$2(followingNode, comment);
    return true;
  }
  return false;
}

function handleObjectPropertyAssignment(enclosingNode, precedingNode, comment) {
  if (
    enclosingNode &&
    (enclosingNode.type === "ObjectProperty" ||
      enclosingNode.type === "Property") &&
    enclosingNode.shorthand &&
    enclosingNode.key === precedingNode &&
    enclosingNode.value.type === "AssignmentPattern"
  ) {
    addTrailingComment$2(enclosingNode.value.left, comment);
    return true;
  }
  return false;
}

function handleClassComments(
  enclosingNode,
  precedingNode,
  followingNode,
  comment
) {
  if (
    enclosingNode &&
    (enclosingNode.type === "ClassDeclaration" ||
      enclosingNode.type === "ClassExpression") &&
    (enclosingNode.decorators && enclosingNode.decorators.length > 0) &&
    !(followingNode && followingNode.type === "Decorator")
  ) {
    if (!enclosingNode.decorators || enclosingNode.decorators.length === 0) {
      addLeadingComment$2(enclosingNode, comment);
    } else {
      addTrailingComment$2(
        enclosingNode.decorators[enclosingNode.decorators.length - 1],
        comment
      );
    }
    return true;
  }
  return false;
}

function handleMethodNameComments(
  text,
  enclosingNode,
  precedingNode,
  comment,
  options
) {
  // This is only needed for estree parsers (flow, typescript) to attach
  // after a method name:
  // obj = { fn /*comment*/() {} };
  if (
    enclosingNode &&
    precedingNode &&
    (enclosingNode.type === "Property" ||
      enclosingNode.type === "MethodDefinition") &&
    precedingNode.type === "Identifier" &&
    enclosingNode.key === precedingNode &&
    // special Property case: { key: /*comment*/(value) };
    // comment should be attached to value instead of key
    util$1.getNextNonSpaceNonCommentCharacter(
      text,
      precedingNode,
      options.locEnd
    ) !== ":"
  ) {
    addTrailingComment$2(precedingNode, comment);
    return true;
  }

  // Print comments between decorators and class methods as a trailing comment
  // on the decorator node instead of the method node
  if (
    precedingNode &&
    enclosingNode &&
    precedingNode.type === "Decorator" &&
    (enclosingNode.type === "ClassMethod" ||
      enclosingNode.type === "ClassProperty" ||
      enclosingNode.type === "TSAbstractClassProperty" ||
      enclosingNode.type === "TSAbstractMethodDefinition" ||
      enclosingNode.type === "MethodDefinition")
  ) {
    addTrailingComment$2(precedingNode, comment);
    return true;
  }

  return false;
}

function handleFunctionNameComments(
  text,
  enclosingNode,
  precedingNode,
  comment,
  options
) {
  if (
    util$1.getNextNonSpaceNonCommentCharacter(
      text,
      comment,
      options.locEnd
    ) !== "("
  ) {
    return false;
  }

  if (
    precedingNode &&
    enclosingNode &&
    (enclosingNode.type === "FunctionDeclaration" ||
      enclosingNode.type === "FunctionExpression" ||
      enclosingNode.type === "ClassMethod" ||
      enclosingNode.type === "MethodDefinition" ||
      enclosingNode.type === "ObjectMethod")
  ) {
    addTrailingComment$2(precedingNode, comment);
    return true;
  }
  return false;
}

function handleCommentAfterArrowParams(text, enclosingNode, comment, options) {
  if (!(enclosingNode && enclosingNode.type === "ArrowFunctionExpression")) {
    return false;
  }

  const index = utilShared.getNextNonSpaceNonCommentCharacterIndex(
    text,
    comment,
    options
  );
  if (text.substr(index, 2) === "=>") {
    addDanglingComment$2(enclosingNode, comment);
    return true;
  }

  return false;
}

function handleCommentInEmptyParens(text, enclosingNode, comment, options) {
  if (
    util$1.getNextNonSpaceNonCommentCharacter(
      text,
      comment,
      options.locEnd
    ) !== ")"
  ) {
    return false;
  }

  // Only add dangling comments to fix the case when no params are present,
  // i.e. a function without any argument.
  if (
    enclosingNode &&
    (((enclosingNode.type === "FunctionDeclaration" ||
      enclosingNode.type === "FunctionExpression" ||
      (enclosingNode.type === "ArrowFunctionExpression" &&
        (enclosingNode.body.type !== "CallExpression" ||
          enclosingNode.body.arguments.length === 0)) ||
      enclosingNode.type === "ClassMethod" ||
      enclosingNode.type === "ObjectMethod") &&
      enclosingNode.params.length === 0) ||
      (enclosingNode.type === "CallExpression" &&
        enclosingNode.arguments.length === 0))
  ) {
    addDanglingComment$2(enclosingNode, comment);
    return true;
  }
  if (
    enclosingNode &&
    (enclosingNode.type === "MethodDefinition" &&
      enclosingNode.value.params.length === 0)
  ) {
    addDanglingComment$2(enclosingNode.value, comment);
    return true;
  }
  return false;
}

function handleLastFunctionArgComments(
  text,
  precedingNode,
  enclosingNode,
  followingNode,
  comment,
  options
) {
  // Type definitions functions
  if (
    precedingNode &&
    precedingNode.type === "FunctionTypeParam" &&
    enclosingNode &&
    enclosingNode.type === "FunctionTypeAnnotation" &&
    followingNode &&
    followingNode.type !== "FunctionTypeParam"
  ) {
    addTrailingComment$2(precedingNode, comment);
    return true;
  }

  // Real functions
  if (
    precedingNode &&
    (precedingNode.type === "Identifier" ||
      precedingNode.type === "AssignmentPattern") &&
    enclosingNode &&
    (enclosingNode.type === "ArrowFunctionExpression" ||
      enclosingNode.type === "FunctionExpression" ||
      enclosingNode.type === "FunctionDeclaration" ||
      enclosingNode.type === "ObjectMethod" ||
      enclosingNode.type === "ClassMethod") &&
    util$1.getNextNonSpaceNonCommentCharacter(
      text,
      comment,
      options.locEnd
    ) === ")"
  ) {
    addTrailingComment$2(precedingNode, comment);
    return true;
  }
  return false;
}

function handleImportSpecifierComments(enclosingNode, comment) {
  if (enclosingNode && enclosingNode.type === "ImportSpecifier") {
    addLeadingComment$2(enclosingNode, comment);
    return true;
  }
  return false;
}

function handleLabeledStatementComments(enclosingNode, comment) {
  if (enclosingNode && enclosingNode.type === "LabeledStatement") {
    addLeadingComment$2(enclosingNode, comment);
    return true;
  }
  return false;
}

function handleBreakAndContinueStatementComments(enclosingNode, comment) {
  if (
    enclosingNode &&
    (enclosingNode.type === "ContinueStatement" ||
      enclosingNode.type === "BreakStatement") &&
    !enclosingNode.label
  ) {
    addTrailingComment$2(enclosingNode, comment);
    return true;
  }
  return false;
}

function handleCallExpressionComments(precedingNode, enclosingNode, comment) {
  if (
    enclosingNode &&
    enclosingNode.type === "CallExpression" &&
    precedingNode &&
    enclosingNode.callee === precedingNode &&
    enclosingNode.arguments.length > 0
  ) {
    addLeadingComment$2(enclosingNode.arguments[0], comment);
    return true;
  }
  return false;
}

function handleUnionTypeComments(
  precedingNode,
  enclosingNode,
  followingNode,
  comment
) {
  if (
    enclosingNode &&
    (enclosingNode.type === "UnionTypeAnnotation" ||
      enclosingNode.type === "TSUnionType")
  ) {
    addTrailingComment$2(precedingNode, comment);
    return true;
  }
  return false;
}

function handlePropertyComments(enclosingNode, comment) {
  if (
    enclosingNode &&
    (enclosingNode.type === "Property" ||
      enclosingNode.type === "ObjectProperty")
  ) {
    addLeadingComment$2(enclosingNode, comment);
    return true;
  }
  return false;
}

function handleOnlyComments(enclosingNode, ast, comment, isLastComment) {
  // With Flow the enclosingNode is undefined so use the AST instead.
  if (ast && ast.body && ast.body.length === 0) {
    if (isLastComment) {
      addDanglingComment$2(ast, comment);
    } else {
      addLeadingComment$2(ast, comment);
    }
    return true;
  } else if (
    enclosingNode &&
    enclosingNode.type === "Program" &&
    enclosingNode.body.length === 0 &&
    enclosingNode.directives &&
    enclosingNode.directives.length === 0
  ) {
    if (isLastComment) {
      addDanglingComment$2(enclosingNode, comment);
    } else {
      addLeadingComment$2(enclosingNode, comment);
    }
    return true;
  }
  return false;
}

function handleForComments(enclosingNode, precedingNode, comment) {
  if (
    enclosingNode &&
    (enclosingNode.type === "ForInStatement" ||
      enclosingNode.type === "ForOfStatement")
  ) {
    addLeadingComment$2(enclosingNode, comment);
    return true;
  }
  return false;
}

function handleImportDeclarationComments(
  text,
  enclosingNode,
  precedingNode,
  comment,
  options
) {
  if (
    precedingNode &&
    enclosingNode &&
    enclosingNode.type === "ImportDeclaration" &&
    util$1.hasNewline(text, options.locEnd(comment))
  ) {
    addTrailingComment$2(precedingNode, comment);
    return true;
  }
  return false;
}

function handleAssignmentPatternComments(enclosingNode, comment) {
  if (enclosingNode && enclosingNode.type === "AssignmentPattern") {
    addLeadingComment$2(enclosingNode, comment);
    return true;
  }
  return false;
}

function handleTypeAliasComments(enclosingNode, followingNode, comment) {
  if (enclosingNode && enclosingNode.type === "TypeAlias") {
    addLeadingComment$2(enclosingNode, comment);
    return true;
  }
  return false;
}

function handleVariableDeclaratorComments(
  enclosingNode,
  followingNode,
  comment
) {
  if (
    enclosingNode &&
    enclosingNode.type === "VariableDeclarator" &&
    followingNode &&
    (followingNode.type === "ObjectExpression" ||
      followingNode.type === "ArrayExpression")
  ) {
    addLeadingComment$2(followingNode, comment);
    return true;
  }
  return false;
}

function handleTSMappedTypeComments(
  text,
  enclosingNode,
  precedingNode,
  followingNode,
  comment
) {
  if (!enclosingNode || enclosingNode.type !== "TSMappedType") {
    return false;
  }

  if (
    followingNode &&
    followingNode.type === "TSTypeParameter" &&
    followingNode.name
  ) {
    addLeadingComment$2(followingNode.name, comment);
    return true;
  }

  if (
    precedingNode &&
    precedingNode.type === "TSTypeParameter" &&
    precedingNode.constraint
  ) {
    addTrailingComment$2(precedingNode.constraint, comment);
    return true;
  }

  return false;
}

function isBlockComment(comment) {
  return comment.type === "Block" || comment.type === "CommentBlock";
}

var comments$2 = {
  handleOwnLineComment,
  handleEndOfLineComment,
  handleRemainingComment,
  isBlockComment
};

function hasClosureCompilerTypeCastComment(text, node, locEnd) {
  // https://github.com/google/closure-compiler/wiki/Annotating-Types#type-casts
  // Syntax example: var x = /** @type {string} */ (fruit);
  return (
    node.comments &&
    node.comments.some(
      comment =>
        comment.leading &&
        comments$2.isBlockComment(comment) &&
        comment.value.match(/^\*\s*@type\s*{[^}]+}\s*$/) &&
        util$1.getNextNonSpaceNonCommentCharacter(text, comment, locEnd) === "("
    )
  );
}

function needsParens(path$$1, options) {
  const parent = path$$1.getParentNode();
  if (!parent) {
    return false;
  }

  const name = path$$1.getName();
  const node = path$$1.getNode();

  // If the value of this path is some child of a Node and not a Node
  // itself, then it doesn't need parentheses. Only Node objects (in
  // fact, only Expression nodes) need parentheses.
  if (path$$1.getValue() !== node) {
    return false;
  }

  // Only statements don't need parentheses.
  if (isStatement(node)) {
    return false;
  }

  // Closure compiler requires that type casted expressions to be surrounded by
  // parentheses.
  if (
    hasClosureCompilerTypeCastComment(
      options.originalText,
      node,
      options.locEnd
    )
  ) {
    return true;
  }

  // Identifiers never need parentheses.
  if (node.type === "Identifier") {
    return false;
  }

  if (parent.type === "ParenthesizedExpression") {
    return false;
  }

  // Add parens around the extends clause of a class. It is needed for almost
  // all expressions.
  if (
    (parent.type === "ClassDeclaration" || parent.type === "ClassExpression") &&
    parent.superClass === node &&
    (node.type === "ArrowFunctionExpression" ||
      node.type === "AssignmentExpression" ||
      node.type === "AwaitExpression" ||
      node.type === "BinaryExpression" ||
      node.type === "ConditionalExpression" ||
      node.type === "LogicalExpression" ||
      node.type === "NewExpression" ||
      node.type === "ObjectExpression" ||
      node.type === "ParenthesizedExpression" ||
      node.type === "SequenceExpression" ||
      node.type === "TaggedTemplateExpression" ||
      node.type === "UnaryExpression" ||
      node.type === "UpdateExpression" ||
      node.type === "YieldExpression")
  ) {
    return true;
  }

  if (
    (parent.type === "ArrowFunctionExpression" &&
    parent.body === node &&
    (!options.lenient || options.lenientCompat) &&
    node.type !== "SequenceExpression" && // these have parens added anyway
      util$1.startsWithNoLookaheadToken(
        node,
        /* forbidFunctionAndClass */ false
      )) ||
    (parent.type === "ExpressionStatement" &&
      util$1.startsWithNoLookaheadToken(node, /* forbidFunctionAndClass */ true))
  ) {
    return true;
  }

  switch (node.type) {
    case "CallExpression": {
      let firstParentNotMemberExpression = parent;
      let i = 0;
      while (
        firstParentNotMemberExpression &&
        firstParentNotMemberExpression.type === "MemberExpression"
      ) {
        firstParentNotMemberExpression = path$$1.getParentNode(++i);
      }

      if (
        firstParentNotMemberExpression.type === "NewExpression" &&
        firstParentNotMemberExpression.callee === path$$1.getParentNode(i - 1)
      ) {
        return true;
      }
      return false;
    }

    case "SpreadElement":
    case "SpreadProperty":
      return (
        parent.type === "MemberExpression" &&
        name === "object" &&
        parent.object === node
      );

    case "UpdateExpression":
      if (parent.type === "UnaryExpression") {
        return (
          node.prefix &&
          ((node.operator === "++" && parent.operator === "+") ||
            (node.operator === "--" && parent.operator === "-"))
        );
      }
    // else fallthrough
    case "UnaryExpression":
      switch (parent.type) {
        case "UnaryExpression":
          return (
            node.operator === parent.operator &&
            (node.operator === "+" || node.operator === "-")
          );

        case "MemberExpression":
          return name === "object" && parent.object === node;

        case "TaggedTemplateExpression":
          return true;

        case "NewExpression":
        case "CallExpression":
          return name === "callee" && parent.callee === node;

        case "BinaryExpression":
          return parent.operator === "**" && name === "left";

        case "TSNonNullExpression":
          return true;

        default:
          return false;
      }

    case "BinaryExpression": {
      if (parent.type === "UpdateExpression") {
        return true;
      }

      const isLeftOfAForStatement = node => {
        let i = 0;
        while (node) {
          const parent = path$$1.getParentNode(i++);
          if (!parent) {
            return false;
          }
          if (parent.type === "ForStatement" && parent.init === node) {
            return true;
          }
          node = parent;
        }
        return false;
      };
      if (node.operator === "in" && isLeftOfAForStatement(node)) {
        return true;
      }
    }
    // fallthrough
    case "TSTypeAssertionExpression":
    case "TSAsExpression":
    case "LogicalExpression":
      switch (parent.type) {
        case "ConditionalExpression":
          return node.type === "TSAsExpression";

        case "CallExpression":
        case "NewExpression":
          return name === "callee" && parent.callee === node;

        case "ClassDeclaration":
        case "TSAbstractClassDeclaration":
          return name === "superClass" && parent.superClass === node;
        case "TSTypeAssertionExpression":
        case "TaggedTemplateExpression":
        case "UnaryExpression":
        case "SpreadElement":
        case "SpreadProperty":
        case "ExperimentalSpreadProperty":
        case "BindExpression":
        case "AwaitExpression":
        case "TSAsExpression":
        case "TSNonNullExpression":
        case "UpdateExpression":
          return true;

        case "MemberExpression":
          return name === "object" && parent.object === node;

        case "AssignmentExpression":
          return (
            parent.left === node &&
            (node.type === "TSTypeAssertionExpression" ||
              node.type === "TSAsExpression")
          );
        case "Decorator":
          return (
            parent.expression === node &&
            (node.type === "TSTypeAssertionExpression" ||
              node.type === "TSAsExpression")
          );

        case "BinaryExpression":
        case "LogicalExpression": {
          if (!node.operator && node.type !== "TSTypeAssertionExpression") {
            return true;
          }

          const po = parent.operator;
          const pp = util$1.getPrecedence(po);
          const no = node.operator;
          const np = util$1.getPrecedence(no);

          if (pp > np) {
            return true;
          }

          if ((po === "||" || po === "??") && no === "&&") {
            return true;
          }

          if (pp === np && name === "right") {
            assert.strictEqual(parent.right, node);
            return true;
          }

          if (pp === np && !util$1.shouldFlatten(po, no)) {
            return true;
          }

          if (pp < np && no === "%") {
            return !util$1.shouldFlatten(po, no);
          }

          // Add parenthesis when working with binary operators
          // It's not stricly needed but helps with code understanding
          if (util$1.isBitwiseOperator(po)) {
            return true;
          }

          return false;
        }

        default:
          return false;
      }

    case "TSParenthesizedType": {
      const grandParent = path$$1.getParentNode(1);
      if (
        (parent.type === "TSTypeParameter" ||
          parent.type === "TypeParameter" ||
          parent.type === "VariableDeclarator" ||
          parent.type === "TSTypeAnnotation" ||
          parent.type === "GenericTypeAnnotation" ||
          parent.type === "TSTypeReference") &&
        (node.typeAnnotation.type === "TSTypeAnnotation" &&
          node.typeAnnotation.typeAnnotation.type !== "TSFunctionType" &&
          grandParent.type !== "TSTypeOperator")
      ) {
        return false;
      }
      // Delegate to inner TSParenthesizedType
      if (node.typeAnnotation.type === "TSParenthesizedType") {
        return false;
      }
      return true;
    }

    case "SequenceExpression":
      switch (parent.type) {
        case "ReturnStatement":
          return false;

        case "ForStatement":
          // Although parentheses wouldn't hurt around sequence
          // expressions in the head of for loops, traditional style
          // dictates that e.g. i++, j++ should not be wrapped with
          // parentheses.
          return false;

        case "ExpressionStatement":
          return name !== "expression";

        case "ArrowFunctionExpression":
          // We do need parentheses, but SequenceExpressions are handled
          // specially when printing bodies of arrow functions.
          return name !== "body";

        default:
          // Otherwise err on the side of overparenthesization, adding
          // explicit exceptions above if this proves overzealous.
          return true;
      }

    case "YieldExpression":
      if (
        parent.type === "UnaryExpression" ||
        parent.type === "AwaitExpression" ||
        parent.type === "TSAsExpression" ||
        parent.type === "TSNonNullExpression"
      ) {
        return true;
      }
    // else fallthrough
    case "AwaitExpression":
      switch (parent.type) {
        case "TaggedTemplateExpression":
        case "UnaryExpression":
        case "BinaryExpression":
        case "LogicalExpression":
        case "SpreadElement":
        case "SpreadProperty":
        case "ExperimentalSpreadProperty":
        case "TSAsExpression":
        case "TSNonNullExpression":
          return true;

        case "MemberExpression":
          return parent.object === node;

        case "NewExpression":
        case "CallExpression":
          return parent.callee === node;

        case "ConditionalExpression":
          return parent.test === node;

        default:
          return false;
      }

    case "ArrayTypeAnnotation":
      return parent.type === "NullableTypeAnnotation";

    case "IntersectionTypeAnnotation":
    case "UnionTypeAnnotation":
      return (
        parent.type === "ArrayTypeAnnotation" ||
        parent.type === "NullableTypeAnnotation" ||
        parent.type === "IntersectionTypeAnnotation" ||
        parent.type === "UnionTypeAnnotation"
      );

    case "NullableTypeAnnotation":
      return parent.type === "ArrayTypeAnnotation";

    case "FunctionTypeAnnotation":
      return (
        parent.type === "UnionTypeAnnotation" ||
        parent.type === "IntersectionTypeAnnotation" ||
        parent.type === "ArrayTypeAnnotation"
      );

    case "StringLiteral":
    case "NumericLiteral":
    case "Literal":
      if (
        typeof node.value === "string" &&
        parent.type === "ExpressionStatement" &&
        // TypeScript workaround for eslint/typescript-eslint-parser#267
        // See corresponding workaround in printer.js case: "Literal"
        ((options.parser !== "typescript" && !parent.directive) ||
          (options.parser === "typescript" &&
            options.originalText.substr(options.locStart(node) - 1, 1) === "("))
      ) {
        // To avoid becoming a directive
        const grandParent = path$$1.getParentNode(1);

        return (
          grandParent.type === "Program" ||
          grandParent.type === "BlockStatement"
        );
      }

      return (
        parent.type === "MemberExpression" &&
        typeof node.value === "number" &&
        name === "object" &&
        parent.object === node
      );

    case "AssignmentExpression": {
      const grandParent = path$$1.getParentNode(1);

      if (parent.type === "ArrowFunctionExpression" && parent.body === node) {
        return true;
      } else if (
        parent.type === "ClassProperty" &&
        parent.key === node &&
        parent.computed
      ) {
        return false;
      } else if (
        parent.type === "TSPropertySignature" &&
        parent.name === node
      ) {
        return false;
      } else if (
        parent.type === "ForStatement" &&
        (parent.init === node || parent.update === node)
      ) {
        return false;
      } else if (parent.type === "ExpressionStatement") {
        return node.left.type === "ObjectPattern";
      } else if (parent.type === "TSPropertySignature" && parent.key === node) {
        return false;
      } else if (parent.type === "AssignmentExpression") {
        return false;
      } else if (
        parent.type === "SequenceExpression" &&
        grandParent &&
        grandParent.type === "ForStatement" &&
        (grandParent.init === parent || grandParent.update === parent)
      ) {
        return false;
      }
      return true;
    }
    case "ConditionalExpression":
      switch (parent.type) {
        case "TaggedTemplateExpression":
        case "UnaryExpression":
        case "SpreadElement":
        case "SpreadProperty":
        case "ExperimentalSpreadProperty":
        case "BinaryExpression":
        case "LogicalExpression":
        case "ExportDefaultDeclaration":
        case "AwaitExpression":
        case "JSXSpreadAttribute":
        case "TSTypeAssertionExpression":
        case "TypeCastExpression":
        case "TSAsExpression":
        case "TSNonNullExpression":
          return true;

        case "NewExpression":
        case "CallExpression":
          return name === "callee" && parent.callee === node;

        case "ConditionalExpression":
          return name === "test" && parent.test === node;

        case "MemberExpression":
          return name === "object" && parent.object === node;

        default:
          return false;
      }

    case "FunctionExpression":
      switch (parent.type) {
        case "CallExpression":
          return name === "callee"; // Not strictly necessary, but it's clearer to the reader if IIFEs are wrapped in parentheses.
        case "TaggedTemplateExpression":
          return true; // This is basically a kind of IIFE.
        case "ExportDefaultDeclaration":
          return true;
        default:
          return false;
      }

    case "ArrowFunctionExpression":
      switch (parent.type) {
        case "CallExpression":
          return name === "callee";

        case "NewExpression":
          return name === "callee";

        case "MemberExpression":
          return name === "object";

        case "TSAsExpression":
        case "BindExpression":
        case "TaggedTemplateExpression":
        case "UnaryExpression":
        case "LogicalExpression":
        case "BinaryExpression":
        case "AwaitExpression":
        case "TSTypeAssertionExpression":
          return true;

        case "ConditionalExpression":
          return name === "test";

        default:
          return false;
      }

    case "ClassExpression":
      return parent.type === "ExportDefaultDeclaration";
  }

  return false;
}

function isStatement(node) {
  return (
    node.type === "BlockStatement" ||
    node.type === "BreakStatement" ||
    node.type === "ClassBody" ||
    node.type === "ClassDeclaration" ||
    node.type === "ClassMethod" ||
    node.type === "ClassProperty" ||
    node.type === "ClassPrivateProperty" ||
    node.type === "ContinueStatement" ||
    node.type === "DebuggerStatement" ||
    node.type === "DeclareClass" ||
    node.type === "DeclareExportAllDeclaration" ||
    node.type === "DeclareExportDeclaration" ||
    node.type === "DeclareFunction" ||
    node.type === "DeclareInterface" ||
    node.type === "DeclareModule" ||
    node.type === "DeclareModuleExports" ||
    node.type === "DeclareVariable" ||
    node.type === "DoWhileStatement" ||
    node.type === "ExportAllDeclaration" ||
    node.type === "ExportDefaultDeclaration" ||
    node.type === "ExportNamedDeclaration" ||
    node.type === "ExpressionStatement" ||
    node.type === "ForAwaitStatement" ||
    node.type === "ForInStatement" ||
    node.type === "ForOfStatement" ||
    node.type === "ForStatement" ||
    node.type === "FunctionDeclaration" ||
    node.type === "IfStatement" ||
    node.type === "ImportDeclaration" ||
    node.type === "InterfaceDeclaration" ||
    node.type === "LabeledStatement" ||
    node.type === "MethodDefinition" ||
    node.type === "ReturnStatement" ||
    node.type === "SwitchStatement" ||
    node.type === "ThrowStatement" ||
    node.type === "TryStatement" ||
    node.type === "TSAbstractClassDeclaration" ||
    node.type === "TSEnumDeclaration" ||
    node.type === "TSImportEqualsDeclaration" ||
    node.type === "TSInterfaceDeclaration" ||
    node.type === "TSModuleDeclaration" ||
    node.type === "TSNamespaceExportDeclaration" ||
    node.type === "TypeAlias" ||
    node.type === "VariableDeclaration" ||
    node.type === "WhileStatement" ||
    node.type === "WithStatement"
  );
}

var needsParens_1 = needsParens;

// TODO(azz): anything that imports from main shouldn't be in a `language-*` dir.



const isIdentifierName = utils$2.keyword.isIdentifierNameES6;


const insertPragma = pragma.insertPragma;




const docBuilders = doc.builders;
const concat = docBuilders.concat;
const join = docBuilders.join;
const line$2 = docBuilders.line;
const hardline = docBuilders.hardline;
const softline = docBuilders.softline;
const singleLine = docBuilders.singleLine;
const singleSoftLine = docBuilders.singleSoftLine;
const singleHardLine = docBuilders.singleHardLine;
const literalline = docBuilders.literalline;
const group = docBuilders.group;
const indent = docBuilders.indent;
const align = docBuilders.align;
const conditionalGroup = docBuilders.conditionalGroup;
const fill = docBuilders.fill;
const ifBreak = docBuilders.ifBreak;
const breakParent = docBuilders.breakParent;
const lineSuffixBoundary = docBuilders.lineSuffixBoundary;
const addAlignmentToDoc = docBuilders.addAlignmentToDoc;
const dedent$1 = docBuilders.dedent;
const printDocToString$1 = doc.printer.printDocToString;

const docUtils = doc.utils;
const willBreak = docUtils.willBreak;
const isLineNext = docUtils.isLineNext;
const isEmpty = docUtils.isEmpty;

function lineComma(options) {
  return !options.lenient ? "," : ifBreak("", ",");
}

function openBrace(options, force) {
  return !options.lenient || force ? "{" : "";
}

function closeBrace(options, force) {
  return !options.lenient || force ? concat([hardline, "}"]) : singleHardLine;
}

function closeSoftBrace(options, rightBrace) {
  return concat([
    !options.lenient
      ? options.bracketSpacing ? line$2 : softline
      : singleSoftLine,
    rightBrace
  ]);
}

function openParen(options, body) {
  return shouldPrintParens(options, body) ? " (" : " ";
}

function closeParen(options, body) {
  return shouldPrintParens(options, body) ? ")" : "";
}

function blockArgument(options, body, argument) {
  const usesParens = shouldPrintParens(options, body);
  const newLine = usesParens ? softline : "";
  const indented = indent(concat([newLine, argument]));
  return concat([
    openParen(options, body),
    group(concat([usesParens ? indented : indent(indented), newLine])),
    closeParen(options, body)
  ]);
}

function spaceAfterBreak(stmt, options) {
  return !options.lenient
    ? " "
    : stmt && stmt.body && stmt.body.length === 0 ? singleHardLine : "";
}

function shouldPrintParens(options, body) {
  return (
    !options.lenient ||
    (body !== false &&
      (body === true ||
        (body.type !== "BlockStatement" || hasLeadingComment(body))))
  );
}

function fullLenient(options) {
  return options.lenient && !options.lenientCompat;
}

function shouldPrintComma(options, level) {
  level = level || "es5";

  switch (options.trailingComma) {
    case "all":
      if (level === "all") {
        return true;
      }
    // fallthrough
    case "es5":
      if (level === "es5") {
        return true;
      }
    // fallthrough
    case "none":
    default:
      return false;
  }
}

function genericPrint(path$$1, options, printPath, args) {
  const node = path$$1.getValue();
  let needsParens = false;
  const linesWithoutParens = printPathNoParens(path$$1, options, printPath, args);

  if (!node || isEmpty(linesWithoutParens)) {
    return linesWithoutParens;
  }

  const decorators = [];
  if (
    node.decorators &&
    node.decorators.length > 0 &&
    // If the parent node is an export declaration, it will be
    // responsible for printing node.decorators.
    !util$1.getParentExportDeclaration(path$$1)
  ) {
    let separator = hardline;
    path$$1.each(decoratorPath => {
      let prefix = "@";
      let decorator = decoratorPath.getValue();
      if (decorator.expression) {
        decorator = decorator.expression;
        prefix = "";
      }

      if (
        node.decorators.length === 1 &&
        node.type !== "ClassDeclaration" &&
        node.type !== "MethodDefinition" &&
        node.type !== "ClassMethod" &&
        (decorator.type === "Identifier" ||
          decorator.type === "MemberExpression" ||
          decorator.type === "OptionalMemberExpression" ||
          (decorator.type === "CallExpression" &&
            decorator.type === "OptionalCallExpression" &&
            (decorator.arguments.length === 0 ||
              (decorator.arguments.length === 1 &&
                (isStringLiteral(decorator.arguments[0]) ||
                  decorator.arguments[0].type === "Identifier" ||
                  decorator.arguments[0].type === "MemberExpression" ||
                  decorator.arguments[0].type ===
                    "OptionalMemberExpression")))))
      ) {
        separator = line$2;
      }

      decorators.push(prefix, printPath(decoratorPath), separator);
    }, "decorators");
  } else if (
    util$1.isExportDeclaration(node) &&
    node.declaration &&
    node.declaration.decorators
  ) {
    // Export declarations are responsible for printing any decorators
    // that logically apply to node.declaration.
    path$$1.each(
      decoratorPath => {
        const decorator = decoratorPath.getValue();
        const prefix = decorator.type === "Decorator" ? "" : "@";
        decorators.push(prefix, printPath(decoratorPath), hardline);
      },
      "declaration",
      "decorators"
    );
  } else {
    // Nodes with decorators can't have parentheses, so we can avoid
    // computing pathNeedsParens() except in this case.
    needsParens = needsParens_1(path$$1, options);
  }

  const parts = [];
  if (needsParens) {
    parts.unshift("(");
  }

  parts.push(linesWithoutParens);

  if (needsParens) {
    parts.push(")");
  }

  if (decorators.length > 0) {
    return group(concat(decorators.concat(parts)));
  }
  return concat(parts);
}

function hasPrettierIgnore(path$$1) {
  return util$1.hasIgnoreComment(path$$1) || hasJsxIgnoreComment(path$$1);
}

function hasJsxIgnoreComment(path$$1) {
  const node = path$$1.getValue();
  const parent = path$$1.getParentNode();
  if (!parent || !node || !isJSXNode(node) || !isJSXNode(parent)) {
    return false;
  }

  // Lookup the previous sibling, ignoring any empty JSXText elements
  const index = parent.children.indexOf(node);
  let prevSibling = null;
  for (let i = index; i > 0; i--) {
    const candidate = parent.children[i - 1];
    if (candidate.type === "JSXText" && !isMeaningfulJSXText(candidate)) {
      continue;
    }
    prevSibling = candidate;
    break;
  }

  return (
    prevSibling &&
    prevSibling.type === "JSXExpressionContainer" &&
    prevSibling.expression.type === "JSXEmptyExpression" &&
    prevSibling.expression.comments &&
    prevSibling.expression.comments.find(
      comment => comment.value.trim() === "prettier-ignore"
    )
  );
}

// The following is the shared logic for
// ternary operators, namely ConditionalExpression
// and TSConditionalType
function formatTernaryOperator(path$$1, options, print, operatorOptions) {
  const n = path$$1.getValue();
  const parts = [];
  const operatorOpts = Object.assign(
    {
      beforeParts: () => [""],
      afterParts: () => [""],
      shouldCheckJsx: true,
      operatorName: "ConditionalExpression",
      consequentNode: "consequent",
      alternateNode: "alternate",
      testNode: "test",
      breakNested: true
    },
    operatorOptions || {}
  );

  // We print a ConditionalExpression in either "JSX mode" or "normal mode".
  // See tests/jsx/conditional-expression.js for more info.
  let jsxMode = false;
  const parent = path$$1.getParentNode();
  let forceNoIndent = parent.type === operatorOpts.operatorName;

  // Find the outermost non-ConditionalExpression parent, and the outermost
  // ConditionalExpression parent. We'll use these to determine if we should
  // print in JSX mode.
  let currentParent;
  let previousParent;
  let i = 0;
  do {
    previousParent = currentParent || n;
    currentParent = path$$1.getParentNode(i);
    i++;
  } while (currentParent && currentParent.type === operatorOpts.operatorName);
  const firstNonConditionalParent = currentParent || parent;
  const lastConditionalParent = previousParent;

  if (
    (operatorOpts.shouldCheckJsx && isJSXNode(n[operatorOpts.testNode])) ||
    isJSXNode(n[operatorOpts.consequentNode]) ||
    isJSXNode(n[operatorOpts.alternateNode]) ||
    conditionalExpressionChainContainsJSX(lastConditionalParent)
  ) {
    jsxMode = true;
    forceNoIndent = true;

    // Even though they don't need parens, we wrap (almost) everything in
    // parens when using ?: within JSX, because the parens are analogous to
    // curly braces in an if statement.
    const wrap = doc$$1 =>
      concat([
        ifBreak("(", ""),
        indent(concat([softline, doc$$1])),
        softline,
        ifBreak(")", "")
      ]);

    // The only things we don't wrap are:
    // * Nested conditional expressions in alternates
    // * null
    const isNull = node =>
      node.type === "NullLiteral" ||
      (node.type === "Literal" && node.value === null);

    parts.push(
      " ? ",
      isNull(n[operatorOpts.consequentNode])
        ? path$$1.call(print, operatorOpts.consequentNode)
        : wrap(path$$1.call(print, operatorOpts.consequentNode)),
      " : ",
      n[operatorOpts.alternateNode].type === operatorOpts.operatorName ||
      isNull(n[operatorOpts.alternateNode])
        ? path$$1.call(print, operatorOpts.alternateNode)
        : wrap(path$$1.call(print, operatorOpts.alternateNode))
    );
  } else {
    // normal mode
    const part = concat([
      line$2,
      "? ",
      n[operatorOpts.consequentNode].type === operatorOpts.operatorName
        ? ifBreak("", "(")
        : "",
      align(2, path$$1.call(print, operatorOpts.consequentNode)),
      n[operatorOpts.consequentNode].type === operatorOpts.operatorName
        ? ifBreak("", ")")
        : "",
      line$2,
      ": ",
      align(2, path$$1.call(print, operatorOpts.alternateNode))
    ]);
    parts.push(
      parent.type === operatorOpts.operatorName
        ? options.useTabs
          ? dedent$1(indent(part))
          : align(Math.max(0, options.tabWidth - 2), part)
        : part
    );
  }

  // We want a whole chain of ConditionalExpressions to all
  // break if any of them break. That means we should only group around the
  // outer-most ConditionalExpression.
  const maybeGroup = doc$$1 =>
    operatorOpts.breakNested
      ? parent === firstNonConditionalParent ? group(doc$$1) : doc$$1
      : group(doc$$1); // Always group in normal mode.

  // Break the closing paren to keep the chain right after it:
  // (a
  //   ? b
  //   : c
  // ).call()
  const breakClosingParen =
    !jsxMode &&
    (parent.type === "MemberExpression" ||
      parent.type === "OptionalMemberExpression") &&
    !parent.computed;

  return maybeGroup(
    concat(
      [].concat(
        operatorOpts.beforeParts(),
        forceNoIndent ? concat(parts) : indent(concat(parts)),
        operatorOpts.afterParts(breakClosingParen)
      )
    )
  );
}

function getTypeScriptMappedTypeModifier(tokenNode, keyword) {
  if (tokenNode.type === "TSPlusToken") {
    return "+" + keyword;
  } else if (tokenNode.type === "TSMinusToken") {
    return "-" + keyword;
  }
  return keyword;
}

function printPathNoParens(path$$1, options, print, args) {
  const n = path$$1.getValue();
  const semi = options.semi ? ";" : "";

  if (!n) {
    return "";
  }

  if (typeof n === "string") {
    return n;
  }

  let parts = [];
  switch (n.type) {
    case "File":
      return path$$1.call(print, "program");
    case "Program":
      // Babel 6
      if (n.directives) {
        path$$1.each(childPath => {
          parts.push(print(childPath), semi, hardline);
          if (
            utilShared.isNextLineEmpty(
              options.originalText,
              childPath.getValue(),
              options
            )
          ) {
            parts.push(hardline);
          }
        }, "directives");
      }

      parts.push(
        path$$1.call(bodyPath => {
          return printStatementSequence(bodyPath, options, print);
        }, "body")
      );

      parts.push(
        comments.printDanglingComments(path$$1, options, /* sameIndent */ true)
      );

      // Only force a trailing newline if there were any contents.
      if (n.body.length || n.comments) {
        parts.push(hardline);
      }

      return concat(parts);
    // Babel extension.
    case "EmptyStatement":
      return "";
    case "ExpressionStatement":
      // Detect Flow-parsed directives
      if (n.directive) {
        return concat([nodeStr(n.expression, options, true), semi]);
      }
      // Do not append semicolon after the only JSX element in a program
      return concat([
        path$$1.call(print, "expression"),
        isTheOnlyJSXElementInMarkdown(options, path$$1) ? "" : semi
      ]); // Babel extension.
    case "ParenthesizedExpression":
      return concat(["(", path$$1.call(print, "expression"), ")"]);
    case "AssignmentExpression":
      return printAssignment(
        n.left,
        path$$1.call(print, "left"),
        concat([" ", printAssignmentOperator(n.operator, options)]),
        n.right,
        path$$1.call(print, "right"),
        options
      );
    case "BinaryExpression":
    case "LogicalExpression": {
      const parent = path$$1.getParentNode();
      const parentParent = path$$1.getParentNode(1);
      const isInsideParenthesis =
        n !== parent.body &&
        (parent.type === "IfStatement" ||
          parent.type === "WhileStatement" ||
          parent.type === "DoWhileStatement");

      const parts = printBinaryishExpressions(
        path$$1,
        print,
        options,
        /* isNested */ false,
        isInsideParenthesis
      );

      //   if (
      //     this.hasPlugin("dynamicImports") && this.lookahead().type === tt.parenLeft
      //   ) {
      //
      // looks super weird, we want to break the children if the parent breaks
      //
      //   if (
      //     this.hasPlugin("dynamicImports") &&
      //     this.lookahead().type === tt.parenLeft
      //   ) {
      if (isInsideParenthesis) {
        return concat(parts);
      }

      // Break between the parens in unaries or in a member expression, i.e.
      //
      //   (
      //     a &&
      //     b &&
      //     c
      //   ).call()
      if (
        parent.type === "UnaryExpression" ||
        ((parent.type === "MemberExpression" ||
          parent.type === "OptionalMemberExpression") &&
          !parent.computed)
      ) {
        return group(
          concat([indent(concat([softline, concat(parts)])), softline])
        );
      }

      // Avoid indenting sub-expressions in some cases where the first sub-expression is already
      // indented accordingly. We should indent sub-expressions where the first case isn't indented.
      const shouldNotIndent =
        parent.type === "ReturnStatement" ||
        (parent.type === "JSXExpressionContainer" &&
          parentParent.type === "JSXAttribute") ||
        (n === parent.body && parent.type === "ArrowFunctionExpression") ||
        (n !== parent.body && parent.type === "ForStatement") ||
        (parent.type === "ConditionalExpression" &&
          parentParent.type !== "ReturnStatement");

      const shouldIndentIfInlining =
        parent.type === "AssignmentExpression" ||
        parent.type === "VariableDeclarator" ||
        parent.type === "ClassProperty" ||
        parent.type === "TSAbstractClassProperty" ||
        parent.type === "ClassPrivateProperty" ||
        parent.type === "ObjectProperty" ||
        parent.type === "Property";

      const samePrecedenceSubExpression =
        isBinaryish(n.left) &&
        util$1.shouldFlatten(n.operator, n.left.operator);

      if (
        shouldNotIndent ||
        (shouldInlineLogicalExpression(n) && !samePrecedenceSubExpression) ||
        (!shouldInlineLogicalExpression(n) && shouldIndentIfInlining)
      ) {
        return group(concat(parts));
      }

      const rest = concat(parts.slice(1));

      return group(
        concat([
          // Don't include the initial expression in the indentation
          // level. The first item is guaranteed to be the first
          // left-most expression.
          parts.length > 0 ? parts[0] : "",
          indent(rest)
        ])
      );
    }
    case "AssignmentPattern":
      return concat([
        path$$1.call(print, "left"),
        options.lenient ? " := " : " = ",
        path$$1.call(print, "right")
      ]);
    case "TSTypeAssertionExpression": {
      const shouldBreakAfterCast = !(
        n.expression.type === "ArrayExpression" ||
        n.expression.type === "ObjectExpression"
      );

      const castGroup = group(
        concat([
          "<",
          indent(concat([softline, path$$1.call(print, "typeAnnotation")])),
          softline,
          ">"
        ])
      );

      const exprContents = concat([
        ifBreak("("),
        indent(concat([softline, path$$1.call(print, "expression")])),
        softline,
        ifBreak(")")
      ]);

      if (shouldBreakAfterCast) {
        return conditionalGroup([
          concat([castGroup, path$$1.call(print, "expression")]),
          concat([castGroup, group(exprContents, { shouldBreak: true })]),
          concat([castGroup, path$$1.call(print, "expression")])
        ]);
      }
      return group(concat([castGroup, path$$1.call(print, "expression")]));
    }
    case "OptionalMemberExpression":
    case "MemberExpression": {
      const parent = path$$1.getParentNode();
      let firstNonMemberParent;
      let i = 0;
      do {
        firstNonMemberParent = path$$1.getParentNode(i);
        i++;
      } while (
        firstNonMemberParent &&
        (firstNonMemberParent.type === "MemberExpression" ||
          firstNonMemberParent.type === "OptionalMemberExpression" ||
          firstNonMemberParent.type === "TSNonNullExpression")
      );

      const shouldInline =
        (firstNonMemberParent &&
          (firstNonMemberParent.type === "NewExpression" ||
            firstNonMemberParent.type === "BindExpression" ||
            (firstNonMemberParent.type === "VariableDeclarator" &&
              firstNonMemberParent.id.type !== "Identifier") ||
            (firstNonMemberParent.type === "AssignmentExpression" &&
              firstNonMemberParent.left.type !== "Identifier"))) ||
        n.computed ||
        (n.object.type === "Identifier" &&
          n.property.type === "Identifier" &&
          parent.type !== "MemberExpression" &&
          parent.type !== "OptionalMemberExpression");

      return concat([
        path$$1.call(print, "object"),
        shouldInline
          ? printMemberLookup(path$$1, options, print)
          : group(
              indent(
                concat([softline, printMemberLookup(path$$1, options, print)])
              )
            )
      ]);
    }
    case "MetaProperty":
      return concat([
        path$$1.call(print, "meta"),
        ".",
        path$$1.call(print, "property")
      ]);
    case "BindExpression":
      if (n.object) {
        parts.push(path$$1.call(print, "object"));
      }

      parts.push(
        group(
          indent(
            concat([softline, printBindExpressionCallee(path$$1, options, print)])
          )
        )
      );

      return concat(parts);
    case "Identifier": {
      return concat([
        n.name,
        printOptionalToken(path$$1),
        printTypeAnnotation(path$$1, options, print)
      ]);
    }
    case "SpreadElement":
    case "SpreadElementPattern":
    case "RestProperty":
    case "ExperimentalRestProperty":
    case "ExperimentalSpreadProperty":
    case "SpreadProperty":
    case "SpreadPropertyPattern":
    case "RestElement":
    case "ObjectTypeSpreadProperty":
      return concat([
        "...",
        path$$1.call(print, "argument"),
        printTypeAnnotation(path$$1, options, print)
      ]);
    case "FunctionDeclaration":
    case "FunctionExpression":
      if (isNodeStartingWithDeclare(n, options)) {
        parts.push("declare ");
      }
      parts.push(printFunctionDeclaration(path$$1, print, options));
      if (!n.body) {
        parts.push(semi);
      }
      return concat(parts);
    case "ArrowFunctionExpression": {
      if (n.async) {
        parts.push("async ");
      }

      if (shouldPrintParamsWithoutParens(path$$1, options)) {
        parts.push(path$$1.call(print, "params", 0));
      } else {
        parts.push(
          group(
            concat([
              printFunctionParams(
                path$$1,
                print,
                options,
                /* expandLast */ args &&
                  (args.expandLastArg || args.expandFirstArg),
                /* printTypeParams */ true
              ),
              printReturnType(path$$1, print, options)
            ])
          )
        );
      }

      const dangling = comments.printDanglingComments(
        path$$1,
        options,
        /* sameIndent */ true,
        comment => {
          const nextCharacter = utilShared.getNextNonSpaceNonCommentCharacterIndex(
            options.originalText,
            comment,
            options
          );
          return options.originalText.substr(nextCharacter, 2) === "=>";
        }
      );
      if (dangling) {
        parts.push(" ", dangling);
      }

      parts.push(" =>");

      const body = path$$1.call(bodyPath => print(bodyPath, args), "body");

      // We want to always keep these types of nodes on the same line
      // as the arrow.
      if (
        !hasLeadingOwnLineComment(options.originalText, n.body, options) &&
        (n.body.type === "ArrayExpression" ||
          n.body.type === "ObjectExpression" ||
          n.body.type === "BlockStatement" ||
          isJSXNode(n.body) ||
          isTemplateOnItsOwnLine(n.body, options.originalText, options) ||
          n.body.type === "ArrowFunctionExpression")
      ) {
        return group(concat([concat(parts), " ", body]));
      }

      // We handle sequence expressions as the body of arrows specially,
      // so that the required parentheses end up on their own lines.
      if (n.body.type === "SequenceExpression") {
        return group(
          concat([
            concat(parts),
            group(
              concat([" (", indent(concat([softline, body])), softline, ")"])
            )
          ])
        );
      }

      // if the arrow function is expanded as last argument, we are adding a
      // level of indentation and need to add a softline to align the closing )
      // with the opening (, or if it's inside a JSXExpression (e.g. an attribute)
      // we should align the expression's closing } with the line with the opening {.
      const shouldAddSoftLine =
        ((args && args.expandLastArg) ||
          path$$1.getParentNode().type === "JSXExpressionContainer") &&
        !(n.comments && n.comments.length);

      const printTrailingComma =
        args && args.expandLastArg && shouldPrintComma(options, "all");

      // In order to avoid confusion between
      // a => a ? a : a
      // a <= a ? a : a
      const shouldAddParens =
        !options.lenient &&
        n.body.type === "ConditionalExpression" &&
        !util$1.startsWithNoLookaheadToken(
          n.body,
          /* forbidFunctionAndClass */ false
        );

      return group(
        concat([
          concat(parts),
          group(
            concat([
              indent(
                concat([
                  line$2,
                  shouldAddParens ? ifBreak("", "(") : "",
                  body,
                  shouldAddParens ? ifBreak("", ")") : ""
                ])
              ),
              shouldAddSoftLine
                ? concat([
                    ifBreak(printTrailingComma ? lineComma(options) : ""),
                    softline
                  ])
                : ""
            ])
          )
        ])
      );
    }
    case "MethodDefinition":
    case "TSAbstractMethodDefinition":
      if (n.accessibility) {
        parts.push(n.accessibility + " ");
      }
      if (n.static) {
        parts.push("static ");
      }
      if (n.type === "TSAbstractMethodDefinition") {
        parts.push("abstract ");
      }

      parts.push(printMethod(path$$1, options, print));

      return concat(parts);
    case "YieldExpression":
      parts.push("yield");

      if (n.delegate) {
        parts.push("*");
      }
      if (n.argument) {
        parts.push(" ", path$$1.call(print, "argument"));
      }

      return concat(parts);
    case "AwaitExpression":
      return concat(["await ", path$$1.call(print, "argument")]);
    case "ImportSpecifier":
      if (n.importKind) {
        parts.push(path$$1.call(print, "importKind"), " ");
      }

      parts.push(path$$1.call(print, "imported"));

      if (n.local && n.local.name !== n.imported.name) {
        parts.push(" as ", path$$1.call(print, "local"));
      }

      return concat(parts);
    case "ExportSpecifier":
      parts.push(path$$1.call(print, "local"));

      if (n.exported && n.exported.name !== n.local.name) {
        parts.push(" as ", path$$1.call(print, "exported"));
      }

      return concat(parts);
    case "ImportNamespaceSpecifier":
      parts.push("* as ");

      if (n.local) {
        parts.push(path$$1.call(print, "local"));
      } else if (n.id) {
        parts.push(path$$1.call(print, "id"));
      }

      return concat(parts);
    case "ImportDefaultSpecifier":
      if (n.local) {
        return path$$1.call(print, "local");
      }

      return path$$1.call(print, "id");
    case "TSExportAssignment":
      return concat(["export = ", path$$1.call(print, "expression"), semi]);
    case "ExportDefaultDeclaration":
    case "ExportNamedDeclaration":
      return printExportDeclaration(path$$1, options, print);
    case "ExportAllDeclaration":
      parts.push("export ");

      if (n.exportKind === "type") {
        parts.push("type ");
      }

      parts.push("* from ", path$$1.call(print, "source"), semi);

      return concat(parts);

    case "ExportNamespaceSpecifier":
    case "ExportDefaultSpecifier":
      return path$$1.call(print, "exported");
    case "ImportDeclaration": {
      parts.push("import ");

      if (n.importKind && n.importKind !== "value") {
        parts.push(n.importKind + " ");
      }

      const standalones = [];
      const grouped = [];
      if (n.specifiers && n.specifiers.length > 0) {
        path$$1.each(specifierPath => {
          const value = specifierPath.getValue();
          if (
            value.type === "ImportDefaultSpecifier" ||
            value.type === "ImportNamespaceSpecifier"
          ) {
            standalones.push(print(specifierPath));
          } else {
            grouped.push(print(specifierPath));
          }
        }, "specifiers");

        if (standalones.length > 0) {
          parts.push(join(", ", standalones));
        }

        if (standalones.length > 0 && grouped.length > 0) {
          parts.push(", ");
        }

        if (
          grouped.length === 1 &&
          standalones.length === 0 &&
          n.specifiers &&
          !n.specifiers.some(node => node.comments)
        ) {
          parts.push(
            concat([
              "{",
              options.bracketSpacing ? " " : "",
              concat(grouped),
              options.bracketSpacing ? " " : "",
              "}"
            ])
          );
        } else if (grouped.length >= 1) {
          parts.push(
            group(
              concat([
                "{",
                indent(
                  concat([
                    options.bracketSpacing ? line$2 : softline,
                    join(concat([lineComma(options), line$2]), grouped)
                  ])
                ),
                ifBreak(shouldPrintComma(options) ? lineComma(options) : ""),
                options.bracketSpacing ? line$2 : softline,
                "}"
              ])
            )
          );
        }

        parts.push(" from ");
      } else if (
        (n.importKind && n.importKind === "type") ||
        // import {} from 'x'
        /{\s*}/.test(
          options.originalText.slice(
            options.locStart(n),
            options.locStart(n.source)
          )
        )
      ) {
        parts.push("{} from ");
      }

      parts.push(path$$1.call(print, "source"), semi);

      return concat(parts);
    }

    case "Import":
      return "import";
    case "BlockStatement": {
      const naked = path$$1.call(bodyPath => {
        return printStatementSequence(bodyPath, options, print);
      }, "body");

      const hasContent = n.body.find(node => node.type !== "EmptyStatement");
      const hasDirectives = n.directives && n.directives.length > 0;

      const parent = path$$1.getParentNode();
      const parentParent = path$$1.getParentNode(1);
      if (
        !hasContent &&
        !hasDirectives &&
        !hasDanglingComments(n) &&
        (parent.type === "ArrowFunctionExpression" ||
          parent.type === "FunctionExpression" ||
          parent.type === "FunctionDeclaration" ||
          parent.type === "ObjectMethod" ||
          parent.type === "ClassMethod" ||
          parent.type === "ForStatement" ||
          parent.type === "WhileStatement" ||
          parent.type === "DoWhileStatement" ||
          (parent.type === "CatchClause" && !parentParent.finalizer) ||
          (options.lenient &&
            (parent.type === "TryStatement" ||
              parent.type === "CatchClause" ||
              parent.type === "IfStatement" ||
              parent.type === "ForInStatement" ||
              parent.type === "ForOfStatement" ||
              parent.type === "DeclareModule")))
      ) {
        if (fullLenient(options) && parent.type === "ArrowFunctionExpression") {
          return "{;}";
        }
        return "{}";
      }

      const needsBraces =
        !options.lenient ||
        (parent.type === "Program" ||
          parent.type === "BlockStatement" ||
          parent.type === "SwitchCase");
      parts.push(openBrace(options, needsBraces));

      // Babel 6
      if (hasDirectives) {
        path$$1.each(childPath => {
          parts.push(indent(concat([hardline, print(childPath), semi])));
          if (
            utilShared.isNextLineEmpty(
              options.originalText,
              childPath.getValue(),
              options
            )
          ) {
            parts.push(hardline);
          }
        }, "directives");
      }

      if (hasContent) {
        parts.push(indent(concat([hardline, naked])));
      }

      parts.push(comments.printDanglingComments(path$$1, options));
      parts.push(closeBrace(options, needsBraces));

      return concat(parts);
    }
    case "ReturnStatement":
      parts.push("return");

      if (n.argument) {
        if (returnArgumentHasLeadingComment(options, n.argument)) {
          parts.push(
            concat([
              openParen(options, false),
              indent(concat([hardline, path$$1.call(print, "argument")])),
              hardline,
              closeParen(options, false)
            ])
          );
        } else if (
          n.argument.type === "LogicalExpression" ||
          n.argument.type === "BinaryExpression" ||
          n.argument.type === "SequenceExpression"
        ) {
          parts.push(
            group(
              concat([
                ifBreak(openParen(options, false), " "),
                indent(concat([softline, path$$1.call(print, "argument")])),
                softline,
                ifBreak(closeParen(options, false))
              ])
            )
          );
        } else {
          parts.push(" ", path$$1.call(print, "argument"));
        }
      } else if (options.lenient) {
        parts.push(";");
      }

      if (hasDanglingComments(n)) {
        parts.push(
          " ",
          comments.printDanglingComments(path$$1, options, /* sameIndent */ true)
        );
      }

      parts.push(semi);

      return concat(parts);
    case "NewExpression":
    case "OptionalCallExpression":
    case "CallExpression": {
      const isNew = n.type === "NewExpression";

      const optional = printOptionalToken(path$$1);
      if (
        // We want to keep CommonJS- and AMD-style require calls, and AMD-style
        // define calls, as a unit.
        // e.g. `define(["some/lib", (lib) => {`
        (!isNew &&
          n.callee.type === "Identifier" &&
          (n.callee.name === "require" || n.callee.name === "define")) ||
        n.callee.type === "Import" ||
        // Template literals as single arguments
        (n.arguments.length === 1 &&
          isTemplateOnItsOwnLine(
            n.arguments[0],
            options.originalText,
            options
          )) ||
        // Keep test declarations on a single line
        // e.g. `it('long name', () => {`
        (!isNew && isTestCall(n, path$$1.getParentNode()))
      ) {
        return concat([
          isNew ? "new " : "",
          path$$1.call(print, "callee"),
          optional,
          path$$1.call(print, "typeParameters"),
          concat(["(", join(", ", path$$1.map(print, "arguments")), ")"])
        ]);
      }

      // We detect calls on member lookups and possibly print them in a
      // special chain format. See `printMemberChain` for more info.
      if (!isNew && isMemberish(n.callee)) {
        return printMemberChain(path$$1, options, print);
      }

      return concat([
        isNew ? "new " : "",
        path$$1.call(print, "callee"),
        optional,
        printFunctionTypeParameters(path$$1, options, print),
        printArgumentsList(path$$1, options, print)
      ]);
    }
    case "TSInterfaceDeclaration":
      if (isNodeStartingWithDeclare(n, options)) {
        parts.push("declare ");
      }

      parts.push(
        n.abstract ? "abstract " : "",
        printTypeScriptModifiers(path$$1, options, print),
        "interface ",
        path$$1.call(print, "id"),
        n.typeParameters ? path$$1.call(print, "typeParameters") : "",
        " "
      );

      if (n.heritage.length) {
        parts.push(
          group(
            indent(
              concat([
                softline,
                "extends ",
                indent(
                  join(
                    concat([lineComma(options), line$2]),
                    path$$1.map(print, "heritage")
                  )
                ),
                " "
              ])
            )
          )
        );
      }

      parts.push(path$$1.call(print, "body"));

      return concat(parts);
    case "ObjectExpression":
    case "ObjectPattern":
    case "ObjectTypeAnnotation":
    case "TSInterfaceBody":
    case "TSTypeLiteral": {
      const isTypeAnnotation = n.type === "ObjectTypeAnnotation";
      const parent = path$$1.getParentNode(0);
      const shouldBreak =
        n.type === "TSInterfaceBody" ||
        (n.type === "ObjectPattern" &&
          parent.type !== "FunctionDeclaration" &&
          parent.type !== "FunctionExpression" &&
          parent.type !== "ArrowFunctionExpression" &&
          parent.type !== "AssignmentPattern" &&
          parent.type !== "CatchClause" &&
          n.properties.some(
            property =>
              property.value &&
              (property.value.type === "ObjectPattern" ||
                property.value.type === "ArrayPattern")
          )) ||
        (n.type !== "ObjectPattern" &&
          util$1.hasNewlineInRange(
            options.originalText,
            options.locStart(n),
            options.locEnd(n)
          ));
      const isFlowInterfaceLikeBody =
        isTypeAnnotation &&
        parent &&
        (parent.type === "InterfaceDeclaration" ||
          parent.type === "DeclareInterface" ||
          parent.type === "DeclareClass") &&
        path$$1.getName() === "body";
      const separator = isFlowInterfaceLikeBody
        ? ";"
        : n.type === "TSInterfaceBody" || n.type === "TSTypeLiteral"
          ? ifBreak(semi, ";")
          : lineComma(options);
      const fields = [];
      const leftBrace = n.exact ? "{|" : "{";
      const rightBrace = n.exact ? "|}" : "}";

      let propertiesField;

      if (n.type === "TSTypeLiteral") {
        propertiesField = "members";
      } else if (n.type === "TSInterfaceBody") {
        propertiesField = "body";
      } else {
        propertiesField = "properties";
      }

      if (isTypeAnnotation) {
        fields.push("indexers", "callProperties");
      }
      fields.push(propertiesField);

      // Unfortunately, things are grouped together in the ast can be
      // interleaved in the source code. So we need to reorder them before
      // printing them.
      const propsAndLoc = [];
      fields.forEach(field => {
        path$$1.each(childPath => {
          const node = childPath.getValue();
          propsAndLoc.push({
            node: node,
            printed: print(childPath),
            loc: options.locStart(node)
          });
        }, field);
      });

      let separatorParts = [];
      const props = propsAndLoc.sort((a, b) => a.loc - b.loc).map(prop => {
        const result = concat(separatorParts.concat(group(prop.printed)));
        separatorParts = [separator, options.lenient ? singleLine : line$2];
        if (
          prop.node.type === "TSPropertySignature" &&
          util$1.hasNodeIgnoreComment(prop.node)
        ) {
          separatorParts.shift();
        }
        if (
          utilShared.isNextLineEmpty(options.originalText, prop.node, options)
        ) {
          separatorParts.push(hardline);
        }
        return result;
      });

      const lastElem = util$1.getLast(n[propertiesField]);

      const canHaveTrailingSeparator = !(
        lastElem &&
        (lastElem.type === "RestProperty" ||
          lastElem.type === "RestElement" ||
          lastElem.type === "ExperimentalRestProperty" ||
          util$1.hasNodeIgnoreComment(lastElem))
      );

      let content;
      if (props.length === 0 && !n.typeAnnotation) {
        if (!hasDanglingComments(n)) {
          return concat([leftBrace, rightBrace]);
        }

        content = group(
          concat([
            leftBrace,
            comments.printDanglingComments(path$$1, options),
            softline,
            rightBrace,
            printOptionalToken(path$$1)
          ])
        );
      } else {
        content = concat([
          leftBrace,
          indent(
            concat([options.bracketSpacing ? line$2 : softline, concat(props)])
          ),
          ifBreak(
            canHaveTrailingSeparator &&
            (separator !== "," || shouldPrintComma(options))
              ? separator === "," ? lineComma(options) : separator
              : ""
          ),
          closeSoftBrace(options, rightBrace),
          printOptionalToken(path$$1),
          printTypeAnnotation(path$$1, options, print)
        ]);
      }

      // If we inline the object as first argument of the parent, we don't want
      // to create another group so that the object breaks before the return
      // type
      const parentParentParent = path$$1.getParentNode(2);
      if (
        (n.type === "ObjectPattern" &&
          parent &&
          shouldHugArguments(parent) &&
          parent.params[0] === n) ||
        (shouldHugType(n) &&
          parentParentParent &&
          shouldHugArguments(parentParentParent) &&
          parentParentParent.params[0].typeAnnotation &&
          parentParentParent.params[0].typeAnnotation.typeAnnotation === n)
      ) {
        return content;
      }

      return group(content, { shouldBreak });
    }
    // Babel 6
    case "ObjectProperty": // Non-standard AST node type.
    case "Property":
      if (n.method || n.kind === "get" || n.kind === "set") {
        return printMethod(path$$1, options, print);
      }

      if (n.shorthand) {
        parts.push(path$$1.call(print, "value"));
      } else {
        let printedLeft;
        if (n.computed) {
          printedLeft = concat(["[", path$$1.call(print, "key"), "]"]);
        } else {
          printedLeft = printPropertyKey(path$$1, options, print);
        }
        parts.push(
          printAssignment(
            n.key,
            printedLeft,
            ":",
            n.value,
            path$$1.call(print, "value"),
            options
          )
        );
      }

      return concat(parts); // Babel 6
    case "ClassMethod":
      if (n.static) {
        parts.push("static ");
      }

      parts = parts.concat(printObjectMethod(path$$1, options, print));

      return concat(parts); // Babel 6
    case "ObjectMethod":
      return printObjectMethod(path$$1, options, print);
    case "Decorator":
      return concat(["@", path$$1.call(print, "expression")]);
    case "ArrayExpression":
    case "ArrayPattern":
      if (n.elements.length === 0) {
        if (!hasDanglingComments(n)) {
          parts.push("[]");
        } else {
          parts.push(
            group(
              concat([
                "[",
                comments.printDanglingComments(path$$1, options),
                softline,
                "]"
              ])
            )
          );
        }
      } else {
        const lastElem = util$1.getLast(n.elements);
        const canHaveTrailingComma = !(
          lastElem && lastElem.type === "RestElement"
        );

        // JavaScript allows you to have empty elements in an array which
        // changes its length based on the number of commas. The algorithm
        // is that if the last argument is null, we need to force insert
        // a comma to ensure JavaScript recognizes it.
        //   [,].length === 1
        //   [1,].length === 1
        //   [1,,].length === 2
        //
        // Note that privateUtil.getLast returns null if the array is empty, but
        // we already check for an empty array just above so we are safe
        const needsForcedTrailingComma =
          canHaveTrailingComma && lastElem === null;

        parts.push(
          group(
            concat([
              "[",
              indent(
                concat([
                  softline,
                  printArrayItems(path$$1, options, "elements", print)
                ])
              ),
              needsForcedTrailingComma ? "," : "",
              ifBreak(
                canHaveTrailingComma &&
                !needsForcedTrailingComma &&
                shouldPrintComma(options)
                  ? lineComma(options)
                  : ""
              ),
              comments.printDanglingComments(
                path$$1,
                options,
                /* sameIndent */ true
              ),
              softline,
              "]"
            ])
          )
        );
      }

      parts.push(
        printOptionalToken(path$$1),
        printTypeAnnotation(path$$1, options, print)
      );

      return concat(parts);
    case "SequenceExpression": {
      const parent = path$$1.getParentNode(0);
      if (
        parent.type === "ExpressionStatement" ||
        parent.type === "ForStatement"
      ) {
        // For ExpressionStatements and for-loop heads, which are among
        // the few places a SequenceExpression appears unparenthesized, we want
        // to indent expressions after the first.
        const parts = [];
        path$$1.each(p => {
          if (p.getName() === 0) {
            parts.push(print(p));
          } else {
            parts.push(",", indent(concat([line$2, print(p)])));
          }
        }, "expressions");
        return group(concat(parts));
      }
      return group(
        concat([join(concat([",", line$2]), path$$1.map(print, "expressions"))])
      );
    }
    case "ThisExpression":
      return "this";
    case "Super":
      return "super";
    case "NullLiteral": // Babel 6 Literal split
      return "null";
    case "RegExpLiteral": // Babel 6 Literal split
      return printRegex(n);
    case "NumericLiteral": // Babel 6 Literal split
      return util$1.printNumber(n.extra.raw);
    case "BooleanLiteral": // Babel 6 Literal split
    case "StringLiteral": // Babel 6 Literal split
    case "Literal": {
      if (n.regex) {
        return printRegex(n.regex);
      }
      if (typeof n.value === "number") {
        return util$1.printNumber(n.raw);
      }
      if (typeof n.value !== "string") {
        return "" + n.value;
      }
      // TypeScript workaround for eslint/typescript-eslint-parser#267
      // See corresponding workaround in needs-parens.js
      const grandParent = path$$1.getParentNode(1);
      const isTypeScriptDirective =
        options.parser === "typescript" &&
        typeof n.value === "string" &&
        grandParent &&
        (grandParent.type === "Program" ||
          grandParent.type === "BlockStatement");

      return nodeStr(n, options, isTypeScriptDirective);
    }
    case "Directive":
      return path$$1.call(print, "value"); // Babel 6
    case "DirectiveLiteral":
      return nodeStr(n, options);
    case "UnaryExpression":
      parts.push(n.operator);

      if (/[a-z]$/.test(n.operator)) {
        parts.push(" ");
      }

      parts.push(path$$1.call(print, "argument"));

      return concat(parts);
    case "UpdateExpression":
      parts.push(path$$1.call(print, "argument"), n.operator);

      if (n.prefix) {
        parts.reverse();
      }

      return concat(parts);
    case "ConditionalExpression":
      return formatTernaryOperator(path$$1, options, print, {
        beforeParts: () => [path$$1.call(print, "test")],
        afterParts: breakClosingParen => [breakClosingParen ? softline : ""]
      });
    case "VariableDeclaration": {
      const printed = path$$1.map(childPath => {
        return print(childPath);
      }, "declarations");

      // We generally want to terminate all variable declarations with a
      // semicolon, except when they in the () part of for loops.
      const parentNode = path$$1.getParentNode();

      const isParentForLoop =
        parentNode.type === "ForStatement" ||
        parentNode.type === "ForInStatement" ||
        parentNode.type === "ForOfStatement" ||
        parentNode.type === "ForAwaitStatement";

      const hasValue = n.declarations.some(decl => decl.init);

      let firstVariable;
      if (printed.length === 1) {
        firstVariable = printed[0];
      } else if (printed.length > 1) {
        // Indent first var to comply with eslint one-var rule
        firstVariable = indent(printed[0]);
      }

      const isDeclare = isNodeStartingWithDeclare(n, options);
      const declarator = isDeclare
        ? n.kind
        : fullLenient(options) &&
          n.kind === "const" &&
          n.declarations.length === 1 &&
          n.declarations[0].id.type === "Identifier"
          ? ""
          : n.kind;

      parts = [
        isDeclare ? "declare " : "",
        declarator,
        firstVariable ? concat([declarator ? " " : "", firstVariable]) : "",
        indent(
          concat(
            printed
              .slice(1)
              .map(p =>
                concat([",", hasValue && !isParentForLoop ? hardline : line$2, p])
              )
          )
        )
      ];

      if (!(isParentForLoop && parentNode.body !== n)) {
        parts.push(semi);
      }

      return group(concat(parts));
    }
    case "VariableDeclarator":
      const parentNode = path$$1.getParentNode();
      const eqOperator =
        !fullLenient(options) || parentNode.kind === "const" ? " =" : " :=";
      return printAssignment(
        n.id,
        concat([path$$1.call(print, "id"), path$$1.call(print, "typeParameters")]),
        eqOperator,
        n.init,
        n.init && path$$1.call(print, "init"),
        options
      );
    case "WithStatement":
      return group(
        concat([
          "with",
          blockArgument(options, n.body, path$$1.call(print, "object")),
          adjustClause(n.body, path$$1.call(print, "body"), options)
        ])
      );
    case "IfStatement": {
      const con = adjustClause(
        n.consequent,
        path$$1.call(print, "consequent"),
        options
      );
      const opening = group(
        concat([
          "if",
          blockArgument(options, n.consequent, path$$1.call(print, "test")),
          con
        ])
      );

      parts.push(opening);

      if (n.alternate) {
        const commentOnOwnLine =
          (hasTrailingComment(n.consequent) &&
            n.consequent.comments.some(
              comment =>
                comment.trailing && !comments$2.isBlockComment(comment)
            )) ||
          needsHardlineAfterDanglingComment(n);
        const space = spaceAfterBreak(n.consequent, options);
        const elseOnSameLine =
          n.consequent.type === "BlockStatement" && !commentOnOwnLine;
        parts.push(elseOnSameLine ? space : hardline);

        if (hasDanglingComments(n)) {
          parts.push(
            comments.printDanglingComments(path$$1, options, true),
            commentOnOwnLine ? hardline : space
          );
        }

        parts.push(
          "else",
          group(
            adjustClause(
              n.alternate,
              path$$1.call(print, "alternate"),
              options,
              n.alternate.type === "IfStatement"
            )
          )
        );
      }

      return concat(parts);
    }
    case "ForStatement": {
      const body = adjustClause(n.body, path$$1.call(print, "body"), options);

      // We want to keep dangling comments above the loop to stay consistent.
      // Any comment positioned between the for statement and the parentheses
      // is going to be printed before the statement.
      const dangling = comments.printDanglingComments(
        path$$1,
        options,
        /* sameLine */ true
      );
      const printedComments = dangling ? concat([dangling, softline]) : "";
      const shouldUseParens = !n.update ? true : n.body;

      if (!n.init && !n.test && !n.update) {
        return concat([
          printedComments,
          group(
            concat([
              "for",
              openParen(options, shouldUseParens),
              ";;",
              closeParen(options, shouldUseParens),
              body
            ])
          )
        ]);
      }

      return concat([
        printedComments,
        group(
          concat([
            "for",
            blockArgument(
              options,
              shouldUseParens,
              concat([
                path$$1.call(print, "init"),
                ";",
                line$2,
                path$$1.call(print, "test"),
                ";",
                line$2,
                path$$1.call(print, "update")
              ])
            ),
            body
          ])
        )
      ]);
    }
    case "WhileStatement":
      return group(
        concat([
          "while",
          blockArgument(options, n.body, path$$1.call(print, "test")),
          adjustClause(n.body, path$$1.call(print, "body"), options)
        ])
      );
    case "ForInStatement":
      // Note: esprima can't actually parse "for each (".
      return group(
        concat([
          n.each ? "for each (" : "for (",
          fullLenient(options) && n.left.type === "Identifier" ? "set " : "",
          path$$1.call(print, "left"),
          " in ",
          path$$1.call(print, "right"),
          ")",
          adjustClause(n.body, path$$1.call(print, "body"), options)
        ])
      );

    case "ForOfStatement":
    case "ForAwaitStatement": {
      // Babylon 7 removed ForAwaitStatement in favor of ForOfStatement
      // with `"await": true`:
      // https://github.com/estree/estree/pull/138
      const isAwait = n.type === "ForAwaitStatement" || n.await;

      return group(
        concat([
          "for",
          isAwait ? " await" : "",
          openParen(options, n.body),
          fullLenient(options) && n.left.type === "Identifier" ? "set " : "",
          path$$1.call(print, "left"),
          " of ",
          path$$1.call(print, "right"),
          closeParen(options, n.body),
          adjustClause(n.body, path$$1.call(print, "body"), options)
        ])
      );
    }

    case "DoWhileStatement": {
      const clause = adjustClause(n.body, path$$1.call(print, "body"), options);
      const doBody = group(concat(["do", clause]));
      parts = [doBody];

      if (n.body.type === "BlockStatement") {
        parts.push(options.lenient ? "" : " ");
      } else {
        parts.push(hardline);
      }
      parts.push(
        "while",
        blockArgument(options, n.body, path$$1.call(print, "test")),
        semi
      );
      return concat(parts);
    }
    case "DoExpression":
      return concat(["do ", path$$1.call(print, "body")]);
    case "BreakStatement":
      parts.push("break");

      if (n.label) {
        parts.push(" ", path$$1.call(print, "label"));
      }

      parts.push(semi);

      return concat(parts);
    case "ContinueStatement":
      parts.push("continue");

      if (n.label) {
        parts.push(" ", path$$1.call(print, "label"));
      }

      parts.push(semi);

      return concat(parts);
    case "LabeledStatement":
      if (n.body.type === "EmptyStatement") {
        return concat([path$$1.call(print, "label"), ":;"]);
      }

      return concat([
        options.lenient ? ";" : "",
        path$$1.call(print, "label"),
        ": ",
        path$$1.call(print, "body")
      ]);
    case "TryStatement":
      return concat([
        "try ",
        path$$1.call(print, "block"),
        n.handler
          ? concat([
              spaceAfterBreak(n.block, options),
              path$$1.call(print, "handler")
            ])
          : "",
        n.finalizer
          ? concat([
              spaceAfterBreak(
                (n.handler && n.handler.body) || n.block,
                options
              ),
              "finally ",
              path$$1.call(print, "finalizer")
            ])
          : ""
      ]);
    case "CatchClause":
      const shouldUseParens =
        n.param && n.param.type === "ObjectPattern" ? true : n.body;
      return concat([
        "catch",
        n.param
          ? blockArgument(options, shouldUseParens, path$$1.call(print, "param"))
          : "",
        " ",
        path$$1.call(print, "body")
      ]);
    case "ThrowStatement":
      return concat(["throw ", path$$1.call(print, "argument"), semi]);
    // Note: ignoring n.lexical because it has no printing consequences.
    case "SwitchStatement":
      return concat([
        group(
          concat([
            "switch",
            blockArgument(options, false, path$$1.call(print, "discriminant"))
          ])
        ),
        " ",
        openBrace(options),
        n.cases.length > 0
          ? indent(
              concat([
                hardline,
                join(
                  hardline,
                  path$$1.map(casePath => {
                    const caseNode = casePath.getValue();
                    return concat([
                      casePath.call(print),
                      n.cases.indexOf(caseNode) !== n.cases.length - 1 &&
                      utilShared.isNextLineEmpty(
                        options.originalText,
                        caseNode,
                        options
                      )
                        ? hardline
                        : ""
                    ]);
                  }, "cases")
                )
              ])
            )
          : options.lenient ? "{}" : "",
        closeBrace(options)
      ]);
    case "SwitchCase": {
      if (n.test) {
        parts.push("case ", path$$1.call(print, "test"));
      } else {
        parts.push("default");
      }

      const consequent = n.consequent.filter(
        node => !isEmptyStatement(node, n)
      );

      if (
        !options.lenient ||
        (consequent.length > 0 &&
          consequent[0].type === "ExpressionStatement" &&
          (consequent[0].expression.type === "RegExpLiteral" ||
            consequent[0].expression.regex))
      ) {
        parts.push(":");
      }

      if (consequent.length > 0) {
        const cons = path$$1.call(consequentPath => {
          return printStatementSequence(consequentPath, options, print);
        }, "consequent");

        parts.push(
          consequent.length === 1 && consequent[0].type === "BlockStatement"
            ? concat([" ", cons])
            : indent(concat([hardline, cons]))
        );
      }

      return concat(parts);
    }
    // JSX extensions below.
    case "DebuggerStatement":
      return concat(["debugger", semi]);
    case "JSXAttribute":
      parts.push(path$$1.call(print, "name"));

      if (n.value) {
        let res;
        if (isStringLiteral(n.value)) {
          const value = rawText(n.value);
          res = '"' + value.slice(1, -1).replace(/"/g, "&quot;") + '"';
        } else {
          res = path$$1.call(print, "value");
        }
        parts.push("=", res);
      }

      return concat(parts);
    case "JSXIdentifier":
      // Can be removed when this is fixed:
      // https://github.com/eslint/typescript-eslint-parser/issues/337
      if (!n.name) {
        return "this";
      }
      return "" + n.name;
    case "JSXNamespacedName":
      return join(":", [
        path$$1.call(print, "namespace"),
        path$$1.call(print, "name")
      ]);
    case "JSXMemberExpression":
      return join(".", [
        path$$1.call(print, "object"),
        path$$1.call(print, "property")
      ]);
    case "TSQualifiedName":
      return join(".", [path$$1.call(print, "left"), path$$1.call(print, "right")]);
    case "JSXSpreadAttribute":
    case "JSXSpreadChild": {
      return concat([
        "{",
        path$$1.call(p => {
          const printed = concat(["...", print(p)]);
          const n = p.getValue();
          if (!n.comments || !n.comments.length) {
            return printed;
          }
          return concat([
            indent(
              concat([
                softline,
                comments.printComments(p, () => printed, options)
              ])
            ),
            softline
          ]);
        }, n.type === "JSXSpreadAttribute" ? "argument" : "expression"),
        "}"
      ]);
    }
    case "JSXExpressionContainer": {
      const parent = path$$1.getParentNode(0);

      const preventInline =
        parent.type === "JSXAttribute" &&
        n.expression.comments &&
        n.expression.comments.length > 0;

      const shouldInline =
        !preventInline &&
        (n.expression.type === "ArrayExpression" ||
          n.expression.type === "ObjectExpression" ||
          n.expression.type === "ArrowFunctionExpression" ||
          n.expression.type === "CallExpression" ||
          n.expression.type === "OptionalCallExpression" ||
          n.expression.type === "FunctionExpression" ||
          n.expression.type === "JSXEmptyExpression" ||
          n.expression.type === "TemplateLiteral" ||
          n.expression.type === "TaggedTemplateExpression" ||
          n.expression.type === "DoExpression" ||
          (isJSXNode(parent) &&
            (n.expression.type === "ConditionalExpression" ||
              isBinaryish(n.expression))));

      if (shouldInline) {
        return group(
          concat(["{", path$$1.call(print, "expression"), lineSuffixBoundary, "}"])
        );
      }

      return group(
        concat([
          "{",
          indent(concat([softline, path$$1.call(print, "expression")])),
          softline,
          lineSuffixBoundary,
          "}"
        ])
      );
    }
    case "JSXFragment":
    case "TSJsxFragment":
    case "JSXElement": {
      const elem = comments.printComments(
        path$$1,
        () => printJSXElement(path$$1, options, print),
        options
      );
      return maybeWrapJSXElementInParens(path$$1, elem, options);
    }
    case "JSXOpeningElement": {
      const n = path$$1.getValue();

      const nameHasComments =
        n.name && n.name.comments && n.name.comments.length > 0;

      // Don't break self-closing elements with no attributes and no comments
      if (n.selfClosing && !n.attributes.length && !nameHasComments) {
        return concat([
          "<",
          path$$1.call(print, "name"),
          path$$1.call(print, "typeParameters"),
          " />"
        ]);
      }

      // don't break up opening elements with a single long text attribute
      if (
        n.attributes &&
        n.attributes.length === 1 &&
        n.attributes[0].value &&
        isStringLiteral(n.attributes[0].value) &&
        !n.attributes[0].value.value.includes("\n") &&
        // We should break for the following cases:
        // <div
        //   // comment
        //   attr="value"
        // >
        // <div
        //   attr="value"
        //   // comment
        // >
        !nameHasComments &&
        (!n.attributes[0].comments || !n.attributes[0].comments.length)
      ) {
        return group(
          concat([
            "<",
            path$$1.call(print, "name"),
            path$$1.call(print, "typeParameters"),
            " ",
            concat(path$$1.map(print, "attributes")),
            n.selfClosing ? " />" : ">"
          ])
        );
      }

      const lastAttrHasTrailingComments =
        n.attributes.length &&
        hasTrailingComment(util$1.getLast(n.attributes));

      const bracketSameLine =
        options.jsxBracketSameLine &&
        // We should print the bracket in a new line for the following cases:
        // <div
        //   // comment
        // >
        // <div
        //   attr // comment
        // >
        (!nameHasComments || n.attributes.length) &&
        !lastAttrHasTrailingComments;

      // We should print the opening element expanded if any prop value is a
      // string literal with newlines
      const shouldBreak =
        n.attributes &&
        n.attributes.some(
          attr =>
            attr.value &&
            isStringLiteral(attr.value) &&
            attr.value.value.includes("\n")
        );

      return group(
        concat([
          "<",
          path$$1.call(print, "name"),
          path$$1.call(print, "typeParameters"),
          concat([
            indent(
              concat(
                path$$1.map(attr => concat([line$2, print(attr)]), "attributes")
              )
            ),
            n.selfClosing ? line$2 : bracketSameLine ? ">" : softline
          ]),
          n.selfClosing ? "/>" : bracketSameLine ? "" : ">"
        ]),
        { shouldBreak }
      );
    }
    case "JSXClosingElement":
      return concat(["</", path$$1.call(print, "name"), ">"]);
    case "JSXOpeningFragment":
    case "JSXClosingFragment":
    case "TSJsxOpeningFragment":
    case "TSJsxClosingFragment": {
      const hasComment = n.comments && n.comments.length;
      const hasOwnLineComment =
        hasComment && !n.comments.every(comments$2.isBlockComment);
      const isOpeningFragment =
        n.type === "JSXOpeningFragment" || n.type === "TSJsxOpeningFragment";
      return concat([
        isOpeningFragment ? "<" : "</",
        indent(
          concat([
            hasOwnLineComment
              ? hardline
              : hasComment && !isOpeningFragment ? " " : "",
            comments.printDanglingComments(path$$1, options, true)
          ])
        ),
        hasOwnLineComment ? hardline : "",
        ">"
      ]);
    }
    case "JSXText":
      /* istanbul ignore next */
      throw new Error("JSXTest should be handled by JSXElement");
    case "JSXEmptyExpression": {
      const requiresHardline =
        n.comments && !n.comments.every(comments$2.isBlockComment);

      return concat([
        comments.printDanglingComments(
          path$$1,
          options,
          /* sameIndent */ !requiresHardline
        ),
        requiresHardline ? hardline : ""
      ]);
    }
    case "ClassBody":
      if (!n.comments && n.body.length === 0) {
        return "{}";
      }

      return concat([
        openBrace(options),
        n.body.length > 0
          ? indent(
              concat([
                hardline,
                path$$1.call(bodyPath => {
                  return printStatementSequence(bodyPath, options, print);
                }, "body")
              ])
            )
          : comments.printDanglingComments(path$$1, options),
        closeBrace(options)
      ]);
    case "ClassProperty":
    case "TSAbstractClassProperty":
    case "ClassPrivateProperty": {
      if (n.accessibility) {
        parts.push(n.accessibility + " ");
      }
      if (n.static) {
        parts.push("static ");
      }
      if (n.type === "TSAbstractClassProperty") {
        parts.push("abstract ");
      }
      if (n.readonly) {
        parts.push("readonly ");
      }
      const variance = getFlowVariance(n);
      if (variance) {
        parts.push(variance);
      }
      if (n.computed) {
        parts.push("[", path$$1.call(print, "key"), "]");
      } else {
        parts.push(printPropertyKey(path$$1, options, print));
      }
      parts.push(printTypeAnnotation(path$$1, options, print));
      if (n.value) {
        parts.push(
          " =",
          printAssignmentRight(
            n.key,
            n.value,
            path$$1.call(print, "value"),
            options
          )
        );
      }

      parts.push(semi);

      return group(concat(parts));
    }
    case "ClassDeclaration":
    case "ClassExpression":
    case "TSAbstractClassDeclaration":
      if (isNodeStartingWithDeclare(n, options)) {
        parts.push("declare ");
      }
      parts.push(concat(printClass(path$$1, options, print)));
      return concat(parts);
    case "TSInterfaceHeritage":
      parts.push(path$$1.call(print, "id"));

      if (n.typeParameters) {
        parts.push(path$$1.call(print, "typeParameters"));
      }

      return concat(parts);
    case "TemplateElement":
      return join(literalline, n.value.raw.split(/\r?\n/g));
    case "TemplateLiteral": {
      const expressions = path$$1.map(print, "expressions");
      const parentNode = path$$1.getParentNode();

      /**
       * describe.each`table`(name, fn)
       * describe.only.each`table`(name, fn)
       * describe.skip.each`table`(name, fn)
       * test.each`table`(name, fn)
       * test.only.each`table`(name, fn)
       * test.skip.each`table`(name, fn)
       *
       * Ref: https://github.com/facebook/jest/pull/6102
       */
      const jestEachTriggerRegex = /^[xf]?(describe|it|test)$/;
      if (
        parentNode.type === "TaggedTemplateExpression" &&
        parentNode.quasi === n &&
        parentNode.tag.type === "MemberExpression" &&
        parentNode.tag.property.type === "Identifier" &&
        parentNode.tag.property.name === "each" &&
        ((parentNode.tag.object.type === "Identifier" &&
          jestEachTriggerRegex.test(parentNode.tag.object.name)) ||
          (parentNode.tag.object.type === "MemberExpression" &&
            parentNode.tag.object.property.type === "Identifier" &&
            (parentNode.tag.object.property.name === "only" ||
              parentNode.tag.object.property.name === "skip") &&
            parentNode.tag.object.object.type === "Identifier" &&
            jestEachTriggerRegex.test(parentNode.tag.object.object.name)))
      ) {
        /**
         * a    | b    | expected
         * ${1} | ${1} | ${2}
         * ${1} | ${2} | ${3}
         * ${2} | ${1} | ${3}
         */
        const headerNames = n.quasis[0].value.raw.trim().split(/\s*\|\s*/);
        if (
          headerNames.length > 1 ||
          headerNames.some(headerName => headerName.length !== 0)
        ) {
          const stringifiedExpressions = expressions.map(
            doc$$1 =>
              "${" +
              printDocToString$1(
                doc$$1,
                Object.assign({}, options, { printWidth: Infinity })
              ).formatted +
              "}"
          );

          const tableBody = [{ hasLineBreak: false, cells: [] }];
          for (let i = 1; i < n.quasis.length; i++) {
            const row = tableBody[tableBody.length - 1];
            const correspondingExpression = stringifiedExpressions[i - 1];

            row.cells.push(correspondingExpression);
            if (correspondingExpression.indexOf("\n") !== -1) {
              row.hasLineBreak = true;
            }

            if (n.quasis[i].value.raw.indexOf("\n") !== -1) {
              tableBody.push({ hasLineBreak: false, cells: [] });
            }
          }

          const maxColumnCount = tableBody.reduce(
            (maxColumnCount, row) => Math.max(maxColumnCount, row.cells.length),
            headerNames.length
          );

          const maxColumnWidths = Array.from(
            new Array(maxColumnCount),
            () => 0
          );
          const table = [{ cells: headerNames }].concat(
            tableBody.filter(row => row.cells.length !== 0)
          );
          table.filter(row => !row.hasLineBreak).forEach(row => {
            row.cells.forEach((cell, index) => {
              maxColumnWidths[index] = Math.max(
                maxColumnWidths[index],
                util$1.getStringWidth(cell)
              );
            });
          });

          parts.push(
            "`",
            indent(
              concat([
                hardline,
                join(
                  hardline,
                  table.map(row =>
                    join(
                      " | ",
                      row.cells.map(
                        (cell, index) =>
                          row.hasLineBreak
                            ? cell
                            : cell +
                              " ".repeat(
                                maxColumnWidths[index] -
                                  util$1.getStringWidth(cell)
                              )
                      )
                    )
                  )
                )
              ])
            ),
            hardline,
            "`"
          );
          return concat(parts);
        }
      }

      parts.push("`");

      path$$1.each(childPath => {
        const i = childPath.getName();

        parts.push(print(childPath));

        if (i < expressions.length) {
          // For a template literal of the following form:
          //   `someQuery {
          //     ${call({
          //       a,
          //       b,
          //     })}
          //   }`
          // the expression is on its own line (there is a \n in the previous
          // quasi literal), therefore we want to indent the JavaScript
          // expression inside at the beginning of ${ instead of the beginning
          // of the `.
          const tabWidth = options.tabWidth;
          const indentSize = util$1.getIndentSize(
            childPath.getValue().value.raw,
            tabWidth
          );

          let printed = expressions[i];

          if (
            (n.expressions[i].comments && n.expressions[i].comments.length) ||
            n.expressions[i].type === "MemberExpression" ||
            n.expressions[i].type === "OptionalMemberExpression" ||
            n.expressions[i].type === "ConditionalExpression"
          ) {
            printed = concat([indent(concat([softline, printed])), softline]);
          }

          const aligned = addAlignmentToDoc(printed, indentSize, tabWidth);

          parts.push(group(concat(["${", aligned, lineSuffixBoundary, "}"])));
        }
      }, "quasis");

      parts.push("`");

      return concat(parts);
    }
    // These types are unprintable because they serve as abstract
    // supertypes for other (printable) types.
    case "TaggedTemplateExpression":
      return concat([
        path$$1.call(print, "tag"),
        path$$1.call(print, "typeParameters"),
        path$$1.call(print, "quasi")
      ]);
    case "Node":
    case "Printable":
    case "SourceLocation":
    case "Position":
    case "Statement":
    case "Function":
    case "Pattern":
    case "Expression":
    case "Declaration":
    case "Specifier":
    case "NamedSpecifier":
    case "Comment":
    case "MemberTypeAnnotation": // Flow
    case "Type":
      /* istanbul ignore next */
      throw new Error("unprintable type: " + JSON.stringify(n.type));
    // Type Annotations for Facebook Flow, typically stripped out or
    // transformed away before printing.
    case "TypeAnnotation":
    case "TSTypeAnnotation":
      if (n.typeAnnotation) {
        return path$$1.call(print, "typeAnnotation");
      }

      /* istanbul ignore next */
      return "";
    case "TSTupleType":
    case "TupleTypeAnnotation": {
      const typesField = n.type === "TSTupleType" ? "elementTypes" : "types";
      return group(
        concat([
          "[",
          indent(
            concat([
              softline,
              printArrayItems(path$$1, options, typesField, print)
            ])
          ),
          // TypeScript doesn't support trailing commas in tuple types
          n.type === "TSTupleType"
            ? ""
            : ifBreak(shouldPrintComma(options) ? "," : ""),
          comments.printDanglingComments(path$$1, options, /* sameIndent */ true),
          softline,
          "]"
        ])
      );
    }

    case "ExistsTypeAnnotation":
      return "*";
    case "EmptyTypeAnnotation":
      return "empty";
    case "AnyTypeAnnotation":
      return "any";
    case "MixedTypeAnnotation":
      return "mixed";
    case "ArrayTypeAnnotation":
      return concat([path$$1.call(print, "elementType"), "[]"]);
    case "BooleanTypeAnnotation":
      return "boolean";
    case "BooleanLiteralTypeAnnotation":
      return "" + n.value;
    case "DeclareClass":
      return printFlowDeclaration(path$$1, printClass(path$$1, options, print));
    case "DeclareFunction":
      // For TypeScript the DeclareFunction node shares the AST
      // structure with FunctionDeclaration
      if (n.params) {
        return concat([
          "declare ",
          printFunctionDeclaration(path$$1, print, options),
          semi
        ]);
      }
      return printFlowDeclaration(path$$1, [
        "function ",
        path$$1.call(print, "id"),
        n.predicate ? " " : "",
        path$$1.call(print, "predicate"),
        semi
      ]);
    case "DeclareModule":
      return printFlowDeclaration(path$$1, [
        "module ",
        path$$1.call(print, "id"),
        " ",
        path$$1.call(print, "body")
      ]);
    case "DeclareModuleExports":
      return printFlowDeclaration(path$$1, [
        "module.exports",
        ": ",
        path$$1.call(print, "typeAnnotation"),
        semi
      ]);
    case "DeclareVariable":
      return printFlowDeclaration(path$$1, ["var ", path$$1.call(print, "id"), semi]);
    case "DeclareExportAllDeclaration":
      return concat(["declare export * from ", path$$1.call(print, "source")]);
    case "DeclareExportDeclaration":
      return concat(["declare ", printExportDeclaration(path$$1, options, print)]);
    case "DeclareOpaqueType":
    case "OpaqueType": {
      parts.push(
        "opaque type ",
        path$$1.call(print, "id"),
        path$$1.call(print, "typeParameters")
      );

      if (n.supertype) {
        parts.push(": ", path$$1.call(print, "supertype"));
      }

      if (n.impltype) {
        parts.push(" = ", path$$1.call(print, "impltype"));
      }

      parts.push(semi);

      if (n.type === "DeclareOpaqueType") {
        return printFlowDeclaration(path$$1, parts);
      }

      return concat(parts);
    }

    case "FunctionTypeAnnotation":
    case "TSFunctionType": {
      // FunctionTypeAnnotation is ambiguous:
      // declare function foo(a: B): void; OR
      // var A: (a: B) => void;
      const parent = path$$1.getParentNode(0);
      const parentParent = path$$1.getParentNode(1);
      const parentParentParent = path$$1.getParentNode(2);
      let isArrowFunctionTypeAnnotation =
        n.type === "TSFunctionType" ||
        !(
          (parent.type === "ObjectTypeProperty" &&
            !getFlowVariance(parent) &&
            !parent.optional &&
            options.locStart(parent) === options.locStart(n)) ||
          parent.type === "ObjectTypeCallProperty" ||
          (parentParentParent && parentParentParent.type === "DeclareFunction")
        );

      let needsColon =
        isArrowFunctionTypeAnnotation &&
        (parent.type === "TypeAnnotation" ||
          parent.type === "TSTypeAnnotation");

      // Sadly we can't put it inside of FastPath::needsColon because we are
      // printing ":" as part of the expression and it would put parenthesis
      // around :(
      const needsParens =
        needsColon &&
        isArrowFunctionTypeAnnotation &&
        (parent.type === "TypeAnnotation" ||
          parent.type === "TSTypeAnnotation") &&
        parentParent.type === "ArrowFunctionExpression";

      if (isObjectTypePropertyAFunction(parent, options)) {
        isArrowFunctionTypeAnnotation = true;
        needsColon = true;
      }

      if (needsParens) {
        parts.push("(");
      }

      parts.push(
        printFunctionParams(
          path$$1,
          print,
          options,
          /* expandArg */ false,
          /* printTypeParams */ true
        )
      );

      // The returnType is not wrapped in a TypeAnnotation, so the colon
      // needs to be added separately.
      if (n.returnType || n.predicate || n.typeAnnotation) {
        parts.push(
          isArrowFunctionTypeAnnotation ? " => " : ": ",
          path$$1.call(print, "returnType"),
          path$$1.call(print, "predicate"),
          path$$1.call(print, "typeAnnotation")
        );
      }
      if (needsParens) {
        parts.push(")");
      }

      return group(concat(parts));
    }
    case "FunctionTypeParam":
      return concat([
        path$$1.call(print, "name"),
        printOptionalToken(path$$1),
        n.name ? ": " : "",
        path$$1.call(print, "typeAnnotation")
      ]);
    case "GenericTypeAnnotation":
      return concat([
        path$$1.call(print, "id"),
        path$$1.call(print, "typeParameters")
      ]);
    case "DeclareInterface":
    case "InterfaceDeclaration": {
      if (
        n.type === "DeclareInterface" ||
        isNodeStartingWithDeclare(n, options)
      ) {
        parts.push("declare ");
      }

      parts.push(
        "interface ",
        path$$1.call(print, "id"),
        path$$1.call(print, "typeParameters")
      );

      if (n["extends"].length > 0) {
        parts.push(
          group(
            indent(
              concat([line$2, "extends ", join(", ", path$$1.map(print, "extends"))])
            )
          )
        );
      }

      parts.push(" ");
      parts.push(path$$1.call(print, "body"));

      return group(concat(parts));
    }
    case "ClassImplements":
    case "InterfaceExtends":
      return concat([
        path$$1.call(print, "id"),
        path$$1.call(print, "typeParameters")
      ]);
    case "TSIntersectionType":
    case "IntersectionTypeAnnotation": {
      const types = path$$1.map(print, "types");
      const result = [];
      let wasIndented = false;
      for (let i = 0; i < types.length; ++i) {
        if (i === 0) {
          result.push(types[i]);
        } else if (isObjectType(n.types[i - 1]) && isObjectType(n.types[i])) {
          // If both are objects, don't indent
          result.push(
            concat([" & ", wasIndented ? indent(types[i]) : types[i]])
          );
        } else if (!isObjectType(n.types[i - 1]) && !isObjectType(n.types[i])) {
          // If no object is involved, go to the next line if it breaks
          result.push(indent(concat([" &", line$2, types[i]])));
        } else {
          // If you go from object to non-object or vis-versa, then inline it
          if (i > 1) {
            wasIndented = true;
          }
          result.push(" & ", i > 1 ? indent(types[i]) : types[i]);
        }
      }
      return group(concat(result));
    }
    case "TSUnionType":
    case "UnionTypeAnnotation": {
      // single-line variation
      // A | B | C

      // multi-line variation
      // | A
      // | B
      // | C

      const parent = path$$1.getParentNode();
      const parentParent = path$$1.getParentNode(1);

      // If there's a leading comment, the parent is doing the indentation
      const shouldIndent =
        parent.type !== "TypeParameterInstantiation" &&
        parent.type !== "TSTypeParameterInstantiation" &&
        parent.type !== "GenericTypeAnnotation" &&
        parent.type !== "TSTypeReference" &&
        !(parent.type === "FunctionTypeParam" && !parent.name) &&
        parentParent.type !== "TSTypeAssertionExpression" &&
        !(
          (parent.type === "TypeAlias" ||
            parent.type === "VariableDeclarator") &&
          hasLeadingOwnLineComment(options.originalText, n, options)
        );

      // {
      //   a: string
      // } | null | void
      // should be inlined and not be printed in the multi-line variant
      const shouldHug = shouldHugType(n);

      // We want to align the children but without its comment, so it looks like
      // | child1
      // // comment
      // | child2
      const printed = path$$1.map(typePath => {
        let printedType = typePath.call(print);
        if (!shouldHug) {
          printedType = align(2, printedType);
        }
        return comments.printComments(typePath, () => printedType, options);
      }, "types");

      if (shouldHug) {
        return join(" | ", printed);
      }

      const code = concat([
        ifBreak(concat([shouldIndent ? line$2 : "", "| "])),
        join(concat([line$2, "| "]), printed)
      ]);

      let hasParens;

      if (n.type === "TSUnionType") {
        const greatGrandParent = path$$1.getParentNode(2);
        const greatGreatGrandParent = path$$1.getParentNode(3);

        hasParens =
          greatGrandParent &&
          greatGrandParent.type === "TSParenthesizedType" &&
          greatGreatGrandParent &&
          (greatGreatGrandParent.type === "TSUnionType" ||
            greatGreatGrandParent.type === "TSIntersectionType");
      } else {
        hasParens = needsParens_1(path$$1, options);
      }

      if (hasParens) {
        return group(concat([indent(code), softline]));
      }

      return group(shouldIndent ? indent(code) : code);
    }
    case "NullableTypeAnnotation":
      return concat(["?", path$$1.call(print, "typeAnnotation")]);
    case "TSNullKeyword":
    case "NullLiteralTypeAnnotation":
      return "null";
    case "ThisTypeAnnotation":
      return "this";
    case "NumberTypeAnnotation":
      return "number";
    case "ObjectTypeCallProperty":
      if (n.static) {
        parts.push("static ");
      }

      parts.push(path$$1.call(print, "value"));

      return concat(parts);
    case "ObjectTypeIndexer": {
      const variance = getFlowVariance(n);
      return concat([
        variance || "",
        "[",
        path$$1.call(print, "id"),
        n.id ? ": " : "",
        path$$1.call(print, "key"),
        "]: ",
        path$$1.call(print, "value")
      ]);
    }
    case "ObjectTypeProperty": {
      const variance = getFlowVariance(n);

      return concat([
        n.static ? "static " : "",
        isGetterOrSetter(n) ? n.kind + " " : "",
        variance || "",
        printPropertyKey(path$$1, options, print),
        printOptionalToken(path$$1),
        isFunctionNotation(n, options) ? "" : ": ",
        path$$1.call(print, "value")
      ]);
    }
    case "QualifiedTypeIdentifier":
      return concat([
        path$$1.call(print, "qualification"),
        ".",
        path$$1.call(print, "id")
      ]);
    case "StringLiteralTypeAnnotation":
      return nodeStr(n, options);
    case "NumberLiteralTypeAnnotation":
      assert.strictEqual(typeof n.value, "number");

      if (n.extra != null) {
        return util$1.printNumber(n.extra.raw);
      }
      return util$1.printNumber(n.raw);

    case "StringTypeAnnotation":
      return "string";
    case "DeclareTypeAlias":
    case "TypeAlias": {
      if (
        n.type === "DeclareTypeAlias" ||
        isNodeStartingWithDeclare(n, options)
      ) {
        parts.push("declare ");
      }

      const printed = printAssignmentRight(
        n.id,
        n.right,
        path$$1.call(print, "right"),
        options
      );

      parts.push(
        "type ",
        path$$1.call(print, "id"),
        path$$1.call(print, "typeParameters"),
        " =",
        printed,
        semi
      );

      return group(concat(parts));
    }
    case "TypeCastExpression":
      return concat([
        "(",
        path$$1.call(print, "expression"),
        ": ",
        path$$1.call(print, "typeAnnotation"),
        ")"
      ]);
    case "TypeParameterDeclaration":
    case "TypeParameterInstantiation":
    case "TSTypeParameterDeclaration":
    case "TSTypeParameterInstantiation":
      return printTypeParameters(path$$1, options, print, "params");

    case "TSTypeParameter":
    case "TypeParameter": {
      const parent = path$$1.getParentNode();
      if (parent.type === "TSMappedType") {
        parts.push("[", path$$1.call(print, "name"));
        if (n.constraint) {
          parts.push(" in ", path$$1.call(print, "constraint"));
        }
        parts.push("]");
        return concat(parts);
      }

      const variance = getFlowVariance(n);

      if (variance) {
        parts.push(variance);
      }

      parts.push(path$$1.call(print, "name"));

      if (n.bound) {
        parts.push(": ");
        parts.push(path$$1.call(print, "bound"));
      }

      if (n.constraint) {
        parts.push(" extends ", path$$1.call(print, "constraint"));
      }

      if (n["default"]) {
        parts.push(" = ", path$$1.call(print, "default"));
      }

      return concat(parts);
    }
    case "TypeofTypeAnnotation":
      return concat(["typeof ", path$$1.call(print, "argument")]);
    case "VoidTypeAnnotation":
      return "void";
    case "InferredPredicate":
      return "%checks";
    // Unhandled types below. If encountered, nodes of these types should
    // be either left alone or desugared into AST types that are fully
    // supported by the pretty-printer.
    case "DeclaredPredicate":
      return concat(["%checks(", path$$1.call(print, "value"), ")"]);
    case "TSAbstractKeyword":
      return "abstract";
    case "TSAnyKeyword":
      return "any";
    case "TSAsyncKeyword":
      return "async";
    case "TSBooleanKeyword":
      return "boolean";
    case "TSConstKeyword":
      return "const";
    case "TSDeclareKeyword":
      return "declare";
    case "TSExportKeyword":
      return "export";
    case "TSNeverKeyword":
      return "never";
    case "TSNumberKeyword":
      return "number";
    case "TSObjectKeyword":
      return "object";
    case "TSProtectedKeyword":
      return "protected";
    case "TSPrivateKeyword":
      return "private";
    case "TSPublicKeyword":
      return "public";
    case "TSReadonlyKeyword":
      return "readonly";
    case "TSSymbolKeyword":
      return "symbol";
    case "TSStaticKeyword":
      return "static";
    case "TSStringKeyword":
      return "string";
    case "TSUndefinedKeyword":
      return "undefined";
    case "TSVoidKeyword":
      return "void";
    case "TSAsExpression":
      return concat([
        path$$1.call(print, "expression"),
        " as ",
        path$$1.call(print, "typeAnnotation")
      ]);
    case "TSArrayType":
      return concat([path$$1.call(print, "elementType"), "[]"]);
    case "TSPropertySignature": {
      if (n.export) {
        parts.push("export ");
      }
      if (n.accessibility) {
        parts.push(n.accessibility + " ");
      }
      if (n.static) {
        parts.push("static ");
      }
      if (n.readonly) {
        parts.push("readonly ");
      }
      if (n.computed) {
        parts.push("[");
      }

      parts.push(printPropertyKey(path$$1, options, print));

      if (n.computed) {
        parts.push("]");
      }

      parts.push(printOptionalToken(path$$1));

      if (n.typeAnnotation) {
        parts.push(": ");
        parts.push(path$$1.call(print, "typeAnnotation"));
      }

      // This isn't valid semantically, but it's in the AST so we can print it.
      if (n.initializer) {
        parts.push(" = ", path$$1.call(print, "initializer"));
      }

      return concat(parts);
    }
    case "TSParameterProperty":
      if (n.accessibility) {
        parts.push(n.accessibility + " ");
      }
      if (n.export) {
        parts.push("export ");
      }
      if (n.static) {
        parts.push("static ");
      }
      if (n.readonly) {
        parts.push("readonly ");
      }

      parts.push(path$$1.call(print, "parameter"));

      return concat(parts);
    case "TSTypeReference":
      return concat([
        path$$1.call(print, "typeName"),
        printTypeParameters(path$$1, options, print, "typeParameters")
      ]);
    case "TSTypeQuery":
      return concat(["typeof ", path$$1.call(print, "exprName")]);
    case "TSParenthesizedType": {
      return path$$1.call(print, "typeAnnotation");
    }
    case "TSIndexSignature": {
      const parent = path$$1.getParentNode();

      return concat([
        n.export ? "export " : "",
        n.accessibility ? concat([n.accessibility, " "]) : "",
        n.static ? "static " : "",
        n.readonly ? "readonly " : "",
        "[",
        path$$1.call(print, "index"),
        "]: ",
        path$$1.call(print, "typeAnnotation"),
        parent.type === "ClassBody" ? semi : ""
      ]);
    }
    case "TSTypePredicate":
      return concat([
        path$$1.call(print, "parameterName"),
        " is ",
        path$$1.call(print, "typeAnnotation")
      ]);
    case "TSNonNullExpression":
      return concat([path$$1.call(print, "expression"), "!"]);
    case "TSThisType":
      return "this";
    case "TSLastTypeNode": // TSImportType
      return concat([
        !n.isTypeOf ? "" : "typeof ",
        "import(",
        path$$1.call(print, "argument"),
        ")",
        !n.qualifier ? "" : concat([".", path$$1.call(print, "qualifier")])
      ]);
    case "TSLiteralType":
      return path$$1.call(print, "literal");
    case "TSIndexedAccessType":
      return concat([
        path$$1.call(print, "objectType"),
        "[",
        path$$1.call(print, "indexType"),
        "]"
      ]);
    case "TSConstructSignature":
    case "TSConstructorType":
    case "TSCallSignature": {
      if (n.type !== "TSCallSignature") {
        parts.push("new ");
      }

      parts.push(
        group(
          printFunctionParams(
            path$$1,
            print,
            options,
            /* expandArg */ false,
            /* printTypeParams */ true
          )
        )
      );

      if (n.typeAnnotation) {
        const isType = n.type === "TSConstructorType";
        parts.push(isType ? " => " : ": ", path$$1.call(print, "typeAnnotation"));
      }
      return concat(parts);
    }
    case "TSTypeOperator":
      return concat([n.operator, " ", path$$1.call(print, "typeAnnotation")]);
    case "TSMappedType":
      return group(
        concat([
          "{",
          indent(
            concat([
              options.bracketSpacing ? line$2 : softline,
              n.readonlyToken
                ? concat([
                    getTypeScriptMappedTypeModifier(
                      n.readonlyToken,
                      "readonly"
                    ),
                    " "
                  ])
                : "",
              printTypeScriptModifiers(path$$1, options, print),
              path$$1.call(print, "typeParameter"),
              n.questionToken
                ? getTypeScriptMappedTypeModifier(n.questionToken, "?")
                : "",
              ": ",
              path$$1.call(print, "typeAnnotation")
            ])
          ),
          comments.printDanglingComments(path$$1, options, /* sameIndent */ true),
          options.bracketSpacing ? line$2 : softline,
          "}"
        ])
      );
    case "TSMethodSignature":
      parts.push(
        n.accessibility ? concat([n.accessibility, " "]) : "",
        n.export ? "export " : "",
        n.static ? "static " : "",
        n.readonly ? "readonly " : "",
        n.computed ? "[" : "",
        path$$1.call(print, "key"),
        n.computed ? "]" : "",
        printOptionalToken(path$$1),
        printFunctionParams(
          path$$1,
          print,
          options,
          /* expandArg */ false,
          /* printTypeParams */ true
        )
      );

      if (n.typeAnnotation) {
        parts.push(": ", path$$1.call(print, "typeAnnotation"));
      }
      return group(concat(parts));
    case "TSNamespaceExportDeclaration":
      parts.push("export as namespace ", path$$1.call(print, "name"));

      if (options.semi) {
        parts.push(";");
      }

      return group(concat(parts));
    case "TSEnumDeclaration":
      if (isNodeStartingWithDeclare(n, options)) {
        parts.push("declare ");
      }

      if (n.modifiers) {
        parts.push(printTypeScriptModifiers(path$$1, options, print));
      }
      if (n.const) {
        parts.push("const ");
      }

      parts.push("enum ", path$$1.call(print, "id"), " ");

      if (n.members.length === 0) {
        parts.push(
          group(
            concat([
              "{",
              comments.printDanglingComments(path$$1, options),
              softline,
              "}"
            ])
          )
        );
      } else {
        parts.push(
          group(
            concat([
              "{",
              indent(
                concat([
                  hardline,
                  printArrayItems(path$$1, options, "members", print),
                  shouldPrintComma(options, "es5") ? lineComma(options) : ""
                ])
              ),
              comments.printDanglingComments(
                path$$1,
                options,
                /* sameIndent */ true
              ),
              hardline,
              "}"
            ])
          )
        );
      }

      return concat(parts);
    case "TSEnumMember":
      parts.push(path$$1.call(print, "id"));
      if (n.initializer) {
        parts.push(" = ", path$$1.call(print, "initializer"));
      }
      return concat(parts);
    case "TSImportEqualsDeclaration":
      parts.push(
        printTypeScriptModifiers(path$$1, options, print),
        "import ",
        path$$1.call(print, "name"),
        " = ",
        path$$1.call(print, "moduleReference")
      );

      if (options.semi) {
        parts.push(";");
      }

      return group(concat(parts));
    case "TSExternalModuleReference":
      return concat(["require(", path$$1.call(print, "expression"), ")"]);
    case "TSModuleDeclaration": {
      const parent = path$$1.getParentNode();
      const isExternalModule = isLiteral(n.id);
      const parentIsDeclaration = parent.type === "TSModuleDeclaration";
      const bodyIsDeclaration = n.body && n.body.type === "TSModuleDeclaration";

      if (parentIsDeclaration) {
        parts.push(".");
      } else {
        if (n.declare === true) {
          parts.push("declare ");
        }
        parts.push(printTypeScriptModifiers(path$$1, options, print));

        // Global declaration looks like this:
        // (declare)? global { ... }
        const isGlobalDeclaration =
          n.id.type === "Identifier" &&
          n.id.name === "global" &&
          !/namespace|module/.test(
            options.originalText.slice(
              options.locStart(n),
              options.locStart(n.id)
            )
          );

        if (!isGlobalDeclaration) {
          parts.push(isExternalModule ? "module " : "namespace ");
        }
      }

      parts.push(path$$1.call(print, "id"));

      if (bodyIsDeclaration) {
        parts.push(path$$1.call(print, "body"));
      } else if (n.body) {
        parts.push(
          " {",
          indent(
            concat([
              line$2,
              path$$1.call(
                bodyPath =>
                  comments.printDanglingComments(bodyPath, options, true),
                "body"
              ),
              group(path$$1.call(print, "body"))
            ])
          ),
          line$2,
          "}"
        );
      } else {
        parts.push(semi);
      }

      return concat(parts);
    }
    case "TSModuleBlock":
      return path$$1.call(bodyPath => {
        return printStatementSequence(bodyPath, options, print);
      }, "body");

    case "PrivateName":
      return concat(["#", path$$1.call(print, "id")]);

    case "TSConditionalType":
      return formatTernaryOperator(path$$1, options, print, {
        beforeParts: () => [
          path$$1.call(print, "checkType"),
          " ",
          "extends",
          " ",
          path$$1.call(print, "extendsType")
        ],
        shouldCheckJsx: false,
        operatorName: "TSConditionalType",
        consequentNode: "trueType",
        alternateNode: "falseType",
        testNode: "checkType",
        breakNested: false
      });

    case "TSInferType":
      return concat(["infer", " ", path$$1.call(print, "typeParameter")]);

    default:
      /* istanbul ignore next */
      throw new Error("unknown type: " + JSON.stringify(n.type));
  }
}

function printStatementSequence(path$$1, options, print) {
  const printed = [];

  const bodyNode = path$$1.getNode();
  const isClass = bodyNode.type === "ClassBody";

  const isSingleStatementInExpressionBlock =
    options.lenient && isSingleExpressionStatementInExpressionBlock(path$$1);

  path$$1.map((stmtPath, i) => {
    const stmt = stmtPath.getValue();

    // Just in case the AST has been modified to contain falsy
    // "statements," it's safer simply to skip them.
    /* istanbul ignore if */
    if (!stmt) {
      return;
    }

    // Skip printing EmptyStatement nodes to avoid leaving stray
    // semicolons lying around.
    if (isEmptyStatement(stmt, bodyNode)) {
      return;
    }

    const stmtPrinted = print(stmtPath);
    const text = options.originalText;
    const parts = [];

    // in no-semi mode, prepend statement with semicolon if it might break ASI
    // don't prepend the only JSX element in a program with semicolon
    if (
      !options.semi &&
      !isClass &&
      !isTheOnlyJSXElementInMarkdown(options, stmtPath) &&
      stmtNeedsASIProtection(stmtPath, options) &&
      !options.lenient
    ) {
      if (stmt.comments && stmt.comments.some(comment => comment.leading)) {
        parts.push(print(stmtPath, { needsSemi: true }));
      } else {
        parts.push(";", stmtPrinted);
      }
    } else {
      parts.push(stmtPrinted);
    }

    if (!options.semi && isClass) {
      if (classPropMayCauseASIProblems(stmtPath)) {
        parts.push(";");
      } else if (stmt.type === "ClassProperty") {
        const nextChild = bodyNode.body[i + 1];
        if (classChildNeedsASIProtection(nextChild)) {
          parts.push(";");
        }
      }
    }

    if (isSingleStatementInExpressionBlock && stmt.type !== "ReturnStatement") {
      parts.push(";");
    }

    if (
      utilShared.isNextLineEmpty(text, stmt, options) &&
      !isLastStatement(stmtPath)
    ) {
      parts.push(hardline);
    }

    printed.push(concat(parts));
  });

  return join(options.lenient ? singleHardLine : hardline, printed);
}

function isEmptyStatement(node, parent) {
  return (
    node.type === "EmptyStatement"
    // TODO: Consider removing break statements from switch
    //  ||
    // (node.type === "BreakStatement" &&
    //   !node.label &&
    //   parent.type === "SwitchCase")
  );
}

function printPropertyKey(path$$1, options, print) {
  const node = path$$1.getNode();
  const key = node.key;

  if (
    key.type === "Identifier" &&
    !node.computed &&
    options.parser === "json"
  ) {
    // a -> "a"
    return path$$1.call(
      keyPath =>
        comments.printComments(
          keyPath,
          () => JSON.stringify(key.name),
          options
        ),
      "key"
    );
  }

  if (
    isStringLiteral(key) &&
    isIdentifierName(key.value) &&
    !node.computed &&
    options.parser !== "json"
  ) {
    // 'a' -> a
    return path$$1.call(
      keyPath => comments.printComments(keyPath, () => key.value, options),
      "key"
    );
  }
  return path$$1.call(print, "key");
}

function printMethod(path$$1, options, print) {
  const node = path$$1.getNode();
  const semi = options.semi ? ";" : "";
  const kind = node.kind;
  const parts = [];

  if (node.type === "ObjectMethod" || node.type === "ClassMethod") {
    node.value = node;
  }

  if (node.value.async) {
    parts.push("async ");
  }

  if (!kind || kind === "init" || kind === "method" || kind === "constructor") {
    if (node.value.generator) {
      parts.push("*");
    }
  } else {
    assert.ok(kind === "get" || kind === "set");

    parts.push(kind, " ");
  }

  let key = printPropertyKey(path$$1, options, print);

  if (node.computed) {
    key = concat(["[", key, "]"]);
  }

  parts.push(
    key,
    concat(
      path$$1.call(
        valuePath => [
          printFunctionTypeParameters(valuePath, options, print),
          group(
            concat([
              printFunctionParams(valuePath, print, options),
              printReturnType(valuePath, print, options)
            ])
          )
        ],
        "value"
      )
    )
  );

  if (!node.value.body || node.value.body.length === 0) {
    parts.push(semi);
  } else {
    parts.push(" ", path$$1.call(print, "value", "body"));
  }

  return concat(parts);
}

function couldGroupArg(arg) {
  return (
    (arg.type === "ObjectExpression" &&
      (arg.properties.length > 0 || arg.comments)) ||
    (arg.type === "ArrayExpression" &&
      (arg.elements.length > 0 || arg.comments)) ||
    arg.type === "TSTypeAssertionExpression" ||
    arg.type === "TSAsExpression" ||
    arg.type === "FunctionExpression" ||
    (arg.type === "ArrowFunctionExpression" &&
      (arg.body.type === "BlockStatement" ||
        arg.body.type === "ArrowFunctionExpression" ||
        arg.body.type === "ObjectExpression" ||
        arg.body.type === "ArrayExpression" ||
        arg.body.type === "CallExpression" ||
        arg.body.type === "OptionalCallExpression" ||
        isJSXNode(arg.body)))
  );
}

function shouldGroupLastArg(args) {
  const lastArg = util$1.getLast(args);
  const penultimateArg = util$1.getPenultimate(args);
  return (
    !hasLeadingComment(lastArg) &&
    !hasTrailingComment(lastArg) &&
    couldGroupArg(lastArg) &&
    // If the last two arguments are of the same type,
    // disable last element expansion.
    (!penultimateArg || penultimateArg.type !== lastArg.type)
  );
}

function shouldGroupFirstArg(args) {
  if (args.length !== 2) {
    return false;
  }

  const firstArg = args[0];
  const secondArg = args[1];
  return (
    (!firstArg.comments || !firstArg.comments.length) &&
    (firstArg.type === "FunctionExpression" ||
      (firstArg.type === "ArrowFunctionExpression" &&
        firstArg.body.type === "BlockStatement")) &&
    !couldGroupArg(secondArg)
  );
}

const functionCompositionFunctionNames = {
  pipe: true, // RxJS, Ramda
  pipeP: true, // Ramda
  pipeK: true, // Ramda
  compose: true, // Ramda, Redux
  composeFlipped: true, // Not from any library, but common in Haskell, so supported
  composeP: true, // Ramda
  composeK: true, // Ramda
  flow: true, // Lodash
  flowRight: true, // Lodash
  connect: true // Redux
};
function isFunctionCompositionFunction(node) {
  switch (node.type) {
    case "OptionalMemberExpression":
    case "MemberExpression": {
      return isFunctionCompositionFunction(node.property);
    }
    case "Identifier": {
      return functionCompositionFunctionNames[node.name];
    }
    case "StringLiteral":
    case "Literal": {
      return functionCompositionFunctionNames[node.value];
    }
  }
}

function printArgumentsList(path$$1, options, print) {
  const node = path$$1.getValue();
  const args = node.arguments;

  if (args.length === 0) {
    return concat([
      "(",
      comments.printDanglingComments(path$$1, options, /* sameIndent */ true),
      ")"
    ]);
  }

  let anyArgEmptyLine = false;
  let hasEmptyLineFollowingFirstArg = false;
  const lastArgIndex = args.length - 1;
  const printedArguments = path$$1.map((argPath, index) => {
    const arg = argPath.getNode();
    const parts = [print(argPath)];

    if (index === lastArgIndex) {
      // do nothing
    } else if (utilShared.isNextLineEmpty(options.originalText, arg, options)) {
      if (index === 0) {
        hasEmptyLineFollowingFirstArg = true;
      }

      anyArgEmptyLine = true;
      parts.push(lineComma(options), hardline, hardline);
    } else {
      parts.push(lineComma(options), line$2);
    }

    return concat(parts);
  }, "arguments");

  const maybeTrailingComma = shouldPrintComma(options, "all") ? "," : "";

  function allArgsBrokenOut() {
    return group(
      concat([
        "(",
        indent(concat([line$2, concat(printedArguments)])),
        maybeTrailingComma,
        line$2,
        ")"
      ]),
      { shouldBreak: true }
    );
  }

  // We want to get
  //    pipe(
  //      x => x + 1,
  //      x => x - 1
  //    )
  // here, but not
  //    process.stdout.pipe(socket)
  if (isFunctionCompositionFunction(node.callee) && args.length > 1) {
    return allArgsBrokenOut();
  }

  const shouldGroupFirst = shouldGroupFirstArg(args);
  const shouldGroupLast = shouldGroupLastArg(args);
  if (shouldGroupFirst || shouldGroupLast) {
    const shouldBreak =
      (shouldGroupFirst
        ? printedArguments.slice(1).some(willBreak)
        : printedArguments.slice(0, -1).some(willBreak)) || anyArgEmptyLine;

    // We want to print the last argument with a special flag
    let printedExpanded;
    let i = 0;
    path$$1.each(argPath => {
      if (shouldGroupFirst && i === 0) {
        printedExpanded = [
          concat([
            argPath.call(p => print(p, { expandFirstArg: true })),
            printedArguments.length > 1 ? lineComma(options) : "",
            hasEmptyLineFollowingFirstArg ? hardline : line$2,
            hasEmptyLineFollowingFirstArg ? hardline : ""
          ])
        ].concat(printedArguments.slice(1));
      }
      if (shouldGroupLast && i === args.length - 1) {
        printedExpanded = printedArguments
          .slice(0, -1)
          .concat(argPath.call(p => print(p, { expandLastArg: true })));
      }
      i++;
    }, "arguments");

    const somePrintedArgumentsWillBreak = printedArguments.some(willBreak);

    const maybeTrailingComma = shouldPrintComma(options, "all")
      ? lineComma(options)
      : "";

    return concat([
      somePrintedArgumentsWillBreak ? breakParent : "",
      conditionalGroup(
        [
          concat([
            ifBreak(
              indent(concat(["(", softline, concat(printedExpanded)])),
              concat(["(", concat(printedExpanded)])
            ),
            somePrintedArgumentsWillBreak
              ? concat([
                  ifBreak(maybeTrailingComma),
                  !options.lenient ? softline : singleSoftLine
                ])
              : "",
            ")"
          ]),
          shouldGroupFirst
            ? concat([
                "(",
                group(printedExpanded[0], { shouldBreak: true }),
                concat(printedExpanded.slice(1)),
                ")"
              ])
            : concat([
                "(",
                concat(printedArguments.slice(0, -1)),
                group(util$1.getLast(printedExpanded), {
                  shouldBreak: true
                }),
                ")"
              ]),
          allArgsBrokenOut()
        ],
        { shouldBreak }
      )
    ]);
  }

  return group(
    concat([
      "(",
      indent(concat([softline, concat(printedArguments)])),
      ifBreak(shouldPrintComma(options, "all") ? lineComma(options) : ""),
      singleSoftLine,
      ")"
    ]),
    { shouldBreak: printedArguments.some(willBreak) || anyArgEmptyLine }
  );
}

function printTypeAnnotation(path$$1, options, print) {
  const node = path$$1.getValue();
  if (!node.typeAnnotation) {
    return "";
  }

  const parentNode = path$$1.getParentNode();
  const isDefinite =
    node.definite ||
    (parentNode &&
      parentNode.type === "VariableDeclarator" &&
      parentNode.definite);

  const isFunctionDeclarationIdentifier =
    parentNode.type === "DeclareFunction" && parentNode.id === node;

  if (
    isFlowAnnotationComment(options.originalText, node.typeAnnotation, options)
  ) {
    return concat([" /*: ", path$$1.call(print, "typeAnnotation"), " */"]);
  }

  return concat([
    isFunctionDeclarationIdentifier ? "" : isDefinite ? "!: " : ": ",
    path$$1.call(print, "typeAnnotation")
  ]);
}

function printFunctionTypeParameters(path$$1, options, print) {
  const fun = path$$1.getValue();
  if (fun.typeParameters) {
    return path$$1.call(print, "typeParameters");
  }
  return "";
}

function printFunctionParams(path$$1, print, options, expandArg, printTypeParams) {
  const fun = path$$1.getValue();
  const paramsField = fun.parameters ? "parameters" : "params";

  const typeParams = printTypeParams
    ? printFunctionTypeParameters(path$$1, options, print)
    : "";

  let printed = [];
  if (fun[paramsField]) {
    printed = path$$1.map(print, paramsField);
  }

  if (fun.rest) {
    printed.push(concat(["...", path$$1.call(print, "rest")]));
  }

  if (printed.length === 0) {
    return concat([
      typeParams,
      "(",
      comments.printDanglingComments(
        path$$1,
        options,
        /* sameIndent */ true,
        comment =>
          util$1.getNextNonSpaceNonCommentCharacter(
            options.originalText,
            comment,
            options.locEnd
          ) === ")"
      ),
      ")"
    ]);
  }

  const lastParam = util$1.getLast(fun[paramsField]);

  // If the parent is a call with the first/last argument expansion and this is the
  // params of the first/last argument, we dont want the arguments to break and instead
  // want the whole expression to be on a new line.
  //
  // Good:                 Bad:
  //   verylongcall(         verylongcall((
  //     (a, b) => {           a,
  //     }                     b,
  //   })                    ) => {
  //                         })
  if (
    expandArg &&
    !(fun[paramsField] && fun[paramsField].some(n => n.comments))
  ) {
    return group(
      concat([
        docUtils.removeLines(typeParams),
        "(",
        join(", ", printed.map(docUtils.removeLines)),
        ")"
      ])
    );
  }

  // Single object destructuring should hug
  //
  // function({
  //   a,
  //   b,
  //   c
  // }) {}
  if (shouldHugArguments(fun)) {
    return concat([typeParams, "(", join(", ", printed), ")"]);
  }

  const parent = path$$1.getParentNode();

  // don't break in specs, eg; `it("should maintain parens around done even when long", (done) => {})`
  if (parent.type === "CallExpression" && isTestCall(parent)) {
    return concat([typeParams, "(", join(", ", printed), ")"]);
  }

  const flowTypeAnnotations = [
    "AnyTypeAnnotation",
    "NullLiteralTypeAnnotation",
    "GenericTypeAnnotation",
    "ThisTypeAnnotation",
    "NumberTypeAnnotation",
    "VoidTypeAnnotation",
    "EmptyTypeAnnotation",
    "MixedTypeAnnotation",
    "BooleanTypeAnnotation",
    "BooleanLiteralTypeAnnotation",
    "StringTypeAnnotation"
  ];

  const isFlowShorthandWithOneArg =
    (isObjectTypePropertyAFunction(parent, options) ||
      isTypeAnnotationAFunction(parent, options) ||
      parent.type === "TypeAlias" ||
      parent.type === "UnionTypeAnnotation" ||
      parent.type === "TSUnionType" ||
      parent.type === "IntersectionTypeAnnotation" ||
      (parent.type === "FunctionTypeAnnotation" &&
        parent.returnType === fun)) &&
    fun[paramsField].length === 1 &&
    fun[paramsField][0].name === null &&
    fun[paramsField][0].typeAnnotation &&
    fun.typeParameters === null &&
    flowTypeAnnotations.indexOf(fun[paramsField][0].typeAnnotation.type) !==
      -1 &&
    !(
      fun[paramsField][0].typeAnnotation.type === "GenericTypeAnnotation" &&
      fun[paramsField][0].typeAnnotation.typeParameters
    ) &&
    !fun.rest;

  if (isFlowShorthandWithOneArg) {
    if (options.arrowParens === "always") {
      return concat(["(", concat(printed), ")"]);
    }
    return concat(printed);
  }

  const canHaveTrailingComma =
    !(lastParam && lastParam.type === "RestElement") && !fun.rest;

  return concat([
    typeParams,
    "(",
    indent(
      concat([softline, join(concat([lineComma(options), line$2]), printed)])
    ),
    ifBreak(
      canHaveTrailingComma && shouldPrintComma(options, "all")
        ? lineComma(options)
        : ""
    ),
    softline,
    ")"
  ]);
}

function shouldPrintParamsWithoutParens(path$$1, options) {
  if (options.arrowParens === "always") {
    return false;
  }

  if (options.arrowParens === "avoid") {
    const node = path$$1.getValue();
    return canPrintParamsWithoutParens(node);
  }

  // Fallback default; should be unreachable
  return false;
}

function canPrintParamsWithoutParens(node) {
  return (
    node.params.length === 1 &&
    !node.rest &&
    !node.typeParameters &&
    !hasDanglingComments(node) &&
    node.params[0].type === "Identifier" &&
    !node.params[0].typeAnnotation &&
    !node.params[0].comments &&
    !node.params[0].optional &&
    !node.predicate &&
    !node.returnType
  );
}

function printFunctionDeclaration(path$$1, print, options) {
  const n = path$$1.getValue();
  const parts = [];

  if (n.async) {
    parts.push("async ");
  }

  parts.push("function");

  if (n.generator) {
    parts.push("*");
  }
  if (n.id) {
    parts.push(" ", path$$1.call(print, "id"));
  }

  parts.push(
    printFunctionTypeParameters(path$$1, options, print),
    group(
      concat([
        printFunctionParams(path$$1, print, options),
        printReturnType(path$$1, print, options)
      ])
    ),
    n.body ? " " : "",
    path$$1.call(print, "body")
  );

  return concat(parts);
}

function printObjectMethod(path$$1, options, print) {
  const objMethod = path$$1.getValue();
  const parts = [];

  if (objMethod.async) {
    parts.push("async ");
  }
  if (objMethod.generator) {
    parts.push("*");
  }
  if (
    objMethod.method ||
    objMethod.kind === "get" ||
    objMethod.kind === "set"
  ) {
    return printMethod(path$$1, options, print);
  }

  const key = printPropertyKey(path$$1, options, print);

  if (objMethod.computed) {
    parts.push("[", key, "]");
  } else {
    parts.push(key);
  }

  parts.push(
    printFunctionTypeParameters(path$$1, options, print),
    group(
      concat([
        printFunctionParams(path$$1, print, options),
        printReturnType(path$$1, print, options)
      ])
    ),
    " ",
    path$$1.call(print, "body")
  );

  return concat(parts);
}

function printReturnType(path$$1, print, options) {
  const n = path$$1.getValue();
  const returnType = path$$1.call(print, "returnType");

  if (
    n.returnType &&
    isFlowAnnotationComment(options.originalText, n.returnType, options)
  ) {
    return concat([" /*: ", returnType, " */"]);
  }

  const parts = [returnType];

  // prepend colon to TypeScript type annotation
  if (n.returnType && n.returnType.typeAnnotation) {
    parts.unshift(": ");
  }

  if (n.predicate) {
    // The return type will already add the colon, but otherwise we
    // need to do it ourselves
    parts.push(n.returnType ? " " : ": ", path$$1.call(print, "predicate"));
  }

  return concat(parts);
}

function printExportDeclaration(path$$1, options, print) {
  const decl = path$$1.getValue();
  const semi = options.semi ? ";" : "";
  const parts = ["export "];

  const isDefault = decl["default"] || decl.type === "ExportDefaultDeclaration";

  if (isDefault) {
    parts.push("default ");
  }

  parts.push(
    comments.printDanglingComments(path$$1, options, /* sameIndent */ true)
  );

  if (needsHardlineAfterDanglingComment(decl)) {
    parts.push(hardline);
  }

  if (decl.declaration) {
    parts.push(path$$1.call(print, "declaration"));

    if (
      isDefault &&
      (decl.declaration.type !== "ClassDeclaration" &&
        decl.declaration.type !== "FunctionDeclaration" &&
        decl.declaration.type !== "TSAbstractClassDeclaration" &&
        decl.declaration.type !== "TSInterfaceDeclaration" &&
        decl.declaration.type !== "DeclareClass" &&
        decl.declaration.type !== "DeclareFunction")
    ) {
      parts.push(semi);
    }
  } else {
    if (decl.specifiers && decl.specifiers.length > 0) {
      const specifiers = [];
      const defaultSpecifiers = [];
      const namespaceSpecifiers = [];
      path$$1.each(specifierPath => {
        const specifierType = path$$1.getValue().type;
        if (specifierType === "ExportSpecifier") {
          specifiers.push(print(specifierPath));
        } else if (specifierType === "ExportDefaultSpecifier") {
          defaultSpecifiers.push(print(specifierPath));
        } else if (specifierType === "ExportNamespaceSpecifier") {
          namespaceSpecifiers.push(concat(["* as ", print(specifierPath)]));
        }
      }, "specifiers");

      const isNamespaceFollowed =
        namespaceSpecifiers.length !== 0 && specifiers.length !== 0;

      const isDefaultFollowed =
        defaultSpecifiers.length !== 0 &&
        (namespaceSpecifiers.length !== 0 || specifiers.length !== 0);

      parts.push(
        decl.exportKind === "type" ? "type " : "",
        concat(defaultSpecifiers),
        concat([isDefaultFollowed ? ", " : ""]),
        concat(namespaceSpecifiers),
        concat([isNamespaceFollowed ? ", " : ""]),
        specifiers.length !== 0
          ? group(
              concat([
                "{",
                indent(
                  concat([
                    options.bracketSpacing ? line$2 : softline,
                    join(concat([lineComma(options), line$2]), specifiers)
                  ])
                ),
                ifBreak(shouldPrintComma(options) ? lineComma(options) : ""),
                closeSoftBrace(options, "}")
              ])
            )
          : ""
      );
    } else {
      parts.push("{}");
    }

    if (decl.source) {
      parts.push(" from ", path$$1.call(print, "source"));
    }

    parts.push(semi);
  }

  return concat(parts);
}

function printFlowDeclaration(path$$1, parts) {
  const parentExportDecl = util$1.getParentExportDeclaration(path$$1);

  if (parentExportDecl) {
    assert.strictEqual(parentExportDecl.type, "DeclareExportDeclaration");
  } else {
    // If the parent node has type DeclareExportDeclaration, then it
    // will be responsible for printing the "declare" token. Otherwise
    // it needs to be printed with this non-exported declaration node.
    parts.unshift("declare ");
  }

  return concat(parts);
}

function getFlowVariance(path$$1) {
  if (!path$$1.variance) {
    return null;
  }

  // Babylon 7.0 currently uses variance node type, and flow should
  // follow suit soon:
  // https://github.com/babel/babel/issues/4722
  const variance = path$$1.variance.kind || path$$1.variance;

  switch (variance) {
    case "plus":
      return "+";
    case "minus":
      return "-";
    default:
      /* istanbul ignore next */
      return variance;
  }
}

function printTypeScriptModifiers(path$$1, options, print) {
  const n = path$$1.getValue();
  if (!n.modifiers || !n.modifiers.length) {
    return "";
  }
  return concat([join(" ", path$$1.map(print, "modifiers")), " "]);
}

function printTypeParameters(path$$1, options, print, paramsKey) {
  const n = path$$1.getValue();

  if (!n[paramsKey]) {
    return "";
  }

  // for TypeParameterDeclaration typeParameters is a single node
  if (!Array.isArray(n[paramsKey])) {
    return path$$1.call(print, paramsKey);
  }

  const grandparent = path$$1.getNode(2);

  const isParameterInTestCall =
    grandparent != null &&
    grandparent.type === "CallExpression" &&
    isTestCall(grandparent);

  const shouldInline =
    isParameterInTestCall ||
    n[paramsKey].length === 0 ||
    (n[paramsKey].length === 1 &&
      (shouldHugType(n[paramsKey][0]) ||
        (n[paramsKey][0].type === "GenericTypeAnnotation" &&
          shouldHugType(n[paramsKey][0].id)) ||
        (n[paramsKey][0].type === "TSTypeReference" &&
          shouldHugType(n[paramsKey][0].typeName)) ||
        n[paramsKey][0].type === "NullableTypeAnnotation"));

  if (shouldInline) {
    return concat(["<", join(", ", path$$1.map(print, paramsKey)), ">"]);
  }

  return group(
    concat([
      "<",
      indent(
        concat([
          softline,
          join(concat([lineComma(options), line$2]), path$$1.map(print, paramsKey))
        ])
      ),
      ifBreak(
        options.parser !== "typescript" && shouldPrintComma(options, "all")
          ? lineComma(options)
          : ""
      ),
      softline,
      ">"
    ])
  );
}

function printClass(path$$1, options, print) {
  const n = path$$1.getValue();
  const parts = [];

  if (n.type === "TSAbstractClassDeclaration") {
    parts.push("abstract ");
  }

  parts.push("class");

  if (n.id) {
    parts.push(" ", path$$1.call(print, "id"));
  }

  parts.push(path$$1.call(print, "typeParameters"));

  const partsGroup = [];
  if (n.superClass) {
    const printed = concat([
      "extends ",
      path$$1.call(print, "superClass"),
      path$$1.call(print, "superTypeParameters")
    ]);
    // Keep old behaviour of extends in same line
    // If there is only on extends and there are not comments
    if (
      (!n.implements || n.implements.length === 0) &&
      (!n.superClass.comments || n.superClass.comments.length === 0)
    ) {
      parts.push(
        concat([
          " ",
          path$$1.call(
            superClass =>
              comments.printComments(superClass, () => printed, options),
            "superClass"
          )
        ])
      );
    } else {
      partsGroup.push(
        group(
          concat([
            line$2,
            path$$1.call(
              superClass =>
                comments.printComments(superClass, () => printed, options),
              "superClass"
            )
          ])
        )
      );
    }
  } else if (n.extends && n.extends.length > 0) {
    parts.push(" extends ", join(", ", path$$1.map(print, "extends")));
  }

  if (n["mixins"] && n["mixins"].length > 0) {
    partsGroup.push(
      line$2,
      "mixins ",
      group(
        indent(
          join(concat([lineComma(options), line$2]), path$$1.map(print, "mixins"))
        )
      )
    );
  }

  if (n["implements"] && n["implements"].length > 0) {
    partsGroup.push(
      line$2,
      "implements",
      group(
        indent(
          concat([
            line$2,
            join(
              concat([lineComma(options), line$2]),
              path$$1.map(print, "implements")
            )
          ])
        )
      )
    );
  }

  if (partsGroup.length > 0) {
    parts.push(group(indent(concat(partsGroup))));
  }

  if (
    n.body &&
    n.body.comments &&
    hasLeadingOwnLineComment(options.originalText, n.body, options)
  ) {
    parts.push(hardline);
  } else {
    parts.push(" ");
  }
  parts.push(path$$1.call(print, "body"));

  return parts;
}

function printOptionalToken(path$$1) {
  const node = path$$1.getValue();
  if (!node.optional) {
    return "";
  }
  if (
    node.type === "OptionalCallExpression" ||
    (node.type === "OptionalMemberExpression" && node.computed)
  ) {
    return "?.";
  }
  return "?";
}

function printMemberLookup(path$$1, options, print) {
  const property = path$$1.call(print, "property");
  const n = path$$1.getValue();
  const optional = printOptionalToken(path$$1);

  if (!n.computed) {
    return concat([optional, ".", property]);
  }

  if (!n.property || isNumericLiteral(n.property)) {
    return concat([optional, "[", property, "]"]);
  }

  return group(
    concat([optional, "[", indent(concat([softline, property])), softline, "]"])
  );
}

function printBindExpressionCallee(path$$1, options, print) {
  return concat(["::", path$$1.call(print, "callee")]);
}

// We detect calls on member expressions specially to format a
// common pattern better. The pattern we are looking for is this:
//
// arr
//   .map(x => x + 1)
//   .filter(x => x > 10)
//   .some(x => x % 2)
//
// The way it is structured in the AST is via a nested sequence of
// MemberExpression and CallExpression. We need to traverse the AST
// and make groups out of it to print it in the desired way.
function printMemberChain(path$$1, options, print) {
  // The first phase is to linearize the AST by traversing it down.
  //
  //   a().b()
  // has the following AST structure:
  //   CallExpression(MemberExpression(CallExpression(Identifier)))
  // and we transform it into
  //   [Identifier, CallExpression, MemberExpression, CallExpression]
  const printedNodes = [];

  // Here we try to retain one typed empty line after each call expression or
  // the first group whether it is in parentheses or not
  function shouldInsertEmptyLineAfter(node) {
    const originalText = options.originalText;
    const nextCharIndex = utilShared.getNextNonSpaceNonCommentCharacterIndex(
      originalText,
      node,
      options
    );
    const nextChar = originalText.charAt(nextCharIndex);

    // if it is cut off by a parenthesis, we only account for one typed empty
    // line after that parenthesis
    if (nextChar == ")") {
      return utilShared.isNextLineEmptyAfterIndex(
        originalText,
        nextCharIndex + 1,
        options
      );
    }

    return utilShared.isNextLineEmpty(originalText, node, options);
  }

  function rec(path$$1) {
    const node = path$$1.getValue();
    if (
      (node.type === "CallExpression" ||
        node.type === "OptionalCallExpression") &&
      (isMemberish(node.callee) ||
        node.callee.type === "CallExpression" ||
        node.callee.type === "OptionalCallExpression")
    ) {
      printedNodes.unshift({
        node: node,
        printed: concat([
          comments.printComments(
            path$$1,
            () =>
              concat([
                printOptionalToken(path$$1),
                printFunctionTypeParameters(path$$1, options, print),
                printArgumentsList(path$$1, options, print)
              ]),
            options
          ),
          shouldInsertEmptyLineAfter(node) ? hardline : ""
        ])
      });
      path$$1.call(callee => rec(callee), "callee");
    } else if (isMemberish(node)) {
      printedNodes.unshift({
        node: node,
        printed: comments.printComments(
          path$$1,
          () =>
            node.type === "OptionalMemberExpression" ||
            node.type === "MemberExpression"
              ? printMemberLookup(path$$1, options, print)
              : printBindExpressionCallee(path$$1, options, print),
          options
        )
      });
      path$$1.call(object => rec(object), "object");
    } else if (node.type === "TSNonNullExpression") {
      printedNodes.unshift({
        node: node,
        printed: comments.printComments(path$$1, () => "!", options)
      });
      path$$1.call(expression => rec(expression), "expression");
    } else {
      printedNodes.unshift({
        node: node,
        printed: path$$1.call(print)
      });
    }
  }
  // Note: the comments of the root node have already been printed, so we
  // need to extract this first call without printing them as they would
  // if handled inside of the recursive call.
  const node = path$$1.getValue();
  printedNodes.unshift({
    node,
    printed: concat([
      printOptionalToken(path$$1),
      printFunctionTypeParameters(path$$1, options, print),
      printArgumentsList(path$$1, options, print)
    ])
  });
  path$$1.call(callee => rec(callee), "callee");

  // Once we have a linear list of printed nodes, we want to create groups out
  // of it.
  //
  //   a().b.c().d().e
  // will be grouped as
  //   [
  //     [Identifier, CallExpression],
  //     [MemberExpression, MemberExpression, CallExpression],
  //     [MemberExpression, CallExpression],
  //     [MemberExpression],
  //   ]
  // so that we can print it as
  //   a()
  //     .b.c()
  //     .d()
  //     .e

  // The first group is the first node followed by
  //   - as many CallExpression as possible
  //       < fn()()() >.something()
  //   - as many array acessors as possible
  //       < fn()[0][1][2] >.something()
  //   - then, as many MemberExpression as possible but the last one
  //       < this.items >.something()
  const groups = [];
  let currentGroup = [printedNodes[0]];
  let i = 1;
  for (; i < printedNodes.length; ++i) {
    if (
      printedNodes[i].node.type === "TSNonNullExpression" ||
      printedNodes[i].node.type === "OptionalCallExpression" ||
      printedNodes[i].node.type === "CallExpression" ||
      ((printedNodes[i].node.type === "MemberExpression" ||
        printedNodes[i].node.type === "OptionalMemberExpression") &&
        printedNodes[i].node.computed &&
        isNumericLiteral(printedNodes[i].node.property))
    ) {
      currentGroup.push(printedNodes[i]);
    } else {
      break;
    }
  }
  if (
    printedNodes[0].node.type !== "CallExpression" &&
    printedNodes[0].node.type !== "OptionalCallExpression"
  ) {
    for (; i + 1 < printedNodes.length; ++i) {
      if (
        isMemberish(printedNodes[i].node) &&
        isMemberish(printedNodes[i + 1].node)
      ) {
        currentGroup.push(printedNodes[i]);
      } else {
        break;
      }
    }
  }
  groups.push(currentGroup);
  currentGroup = [];

  // Then, each following group is a sequence of MemberExpression followed by
  // a sequence of CallExpression. To compute it, we keep adding things to the
  // group until we has seen a CallExpression in the past and reach a
  // MemberExpression
  let hasSeenCallExpression = false;
  for (; i < printedNodes.length; ++i) {
    if (hasSeenCallExpression && isMemberish(printedNodes[i].node)) {
      // [0] should be appended at the end of the group instead of the
      // beginning of the next one
      if (
        printedNodes[i].node.computed &&
        isNumericLiteral(printedNodes[i].node.property)
      ) {
        currentGroup.push(printedNodes[i]);
        continue;
      }

      groups.push(currentGroup);
      currentGroup = [];
      hasSeenCallExpression = false;
    }

    if (
      printedNodes[i].node.type === "CallExpression" ||
      printedNodes[i].node.type === "OptionalCallExpression"
    ) {
      hasSeenCallExpression = true;
    }
    currentGroup.push(printedNodes[i]);

    if (
      printedNodes[i].node.comments &&
      printedNodes[i].node.comments.some(comment => comment.trailing)
    ) {
      groups.push(currentGroup);
      currentGroup = [];
      hasSeenCallExpression = false;
    }
  }
  if (currentGroup.length > 0) {
    groups.push(currentGroup);
  }

  // There are cases like Object.keys(), Observable.of(), _.values() where
  // they are the subject of all the chained calls and therefore should
  // be kept on the same line:
  //
  //   Object.keys(items)
  //     .filter(x => x)
  //     .map(x => x)
  //
  // In order to detect those cases, we use an heuristic: if the first
  // node is an identifier with the name starting with a capital letter,
  // or shorter than tabWidth. The rationale is that they are likely
  // to be factories.
  function isNoWrap(name) {
    return name.match(/(^[A-Z])/) || name.length <= options.tabWidth;
  }
  const shouldMerge =
    groups.length >= 2 &&
    !groups[1][0].node.comments &&
    ((groups[0].length === 1 &&
      (groups[0][0].node.type === "ThisExpression" ||
        (groups[0][0].node.type === "Identifier" &&
          (isNoWrap(groups[0][0].node.name) ||
            (groups[1].length && groups[1][0].node.computed))))) ||
      (groups[0].length > 1 &&
        groups[0][groups[0].length - 1].node.type === "MemberExpression" &&
        groups[0][groups[0].length - 1].node.type ===
          "OptionalMemberExpression" &&
        groups[0][groups[0].length - 1].node.property.type === "Identifier" &&
        (isNoWrap(groups[0][groups[0].length - 1].node.property.name) ||
          (groups[1].length && groups[1][0].node.computed))));

  function printGroup(printedGroup) {
    return concat(printedGroup.map(tuple => tuple.printed));
  }

  function printIndentedGroup(groups) {
    if (groups.length === 0) {
      return "";
    }
    return indent(
      group(concat([hardline, join(hardline, groups.map(printGroup))]))
    );
  }

  const printedGroups = groups.map(printGroup);
  const oneLine = concat(printedGroups);

  const cutoff = shouldMerge ? 3 : 2;
  const flatGroups = groups
    .slice(0, cutoff)
    .reduce((res, group) => res.concat(group), []);

  const hasComment =
    flatGroups.slice(1, -1).some(node => hasLeadingComment(node.node)) ||
    flatGroups.slice(0, -1).some(node => hasTrailingComment(node.node)) ||
    (groups[cutoff] && hasLeadingComment(groups[cutoff][0].node));

  // If we only have a single `.`, we shouldn't do anything fancy and just
  // render everything concatenated together.
  if (groups.length <= cutoff && !hasComment) {
    return group(oneLine);
  }

  // Find out the last node in the first group and check if it has an
  // empty line after
  const lastNodeBeforeIndent = util$1.getLast(
    shouldMerge ? groups.slice(1, 2)[0] : groups[0]
  ).node;
  const shouldHaveEmptyLineBeforeIndent =
    lastNodeBeforeIndent.type !== "CallExpression" &&
    lastNodeBeforeIndent.type !== "OptionalCallExpression" &&
    shouldInsertEmptyLineAfter(lastNodeBeforeIndent);

  const expanded = concat([
    printGroup(groups[0]),
    shouldMerge ? concat(groups.slice(1, 2).map(printGroup)) : "",
    shouldHaveEmptyLineBeforeIndent ? hardline : "",
    printIndentedGroup(groups.slice(shouldMerge ? 2 : 1))
  ]);

  const callExpressionCount = printedNodes.filter(
    tuple =>
      tuple.node.type === "CallExpression" ||
      tuple.node.type === "OptionalCallExpression"
  ).length;

  // We don't want to print in one line if there's:
  //  * A comment.
  //  * 3 or more chained calls.
  //  * Any group but the last one has a hard line.
  // If the last group is a function it's okay to inline if it fits.
  if (
    hasComment ||
    callExpressionCount >= 3 ||
    printedGroups.slice(0, -1).some(willBreak)
  ) {
    return group(expanded);
  }

  return concat([
    // We only need to check `oneLine` because if `expanded` is chosen
    // that means that the parent group has already been broken
    // naturally
    willBreak(oneLine) || shouldHaveEmptyLineBeforeIndent ? breakParent : "",
    conditionalGroup([oneLine, expanded])
  ]);
}

function isJSXNode(node) {
  return (
    node.type === "JSXElement" ||
    node.type === "JSXFragment" ||
    node.type === "TSJsxFragment"
  );
}

function isEmptyJSXElement(node) {
  if (node.children.length === 0) {
    return true;
  }
  if (node.children.length > 1) {
    return false;
  }

  // if there is one text child and does not contain any meaningful text
  // we can treat the element as empty.
  const child = node.children[0];
  return isLiteral(child) && !isMeaningfulJSXText(child);
}

// Only space, newline, carriage return, and tab are treated as whitespace
// inside JSX.
const jsxWhitespaceChars = " \n\r\t";
const containsNonJsxWhitespaceRegex = new RegExp(
  "[^" + jsxWhitespaceChars + "]"
);
const matchJsxWhitespaceRegex = new RegExp("([" + jsxWhitespaceChars + "]+)");

// Meaningful if it contains non-whitespace characters,
// or it contains whitespace without a new line.
function isMeaningfulJSXText(node) {
  return (
    isLiteral(node) &&
    (containsNonJsxWhitespaceRegex.test(rawText(node)) ||
      !/\n/.test(rawText(node)))
  );
}

function conditionalExpressionChainContainsJSX(node) {
  return Boolean(getConditionalChainContents(node).find(isJSXNode));
}

// If we have nested conditional expressions, we want to print them in JSX mode
// if there's at least one JSXElement somewhere in the tree.
//
// A conditional expression chain like this should be printed in normal mode,
// because there aren't JSXElements anywhere in it:
//
// isA ? "A" : isB ? "B" : isC ? "C" : "Unknown";
//
// But a conditional expression chain like this should be printed in JSX mode,
// because there is a JSXElement in the last ConditionalExpression:
//
// isA ? "A" : isB ? "B" : isC ? "C" : <span className="warning">Unknown</span>;
//
// This type of ConditionalExpression chain is structured like this in the AST:
//
// ConditionalExpression {
//   test: ...,
//   consequent: ...,
//   alternate: ConditionalExpression {
//     test: ...,
//     consequent: ...,
//     alternate: ConditionalExpression {
//       test: ...,
//       consequent: ...,
//       alternate: ...,
//     }
//   }
// }
//
// We want to traverse over that shape and convert it into a flat structure so
// that we can find if there's a JSXElement somewhere inside.
function getConditionalChainContents(node) {
  // Given this code:
  //
  // // Using a ConditionalExpression as the consequent is uncommon, but should
  // // be handled.
  // A ? B : C ? D : E ? F ? G : H : I
  //
  // which has this AST:
  //
  // ConditionalExpression {
  //   test: Identifier(A),
  //   consequent: Identifier(B),
  //   alternate: ConditionalExpression {
  //     test: Identifier(C),
  //     consequent: Identifier(D),
  //     alternate: ConditionalExpression {
  //       test: Identifier(E),
  //       consequent: ConditionalExpression {
  //         test: Identifier(F),
  //         consequent: Identifier(G),
  //         alternate: Identifier(H),
  //       },
  //       alternate: Identifier(I),
  //     }
  //   }
  // }
  //
  // we should return this Array:
  //
  // [
  //   Identifier(A),
  //   Identifier(B),
  //   Identifier(C),
  //   Identifier(D),
  //   Identifier(E),
  //   Identifier(F),
  //   Identifier(G),
  //   Identifier(H),
  //   Identifier(I)
  // ];
  //
  // This loses the information about whether each node was the test,
  // consequent, or alternate, but we don't care about that here- we are only
  // flattening this structure to find if there's any JSXElements inside.
  const nonConditionalExpressions = [];

  function recurse(node) {
    if (node.type === "ConditionalExpression") {
      recurse(node.test);
      recurse(node.consequent);
      recurse(node.alternate);
    } else {
      nonConditionalExpressions.push(node);
    }
  }
  recurse(node);

  return nonConditionalExpressions;
}

// Detect an expression node representing `{" "}`
function isJSXWhitespaceExpression(node) {
  return (
    node.type === "JSXExpressionContainer" &&
    isLiteral(node.expression) &&
    node.expression.value === " " &&
    !node.expression.comments
  );
}

// JSX Children are strange, mostly for two reasons:
// 1. JSX reads newlines into string values, instead of skipping them like JS
// 2. up to one whitespace between elements within a line is significant,
//    but not between lines.
//
// Leading, trailing, and lone whitespace all need to
// turn themselves into the rather ugly `{' '}` when breaking.
//
// We print JSX using the `fill` doc primitive.
// This requires that we give it an array of alternating
// content and whitespace elements.
// To ensure this we add dummy `""` content elements as needed.
function printJSXChildren(path$$1, options, print, jsxWhitespace) {
  const n = path$$1.getValue();
  const children = [];

  // using `map` instead of `each` because it provides `i`
  path$$1.map((childPath, i) => {
    const child = childPath.getValue();
    if (isLiteral(child)) {
      const text = rawText(child);

      // Contains a non-whitespace character
      if (isMeaningfulJSXText(child)) {
        const words = text.split(matchJsxWhitespaceRegex);

        // Starts with whitespace
        if (words[0] === "") {
          children.push("");
          words.shift();
          if (/\n/.test(words[0])) {
            children.push(hardline);
          } else {
            children.push(jsxWhitespace);
          }
          words.shift();
        }

        let endWhitespace;
        // Ends with whitespace
        if (util$1.getLast(words) === "") {
          words.pop();
          endWhitespace = words.pop();
        }

        // This was whitespace only without a new line.
        if (words.length === 0) {
          return;
        }

        words.forEach((word, i) => {
          if (i % 2 === 1) {
            children.push(line$2);
          } else {
            children.push(word);
          }
        });

        if (endWhitespace !== undefined) {
          if (/\n/.test(endWhitespace)) {
            children.push(hardline);
          } else {
            children.push(jsxWhitespace);
          }
        } else {
          // Ideally this would be a `hardline` to allow a break between
          // tags and text.
          // Unfortunately Facebook have a custom translation pipeline
          // (https://github.com/prettier/prettier/issues/1581#issuecomment-300975032)
          // that uses the JSX syntax, but does not follow the React whitespace
          // rules.
          // Ensuring that we never have a break between tags and text in JSX
          // will allow Facebook to adopt Prettier without too much of an
          // adverse effect on formatting algorithm.
          children.push("");
        }
      } else if (/\n/.test(text)) {
        // Keep (up to one) blank line between tags/expressions/text.
        // Note: We don't keep blank lines between text elements.
        if (text.match(/\n/g).length > 1) {
          children.push("");
          children.push(hardline);
        }
      } else {
        children.push("");
        children.push(jsxWhitespace);
      }
    } else {
      const printedChild = print(childPath);
      children.push(printedChild);

      const next = n.children[i + 1];
      const directlyFollowedByMeaningfulText =
        next && isMeaningfulJSXText(next) && !/^[ \n\r\t]/.test(rawText(next));
      if (directlyFollowedByMeaningfulText) {
        // Potentially this could be a hardline as well.
        // See the comment above about the Facebook translation pipeline as
        // to why this is an empty string.
        children.push("");
      } else {
        children.push(hardline);
      }
    }
  }, "children");

  return children;
}

// JSX expands children from the inside-out, instead of the outside-in.
// This is both to break children before attributes,
// and to ensure that when children break, their parents do as well.
//
// Any element that is written without any newlines and fits on a single line
// is left that way.
// Not only that, any user-written-line containing multiple JSX siblings
// should also be kept on one line if possible,
// so each user-written-line is wrapped in its own group.
//
// Elements that contain newlines or don't fit on a single line (recursively)
// are fully-split, using hardline and shouldBreak: true.
//
// To support that case properly, all leading and trailing spaces
// are stripped from the list of children, and replaced with a single hardline.
function printJSXElement(path$$1, options, print) {
  const n = path$$1.getValue();

  // Turn <div></div> into <div />
  if (n.type === "JSXElement" && isEmptyJSXElement(n)) {
    n.openingElement.selfClosing = true;
    return path$$1.call(print, "openingElement");
  }

  const openingLines =
    n.type === "JSXElement"
      ? path$$1.call(print, "openingElement")
      : path$$1.call(print, "openingFragment");
  const closingLines =
    n.type === "JSXElement"
      ? path$$1.call(print, "closingElement")
      : path$$1.call(print, "closingFragment");

  if (
    n.children.length === 1 &&
    n.children[0].type === "JSXExpressionContainer" &&
    (n.children[0].expression.type === "TemplateLiteral" ||
      n.children[0].expression.type === "TaggedTemplateExpression")
  ) {
    return concat([
      openingLines,
      concat(path$$1.map(print, "children")),
      closingLines
    ]);
  }

  // Convert `{" "}` to text nodes containing a space.
  // This makes it easy to turn them into `jsxWhitespace` which
  // can then print as either a space or `{" "}` when breaking.
  n.children = n.children.map(child => {
    if (isJSXWhitespaceExpression(child)) {
      return {
        type: "JSXText",
        value: " ",
        raw: " "
      };
    }
    return child;
  });

  const containsTag = n.children.filter(isJSXNode).length > 0;
  const containsMultipleExpressions =
    n.children.filter(child => child.type === "JSXExpressionContainer").length >
    1;
  const containsMultipleAttributes =
    n.type === "JSXElement" && n.openingElement.attributes.length > 1;

  // Record any breaks. Should never go from true to false, only false to true.
  let forcedBreak =
    willBreak(openingLines) ||
    containsTag ||
    containsMultipleAttributes ||
    containsMultipleExpressions;

  const rawJsxWhitespace = options.singleQuote ? "{' '}" : '{" "}';
  const jsxWhitespace = ifBreak(concat([rawJsxWhitespace, softline]), " ");

  const children = printJSXChildren(path$$1, options, print, jsxWhitespace);

  const containsText =
    n.children.filter(child => isMeaningfulJSXText(child)).length > 0;

  // We can end up we multiple whitespace elements with empty string
  // content between them.
  // We need to remove empty whitespace and softlines before JSX whitespace
  // to get the correct output.
  for (let i = children.length - 2; i >= 0; i--) {
    const isPairOfEmptyStrings = children[i] === "" && children[i + 1] === "";
    const isPairOfHardlines =
      children[i] === hardline &&
      children[i + 1] === "" &&
      children[i + 2] === hardline;
    const isLineFollowedByJSXWhitespace =
      (children[i] === softline || children[i] === hardline) &&
      children[i + 1] === "" &&
      children[i + 2] === jsxWhitespace;
    const isJSXWhitespaceFollowedByLine =
      children[i] === jsxWhitespace &&
      children[i + 1] === "" &&
      (children[i + 2] === softline || children[i + 2] === hardline);
    const isDoubleJSXWhitespace =
      children[i] === jsxWhitespace &&
      children[i + 1] === "" &&
      children[i + 2] === jsxWhitespace;

    if (
      (isPairOfHardlines && containsText) ||
      isPairOfEmptyStrings ||
      isLineFollowedByJSXWhitespace ||
      isDoubleJSXWhitespace
    ) {
      children.splice(i, 2);
    } else if (isJSXWhitespaceFollowedByLine) {
      children.splice(i + 1, 2);
    }
  }

  // Trim trailing lines (or empty strings)
  while (
    children.length &&
    (isLineNext(util$1.getLast(children)) ||
      isEmpty(util$1.getLast(children)))
  ) {
    children.pop();
  }

  // Trim leading lines (or empty strings)
  while (
    children.length &&
    (isLineNext(children[0]) || isEmpty(children[0])) &&
    (isLineNext(children[1]) || isEmpty(children[1]))
  ) {
    children.shift();
    children.shift();
  }

  // Tweak how we format children if outputting this element over multiple lines.
  // Also detect whether we will force this element to output over multiple lines.
  const multilineChildren = [];
  children.forEach((child, i) => {
    // There are a number of situations where we need to ensure we display
    // whitespace as `{" "}` when outputting this element over multiple lines.
    if (child === jsxWhitespace) {
      if (i === 1 && children[i - 1] === "") {
        if (children.length === 2) {
          // Solitary whitespace
          multilineChildren.push(rawJsxWhitespace);
          return;
        }
        // Leading whitespace
        multilineChildren.push(concat([rawJsxWhitespace, hardline]));
        return;
      } else if (i === children.length - 1) {
        // Trailing whitespace
        multilineChildren.push(rawJsxWhitespace);
        return;
      } else if (children[i - 1] === "" && children[i - 2] === hardline) {
        // Whitespace after line break
        multilineChildren.push(rawJsxWhitespace);
        return;
      }
    }

    multilineChildren.push(child);

    if (willBreak(child)) {
      forcedBreak = true;
    }
  });

  // If there is text we use `fill` to fit as much onto each line as possible.
  // When there is no text (just tags and expressions) we use `group`
  // to output each on a separate line.
  const content = containsText
    ? fill(multilineChildren)
    : group(concat(multilineChildren), { shouldBreak: true });

  const multiLineElem = group(
    concat([
      openingLines,
      indent(concat([hardline, content])),
      hardline,
      closingLines
    ])
  );

  if (forcedBreak) {
    return multiLineElem;
  }

  return conditionalGroup([
    group(concat([openingLines, concat(children), closingLines])),
    multiLineElem
  ]);
}

function maybeWrapJSXElementInParens(path$$1, elem, options) {
  const parent = path$$1.getParentNode();
  if (!parent) {
    return elem;
  }

  const NO_WRAP_PARENTS = {
    ArrayExpression: true,
    JSXAttribute: true,
    JSXElement: true,
    JSXExpressionContainer: true,
    JSXFragment: true,
    TSJsxFragment: true,
    ExpressionStatement: true,
    CallExpression: true,
    OptionalCallExpression: true,
    ConditionalExpression: true
  };
  if (NO_WRAP_PARENTS[parent.type]) {
    return elem;
  }

  return group(
    concat([
      options.lenient ? "" : ifBreak("("),
      indent(concat([softline, elem])),
      softline,
      options.lenient ? "" : ifBreak(")")
    ])
  );
}

function isBinaryish(node) {
  return node.type === "BinaryExpression" || node.type === "LogicalExpression";
}

function isMemberish(node) {
  return (
    node.type === "MemberExpression" ||
    node.type === "OptionalMemberExpression" ||
    (node.type === "BindExpression" && node.object)
  );
}

function shouldInlineLogicalExpression(node) {
  if (node.type !== "LogicalExpression") {
    return false;
  }

  if (
    node.right.type === "ObjectExpression" &&
    node.right.properties.length !== 0
  ) {
    return true;
  }

  if (
    node.right.type === "ArrayExpression" &&
    node.right.elements.length !== 0
  ) {
    return true;
  }

  if (isJSXNode(node.right)) {
    return true;
  }

  return false;
}

// For binary expressions to be consistent, we need to group
// subsequent operators with the same precedence level under a single
// group. Otherwise they will be nested such that some of them break
// onto new lines but not all. Operators with the same precedence
// level should either all break or not. Because we group them by
// precedence level and the AST is structured based on precedence
// level, things are naturally broken up correctly, i.e. `&&` is
// broken before `+`.
function printBinaryishExpressions(
  path$$1,
  print,
  options,
  isNested,
  isInsideParenthesis
) {
  let parts = [];
  const node = path$$1.getValue();

  // We treat BinaryExpression and LogicalExpression nodes the same.
  if (isBinaryish(node)) {
    // Put all operators with the same precedence level in the same
    // group. The reason we only need to do this with the `left`
    // expression is because given an expression like `1 + 2 - 3`, it
    // is always parsed like `((1 + 2) - 3)`, meaning the `left` side
    // is where the rest of the expression will exist. Binary
    // expressions on the right side mean they have a difference
    // precedence level and should be treated as a separate group, so
    // print them normally. (This doesn't hold for the `**` operator,
    // which is unique in that it is right-associative.)
    if (util$1.shouldFlatten(node.operator, node.left.operator)) {
      // Flatten them out by recursively calling this function.
      parts = parts.concat(
        path$$1.call(
          left =>
            printBinaryishExpressions(
              left,
              print,
              options,
              /* isNested */ true,
              isInsideParenthesis
            ),
          "left"
        )
      );
    } else {
      parts.push(path$$1.call(print, "left"));
    }

    const shouldInline = shouldInlineLogicalExpression(node);
    const lineBeforeOperator = node.operator === "|>";

    const right = shouldInline
      ? concat([node.operator, " ", path$$1.call(print, "right")])
      : concat([
          lineBeforeOperator ? softline : "",
          node.operator,
          lineBeforeOperator ? " " : line$2,
          path$$1.call(print, "right")
        ]);

    // If there's only a single binary expression, we want to create a group
    // in order to avoid having a small right part like -1 be on its own line.
    const parent = path$$1.getParentNode();
    const shouldGroup =
      !(isInsideParenthesis && node.type === "LogicalExpression") &&
      parent.type !== node.type &&
      node.left.type !== node.type &&
      node.right.type !== node.type;

    parts.push(" ", shouldGroup ? group(right) : right);

    // The root comments are already printed, but we need to manually print
    // the other ones since we don't call the normal print on BinaryExpression,
    // only for the left and right parts
    if (isNested && node.comments) {
      parts = comments.printComments(path$$1, () => concat(parts), options);
    }
  } else {
    // Our stopping case. Simply print the node normally.
    parts.push(path$$1.call(print));
  }

  return parts;
}

function printAssignmentRight(leftNode, rightNode, printedRight, options) {
  if (hasLeadingOwnLineComment(options.originalText, rightNode, options)) {
    return indent(concat([hardline, printedRight]));
  }

  const canBreak =
    (isBinaryish(rightNode) && !shouldInlineLogicalExpression(rightNode)) ||
    (rightNode.type === "ConditionalExpression" &&
      isBinaryish(rightNode.test) &&
      !shouldInlineLogicalExpression(rightNode.test)) ||
    rightNode.type === "StringLiteralTypeAnnotation" ||
    ((leftNode.type === "Identifier" ||
      isStringLiteral(leftNode) ||
      leftNode.type === "MemberExpression") &&
      (isStringLiteral(rightNode) || isMemberExpressionChain(rightNode)));

  if (canBreak) {
    return indent(concat([line$2, printedRight]));
  }

  return concat([" ", printedRight]);
}

function printAssignment(
  leftNode,
  printedLeft,
  operator,
  rightNode,
  printedRight,
  options
) {
  if (!rightNode) {
    return printedLeft;
  }

  const printed = printAssignmentRight(
    leftNode,
    rightNode,
    printedRight,
    options
  );

  return group(concat([printedLeft, operator, printed]));
}

function printAssignmentOperator(operator, options) {
  return options.lenient && operator === "=" ? ":=" : operator;
}

function adjustClause(node, clause, options, forceSpace) {
  if (node.type === "EmptyStatement") {
    return ";";
  }

  if (
    node.type === "BlockStatement" ||
    forceSpace ||
    (options.lenient && node.type === "ExpressionStatement")
  ) {
    return concat([" ", clause]);
  }

  return indent(concat([line$2, clause]));
}

function nodeStr(node, options, isFlowOrTypeScriptDirectiveLiteral) {
  const raw = rawText(node);
  const isDirectiveLiteral =
    isFlowOrTypeScriptDirectiveLiteral || node.type === "DirectiveLiteral";
  return util$1.printString(raw, options, isDirectiveLiteral);
}

function printRegex(node) {
  const flags = node.flags
    .split("")
    .sort()
    .join("");
  return `/${node.pattern}/${flags}`;
}

function isLastStatement(path$$1) {
  const parent = path$$1.getParentNode();
  if (!parent) {
    return true;
  }
  const node = path$$1.getValue();
  const body = (parent.body || parent.consequent).filter(
    stmt => stmt.type !== "EmptyStatement"
  );
  return body && body[body.length - 1] === node;
}

function isSingleExpressionStatementInExpressionBlock(blockPath) {
  const parent = blockPath.getParentNode();
  if (
    parent == null ||
    (parent.type !== "ArrowFunctionExpression" &&
      parent.type !== "FunctionExpression")
  ) {
    return false;
  }
  const block = blockPath.getNode();
  const statements = (block.body || block.consequent).filter(
    stmt => stmt.type !== "EmptyStatement"
  );
  return (
    statements.length === 1 && statements[0].type === "ExpressionStatement"
  );
}

function hasLeadingComment(node) {
  return node.comments && node.comments.some(comment => comment.leading);
}

function hasTrailingComment(node) {
  return node.comments && node.comments.some(comment => comment.trailing);
}

function hasLeadingOwnLineComment(text, node, options) {
  if (isJSXNode(node)) {
    return util$1.hasNodeIgnoreComment(node);
  }

  const res =
    node.comments &&
    node.comments.some(
      comment =>
        comment.leading && util$1.hasNewline(text, options.locEnd(comment))
    );
  return res;
}

function hasNakedLeftSide(node) {
  return (
    node.type === "AssignmentExpression" ||
    node.type === "BinaryExpression" ||
    node.type === "LogicalExpression" ||
    node.type === "ConditionalExpression" ||
    node.type === "CallExpression" ||
    node.type === "OptionalCallExpression" ||
    node.type === "MemberExpression" ||
    node.type === "OptionalMemberExpression" ||
    node.type === "SequenceExpression" ||
    node.type === "TaggedTemplateExpression" ||
    (node.type === "BindExpression" && !node.object) ||
    (node.type === "UpdateExpression" && !node.prefix)
  );
}

function isFlowAnnotationComment(text, typeAnnotation, options) {
  const start = options.locStart(typeAnnotation);
  const end = util$1.skipWhitespace(text, options.locEnd(typeAnnotation));
  return text.substr(start, 2) === "/*" && text.substr(end, 2) === "*/";
}

function getLeftSide(node) {
  if (node.expressions) {
    return node.expressions[0];
  }
  return (
    node.left ||
    node.test ||
    node.callee ||
    node.object ||
    node.tag ||
    node.argument ||
    node.expression
  );
}

function getLeftSidePathName(path$$1, node) {
  if (node.expressions) {
    return ["expressions", 0];
  }
  if (node.left) {
    return ["left"];
  }
  if (node.test) {
    return ["test"];
  }
  if (node.callee) {
    return ["callee"];
  }
  if (node.object) {
    return ["object"];
  }
  if (node.tag) {
    return ["tag"];
  }
  if (node.argument) {
    return ["argument"];
  }
  if (node.expression) {
    return ["expression"];
  }
  throw new Error("Unexpected node has no left side", node);
}

function exprNeedsASIProtection(path$$1, options) {
  const node = path$$1.getValue();

  const maybeASIProblem =
    needsParens_1(path$$1, options) ||
    node.type === "ParenthesizedExpression" ||
    node.type === "TypeCastExpression" ||
    (node.type === "ArrowFunctionExpression" &&
      !shouldPrintParamsWithoutParens(path$$1, options)) ||
    node.type === "ArrayExpression" ||
    node.type === "ArrayPattern" ||
    (node.type === "UnaryExpression" &&
      node.prefix &&
      (node.operator === "+" || node.operator === "-")) ||
    node.type === "TemplateLiteral" ||
    node.type === "TemplateElement" ||
    isJSXNode(node) ||
    node.type === "BindExpression" ||
    node.type === "RegExpLiteral" ||
    (node.type === "Literal" && node.pattern) ||
    (node.type === "Literal" && node.regex);

  if (maybeASIProblem) {
    return true;
  }

  if (!hasNakedLeftSide(node)) {
    return false;
  }

  return path$$1.call.apply(
    path$$1,
    [childPath => exprNeedsASIProtection(childPath, options)].concat(
      getLeftSidePathName(path$$1, node)
    )
  );
}

function stmtNeedsASIProtection(path$$1, options) {
  const node = path$$1.getNode();

  if (node.type !== "ExpressionStatement") {
    return false;
  }

  return path$$1.call(
    childPath => exprNeedsASIProtection(childPath, options),
    "expression"
  );
}

function classPropMayCauseASIProblems(path$$1) {
  const node = path$$1.getNode();

  if (node.type !== "ClassProperty") {
    return false;
  }

  const name = node.key && node.key.name;

  // this isn't actually possible yet with most parsers available today
  // so isn't properly tested yet.
  if (
    (name === "static" || name === "get" || name === "set") &&
    !node.value &&
    !node.typeAnnotation
  ) {
    return true;
  }
}

function classChildNeedsASIProtection(node) {
  if (!node) {
    return;
  }

  if (!node.computed) {
    const name = node.key && node.key.name;
    if (name === "in" || name === "instanceof") {
      return true;
    }
  }
  switch (node.type) {
    case "ClassProperty":
    case "TSAbstractClassProperty":
      return node.computed;
    case "MethodDefinition": // Flow
    case "TSAbstractMethodDefinition": // TypeScript
    case "ClassMethod": {
      // Babylon
      const isAsync = node.value ? node.value.async : node.async;
      const isGenerator = node.value ? node.value.generator : node.generator;
      if (
        isAsync ||
        node.static ||
        node.kind === "get" ||
        node.kind === "set"
      ) {
        return false;
      }
      if (node.computed || isGenerator) {
        return true;
      }
      return false;
    }

    default:
      /* istanbul ignore next */
      return false;
  }
}

// This recurses the return argument, looking for the first token
// (the leftmost leaf node) and, if it (or its parents) has any
// leadingComments, returns true (so it can be wrapped in parens).
function returnArgumentHasLeadingComment(options, argument) {
  if (hasLeadingOwnLineComment(options.originalText, argument, options)) {
    return true;
  }

  if (hasNakedLeftSide(argument)) {
    let leftMost = argument;
    let newLeftMost;
    while ((newLeftMost = getLeftSide(leftMost))) {
      leftMost = newLeftMost;

      if (hasLeadingOwnLineComment(options.originalText, leftMost, options)) {
        return true;
      }
    }
  }

  return false;
}

function isMemberExpressionChain(node) {
  if (
    node.type !== "MemberExpression" &&
    node.type !== "OptionalMemberExpression"
  ) {
    return false;
  }
  if (node.object.type === "Identifier") {
    return true;
  }
  return isMemberExpressionChain(node.object);
}

// Hack to differentiate between the following two which have the same ast
// type T = { method: () => void };
// type T = { method(): void };
function isObjectTypePropertyAFunction(node, options) {
  return (
    node.type === "ObjectTypeProperty" &&
    node.value.type === "FunctionTypeAnnotation" &&
    !node.static &&
    !isFunctionNotation(node, options)
  );
}

// TODO: This is a bad hack and we need a better way to distinguish between
// arrow functions and otherwise
function isFunctionNotation(node, options) {
  return isGetterOrSetter(node) || sameLocStart(node, node.value, options);
}

function isGetterOrSetter(node) {
  return node.kind === "get" || node.kind === "set";
}

function sameLocStart(nodeA, nodeB, options) {
  return options.locStart(nodeA) === options.locStart(nodeB);
}

// Hack to differentiate between the following two which have the same ast
// declare function f(a): void;
// var f: (a) => void;
function isTypeAnnotationAFunction(node, options) {
  return (
    (node.type === "TypeAnnotation" || node.type === "TSTypeAnnotation") &&
    node.typeAnnotation.type === "FunctionTypeAnnotation" &&
    !node.static &&
    !sameLocStart(node, node.typeAnnotation, options)
  );
}

function isNodeStartingWithDeclare(node, options) {
  if (!(options.parser === "flow" || options.parser === "typescript")) {
    return false;
  }
  return (
    options.originalText
      .slice(0, options.locStart(node))
      .match(/declare[ \t]*$/) ||
    options.originalText
      .slice(node.range[0], node.range[1])
      .startsWith("declare ")
  );
}

function shouldHugType(node) {
  if (isObjectType(node)) {
    return true;
  }

  if (node.type === "UnionTypeAnnotation" || node.type === "TSUnionType") {
    const voidCount = node.types.filter(
      n =>
        n.type === "VoidTypeAnnotation" ||
        n.type === "TSVoidKeyword" ||
        n.type === "NullLiteralTypeAnnotation" ||
        n.type === "TSNullKeyword"
    ).length;

    const objectCount = node.types.filter(
      n =>
        n.type === "ObjectTypeAnnotation" ||
        n.type === "TSTypeLiteral" ||
        // This is a bit aggressive but captures Array<{x}>
        n.type === "GenericTypeAnnotation" ||
        n.type === "TSTypeReference"
    ).length;

    if (node.types.length - 1 === voidCount && objectCount > 0) {
      return true;
    }
  }

  return false;
}

function shouldHugArguments(fun) {
  return (
    fun &&
    fun.params &&
    fun.params.length === 1 &&
    !fun.params[0].comments &&
    (fun.params[0].type === "ObjectPattern" ||
      fun.params[0].type === "ArrayPattern" ||
      (fun.params[0].type === "Identifier" &&
        fun.params[0].typeAnnotation &&
        (fun.params[0].typeAnnotation.type === "TypeAnnotation" ||
          fun.params[0].typeAnnotation.type === "TSTypeAnnotation") &&
        isObjectType(fun.params[0].typeAnnotation.typeAnnotation)) ||
      (fun.params[0].type === "FunctionTypeParam" &&
        isObjectType(fun.params[0].typeAnnotation)) ||
      (fun.params[0].type === "AssignmentPattern" &&
        (fun.params[0].left.type === "ObjectPattern" ||
          fun.params[0].left.type === "ArrayPattern") &&
        (fun.params[0].right.type === "Identifier" ||
          (fun.params[0].right.type === "ObjectExpression" &&
            fun.params[0].right.properties.length === 0) ||
          (fun.params[0].right.type === "ArrayExpression" &&
            fun.params[0].right.elements.length === 0)))) &&
    !fun.rest
  );
}

function templateLiteralHasNewLines(template) {
  return template.quasis.some(quasi => quasi.value.raw.includes("\n"));
}

function isTemplateOnItsOwnLine(n, text, options) {
  return (
    ((n.type === "TemplateLiteral" && templateLiteralHasNewLines(n)) ||
      (n.type === "TaggedTemplateExpression" &&
        templateLiteralHasNewLines(n.quasi))) &&
    !util$1.hasNewline(text, options.locStart(n), { backwards: true })
  );
}

function printArrayItems(path$$1, options, printPath, print) {
  const printedElements = [];
  let separatorParts = [];

  path$$1.each(childPath => {
    printedElements.push(concat(separatorParts));
    printedElements.push(group(print(childPath)));

    separatorParts = [lineComma(options), line$2];
    if (
      childPath.getValue() &&
      utilShared.isNextLineEmpty(
        options.originalText,
        childPath.getValue(),
        options
      )
    ) {
      separatorParts.push(softline);
    }
  }, printPath);

  return concat(printedElements);
}

function hasDanglingComments(node) {
  return (
    node.comments &&
    node.comments.some(comment => !comment.leading && !comment.trailing)
  );
}

function needsHardlineAfterDanglingComment(node) {
  if (!node.comments) {
    return false;
  }
  const lastDanglingComment = util$1.getLast(
    node.comments.filter(comment => !comment.leading && !comment.trailing)
  );
  return (
    lastDanglingComment && !comments$2.isBlockComment(lastDanglingComment)
  );
}

function isLiteral(node) {
  return (
    node.type === "BooleanLiteral" ||
    node.type === "DirectiveLiteral" ||
    node.type === "Literal" ||
    node.type === "NullLiteral" ||
    node.type === "NumericLiteral" ||
    node.type === "RegExpLiteral" ||
    node.type === "StringLiteral" ||
    node.type === "TemplateLiteral" ||
    node.type === "TSTypeLiteral" ||
    node.type === "JSXText"
  );
}

function isNumericLiteral(node) {
  return (
    node.type === "NumericLiteral" ||
    (node.type === "Literal" && typeof node.value === "number")
  );
}

function isStringLiteral(node) {
  return (
    node.type === "StringLiteral" ||
    (node.type === "Literal" && typeof node.value === "string")
  );
}

function isObjectType(n) {
  return n.type === "ObjectTypeAnnotation" || n.type === "TSTypeLiteral";
}

// eg; `describe("some string", (done) => {})`
function isTestCall(n, parent) {
  const unitTestRe = /^(skip|(f|x)?(it|describe|test))$/;

  if (n.arguments.length === 1) {
    if (
      n.callee.type === "Identifier" &&
      n.callee.name === "async" &&
      parent &&
      parent.type === "CallExpression" &&
      isTestCall(parent)
    ) {
      return isFunctionOrArrowExpression(n.arguments[0].type);
    }

    if (isUnitTestSetUp(n)) {
      return (
        isFunctionOrArrowExpression(n.arguments[0].type) ||
        isIdentiferAsync(n.arguments[0])
      );
    }
  } else if (n.arguments.length === 2) {
    if (
      ((n.callee.type === "Identifier" && unitTestRe.test(n.callee.name)) ||
        isSkipOrOnlyBlock(n)) &&
      (isTemplateLiteral(n.arguments[0]) || isStringLiteral(n.arguments[0]))
    ) {
      return (
        (isFunctionOrArrowExpression(n.arguments[1].type) &&
          n.arguments[1].params.length <= 1) ||
        isIdentiferAsync(n.arguments[1])
      );
    }
  }
  return false;
}

function isSkipOrOnlyBlock(node) {
  const unitTestRe = /^(skip|(f|x)?(it|describe|test))$/;
  return (
    node.callee.type === "MemberExpression" &&
    node.callee.type === "OptionalMemberExpression" &&
    node.callee.object.type === "Identifier" &&
    node.callee.property.type === "Identifier" &&
    unitTestRe.test(node.callee.object.name) &&
    (node.callee.property.name === "only" ||
      node.callee.property.name === "skip")
  );
}

function isTemplateLiteral(node) {
  return node.type === "TemplateLiteral";
}

function isIdentiferAsync(node) {
  return (
    (node.type === "CallExpression" ||
      node.type === "OptionalCallExpression") &&
    node.callee.type === "Identifier" &&
    node.callee.name === "async"
  );
}

function isFunctionOrArrowExpression(type) {
  return type === "FunctionExpression" || type === "ArrowFunctionExpression";
}

function isUnitTestSetUp(n) {
  const unitTestSetUpRe = /^(before|after)(Each|All)$/;
  return (
    n.callee.type === "Identifier" &&
    unitTestSetUpRe.test(n.callee.name) &&
    n.arguments.length === 1
  );
}

function isTheOnlyJSXElementInMarkdown(options, path$$1) {
  if (options.parentParser !== "markdown") {
    return false;
  }

  const node = path$$1.getNode();

  if (!node.expression || !isJSXNode(node.expression)) {
    return false;
  }

  const parent = path$$1.getParentNode();

  return parent.type === "Program" && parent.body.length == 1;
}

function willPrintOwnComments(path$$1) {
  const node = path$$1.getValue();
  const parent = path$$1.getParentNode();

  return (
    ((node && isJSXNode(node)) ||
      (parent &&
        (parent.type === "JSXSpreadAttribute" ||
          parent.type === "JSXSpreadChild" ||
          parent.type === "UnionTypeAnnotation" ||
          parent.type === "TSUnionType" ||
          ((parent.type === "ClassDeclaration" ||
            parent.type === "ClassExpression") &&
            parent.superClass === node)))) &&
    !util$1.hasIgnoreComment(path$$1)
  );
}

function canAttachComment(node) {
  return (
    node.type &&
    node.type !== "CommentBlock" &&
    node.type !== "CommentLine" &&
    node.type !== "Line" &&
    node.type !== "Block" &&
    node.type !== "EmptyStatement" &&
    node.type !== "TemplateElement" &&
    node.type !== "Import" &&
    !(node.callee && node.callee.type === "Import")
  );
}

function printComment(commentPath, options) {
  const comment = commentPath.getValue();

  switch (comment.type) {
    case "CommentBlock":
    case "Block": {
      if (isJsDocComment(comment)) {
        const printed = printJsDocComment(comment);
        // We need to prevent an edge case of a previous trailing comment
        // printed as a `lineSuffix` which causes the comments to be
        // interleaved. See https://github.com/prettier/prettier/issues/4412
        if (
          comment.trailing &&
          !util$1.hasNewline(
            options.originalText,
            options.locStart(comment),
            { backwards: true }
          )
        ) {
          return concat([hardline, printed]);
        }
        return printed;
      }

      const isInsideFlowComment =
        options.originalText.substr(options.locEnd(comment) - 3, 3) === "*-/";

      return "/*" + comment.value + (isInsideFlowComment ? "*-/" : "*/");
    }
    case "CommentLine":
    case "Line":
      // Print shebangs with the proper comment characters
      if (
        options.originalText.slice(options.locStart(comment)).startsWith("#!")
      ) {
        return "#!" + comment.value.trimRight();
      }
      return "//" + comment.value.trimRight();
    default:
      throw new Error("Not a comment: " + JSON.stringify(comment));
  }
}

function isJsDocComment(comment) {
  const lines = comment.value.split("\n");
  return (
    lines.length > 1 &&
    lines.slice(0, lines.length - 1).every(line => line.trim()[0] === "*")
  );
}

function printJsDocComment(comment) {
  const lines = comment.value.split("\n");

  return concat([
    "/*",
    join(
      hardline,
      lines.map(
        (line, index) =>
          (index > 0 ? " " : "") +
          (index < lines.length - 1 ? line.trim() : line.trimLeft())
      )
    ),
    "*/"
  ]);
}

function rawText(node) {
  return node.extra ? node.extra.raw : node.raw;
}

var printerEstree = {
  print: genericPrint,
  embed: embed_1,
  insertPragma,
  massageAstNode: clean_1,
  hasPrettierIgnore,
  willPrintOwnComments,
  canAttachComment,
  printComment,
  isBlockComment: comments$2.isBlockComment,
  handleComments: {
    ownLine: comments$2.handleOwnLineComment,
    endOfLine: comments$2.handleEndOfLineComment,
    remaining: comments$2.handleRemainingComment
  }
};

const CATEGORY_JAVASCRIPT = "JavaScript";

// format based on https://github.com/prettier/prettier/blob/master/src/main/core-options.js
var options$3 = {
  arrowParens: {
    since: "1.9.0",
    category: CATEGORY_JAVASCRIPT,
    type: "choice",
    default: "avoid",
    description: "Include parentheses around a sole arrow function parameter.",
    choices: [
      {
        value: "avoid",
        description: "Omit parens when possible. Example: `x => x`"
      },
      {
        value: "always",
        description: "Always include parens. Example: `(x) => x`"
      }
    ]
  },
  bracketSpacing: {
    since: "0.0.0",
    category: CATEGORY_JAVASCRIPT,
    type: "boolean",
    default: true,
    description: "Print spaces between brackets.",
    oppositeDescription: "Do not print spaces between brackets."
  },
  jsxBracketSameLine: {
    since: "0.17.0",
    category: CATEGORY_JAVASCRIPT,
    type: "boolean",
    default: false,
    description: "Put > on the last line instead of at a new line."
  },
  lenient: {
    since: "1.0.0",
    category: CATEGORY_JAVASCRIPT,
    type: "boolean",
    default: false,
    description: "Print into lenient syntax.",
    oppositeDescription: "Do not print into lenient syntax"
  },
  lenientCompat: {
    since: "1.0.0",
    category: CATEGORY_JAVASCRIPT,
    type: "boolean",
    default: false,
    description: "Print into lenient JS-backwards compatible syntax.",
    oppositeDescription: "Print into full lenient syntax"
  },
  semi: {
    since: "1.0.0",
    category: CATEGORY_JAVASCRIPT,
    type: "boolean",
    default: true,
    description: "Print semicolons.",
    oppositeDescription:
      "Do not print semicolons, except at the beginning of lines which may need them."
  },
  singleQuote: {
    since: "0.0.0",
    category: CATEGORY_JAVASCRIPT,
    type: "boolean",
    default: false,
    description: "Use single quotes instead of double quotes."
  },
  trailingComma: {
    since: "0.0.0",
    category: CATEGORY_JAVASCRIPT,
    type: "choice",
    default: [
      { since: "0.0.0", value: false },
      { since: "0.19.0", value: "none" }
    ],
    description: "Print trailing commas wherever possible when multi-line.",
    choices: [
      { value: "none", description: "No trailing commas." },
      {
        value: "es5",
        description:
          "Trailing commas where valid in ES5 (objects, arrays, etc.)"
      },
      {
        value: "all",
        description:
          "Trailing commas wherever possible (including function arguments)."
      },
      { value: true, deprecated: "0.19.0", redirect: "es5" },
      { value: false, deprecated: "0.19.0", redirect: "none" }
    ]
  }
};

const hasPragma = pragma.hasPragma;



// Based on:
// https://github.com/github/linguist/blob/master/lib/linguist/languages.yml

const locStart$1 = function(node) {
  // Handle nodes with decorators. They should start at the first decorator
  if (
    node.declaration &&
    node.declaration.decorators &&
    node.declaration.decorators.length > 0
  ) {
    return locStart$1(node.declaration.decorators[0]);
  }
  if (node.decorators && node.decorators.length > 0) {
    return locStart$1(node.decorators[0]);
  }

  if (node.__location) {
    return node.__location.startOffset;
  }
  if (node.range) {
    return node.range[0];
  }
  if (typeof node.start === "number") {
    return node.start;
  }
  if (node.loc) {
    return node.loc.start;
  }
  return null;
};

const locEnd$1 = function(node) {
  const endNode = node.nodes && util$1.getLast(node.nodes);
  if (endNode && node.source && !node.source.end) {
    node = endNode;
  }

  let loc;
  if (node.range) {
    loc = node.range[1];
  } else if (typeof node.end === "number") {
    loc = node.end;
  }

  if (node.__location) {
    return node.__location.endOffset;
  }
  if (node.typeAnnotation) {
    return Math.max(loc, locEnd$1(node.typeAnnotation));
  }

  if (node.loc && !loc) {
    return node.loc.end;
  }

  return loc;
};

const languages = [
  {
    name: "JavaScript",
    since: "0.0.0",
    parsers: ["babylon", "flow"],
    group: "JavaScript",
    tmScope: "source.js",
    aceMode: "javascript",
    codemirrorMode: "javascript",
    codemirrorMimeType: "text/javascript",
    aliases: ["js", "node"],
    extensions: [
      ".js",
      "._js",
      ".bones",
      ".es",
      ".es6",
      ".frag",
      ".gs",
      ".jake",
      ".jsb",
      ".jscad",
      ".jsfl",
      ".jsm",
      ".jss",
      ".mjs",
      ".njs",
      ".pac",
      ".sjs",
      ".ssjs",
      ".xsjs",
      ".xsjslib"
    ],
    filenames: ["Jakefile"],
    linguistLanguageId: 183,
    vscodeLanguageIds: ["javascript"]
  },
  {
    name: "JSX",
    since: "0.0.0",
    parsers: ["babylon", "flow"],
    group: "JavaScript",
    extensions: [".jsx"],
    tmScope: "source.js.jsx",
    aceMode: "javascript",
    codemirrorMode: "jsx",
    codemirrorMimeType: "text/jsx",
    liguistLanguageId: 178,
    vscodeLanguageIds: ["javascriptreact"]
  },
  {
    name: "TypeScript",
    since: "1.4.0",
    parsers: ["typescript-eslint"],
    group: "JavaScript",
    aliases: ["ts"],
    extensions: [".ts", ".tsx"],
    tmScope: "source.ts",
    aceMode: "typescript",
    codemirrorMode: "javascript",
    codemirrorMimeType: "application/typescript",
    liguistLanguageId: 378,
    vscodeLanguageIds: ["typescript", "typescriptreact"]
  },
  {
    name: "JSON",
    since: "1.5.0",
    parsers: ["json"],
    group: "JavaScript",
    tmScope: "source.json",
    aceMode: "json",
    codemirrorMode: "javascript",
    codemirrorMimeType: "application/json",
    extensions: [".json", ".geojson", ".JSON-tmLanguage", ".topojson"],
    filenames: [
      ".arcconfig",
      ".jshintrc",
      ".eslintrc",
      ".prettierrc",
      "composer.lock",
      "mcmod.info"
    ],
    linguistLanguageId: 174,
    vscodeLanguageIds: ["json", "jsonc"]
  },
  {
    name: "JSON5",
    since: "1.13.0",
    parsers: ["json5"],
    group: "JavaScript",
    tmScope: "source.json",
    aceMode: "json",
    codemirrorMode: "javascript",
    codemirrorMimeType: "application/json",
    extensions: [".json5"],
    filenames: [".babelrc"],
    linguistLanguageId: 175,
    vscodeLanguageIds: ["json5"]
  }
];

const typescript = {
  get parse() {
    return eval("require")("./parser-typescript");
  },
  astFormat: "estree",
  hasPragma,
  locStart: locStart$1,
  locEnd: locEnd$1
};

const babylon$1 = {
  get parse() {
    return eval("require")("./parser-babylon");
  },
  astFormat: "estree",
  hasPragma,
  locStart: locStart$1,
  locEnd: locEnd$1
};

const parsers = {
  babylon: babylon$1,
  json: Object.assign({}, babylon$1, {
    hasPragma() {
      return true;
    }
  }),
  json5: babylon$1,
  flow: {
    get parse() {
      return eval("require")("./parser-flow");
    },
    astFormat: "estree",
    hasPragma,
    locStart: locStart$1,
    locEnd: locEnd$1
  },
  "typescript-eslint": typescript,
  // TODO: Delete this in 2.0
  typescript
};

const printers = {
  estree: printerEstree
};

var languageJs = {
  languages,
  options: options$3,
  parsers,
  printers
};

var jsTokens = createCommonjsModule(function (module, exports) {
// Copyright 2014, 2015, 2016, 2017 Simon Lydell
// License: MIT. (See LICENSE.)

Object.defineProperty(exports, "__esModule", {
  value: true
});

// This regex comes from regex.coffee, and is inserted here by generate-index.js
// (run `npm run build`).
exports.default = /((['"])(?:(?!\2|\\).|\\(?:\r\n|[\s\S]))*(\2)?|`(?:[^`\\$]|\\[\s\S]|\$(?!\{)|\$\{(?:[^{}]|\{[^}]*\}?)*\}?)*(`)?)|(\/\/.*)|(\/\*(?:[^*]|\*(?!\/))*(\*\/)?)|(\/(?!\*)(?:\[(?:(?![\]\\]).|\\.)*\]|(?![\/\]\\]).|\\.)+\/(?:(?!\s*(?:\b|[\u0080-\uFFFF$\\'"~({]|[+\-!](?!=)|\.?\d))|[gmiyu]{1,5}\b(?![\u0080-\uFFFF$\\]|\s*(?:[+\-*%&|^<>!=?({]|\/(?![\/*])))))|(0[xX][\da-fA-F]+|0[oO][0-7]+|0[bB][01]+|(?:\d*\.\d+|\d+\.?)(?:[eE][+-]?\d+)?)|((?!\d)(?:(?!\s)[$\w\u0080-\uFFFF]|\\u[\da-fA-F]{4}|\\u\{[\da-fA-F]+\})+)|(--|\+\+|&&|\|\||=>|\.{3}|(?:[+\-\/%&|^]|\*{1,2}|<{1,2}|>{1,3}|!=?|={1,2})=?|[?~.,:;[\](){}])|(\s+)|(^$|[\s\S])/g;

exports.matchToToken = function(match) {
  var token = {type: "invalid", value: match[0]};
       if (match[ 1]) token.type = "string" , token.closed = !!(match[3] || match[4]);
  else if (match[ 5]) token.type = "comment";
  else if (match[ 6]) token.type = "comment", token.closed = !!match[7];
  else if (match[ 8]) token.type = "regex";
  else if (match[ 9]) token.type = "number";
  else if (match[10]) token.type = "name";
  else if (match[11]) token.type = "punctuator";
  else if (match[12]) token.type = "whitespace";
  return token
};
});

unwrapExports(jsTokens);

var colorName = {
	"aliceblue": [240, 248, 255],
	"antiquewhite": [250, 235, 215],
	"aqua": [0, 255, 255],
	"aquamarine": [127, 255, 212],
	"azure": [240, 255, 255],
	"beige": [245, 245, 220],
	"bisque": [255, 228, 196],
	"black": [0, 0, 0],
	"blanchedalmond": [255, 235, 205],
	"blue": [0, 0, 255],
	"blueviolet": [138, 43, 226],
	"brown": [165, 42, 42],
	"burlywood": [222, 184, 135],
	"cadetblue": [95, 158, 160],
	"chartreuse": [127, 255, 0],
	"chocolate": [210, 105, 30],
	"coral": [255, 127, 80],
	"cornflowerblue": [100, 149, 237],
	"cornsilk": [255, 248, 220],
	"crimson": [220, 20, 60],
	"cyan": [0, 255, 255],
	"darkblue": [0, 0, 139],
	"darkcyan": [0, 139, 139],
	"darkgoldenrod": [184, 134, 11],
	"darkgray": [169, 169, 169],
	"darkgreen": [0, 100, 0],
	"darkgrey": [169, 169, 169],
	"darkkhaki": [189, 183, 107],
	"darkmagenta": [139, 0, 139],
	"darkolivegreen": [85, 107, 47],
	"darkorange": [255, 140, 0],
	"darkorchid": [153, 50, 204],
	"darkred": [139, 0, 0],
	"darksalmon": [233, 150, 122],
	"darkseagreen": [143, 188, 143],
	"darkslateblue": [72, 61, 139],
	"darkslategray": [47, 79, 79],
	"darkslategrey": [47, 79, 79],
	"darkturquoise": [0, 206, 209],
	"darkviolet": [148, 0, 211],
	"deeppink": [255, 20, 147],
	"deepskyblue": [0, 191, 255],
	"dimgray": [105, 105, 105],
	"dimgrey": [105, 105, 105],
	"dodgerblue": [30, 144, 255],
	"firebrick": [178, 34, 34],
	"floralwhite": [255, 250, 240],
	"forestgreen": [34, 139, 34],
	"fuchsia": [255, 0, 255],
	"gainsboro": [220, 220, 220],
	"ghostwhite": [248, 248, 255],
	"gold": [255, 215, 0],
	"goldenrod": [218, 165, 32],
	"gray": [128, 128, 128],
	"green": [0, 128, 0],
	"greenyellow": [173, 255, 47],
	"grey": [128, 128, 128],
	"honeydew": [240, 255, 240],
	"hotpink": [255, 105, 180],
	"indianred": [205, 92, 92],
	"indigo": [75, 0, 130],
	"ivory": [255, 255, 240],
	"khaki": [240, 230, 140],
	"lavender": [230, 230, 250],
	"lavenderblush": [255, 240, 245],
	"lawngreen": [124, 252, 0],
	"lemonchiffon": [255, 250, 205],
	"lightblue": [173, 216, 230],
	"lightcoral": [240, 128, 128],
	"lightcyan": [224, 255, 255],
	"lightgoldenrodyellow": [250, 250, 210],
	"lightgray": [211, 211, 211],
	"lightgreen": [144, 238, 144],
	"lightgrey": [211, 211, 211],
	"lightpink": [255, 182, 193],
	"lightsalmon": [255, 160, 122],
	"lightseagreen": [32, 178, 170],
	"lightskyblue": [135, 206, 250],
	"lightslategray": [119, 136, 153],
	"lightslategrey": [119, 136, 153],
	"lightsteelblue": [176, 196, 222],
	"lightyellow": [255, 255, 224],
	"lime": [0, 255, 0],
	"limegreen": [50, 205, 50],
	"linen": [250, 240, 230],
	"magenta": [255, 0, 255],
	"maroon": [128, 0, 0],
	"mediumaquamarine": [102, 205, 170],
	"mediumblue": [0, 0, 205],
	"mediumorchid": [186, 85, 211],
	"mediumpurple": [147, 112, 219],
	"mediumseagreen": [60, 179, 113],
	"mediumslateblue": [123, 104, 238],
	"mediumspringgreen": [0, 250, 154],
	"mediumturquoise": [72, 209, 204],
	"mediumvioletred": [199, 21, 133],
	"midnightblue": [25, 25, 112],
	"mintcream": [245, 255, 250],
	"mistyrose": [255, 228, 225],
	"moccasin": [255, 228, 181],
	"navajowhite": [255, 222, 173],
	"navy": [0, 0, 128],
	"oldlace": [253, 245, 230],
	"olive": [128, 128, 0],
	"olivedrab": [107, 142, 35],
	"orange": [255, 165, 0],
	"orangered": [255, 69, 0],
	"orchid": [218, 112, 214],
	"palegoldenrod": [238, 232, 170],
	"palegreen": [152, 251, 152],
	"paleturquoise": [175, 238, 238],
	"palevioletred": [219, 112, 147],
	"papayawhip": [255, 239, 213],
	"peachpuff": [255, 218, 185],
	"peru": [205, 133, 63],
	"pink": [255, 192, 203],
	"plum": [221, 160, 221],
	"powderblue": [176, 224, 230],
	"purple": [128, 0, 128],
	"rebeccapurple": [102, 51, 153],
	"red": [255, 0, 0],
	"rosybrown": [188, 143, 143],
	"royalblue": [65, 105, 225],
	"saddlebrown": [139, 69, 19],
	"salmon": [250, 128, 114],
	"sandybrown": [244, 164, 96],
	"seagreen": [46, 139, 87],
	"seashell": [255, 245, 238],
	"sienna": [160, 82, 45],
	"silver": [192, 192, 192],
	"skyblue": [135, 206, 235],
	"slateblue": [106, 90, 205],
	"slategray": [112, 128, 144],
	"slategrey": [112, 128, 144],
	"snow": [255, 250, 250],
	"springgreen": [0, 255, 127],
	"steelblue": [70, 130, 180],
	"tan": [210, 180, 140],
	"teal": [0, 128, 128],
	"thistle": [216, 191, 216],
	"tomato": [255, 99, 71],
	"turquoise": [64, 224, 208],
	"violet": [238, 130, 238],
	"wheat": [245, 222, 179],
	"white": [255, 255, 255],
	"whitesmoke": [245, 245, 245],
	"yellow": [255, 255, 0],
	"yellowgreen": [154, 205, 50]
};

var conversions = createCommonjsModule(function (module) {
/* MIT license */


// NOTE: conversions should only return primitive values (i.e. arrays, or
//       values that give correct `typeof` results).
//       do not use box values types (i.e. Number(), String(), etc.)

var reverseKeywords = {};
for (var key in colorName) {
	if (colorName.hasOwnProperty(key)) {
		reverseKeywords[colorName[key]] = key;
	}
}

var convert = module.exports = {
	rgb: {channels: 3, labels: 'rgb'},
	hsl: {channels: 3, labels: 'hsl'},
	hsv: {channels: 3, labels: 'hsv'},
	hwb: {channels: 3, labels: 'hwb'},
	cmyk: {channels: 4, labels: 'cmyk'},
	xyz: {channels: 3, labels: 'xyz'},
	lab: {channels: 3, labels: 'lab'},
	lch: {channels: 3, labels: 'lch'},
	hex: {channels: 1, labels: ['hex']},
	keyword: {channels: 1, labels: ['keyword']},
	ansi16: {channels: 1, labels: ['ansi16']},
	ansi256: {channels: 1, labels: ['ansi256']},
	hcg: {channels: 3, labels: ['h', 'c', 'g']},
	apple: {channels: 3, labels: ['r16', 'g16', 'b16']},
	gray: {channels: 1, labels: ['gray']}
};

// hide .channels and .labels properties
for (var model in convert) {
	if (convert.hasOwnProperty(model)) {
		if (!('channels' in convert[model])) {
			throw new Error('missing channels property: ' + model);
		}

		if (!('labels' in convert[model])) {
			throw new Error('missing channel labels property: ' + model);
		}

		if (convert[model].labels.length !== convert[model].channels) {
			throw new Error('channel and label counts mismatch: ' + model);
		}

		var channels = convert[model].channels;
		var labels = convert[model].labels;
		delete convert[model].channels;
		delete convert[model].labels;
		Object.defineProperty(convert[model], 'channels', {value: channels});
		Object.defineProperty(convert[model], 'labels', {value: labels});
	}
}

convert.rgb.hsl = function (rgb) {
	var r = rgb[0] / 255;
	var g = rgb[1] / 255;
	var b = rgb[2] / 255;
	var min = Math.min(r, g, b);
	var max = Math.max(r, g, b);
	var delta = max - min;
	var h;
	var s;
	var l;

	if (max === min) {
		h = 0;
	} else if (r === max) {
		h = (g - b) / delta;
	} else if (g === max) {
		h = 2 + (b - r) / delta;
	} else if (b === max) {
		h = 4 + (r - g) / delta;
	}

	h = Math.min(h * 60, 360);

	if (h < 0) {
		h += 360;
	}

	l = (min + max) / 2;

	if (max === min) {
		s = 0;
	} else if (l <= 0.5) {
		s = delta / (max + min);
	} else {
		s = delta / (2 - max - min);
	}

	return [h, s * 100, l * 100];
};

convert.rgb.hsv = function (rgb) {
	var r = rgb[0];
	var g = rgb[1];
	var b = rgb[2];
	var min = Math.min(r, g, b);
	var max = Math.max(r, g, b);
	var delta = max - min;
	var h;
	var s;
	var v;

	if (max === 0) {
		s = 0;
	} else {
		s = (delta / max * 1000) / 10;
	}

	if (max === min) {
		h = 0;
	} else if (r === max) {
		h = (g - b) / delta;
	} else if (g === max) {
		h = 2 + (b - r) / delta;
	} else if (b === max) {
		h = 4 + (r - g) / delta;
	}

	h = Math.min(h * 60, 360);

	if (h < 0) {
		h += 360;
	}

	v = ((max / 255) * 1000) / 10;

	return [h, s, v];
};

convert.rgb.hwb = function (rgb) {
	var r = rgb[0];
	var g = rgb[1];
	var b = rgb[2];
	var h = convert.rgb.hsl(rgb)[0];
	var w = 1 / 255 * Math.min(r, Math.min(g, b));

	b = 1 - 1 / 255 * Math.max(r, Math.max(g, b));

	return [h, w * 100, b * 100];
};

convert.rgb.cmyk = function (rgb) {
	var r = rgb[0] / 255;
	var g = rgb[1] / 255;
	var b = rgb[2] / 255;
	var c;
	var m;
	var y;
	var k;

	k = Math.min(1 - r, 1 - g, 1 - b);
	c = (1 - r - k) / (1 - k) || 0;
	m = (1 - g - k) / (1 - k) || 0;
	y = (1 - b - k) / (1 - k) || 0;

	return [c * 100, m * 100, y * 100, k * 100];
};

/**
 * See https://en.m.wikipedia.org/wiki/Euclidean_distance#Squared_Euclidean_distance
 * */
function comparativeDistance(x, y) {
	return (
		Math.pow(x[0] - y[0], 2) +
		Math.pow(x[1] - y[1], 2) +
		Math.pow(x[2] - y[2], 2)
	);
}

convert.rgb.keyword = function (rgb) {
	var reversed = reverseKeywords[rgb];
	if (reversed) {
		return reversed;
	}

	var currentClosestDistance = Infinity;
	var currentClosestKeyword;

	for (var keyword in colorName) {
		if (colorName.hasOwnProperty(keyword)) {
			var value = colorName[keyword];

			// Compute comparative distance
			var distance = comparativeDistance(rgb, value);

			// Check if its less, if so set as closest
			if (distance < currentClosestDistance) {
				currentClosestDistance = distance;
				currentClosestKeyword = keyword;
			}
		}
	}

	return currentClosestKeyword;
};

convert.keyword.rgb = function (keyword) {
	return colorName[keyword];
};

convert.rgb.xyz = function (rgb) {
	var r = rgb[0] / 255;
	var g = rgb[1] / 255;
	var b = rgb[2] / 255;

	// assume sRGB
	r = r > 0.04045 ? Math.pow(((r + 0.055) / 1.055), 2.4) : (r / 12.92);
	g = g > 0.04045 ? Math.pow(((g + 0.055) / 1.055), 2.4) : (g / 12.92);
	b = b > 0.04045 ? Math.pow(((b + 0.055) / 1.055), 2.4) : (b / 12.92);

	var x = (r * 0.4124) + (g * 0.3576) + (b * 0.1805);
	var y = (r * 0.2126) + (g * 0.7152) + (b * 0.0722);
	var z = (r * 0.0193) + (g * 0.1192) + (b * 0.9505);

	return [x * 100, y * 100, z * 100];
};

convert.rgb.lab = function (rgb) {
	var xyz = convert.rgb.xyz(rgb);
	var x = xyz[0];
	var y = xyz[1];
	var z = xyz[2];
	var l;
	var a;
	var b;

	x /= 95.047;
	y /= 100;
	z /= 108.883;

	x = x > 0.008856 ? Math.pow(x, 1 / 3) : (7.787 * x) + (16 / 116);
	y = y > 0.008856 ? Math.pow(y, 1 / 3) : (7.787 * y) + (16 / 116);
	z = z > 0.008856 ? Math.pow(z, 1 / 3) : (7.787 * z) + (16 / 116);

	l = (116 * y) - 16;
	a = 500 * (x - y);
	b = 200 * (y - z);

	return [l, a, b];
};

convert.hsl.rgb = function (hsl) {
	var h = hsl[0] / 360;
	var s = hsl[1] / 100;
	var l = hsl[2] / 100;
	var t1;
	var t2;
	var t3;
	var rgb;
	var val;

	if (s === 0) {
		val = l * 255;
		return [val, val, val];
	}

	if (l < 0.5) {
		t2 = l * (1 + s);
	} else {
		t2 = l + s - l * s;
	}

	t1 = 2 * l - t2;

	rgb = [0, 0, 0];
	for (var i = 0; i < 3; i++) {
		t3 = h + 1 / 3 * -(i - 1);
		if (t3 < 0) {
			t3++;
		}
		if (t3 > 1) {
			t3--;
		}

		if (6 * t3 < 1) {
			val = t1 + (t2 - t1) * 6 * t3;
		} else if (2 * t3 < 1) {
			val = t2;
		} else if (3 * t3 < 2) {
			val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
		} else {
			val = t1;
		}

		rgb[i] = val * 255;
	}

	return rgb;
};

convert.hsl.hsv = function (hsl) {
	var h = hsl[0];
	var s = hsl[1] / 100;
	var l = hsl[2] / 100;
	var smin = s;
	var lmin = Math.max(l, 0.01);
	var sv;
	var v;

	l *= 2;
	s *= (l <= 1) ? l : 2 - l;
	smin *= lmin <= 1 ? lmin : 2 - lmin;
	v = (l + s) / 2;
	sv = l === 0 ? (2 * smin) / (lmin + smin) : (2 * s) / (l + s);

	return [h, sv * 100, v * 100];
};

convert.hsv.rgb = function (hsv) {
	var h = hsv[0] / 60;
	var s = hsv[1] / 100;
	var v = hsv[2] / 100;
	var hi = Math.floor(h) % 6;

	var f = h - Math.floor(h);
	var p = 255 * v * (1 - s);
	var q = 255 * v * (1 - (s * f));
	var t = 255 * v * (1 - (s * (1 - f)));
	v *= 255;

	switch (hi) {
		case 0:
			return [v, t, p];
		case 1:
			return [q, v, p];
		case 2:
			return [p, v, t];
		case 3:
			return [p, q, v];
		case 4:
			return [t, p, v];
		case 5:
			return [v, p, q];
	}
};

convert.hsv.hsl = function (hsv) {
	var h = hsv[0];
	var s = hsv[1] / 100;
	var v = hsv[2] / 100;
	var vmin = Math.max(v, 0.01);
	var lmin;
	var sl;
	var l;

	l = (2 - s) * v;
	lmin = (2 - s) * vmin;
	sl = s * vmin;
	sl /= (lmin <= 1) ? lmin : 2 - lmin;
	sl = sl || 0;
	l /= 2;

	return [h, sl * 100, l * 100];
};

// http://dev.w3.org/csswg/css-color/#hwb-to-rgb
convert.hwb.rgb = function (hwb) {
	var h = hwb[0] / 360;
	var wh = hwb[1] / 100;
	var bl = hwb[2] / 100;
	var ratio = wh + bl;
	var i;
	var v;
	var f;
	var n;

	// wh + bl cant be > 1
	if (ratio > 1) {
		wh /= ratio;
		bl /= ratio;
	}

	i = Math.floor(6 * h);
	v = 1 - bl;
	f = 6 * h - i;

	if ((i & 0x01) !== 0) {
		f = 1 - f;
	}

	n = wh + f * (v - wh); // linear interpolation

	var r;
	var g;
	var b;
	switch (i) {
		default:
		case 6:
		case 0: r = v; g = n; b = wh; break;
		case 1: r = n; g = v; b = wh; break;
		case 2: r = wh; g = v; b = n; break;
		case 3: r = wh; g = n; b = v; break;
		case 4: r = n; g = wh; b = v; break;
		case 5: r = v; g = wh; b = n; break;
	}

	return [r * 255, g * 255, b * 255];
};

convert.cmyk.rgb = function (cmyk) {
	var c = cmyk[0] / 100;
	var m = cmyk[1] / 100;
	var y = cmyk[2] / 100;
	var k = cmyk[3] / 100;
	var r;
	var g;
	var b;

	r = 1 - Math.min(1, c * (1 - k) + k);
	g = 1 - Math.min(1, m * (1 - k) + k);
	b = 1 - Math.min(1, y * (1 - k) + k);

	return [r * 255, g * 255, b * 255];
};

convert.xyz.rgb = function (xyz) {
	var x = xyz[0] / 100;
	var y = xyz[1] / 100;
	var z = xyz[2] / 100;
	var r;
	var g;
	var b;

	r = (x * 3.2406) + (y * -1.5372) + (z * -0.4986);
	g = (x * -0.9689) + (y * 1.8758) + (z * 0.0415);
	b = (x * 0.0557) + (y * -0.2040) + (z * 1.0570);

	// assume sRGB
	r = r > 0.0031308
		? ((1.055 * Math.pow(r, 1.0 / 2.4)) - 0.055)
		: r * 12.92;

	g = g > 0.0031308
		? ((1.055 * Math.pow(g, 1.0 / 2.4)) - 0.055)
		: g * 12.92;

	b = b > 0.0031308
		? ((1.055 * Math.pow(b, 1.0 / 2.4)) - 0.055)
		: b * 12.92;

	r = Math.min(Math.max(0, r), 1);
	g = Math.min(Math.max(0, g), 1);
	b = Math.min(Math.max(0, b), 1);

	return [r * 255, g * 255, b * 255];
};

convert.xyz.lab = function (xyz) {
	var x = xyz[0];
	var y = xyz[1];
	var z = xyz[2];
	var l;
	var a;
	var b;

	x /= 95.047;
	y /= 100;
	z /= 108.883;

	x = x > 0.008856 ? Math.pow(x, 1 / 3) : (7.787 * x) + (16 / 116);
	y = y > 0.008856 ? Math.pow(y, 1 / 3) : (7.787 * y) + (16 / 116);
	z = z > 0.008856 ? Math.pow(z, 1 / 3) : (7.787 * z) + (16 / 116);

	l = (116 * y) - 16;
	a = 500 * (x - y);
	b = 200 * (y - z);

	return [l, a, b];
};

convert.lab.xyz = function (lab) {
	var l = lab[0];
	var a = lab[1];
	var b = lab[2];
	var x;
	var y;
	var z;

	y = (l + 16) / 116;
	x = a / 500 + y;
	z = y - b / 200;

	var y2 = Math.pow(y, 3);
	var x2 = Math.pow(x, 3);
	var z2 = Math.pow(z, 3);
	y = y2 > 0.008856 ? y2 : (y - 16 / 116) / 7.787;
	x = x2 > 0.008856 ? x2 : (x - 16 / 116) / 7.787;
	z = z2 > 0.008856 ? z2 : (z - 16 / 116) / 7.787;

	x *= 95.047;
	y *= 100;
	z *= 108.883;

	return [x, y, z];
};

convert.lab.lch = function (lab) {
	var l = lab[0];
	var a = lab[1];
	var b = lab[2];
	var hr;
	var h;
	var c;

	hr = Math.atan2(b, a);
	h = hr * 360 / 2 / Math.PI;

	if (h < 0) {
		h += 360;
	}

	c = Math.sqrt(a * a + b * b);

	return [l, c, h];
};

convert.lch.lab = function (lch) {
	var l = lch[0];
	var c = lch[1];
	var h = lch[2];
	var a;
	var b;
	var hr;

	hr = h / 360 * 2 * Math.PI;
	a = c * Math.cos(hr);
	b = c * Math.sin(hr);

	return [l, a, b];
};

convert.rgb.ansi16 = function (args) {
	var r = args[0];
	var g = args[1];
	var b = args[2];
	var value = 1 in arguments ? arguments[1] : convert.rgb.hsv(args)[2]; // hsv -> ansi16 optimization

	value = Math.round(value / 50);

	if (value === 0) {
		return 30;
	}

	var ansi = 30
		+ ((Math.round(b / 255) << 2)
		| (Math.round(g / 255) << 1)
		| Math.round(r / 255));

	if (value === 2) {
		ansi += 60;
	}

	return ansi;
};

convert.hsv.ansi16 = function (args) {
	// optimization here; we already know the value and don't need to get
	// it converted for us.
	return convert.rgb.ansi16(convert.hsv.rgb(args), args[2]);
};

convert.rgb.ansi256 = function (args) {
	var r = args[0];
	var g = args[1];
	var b = args[2];

	// we use the extended greyscale palette here, with the exception of
	// black and white. normal palette only has 4 greyscale shades.
	if (r === g && g === b) {
		if (r < 8) {
			return 16;
		}

		if (r > 248) {
			return 231;
		}

		return Math.round(((r - 8) / 247) * 24) + 232;
	}

	var ansi = 16
		+ (36 * Math.round(r / 255 * 5))
		+ (6 * Math.round(g / 255 * 5))
		+ Math.round(b / 255 * 5);

	return ansi;
};

convert.ansi16.rgb = function (args) {
	var color = args % 10;

	// handle greyscale
	if (color === 0 || color === 7) {
		if (args > 50) {
			color += 3.5;
		}

		color = color / 10.5 * 255;

		return [color, color, color];
	}

	var mult = (~~(args > 50) + 1) * 0.5;
	var r = ((color & 1) * mult) * 255;
	var g = (((color >> 1) & 1) * mult) * 255;
	var b = (((color >> 2) & 1) * mult) * 255;

	return [r, g, b];
};

convert.ansi256.rgb = function (args) {
	// handle greyscale
	if (args >= 232) {
		var c = (args - 232) * 10 + 8;
		return [c, c, c];
	}

	args -= 16;

	var rem;
	var r = Math.floor(args / 36) / 5 * 255;
	var g = Math.floor((rem = args % 36) / 6) / 5 * 255;
	var b = (rem % 6) / 5 * 255;

	return [r, g, b];
};

convert.rgb.hex = function (args) {
	var integer = ((Math.round(args[0]) & 0xFF) << 16)
		+ ((Math.round(args[1]) & 0xFF) << 8)
		+ (Math.round(args[2]) & 0xFF);

	var string = integer.toString(16).toUpperCase();
	return '000000'.substring(string.length) + string;
};

convert.hex.rgb = function (args) {
	var match = args.toString(16).match(/[a-f0-9]{6}|[a-f0-9]{3}/i);
	if (!match) {
		return [0, 0, 0];
	}

	var colorString = match[0];

	if (match[0].length === 3) {
		colorString = colorString.split('').map(function (char) {
			return char + char;
		}).join('');
	}

	var integer = parseInt(colorString, 16);
	var r = (integer >> 16) & 0xFF;
	var g = (integer >> 8) & 0xFF;
	var b = integer & 0xFF;

	return [r, g, b];
};

convert.rgb.hcg = function (rgb) {
	var r = rgb[0] / 255;
	var g = rgb[1] / 255;
	var b = rgb[2] / 255;
	var max = Math.max(Math.max(r, g), b);
	var min = Math.min(Math.min(r, g), b);
	var chroma = (max - min);
	var grayscale;
	var hue;

	if (chroma < 1) {
		grayscale = min / (1 - chroma);
	} else {
		grayscale = 0;
	}

	if (chroma <= 0) {
		hue = 0;
	} else
	if (max === r) {
		hue = ((g - b) / chroma) % 6;
	} else
	if (max === g) {
		hue = 2 + (b - r) / chroma;
	} else {
		hue = 4 + (r - g) / chroma + 4;
	}

	hue /= 6;
	hue %= 1;

	return [hue * 360, chroma * 100, grayscale * 100];
};

convert.hsl.hcg = function (hsl) {
	var s = hsl[1] / 100;
	var l = hsl[2] / 100;
	var c = 1;
	var f = 0;

	if (l < 0.5) {
		c = 2.0 * s * l;
	} else {
		c = 2.0 * s * (1.0 - l);
	}

	if (c < 1.0) {
		f = (l - 0.5 * c) / (1.0 - c);
	}

	return [hsl[0], c * 100, f * 100];
};

convert.hsv.hcg = function (hsv) {
	var s = hsv[1] / 100;
	var v = hsv[2] / 100;

	var c = s * v;
	var f = 0;

	if (c < 1.0) {
		f = (v - c) / (1 - c);
	}

	return [hsv[0], c * 100, f * 100];
};

convert.hcg.rgb = function (hcg) {
	var h = hcg[0] / 360;
	var c = hcg[1] / 100;
	var g = hcg[2] / 100;

	if (c === 0.0) {
		return [g * 255, g * 255, g * 255];
	}

	var pure = [0, 0, 0];
	var hi = (h % 1) * 6;
	var v = hi % 1;
	var w = 1 - v;
	var mg = 0;

	switch (Math.floor(hi)) {
		case 0:
			pure[0] = 1; pure[1] = v; pure[2] = 0; break;
		case 1:
			pure[0] = w; pure[1] = 1; pure[2] = 0; break;
		case 2:
			pure[0] = 0; pure[1] = 1; pure[2] = v; break;
		case 3:
			pure[0] = 0; pure[1] = w; pure[2] = 1; break;
		case 4:
			pure[0] = v; pure[1] = 0; pure[2] = 1; break;
		default:
			pure[0] = 1; pure[1] = 0; pure[2] = w;
	}

	mg = (1.0 - c) * g;

	return [
		(c * pure[0] + mg) * 255,
		(c * pure[1] + mg) * 255,
		(c * pure[2] + mg) * 255
	];
};

convert.hcg.hsv = function (hcg) {
	var c = hcg[1] / 100;
	var g = hcg[2] / 100;

	var v = c + g * (1.0 - c);
	var f = 0;

	if (v > 0.0) {
		f = c / v;
	}

	return [hcg[0], f * 100, v * 100];
};

convert.hcg.hsl = function (hcg) {
	var c = hcg[1] / 100;
	var g = hcg[2] / 100;

	var l = g * (1.0 - c) + 0.5 * c;
	var s = 0;

	if (l > 0.0 && l < 0.5) {
		s = c / (2 * l);
	} else
	if (l >= 0.5 && l < 1.0) {
		s = c / (2 * (1 - l));
	}

	return [hcg[0], s * 100, l * 100];
};

convert.hcg.hwb = function (hcg) {
	var c = hcg[1] / 100;
	var g = hcg[2] / 100;
	var v = c + g * (1.0 - c);
	return [hcg[0], (v - c) * 100, (1 - v) * 100];
};

convert.hwb.hcg = function (hwb) {
	var w = hwb[1] / 100;
	var b = hwb[2] / 100;
	var v = 1 - b;
	var c = v - w;
	var g = 0;

	if (c < 1) {
		g = (v - c) / (1 - c);
	}

	return [hwb[0], c * 100, g * 100];
};

convert.apple.rgb = function (apple) {
	return [(apple[0] / 65535) * 255, (apple[1] / 65535) * 255, (apple[2] / 65535) * 255];
};

convert.rgb.apple = function (rgb) {
	return [(rgb[0] / 255) * 65535, (rgb[1] / 255) * 65535, (rgb[2] / 255) * 65535];
};

convert.gray.rgb = function (args) {
	return [args[0] / 100 * 255, args[0] / 100 * 255, args[0] / 100 * 255];
};

convert.gray.hsl = convert.gray.hsv = function (args) {
	return [0, 0, args[0]];
};

convert.gray.hwb = function (gray) {
	return [0, 100, gray[0]];
};

convert.gray.cmyk = function (gray) {
	return [0, 0, 0, gray[0]];
};

convert.gray.lab = function (gray) {
	return [gray[0], 0, 0];
};

convert.gray.hex = function (gray) {
	var val = Math.round(gray[0] / 100 * 255) & 0xFF;
	var integer = (val << 16) + (val << 8) + val;

	var string = integer.toString(16).toUpperCase();
	return '000000'.substring(string.length) + string;
};

convert.rgb.gray = function (rgb) {
	var val = (rgb[0] + rgb[1] + rgb[2]) / 3;
	return [val / 255 * 100];
};
});

/*
	this function routes a model to all other models.

	all functions that are routed have a property `.conversion` attached
	to the returned synthetic function. This property is an array
	of strings, each with the steps in between the 'from' and 'to'
	color models (inclusive).

	conversions that are not possible simply are not included.
*/

// https://jsperf.com/object-keys-vs-for-in-with-closure/3
var models$1 = Object.keys(conversions);

function buildGraph() {
	var graph = {};

	for (var len = models$1.length, i = 0; i < len; i++) {
		graph[models$1[i]] = {
			// http://jsperf.com/1-vs-infinity
			// micro-opt, but this is simple.
			distance: -1,
			parent: null
		};
	}

	return graph;
}

// https://en.wikipedia.org/wiki/Breadth-first_search
function deriveBFS(fromModel) {
	var graph = buildGraph();
	var queue = [fromModel]; // unshift -> queue -> pop

	graph[fromModel].distance = 0;

	while (queue.length) {
		var current = queue.pop();
		var adjacents = Object.keys(conversions[current]);

		for (var len = adjacents.length, i = 0; i < len; i++) {
			var adjacent = adjacents[i];
			var node = graph[adjacent];

			if (node.distance === -1) {
				node.distance = graph[current].distance + 1;
				node.parent = current;
				queue.unshift(adjacent);
			}
		}
	}

	return graph;
}

function link(from, to) {
	return function (args) {
		return to(from(args));
	};
}

function wrapConversion(toModel, graph) {
	var path$$1 = [graph[toModel].parent, toModel];
	var fn = conversions[graph[toModel].parent][toModel];

	var cur = graph[toModel].parent;
	while (graph[cur].parent) {
		path$$1.unshift(graph[cur].parent);
		fn = link(conversions[graph[cur].parent][cur], fn);
		cur = graph[cur].parent;
	}

	fn.conversion = path$$1;
	return fn;
}

var route = function (fromModel) {
	var graph = deriveBFS(fromModel);
	var conversion = {};

	var models = Object.keys(graph);
	for (var len = models.length, i = 0; i < len; i++) {
		var toModel = models[i];
		var node = graph[toModel];

		if (node.parent === null) {
			// no possible conversion, or this node is the source model.
			continue;
		}

		conversion[toModel] = wrapConversion(toModel, graph);
	}

	return conversion;
};

var convert = {};

var models = Object.keys(conversions);

function wrapRaw(fn) {
	var wrappedFn = function (args) {
		if (args === undefined || args === null) {
			return args;
		}

		if (arguments.length > 1) {
			args = Array.prototype.slice.call(arguments);
		}

		return fn(args);
	};

	// preserve .conversion property if there is one
	if ('conversion' in fn) {
		wrappedFn.conversion = fn.conversion;
	}

	return wrappedFn;
}

function wrapRounded(fn) {
	var wrappedFn = function (args) {
		if (args === undefined || args === null) {
			return args;
		}

		if (arguments.length > 1) {
			args = Array.prototype.slice.call(arguments);
		}

		var result = fn(args);

		// we're assuming the result is an array here.
		// see notice in conversions.js; don't use box types
		// in conversion functions.
		if (typeof result === 'object') {
			for (var len = result.length, i = 0; i < len; i++) {
				result[i] = Math.round(result[i]);
			}
		}

		return result;
	};

	// preserve .conversion property if there is one
	if ('conversion' in fn) {
		wrappedFn.conversion = fn.conversion;
	}

	return wrappedFn;
}

models.forEach(function (fromModel) {
	convert[fromModel] = {};

	Object.defineProperty(convert[fromModel], 'channels', {value: conversions[fromModel].channels});
	Object.defineProperty(convert[fromModel], 'labels', {value: conversions[fromModel].labels});

	var routes = route(fromModel);
	var routeModels = Object.keys(routes);

	routeModels.forEach(function (toModel) {
		var fn = routes[toModel];

		convert[fromModel][toModel] = wrapRounded(fn);
		convert[fromModel][toModel].raw = wrapRaw(fn);
	});
});

var colorConvert = convert;

var ansiStyles = createCommonjsModule(function (module) {
'use strict';


const wrapAnsi16 = (fn, offset) => function () {
	const code = fn.apply(colorConvert, arguments);
	return `\u001B[${code + offset}m`;
};

const wrapAnsi256 = (fn, offset) => function () {
	const code = fn.apply(colorConvert, arguments);
	return `\u001B[${38 + offset};5;${code}m`;
};

const wrapAnsi16m = (fn, offset) => function () {
	const rgb = fn.apply(colorConvert, arguments);
	return `\u001B[${38 + offset};2;${rgb[0]};${rgb[1]};${rgb[2]}m`;
};

function assembleStyles() {
	const styles = {
		modifier: {
			reset: [0, 0],
			// 21 isn't widely supported and 22 does the same thing
			bold: [1, 22],
			dim: [2, 22],
			italic: [3, 23],
			underline: [4, 24],
			inverse: [7, 27],
			hidden: [8, 28],
			strikethrough: [9, 29]
		},
		color: {
			black: [30, 39],
			red: [31, 39],
			green: [32, 39],
			yellow: [33, 39],
			blue: [34, 39],
			magenta: [35, 39],
			cyan: [36, 39],
			white: [37, 39],
			gray: [90, 39],

			// Bright color
			redBright: [91, 39],
			greenBright: [92, 39],
			yellowBright: [93, 39],
			blueBright: [94, 39],
			magentaBright: [95, 39],
			cyanBright: [96, 39],
			whiteBright: [97, 39]
		},
		bgColor: {
			bgBlack: [40, 49],
			bgRed: [41, 49],
			bgGreen: [42, 49],
			bgYellow: [43, 49],
			bgBlue: [44, 49],
			bgMagenta: [45, 49],
			bgCyan: [46, 49],
			bgWhite: [47, 49],

			// Bright color
			bgBlackBright: [100, 49],
			bgRedBright: [101, 49],
			bgGreenBright: [102, 49],
			bgYellowBright: [103, 49],
			bgBlueBright: [104, 49],
			bgMagentaBright: [105, 49],
			bgCyanBright: [106, 49],
			bgWhiteBright: [107, 49]
		}
	};

	// Fix humans
	styles.color.grey = styles.color.gray;

	Object.keys(styles).forEach(groupName => {
		const group = styles[groupName];

		Object.keys(group).forEach(styleName => {
			const style = group[styleName];

			styles[styleName] = {
				open: `\u001B[${style[0]}m`,
				close: `\u001B[${style[1]}m`
			};

			group[styleName] = styles[styleName];
		});

		Object.defineProperty(styles, groupName, {
			value: group,
			enumerable: false
		});
	});

	const rgb2rgb = (r, g, b) => [r, g, b];

	styles.color.close = '\u001B[39m';
	styles.bgColor.close = '\u001B[49m';

	styles.color.ansi = {};
	styles.color.ansi256 = {};
	styles.color.ansi16m = {
		rgb: wrapAnsi16m(rgb2rgb, 0)
	};

	styles.bgColor.ansi = {};
	styles.bgColor.ansi256 = {};
	styles.bgColor.ansi16m = {
		rgb: wrapAnsi16m(rgb2rgb, 10)
	};

	for (const key of Object.keys(colorConvert)) {
		if (typeof colorConvert[key] !== 'object') {
			continue;
		}

		const suite = colorConvert[key];

		if ('ansi16' in suite) {
			styles.color.ansi[key] = wrapAnsi16(suite.ansi16, 0);
			styles.bgColor.ansi[key] = wrapAnsi16(suite.ansi16, 10);
		}

		if ('ansi256' in suite) {
			styles.color.ansi256[key] = wrapAnsi256(suite.ansi256, 0);
			styles.bgColor.ansi256[key] = wrapAnsi256(suite.ansi256, 10);
		}

		if ('rgb' in suite) {
			styles.color.ansi16m[key] = wrapAnsi16m(suite.rgb, 0);
			styles.bgColor.ansi16m[key] = wrapAnsi16m(suite.rgb, 10);
		}
	}

	return styles;
}

Object.defineProperty(module, 'exports', {
	enumerable: true,
	get: assembleStyles
});
});

var hasFlag = function (flag, argv) {
	argv = argv || process.argv;

	var terminatorPos = argv.indexOf('--');
	var prefix = /^-{1,2}/.test(flag) ? '' : '--';
	var pos = argv.indexOf(prefix + flag);

	return pos !== -1 && (terminatorPos === -1 ? true : pos < terminatorPos);
};

var supportsColor = createCommonjsModule(function (module) {
'use strict';



const env = process.env;

const support = level => {
	if (level === 0) {
		return false;
	}

	return {
		level,
		hasBasic: true,
		has256: level >= 2,
		has16m: level >= 3
	};
};

let supportLevel = (() => {
	if (hasFlag('no-color') ||
		hasFlag('no-colors') ||
		hasFlag('color=false')) {
		return 0;
	}

	if (hasFlag('color=16m') ||
		hasFlag('color=full') ||
		hasFlag('color=truecolor')) {
		return 3;
	}

	if (hasFlag('color=256')) {
		return 2;
	}

	if (hasFlag('color') ||
		hasFlag('colors') ||
		hasFlag('color=true') ||
		hasFlag('color=always')) {
		return 1;
	}

	if (process.stdout && !process.stdout.isTTY) {
		return 0;
	}

	if (process.platform === 'win32') {
		// Node.js 7.5.0 is the first version of Node.js to include a patch to
		// libuv that enables 256 color output on Windows. Anything earlier and it
		// won't work. However, here we target Node.js 8 at minimum as it is an LTS
		// release, and Node.js 7 is not. Windows 10 build 10586 is the first Windows
		// release that supports 256 colors.
		const osRelease = os.release().split('.');
		if (
			Number(process.version.split('.')[0]) >= 8 &&
			Number(osRelease[0]) >= 10 &&
			Number(osRelease[2]) >= 10586
		) {
			return 2;
		}

		return 1;
	}

	if ('CI' in env) {
		if ('TRAVIS' in env || env.CI === 'Travis' || 'CIRCLECI' in env) {
			return 1;
		}

		return 0;
	}

	if ('TEAMCITY_VERSION' in env) {
		return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
	}

	if ('TERM_PROGRAM' in env) {
		const version = parseInt((env.TERM_PROGRAM_VERSION || '').split('.')[0], 10);

		switch (env.TERM_PROGRAM) {
			case 'iTerm.app':
				return version >= 3 ? 3 : 2;
			case 'Hyper':
				return 3;
			case 'Apple_Terminal':
				return 2;
			// No default
		}
	}

	if (/^(screen|xterm)-256(?:color)?/.test(env.TERM)) {
		return 2;
	}

	if (/^screen|^xterm|^vt100|color|ansi|cygwin|linux/i.test(env.TERM)) {
		return 1;
	}

	if ('COLORTERM' in env) {
		return 1;
	}

	if (env.TERM === 'dumb') {
		return 0;
	}

	return 0;
})();

if ('FORCE_COLOR' in env) {
	supportLevel = parseInt(env.FORCE_COLOR, 10) === 0 ? 0 : (supportLevel || 1);
}

module.exports = process && support(supportLevel);
});

var templates = createCommonjsModule(function (module) {
'use strict';
const TEMPLATE_REGEX = /(?:\\(u[a-f\d]{4}|x[a-f\d]{2}|.))|(?:\{(~)?(\w+(?:\([^)]*\))?(?:\.\w+(?:\([^)]*\))?)*)(?:[ \t]|(?=\r?\n)))|(\})|((?:.|[\r\n\f])+?)/gi;
const STYLE_REGEX = /(?:^|\.)(\w+)(?:\(([^)]*)\))?/g;
const STRING_REGEX = /^(['"])((?:\\.|(?!\1)[^\\])*)\1$/;
const ESCAPE_REGEX = /\\(u[a-f\d]{4}|x[a-f\d]{2}|.)|([^\\])/gi;

const ESCAPES = new Map([
	['n', '\n'],
	['r', '\r'],
	['t', '\t'],
	['b', '\b'],
	['f', '\f'],
	['v', '\v'],
	['0', '\0'],
	['\\', '\\'],
	['e', '\u001B'],
	['a', '\u0007']
]);

function unescape(c) {
	if ((c[0] === 'u' && c.length === 5) || (c[0] === 'x' && c.length === 3)) {
		return String.fromCharCode(parseInt(c.slice(1), 16));
	}

	return ESCAPES.get(c) || c;
}

function parseArguments(name, args) {
	const results = [];
	const chunks = args.trim().split(/\s*,\s*/g);
	let matches;

	for (const chunk of chunks) {
		if (!isNaN(chunk)) {
			results.push(Number(chunk));
		} else if ((matches = chunk.match(STRING_REGEX))) {
			results.push(matches[2].replace(ESCAPE_REGEX, (m, escape, chr) => escape ? unescape(escape) : chr));
		} else {
			throw new Error(`Invalid Chalk template style argument: ${chunk} (in style '${name}')`);
		}
	}

	return results;
}

function parseStyle(style) {
	STYLE_REGEX.lastIndex = 0;

	const results = [];
	let matches;

	while ((matches = STYLE_REGEX.exec(style)) !== null) {
		const name = matches[1];

		if (matches[2]) {
			const args = parseArguments(name, matches[2]);
			results.push([name].concat(args));
		} else {
			results.push([name]);
		}
	}

	return results;
}

function buildStyle(chalk, styles) {
	const enabled = {};

	for (const layer of styles) {
		for (const style of layer.styles) {
			enabled[style[0]] = layer.inverse ? null : style.slice(1);
		}
	}

	let current = chalk;
	for (const styleName of Object.keys(enabled)) {
		if (Array.isArray(enabled[styleName])) {
			if (!(styleName in current)) {
				throw new Error(`Unknown Chalk style: ${styleName}`);
			}

			if (enabled[styleName].length > 0) {
				current = current[styleName].apply(current, enabled[styleName]);
			} else {
				current = current[styleName];
			}
		}
	}

	return current;
}

module.exports = (chalk, tmp) => {
	const styles = [];
	const chunks = [];
	let chunk = [];

	// eslint-disable-next-line max-params
	tmp.replace(TEMPLATE_REGEX, (m, escapeChar, inverse, style, close, chr) => {
		if (escapeChar) {
			chunk.push(unescape(escapeChar));
		} else if (style) {
			const str = chunk.join('');
			chunk = [];
			chunks.push(styles.length === 0 ? str : buildStyle(chalk, styles)(str));
			styles.push({inverse, styles: parseStyle(style)});
		} else if (close) {
			if (styles.length === 0) {
				throw new Error('Found extraneous } in Chalk template literal');
			}

			chunks.push(buildStyle(chalk, styles)(chunk.join('')));
			chunk = [];
			styles.pop();
		} else {
			chunk.push(chr);
		}
	});

	chunks.push(chunk.join(''));

	if (styles.length > 0) {
		const errMsg = `Chalk template literal is missing ${styles.length} closing bracket${styles.length === 1 ? '' : 's'} (\`}\`)`;
		throw new Error(errMsg);
	}

	return chunks.join('');
};
});

var chalk = createCommonjsModule(function (module) {
'use strict';






const isSimpleWindowsTerm = process.platform === 'win32' && !(process.env.TERM || '').toLowerCase().startsWith('xterm');

// `supportsColor.level` → `ansiStyles.color[name]` mapping
const levelMapping = ['ansi', 'ansi', 'ansi256', 'ansi16m'];

// `color-convert` models to exclude from the Chalk API due to conflicts and such
const skipModels = new Set(['gray']);

const styles = Object.create(null);

function applyOptions(obj, options) {
	options = options || {};

	// Detect level if not set manually
	const scLevel = supportsColor ? supportsColor.level : 0;
	obj.level = options.level === undefined ? scLevel : options.level;
	obj.enabled = 'enabled' in options ? options.enabled : obj.level > 0;
}

function Chalk(options) {
	// We check for this.template here since calling `chalk.constructor()`
	// by itself will have a `this` of a previously constructed chalk object
	if (!this || !(this instanceof Chalk) || this.template) {
		const chalk = {};
		applyOptions(chalk, options);

		chalk.template = function () {
			const args = [].slice.call(arguments);
			return chalkTag.apply(null, [chalk.template].concat(args));
		};

		Object.setPrototypeOf(chalk, Chalk.prototype);
		Object.setPrototypeOf(chalk.template, chalk);

		chalk.template.constructor = Chalk;

		return chalk.template;
	}

	applyOptions(this, options);
}

// Use bright blue on Windows as the normal blue color is illegible
if (isSimpleWindowsTerm) {
	ansiStyles.blue.open = '\u001B[94m';
}

for (const key of Object.keys(ansiStyles)) {
	ansiStyles[key].closeRe = new RegExp(escapeStringRegexp(ansiStyles[key].close), 'g');

	styles[key] = {
		get() {
			const codes = ansiStyles[key];
			return build.call(this, this._styles ? this._styles.concat(codes) : [codes], this._empty, key);
		}
	};
}

styles.visible = {
	get() {
		return build.call(this, this._styles || [], true, 'visible');
	}
};

ansiStyles.color.closeRe = new RegExp(escapeStringRegexp(ansiStyles.color.close), 'g');
for (const model of Object.keys(ansiStyles.color.ansi)) {
	if (skipModels.has(model)) {
		continue;
	}

	styles[model] = {
		get() {
			const level = this.level;
			return function () {
				const open = ansiStyles.color[levelMapping[level]][model].apply(null, arguments);
				const codes = {
					open,
					close: ansiStyles.color.close,
					closeRe: ansiStyles.color.closeRe
				};
				return build.call(this, this._styles ? this._styles.concat(codes) : [codes], this._empty, model);
			};
		}
	};
}

ansiStyles.bgColor.closeRe = new RegExp(escapeStringRegexp(ansiStyles.bgColor.close), 'g');
for (const model of Object.keys(ansiStyles.bgColor.ansi)) {
	if (skipModels.has(model)) {
		continue;
	}

	const bgModel = 'bg' + model[0].toUpperCase() + model.slice(1);
	styles[bgModel] = {
		get() {
			const level = this.level;
			return function () {
				const open = ansiStyles.bgColor[levelMapping[level]][model].apply(null, arguments);
				const codes = {
					open,
					close: ansiStyles.bgColor.close,
					closeRe: ansiStyles.bgColor.closeRe
				};
				return build.call(this, this._styles ? this._styles.concat(codes) : [codes], this._empty, model);
			};
		}
	};
}

const proto = Object.defineProperties(() => {}, styles);

function build(_styles, _empty, key) {
	const builder = function () {
		return applyStyle.apply(builder, arguments);
	};

	builder._styles = _styles;
	builder._empty = _empty;

	const self = this;

	Object.defineProperty(builder, 'level', {
		enumerable: true,
		get() {
			return self.level;
		},
		set(level) {
			self.level = level;
		}
	});

	Object.defineProperty(builder, 'enabled', {
		enumerable: true,
		get() {
			return self.enabled;
		},
		set(enabled) {
			self.enabled = enabled;
		}
	});

	// See below for fix regarding invisible grey/dim combination on Windows
	builder.hasGrey = this.hasGrey || key === 'gray' || key === 'grey';

	// `__proto__` is used because we must return a function, but there is
	// no way to create a function with a different prototype
	builder.__proto__ = proto; // eslint-disable-line no-proto

	return builder;
}

function applyStyle() {
	// Support varags, but simply cast to string in case there's only one arg
	const args = arguments;
	const argsLen = args.length;
	let str = String(arguments[0]);

	if (argsLen === 0) {
		return '';
	}

	if (argsLen > 1) {
		// Don't slice `arguments`, it prevents V8 optimizations
		for (let a = 1; a < argsLen; a++) {
			str += ' ' + args[a];
		}
	}

	if (!this.enabled || this.level <= 0 || !str) {
		return this._empty ? '' : str;
	}

	// Turns out that on Windows dimmed gray text becomes invisible in cmd.exe,
	// see https://github.com/chalk/chalk/issues/58
	// If we're on Windows and we're dealing with a gray color, temporarily make 'dim' a noop.
	const originalDim = ansiStyles.dim.open;
	if (isSimpleWindowsTerm && this.hasGrey) {
		ansiStyles.dim.open = '';
	}

	for (const code of this._styles.slice().reverse()) {
		// Replace any instances already present with a re-opening code
		// otherwise only the part of the string until said closing code
		// will be colored, and the rest will simply be 'plain'.
		str = code.open + str.replace(code.closeRe, code.open) + code.close;

		// Close the styling before a linebreak and reopen
		// after next line to fix a bleed issue on macOS
		// https://github.com/chalk/chalk/pull/92
		str = str.replace(/\r?\n/g, `${code.close}$&${code.open}`);
	}

	// Reset the original `dim` if we changed it to work around the Windows dimmed gray issue
	ansiStyles.dim.open = originalDim;

	return str;
}

function chalkTag(chalk, strings) {
	if (!Array.isArray(strings)) {
		// If chalk() was called by itself or with a string,
		// return the string itself as a string.
		return [].slice.call(arguments, 1).join(' ');
	}

	const args = [].slice.call(arguments, 2);
	const parts = [strings.raw[0]];

	for (let i = 1; i < strings.length; i++) {
		parts.push(String(args[i - 1]).replace(/[{}\\]/g, '\\$&'));
		parts.push(String(strings.raw[i]));
	}

	return templates(chalk, parts.join(''));
}

Object.defineProperties(Chalk.prototype, styles);

module.exports = Chalk(); // eslint-disable-line new-cap
module.exports.supportsColor = supportsColor;
module.exports.default = module.exports; // For TypeScript
});

var lib$6 = createCommonjsModule(function (module, exports) {
"use strict";

exports.__esModule = true;
exports.shouldHighlight = shouldHighlight;
exports.getChalk = getChalk;
exports.default = highlight;

var _jsTokens = _interopRequireWildcard(jsTokens);

var _esutils = _interopRequireDefault(utils$2);

var _chalk = _interopRequireDefault(chalk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function getDefs(chalk$$1) {
  return {
    keyword: chalk$$1.cyan,
    capitalized: chalk$$1.yellow,
    jsx_tag: chalk$$1.yellow,
    punctuator: chalk$$1.yellow,
    number: chalk$$1.magenta,
    string: chalk$$1.green,
    regex: chalk$$1.magenta,
    comment: chalk$$1.grey,
    invalid: chalk$$1.white.bgRed.bold
  };
}

var NEWLINE = /\r\n|[\n\r\u2028\u2029]/;
var JSX_TAG = /^[a-z][\w-]*$/i;
var BRACKET = /^[()[\]{}]$/;

function getTokenType(match) {
  var _match$slice = match.slice(-2),
      offset = _match$slice[0],
      text = _match$slice[1];

  var token = (0, _jsTokens.matchToToken)(match);

  if (token.type === "name") {
    if (_esutils.default.keyword.isReservedWordES6(token.value)) {
      return "keyword";
    }

    if (JSX_TAG.test(token.value) && (text[offset - 1] === "<" || text.substr(offset - 2, 2) == "</")) {
      return "jsx_tag";
    }

    if (token.value[0] !== token.value[0].toLowerCase()) {
      return "capitalized";
    }
  }

  if (token.type === "punctuator" && BRACKET.test(token.value)) {
    return "bracket";
  }

  if (token.type === "invalid" && (token.value === "@" || token.value === "#")) {
    return "punctuator";
  }

  return token.type;
}

function highlightTokens(defs, text) {
  return text.replace(_jsTokens.default, function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var type = getTokenType(args);
    var colorize = defs[type];

    if (colorize) {
      return args[0].split(NEWLINE).map(function (str) {
        return colorize(str);
      }).join("\n");
    } else {
      return args[0];
    }
  });
}

function shouldHighlight(options) {
  return _chalk.default.supportsColor || options.forceColor;
}

function getChalk(options) {
  var chalk$$1 = _chalk.default;

  if (options.forceColor) {
    chalk$$1 = new _chalk.default.constructor({
      enabled: true,
      level: 1
    });
  }

  return chalk$$1;
}

function highlight(code, options) {
  if (options === void 0) {
    options = {};
  }

  if (shouldHighlight(options)) {
    var chalk$$1 = getChalk(options);
    var defs = getDefs(chalk$$1);
    return highlightTokens(defs, code);
  } else {
    return code;
  }
}
});

unwrapExports(lib$6);

var lib$5 = createCommonjsModule(function (module, exports) {
"use strict";

exports.__esModule = true;
exports.codeFrameColumns = codeFrameColumns;
exports.default = _default;

var _highlight = _interopRequireWildcard(lib$6);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

var deprecationWarningShown = false;

function getDefs(chalk) {
  return {
    gutter: chalk.grey,
    marker: chalk.red.bold,
    message: chalk.red.bold
  };
}

var NEWLINE = /\r\n|[\n\r\u2028\u2029]/;

function getMarkerLines(loc, source, opts) {
  var startLoc = Object.assign({}, {
    column: 0,
    line: -1
  }, loc.start);
  var endLoc = Object.assign({}, startLoc, loc.end);

  var _ref = opts || {},
      _ref$linesAbove = _ref.linesAbove,
      linesAbove = _ref$linesAbove === void 0 ? 2 : _ref$linesAbove,
      _ref$linesBelow = _ref.linesBelow,
      linesBelow = _ref$linesBelow === void 0 ? 3 : _ref$linesBelow;

  var startLine = startLoc.line;
  var startColumn = startLoc.column;
  var endLine = endLoc.line;
  var endColumn = endLoc.column;
  var start = Math.max(startLine - (linesAbove + 1), 0);
  var end = Math.min(source.length, endLine + linesBelow);

  if (startLine === -1) {
    start = 0;
  }

  if (endLine === -1) {
    end = source.length;
  }

  var lineDiff = endLine - startLine;
  var markerLines = {};

  if (lineDiff) {
    for (var i = 0; i <= lineDiff; i++) {
      var lineNumber = i + startLine;

      if (!startColumn) {
        markerLines[lineNumber] = true;
      } else if (i === 0) {
        var sourceLength = source[lineNumber - 1].length;
        markerLines[lineNumber] = [startColumn, sourceLength - startColumn];
      } else if (i === lineDiff) {
        markerLines[lineNumber] = [0, endColumn];
      } else {
        var _sourceLength = source[lineNumber - i].length;
        markerLines[lineNumber] = [0, _sourceLength];
      }
    }
  } else {
    if (startColumn === endColumn) {
      if (startColumn) {
        markerLines[startLine] = [startColumn, 0];
      } else {
        markerLines[startLine] = true;
      }
    } else {
      markerLines[startLine] = [startColumn, endColumn - startColumn];
    }
  }

  return {
    start: start,
    end: end,
    markerLines: markerLines
  };
}

function codeFrameColumns(rawLines, loc, opts) {
  if (opts === void 0) {
    opts = {};
  }

  var highlighted = (opts.highlightCode || opts.forceColor) && (0, _highlight.shouldHighlight)(opts);
  var chalk = (0, _highlight.getChalk)(opts);
  var defs = getDefs(chalk);

  var maybeHighlight = function maybeHighlight(chalkFn, string) {
    return highlighted ? chalkFn(string) : string;
  };

  if (highlighted) rawLines = (0, _highlight.default)(rawLines, opts);
  var lines = rawLines.split(NEWLINE);

  var _getMarkerLines = getMarkerLines(loc, lines, opts),
      start = _getMarkerLines.start,
      end = _getMarkerLines.end,
      markerLines = _getMarkerLines.markerLines;

  var hasColumns = loc.start && typeof loc.start.column === "number";
  var numberMaxWidth = String(end).length;
  var frame = lines.slice(start, end).map(function (line, index) {
    var number = start + 1 + index;
    var paddedNumber = (" " + number).slice(-numberMaxWidth);
    var gutter = " " + paddedNumber + " | ";
    var hasMarker = markerLines[number];
    var lastMarkerLine = !markerLines[number + 1];

    if (hasMarker) {
      var markerLine = "";

      if (Array.isArray(hasMarker)) {
        var markerSpacing = line.slice(0, Math.max(hasMarker[0] - 1, 0)).replace(/[^\t]/g, " ");
        var numberOfMarkers = hasMarker[1] || 1;
        markerLine = ["\n ", maybeHighlight(defs.gutter, gutter.replace(/\d/g, " ")), markerSpacing, maybeHighlight(defs.marker, "^").repeat(numberOfMarkers)].join("");

        if (lastMarkerLine && opts.message) {
          markerLine += " " + maybeHighlight(defs.message, opts.message);
        }
      }

      return [maybeHighlight(defs.marker, ">"), maybeHighlight(defs.gutter, gutter), line, markerLine].join("");
    } else {
      return " " + maybeHighlight(defs.gutter, gutter) + line;
    }
  }).join("\n");

  if (opts.message && !hasColumns) {
    frame = "" + " ".repeat(numberMaxWidth + 1) + opts.message + "\n" + frame;
  }

  if (highlighted) {
    return chalk.reset(frame);
  } else {
    return frame;
  }
}

function _default(rawLines, lineNumber, colNumber, opts) {
  if (opts === void 0) {
    opts = {};
  }

  if (!deprecationWarningShown) {
    deprecationWarningShown = true;
    var deprecationError = new Error("Passing lineNumber and colNumber is deprecated to @babel/code-frame. Please use `codeFrameColumns`.");
    deprecationError.name = "DeprecationWarning";

    if (process.emitWarning) {
      process.emitWarning(deprecationError);
    } else {
      console.warn(deprecationError);
    }
  }

  colNumber = Math.max(colNumber, 0);
  var location = {
    start: {
      column: colNumber,
      line: lineNumber
    }
  };
  return codeFrameColumns(rawLines, location, opts);
}
});

unwrapExports(lib$5);

const ConfigError = errors.ConfigError;
const babylon = languageJs.parsers.babylon;

const locStart = babylon.locStart;
const locEnd = babylon.locEnd;

function getParsers(options) {
  return options.plugins.reduce(
    (parsers, plugin) => Object.assign({}, parsers, plugin.parsers),
    {}
  );
}

function resolveParser$1(opts, parsers) {
  parsers = parsers || getParsers(opts);

  if (typeof opts.parser === "function") {
    // Custom parser API always works with JavaScript.
    return {
      parse: opts.parser,
      astFormat: "estree",
      locStart,
      locEnd
    };
  }

  if (typeof opts.parser === "string") {
    if (parsers.hasOwnProperty(opts.parser)) {
      return parsers[opts.parser];
    }
    try {
      return {
        parse: eval("require")(path.resolve(process.cwd(), opts.parser)),
        astFormat: "estree",
        locStart,
        locEnd
      };
    } catch (err) {
      /* istanbul ignore next */
      throw new ConfigError(`Couldn't resolve parser "${opts.parser}"`);
    }
  }
  /* istanbul ignore next */
  return parsers.babylon;
}

function parse$2(text, opts) {
  const parsers = getParsers(opts);

  // Copy the "parse" function from parser to a new object whose values are
  // functions. Use defineProperty()/getOwnPropertyDescriptor() such that we
  // don't invoke the parser.parse getters.
  const parsersForCustomParserApi = Object.keys(parsers).reduce(
    (object, parserName) =>
      Object.defineProperty(
        object,
        parserName,
        Object.getOwnPropertyDescriptor(parsers[parserName], "parse")
      ),
    {}
  );

  const parser = resolveParser$1(opts, parsers);

  try {
    if (parser.preprocess) {
      text = parser.preprocess(text, opts);
    }

    return {
      text,
      ast: parser.parse(text, parsersForCustomParserApi, opts)
    };
  } catch (error) {
    const loc = error.loc;

    if (loc) {
      const codeFrame = lib$5;
      error.codeFrame = codeFrame.codeFrameColumns(text, loc, {
        highlightCode: true
      });
      error.message += "\n" + error.codeFrame;
      throw error;
    }

    /* istanbul ignore next */
    throw error.stack;
  }
}

var parser = { parse: parse$2, resolveParser: resolveParser$1 };

const getSupportInfo$1 = support.getSupportInfo;

const resolveParser = parser.resolveParser;

const hiddenDefaults = {
  astFormat: "estree",
  printer: {},
  locStart: null,
  locEnd: null
};

// Copy options and fill in default values.
function normalize(options, opts) {
  opts = opts || {};

  const rawOptions = Object.assign({}, options);

  const supportOptions = getSupportInfo$1(null, {
    plugins: options.plugins,
    showUnreleased: true,
    showDeprecated: true
  }).options;
  const defaults = supportOptions.reduce(
    (reduced, optionInfo) =>
      Object.assign(reduced, { [optionInfo.name]: optionInfo.default }),
    Object.assign({}, hiddenDefaults)
  );

  if (opts.inferParser !== false) {
    if (
      rawOptions.filepath &&
      (!rawOptions.parser || rawOptions.parser === defaults.parser)
    ) {
      const inferredParser = inferParser(
        rawOptions.filepath,
        rawOptions.plugins
      );
      if (inferredParser) {
        rawOptions.parser = inferredParser;
      }
    }
  }

  const parser$$1 = resolveParser(
    !rawOptions.parser
      ? rawOptions
      : // handle deprecated parsers
        optionsNormalizer.normalizeApiOptions(
          rawOptions,
          [supportOptions.find(x => x.name === "parser")],
          { passThrough: true, logger: false }
        )
  );
  rawOptions.astFormat = parser$$1.astFormat;
  rawOptions.locEnd = parser$$1.locEnd;
  rawOptions.locStart = parser$$1.locStart;

  const plugin = getPlugin(rawOptions);
  rawOptions.printer = plugin.printers[rawOptions.astFormat];

  const pluginDefaults = supportOptions
    .filter(
      optionInfo =>
        optionInfo.pluginDefaults && optionInfo.pluginDefaults[plugin.name]
    )
    .reduce(
      (reduced, optionInfo) =>
        Object.assign(reduced, {
          [optionInfo.name]: optionInfo.pluginDefaults[plugin.name]
        }),
      {}
    );

  const mixedDefaults = Object.assign({}, defaults, pluginDefaults);

  Object.keys(mixedDefaults).forEach(k => {
    if (rawOptions[k] == null) {
      rawOptions[k] = mixedDefaults[k];
    }
  });

  if (rawOptions.parser === "json") {
    rawOptions.trailingComma = "none";
  }

  return optionsNormalizer.normalizeApiOptions(
    rawOptions,
    supportOptions,
    Object.assign({ passThrough: Object.keys(hiddenDefaults) }, opts)
  );
}

function getPlugin(options) {
  const astFormat = options.astFormat;

  if (!astFormat) {
    throw new Error("getPlugin() requires astFormat to be set");
  }
  const printerPlugin = options.plugins.find(
    plugin => plugin.printers[astFormat]
  );
  if (!printerPlugin) {
    throw new Error(`Couldn't find plugin for AST format "${astFormat}"`);
  }

  return printerPlugin;
}

function inferParser(filepath, plugins) {
  const extension = path.extname(filepath);
  const filename = path.basename(filepath).toLowerCase();

  const language = getSupportInfo$1(null, {
    plugins
  }).languages.find(
    language =>
      language.since !== null &&
      ((language.extensions && language.extensions.indexOf(extension) > -1) ||
        (language.filenames &&
          language.filenames.find(name => name.toLowerCase() === filename)))
  );

  return language && language.parsers[0];
}

var options = { normalize, hiddenDefaults, inferParser };

function massageAST(ast, options, parent) {
  if (Array.isArray(ast)) {
    return ast.map(e => massageAST(e, options, parent)).filter(e => e);
  }

  if (!ast || typeof ast !== "object") {
    return ast;
  }

  const newObj = {};
  for (const key of Object.keys(ast)) {
    if (typeof ast[key] !== "function") {
      newObj[key] = massageAST(ast[key], options, ast);
    }
  }

  if (options.printer.massageAstNode) {
    const result = options.printer.massageAstNode(ast, newObj, parent);
    if (result === null) {
      return undefined;
    }
    if (result) {
      return result;
    }
  }

  return newObj;
}

var massageAst = massageAST;

function FastPath(value) {
  assert.ok(this instanceof FastPath);
  this.stack = [value];
}

// The name of the current property is always the penultimate element of
// this.stack, and always a String.
FastPath.prototype.getName = function getName() {
  const s = this.stack;
  const len = s.length;
  if (len > 1) {
    return s[len - 2];
  }
  // Since the name is always a string, null is a safe sentinel value to
  // return if we do not know the name of the (root) value.
  /* istanbul ignore next */
  return null;
};

// The value of the current property is always the final element of
// this.stack.
FastPath.prototype.getValue = function getValue() {
  const s = this.stack;
  return s[s.length - 1];
};

function getNodeHelper(path$$1, count) {
  const s = path$$1.stack;

  for (let i = s.length - 1; i >= 0; i -= 2) {
    const value = s[i];

    if (value && !Array.isArray(value) && --count < 0) {
      return value;
    }
  }

  return null;
}

FastPath.prototype.getNode = function getNode(count) {
  return getNodeHelper(this, ~~count);
};

FastPath.prototype.getParentNode = function getParentNode(count) {
  return getNodeHelper(this, ~~count + 1);
};

// Temporarily push properties named by string arguments given after the
// callback function onto this.stack, then call the callback with a
// reference to this (modified) FastPath object. Note that the stack will
// be restored to its original state after the callback is finished, so it
// is probably a mistake to retain a reference to the path.
FastPath.prototype.call = function call(callback /*, name1, name2, ... */) {
  const s = this.stack;
  const origLen = s.length;
  let value = s[origLen - 1];
  const argc = arguments.length;
  for (let i = 1; i < argc; ++i) {
    const name = arguments[i];
    value = value[name];
    s.push(name, value);
  }
  const result = callback(this);
  s.length = origLen;
  return result;
};

// Similar to FastPath.prototype.call, except that the value obtained by
// accessing this.getValue()[name1][name2]... should be array-like. The
// callback will be called with a reference to this path object for each
// element of the array.
FastPath.prototype.each = function each(callback /*, name1, name2, ... */) {
  const s = this.stack;
  const origLen = s.length;
  let value = s[origLen - 1];
  const argc = arguments.length;

  for (let i = 1; i < argc; ++i) {
    const name = arguments[i];
    value = value[name];
    s.push(name, value);
  }

  for (let i = 0; i < value.length; ++i) {
    if (i in value) {
      s.push(i, value[i]);
      // If the callback needs to know the value of i, call
      // path.getName(), assuming path is the parameter name.
      callback(this);
      s.length -= 2;
    }
  }

  s.length = origLen;
};

// Similar to FastPath.prototype.each, except that the results of the
// callback function invocations are stored in an array and returned at
// the end of the iteration.
FastPath.prototype.map = function map(callback /*, name1, name2, ... */) {
  const s = this.stack;
  const origLen = s.length;
  let value = s[origLen - 1];
  const argc = arguments.length;

  for (let i = 1; i < argc; ++i) {
    const name = arguments[i];
    value = value[name];
    s.push(name, value);
  }

  const result = new Array(value.length);

  for (let i = 0; i < value.length; ++i) {
    if (i in value) {
      s.push(i, value[i]);
      result[i] = callback(this, i);
      s.length -= 2;
    }
  }

  s.length = origLen;

  return result;
};

var fastPath = FastPath;

const normalize$1 = options.normalize;


function printSubtree(path$$1, print, options$$1) {
  if (options$$1.printer.embed) {
    return options$$1.printer.embed(
      path$$1,
      print,
      (text, partialNextOptions) =>
        textToDoc(text, partialNextOptions, options$$1),
      options$$1
    );
  }
}

function textToDoc(text, partialNextOptions, parentOptions) {
  const nextOptions = normalize$1(
    Object.assign({}, parentOptions, partialNextOptions, {
      parentParser: parentOptions.parser,
      originalText: text
    }),
    { passThrough: true, inferParser: false }
  );

  const result = parser.parse(text, nextOptions);
  const ast = result.ast;
  text = result.text;

  const astComments = ast.comments;
  delete ast.comments;
  comments.attach(astComments, ast, text, nextOptions);
  return astToDoc(ast, nextOptions);
}

var multiparser = {
  printSubtree
};

const doc$3 = doc;
const docBuilders$6 = doc$3.builders;
const concat$5 = docBuilders$6.concat;
const hardline$4 = docBuilders$6.hardline;
const addAlignmentToDoc$2 = docBuilders$6.addAlignmentToDoc;
const docUtils$5 = doc$3.utils;

function printAstToDoc(ast, options, addAlignmentSize) {
  addAlignmentSize = addAlignmentSize || 0;

  const printer = options.printer;
  const cache = new Map();

  function printGenerically(path$$1, args) {
    const node = path$$1.getValue();

    const shouldCache = node && typeof node === "object" && args === undefined;
    if (shouldCache && cache.has(node)) {
      return cache.get(node);
    }

    // We let JSXElement print its comments itself because it adds () around
    // UnionTypeAnnotation has to align the child without the comments
    let res;
    if (printer.willPrintOwnComments && printer.willPrintOwnComments(path$$1)) {
      res = genericPrint$1(path$$1, options, printGenerically, args);
    } else {
      res = comments.printComments(
        path$$1,
        p => genericPrint$1(p, options, printGenerically, args),
        options,
        args && args.needsSemi
      );
    }

    if (shouldCache) {
      cache.set(node, res);
    }

    return res;
  }

  let doc$$2 = printGenerically(new fastPath(ast));
  if (addAlignmentSize > 0) {
    // Add a hardline to make the indents take effect
    // It should be removed in index.js format()
    doc$$2 = addAlignmentToDoc$2(
      docUtils$5.removeLines(concat$5([hardline$4, doc$$2])),
      addAlignmentSize,
      options.tabWidth
    );
  }
  docUtils$5.propagateBreaks(doc$$2);

  if (options.parser === "json" || options.parser === "json5") {
    doc$$2 = concat$5([doc$$2, hardline$4]);
  }

  return doc$$2;
}

function genericPrint$1(path$$1, options, printPath, args) {
  assert.ok(path$$1 instanceof fastPath);

  const node = path$$1.getValue();
  const printer = options.printer;

  // Escape hatch
  if (printer.hasPrettierIgnore && printer.hasPrettierIgnore(path$$1)) {
    return options.originalText.slice(
      options.locStart(node),
      options.locEnd(node)
    );
  }

  if (node) {
    try {
      // Potentially switch to a different parser
      const sub = multiparser.printSubtree(path$$1, printPath, options);
      if (sub) {
        return sub;
      }
    } catch (error) {
      /* istanbul ignore if */
      if (process.env.PRETTIER_DEBUG) {
        throw error;
      }
      // Continue with current parser
    }
  }

  return printer.print(path$$1, options, printPath, args);
}

var astToDoc = printAstToDoc;

function findSiblingAncestors(startNodeAndParents, endNodeAndParents, opts) {
  let resultStartNode = startNodeAndParents.node;
  let resultEndNode = endNodeAndParents.node;

  if (resultStartNode === resultEndNode) {
    return {
      startNode: resultStartNode,
      endNode: resultEndNode
    };
  }

  for (const endParent of endNodeAndParents.parentNodes) {
    if (
      endParent.type !== "Program" &&
      endParent.type !== "File" &&
      opts.locStart(endParent) >= opts.locStart(startNodeAndParents.node)
    ) {
      resultEndNode = endParent;
    } else {
      break;
    }
  }

  for (const startParent of startNodeAndParents.parentNodes) {
    if (
      startParent.type !== "Program" &&
      startParent.type !== "File" &&
      opts.locEnd(startParent) <= opts.locEnd(endNodeAndParents.node)
    ) {
      resultStartNode = startParent;
    } else {
      break;
    }
  }

  return {
    startNode: resultStartNode,
    endNode: resultEndNode
  };
}

function findNodeAtOffset(node, offset, options, predicate, parentNodes) {
  predicate = predicate || (() => true);
  parentNodes = parentNodes || [];
  const start = options.locStart(node, options.locStart);
  const end = options.locEnd(node, options.locEnd);
  if (start <= offset && offset <= end) {
    for (const childNode of comments.getSortedChildNodes(
      node,
      undefined /* text */,
      options
    )) {
      const childResult = findNodeAtOffset(
        childNode,
        offset,
        options,
        predicate,
        [node].concat(parentNodes)
      );
      if (childResult) {
        return childResult;
      }
    }

    if (predicate(node)) {
      return {
        node: node,
        parentNodes: parentNodes
      };
    }
  }
}

// See https://www.ecma-international.org/ecma-262/5.1/#sec-A.5
function isSourceElement(opts, node) {
  if (node == null) {
    return false;
  }
  // JS and JS like to avoid repetitions
  const jsSourceElements = [
    "FunctionDeclaration",
    "BlockStatement",
    "BreakStatement",
    "ContinueStatement",
    "DebuggerStatement",
    "DoWhileStatement",
    "EmptyStatement",
    "ExpressionStatement",
    "ForInStatement",
    "ForStatement",
    "IfStatement",
    "LabeledStatement",
    "ReturnStatement",
    "SwitchStatement",
    "ThrowStatement",
    "TryStatement",
    "VariableDeclaration",
    "WhileStatement",
    "WithStatement",
    "ClassDeclaration", // ES 2015
    "ImportDeclaration", // Module
    "ExportDefaultDeclaration", // Module
    "ExportNamedDeclaration", // Module
    "ExportAllDeclaration", // Module
    "TypeAlias", // Flow
    "InterfaceDeclaration", // Flow, TypeScript
    "TypeAliasDeclaration", // TypeScript
    "ExportAssignment", // TypeScript
    "ExportDeclaration" // TypeScript
  ];
  const jsonSourceElements = [
    "ObjectExpression",
    "ArrayExpression",
    "StringLiteral",
    "NumericLiteral",
    "BooleanLiteral",
    "NullLiteral"
  ];
  const graphqlSourceElements = [
    "OperationDefinition",
    "FragmentDefinition",
    "VariableDefinition",
    "TypeExtensionDefinition",
    "ObjectTypeDefinition",
    "FieldDefinition",
    "DirectiveDefinition",
    "EnumTypeDefinition",
    "EnumValueDefinition",
    "InputValueDefinition",
    "InputObjectTypeDefinition",
    "SchemaDefinition",
    "OperationTypeDefinition",
    "InterfaceTypeDefinition",
    "UnionTypeDefinition",
    "ScalarTypeDefinition"
  ];
  switch (opts.parser) {
    case "flow":
    case "babylon":
    case "typescript":
      return jsSourceElements.indexOf(node.type) > -1;
    case "json":
      return jsonSourceElements.indexOf(node.type) > -1;
    case "graphql":
      return graphqlSourceElements.indexOf(node.kind) > -1;
  }
  return false;
}

function calculateRange(text, opts, ast) {
  // Contract the range so that it has non-whitespace characters at its endpoints.
  // This ensures we can format a range that doesn't end on a node.
  const rangeStringOrig = text.slice(opts.rangeStart, opts.rangeEnd);
  const startNonWhitespace = Math.max(
    opts.rangeStart + rangeStringOrig.search(/\S/),
    opts.rangeStart
  );
  let endNonWhitespace;
  for (
    endNonWhitespace = opts.rangeEnd;
    endNonWhitespace > opts.rangeStart;
    --endNonWhitespace
  ) {
    if (text[endNonWhitespace - 1].match(/\S/)) {
      break;
    }
  }

  const startNodeAndParents = findNodeAtOffset(
    ast,
    startNonWhitespace,
    opts,
    node => isSourceElement(opts, node)
  );
  const endNodeAndParents = findNodeAtOffset(
    ast,
    endNonWhitespace,
    opts,
    node => isSourceElement(opts, node)
  );

  if (!startNodeAndParents || !endNodeAndParents) {
    return {
      rangeStart: 0,
      rangeEnd: 0
    };
  }

  const siblingAncestors = findSiblingAncestors(
    startNodeAndParents,
    endNodeAndParents,
    opts
  );
  const startNode = siblingAncestors.startNode;
  const endNode = siblingAncestors.endNode;
  const rangeStart = Math.min(
    opts.locStart(startNode, opts.locStart),
    opts.locStart(endNode, opts.locStart)
  );
  const rangeEnd = Math.max(
    opts.locEnd(startNode, opts.locEnd),
    opts.locEnd(endNode, opts.locEnd)
  );

  return {
    rangeStart: rangeStart,
    rangeEnd: rangeEnd
  };
}

var rangeUtil = {
  calculateRange,
  findNodeAtOffset
};

const normalizeOptions = options.normalize;









const printDocToString = doc.printer.printDocToString;
const printDocToDebug = doc.debug.printDocToDebug;

const UTF8BOM = 0xfeff;

const CURSOR = Symbol("cursor");

function guessLineEnding(text) {
  const index = text.indexOf("\n");
  if (index >= 0 && text.charAt(index - 1) === "\r") {
    return "\r\n";
  }
  return "\n";
}

function ensureAllCommentsPrinted(astComments) {
  if (!astComments) {
    return;
  }

  for (let i = 0; i < astComments.length; ++i) {
    if (astComments[i].value.trim() === "prettier-ignore") {
      // If there's a prettier-ignore, we're not printing that sub-tree so we
      // don't know if the comments was printed or not.
      return;
    }
  }

  astComments.forEach(comment => {
    if (!comment.printed) {
      throw new Error(
        'Comment "' +
          comment.value.trim() +
          '" was not printed. Please report this error!'
      );
    }
    delete comment.printed;
  });
}

function attachComments(text, ast, opts) {
  const astComments = ast.comments;
  if (astComments) {
    delete ast.comments;
    comments.attach(astComments, ast, text, opts);
  }
  ast.tokens = [];
  opts.originalText = text.trimRight();
  return astComments;
}

function coreFormat(text, opts, addAlignmentSize) {
  addAlignmentSize = addAlignmentSize || 0;

  const parsed = parser.parse(text, opts);
  const ast = parsed.ast;
  text = parsed.text;

  if (opts.cursorOffset >= 0) {
    const nodeResult = rangeUtil.findNodeAtOffset(ast, opts.cursorOffset, opts);
    if (nodeResult && nodeResult.node) {
      opts.cursorNode = nodeResult.node;
    }
  }

  const astComments = attachComments(text, ast, opts);
  const doc$$1 = astToDoc(ast, opts, addAlignmentSize);
  opts.newLine = guessLineEnding(text);

  const result = printDocToString(doc$$1, opts);

  ensureAllCommentsPrinted(astComments);
  // Remove extra leading indentation as well as the added indentation after last newline
  if (addAlignmentSize > 0) {
    const trimmed = result.formatted.trim();

    if (result.cursorNodeStart !== undefined) {
      result.cursorNodeStart -= result.formatted.indexOf(trimmed);
    }

    result.formatted = trimmed + opts.newLine;
  }

  if (opts.cursorOffset >= 0) {
    let oldCursorNodeStart;
    let oldCursorNodeText;

    let cursorOffsetRelativeToOldCursorNode;

    let newCursorNodeStart;
    let newCursorNodeText;

    if (opts.cursorNode && result.cursorNodeText) {
      oldCursorNodeStart = opts.locStart(opts.cursorNode);
      oldCursorNodeText = text.slice(
        oldCursorNodeStart,
        opts.locEnd(opts.cursorNode)
      );

      cursorOffsetRelativeToOldCursorNode =
        opts.cursorOffset - oldCursorNodeStart;

      newCursorNodeStart = result.cursorNodeStart;
      newCursorNodeText = result.cursorNodeText;
    } else {
      oldCursorNodeStart = 0;
      oldCursorNodeText = text;

      cursorOffsetRelativeToOldCursorNode = opts.cursorOffset;

      newCursorNodeStart = 0;
      newCursorNodeText = result.formatted;
    }

    if (oldCursorNodeText === newCursorNodeText) {
      return {
        formatted: result.formatted,
        cursorOffset: newCursorNodeStart + cursorOffsetRelativeToOldCursorNode
      };
    }

    // diff old and new cursor node texts, with a special cursor
    // symbol inserted to find out where it moves to

    const oldCursorNodeCharArray = oldCursorNodeText.split("");
    oldCursorNodeCharArray.splice(
      cursorOffsetRelativeToOldCursorNode,
      0,
      CURSOR
    );

    const newCursorNodeCharArray = newCursorNodeText.split("");

    const cursorNodeDiff = lib.diffArrays(
      oldCursorNodeCharArray,
      newCursorNodeCharArray
    );

    let cursorOffset = newCursorNodeStart;
    for (const entry of cursorNodeDiff) {
      if (entry.removed) {
        if (entry.value.indexOf(CURSOR) > -1) {
          break;
        }
      } else {
        cursorOffset += entry.count;
      }
    }

    return { formatted: result.formatted, cursorOffset };
  }

  return { formatted: result.formatted };
}

function formatRange(text, opts) {
  const parsed = parser.parse(text, opts);
  const ast = parsed.ast;
  text = parsed.text;

  const range = rangeUtil.calculateRange(text, opts, ast);
  const rangeStart = range.rangeStart;
  const rangeEnd = range.rangeEnd;
  const rangeString = text.slice(rangeStart, rangeEnd);

  // Try to extend the range backwards to the beginning of the line.
  // This is so we can detect indentation correctly and restore it.
  // Use `Math.min` since `lastIndexOf` returns 0 when `rangeStart` is 0
  const rangeStart2 = Math.min(
    rangeStart,
    text.lastIndexOf("\n", rangeStart) + 1
  );
  const indentString = text.slice(rangeStart2, rangeStart);

  const alignmentSize = util$1.getAlignmentSize(
    indentString,
    opts.tabWidth
  );

  const rangeResult = coreFormat(
    rangeString,
    Object.assign({}, opts, {
      rangeStart: 0,
      rangeEnd: Infinity,
      printWidth: opts.printWidth - alignmentSize,
      // track the cursor offset only if it's within our range
      cursorOffset:
        opts.cursorOffset >= rangeStart && opts.cursorOffset < rangeEnd
          ? opts.cursorOffset - rangeStart
          : -1
    }),
    alignmentSize
  );

  // Since the range contracts to avoid trailing whitespace,
  // we need to remove the newline that was inserted by the `format` call.
  const rangeTrimmed = rangeResult.formatted.trimRight();
  const formatted =
    text.slice(0, rangeStart) + rangeTrimmed + text.slice(rangeEnd);

  let cursorOffset = opts.cursorOffset;
  if (opts.cursorOffset >= rangeEnd) {
    // handle the case where the cursor was past the end of the range
    cursorOffset =
      opts.cursorOffset - rangeEnd + (rangeStart + rangeTrimmed.length);
  } else if (rangeResult.cursorOffset !== undefined) {
    // handle the case where the cursor was in the range
    cursorOffset = rangeResult.cursorOffset + rangeStart;
  }
  // keep the cursor as it was if it was before the start of the range

  return { formatted, cursorOffset };
}

function format(text, opts) {
  if (opts.rangeStart > 0 || opts.rangeEnd < text.length) {
    return formatRange(text, opts);
  }

  const selectedParser = parser.resolveParser(opts);
  const hasPragma = !selectedParser.hasPragma || selectedParser.hasPragma(text);
  if (opts.requirePragma && !hasPragma) {
    return { formatted: text };
  }

  const hasUnicodeBOM = text.charCodeAt(0) === UTF8BOM;
  if (hasUnicodeBOM) {
    text = text.substring(1);
  }

  if (opts.insertPragma && opts.printer.insertPragma && !hasPragma) {
    text = opts.printer.insertPragma(text);
  }

  const result = coreFormat(text, opts);
  if (hasUnicodeBOM) {
    result.formatted = String.fromCharCode(UTF8BOM) + result.formatted;
  }
  return result;
}

var core = {
  formatWithCursor(text, opts) {
    return format(text, normalizeOptions(opts));
  },

  parse(text, opts, massage) {
    opts = normalizeOptions(opts);
    const parsed = parser.parse(text, opts);
    if (massage) {
      parsed.ast = massageAst(parsed.ast, opts);
    }
    return parsed;
  },

  formatAST(ast, opts) {
    opts = normalizeOptions(opts);
    const doc$$1 = astToDoc(ast, opts);
    return printDocToString(doc$$1, opts);
  },

  // Doesn't handle shebang for now
  formatDoc(doc$$1, opts) {
    opts = normalizeOptions(opts);
    const debug = printDocToDebug(doc$$1);
    return format(debug, opts).formatted;
  },

  printToDoc(text, opts) {
    opts = normalizeOptions(opts);
    const parsed = parser.parse(text, opts);
    const ast = parsed.ast;
    text = parsed.text;
    attachComments(text, ast, opts);
    return astToDoc(ast, opts);
  },

  printDocToString(doc$$1, opts) {
    return printDocToString(doc$$1, normalizeOptions(opts));
  }
};

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ignore = function () {
  return new IgnoreBase();
};

// A simple implementation of make-array
function make_array(subject) {
  return Array.isArray(subject) ? subject : [subject];
}

var REGEX_BLANK_LINE = /^\s+$/;
var REGEX_LEADING_EXCAPED_EXCLAMATION = /^\\\!/;
var REGEX_LEADING_EXCAPED_HASH = /^\\#/;
var SLASH = '/';
var KEY_IGNORE = typeof Symbol !== 'undefined' ? Symbol.for('node-ignore')
/* istanbul ignore next */
: 'node-ignore';

var IgnoreBase = function () {
  function IgnoreBase() {
    _classCallCheck(this, IgnoreBase);

    this._rules = [];
    this[KEY_IGNORE] = true;
    this._initCache();
  }

  _createClass(IgnoreBase, [{
    key: '_initCache',
    value: function _initCache() {
      this._cache = {};
    }

    // @param {Array.<string>|string|Ignore} pattern

  }, {
    key: 'add',
    value: function add(pattern) {
      this._added = false;

      if (typeof pattern === 'string') {
        pattern = pattern.split(/\r?\n/g);
      }

      make_array(pattern).forEach(this._addPattern, this);

      // Some rules have just added to the ignore,
      // making the behavior changed.
      if (this._added) {
        this._initCache();
      }

      return this;
    }

    // legacy

  }, {
    key: 'addPattern',
    value: function addPattern(pattern) {
      return this.add(pattern);
    }
  }, {
    key: '_addPattern',
    value: function _addPattern(pattern) {
      // #32
      if (pattern && pattern[KEY_IGNORE]) {
        this._rules = this._rules.concat(pattern._rules);
        this._added = true;
        return;
      }

      if (this._checkPattern(pattern)) {
        var rule = this._createRule(pattern);
        this._added = true;
        this._rules.push(rule);
      }
    }
  }, {
    key: '_checkPattern',
    value: function _checkPattern(pattern) {
      // > A blank line matches no files, so it can serve as a separator for readability.
      return pattern && typeof pattern === 'string' && !REGEX_BLANK_LINE.test(pattern)

      // > A line starting with # serves as a comment.
      && pattern.indexOf('#') !== 0;
    }
  }, {
    key: 'filter',
    value: function filter(paths) {
      var _this = this;

      return make_array(paths).filter(function (path$$1) {
        return _this._filter(path$$1);
      });
    }
  }, {
    key: 'createFilter',
    value: function createFilter() {
      var _this2 = this;

      return function (path$$1) {
        return _this2._filter(path$$1);
      };
    }
  }, {
    key: 'ignores',
    value: function ignores(path$$1) {
      return !this._filter(path$$1);
    }
  }, {
    key: '_createRule',
    value: function _createRule(pattern) {
      var origin = pattern;
      var negative = false;

      // > An optional prefix "!" which negates the pattern;
      if (pattern.indexOf('!') === 0) {
        negative = true;
        pattern = pattern.substr(1);
      }

      pattern = pattern
      // > Put a backslash ("\") in front of the first "!" for patterns that begin with a literal "!", for example, `"\!important!.txt"`.
      .replace(REGEX_LEADING_EXCAPED_EXCLAMATION, '!')
      // > Put a backslash ("\") in front of the first hash for patterns that begin with a hash.
      .replace(REGEX_LEADING_EXCAPED_HASH, '#');

      var regex = make_regex(pattern, negative);

      return {
        origin: origin,
        pattern: pattern,
        negative: negative,
        regex: regex
      };
    }

    // @returns `Boolean` true if the `path` is NOT ignored

  }, {
    key: '_filter',
    value: function _filter(path$$1, slices) {
      if (!path$$1) {
        return false;
      }

      if (path$$1 in this._cache) {
        return this._cache[path$$1];
      }

      if (!slices) {
        // path/to/a.js
        // ['path', 'to', 'a.js']
        slices = path$$1.split(SLASH);
      }

      slices.pop();

      return this._cache[path$$1] = slices.length
      // > It is not possible to re-include a file if a parent directory of that file is excluded.
      // If the path contains a parent directory, check the parent first
      ? this._filter(slices.join(SLASH) + SLASH, slices) && this._test(path$$1)

      // Or only test the path
      : this._test(path$$1);
    }

    // @returns {Boolean} true if a file is NOT ignored

  }, {
    key: '_test',
    value: function _test(path$$1) {
      // Explicitly define variable type by setting matched to `0`
      var matched = 0;

      this._rules.forEach(function (rule) {
        // if matched = true, then we only test negative rules
        // if matched = false, then we test non-negative rules
        if (!(matched ^ rule.negative)) {
          matched = rule.negative ^ rule.regex.test(path$$1);
        }
      });

      return !matched;
    }
  }]);

  return IgnoreBase;
}();

// > If the pattern ends with a slash,
// > it is removed for the purpose of the following description,
// > but it would only find a match with a directory.
// > In other words, foo/ will match a directory foo and paths underneath it,
// > but will not match a regular file or a symbolic link foo
// >  (this is consistent with the way how pathspec works in general in Git).
// '`foo/`' will not match regular file '`foo`' or symbolic link '`foo`'
// -> ignore-rules will not deal with it, because it costs extra `fs.stat` call
//      you could use option `mark: true` with `glob`

// '`foo/`' should not continue with the '`..`'


var DEFAULT_REPLACER_PREFIX = [

// > Trailing spaces are ignored unless they are quoted with backslash ("\")
[
// (a\ ) -> (a )
// (a  ) -> (a)
// (a \ ) -> (a  )
/\\?\s+$/, function (match) {
  return match.indexOf('\\') === 0 ? ' ' : '';
}],

// replace (\ ) with ' '
[/\\\s/g, function () {
  return ' ';
}],

// Escape metacharacters
// which is written down by users but means special for regular expressions.

// > There are 12 characters with special meanings:
// > - the backslash \,
// > - the caret ^,
// > - the dollar sign $,
// > - the period or dot .,
// > - the vertical bar or pipe symbol |,
// > - the question mark ?,
// > - the asterisk or star *,
// > - the plus sign +,
// > - the opening parenthesis (,
// > - the closing parenthesis ),
// > - and the opening square bracket [,
// > - the opening curly brace {,
// > These special characters are often called "metacharacters".
[/[\\\^$.|?*+()\[{]/g, function (match) {
  return '\\' + match;
}],

// leading slash
[

// > A leading slash matches the beginning of the pathname.
// > For example, "/*.c" matches "cat-file.c" but not "mozilla-sha1/sha1.c".
// A leading slash matches the beginning of the pathname
/^\//, function () {
  return '^';
}],

// replace special metacharacter slash after the leading slash
[/\//g, function () {
  return '\\/';
}], [
// > A leading "**" followed by a slash means match in all directories.
// > For example, "**/foo" matches file or directory "foo" anywhere,
// > the same as pattern "foo".
// > "**/foo/bar" matches file or directory "bar" anywhere that is directly under directory "foo".
// Notice that the '*'s have been replaced as '\\*'
/^\^*\\\*\\\*\\\//,

// '**/foo' <-> 'foo'
function () {
  return '^(?:.*\\/)?';
}]];

var DEFAULT_REPLACER_SUFFIX = [
// starting
[
// there will be no leading '/' (which has been replaced by section "leading slash")
// If starts with '**', adding a '^' to the regular expression also works
/^(?=[^\^])/, function () {
  return !/\/(?!$)/.test(this)
  // > If the pattern does not contain a slash /, Git treats it as a shell glob pattern
  // Actually, if there is only a trailing slash, git also treats it as a shell glob pattern
  ? '(?:^|\\/)'

  // > Otherwise, Git treats the pattern as a shell glob suitable for consumption by fnmatch(3)
  : '^';
}],

// two globstars
[
// Use lookahead assertions so that we could match more than one `'/**'`
/\\\/\\\*\\\*(?=\\\/|$)/g,

// Zero, one or several directories
// should not use '*', or it will be replaced by the next replacer

// Check if it is not the last `'/**'`
function (match, index, str) {
  return index + 6 < str.length

  // case: /**/
  // > A slash followed by two consecutive asterisks then a slash matches zero or more directories.
  // > For example, "a/**/b" matches "a/b", "a/x/b", "a/x/y/b" and so on.
  // '/**/'
  ? '(?:\\/[^\\/]+)*'

  // case: /**
  // > A trailing `"/**"` matches everything inside.

  // #21: everything inside but it should not include the current folder
  : '\\/.+';
}],

// intermediate wildcards
[
// Never replace escaped '*'
// ignore rule '\*' will match the path '*'

// 'abc.*/' -> go
// 'abc.*'  -> skip this rule
/(^|[^\\]+)\\\*(?=.+)/g,

// '*.js' matches '.js'
// '*.js' doesn't match 'abc'
function (match, p1) {
  return p1 + '[^\\/]*';
}],

// trailing wildcard
[/(\^|\\\/)?\\\*$/, function (match, p1) {
  return (p1
  // '\^':
  // '/*' does not match ''
  // '/*' does not match everything

  // '\\\/':
  // 'abc/*' does not match 'abc/'
  ? p1 + '[^/]+'

  // 'a*' matches 'a'
  // 'a*' matches 'aa'
  : '[^/]*') + '(?=$|\\/$)';
}], [
// unescape
/\\\\\\/g, function () {
  return '\\';
}]];

var POSITIVE_REPLACERS = [].concat(DEFAULT_REPLACER_PREFIX, [

// 'f'
// matches
// - /f(end)
// - /f/
// - (start)f(end)
// - (start)f/
// doesn't match
// - oof
// - foo
// pseudo:
// -> (^|/)f(/|$)

// ending
[
// 'js' will not match 'js.'
// 'ab' will not match 'abc'
/(?:[^*\/])$/,

// 'js*' will not match 'a.js'
// 'js/' will not match 'a.js'
// 'js' will match 'a.js' and 'a.js/'
function (match) {
  return match + '(?=$|\\/)';
}]], DEFAULT_REPLACER_SUFFIX);

var NEGATIVE_REPLACERS = [].concat(DEFAULT_REPLACER_PREFIX, [

// #24
// The MISSING rule of [gitignore docs](https://git-scm.com/docs/gitignore)
// A negative pattern without a trailing wildcard should not
// re-include the things inside that directory.

// eg:
// ['node_modules/*', '!node_modules']
// should ignore `node_modules/a.js`
[/(?:[^*\/])$/, function (match) {
  return match + '(?=$|\\/$)';
}]], DEFAULT_REPLACER_SUFFIX);

// A simple cache, because an ignore rule only has only one certain meaning
var cache = {};

// @param {pattern}
function make_regex(pattern, negative) {
  var r = cache[pattern];
  if (r) {
    return r;
  }

  var replacers = negative ? NEGATIVE_REPLACERS : POSITIVE_REPLACERS;

  var source = replacers.reduce(function (prev, current) {
    return prev.replace(current[0], current[1].bind(pattern));
  }, pattern);

  return cache[pattern] = new RegExp(source, 'i');
}

// Windows
// --------------------------------------------------------------
/* istanbul ignore if  */
if (
// Detect `process` so that it can run in browsers.
typeof process !== 'undefined' && (process.env && process.env.IGNORE_TEST_WIN32 || process.platform === 'win32')) {

  var filter = IgnoreBase.prototype._filter;
  var make_posix = function make_posix(str) {
    return (/^\\\\\?\\/.test(str) || /[^\x00-\x80]+/.test(str) ? str : str.replace(/\\/g, '/')
    );
  };

  IgnoreBase.prototype._filter = function (path$$1, slices) {
    path$$1 = make_posix(path$$1);
    return filter.call(this, path$$1, slices);
  };
}

function createIgnorer(ignorePath, withNodeModules) {
  let ignoreText = "";

  if (ignorePath) {
    const resolvedIgnorePath = path.resolve(ignorePath);
    try {
      ignoreText = fs.readFileSync(resolvedIgnorePath, "utf8");
    } catch (readError) {
      if (readError.code !== "ENOENT") {
        throw new Error(
          `Unable to read ${resolvedIgnorePath}: ${readError.message}`
        );
      }
    }
  }

  const ignorer = ignore().add(ignoreText);
  if (!withNodeModules) {
    ignorer.add("node_modules");
  }
  return ignorer;
}

var createIgnorer_1 = createIgnorer;

/**
 * @param {string} filePath
 * @param {{ ignorePath?: string, withNodeModules?: boolean, plugins: object }} opts
 *
 * Please note that prettier.getFileInfo() expects opts.plugins to be an array of paths,
 * not an object. A transformation from this array to an object is automatically done
 * internally by the method wrapper. See withPlugins() in index.js.
 */
function _getFileInfo(filePath, opts) {
  let ignored = false;
  const ignorer = createIgnorer_1(opts.ignorePath, opts.withNodeModules);
  ignored = ignorer.ignores(filePath);

  const inferredParser = options.inferParser(filePath, opts.plugins) || null;

  return {
    ignored,
    inferredParser
  };
}

// the method has been implemented as asynchronous to avoid possible breaking changes in future
function getFileInfo(filePath, opts) {
  return Promise.resolve().then(() => _getFileInfo(filePath, opts));
}

getFileInfo.sync = _getFileInfo;

var getFileInfo_1 = getFileInfo;

var lodash_uniqby = createCommonjsModule(function (module, exports) {
/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used to compose bitmasks for comparison styles. */
var UNORDERED_COMPARE_FLAG = 1,
    PARTIAL_COMPARE_FLAG = 2;

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0,
    MAX_SAFE_INTEGER = 9007199254740991;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    promiseTag = '[object Promise]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to match property names within property paths. */
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
    reIsPlainProp = /^\w*$/,
    reLeadingDot = /^\./,
    rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to match backslashes in property paths. */
var reEscapeChar = /\\(\\)?/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
typedArrayTags[errorTag] = typedArrayTags[funcTag] =
typedArrayTags[mapTag] = typedArrayTags[numberTag] =
typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
typedArrayTags[setTag] = typedArrayTags[stringTag] =
typedArrayTags[weakMapTag] = false;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Detect free variable `exports`. */
var freeExports = 'object' == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports && freeGlobal.process;

/** Used to access faster Node.js helpers. */
var nodeUtil = (function() {
  try {
    return freeProcess && freeProcess.binding('util');
  } catch (e) {}
}());

/* Node.js helper references. */
var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

/**
 * A specialized version of `_.includes` for arrays without support for
 * specifying an index to search from.
 *
 * @private
 * @param {Array} [array] The array to inspect.
 * @param {*} target The value to search for.
 * @returns {boolean} Returns `true` if `target` is found, else `false`.
 */
function arrayIncludes(array, value) {
  var length = array ? array.length : 0;
  return !!length && baseIndexOf(array, value, 0) > -1;
}

/**
 * This function is like `arrayIncludes` except that it accepts a comparator.
 *
 * @private
 * @param {Array} [array] The array to inspect.
 * @param {*} target The value to search for.
 * @param {Function} comparator The comparator invoked per element.
 * @returns {boolean} Returns `true` if `target` is found, else `false`.
 */
function arrayIncludesWith(array, value, comparator) {
  var index = -1,
      length = array ? array.length : 0;

  while (++index < length) {
    if (comparator(value, array[index])) {
      return true;
    }
  }
  return false;
}

/**
 * A specialized version of `_.some` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {boolean} Returns `true` if any element passes the predicate check,
 *  else `false`.
 */
function arraySome(array, predicate) {
  var index = -1,
      length = array ? array.length : 0;

  while (++index < length) {
    if (predicate(array[index], index, array)) {
      return true;
    }
  }
  return false;
}

/**
 * The base implementation of `_.findIndex` and `_.findLastIndex` without
 * support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} predicate The function invoked per iteration.
 * @param {number} fromIndex The index to search from.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseFindIndex(array, predicate, fromIndex, fromRight) {
  var length = array.length,
      index = fromIndex + (fromRight ? 1 : -1);

  while ((fromRight ? index-- : ++index < length)) {
    if (predicate(array[index], index, array)) {
      return index;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseIndexOf(array, value, fromIndex) {
  if (value !== value) {
    return baseFindIndex(array, baseIsNaN, fromIndex);
  }
  var index = fromIndex - 1,
      length = array.length;

  while (++index < length) {
    if (array[index] === value) {
      return index;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.isNaN` without support for number objects.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
 */
function baseIsNaN(value) {
  return value !== value;
}

/**
 * The base implementation of `_.property` without support for deep paths.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @returns {Function} Returns the new accessor function.
 */
function baseProperty(key) {
  return function(object) {
    return object == null ? undefined : object[key];
  };
}

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}

/**
 * Checks if a cache value for `key` exists.
 *
 * @private
 * @param {Object} cache The cache to query.
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function cacheHas(cache, key) {
  return cache.has(key);
}

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

/**
 * Checks if `value` is a host object in IE < 9.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
 */
function isHostObject(value) {
  // Many host objects are `Object` objects that can coerce to strings
  // despite having improperly defined `toString` methods.
  var result = false;
  if (value != null && typeof value.toString != 'function') {
    try {
      result = !!(value + '');
    } catch (e) {}
  }
  return result;
}

/**
 * Converts `map` to its key-value pairs.
 *
 * @private
 * @param {Object} map The map to convert.
 * @returns {Array} Returns the key-value pairs.
 */
function mapToArray(map) {
  var index = -1,
      result = Array(map.size);

  map.forEach(function(value, key) {
    result[++index] = [key, value];
  });
  return result;
}

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */
function setToArray(set) {
  var index = -1,
      result = Array(set.size);

  set.forEach(function(value) {
    result[++index] = value;
  });
  return result;
}

/** Used for built-in method references. */
var arrayProto = Array.prototype,
    funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/** Built-in value references. */
var Symbol = root.Symbol,
    Uint8Array = root.Uint8Array,
    propertyIsEnumerable = objectProto.propertyIsEnumerable,
    splice = arrayProto.splice;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = overArg(Object.keys, Object);

/* Built-in method references that are verified to be native. */
var DataView = getNative(root, 'DataView'),
    Map = getNative(root, 'Map'),
    Promise = getNative(root, 'Promise'),
    Set = getNative(root, 'Set'),
    WeakMap = getNative(root, 'WeakMap'),
    nativeCreate = getNative(Object, 'create');

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = toSource(DataView),
    mapCtorString = toSource(Map),
    promiseCtorString = toSource(Promise),
    setCtorString = toSource(Set),
    weakMapCtorString = toSource(WeakMap);

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined,
    symbolToString = symbolProto ? symbolProto.toString : undefined;

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
}

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  return this.has(key) && delete this.__data__[key];
}

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
}

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
}

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  return true;
}

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  return getMapData(this, key)['delete'](key);
}

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  getMapData(this, key).set(key, value);
  return this;
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

/**
 *
 * Creates an array cache object to store unique values.
 *
 * @private
 * @constructor
 * @param {Array} [values] The values to cache.
 */
function SetCache(values) {
  var index = -1,
      length = values ? values.length : 0;

  this.__data__ = new MapCache;
  while (++index < length) {
    this.add(values[index]);
  }
}

/**
 * Adds `value` to the array cache.
 *
 * @private
 * @name add
 * @memberOf SetCache
 * @alias push
 * @param {*} value The value to cache.
 * @returns {Object} Returns the cache instance.
 */
function setCacheAdd(value) {
  this.__data__.set(value, HASH_UNDEFINED);
  return this;
}

/**
 * Checks if `value` is in the array cache.
 *
 * @private
 * @name has
 * @memberOf SetCache
 * @param {*} value The value to search for.
 * @returns {number} Returns `true` if `value` is found, else `false`.
 */
function setCacheHas(value) {
  return this.__data__.has(value);
}

// Add methods to `SetCache`.
SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
SetCache.prototype.has = setCacheHas;

/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Stack(entries) {
  this.__data__ = new ListCache(entries);
}

/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */
function stackClear() {
  this.__data__ = new ListCache;
}

/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function stackDelete(key) {
  return this.__data__['delete'](key);
}

/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function stackGet(key) {
  return this.__data__.get(key);
}

/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function stackHas(key) {
  return this.__data__.has(key);
}

/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */
function stackSet(key, value) {
  var cache = this.__data__;
  if (cache instanceof ListCache) {
    var pairs = cache.__data__;
    if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
      pairs.push([key, value]);
      return this;
    }
    cache = this.__data__ = new MapCache(pairs);
  }
  cache.set(key, value);
  return this;
}

// Add methods to `Stack`.
Stack.prototype.clear = stackClear;
Stack.prototype['delete'] = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
  // Safari 9 makes `arguments.length` enumerable in strict mode.
  var result = (isArray(value) || isArguments(value))
    ? baseTimes(value.length, String)
    : [];

  var length = result.length,
      skipIndexes = !!length;

  for (var key in value) {
    if ((inherited || hasOwnProperty.call(value, key)) &&
        !(skipIndexes && (key == 'length' || isIndex(key, length)))) {
      result.push(key);
    }
  }
  return result;
}

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.get` without support for default values.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @returns {*} Returns the resolved value.
 */
function baseGet(object, path$$1) {
  path$$1 = isKey(path$$1, object) ? [path$$1] : castPath(path$$1);

  var index = 0,
      length = path$$1.length;

  while (object != null && index < length) {
    object = object[toKey(path$$1[index++])];
  }
  return (index && index == length) ? object : undefined;
}

/**
 * The base implementation of `getTag`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  return objectToString.call(value);
}

/**
 * The base implementation of `_.hasIn` without support for deep paths.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {Array|string} key The key to check.
 * @returns {boolean} Returns `true` if `key` exists, else `false`.
 */
function baseHasIn(object, key) {
  return object != null && key in Object(object);
}

/**
 * The base implementation of `_.isEqual` which supports partial comparisons
 * and tracks traversed objects.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @param {Function} [customizer] The function to customize comparisons.
 * @param {boolean} [bitmask] The bitmask of comparison flags.
 *  The bitmask may be composed of the following flags:
 *     1 - Unordered comparison
 *     2 - Partial comparison
 * @param {Object} [stack] Tracks traversed `value` and `other` objects.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 */
function baseIsEqual(value, other, customizer, bitmask, stack) {
  if (value === other) {
    return true;
  }
  if (value == null || other == null || (!isObject(value) && !isObjectLike(other))) {
    return value !== value && other !== other;
  }
  return baseIsEqualDeep(value, other, baseIsEqual, customizer, bitmask, stack);
}

/**
 * A specialized version of `baseIsEqual` for arrays and objects which performs
 * deep comparisons and tracks traversed objects enabling objects with circular
 * references to be compared.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Function} [customizer] The function to customize comparisons.
 * @param {number} [bitmask] The bitmask of comparison flags. See `baseIsEqual`
 *  for more details.
 * @param {Object} [stack] Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function baseIsEqualDeep(object, other, equalFunc, customizer, bitmask, stack) {
  var objIsArr = isArray(object),
      othIsArr = isArray(other),
      objTag = arrayTag,
      othTag = arrayTag;

  if (!objIsArr) {
    objTag = getTag(object);
    objTag = objTag == argsTag ? objectTag : objTag;
  }
  if (!othIsArr) {
    othTag = getTag(other);
    othTag = othTag == argsTag ? objectTag : othTag;
  }
  var objIsObj = objTag == objectTag && !isHostObject(object),
      othIsObj = othTag == objectTag && !isHostObject(other),
      isSameTag = objTag == othTag;

  if (isSameTag && !objIsObj) {
    stack || (stack = new Stack);
    return (objIsArr || isTypedArray(object))
      ? equalArrays(object, other, equalFunc, customizer, bitmask, stack)
      : equalByTag(object, other, objTag, equalFunc, customizer, bitmask, stack);
  }
  if (!(bitmask & PARTIAL_COMPARE_FLAG)) {
    var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
        othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

    if (objIsWrapped || othIsWrapped) {
      var objUnwrapped = objIsWrapped ? object.value() : object,
          othUnwrapped = othIsWrapped ? other.value() : other;

      stack || (stack = new Stack);
      return equalFunc(objUnwrapped, othUnwrapped, customizer, bitmask, stack);
    }
  }
  if (!isSameTag) {
    return false;
  }
  stack || (stack = new Stack);
  return equalObjects(object, other, equalFunc, customizer, bitmask, stack);
}

/**
 * The base implementation of `_.isMatch` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to inspect.
 * @param {Object} source The object of property values to match.
 * @param {Array} matchData The property names, values, and compare flags to match.
 * @param {Function} [customizer] The function to customize comparisons.
 * @returns {boolean} Returns `true` if `object` is a match, else `false`.
 */
function baseIsMatch(object, source, matchData, customizer) {
  var index = matchData.length,
      length = index,
      noCustomizer = !customizer;

  if (object == null) {
    return !length;
  }
  object = Object(object);
  while (index--) {
    var data = matchData[index];
    if ((noCustomizer && data[2])
          ? data[1] !== object[data[0]]
          : !(data[0] in object)
        ) {
      return false;
    }
  }
  while (++index < length) {
    data = matchData[index];
    var key = data[0],
        objValue = object[key],
        srcValue = data[1];

    if (noCustomizer && data[2]) {
      if (objValue === undefined && !(key in object)) {
        return false;
      }
    } else {
      var stack = new Stack;
      if (customizer) {
        var result = customizer(objValue, srcValue, key, object, source, stack);
      }
      if (!(result === undefined
            ? baseIsEqual(srcValue, objValue, customizer, UNORDERED_COMPARE_FLAG | PARTIAL_COMPARE_FLAG, stack)
            : result
          )) {
        return false;
      }
    }
  }
  return true;
}

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = (isFunction(value) || isHostObject(value)) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */
function baseIsTypedArray(value) {
  return isObjectLike(value) &&
    isLength(value.length) && !!typedArrayTags[objectToString.call(value)];
}

/**
 * The base implementation of `_.iteratee`.
 *
 * @private
 * @param {*} [value=_.identity] The value to convert to an iteratee.
 * @returns {Function} Returns the iteratee.
 */
function baseIteratee(value) {
  // Don't store the `typeof` result in a variable to avoid a JIT bug in Safari 9.
  // See https://bugs.webkit.org/show_bug.cgi?id=156034 for more details.
  if (typeof value == 'function') {
    return value;
  }
  if (value == null) {
    return identity;
  }
  if (typeof value == 'object') {
    return isArray(value)
      ? baseMatchesProperty(value[0], value[1])
      : baseMatches(value);
  }
  return property(value);
}

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

/**
 * The base implementation of `_.matches` which doesn't clone `source`.
 *
 * @private
 * @param {Object} source The object of property values to match.
 * @returns {Function} Returns the new spec function.
 */
function baseMatches(source) {
  var matchData = getMatchData(source);
  if (matchData.length == 1 && matchData[0][2]) {
    return matchesStrictComparable(matchData[0][0], matchData[0][1]);
  }
  return function(object) {
    return object === source || baseIsMatch(object, source, matchData);
  };
}

/**
 * The base implementation of `_.matchesProperty` which doesn't clone `srcValue`.
 *
 * @private
 * @param {string} path The path of the property to get.
 * @param {*} srcValue The value to match.
 * @returns {Function} Returns the new spec function.
 */
function baseMatchesProperty(path$$1, srcValue) {
  if (isKey(path$$1) && isStrictComparable(srcValue)) {
    return matchesStrictComparable(toKey(path$$1), srcValue);
  }
  return function(object) {
    var objValue = get(object, path$$1);
    return (objValue === undefined && objValue === srcValue)
      ? hasIn(object, path$$1)
      : baseIsEqual(srcValue, objValue, undefined, UNORDERED_COMPARE_FLAG | PARTIAL_COMPARE_FLAG);
  };
}

/**
 * A specialized version of `baseProperty` which supports deep paths.
 *
 * @private
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new accessor function.
 */
function basePropertyDeep(path$$1) {
  return function(object) {
    return baseGet(object, path$$1);
  };
}

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

/**
 * The base implementation of `_.uniqBy` without support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} [iteratee] The iteratee invoked per element.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns the new duplicate free array.
 */
function baseUniq(array, iteratee, comparator) {
  var index = -1,
      includes = arrayIncludes,
      length = array.length,
      isCommon = true,
      result = [],
      seen = result;

  if (comparator) {
    isCommon = false;
    includes = arrayIncludesWith;
  }
  else if (length >= LARGE_ARRAY_SIZE) {
    var set = iteratee ? null : createSet(array);
    if (set) {
      return setToArray(set);
    }
    isCommon = false;
    includes = cacheHas;
    seen = new SetCache;
  }
  else {
    seen = iteratee ? [] : result;
  }
  outer:
  while (++index < length) {
    var value = array[index],
        computed = iteratee ? iteratee(value) : value;

    value = (comparator || value !== 0) ? value : 0;
    if (isCommon && computed === computed) {
      var seenIndex = seen.length;
      while (seenIndex--) {
        if (seen[seenIndex] === computed) {
          continue outer;
        }
      }
      if (iteratee) {
        seen.push(computed);
      }
      result.push(value);
    }
    else if (!includes(seen, computed, comparator)) {
      if (seen !== result) {
        seen.push(computed);
      }
      result.push(value);
    }
  }
  return result;
}

/**
 * Casts `value` to a path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {Array} Returns the cast property path array.
 */
function castPath(value) {
  return isArray(value) ? value : stringToPath(value);
}

/**
 * Creates a set object of `values`.
 *
 * @private
 * @param {Array} values The values to add to the set.
 * @returns {Object} Returns the new set.
 */
var createSet = !(Set && (1 / setToArray(new Set([,-0]))[1]) == INFINITY) ? noop : function(values) {
  return new Set(values);
};

/**
 * A specialized version of `baseIsEqualDeep` for arrays with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Array} array The array to compare.
 * @param {Array} other The other array to compare.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Function} customizer The function to customize comparisons.
 * @param {number} bitmask The bitmask of comparison flags. See `baseIsEqual`
 *  for more details.
 * @param {Object} stack Tracks traversed `array` and `other` objects.
 * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
 */
function equalArrays(array, other, equalFunc, customizer, bitmask, stack) {
  var isPartial = bitmask & PARTIAL_COMPARE_FLAG,
      arrLength = array.length,
      othLength = other.length;

  if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
    return false;
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(array);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var index = -1,
      result = true,
      seen = (bitmask & UNORDERED_COMPARE_FLAG) ? new SetCache : undefined;

  stack.set(array, other);
  stack.set(other, array);

  // Ignore non-index properties.
  while (++index < arrLength) {
    var arrValue = array[index],
        othValue = other[index];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, arrValue, index, other, array, stack)
        : customizer(arrValue, othValue, index, array, other, stack);
    }
    if (compared !== undefined) {
      if (compared) {
        continue;
      }
      result = false;
      break;
    }
    // Recursively compare arrays (susceptible to call stack limits).
    if (seen) {
      if (!arraySome(other, function(othValue, othIndex) {
            if (!seen.has(othIndex) &&
                (arrValue === othValue || equalFunc(arrValue, othValue, customizer, bitmask, stack))) {
              return seen.add(othIndex);
            }
          })) {
        result = false;
        break;
      }
    } else if (!(
          arrValue === othValue ||
            equalFunc(arrValue, othValue, customizer, bitmask, stack)
        )) {
      result = false;
      break;
    }
  }
  stack['delete'](array);
  stack['delete'](other);
  return result;
}

/**
 * A specialized version of `baseIsEqualDeep` for comparing objects of
 * the same `toStringTag`.
 *
 * **Note:** This function only supports comparing values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {string} tag The `toStringTag` of the objects to compare.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Function} customizer The function to customize comparisons.
 * @param {number} bitmask The bitmask of comparison flags. See `baseIsEqual`
 *  for more details.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalByTag(object, other, tag, equalFunc, customizer, bitmask, stack) {
  switch (tag) {
    case dataViewTag:
      if ((object.byteLength != other.byteLength) ||
          (object.byteOffset != other.byteOffset)) {
        return false;
      }
      object = object.buffer;
      other = other.buffer;

    case arrayBufferTag:
      if ((object.byteLength != other.byteLength) ||
          !equalFunc(new Uint8Array(object), new Uint8Array(other))) {
        return false;
      }
      return true;

    case boolTag:
    case dateTag:
    case numberTag:
      // Coerce booleans to `1` or `0` and dates to milliseconds.
      // Invalid dates are coerced to `NaN`.
      return eq(+object, +other);

    case errorTag:
      return object.name == other.name && object.message == other.message;

    case regexpTag:
    case stringTag:
      // Coerce regexes to strings and treat strings, primitives and objects,
      // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
      // for more details.
      return object == (other + '');

    case mapTag:
      var convert = mapToArray;

    case setTag:
      var isPartial = bitmask & PARTIAL_COMPARE_FLAG;
      convert || (convert = setToArray);

      if (object.size != other.size && !isPartial) {
        return false;
      }
      // Assume cyclic values are equal.
      var stacked = stack.get(object);
      if (stacked) {
        return stacked == other;
      }
      bitmask |= UNORDERED_COMPARE_FLAG;

      // Recursively compare objects (susceptible to call stack limits).
      stack.set(object, other);
      var result = equalArrays(convert(object), convert(other), equalFunc, customizer, bitmask, stack);
      stack['delete'](object);
      return result;

    case symbolTag:
      if (symbolValueOf) {
        return symbolValueOf.call(object) == symbolValueOf.call(other);
      }
  }
  return false;
}

/**
 * A specialized version of `baseIsEqualDeep` for objects with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Function} customizer The function to customize comparisons.
 * @param {number} bitmask The bitmask of comparison flags. See `baseIsEqual`
 *  for more details.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalObjects(object, other, equalFunc, customizer, bitmask, stack) {
  var isPartial = bitmask & PARTIAL_COMPARE_FLAG,
      objProps = keys(object),
      objLength = objProps.length,
      othProps = keys(other),
      othLength = othProps.length;

  if (objLength != othLength && !isPartial) {
    return false;
  }
  var index = objLength;
  while (index--) {
    var key = objProps[index];
    if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) {
      return false;
    }
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(object);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var result = true;
  stack.set(object, other);
  stack.set(other, object);

  var skipCtor = isPartial;
  while (++index < objLength) {
    key = objProps[index];
    var objValue = object[key],
        othValue = other[key];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, objValue, key, other, object, stack)
        : customizer(objValue, othValue, key, object, other, stack);
    }
    // Recursively compare objects (susceptible to call stack limits).
    if (!(compared === undefined
          ? (objValue === othValue || equalFunc(objValue, othValue, customizer, bitmask, stack))
          : compared
        )) {
      result = false;
      break;
    }
    skipCtor || (skipCtor = key == 'constructor');
  }
  if (result && !skipCtor) {
    var objCtor = object.constructor,
        othCtor = other.constructor;

    // Non `Object` object instances with different constructors are not equal.
    if (objCtor != othCtor &&
        ('constructor' in object && 'constructor' in other) &&
        !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
          typeof othCtor == 'function' && othCtor instanceof othCtor)) {
      result = false;
    }
  }
  stack['delete'](object);
  stack['delete'](other);
  return result;
}

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

/**
 * Gets the property names, values, and compare flags of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the match data of `object`.
 */
function getMatchData(object) {
  var result = keys(object),
      length = result.length;

  while (length--) {
    var key = result[length],
        value = object[key];

    result[length] = [key, value, isStrictComparable(value)];
  }
  return result;
}

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag = baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11,
// for data views in Edge < 14, and promises in Node.js.
if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
    (Map && getTag(new Map) != mapTag) ||
    (Promise && getTag(Promise.resolve()) != promiseTag) ||
    (Set && getTag(new Set) != setTag) ||
    (WeakMap && getTag(new WeakMap) != weakMapTag)) {
  getTag = function(value) {
    var result = objectToString.call(value),
        Ctor = result == objectTag ? value.constructor : undefined,
        ctorString = Ctor ? toSource(Ctor) : undefined;

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString: return dataViewTag;
        case mapCtorString: return mapTag;
        case promiseCtorString: return promiseTag;
        case setCtorString: return setTag;
        case weakMapCtorString: return weakMapTag;
      }
    }
    return result;
  };
}

/**
 * Checks if `path` exists on `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @param {Function} hasFunc The function to check properties.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 */
function hasPath(object, path$$1, hasFunc) {
  path$$1 = isKey(path$$1, object) ? [path$$1] : castPath(path$$1);

  var result,
      index = -1,
      length = path$$1.length;

  while (++index < length) {
    var key = toKey(path$$1[index]);
    if (!(result = object != null && hasFunc(object, key))) {
      break;
    }
    object = object[key];
  }
  if (result) {
    return result;
  }
  var length = object ? object.length : 0;
  return !!length && isLength(length) && isIndex(key, length) &&
    (isArray(object) || isArguments(object));
}

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length &&
    (typeof value == 'number' || reIsUint.test(value)) &&
    (value > -1 && value % 1 == 0 && value < length);
}

/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */
function isKey(value, object) {
  if (isArray(value)) {
    return false;
  }
  var type = typeof value;
  if (type == 'number' || type == 'symbol' || type == 'boolean' ||
      value == null || isSymbol(value)) {
    return true;
  }
  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
    (object != null && value in Object(object));
}

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

  return value === proto;
}

/**
 * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` if suitable for strict
 *  equality comparisons, else `false`.
 */
function isStrictComparable(value) {
  return value === value && !isObject(value);
}

/**
 * A specialized version of `matchesProperty` for source values suitable
 * for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @param {*} srcValue The value to match.
 * @returns {Function} Returns the new spec function.
 */
function matchesStrictComparable(key, srcValue) {
  return function(object) {
    if (object == null) {
      return false;
    }
    return object[key] === srcValue &&
      (srcValue !== undefined || (key in Object(object)));
  };
}

/**
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */
var stringToPath = memoize(function(string) {
  string = toString(string);

  var result = [];
  if (reLeadingDot.test(string)) {
    result.push('');
  }
  string.replace(rePropName, function(match, number, quote, string) {
    result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
  });
  return result;
});

/**
 * Converts `value` to a string key if it's not a string or symbol.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {string|symbol} Returns the key.
 */
function toKey(value) {
  if (typeof value == 'string' || isSymbol(value)) {
    return value;
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to process.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

/**
 * This method is like `_.uniq` except that it accepts `iteratee` which is
 * invoked for each element in `array` to generate the criterion by which
 * uniqueness is computed. The iteratee is invoked with one argument: (value).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @param {Function} [iteratee=_.identity]
 *  The iteratee invoked per element.
 * @returns {Array} Returns the new duplicate free array.
 * @example
 *
 * _.uniqBy([2.1, 1.2, 2.3], Math.floor);
 * // => [2.1, 1.2]
 *
 * // The `_.property` iteratee shorthand.
 * _.uniqBy([{ 'x': 1 }, { 'x': 2 }, { 'x': 1 }], 'x');
 * // => [{ 'x': 1 }, { 'x': 2 }]
 */
function uniqBy(array, iteratee) {
  return (array && array.length)
    ? baseUniq(array, baseIteratee(iteratee, 2))
    : [];
}

/**
 * Creates a function that memoizes the result of `func`. If `resolver` is
 * provided, it determines the cache key for storing the result based on the
 * arguments provided to the memoized function. By default, the first argument
 * provided to the memoized function is used as the map cache key. The `func`
 * is invoked with the `this` binding of the memoized function.
 *
 * **Note:** The cache is exposed as the `cache` property on the memoized
 * function. Its creation may be customized by replacing the `_.memoize.Cache`
 * constructor with one whose instances implement the
 * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
 * method interface of `delete`, `get`, `has`, and `set`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to have its output memoized.
 * @param {Function} [resolver] The function to resolve the cache key.
 * @returns {Function} Returns the new memoized function.
 * @example
 *
 * var object = { 'a': 1, 'b': 2 };
 * var other = { 'c': 3, 'd': 4 };
 *
 * var values = _.memoize(_.values);
 * values(object);
 * // => [1, 2]
 *
 * values(other);
 * // => [3, 4]
 *
 * object.a = 2;
 * values(object);
 * // => [1, 2]
 *
 * // Modify the result cache.
 * values.cache.set(object, ['a', 'b']);
 * values(object);
 * // => ['a', 'b']
 *
 * // Replace `_.memoize.Cache`.
 * _.memoize.Cache = WeakMap;
 */
function memoize(func, resolver) {
  if (typeof func != 'function' || (resolver && typeof resolver != 'function')) {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var memoized = function() {
    var args = arguments,
        key = resolver ? resolver.apply(this, args) : args[0],
        cache = memoized.cache;

    if (cache.has(key)) {
      return cache.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result);
    return result;
  };
  memoized.cache = new (memoize.Cache || MapCache);
  return memoized;
}

// Assign cache to `_.memoize`.
memoize.Cache = MapCache;

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
function isArguments(value) {
  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
  return isArrayLikeObject(value) && hasOwnProperty.call(value, 'callee') &&
    (!propertyIsEnumerable.call(value, 'callee') || objectToString.call(value) == argsTag);
}

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object,
 *  else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */
function isArrayLikeObject(value) {
  return isObjectLike(value) && isArrayLike(value);
}

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8-9 which returns 'object' for typed array and other constructors.
  var tag = isObject(value) ? objectToString.call(value) : '';
  return tag == funcTag || tag == genTag;
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
}

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  return value == null ? '' : baseToString(value);
}

/**
 * Gets the value at `path` of `object`. If the resolved value is
 * `undefined`, the `defaultValue` is returned in its place.
 *
 * @static
 * @memberOf _
 * @since 3.7.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @param {*} [defaultValue] The value returned for `undefined` resolved values.
 * @returns {*} Returns the resolved value.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
 *
 * _.get(object, 'a[0].b.c');
 * // => 3
 *
 * _.get(object, ['a', '0', 'b', 'c']);
 * // => 3
 *
 * _.get(object, 'a.b.c', 'default');
 * // => 'default'
 */
function get(object, path$$1, defaultValue) {
  var result = object == null ? undefined : baseGet(object, path$$1);
  return result === undefined ? defaultValue : result;
}

/**
 * Checks if `path` is a direct or inherited property of `object`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 * @example
 *
 * var object = _.create({ 'a': _.create({ 'b': 2 }) });
 *
 * _.hasIn(object, 'a');
 * // => true
 *
 * _.hasIn(object, 'a.b');
 * // => true
 *
 * _.hasIn(object, ['a', 'b']);
 * // => true
 *
 * _.hasIn(object, 'b');
 * // => false
 */
function hasIn(object, path$$1) {
  return object != null && hasPath(object, path$$1, baseHasIn);
}

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}

/**
 * This method returns the first argument it receives.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'a': 1 };
 *
 * console.log(_.identity(object) === object);
 * // => true
 */
function identity(value) {
  return value;
}

/**
 * This method returns `undefined`.
 *
 * @static
 * @memberOf _
 * @since 2.3.0
 * @category Util
 * @example
 *
 * _.times(2, _.noop);
 * // => [undefined, undefined]
 */
function noop() {
  // No operation performed.
}

/**
 * Creates a function that returns the value at `path` of a given object.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new accessor function.
 * @example
 *
 * var objects = [
 *   { 'a': { 'b': 2 } },
 *   { 'a': { 'b': 1 } }
 * ];
 *
 * _.map(objects, _.property('a.b'));
 * // => [2, 1]
 *
 * _.map(_.sortBy(objects, _.property(['a', 'b'])), 'a.b');
 * // => [1, 2]
 */
function property(path$$1) {
  return isKey(path$$1) ? baseProperty(toKey(path$$1)) : basePropertyDeep(path$$1);
}

module.exports = uniqBy;
});

var PENDING = 'pending';
var SETTLED = 'settled';
var FULFILLED = 'fulfilled';
var REJECTED = 'rejected';
var NOOP = function () {};
var isNode = typeof commonjsGlobal !== 'undefined' && typeof commonjsGlobal.process !== 'undefined' && typeof commonjsGlobal.process.emit === 'function';

var asyncSetTimer = typeof setImmediate === 'undefined' ? setTimeout : setImmediate;
var asyncQueue = [];
var asyncTimer;

function asyncFlush() {
	// run promise callbacks
	for (var i = 0; i < asyncQueue.length; i++) {
		asyncQueue[i][0](asyncQueue[i][1]);
	}

	// reset async asyncQueue
	asyncQueue = [];
	asyncTimer = false;
}

function asyncCall(callback, arg) {
	asyncQueue.push([callback, arg]);

	if (!asyncTimer) {
		asyncTimer = true;
		asyncSetTimer(asyncFlush, 0);
	}
}

function invokeResolver(resolver, promise) {
	function resolvePromise(value) {
		resolve(promise, value);
	}

	function rejectPromise(reason) {
		reject(promise, reason);
	}

	try {
		resolver(resolvePromise, rejectPromise);
	} catch (e) {
		rejectPromise(e);
	}
}

function invokeCallback(subscriber) {
	var owner = subscriber.owner;
	var settled = owner._state;
	var value = owner._data;
	var callback = subscriber[settled];
	var promise = subscriber.then;

	if (typeof callback === 'function') {
		settled = FULFILLED;
		try {
			value = callback(value);
		} catch (e) {
			reject(promise, e);
		}
	}

	if (!handleThenable(promise, value)) {
		if (settled === FULFILLED) {
			resolve(promise, value);
		}

		if (settled === REJECTED) {
			reject(promise, value);
		}
	}
}

function handleThenable(promise, value) {
	var resolved;

	try {
		if (promise === value) {
			throw new TypeError('A promises callback cannot return that same promise.');
		}

		if (value && (typeof value === 'function' || typeof value === 'object')) {
			// then should be retrieved only once
			var then = value.then;

			if (typeof then === 'function') {
				then.call(value, function (val) {
					if (!resolved) {
						resolved = true;

						if (value === val) {
							fulfill(promise, val);
						} else {
							resolve(promise, val);
						}
					}
				}, function (reason) {
					if (!resolved) {
						resolved = true;

						reject(promise, reason);
					}
				});

				return true;
			}
		}
	} catch (e) {
		if (!resolved) {
			reject(promise, e);
		}

		return true;
	}

	return false;
}

function resolve(promise, value) {
	if (promise === value || !handleThenable(promise, value)) {
		fulfill(promise, value);
	}
}

function fulfill(promise, value) {
	if (promise._state === PENDING) {
		promise._state = SETTLED;
		promise._data = value;

		asyncCall(publishFulfillment, promise);
	}
}

function reject(promise, reason) {
	if (promise._state === PENDING) {
		promise._state = SETTLED;
		promise._data = reason;

		asyncCall(publishRejection, promise);
	}
}

function publish(promise) {
	promise._then = promise._then.forEach(invokeCallback);
}

function publishFulfillment(promise) {
	promise._state = FULFILLED;
	publish(promise);
}

function publishRejection(promise) {
	promise._state = REJECTED;
	publish(promise);
	if (!promise._handled && isNode) {
		commonjsGlobal.process.emit('unhandledRejection', promise._data, promise);
	}
}

function notifyRejectionHandled(promise) {
	commonjsGlobal.process.emit('rejectionHandled', promise);
}

/**
 * @class
 */
function Promise$1(resolver) {
	if (typeof resolver !== 'function') {
		throw new TypeError('Promise resolver ' + resolver + ' is not a function');
	}

	if (this instanceof Promise$1 === false) {
		throw new TypeError('Failed to construct \'Promise\': Please use the \'new\' operator, this object constructor cannot be called as a function.');
	}

	this._then = [];

	invokeResolver(resolver, this);
}

Promise$1.prototype = {
	constructor: Promise$1,

	_state: PENDING,
	_then: null,
	_data: undefined,
	_handled: false,

	then: function (onFulfillment, onRejection) {
		var subscriber = {
			owner: this,
			then: new this.constructor(NOOP),
			fulfilled: onFulfillment,
			rejected: onRejection
		};

		if ((onRejection || onFulfillment) && !this._handled) {
			this._handled = true;
			if (this._state === REJECTED && isNode) {
				asyncCall(notifyRejectionHandled, this);
			}
		}

		if (this._state === FULFILLED || this._state === REJECTED) {
			// already resolved, call callback async
			asyncCall(invokeCallback, subscriber);
		} else {
			// subscribe
			this._then.push(subscriber);
		}

		return subscriber.then;
	},

	catch: function (onRejection) {
		return this.then(null, onRejection);
	}
};

Promise$1.all = function (promises) {
	if (!Array.isArray(promises)) {
		throw new TypeError('You must pass an array to Promise.all().');
	}

	return new Promise$1(function (resolve, reject) {
		var results = [];
		var remaining = 0;

		function resolver(index) {
			remaining++;
			return function (value) {
				results[index] = value;
				if (!--remaining) {
					resolve(results);
				}
			};
		}

		for (var i = 0, promise; i < promises.length; i++) {
			promise = promises[i];

			if (promise && typeof promise.then === 'function') {
				promise.then(resolver(i), reject);
			} else {
				results[i] = promise;
			}
		}

		if (!remaining) {
			resolve(results);
		}
	});
};

Promise$1.race = function (promises) {
	if (!Array.isArray(promises)) {
		throw new TypeError('You must pass an array to Promise.race().');
	}

	return new Promise$1(function (resolve, reject) {
		for (var i = 0, promise; i < promises.length; i++) {
			promise = promises[i];

			if (promise && typeof promise.then === 'function') {
				promise.then(resolve, reject);
			} else {
				resolve(promise);
			}
		}
	});
};

Promise$1.resolve = function (value) {
	if (value && typeof value === 'object' && value.constructor === Promise$1) {
		return value;
	}

	return new Promise$1(function (resolve) {
		resolve(value);
	});
};

Promise$1.reject = function (reason) {
	return new Promise$1(function (resolve, reject) {
		reject(reason);
	});
};

var pinkie = Promise$1;

var pinkiePromise = typeof Promise === 'function' ? Promise : pinkie;

var arrayUniq = createCommonjsModule(function (module) {
'use strict';

// there's 3 implementations written in increasing order of efficiency

// 1 - no Set type is defined
function uniqNoSet(arr) {
	var ret = [];

	for (var i = 0; i < arr.length; i++) {
		if (ret.indexOf(arr[i]) === -1) {
			ret.push(arr[i]);
		}
	}

	return ret;
}

// 2 - a simple Set type is defined
function uniqSet(arr) {
	var seen = new Set();
	return arr.filter(function (el) {
		if (!seen.has(el)) {
			seen.add(el);
			return true;
		}

		return false;
	});
}

// 3 - a standard Set type is defined and it has a forEach method
function uniqSetWithForEach(arr) {
	var ret = [];

	(new Set(arr)).forEach(function (el) {
		ret.push(el);
	});

	return ret;
}

// V8 currently has a broken implementation
// https://github.com/joyent/node/issues/8449
function doesForEachActuallyWork() {
	var ret = false;

	(new Set([true])).forEach(function (el) {
		ret = el;
	});

	return ret === true;
}

if ('Set' in commonjsGlobal) {
	if (typeof Set.prototype.forEach === 'function' && doesForEachActuallyWork()) {
		module.exports = uniqSetWithForEach;
	} else {
		module.exports = uniqSet;
	}
} else {
	module.exports = uniqNoSet;
}
});

var arrayUnion = function () {
	return arrayUniq([].concat.apply([], arguments));
};

/*
object-assign
(c) Sindre Sorhus
@license MIT
*/

/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

var objectAssign = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.


var isWindows = process.platform === 'win32';


// JavaScript implementation of realpath, ported from node pre-v6

var DEBUG = process.env.NODE_DEBUG && /fs/.test(process.env.NODE_DEBUG);

function rethrow() {
  // Only enable in debug mode. A backtrace uses ~1000 bytes of heap space and
  // is fairly slow to generate.
  var callback;
  if (DEBUG) {
    var backtrace = new Error;
    callback = debugCallback;
  } else
    callback = missingCallback;

  return callback;

  function debugCallback(err) {
    if (err) {
      backtrace.message = err.message;
      err = backtrace;
      missingCallback(err);
    }
  }

  function missingCallback(err) {
    if (err) {
      if (process.throwDeprecation)
        throw err;  // Forgot a callback but don't know where? Use NODE_DEBUG=fs
      else if (!process.noDeprecation) {
        var msg = 'fs: missing callback ' + (err.stack || err.message);
        if (process.traceDeprecation)
          console.trace(msg);
        else
          console.error(msg);
      }
    }
  }
}

function maybeCallback(cb) {
  return typeof cb === 'function' ? cb : rethrow();
}

// Regexp that finds the next partion of a (partial) path
// result is [base_with_slash, base], e.g. ['somedir/', 'somedir']
if (isWindows) {
  var nextPartRe = /(.*?)(?:[\/\\]+|$)/g;
} else {
  var nextPartRe = /(.*?)(?:[\/]+|$)/g;
}

// Regex to find the device root, including trailing slash. E.g. 'c:\\'.
if (isWindows) {
  var splitRootRe = /^(?:[a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/][^\\\/]+)?[\\\/]*/;
} else {
  var splitRootRe = /^[\/]*/;
}

var realpathSync$1 = function realpathSync(p, cache) {
  // make p is absolute
  p = path.resolve(p);

  if (cache && Object.prototype.hasOwnProperty.call(cache, p)) {
    return cache[p];
  }

  var original = p,
      seenLinks = {},
      knownHard = {};

  // current character position in p
  var pos;
  // the partial path so far, including a trailing slash if any
  var current;
  // the partial path without a trailing slash (except when pointing at a root)
  var base;
  // the partial path scanned in the previous round, with slash
  var previous;

  start();

  function start() {
    // Skip over roots
    var m = splitRootRe.exec(p);
    pos = m[0].length;
    current = m[0];
    base = m[0];
    previous = '';

    // On windows, check that the root exists. On unix there is no need.
    if (isWindows && !knownHard[base]) {
      fs.lstatSync(base);
      knownHard[base] = true;
    }
  }

  // walk down the path, swapping out linked pathparts for their real
  // values
  // NB: p.length changes.
  while (pos < p.length) {
    // find the next part
    nextPartRe.lastIndex = pos;
    var result = nextPartRe.exec(p);
    previous = current;
    current += result[0];
    base = previous + result[1];
    pos = nextPartRe.lastIndex;

    // continue if not a symlink
    if (knownHard[base] || (cache && cache[base] === base)) {
      continue;
    }

    var resolvedLink;
    if (cache && Object.prototype.hasOwnProperty.call(cache, base)) {
      // some known symbolic link.  no need to stat again.
      resolvedLink = cache[base];
    } else {
      var stat = fs.lstatSync(base);
      if (!stat.isSymbolicLink()) {
        knownHard[base] = true;
        if (cache) cache[base] = base;
        continue;
      }

      // read the link if it wasn't read before
      // dev/ino always return 0 on windows, so skip the check.
      var linkTarget = null;
      if (!isWindows) {
        var id = stat.dev.toString(32) + ':' + stat.ino.toString(32);
        if (seenLinks.hasOwnProperty(id)) {
          linkTarget = seenLinks[id];
        }
      }
      if (linkTarget === null) {
        fs.statSync(base);
        linkTarget = fs.readlinkSync(base);
      }
      resolvedLink = path.resolve(previous, linkTarget);
      // track this, if given a cache.
      if (cache) cache[base] = resolvedLink;
      if (!isWindows) seenLinks[id] = linkTarget;
    }

    // resolve the link, then start over
    p = path.resolve(resolvedLink, p.slice(pos));
    start();
  }

  if (cache) cache[original] = p;

  return p;
};


var realpath$1 = function realpath(p, cache, cb) {
  if (typeof cb !== 'function') {
    cb = maybeCallback(cache);
    cache = null;
  }

  // make p is absolute
  p = path.resolve(p);

  if (cache && Object.prototype.hasOwnProperty.call(cache, p)) {
    return process.nextTick(cb.bind(null, null, cache[p]));
  }

  var original = p,
      seenLinks = {},
      knownHard = {};

  // current character position in p
  var pos;
  // the partial path so far, including a trailing slash if any
  var current;
  // the partial path without a trailing slash (except when pointing at a root)
  var base;
  // the partial path scanned in the previous round, with slash
  var previous;

  start();

  function start() {
    // Skip over roots
    var m = splitRootRe.exec(p);
    pos = m[0].length;
    current = m[0];
    base = m[0];
    previous = '';

    // On windows, check that the root exists. On unix there is no need.
    if (isWindows && !knownHard[base]) {
      fs.lstat(base, function(err) {
        if (err) return cb(err);
        knownHard[base] = true;
        LOOP();
      });
    } else {
      process.nextTick(LOOP);
    }
  }

  // walk down the path, swapping out linked pathparts for their real
  // values
  function LOOP() {
    // stop if scanned past end of path
    if (pos >= p.length) {
      if (cache) cache[original] = p;
      return cb(null, p);
    }

    // find the next part
    nextPartRe.lastIndex = pos;
    var result = nextPartRe.exec(p);
    previous = current;
    current += result[0];
    base = previous + result[1];
    pos = nextPartRe.lastIndex;

    // continue if not a symlink
    if (knownHard[base] || (cache && cache[base] === base)) {
      return process.nextTick(LOOP);
    }

    if (cache && Object.prototype.hasOwnProperty.call(cache, base)) {
      // known symbolic link.  no need to stat again.
      return gotResolvedLink(cache[base]);
    }

    return fs.lstat(base, gotStat);
  }

  function gotStat(err, stat) {
    if (err) return cb(err);

    // if not a symlink, skip to the next path part
    if (!stat.isSymbolicLink()) {
      knownHard[base] = true;
      if (cache) cache[base] = base;
      return process.nextTick(LOOP);
    }

    // stat & read the link if not read before
    // call gotTarget as soon as the link target is known
    // dev/ino always return 0 on windows, so skip the check.
    if (!isWindows) {
      var id = stat.dev.toString(32) + ':' + stat.ino.toString(32);
      if (seenLinks.hasOwnProperty(id)) {
        return gotTarget(null, seenLinks[id], base);
      }
    }
    fs.stat(base, function(err) {
      if (err) return cb(err);

      fs.readlink(base, function(err, target) {
        if (!isWindows) seenLinks[id] = target;
        gotTarget(err, target);
      });
    });
  }

  function gotTarget(err, target, base) {
    if (err) return cb(err);

    var resolvedLink = path.resolve(previous, target);
    if (cache) cache[base] = resolvedLink;
    gotResolvedLink(resolvedLink);
  }

  function gotResolvedLink(resolvedLink) {
    // resolve the link, then start over
    p = path.resolve(resolvedLink, p.slice(pos));
    start();
  }
};

var old = {
	realpathSync: realpathSync$1,
	realpath: realpath$1
};

var fs_realpath = realpath;
realpath.realpath = realpath;
realpath.sync = realpathSync;
realpath.realpathSync = realpathSync;
realpath.monkeypatch = monkeypatch;
realpath.unmonkeypatch = unmonkeypatch;


var origRealpath = fs.realpath;
var origRealpathSync = fs.realpathSync;

var version$2 = process.version;
var ok = /^v[0-5]\./.test(version$2);


function newError (er) {
  return er && er.syscall === 'realpath' && (
    er.code === 'ELOOP' ||
    er.code === 'ENOMEM' ||
    er.code === 'ENAMETOOLONG'
  )
}

function realpath (p, cache, cb) {
  if (ok) {
    return origRealpath(p, cache, cb)
  }

  if (typeof cache === 'function') {
    cb = cache;
    cache = null;
  }
  origRealpath(p, cache, function (er, result) {
    if (newError(er)) {
      old.realpath(p, cache, cb);
    } else {
      cb(er, result);
    }
  });
}

function realpathSync (p, cache) {
  if (ok) {
    return origRealpathSync(p, cache)
  }

  try {
    return origRealpathSync(p, cache)
  } catch (er) {
    if (newError(er)) {
      return old.realpathSync(p, cache)
    } else {
      throw er
    }
  }
}

function monkeypatch () {
  fs.realpath = realpath;
  fs.realpathSync = realpathSync;
}

function unmonkeypatch () {
  fs.realpath = origRealpath;
  fs.realpathSync = origRealpathSync;
}

var concatMap = function (xs, fn) {
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        var x = fn(xs[i], i);
        if (isArray(x)) res.push.apply(res, x);
        else res.push(x);
    }
    return res;
};

var isArray = Array.isArray || function (xs) {
    return Object.prototype.toString.call(xs) === '[object Array]';
};

var balancedMatch = balanced;
function balanced(a, b, str) {
  if (a instanceof RegExp) a = maybeMatch(a, str);
  if (b instanceof RegExp) b = maybeMatch(b, str);

  var r = range(a, b, str);

  return r && {
    start: r[0],
    end: r[1],
    pre: str.slice(0, r[0]),
    body: str.slice(r[0] + a.length, r[1]),
    post: str.slice(r[1] + b.length)
  };
}

function maybeMatch(reg, str) {
  var m = str.match(reg);
  return m ? m[0] : null;
}

balanced.range = range;
function range(a, b, str) {
  var begs, beg, left, right, result;
  var ai = str.indexOf(a);
  var bi = str.indexOf(b, ai + 1);
  var i = ai;

  if (ai >= 0 && bi > 0) {
    begs = [];
    left = str.length;

    while (i >= 0 && !result) {
      if (i == ai) {
        begs.push(i);
        ai = str.indexOf(a, i + 1);
      } else if (begs.length == 1) {
        result = [ begs.pop(), bi ];
      } else {
        beg = begs.pop();
        if (beg < left) {
          left = beg;
          right = bi;
        }

        bi = str.indexOf(b, i + 1);
      }

      i = ai < bi && ai >= 0 ? ai : bi;
    }

    if (begs.length) {
      result = [ left, right ];
    }
  }

  return result;
}

var braceExpansion = expandTop;

var escSlash = '\0SLASH'+Math.random()+'\0';
var escOpen = '\0OPEN'+Math.random()+'\0';
var escClose = '\0CLOSE'+Math.random()+'\0';
var escComma = '\0COMMA'+Math.random()+'\0';
var escPeriod = '\0PERIOD'+Math.random()+'\0';

function numeric(str) {
  return parseInt(str, 10) == str
    ? parseInt(str, 10)
    : str.charCodeAt(0);
}

function escapeBraces(str) {
  return str.split('\\\\').join(escSlash)
            .split('\\{').join(escOpen)
            .split('\\}').join(escClose)
            .split('\\,').join(escComma)
            .split('\\.').join(escPeriod);
}

function unescapeBraces(str) {
  return str.split(escSlash).join('\\')
            .split(escOpen).join('{')
            .split(escClose).join('}')
            .split(escComma).join(',')
            .split(escPeriod).join('.');
}


// Basically just str.split(","), but handling cases
// where we have nested braced sections, which should be
// treated as individual members, like {a,{b,c},d}
function parseCommaParts(str) {
  if (!str)
    return [''];

  var parts = [];
  var m = balancedMatch('{', '}', str);

  if (!m)
    return str.split(',');

  var pre = m.pre;
  var body = m.body;
  var post = m.post;
  var p = pre.split(',');

  p[p.length-1] += '{' + body + '}';
  var postParts = parseCommaParts(post);
  if (post.length) {
    p[p.length-1] += postParts.shift();
    p.push.apply(p, postParts);
  }

  parts.push.apply(parts, p);

  return parts;
}

function expandTop(str) {
  if (!str)
    return [];

  // I don't know why Bash 4.3 does this, but it does.
  // Anything starting with {} will have the first two bytes preserved
  // but *only* at the top level, so {},a}b will not expand to anything,
  // but a{},b}c will be expanded to [a}c,abc].
  // One could argue that this is a bug in Bash, but since the goal of
  // this module is to match Bash's rules, we escape a leading {}
  if (str.substr(0, 2) === '{}') {
    str = '\\{\\}' + str.substr(2);
  }

  return expand(escapeBraces(str), true).map(unescapeBraces);
}

function embrace(str) {
  return '{' + str + '}';
}
function isPadded(el) {
  return /^-?0\d/.test(el);
}

function lte(i, y) {
  return i <= y;
}
function gte(i, y) {
  return i >= y;
}

function expand(str, isTop) {
  var expansions = [];

  var m = balancedMatch('{', '}', str);
  if (!m || /\$$/.test(m.pre)) return [str];

  var isNumericSequence = /^-?\d+\.\.-?\d+(?:\.\.-?\d+)?$/.test(m.body);
  var isAlphaSequence = /^[a-zA-Z]\.\.[a-zA-Z](?:\.\.-?\d+)?$/.test(m.body);
  var isSequence = isNumericSequence || isAlphaSequence;
  var isOptions = m.body.indexOf(',') >= 0;
  if (!isSequence && !isOptions) {
    // {a},b}
    if (m.post.match(/,.*\}/)) {
      str = m.pre + '{' + m.body + escClose + m.post;
      return expand(str);
    }
    return [str];
  }

  var n;
  if (isSequence) {
    n = m.body.split(/\.\./);
  } else {
    n = parseCommaParts(m.body);
    if (n.length === 1) {
      // x{{a,b}}y ==> x{a}y x{b}y
      n = expand(n[0], false).map(embrace);
      if (n.length === 1) {
        var post = m.post.length
          ? expand(m.post, false)
          : [''];
        return post.map(function(p) {
          return m.pre + n[0] + p;
        });
      }
    }
  }

  // at this point, n is the parts, and we know it's not a comma set
  // with a single entry.

  // no need to expand pre, since it is guaranteed to be free of brace-sets
  var pre = m.pre;
  var post = m.post.length
    ? expand(m.post, false)
    : [''];

  var N;

  if (isSequence) {
    var x = numeric(n[0]);
    var y = numeric(n[1]);
    var width = Math.max(n[0].length, n[1].length);
    var incr = n.length == 3
      ? Math.abs(numeric(n[2]))
      : 1;
    var test = lte;
    var reverse = y < x;
    if (reverse) {
      incr *= -1;
      test = gte;
    }
    var pad = n.some(isPadded);

    N = [];

    for (var i = x; test(i, y); i += incr) {
      var c;
      if (isAlphaSequence) {
        c = String.fromCharCode(i);
        if (c === '\\')
          c = '';
      } else {
        c = String(i);
        if (pad) {
          var need = width - c.length;
          if (need > 0) {
            var z = new Array(need + 1).join('0');
            if (i < 0)
              c = '-' + z + c.slice(1);
            else
              c = z + c;
          }
        }
      }
      N.push(c);
    }
  } else {
    N = concatMap(n, function(el) { return expand(el, false) });
  }

  for (var j = 0; j < N.length; j++) {
    for (var k = 0; k < post.length; k++) {
      var expansion = pre + N[j] + post[k];
      if (!isTop || isSequence || expansion)
        expansions.push(expansion);
    }
  }

  return expansions;
}

var minimatch_1 = minimatch;
minimatch.Minimatch = Minimatch$1;

var path$2 = { sep: '/' };
try {
  path$2 = path;
} catch (er) {}

var GLOBSTAR = minimatch.GLOBSTAR = Minimatch$1.GLOBSTAR = {};


var plTypes = {
  '!': { open: '(?:(?!(?:', close: '))[^/]*?)'},
  '?': { open: '(?:', close: ')?' },
  '+': { open: '(?:', close: ')+' },
  '*': { open: '(?:', close: ')*' },
  '@': { open: '(?:', close: ')' }
};

// any single thing other than /
// don't need to escape / when using new RegExp()
var qmark = '[^/]';

// * => any number of characters
var star = qmark + '*?';

// ** when dots are allowed.  Anything goes, except .. and .
// not (^ or / followed by one or two dots followed by $ or /),
// followed by anything, any number of times.
var twoStarDot = '(?:(?!(?:\\\/|^)(?:\\.{1,2})($|\\\/)).)*?';

// not a ^ or / followed by a dot,
// followed by anything, any number of times.
var twoStarNoDot = '(?:(?!(?:\\\/|^)\\.).)*?';

// characters that need to be escaped in RegExp.
var reSpecials = charSet('().*{}+?[]^$\\!');

// "abc" -> { a:true, b:true, c:true }
function charSet (s) {
  return s.split('').reduce(function (set, c) {
    set[c] = true;
    return set
  }, {})
}

// normalizes slashes.
var slashSplit = /\/+/;

minimatch.filter = filter$1;
function filter$1 (pattern, options) {
  options = options || {};
  return function (p, i, list) {
    return minimatch(p, pattern, options)
  }
}

function ext (a, b) {
  a = a || {};
  b = b || {};
  var t = {};
  Object.keys(b).forEach(function (k) {
    t[k] = b[k];
  });
  Object.keys(a).forEach(function (k) {
    t[k] = a[k];
  });
  return t
}

minimatch.defaults = function (def) {
  if (!def || !Object.keys(def).length) return minimatch

  var orig = minimatch;

  var m = function minimatch (p, pattern, options) {
    return orig.minimatch(p, pattern, ext(def, options))
  };

  m.Minimatch = function Minimatch (pattern, options) {
    return new orig.Minimatch(pattern, ext(def, options))
  };

  return m
};

Minimatch$1.defaults = function (def) {
  if (!def || !Object.keys(def).length) return Minimatch$1
  return minimatch.defaults(def).Minimatch
};

function minimatch (p, pattern, options) {
  if (typeof pattern !== 'string') {
    throw new TypeError('glob pattern string required')
  }

  if (!options) options = {};

  // shortcut: comments match nothing.
  if (!options.nocomment && pattern.charAt(0) === '#') {
    return false
  }

  // "" only matches ""
  if (pattern.trim() === '') return p === ''

  return new Minimatch$1(pattern, options).match(p)
}

function Minimatch$1 (pattern, options) {
  if (!(this instanceof Minimatch$1)) {
    return new Minimatch$1(pattern, options)
  }

  if (typeof pattern !== 'string') {
    throw new TypeError('glob pattern string required')
  }

  if (!options) options = {};
  pattern = pattern.trim();

  // windows support: need to use /, not \
  if (path$2.sep !== '/') {
    pattern = pattern.split(path$2.sep).join('/');
  }

  this.options = options;
  this.set = [];
  this.pattern = pattern;
  this.regexp = null;
  this.negate = false;
  this.comment = false;
  this.empty = false;

  // make the set of regexps etc.
  this.make();
}

Minimatch$1.prototype.debug = function () {};

Minimatch$1.prototype.make = make;
function make () {
  // don't do it more than once.
  if (this._made) return

  var pattern = this.pattern;
  var options = this.options;

  // empty patterns and comments match nothing.
  if (!options.nocomment && pattern.charAt(0) === '#') {
    this.comment = true;
    return
  }
  if (!pattern) {
    this.empty = true;
    return
  }

  // step 1: figure out negation, etc.
  this.parseNegate();

  // step 2: expand braces
  var set = this.globSet = this.braceExpand();

  if (options.debug) this.debug = console.error;

  this.debug(this.pattern, set);

  // step 3: now we have a set, so turn each one into a series of path-portion
  // matching patterns.
  // These will be regexps, except in the case of "**", which is
  // set to the GLOBSTAR object for globstar behavior,
  // and will not contain any / characters
  set = this.globParts = set.map(function (s) {
    return s.split(slashSplit)
  });

  this.debug(this.pattern, set);

  // glob --> regexps
  set = set.map(function (s, si, set) {
    return s.map(this.parse, this)
  }, this);

  this.debug(this.pattern, set);

  // filter out everything that didn't compile properly.
  set = set.filter(function (s) {
    return s.indexOf(false) === -1
  });

  this.debug(this.pattern, set);

  this.set = set;
}

Minimatch$1.prototype.parseNegate = parseNegate;
function parseNegate () {
  var pattern = this.pattern;
  var negate = false;
  var options = this.options;
  var negateOffset = 0;

  if (options.nonegate) return

  for (var i = 0, l = pattern.length
    ; i < l && pattern.charAt(i) === '!'
    ; i++) {
    negate = !negate;
    negateOffset++;
  }

  if (negateOffset) this.pattern = pattern.substr(negateOffset);
  this.negate = negate;
}

// Brace expansion:
// a{b,c}d -> abd acd
// a{b,}c -> abc ac
// a{0..3}d -> a0d a1d a2d a3d
// a{b,c{d,e}f}g -> abg acdfg acefg
// a{b,c}d{e,f}g -> abdeg acdeg abdeg abdfg
//
// Invalid sets are not expanded.
// a{2..}b -> a{2..}b
// a{b}c -> a{b}c
minimatch.braceExpand = function (pattern, options) {
  return braceExpand(pattern, options)
};

Minimatch$1.prototype.braceExpand = braceExpand;

function braceExpand (pattern, options) {
  if (!options) {
    if (this instanceof Minimatch$1) {
      options = this.options;
    } else {
      options = {};
    }
  }

  pattern = typeof pattern === 'undefined'
    ? this.pattern : pattern;

  if (typeof pattern === 'undefined') {
    throw new TypeError('undefined pattern')
  }

  if (options.nobrace ||
    !pattern.match(/\{.*\}/)) {
    // shortcut. no need to expand.
    return [pattern]
  }

  return braceExpansion(pattern)
}

// parse a component of the expanded set.
// At this point, no pattern may contain "/" in it
// so we're going to return a 2d array, where each entry is the full
// pattern, split on '/', and then turned into a regular expression.
// A regexp is made at the end which joins each array with an
// escaped /, and another full one which joins each regexp with |.
//
// Following the lead of Bash 4.1, note that "**" only has special meaning
// when it is the *only* thing in a path portion.  Otherwise, any series
// of * is equivalent to a single *.  Globstar behavior is enabled by
// default, and can be disabled by setting options.noglobstar.
Minimatch$1.prototype.parse = parse$3;
var SUBPARSE = {};
function parse$3 (pattern, isSub) {
  if (pattern.length > 1024 * 64) {
    throw new TypeError('pattern is too long')
  }

  var options = this.options;

  // shortcuts
  if (!options.noglobstar && pattern === '**') return GLOBSTAR
  if (pattern === '') return ''

  var re = '';
  var hasMagic = !!options.nocase;
  var escaping = false;
  // ? => one single character
  var patternListStack = [];
  var negativeLists = [];
  var stateChar;
  var inClass = false;
  var reClassStart = -1;
  var classStart = -1;
  // . and .. never match anything that doesn't start with .,
  // even when options.dot is set.
  var patternStart = pattern.charAt(0) === '.' ? '' // anything
  // not (start or / followed by . or .. followed by / or end)
  : options.dot ? '(?!(?:^|\\\/)\\.{1,2}(?:$|\\\/))'
  : '(?!\\.)';
  var self = this;

  function clearStateChar () {
    if (stateChar) {
      // we had some state-tracking character
      // that wasn't consumed by this pass.
      switch (stateChar) {
        case '*':
          re += star;
          hasMagic = true;
        break
        case '?':
          re += qmark;
          hasMagic = true;
        break
        default:
          re += '\\' + stateChar;
        break
      }
      self.debug('clearStateChar %j %j', stateChar, re);
      stateChar = false;
    }
  }

  for (var i = 0, len = pattern.length, c
    ; (i < len) && (c = pattern.charAt(i))
    ; i++) {
    this.debug('%s\t%s %s %j', pattern, i, re, c);

    // skip over any that are escaped.
    if (escaping && reSpecials[c]) {
      re += '\\' + c;
      escaping = false;
      continue
    }

    switch (c) {
      case '/':
        // completely not allowed, even escaped.
        // Should already be path-split by now.
        return false

      case '\\':
        clearStateChar();
        escaping = true;
      continue

      // the various stateChar values
      // for the "extglob" stuff.
      case '?':
      case '*':
      case '+':
      case '@':
      case '!':
        this.debug('%s\t%s %s %j <-- stateChar', pattern, i, re, c);

        // all of those are literals inside a class, except that
        // the glob [!a] means [^a] in regexp
        if (inClass) {
          this.debug('  in class');
          if (c === '!' && i === classStart + 1) c = '^';
          re += c;
          continue
        }

        // if we already have a stateChar, then it means
        // that there was something like ** or +? in there.
        // Handle the stateChar, then proceed with this one.
        self.debug('call clearStateChar %j', stateChar);
        clearStateChar();
        stateChar = c;
        // if extglob is disabled, then +(asdf|foo) isn't a thing.
        // just clear the statechar *now*, rather than even diving into
        // the patternList stuff.
        if (options.noext) clearStateChar();
      continue

      case '(':
        if (inClass) {
          re += '(';
          continue
        }

        if (!stateChar) {
          re += '\\(';
          continue
        }

        patternListStack.push({
          type: stateChar,
          start: i - 1,
          reStart: re.length,
          open: plTypes[stateChar].open,
          close: plTypes[stateChar].close
        });
        // negation is (?:(?!js)[^/]*)
        re += stateChar === '!' ? '(?:(?!(?:' : '(?:';
        this.debug('plType %j %j', stateChar, re);
        stateChar = false;
      continue

      case ')':
        if (inClass || !patternListStack.length) {
          re += '\\)';
          continue
        }

        clearStateChar();
        hasMagic = true;
        var pl = patternListStack.pop();
        // negation is (?:(?!js)[^/]*)
        // The others are (?:<pattern>)<type>
        re += pl.close;
        if (pl.type === '!') {
          negativeLists.push(pl);
        }
        pl.reEnd = re.length;
      continue

      case '|':
        if (inClass || !patternListStack.length || escaping) {
          re += '\\|';
          escaping = false;
          continue
        }

        clearStateChar();
        re += '|';
      continue

      // these are mostly the same in regexp and glob
      case '[':
        // swallow any state-tracking char before the [
        clearStateChar();

        if (inClass) {
          re += '\\' + c;
          continue
        }

        inClass = true;
        classStart = i;
        reClassStart = re.length;
        re += c;
      continue

      case ']':
        //  a right bracket shall lose its special
        //  meaning and represent itself in
        //  a bracket expression if it occurs
        //  first in the list.  -- POSIX.2 2.8.3.2
        if (i === classStart + 1 || !inClass) {
          re += '\\' + c;
          escaping = false;
          continue
        }

        // handle the case where we left a class open.
        // "[z-a]" is valid, equivalent to "\[z-a\]"
        if (inClass) {
          // split where the last [ was, make sure we don't have
          // an invalid re. if so, re-walk the contents of the
          // would-be class to re-translate any characters that
          // were passed through as-is
          // TODO: It would probably be faster to determine this
          // without a try/catch and a new RegExp, but it's tricky
          // to do safely.  For now, this is safe and works.
          var cs = pattern.substring(classStart + 1, i);
          try {
            RegExp('[' + cs + ']');
          } catch (er) {
            // not a valid class!
            var sp = this.parse(cs, SUBPARSE);
            re = re.substr(0, reClassStart) + '\\[' + sp[0] + '\\]';
            hasMagic = hasMagic || sp[1];
            inClass = false;
            continue
          }
        }

        // finish up the class.
        hasMagic = true;
        inClass = false;
        re += c;
      continue

      default:
        // swallow any state char that wasn't consumed
        clearStateChar();

        if (escaping) {
          // no need
          escaping = false;
        } else if (reSpecials[c]
          && !(c === '^' && inClass)) {
          re += '\\';
        }

        re += c;

    } // switch
  } // for

  // handle the case where we left a class open.
  // "[abc" is valid, equivalent to "\[abc"
  if (inClass) {
    // split where the last [ was, and escape it
    // this is a huge pita.  We now have to re-walk
    // the contents of the would-be class to re-translate
    // any characters that were passed through as-is
    cs = pattern.substr(classStart + 1);
    sp = this.parse(cs, SUBPARSE);
    re = re.substr(0, reClassStart) + '\\[' + sp[0];
    hasMagic = hasMagic || sp[1];
  }

  // handle the case where we had a +( thing at the *end*
  // of the pattern.
  // each pattern list stack adds 3 chars, and we need to go through
  // and escape any | chars that were passed through as-is for the regexp.
  // Go through and escape them, taking care not to double-escape any
  // | chars that were already escaped.
  for (pl = patternListStack.pop(); pl; pl = patternListStack.pop()) {
    var tail = re.slice(pl.reStart + pl.open.length);
    this.debug('setting tail', re, pl);
    // maybe some even number of \, then maybe 1 \, followed by a |
    tail = tail.replace(/((?:\\{2}){0,64})(\\?)\|/g, function (_, $1, $2) {
      if (!$2) {
        // the | isn't already escaped, so escape it.
        $2 = '\\';
      }

      // need to escape all those slashes *again*, without escaping the
      // one that we need for escaping the | character.  As it works out,
      // escaping an even number of slashes can be done by simply repeating
      // it exactly after itself.  That's why this trick works.
      //
      // I am sorry that you have to see this.
      return $1 + $1 + $2 + '|'
    });

    this.debug('tail=%j\n   %s', tail, tail, pl, re);
    var t = pl.type === '*' ? star
      : pl.type === '?' ? qmark
      : '\\' + pl.type;

    hasMagic = true;
    re = re.slice(0, pl.reStart) + t + '\\(' + tail;
  }

  // handle trailing things that only matter at the very end.
  clearStateChar();
  if (escaping) {
    // trailing \\
    re += '\\\\';
  }

  // only need to apply the nodot start if the re starts with
  // something that could conceivably capture a dot
  var addPatternStart = false;
  switch (re.charAt(0)) {
    case '.':
    case '[':
    case '(': addPatternStart = true;
  }

  // Hack to work around lack of negative lookbehind in JS
  // A pattern like: *.!(x).!(y|z) needs to ensure that a name
  // like 'a.xyz.yz' doesn't match.  So, the first negative
  // lookahead, has to look ALL the way ahead, to the end of
  // the pattern.
  for (var n = negativeLists.length - 1; n > -1; n--) {
    var nl = negativeLists[n];

    var nlBefore = re.slice(0, nl.reStart);
    var nlFirst = re.slice(nl.reStart, nl.reEnd - 8);
    var nlLast = re.slice(nl.reEnd - 8, nl.reEnd);
    var nlAfter = re.slice(nl.reEnd);

    nlLast += nlAfter;

    // Handle nested stuff like *(*.js|!(*.json)), where open parens
    // mean that we should *not* include the ) in the bit that is considered
    // "after" the negated section.
    var openParensBefore = nlBefore.split('(').length - 1;
    var cleanAfter = nlAfter;
    for (i = 0; i < openParensBefore; i++) {
      cleanAfter = cleanAfter.replace(/\)[+*?]?/, '');
    }
    nlAfter = cleanAfter;

    var dollar = '';
    if (nlAfter === '' && isSub !== SUBPARSE) {
      dollar = '$';
    }
    var newRe = nlBefore + nlFirst + nlAfter + dollar + nlLast;
    re = newRe;
  }

  // if the re is not "" at this point, then we need to make sure
  // it doesn't match against an empty path part.
  // Otherwise a/* will match a/, which it should not.
  if (re !== '' && hasMagic) {
    re = '(?=.)' + re;
  }

  if (addPatternStart) {
    re = patternStart + re;
  }

  // parsing just a piece of a larger pattern.
  if (isSub === SUBPARSE) {
    return [re, hasMagic]
  }

  // skip the regexp for non-magical patterns
  // unescape anything in it, though, so that it'll be
  // an exact match against a file etc.
  if (!hasMagic) {
    return globUnescape(pattern)
  }

  var flags = options.nocase ? 'i' : '';
  try {
    var regExp = new RegExp('^' + re + '$', flags);
  } catch (er) {
    // If it was an invalid regular expression, then it can't match
    // anything.  This trick looks for a character after the end of
    // the string, which is of course impossible, except in multi-line
    // mode, but it's not a /m regex.
    return new RegExp('$.')
  }

  regExp._glob = pattern;
  regExp._src = re;

  return regExp
}

minimatch.makeRe = function (pattern, options) {
  return new Minimatch$1(pattern, options || {}).makeRe()
};

Minimatch$1.prototype.makeRe = makeRe;
function makeRe () {
  if (this.regexp || this.regexp === false) return this.regexp

  // at this point, this.set is a 2d array of partial
  // pattern strings, or "**".
  //
  // It's better to use .match().  This function shouldn't
  // be used, really, but it's pretty convenient sometimes,
  // when you just want to work with a regex.
  var set = this.set;

  if (!set.length) {
    this.regexp = false;
    return this.regexp
  }
  var options = this.options;

  var twoStar = options.noglobstar ? star
    : options.dot ? twoStarDot
    : twoStarNoDot;
  var flags = options.nocase ? 'i' : '';

  var re = set.map(function (pattern) {
    return pattern.map(function (p) {
      return (p === GLOBSTAR) ? twoStar
      : (typeof p === 'string') ? regExpEscape(p)
      : p._src
    }).join('\\\/')
  }).join('|');

  // must match entire pattern
  // ending in a * or ** will make it less strict.
  re = '^(?:' + re + ')$';

  // can match anything, as long as it's not this.
  if (this.negate) re = '^(?!' + re + ').*$';

  try {
    this.regexp = new RegExp(re, flags);
  } catch (ex) {
    this.regexp = false;
  }
  return this.regexp
}

minimatch.match = function (list, pattern, options) {
  options = options || {};
  var mm = new Minimatch$1(pattern, options);
  list = list.filter(function (f) {
    return mm.match(f)
  });
  if (mm.options.nonull && !list.length) {
    list.push(pattern);
  }
  return list
};

Minimatch$1.prototype.match = match;
function match (f, partial) {
  this.debug('match', f, this.pattern);
  // short-circuit in the case of busted things.
  // comments, etc.
  if (this.comment) return false
  if (this.empty) return f === ''

  if (f === '/' && partial) return true

  var options = this.options;

  // windows: need to use /, not \
  if (path$2.sep !== '/') {
    f = f.split(path$2.sep).join('/');
  }

  // treat the test path as a set of pathparts.
  f = f.split(slashSplit);
  this.debug(this.pattern, 'split', f);

  // just ONE of the pattern sets in this.set needs to match
  // in order for it to be valid.  If negating, then just one
  // match means that we have failed.
  // Either way, return on the first hit.

  var set = this.set;
  this.debug(this.pattern, 'set', set);

  // Find the basename of the path by looking for the last non-empty segment
  var filename;
  var i;
  for (i = f.length - 1; i >= 0; i--) {
    filename = f[i];
    if (filename) break
  }

  for (i = 0; i < set.length; i++) {
    var pattern = set[i];
    var file = f;
    if (options.matchBase && pattern.length === 1) {
      file = [filename];
    }
    var hit = this.matchOne(file, pattern, partial);
    if (hit) {
      if (options.flipNegate) return true
      return !this.negate
    }
  }

  // didn't get any hits.  this is success if it's a negative
  // pattern, failure otherwise.
  if (options.flipNegate) return false
  return this.negate
}

// set partial to true to test if, for example,
// "/a/b" matches the start of "/*/b/*/d"
// Partial means, if you run out of file before you run
// out of pattern, then that's fine, as long as all
// the parts match.
Minimatch$1.prototype.matchOne = function (file, pattern, partial) {
  var options = this.options;

  this.debug('matchOne',
    { 'this': this, file: file, pattern: pattern });

  this.debug('matchOne', file.length, pattern.length);

  for (var fi = 0,
      pi = 0,
      fl = file.length,
      pl = pattern.length
      ; (fi < fl) && (pi < pl)
      ; fi++, pi++) {
    this.debug('matchOne loop');
    var p = pattern[pi];
    var f = file[fi];

    this.debug(pattern, p, f);

    // should be impossible.
    // some invalid regexp stuff in the set.
    if (p === false) return false

    if (p === GLOBSTAR) {
      this.debug('GLOBSTAR', [pattern, p, f]);

      // "**"
      // a/**/b/**/c would match the following:
      // a/b/x/y/z/c
      // a/x/y/z/b/c
      // a/b/x/b/x/c
      // a/b/c
      // To do this, take the rest of the pattern after
      // the **, and see if it would match the file remainder.
      // If so, return success.
      // If not, the ** "swallows" a segment, and try again.
      // This is recursively awful.
      //
      // a/**/b/**/c matching a/b/x/y/z/c
      // - a matches a
      // - doublestar
      //   - matchOne(b/x/y/z/c, b/**/c)
      //     - b matches b
      //     - doublestar
      //       - matchOne(x/y/z/c, c) -> no
      //       - matchOne(y/z/c, c) -> no
      //       - matchOne(z/c, c) -> no
      //       - matchOne(c, c) yes, hit
      var fr = fi;
      var pr = pi + 1;
      if (pr === pl) {
        this.debug('** at the end');
        // a ** at the end will just swallow the rest.
        // We have found a match.
        // however, it will not swallow /.x, unless
        // options.dot is set.
        // . and .. are *never* matched by **, for explosively
        // exponential reasons.
        for (; fi < fl; fi++) {
          if (file[fi] === '.' || file[fi] === '..' ||
            (!options.dot && file[fi].charAt(0) === '.')) return false
        }
        return true
      }

      // ok, let's see if we can swallow whatever we can.
      while (fr < fl) {
        var swallowee = file[fr];

        this.debug('\nglobstar while', file, fr, pattern, pr, swallowee);

        // XXX remove this slice.  Just pass the start index.
        if (this.matchOne(file.slice(fr), pattern.slice(pr), partial)) {
          this.debug('globstar found match!', fr, fl, swallowee);
          // found a match.
          return true
        } else {
          // can't swallow "." or ".." ever.
          // can only swallow ".foo" when explicitly asked.
          if (swallowee === '.' || swallowee === '..' ||
            (!options.dot && swallowee.charAt(0) === '.')) {
            this.debug('dot detected!', file, fr, pattern, pr);
            break
          }

          // ** swallows a segment, and continue.
          this.debug('globstar swallow a segment, and continue');
          fr++;
        }
      }

      // no match was found.
      // However, in partial mode, we can't say this is necessarily over.
      // If there's more *pattern* left, then
      if (partial) {
        // ran out of file
        this.debug('\n>>> no match, partial?', file, fr, pattern, pr);
        if (fr === fl) return true
      }
      return false
    }

    // something other than **
    // non-magic patterns just have to match exactly
    // patterns with magic have been turned into regexps.
    var hit;
    if (typeof p === 'string') {
      if (options.nocase) {
        hit = f.toLowerCase() === p.toLowerCase();
      } else {
        hit = f === p;
      }
      this.debug('string match', p, f, hit);
    } else {
      hit = f.match(p);
      this.debug('pattern match', p, f, hit);
    }

    if (!hit) return false
  }

  // Note: ending in / means that we'll get a final ""
  // at the end of the pattern.  This can only match a
  // corresponding "" at the end of the file.
  // If the file ends in /, then it can only match a
  // a pattern that ends in /, unless the pattern just
  // doesn't have any more for it. But, a/b/ should *not*
  // match "a/b/*", even though "" matches against the
  // [^/]*? pattern, except in partial mode, where it might
  // simply not be reached yet.
  // However, a/b/ should still satisfy a/*

  // now either we fell off the end of the pattern, or we're done.
  if (fi === fl && pi === pl) {
    // ran out of pattern and filename at the same time.
    // an exact hit!
    return true
  } else if (fi === fl) {
    // ran out of file, but still had pattern left.
    // this is ok if we're doing the match as part of
    // a glob fs traversal.
    return partial
  } else if (pi === pl) {
    // ran out of pattern, still have file left.
    // this is only acceptable if we're on the very last
    // empty segment of a file with a trailing slash.
    // a/* should match a/b/
    var emptyFileEnd = (fi === fl - 1) && (file[fi] === '');
    return emptyFileEnd
  }

  // should be unreachable.
  throw new Error('wtf?')
};

// replace stuff like \* with *
function globUnescape (s) {
  return s.replace(/\\(.)/g, '$1')
}

function regExpEscape (s) {
  return s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
}

var inherits_browser = createCommonjsModule(function (module) {
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor;
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor;
    var TempCtor = function () {};
    TempCtor.prototype = superCtor.prototype;
    ctor.prototype = new TempCtor();
    ctor.prototype.constructor = ctor;
  };
}
});

var inherits = createCommonjsModule(function (module) {
try {
  var util$$1 = util;
  if (typeof util$$1.inherits !== 'function') throw '';
  module.exports = util$$1.inherits;
} catch (e) {
  module.exports = inherits_browser;
}
});

function posix(path$$1) {
	return path$$1.charAt(0) === '/';
}

function win32(path$$1) {
	// https://github.com/nodejs/node/blob/b3fcc245fb25539909ef1d5eaa01dbf92e168633/lib/path.js#L56
	var splitDeviceRe = /^([a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/]+[^\\\/]+)?([\\\/])?([\s\S]*?)$/;
	var result = splitDeviceRe.exec(path$$1);
	var device = result[1] || '';
	var isUnc = Boolean(device && device.charAt(1) !== ':');

	// UNC paths are always absolute
	return Boolean(result[2] || isUnc);
}

var pathIsAbsolute = process.platform === 'win32' ? win32 : posix;
var posix_1 = posix;
var win32_1 = win32;

pathIsAbsolute.posix = posix_1;
pathIsAbsolute.win32 = win32_1;

var alphasort_1 = alphasort$2;
var alphasorti_1 = alphasorti$2;
var setopts_1 = setopts$2;
var ownProp_1 = ownProp$2;
var makeAbs_1 = makeAbs;
var finish_1 = finish;
var mark_1 = mark;
var isIgnored_1 = isIgnored$2;
var childrenIgnored_1 = childrenIgnored$2;

function ownProp$2 (obj, field) {
  return Object.prototype.hasOwnProperty.call(obj, field)
}




var Minimatch$3 = minimatch_1.Minimatch;

function alphasorti$2 (a, b) {
  return a.toLowerCase().localeCompare(b.toLowerCase())
}

function alphasort$2 (a, b) {
  return a.localeCompare(b)
}

function setupIgnores (self, options) {
  self.ignore = options.ignore || [];

  if (!Array.isArray(self.ignore))
    self.ignore = [self.ignore];

  if (self.ignore.length) {
    self.ignore = self.ignore.map(ignoreMap);
  }
}

// ignore patterns are always in dot:true mode.
function ignoreMap (pattern) {
  var gmatcher = null;
  if (pattern.slice(-3) === '/**') {
    var gpattern = pattern.replace(/(\/\*\*)+$/, '');
    gmatcher = new Minimatch$3(gpattern, { dot: true });
  }

  return {
    matcher: new Minimatch$3(pattern, { dot: true }),
    gmatcher: gmatcher
  }
}

function setopts$2 (self, pattern, options) {
  if (!options)
    options = {};

  // base-matching: just use globstar for that.
  if (options.matchBase && -1 === pattern.indexOf("/")) {
    if (options.noglobstar) {
      throw new Error("base matching requires globstar")
    }
    pattern = "**/" + pattern;
  }

  self.silent = !!options.silent;
  self.pattern = pattern;
  self.strict = options.strict !== false;
  self.realpath = !!options.realpath;
  self.realpathCache = options.realpathCache || Object.create(null);
  self.follow = !!options.follow;
  self.dot = !!options.dot;
  self.mark = !!options.mark;
  self.nodir = !!options.nodir;
  if (self.nodir)
    self.mark = true;
  self.sync = !!options.sync;
  self.nounique = !!options.nounique;
  self.nonull = !!options.nonull;
  self.nosort = !!options.nosort;
  self.nocase = !!options.nocase;
  self.stat = !!options.stat;
  self.noprocess = !!options.noprocess;
  self.absolute = !!options.absolute;

  self.maxLength = options.maxLength || Infinity;
  self.cache = options.cache || Object.create(null);
  self.statCache = options.statCache || Object.create(null);
  self.symlinks = options.symlinks || Object.create(null);

  setupIgnores(self, options);

  self.changedCwd = false;
  var cwd = process.cwd();
  if (!ownProp$2(options, "cwd"))
    self.cwd = cwd;
  else {
    self.cwd = path.resolve(options.cwd);
    self.changedCwd = self.cwd !== cwd;
  }

  self.root = options.root || path.resolve(self.cwd, "/");
  self.root = path.resolve(self.root);
  if (process.platform === "win32")
    self.root = self.root.replace(/\\/g, "/");

  // TODO: is an absolute `cwd` supposed to be resolved against `root`?
  // e.g. { cwd: '/test', root: __dirname } === path.join(__dirname, '/test')
  self.cwdAbs = pathIsAbsolute(self.cwd) ? self.cwd : makeAbs(self, self.cwd);
  if (process.platform === "win32")
    self.cwdAbs = self.cwdAbs.replace(/\\/g, "/");
  self.nomount = !!options.nomount;

  // disable comments and negation in Minimatch.
  // Note that they are not supported in Glob itself anyway.
  options.nonegate = true;
  options.nocomment = true;

  self.minimatch = new Minimatch$3(pattern, options);
  self.options = self.minimatch.options;
}

function finish (self) {
  var nou = self.nounique;
  var all = nou ? [] : Object.create(null);

  for (var i = 0, l = self.matches.length; i < l; i ++) {
    var matches = self.matches[i];
    if (!matches || Object.keys(matches).length === 0) {
      if (self.nonull) {
        // do like the shell, and spit out the literal glob
        var literal = self.minimatch.globSet[i];
        if (nou)
          all.push(literal);
        else
          all[literal] = true;
      }
    } else {
      // had matches
      var m = Object.keys(matches);
      if (nou)
        all.push.apply(all, m);
      else
        m.forEach(function (m) {
          all[m] = true;
        });
    }
  }

  if (!nou)
    all = Object.keys(all);

  if (!self.nosort)
    all = all.sort(self.nocase ? alphasorti$2 : alphasort$2);

  // at *some* point we statted all of these
  if (self.mark) {
    for (var i = 0; i < all.length; i++) {
      all[i] = self._mark(all[i]);
    }
    if (self.nodir) {
      all = all.filter(function (e) {
        var notDir = !(/\/$/.test(e));
        var c = self.cache[e] || self.cache[makeAbs(self, e)];
        if (notDir && c)
          notDir = c !== 'DIR' && !Array.isArray(c);
        return notDir
      });
    }
  }

  if (self.ignore.length)
    all = all.filter(function(m) {
      return !isIgnored$2(self, m)
    });

  self.found = all;
}

function mark (self, p) {
  var abs = makeAbs(self, p);
  var c = self.cache[abs];
  var m = p;
  if (c) {
    var isDir = c === 'DIR' || Array.isArray(c);
    var slash = p.slice(-1) === '/';

    if (isDir && !slash)
      m += '/';
    else if (!isDir && slash)
      m = m.slice(0, -1);

    if (m !== p) {
      var mabs = makeAbs(self, m);
      self.statCache[mabs] = self.statCache[abs];
      self.cache[mabs] = self.cache[abs];
    }
  }

  return m
}

// lotta situps...
function makeAbs (self, f) {
  var abs = f;
  if (f.charAt(0) === '/') {
    abs = path.join(self.root, f);
  } else if (pathIsAbsolute(f) || f === '') {
    abs = f;
  } else if (self.changedCwd) {
    abs = path.resolve(self.cwd, f);
  } else {
    abs = path.resolve(f);
  }

  if (process.platform === 'win32')
    abs = abs.replace(/\\/g, '/');

  return abs
}


// Return true, if pattern ends with globstar '**', for the accompanying parent directory.
// Ex:- If node_modules/** is the pattern, add 'node_modules' to ignore list along with it's contents
function isIgnored$2 (self, path$$2) {
  if (!self.ignore.length)
    return false

  return self.ignore.some(function(item) {
    return item.matcher.match(path$$2) || !!(item.gmatcher && item.gmatcher.match(path$$2))
  })
}

function childrenIgnored$2 (self, path$$2) {
  if (!self.ignore.length)
    return false

  return self.ignore.some(function(item) {
    return !!(item.gmatcher && item.gmatcher.match(path$$2))
  })
}

var common = {
	alphasort: alphasort_1,
	alphasorti: alphasorti_1,
	setopts: setopts_1,
	ownProp: ownProp_1,
	makeAbs: makeAbs_1,
	finish: finish_1,
	mark: mark_1,
	isIgnored: isIgnored_1,
	childrenIgnored: childrenIgnored_1
};

var sync$1 = globSync;
globSync.GlobSync = GlobSync$1;




var setopts$1 = common.setopts;
var ownProp$1 = common.ownProp;
var childrenIgnored$1 = common.childrenIgnored;
var isIgnored$1 = common.isIgnored;

function globSync (pattern, options) {
  if (typeof options === 'function' || arguments.length === 3)
    throw new TypeError('callback provided to sync glob\n'+
                        'See: https://github.com/isaacs/node-glob/issues/167')

  return new GlobSync$1(pattern, options).found
}

function GlobSync$1 (pattern, options) {
  if (!pattern)
    throw new Error('must provide pattern')

  if (typeof options === 'function' || arguments.length === 3)
    throw new TypeError('callback provided to sync glob\n'+
                        'See: https://github.com/isaacs/node-glob/issues/167')

  if (!(this instanceof GlobSync$1))
    return new GlobSync$1(pattern, options)

  setopts$1(this, pattern, options);

  if (this.noprocess)
    return this

  var n = this.minimatch.set.length;
  this.matches = new Array(n);
  for (var i = 0; i < n; i ++) {
    this._process(this.minimatch.set[i], i, false);
  }
  this._finish();
}

GlobSync$1.prototype._finish = function () {
  assert(this instanceof GlobSync$1);
  if (this.realpath) {
    var self = this;
    this.matches.forEach(function (matchset, index) {
      var set = self.matches[index] = Object.create(null);
      for (var p in matchset) {
        try {
          p = self._makeAbs(p);
          var real = fs_realpath.realpathSync(p, self.realpathCache);
          set[real] = true;
        } catch (er) {
          if (er.syscall === 'stat')
            set[self._makeAbs(p)] = true;
          else
            throw er
        }
      }
    });
  }
  common.finish(this);
};


GlobSync$1.prototype._process = function (pattern, index, inGlobStar) {
  assert(this instanceof GlobSync$1);

  // Get the first [n] parts of pattern that are all strings.
  var n = 0;
  while (typeof pattern[n] === 'string') {
    n ++;
  }
  // now n is the index of the first one that is *not* a string.

  // See if there's anything else
  var prefix;
  switch (n) {
    // if not, then this is rather simple
    case pattern.length:
      this._processSimple(pattern.join('/'), index);
      return

    case 0:
      // pattern *starts* with some non-trivial item.
      // going to readdir(cwd), but not include the prefix in matches.
      prefix = null;
      break

    default:
      // pattern has some string bits in the front.
      // whatever it starts with, whether that's 'absolute' like /foo/bar,
      // or 'relative' like '../baz'
      prefix = pattern.slice(0, n).join('/');
      break
  }

  var remain = pattern.slice(n);

  // get the list of entries.
  var read;
  if (prefix === null)
    read = '.';
  else if (pathIsAbsolute(prefix) || pathIsAbsolute(pattern.join('/'))) {
    if (!prefix || !pathIsAbsolute(prefix))
      prefix = '/' + prefix;
    read = prefix;
  } else
    read = prefix;

  var abs = this._makeAbs(read);

  //if ignored, skip processing
  if (childrenIgnored$1(this, read))
    return

  var isGlobStar = remain[0] === minimatch_1.GLOBSTAR;
  if (isGlobStar)
    this._processGlobStar(prefix, read, abs, remain, index, inGlobStar);
  else
    this._processReaddir(prefix, read, abs, remain, index, inGlobStar);
};


GlobSync$1.prototype._processReaddir = function (prefix, read, abs, remain, index, inGlobStar) {
  var entries = this._readdir(abs, inGlobStar);

  // if the abs isn't a dir, then nothing can match!
  if (!entries)
    return

  // It will only match dot entries if it starts with a dot, or if
  // dot is set.  Stuff like @(.foo|.bar) isn't allowed.
  var pn = remain[0];
  var negate = !!this.minimatch.negate;
  var rawGlob = pn._glob;
  var dotOk = this.dot || rawGlob.charAt(0) === '.';

  var matchedEntries = [];
  for (var i = 0; i < entries.length; i++) {
    var e = entries[i];
    if (e.charAt(0) !== '.' || dotOk) {
      var m;
      if (negate && !prefix) {
        m = !e.match(pn);
      } else {
        m = e.match(pn);
      }
      if (m)
        matchedEntries.push(e);
    }
  }

  var len = matchedEntries.length;
  // If there are no matched entries, then nothing matches.
  if (len === 0)
    return

  // if this is the last remaining pattern bit, then no need for
  // an additional stat *unless* the user has specified mark or
  // stat explicitly.  We know they exist, since readdir returned
  // them.

  if (remain.length === 1 && !this.mark && !this.stat) {
    if (!this.matches[index])
      this.matches[index] = Object.create(null);

    for (var i = 0; i < len; i ++) {
      var e = matchedEntries[i];
      if (prefix) {
        if (prefix.slice(-1) !== '/')
          e = prefix + '/' + e;
        else
          e = prefix + e;
      }

      if (e.charAt(0) === '/' && !this.nomount) {
        e = path.join(this.root, e);
      }
      this._emitMatch(index, e);
    }
    // This was the last one, and no stats were needed
    return
  }

  // now test all matched entries as stand-ins for that part
  // of the pattern.
  remain.shift();
  for (var i = 0; i < len; i ++) {
    var e = matchedEntries[i];
    var newPattern;
    if (prefix)
      newPattern = [prefix, e];
    else
      newPattern = [e];
    this._process(newPattern.concat(remain), index, inGlobStar);
  }
};


GlobSync$1.prototype._emitMatch = function (index, e) {
  if (isIgnored$1(this, e))
    return

  var abs = this._makeAbs(e);

  if (this.mark)
    e = this._mark(e);

  if (this.absolute) {
    e = abs;
  }

  if (this.matches[index][e])
    return

  if (this.nodir) {
    var c = this.cache[abs];
    if (c === 'DIR' || Array.isArray(c))
      return
  }

  this.matches[index][e] = true;

  if (this.stat)
    this._stat(e);
};


GlobSync$1.prototype._readdirInGlobStar = function (abs) {
  // follow all symlinked directories forever
  // just proceed as if this is a non-globstar situation
  if (this.follow)
    return this._readdir(abs, false)

  var entries;
  var lstat;
  var stat;
  try {
    lstat = fs.lstatSync(abs);
  } catch (er) {
    if (er.code === 'ENOENT') {
      // lstat failed, doesn't exist
      return null
    }
  }

  var isSym = lstat && lstat.isSymbolicLink();
  this.symlinks[abs] = isSym;

  // If it's not a symlink or a dir, then it's definitely a regular file.
  // don't bother doing a readdir in that case.
  if (!isSym && lstat && !lstat.isDirectory())
    this.cache[abs] = 'FILE';
  else
    entries = this._readdir(abs, false);

  return entries
};

GlobSync$1.prototype._readdir = function (abs, inGlobStar) {
  var entries;

  if (inGlobStar && !ownProp$1(this.symlinks, abs))
    return this._readdirInGlobStar(abs)

  if (ownProp$1(this.cache, abs)) {
    var c = this.cache[abs];
    if (!c || c === 'FILE')
      return null

    if (Array.isArray(c))
      return c
  }

  try {
    return this._readdirEntries(abs, fs.readdirSync(abs))
  } catch (er) {
    this._readdirError(abs, er);
    return null
  }
};

GlobSync$1.prototype._readdirEntries = function (abs, entries) {
  // if we haven't asked to stat everything, then just
  // assume that everything in there exists, so we can avoid
  // having to stat it a second time.
  if (!this.mark && !this.stat) {
    for (var i = 0; i < entries.length; i ++) {
      var e = entries[i];
      if (abs === '/')
        e = abs + e;
      else
        e = abs + '/' + e;
      this.cache[e] = true;
    }
  }

  this.cache[abs] = entries;

  // mark and cache dir-ness
  return entries
};

GlobSync$1.prototype._readdirError = function (f, er) {
  // handle errors, and cache the information
  switch (er.code) {
    case 'ENOTSUP': // https://github.com/isaacs/node-glob/issues/205
    case 'ENOTDIR': // totally normal. means it *does* exist.
      var abs = this._makeAbs(f);
      this.cache[abs] = 'FILE';
      if (abs === this.cwdAbs) {
        var error = new Error(er.code + ' invalid cwd ' + this.cwd);
        error.path = this.cwd;
        error.code = er.code;
        throw error
      }
      break

    case 'ENOENT': // not terribly unusual
    case 'ELOOP':
    case 'ENAMETOOLONG':
    case 'UNKNOWN':
      this.cache[this._makeAbs(f)] = false;
      break

    default: // some unusual error.  Treat as failure.
      this.cache[this._makeAbs(f)] = false;
      if (this.strict)
        throw er
      if (!this.silent)
        console.error('glob error', er);
      break
  }
};

GlobSync$1.prototype._processGlobStar = function (prefix, read, abs, remain, index, inGlobStar) {

  var entries = this._readdir(abs, inGlobStar);

  // no entries means not a dir, so it can never have matches
  // foo.txt/** doesn't match foo.txt
  if (!entries)
    return

  // test without the globstar, and with every child both below
  // and replacing the globstar.
  var remainWithoutGlobStar = remain.slice(1);
  var gspref = prefix ? [ prefix ] : [];
  var noGlobStar = gspref.concat(remainWithoutGlobStar);

  // the noGlobStar pattern exits the inGlobStar state
  this._process(noGlobStar, index, false);

  var len = entries.length;
  var isSym = this.symlinks[abs];

  // If it's a symlink, and we're in a globstar, then stop
  if (isSym && inGlobStar)
    return

  for (var i = 0; i < len; i++) {
    var e = entries[i];
    if (e.charAt(0) === '.' && !this.dot)
      continue

    // these two cases enter the inGlobStar state
    var instead = gspref.concat(entries[i], remainWithoutGlobStar);
    this._process(instead, index, true);

    var below = gspref.concat(entries[i], remain);
    this._process(below, index, true);
  }
};

GlobSync$1.prototype._processSimple = function (prefix, index) {
  // XXX review this.  Shouldn't it be doing the mounting etc
  // before doing stat?  kinda weird?
  var exists = this._stat(prefix);

  if (!this.matches[index])
    this.matches[index] = Object.create(null);

  // If it doesn't exist, then just mark the lack of results
  if (!exists)
    return

  if (prefix && pathIsAbsolute(prefix) && !this.nomount) {
    var trail = /[\/\\]$/.test(prefix);
    if (prefix.charAt(0) === '/') {
      prefix = path.join(this.root, prefix);
    } else {
      prefix = path.resolve(this.root, prefix);
      if (trail)
        prefix += '/';
    }
  }

  if (process.platform === 'win32')
    prefix = prefix.replace(/\\/g, '/');

  // Mark this as a match
  this._emitMatch(index, prefix);
};

// Returns either 'DIR', 'FILE', or false
GlobSync$1.prototype._stat = function (f) {
  var abs = this._makeAbs(f);
  var needDir = f.slice(-1) === '/';

  if (f.length > this.maxLength)
    return false

  if (!this.stat && ownProp$1(this.cache, abs)) {
    var c = this.cache[abs];

    if (Array.isArray(c))
      c = 'DIR';

    // It exists, but maybe not how we need it
    if (!needDir || c === 'DIR')
      return c

    if (needDir && c === 'FILE')
      return false

    // otherwise we have to stat, because maybe c=true
    // if we know it exists, but not what it is.
  }

  var exists;
  var stat = this.statCache[abs];
  if (!stat) {
    var lstat;
    try {
      lstat = fs.lstatSync(abs);
    } catch (er) {
      if (er && (er.code === 'ENOENT' || er.code === 'ENOTDIR')) {
        this.statCache[abs] = false;
        return false
      }
    }

    if (lstat && lstat.isSymbolicLink()) {
      try {
        stat = fs.statSync(abs);
      } catch (er) {
        stat = lstat;
      }
    } else {
      stat = lstat;
    }
  }

  this.statCache[abs] = stat;

  var c = true;
  if (stat)
    c = stat.isDirectory() ? 'DIR' : 'FILE';

  this.cache[abs] = this.cache[abs] || c;

  if (needDir && c === 'FILE')
    return false

  return c
};

GlobSync$1.prototype._mark = function (p) {
  return common.mark(this, p)
};

GlobSync$1.prototype._makeAbs = function (f) {
  return common.makeAbs(this, f)
};

// Returns a wrapper function that returns a wrapped callback
// The wrapper function should do some stuff, and return a
// presumably different callback function.
// This makes sure that own properties are retained, so that
// decorations and such are not lost along the way.
var wrappy_1 = wrappy;
function wrappy (fn, cb) {
  if (fn && cb) return wrappy(fn)(cb)

  if (typeof fn !== 'function')
    throw new TypeError('need wrapper function')

  Object.keys(fn).forEach(function (k) {
    wrapper[k] = fn[k];
  });

  return wrapper

  function wrapper() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    var ret = fn.apply(this, args);
    var cb = args[args.length-1];
    if (typeof ret === 'function' && ret !== cb) {
      Object.keys(cb).forEach(function (k) {
        ret[k] = cb[k];
      });
    }
    return ret
  }
}

var once_1 = wrappy_1(once);
var strict = wrappy_1(onceStrict);

once.proto = once(function () {
  Object.defineProperty(Function.prototype, 'once', {
    value: function () {
      return once(this)
    },
    configurable: true
  });

  Object.defineProperty(Function.prototype, 'onceStrict', {
    value: function () {
      return onceStrict(this)
    },
    configurable: true
  });
});

function once (fn) {
  var f = function () {
    if (f.called) return f.value
    f.called = true;
    return f.value = fn.apply(this, arguments)
  };
  f.called = false;
  return f
}

function onceStrict (fn) {
  var f = function () {
    if (f.called)
      throw new Error(f.onceError)
    f.called = true;
    return f.value = fn.apply(this, arguments)
  };
  var name = fn.name || 'Function wrapped with `once`';
  f.onceError = name + " shouldn't be called more than once";
  f.called = false;
  return f
}

once_1.strict = strict;

var reqs = Object.create(null);


var inflight_1 = wrappy_1(inflight);

function inflight (key, cb) {
  if (reqs[key]) {
    reqs[key].push(cb);
    return null
  } else {
    reqs[key] = [cb];
    return makeres(key)
  }
}

function makeres (key) {
  return once_1(function RES () {
    var cbs = reqs[key];
    var len = cbs.length;
    var args = slice(arguments);

    // XXX It's somewhat ambiguous whether a new callback added in this
    // pass should be queued for later execution if something in the
    // list of callbacks throws, or if it should just be discarded.
    // However, it's such an edge case that it hardly matters, and either
    // choice is likely as surprising as the other.
    // As it happens, we do go ahead and schedule it for later execution.
    try {
      for (var i = 0; i < len; i++) {
        cbs[i].apply(null, args);
      }
    } finally {
      if (cbs.length > len) {
        // added more in the interim.
        // de-zalgo, just in case, but don't call again.
        cbs.splice(0, len);
        process.nextTick(function () {
          RES.apply(null, args);
        });
      } else {
        delete reqs[key];
      }
    }
  })
}

function slice (args) {
  var length = args.length;
  var array = [];

  for (var i = 0; i < length; i++) array[i] = args[i];
  return array
}

// Approach:
//
// 1. Get the minimatch set
// 2. For each pattern in the set, PROCESS(pattern, false)
// 3. Store matches per-set, then uniq them
//
// PROCESS(pattern, inGlobStar)
// Get the first [n] items from pattern that are all strings
// Join these together.  This is PREFIX.
//   If there is no more remaining, then stat(PREFIX) and
//   add to matches if it succeeds.  END.
//
// If inGlobStar and PREFIX is symlink and points to dir
//   set ENTRIES = []
// else readdir(PREFIX) as ENTRIES
//   If fail, END
//
// with ENTRIES
//   If pattern[n] is GLOBSTAR
//     // handle the case where the globstar match is empty
//     // by pruning it out, and testing the resulting pattern
//     PROCESS(pattern[0..n] + pattern[n+1 .. $], false)
//     // handle other cases.
//     for ENTRY in ENTRIES (not dotfiles)
//       // attach globstar + tail onto the entry
//       // Mark that this entry is a globstar match
//       PROCESS(pattern[0..n] + ENTRY + pattern[n .. $], true)
//
//   else // not globstar
//     for ENTRY in ENTRIES (not dotfiles, unless pattern[n] is dot)
//       Test ENTRY against pattern[n]
//       If fails, continue
//       If passes, PROCESS(pattern[0..n] + item + pattern[n+1 .. $])
//
// Caveat:
//   Cache all stats and readdirs results to minimize syscall.  Since all
//   we ever care about is existence and directory-ness, we can just keep
//   `true` for files, and [children,...] for directories, or `false` for
//   things that don't exist.

var glob_1 = glob;




var EE = events.EventEmitter;





var setopts = common.setopts;
var ownProp = common.ownProp;


var childrenIgnored = common.childrenIgnored;
var isIgnored = common.isIgnored;



function glob (pattern, options, cb) {
  if (typeof options === 'function') cb = options, options = {};
  if (!options) options = {};

  if (options.sync) {
    if (cb)
      throw new TypeError('callback provided to sync glob')
    return sync$1(pattern, options)
  }

  return new Glob(pattern, options, cb)
}

glob.sync = sync$1;
var GlobSync = glob.GlobSync = sync$1.GlobSync;

// old api surface
glob.glob = glob;

function extend (origin, add) {
  if (add === null || typeof add !== 'object') {
    return origin
  }

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin
}

glob.hasMagic = function (pattern, options_) {
  var options = extend({}, options_);
  options.noprocess = true;

  var g = new Glob(pattern, options);
  var set = g.minimatch.set;

  if (!pattern)
    return false

  if (set.length > 1)
    return true

  for (var j = 0; j < set[0].length; j++) {
    if (typeof set[0][j] !== 'string')
      return true
  }

  return false
};

glob.Glob = Glob;
inherits(Glob, EE);
function Glob (pattern, options, cb) {
  if (typeof options === 'function') {
    cb = options;
    options = null;
  }

  if (options && options.sync) {
    if (cb)
      throw new TypeError('callback provided to sync glob')
    return new GlobSync(pattern, options)
  }

  if (!(this instanceof Glob))
    return new Glob(pattern, options, cb)

  setopts(this, pattern, options);
  this._didRealPath = false;

  // process each pattern in the minimatch set
  var n = this.minimatch.set.length;

  // The matches are stored as {<filename>: true,...} so that
  // duplicates are automagically pruned.
  // Later, we do an Object.keys() on these.
  // Keep them as a list so we can fill in when nonull is set.
  this.matches = new Array(n);

  if (typeof cb === 'function') {
    cb = once_1(cb);
    this.on('error', cb);
    this.on('end', function (matches) {
      cb(null, matches);
    });
  }

  var self = this;
  this._processing = 0;

  this._emitQueue = [];
  this._processQueue = [];
  this.paused = false;

  if (this.noprocess)
    return this

  if (n === 0)
    return done()

  var sync = true;
  for (var i = 0; i < n; i ++) {
    this._process(this.minimatch.set[i], i, false, done);
  }
  sync = false;

  function done () {
    --self._processing;
    if (self._processing <= 0) {
      if (sync) {
        process.nextTick(function () {
          self._finish();
        });
      } else {
        self._finish();
      }
    }
  }
}

Glob.prototype._finish = function () {
  assert(this instanceof Glob);
  if (this.aborted)
    return

  if (this.realpath && !this._didRealpath)
    return this._realpath()

  common.finish(this);
  this.emit('end', this.found);
};

Glob.prototype._realpath = function () {
  if (this._didRealpath)
    return

  this._didRealpath = true;

  var n = this.matches.length;
  if (n === 0)
    return this._finish()

  var self = this;
  for (var i = 0; i < this.matches.length; i++)
    this._realpathSet(i, next);

  function next () {
    if (--n === 0)
      self._finish();
  }
};

Glob.prototype._realpathSet = function (index, cb) {
  var matchset = this.matches[index];
  if (!matchset)
    return cb()

  var found = Object.keys(matchset);
  var self = this;
  var n = found.length;

  if (n === 0)
    return cb()

  var set = this.matches[index] = Object.create(null);
  found.forEach(function (p, i) {
    // If there's a problem with the stat, then it means that
    // one or more of the links in the realpath couldn't be
    // resolved.  just return the abs value in that case.
    p = self._makeAbs(p);
    fs_realpath.realpath(p, self.realpathCache, function (er, real) {
      if (!er)
        set[real] = true;
      else if (er.syscall === 'stat')
        set[p] = true;
      else
        self.emit('error', er); // srsly wtf right here

      if (--n === 0) {
        self.matches[index] = set;
        cb();
      }
    });
  });
};

Glob.prototype._mark = function (p) {
  return common.mark(this, p)
};

Glob.prototype._makeAbs = function (f) {
  return common.makeAbs(this, f)
};

Glob.prototype.abort = function () {
  this.aborted = true;
  this.emit('abort');
};

Glob.prototype.pause = function () {
  if (!this.paused) {
    this.paused = true;
    this.emit('pause');
  }
};

Glob.prototype.resume = function () {
  if (this.paused) {
    this.emit('resume');
    this.paused = false;
    if (this._emitQueue.length) {
      var eq = this._emitQueue.slice(0);
      this._emitQueue.length = 0;
      for (var i = 0; i < eq.length; i ++) {
        var e = eq[i];
        this._emitMatch(e[0], e[1]);
      }
    }
    if (this._processQueue.length) {
      var pq = this._processQueue.slice(0);
      this._processQueue.length = 0;
      for (var i = 0; i < pq.length; i ++) {
        var p = pq[i];
        this._processing--;
        this._process(p[0], p[1], p[2], p[3]);
      }
    }
  }
};

Glob.prototype._process = function (pattern, index, inGlobStar, cb) {
  assert(this instanceof Glob);
  assert(typeof cb === 'function');

  if (this.aborted)
    return

  this._processing++;
  if (this.paused) {
    this._processQueue.push([pattern, index, inGlobStar, cb]);
    return
  }

  //console.error('PROCESS %d', this._processing, pattern)

  // Get the first [n] parts of pattern that are all strings.
  var n = 0;
  while (typeof pattern[n] === 'string') {
    n ++;
  }
  // now n is the index of the first one that is *not* a string.

  // see if there's anything else
  var prefix;
  switch (n) {
    // if not, then this is rather simple
    case pattern.length:
      this._processSimple(pattern.join('/'), index, cb);
      return

    case 0:
      // pattern *starts* with some non-trivial item.
      // going to readdir(cwd), but not include the prefix in matches.
      prefix = null;
      break

    default:
      // pattern has some string bits in the front.
      // whatever it starts with, whether that's 'absolute' like /foo/bar,
      // or 'relative' like '../baz'
      prefix = pattern.slice(0, n).join('/');
      break
  }

  var remain = pattern.slice(n);

  // get the list of entries.
  var read;
  if (prefix === null)
    read = '.';
  else if (pathIsAbsolute(prefix) || pathIsAbsolute(pattern.join('/'))) {
    if (!prefix || !pathIsAbsolute(prefix))
      prefix = '/' + prefix;
    read = prefix;
  } else
    read = prefix;

  var abs = this._makeAbs(read);

  //if ignored, skip _processing
  if (childrenIgnored(this, read))
    return cb()

  var isGlobStar = remain[0] === minimatch_1.GLOBSTAR;
  if (isGlobStar)
    this._processGlobStar(prefix, read, abs, remain, index, inGlobStar, cb);
  else
    this._processReaddir(prefix, read, abs, remain, index, inGlobStar, cb);
};

Glob.prototype._processReaddir = function (prefix, read, abs, remain, index, inGlobStar, cb) {
  var self = this;
  this._readdir(abs, inGlobStar, function (er, entries) {
    return self._processReaddir2(prefix, read, abs, remain, index, inGlobStar, entries, cb)
  });
};

Glob.prototype._processReaddir2 = function (prefix, read, abs, remain, index, inGlobStar, entries, cb) {

  // if the abs isn't a dir, then nothing can match!
  if (!entries)
    return cb()

  // It will only match dot entries if it starts with a dot, or if
  // dot is set.  Stuff like @(.foo|.bar) isn't allowed.
  var pn = remain[0];
  var negate = !!this.minimatch.negate;
  var rawGlob = pn._glob;
  var dotOk = this.dot || rawGlob.charAt(0) === '.';

  var matchedEntries = [];
  for (var i = 0; i < entries.length; i++) {
    var e = entries[i];
    if (e.charAt(0) !== '.' || dotOk) {
      var m;
      if (negate && !prefix) {
        m = !e.match(pn);
      } else {
        m = e.match(pn);
      }
      if (m)
        matchedEntries.push(e);
    }
  }

  //console.error('prd2', prefix, entries, remain[0]._glob, matchedEntries)

  var len = matchedEntries.length;
  // If there are no matched entries, then nothing matches.
  if (len === 0)
    return cb()

  // if this is the last remaining pattern bit, then no need for
  // an additional stat *unless* the user has specified mark or
  // stat explicitly.  We know they exist, since readdir returned
  // them.

  if (remain.length === 1 && !this.mark && !this.stat) {
    if (!this.matches[index])
      this.matches[index] = Object.create(null);

    for (var i = 0; i < len; i ++) {
      var e = matchedEntries[i];
      if (prefix) {
        if (prefix !== '/')
          e = prefix + '/' + e;
        else
          e = prefix + e;
      }

      if (e.charAt(0) === '/' && !this.nomount) {
        e = path.join(this.root, e);
      }
      this._emitMatch(index, e);
    }
    // This was the last one, and no stats were needed
    return cb()
  }

  // now test all matched entries as stand-ins for that part
  // of the pattern.
  remain.shift();
  for (var i = 0; i < len; i ++) {
    var e = matchedEntries[i];
    var newPattern;
    if (prefix) {
      if (prefix !== '/')
        e = prefix + '/' + e;
      else
        e = prefix + e;
    }
    this._process([e].concat(remain), index, inGlobStar, cb);
  }
  cb();
};

Glob.prototype._emitMatch = function (index, e) {
  if (this.aborted)
    return

  if (isIgnored(this, e))
    return

  if (this.paused) {
    this._emitQueue.push([index, e]);
    return
  }

  var abs = pathIsAbsolute(e) ? e : this._makeAbs(e);

  if (this.mark)
    e = this._mark(e);

  if (this.absolute)
    e = abs;

  if (this.matches[index][e])
    return

  if (this.nodir) {
    var c = this.cache[abs];
    if (c === 'DIR' || Array.isArray(c))
      return
  }

  this.matches[index][e] = true;

  var st = this.statCache[abs];
  if (st)
    this.emit('stat', e, st);

  this.emit('match', e);
};

Glob.prototype._readdirInGlobStar = function (abs, cb) {
  if (this.aborted)
    return

  // follow all symlinked directories forever
  // just proceed as if this is a non-globstar situation
  if (this.follow)
    return this._readdir(abs, false, cb)

  var lstatkey = 'lstat\0' + abs;
  var self = this;
  var lstatcb = inflight_1(lstatkey, lstatcb_);

  if (lstatcb)
    fs.lstat(abs, lstatcb);

  function lstatcb_ (er, lstat) {
    if (er && er.code === 'ENOENT')
      return cb()

    var isSym = lstat && lstat.isSymbolicLink();
    self.symlinks[abs] = isSym;

    // If it's not a symlink or a dir, then it's definitely a regular file.
    // don't bother doing a readdir in that case.
    if (!isSym && lstat && !lstat.isDirectory()) {
      self.cache[abs] = 'FILE';
      cb();
    } else
      self._readdir(abs, false, cb);
  }
};

Glob.prototype._readdir = function (abs, inGlobStar, cb) {
  if (this.aborted)
    return

  cb = inflight_1('readdir\0'+abs+'\0'+inGlobStar, cb);
  if (!cb)
    return

  //console.error('RD %j %j', +inGlobStar, abs)
  if (inGlobStar && !ownProp(this.symlinks, abs))
    return this._readdirInGlobStar(abs, cb)

  if (ownProp(this.cache, abs)) {
    var c = this.cache[abs];
    if (!c || c === 'FILE')
      return cb()

    if (Array.isArray(c))
      return cb(null, c)
  }

  var self = this;
  fs.readdir(abs, readdirCb(this, abs, cb));
};

function readdirCb (self, abs, cb) {
  return function (er, entries) {
    if (er)
      self._readdirError(abs, er, cb);
    else
      self._readdirEntries(abs, entries, cb);
  }
}

Glob.prototype._readdirEntries = function (abs, entries, cb) {
  if (this.aborted)
    return

  // if we haven't asked to stat everything, then just
  // assume that everything in there exists, so we can avoid
  // having to stat it a second time.
  if (!this.mark && !this.stat) {
    for (var i = 0; i < entries.length; i ++) {
      var e = entries[i];
      if (abs === '/')
        e = abs + e;
      else
        e = abs + '/' + e;
      this.cache[e] = true;
    }
  }

  this.cache[abs] = entries;
  return cb(null, entries)
};

Glob.prototype._readdirError = function (f, er, cb) {
  if (this.aborted)
    return

  // handle errors, and cache the information
  switch (er.code) {
    case 'ENOTSUP': // https://github.com/isaacs/node-glob/issues/205
    case 'ENOTDIR': // totally normal. means it *does* exist.
      var abs = this._makeAbs(f);
      this.cache[abs] = 'FILE';
      if (abs === this.cwdAbs) {
        var error = new Error(er.code + ' invalid cwd ' + this.cwd);
        error.path = this.cwd;
        error.code = er.code;
        this.emit('error', error);
        this.abort();
      }
      break

    case 'ENOENT': // not terribly unusual
    case 'ELOOP':
    case 'ENAMETOOLONG':
    case 'UNKNOWN':
      this.cache[this._makeAbs(f)] = false;
      break

    default: // some unusual error.  Treat as failure.
      this.cache[this._makeAbs(f)] = false;
      if (this.strict) {
        this.emit('error', er);
        // If the error is handled, then we abort
        // if not, we threw out of here
        this.abort();
      }
      if (!this.silent)
        console.error('glob error', er);
      break
  }

  return cb()
};

Glob.prototype._processGlobStar = function (prefix, read, abs, remain, index, inGlobStar, cb) {
  var self = this;
  this._readdir(abs, inGlobStar, function (er, entries) {
    self._processGlobStar2(prefix, read, abs, remain, index, inGlobStar, entries, cb);
  });
};


Glob.prototype._processGlobStar2 = function (prefix, read, abs, remain, index, inGlobStar, entries, cb) {
  //console.error('pgs2', prefix, remain[0], entries)

  // no entries means not a dir, so it can never have matches
  // foo.txt/** doesn't match foo.txt
  if (!entries)
    return cb()

  // test without the globstar, and with every child both below
  // and replacing the globstar.
  var remainWithoutGlobStar = remain.slice(1);
  var gspref = prefix ? [ prefix ] : [];
  var noGlobStar = gspref.concat(remainWithoutGlobStar);

  // the noGlobStar pattern exits the inGlobStar state
  this._process(noGlobStar, index, false, cb);

  var isSym = this.symlinks[abs];
  var len = entries.length;

  // If it's a symlink, and we're in a globstar, then stop
  if (isSym && inGlobStar)
    return cb()

  for (var i = 0; i < len; i++) {
    var e = entries[i];
    if (e.charAt(0) === '.' && !this.dot)
      continue

    // these two cases enter the inGlobStar state
    var instead = gspref.concat(entries[i], remainWithoutGlobStar);
    this._process(instead, index, true, cb);

    var below = gspref.concat(entries[i], remain);
    this._process(below, index, true, cb);
  }

  cb();
};

Glob.prototype._processSimple = function (prefix, index, cb) {
  // XXX review this.  Shouldn't it be doing the mounting etc
  // before doing stat?  kinda weird?
  var self = this;
  this._stat(prefix, function (er, exists) {
    self._processSimple2(prefix, index, er, exists, cb);
  });
};
Glob.prototype._processSimple2 = function (prefix, index, er, exists, cb) {

  //console.error('ps2', prefix, exists)

  if (!this.matches[index])
    this.matches[index] = Object.create(null);

  // If it doesn't exist, then just mark the lack of results
  if (!exists)
    return cb()

  if (prefix && pathIsAbsolute(prefix) && !this.nomount) {
    var trail = /[\/\\]$/.test(prefix);
    if (prefix.charAt(0) === '/') {
      prefix = path.join(this.root, prefix);
    } else {
      prefix = path.resolve(this.root, prefix);
      if (trail)
        prefix += '/';
    }
  }

  if (process.platform === 'win32')
    prefix = prefix.replace(/\\/g, '/');

  // Mark this as a match
  this._emitMatch(index, prefix);
  cb();
};

// Returns either 'DIR', 'FILE', or false
Glob.prototype._stat = function (f, cb) {
  var abs = this._makeAbs(f);
  var needDir = f.slice(-1) === '/';

  if (f.length > this.maxLength)
    return cb()

  if (!this.stat && ownProp(this.cache, abs)) {
    var c = this.cache[abs];

    if (Array.isArray(c))
      c = 'DIR';

    // It exists, but maybe not how we need it
    if (!needDir || c === 'DIR')
      return cb(null, c)

    if (needDir && c === 'FILE')
      return cb()

    // otherwise we have to stat, because maybe c=true
    // if we know it exists, but not what it is.
  }

  var exists;
  var stat = this.statCache[abs];
  if (stat !== undefined) {
    if (stat === false)
      return cb(null, stat)
    else {
      var type = stat.isDirectory() ? 'DIR' : 'FILE';
      if (needDir && type === 'FILE')
        return cb()
      else
        return cb(null, type, stat)
    }
  }

  var self = this;
  var statcb = inflight_1('stat\0' + abs, lstatcb_);
  if (statcb)
    fs.lstat(abs, statcb);

  function lstatcb_ (er, lstat) {
    if (lstat && lstat.isSymbolicLink()) {
      // If it's a symlink, then treat it as the target, unless
      // the target does not exist, then treat it as a file.
      return fs.stat(abs, function (er, stat) {
        if (er)
          self._stat2(f, abs, null, lstat, cb);
        else
          self._stat2(f, abs, er, stat, cb);
      })
    } else {
      self._stat2(f, abs, er, lstat, cb);
    }
  }
};

Glob.prototype._stat2 = function (f, abs, er, stat, cb) {
  if (er && (er.code === 'ENOENT' || er.code === 'ENOTDIR')) {
    this.statCache[abs] = false;
    return cb()
  }

  var needDir = f.slice(-1) === '/';
  this.statCache[abs] = stat;

  if (abs.slice(-1) === '/' && stat && !stat.isDirectory())
    return cb(null, false, stat)

  var c = true;
  if (stat)
    c = stat.isDirectory() ? 'DIR' : 'FILE';
  this.cache[abs] = this.cache[abs] || c;

  if (needDir && c === 'FILE')
    return cb()

  return cb(null, c, stat)
};

var pify_1 = createCommonjsModule(function (module) {
'use strict';

var processFn = function (fn, P, opts) {
	return function () {
		var that = this;
		var args = new Array(arguments.length);

		for (var i = 0; i < arguments.length; i++) {
			args[i] = arguments[i];
		}

		return new P(function (resolve, reject) {
			args.push(function (err, result) {
				if (err) {
					reject(err);
				} else if (opts.multiArgs) {
					var results = new Array(arguments.length - 1);

					for (var i = 1; i < arguments.length; i++) {
						results[i - 1] = arguments[i];
					}

					resolve(results);
				} else {
					resolve(result);
				}
			});

			fn.apply(that, args);
		});
	};
};

var pify = module.exports = function (obj, P, opts) {
	if (typeof P !== 'function') {
		opts = P;
		P = Promise;
	}

	opts = opts || {};
	opts.exclude = opts.exclude || [/.+Sync$/];

	var filter = function (key) {
		var match = function (pattern) {
			return typeof pattern === 'string' ? key === pattern : pattern.test(key);
		};

		return opts.include ? opts.include.some(match) : !opts.exclude.some(match);
	};

	var ret = typeof obj === 'function' ? function () {
		if (opts.excludeMain) {
			return obj.apply(this, arguments);
		}

		return processFn(obj, P, opts).apply(this, arguments);
	} : {};

	return Object.keys(obj).reduce(function (ret, key) {
		var x = obj[key];

		ret[key] = typeof x === 'function' && filter(key) ? processFn(x, P, opts) : x;

		return ret;
	}, ret);
};

pify.all = pify;
});

var globP = pify_1(glob_1, pinkiePromise).bind(glob_1);

function isNegative(pattern) {
	return pattern[0] === '!';
}

function isString(value) {
	return typeof value === 'string';
}

function assertPatternsInput(patterns) {
	if (!patterns.every(isString)) {
		throw new TypeError('patterns must be a string or an array of strings');
	}
}

function generateGlobTasks(patterns, opts) {
	patterns = [].concat(patterns);
	assertPatternsInput(patterns);

	var globTasks = [];

	opts = objectAssign({
		cache: Object.create(null),
		statCache: Object.create(null),
		realpathCache: Object.create(null),
		symlinks: Object.create(null),
		ignore: []
	}, opts);

	patterns.forEach(function (pattern, i) {
		if (isNegative(pattern)) {
			return;
		}

		var ignore = patterns.slice(i).filter(isNegative).map(function (pattern) {
			return pattern.slice(1);
		});

		globTasks.push({
			pattern: pattern,
			opts: objectAssign({}, opts, {
				ignore: opts.ignore.concat(ignore)
			})
		});
	});

	return globTasks;
}

var globby = function (patterns, opts) {
	var globTasks;

	try {
		globTasks = generateGlobTasks(patterns, opts);
	} catch (err) {
		return pinkiePromise.reject(err);
	}

	return pinkiePromise.all(globTasks.map(function (task) {
		return globP(task.pattern, task.opts);
	})).then(function (paths) {
		return arrayUnion.apply(null, paths);
	});
};

var sync = function (patterns, opts) {
	var globTasks = generateGlobTasks(patterns, opts);

	return globTasks.reduce(function (matches, task) {
		return arrayUnion(matches, glob_1.sync(task.pattern, task.opts));
	}, []);
};

var generateGlobTasks_1 = generateGlobTasks;

var hasMagic = function (patterns, opts) {
	return [].concat(patterns).some(function (pattern) {
		return glob_1.hasMagic(pattern, opts);
	});
};

globby.sync = sync;
globby.generateGlobTasks = generateGlobTasks_1;
globby.hasMagic = hasMagic;

var assert$2 = true;
var buffer_ieee754 = "< 0.9.7";
var buffer = true;
var child_process = true;
var cluster = true;
var console$1 = true;
var constants = true;
var crypto = true;
var _debugger = "< 8";
var dgram = true;
var dns = true;
var domain = true;
var events$1 = true;
var freelist = "< 6";
var fs$2 = true;
var http = true;
var http2 = ">= 8.8";
var https = true;
var _http_server = ">= 0.11";
var _linklist = "< 8";
var module$1 = true;
var net = true;
var os$2 = true;
var path$3 = true;
var perf_hooks = ">= 8.5";
var process$1 = ">= 1";
var punycode = true;
var querystring = true;
var readline = true;
var repl = true;
var stream = true;
var string_decoder = true;
var sys = true;
var timers = true;
var tls = true;
var tty = true;
var url = true;
var util$4 = true;
var v8 = ">= 1";
var vm = true;
var zlib = true;
var core$3 = {
	assert: assert$2,
	buffer_ieee754: buffer_ieee754,
	buffer: buffer,
	child_process: child_process,
	cluster: cluster,
	console: console$1,
	constants: constants,
	crypto: crypto,
	_debugger: _debugger,
	dgram: dgram,
	dns: dns,
	domain: domain,
	events: events$1,
	freelist: freelist,
	fs: fs$2,
	http: http,
	http2: http2,
	https: https,
	_http_server: _http_server,
	_linklist: _linklist,
	module: module$1,
	net: net,
	os: os$2,
	path: path$3,
	perf_hooks: perf_hooks,
	process: process$1,
	punycode: punycode,
	querystring: querystring,
	readline: readline,
	repl: repl,
	stream: stream,
	string_decoder: string_decoder,
	sys: sys,
	timers: timers,
	tls: tls,
	tty: tty,
	url: url,
	util: util$4,
	v8: v8,
	vm: vm,
	zlib: zlib
};

var core$4 = Object.freeze({
	assert: assert$2,
	buffer_ieee754: buffer_ieee754,
	buffer: buffer,
	child_process: child_process,
	cluster: cluster,
	console: console$1,
	constants: constants,
	crypto: crypto,
	_debugger: _debugger,
	dgram: dgram,
	dns: dns,
	domain: domain,
	events: events$1,
	freelist: freelist,
	fs: fs$2,
	http: http,
	http2: http2,
	https: https,
	_http_server: _http_server,
	_linklist: _linklist,
	module: module$1,
	net: net,
	os: os$2,
	path: path$3,
	perf_hooks: perf_hooks,
	process: process$1,
	punycode: punycode,
	querystring: querystring,
	readline: readline,
	repl: repl,
	stream: stream,
	string_decoder: string_decoder,
	sys: sys,
	timers: timers,
	tls: tls,
	tty: tty,
	url: url,
	util: util$4,
	v8: v8,
	vm: vm,
	zlib: zlib,
	default: core$3
});

var data = ( core$4 && core$3 ) || core$4;

var current = (process.versions && process.versions.node && process.versions.node.split('.')) || [];

function versionIncluded(specifier) {
    if (specifier === true) { return true; }
    var parts = specifier.split(' ');
    var op = parts[0];
    var versionParts = parts[1].split('.');

    for (var i = 0; i < 3; ++i) {
        var cur = Number(current[i] || 0);
        var ver = Number(versionParts[i] || 0);
        if (cur === ver) {
            continue; // eslint-disable-line no-restricted-syntax, no-continue
        }
        if (op === '<') {
            return cur < ver;
        } else if (op === '>=') {
            return cur >= ver;
        } else {
            return false;
        }
    }
    return false;
}



var core$2 = {};
for (var mod in data) { // eslint-disable-line no-restricted-syntax
    if (Object.prototype.hasOwnProperty.call(data, mod)) {
        core$2[mod] = versionIncluded(data[mod]);
    }
}
var core_1 = core$2;

var caller = function () {
    // see https://code.google.com/p/v8/wiki/JavaScriptStackTraceApi
    var origPrepareStackTrace = Error.prepareStackTrace;
    Error.prepareStackTrace = function (_, stack) { return stack; };
    var stack = (new Error()).stack;
    Error.prepareStackTrace = origPrepareStackTrace;
    return stack[2].getFileName();
};

var pathParse = createCommonjsModule(function (module) {
'use strict';

var isWindows = process.platform === 'win32';

// Regex to split a windows path into three parts: [*, device, slash,
// tail] windows-only
var splitDeviceRe =
    /^([a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/]+[^\\\/]+)?([\\\/])?([\s\S]*?)$/;

// Regex to split the tail part of the above into [*, dir, basename, ext]
var splitTailRe =
    /^([\s\S]*?)((?:\.{1,2}|[^\\\/]+?|)(\.[^.\/\\]*|))(?:[\\\/]*)$/;

var win32 = {};

// Function to split a filename into [root, dir, basename, ext]
function win32SplitPath(filename) {
  // Separate device+slash from tail
  var result = splitDeviceRe.exec(filename),
      device = (result[1] || '') + (result[2] || ''),
      tail = result[3] || '';
  // Split the tail into dir, basename and extension
  var result2 = splitTailRe.exec(tail),
      dir = result2[1],
      basename = result2[2],
      ext = result2[3];
  return [device, dir, basename, ext];
}

win32.parse = function(pathString) {
  if (typeof pathString !== 'string') {
    throw new TypeError(
        "Parameter 'pathString' must be a string, not " + typeof pathString
    );
  }
  var allParts = win32SplitPath(pathString);
  if (!allParts || allParts.length !== 4) {
    throw new TypeError("Invalid path '" + pathString + "'");
  }
  return {
    root: allParts[0],
    dir: allParts[0] + allParts[1].slice(0, -1),
    base: allParts[2],
    ext: allParts[3],
    name: allParts[2].slice(0, allParts[2].length - allParts[3].length)
  };
};



// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var posix = {};


function posixSplitPath(filename) {
  return splitPathRe.exec(filename).slice(1);
}


posix.parse = function(pathString) {
  if (typeof pathString !== 'string') {
    throw new TypeError(
        "Parameter 'pathString' must be a string, not " + typeof pathString
    );
  }
  var allParts = posixSplitPath(pathString);
  if (!allParts || allParts.length !== 4) {
    throw new TypeError("Invalid path '" + pathString + "'");
  }
  allParts[1] = allParts[1] || '';
  allParts[2] = allParts[2] || '';
  allParts[3] = allParts[3] || '';

  return {
    root: allParts[0],
    dir: allParts[0] + allParts[1].slice(0, -1),
    base: allParts[2],
    ext: allParts[3],
    name: allParts[2].slice(0, allParts[2].length - allParts[3].length)
  };
};


if (isWindows)
  module.exports = win32.parse;
else /* posix */
  module.exports = posix.parse;

module.exports.posix = posix.parse;
module.exports.win32 = win32.parse;
});

var parse$4 = path.parse || pathParse;

var nodeModulesPaths = function nodeModulesPaths(start, opts) {
    var modules = opts && opts.moduleDirectory
        ? [].concat(opts.moduleDirectory)
        : ['node_modules'];

    // ensure that `start` is an absolute path at this point,
    // resolving against the process' current working directory
    var absoluteStart = path.resolve(start);

    if (opts && opts.preserveSymlinks === false) {
        try {
            absoluteStart = fs.realpathSync(absoluteStart);
        } catch (err) {
            if (err.code !== 'ENOENT') {
                throw err;
            }
        }
    }

    var prefix = '/';
    if (/^([A-Za-z]:)/.test(absoluteStart)) {
        prefix = '';
    } else if (/^\\\\/.test(absoluteStart)) {
        prefix = '\\\\';
    }

    var paths = [absoluteStart];
    var parsed = parse$4(absoluteStart);
    while (parsed.dir !== paths[paths.length - 1]) {
        paths.push(parsed.dir);
        parsed = parse$4(parsed.dir);
    }

    var dirs = paths.reduce(function (dirs, aPath) {
        return dirs.concat(modules.map(function (moduleDir) {
            return path.join(prefix, aPath, moduleDir);
        }));
    }, []);

    return opts && opts.paths ? dirs.concat(opts.paths) : dirs;
};

var async = function resolve(x, options, callback) {
    var cb = callback;
    var opts = options || {};
    if (typeof opts === 'function') {
        cb = opts;
        opts = {};
    }
    if (typeof x !== 'string') {
        var err = new TypeError('Path must be a string.');
        return process.nextTick(function () {
            cb(err);
        });
    }

    var isFile = opts.isFile || function (file, cb) {
        fs.stat(file, function (err, stat) {
            if (!err) {
                return cb(null, stat.isFile() || stat.isFIFO());
            }
            if (err.code === 'ENOENT' || err.code === 'ENOTDIR') return cb(null, false);
            return cb(err);
        });
    };
    var readFile = opts.readFile || fs.readFile;

    var extensions = opts.extensions || ['.js'];
    var y = opts.basedir || path.dirname(caller());

    opts.paths = opts.paths || [];

    if (/^(?:\.\.?(?:\/|$)|\/|([A-Za-z]:)?[/\\])/.test(x)) {
        var res = path.resolve(y, x);
        if (x === '..' || x.slice(-1) === '/') res += '/';
        if (/\/$/.test(x) && res === y) {
            loadAsDirectory(res, opts.package, onfile);
        } else loadAsFile(res, opts.package, onfile);
    } else loadNodeModules(x, y, function (err, n, pkg) {
        if (err) cb(err);
        else if (n) cb(null, n, pkg);
        else if (core_1[x]) return cb(null, x);
        else {
            var moduleError = new Error("Cannot find module '" + x + "' from '" + y + "'");
            moduleError.code = 'MODULE_NOT_FOUND';
            cb(moduleError);
        }
    });

    function onfile(err, m, pkg) {
        if (err) cb(err);
        else if (m) cb(null, m, pkg);
        else loadAsDirectory(res, function (err, d, pkg) {
            if (err) cb(err);
            else if (d) cb(null, d, pkg);
            else {
                var moduleError = new Error("Cannot find module '" + x + "' from '" + y + "'");
                moduleError.code = 'MODULE_NOT_FOUND';
                cb(moduleError);
            }
        });
    }

    function loadAsFile(x, thePackage, callback) {
        var loadAsFilePackage = thePackage;
        var cb = callback;
        if (typeof loadAsFilePackage === 'function') {
            cb = loadAsFilePackage;
            loadAsFilePackage = undefined;
        }

        var exts = [''].concat(extensions);
        load(exts, x, loadAsFilePackage);

        function load(exts, x, loadPackage) {
            if (exts.length === 0) return cb(null, undefined, loadPackage);
            var file = x + exts[0];

            var pkg = loadPackage;
            if (pkg) onpkg(null, pkg);
            else loadpkg(path.dirname(file), onpkg);

            function onpkg(err, pkg_, dir) {
                pkg = pkg_;
                if (err) return cb(err);
                if (dir && pkg && opts.pathFilter) {
                    var rfile = path.relative(dir, file);
                    var rel = rfile.slice(0, rfile.length - exts[0].length);
                    var r = opts.pathFilter(pkg, x, rel);
                    if (r) return load(
                        [''].concat(extensions.slice()),
                        path.resolve(dir, r),
                        pkg
                    );
                }
                isFile(file, onex);
            }
            function onex(err, ex) {
                if (err) return cb(err);
                if (ex) return cb(null, file, pkg);
                load(exts.slice(1), x, pkg);
            }
        }
    }

    function loadpkg(dir, cb) {
        if (dir === '' || dir === '/') return cb(null);
        if (process.platform === 'win32' && (/^\w:[/\\]*$/).test(dir)) {
            return cb(null);
        }
        if (/[/\\]node_modules[/\\]*$/.test(dir)) return cb(null);

        var pkgfile = path.join(dir, 'package.json');
        isFile(pkgfile, function (err, ex) {
            // on err, ex is false
            if (!ex) return loadpkg(path.dirname(dir), cb);

            readFile(pkgfile, function (err, body) {
                if (err) cb(err);
                try { var pkg = JSON.parse(body); } catch (jsonErr) {}

                if (pkg && opts.packageFilter) {
                    pkg = opts.packageFilter(pkg, pkgfile);
                }
                cb(null, pkg, dir);
            });
        });
    }

    function loadAsDirectory(x, loadAsDirectoryPackage, callback) {
        var cb = callback;
        var fpkg = loadAsDirectoryPackage;
        if (typeof fpkg === 'function') {
            cb = fpkg;
            fpkg = opts.package;
        }

        var pkgfile = path.join(x, 'package.json');
        isFile(pkgfile, function (err, ex) {
            if (err) return cb(err);
            if (!ex) return loadAsFile(path.join(x, 'index'), fpkg, cb);

            readFile(pkgfile, function (err, body) {
                if (err) return cb(err);
                try {
                    var pkg = JSON.parse(body);
                } catch (jsonErr) {}

                if (opts.packageFilter) {
                    pkg = opts.packageFilter(pkg, pkgfile);
                }

                if (pkg.main) {
                    if (pkg.main === '.' || pkg.main === './') {
                        pkg.main = 'index';
                    }
                    loadAsFile(path.resolve(x, pkg.main), pkg, function (err, m, pkg) {
                        if (err) return cb(err);
                        if (m) return cb(null, m, pkg);
                        if (!pkg) return loadAsFile(path.join(x, 'index'), pkg, cb);

                        var dir = path.resolve(x, pkg.main);
                        loadAsDirectory(dir, pkg, function (err, n, pkg) {
                            if (err) return cb(err);
                            if (n) return cb(null, n, pkg);
                            loadAsFile(path.join(x, 'index'), pkg, cb);
                        });
                    });
                    return;
                }

                loadAsFile(path.join(x, '/index'), pkg, cb);
            });
        });
    }

    function processDirs(cb, dirs) {
        if (dirs.length === 0) return cb(null, undefined);
        var dir = dirs[0];

        var file = path.join(dir, x);
        loadAsFile(file, undefined, onfile);

        function onfile(err, m, pkg) {
            if (err) return cb(err);
            if (m) return cb(null, m, pkg);
            loadAsDirectory(path.join(dir, x), undefined, ondir);
        }

        function ondir(err, n, pkg) {
            if (err) return cb(err);
            if (n) return cb(null, n, pkg);
            processDirs(cb, dirs.slice(1));
        }
    }
    function loadNodeModules(x, start, cb) {
        processDirs(cb, nodeModulesPaths(start, opts));
    }
};

var sync$3 = function (x, options) {
    if (typeof x !== 'string') {
        throw new TypeError('Path must be a string.');
    }
    var opts = options || {};
    var isFile = opts.isFile || function (file) {
        try {
            var stat = fs.statSync(file);
        } catch (e) {
            if (e && (e.code === 'ENOENT' || e.code === 'ENOTDIR')) return false;
            throw e;
        }
        return stat.isFile() || stat.isFIFO();
    };
    var readFileSync = opts.readFileSync || fs.readFileSync;

    var extensions = opts.extensions || ['.js'];
    var y = opts.basedir || path.dirname(caller());

    opts.paths = opts.paths || [];

    if (/^(?:\.\.?(?:\/|$)|\/|([A-Za-z]:)?[/\\])/.test(x)) {
        var res = path.resolve(y, x);
        if (x === '..' || x.slice(-1) === '/') res += '/';
        var m = loadAsFileSync(res) || loadAsDirectorySync(res);
        if (m) return m;
    } else {
        var n = loadNodeModulesSync(x, y);
        if (n) return n;
    }

    if (core_1[x]) return x;

    var err = new Error("Cannot find module '" + x + "' from '" + y + "'");
    err.code = 'MODULE_NOT_FOUND';
    throw err;

    function loadAsFileSync(x) {
        if (isFile(x)) {
            return x;
        }

        for (var i = 0; i < extensions.length; i++) {
            var file = x + extensions[i];
            if (isFile(file)) {
                return file;
            }
        }
    }

    function loadAsDirectorySync(x) {
        var pkgfile = path.join(x, '/package.json');
        if (isFile(pkgfile)) {
            try {
                var body = readFileSync(pkgfile, 'UTF8');
                var pkg = JSON.parse(body);

                if (opts.packageFilter) {
                    pkg = opts.packageFilter(pkg, x);
                }

                if (pkg.main) {
                    if (pkg.main === '.' || pkg.main === './') {
                        pkg.main = 'index';
                    }
                    var m = loadAsFileSync(path.resolve(x, pkg.main));
                    if (m) return m;
                    var n = loadAsDirectorySync(path.resolve(x, pkg.main));
                    if (n) return n;
                }
            } catch (e) {}
        }

        return loadAsFileSync(path.join(x, '/index'));
    }

    function loadNodeModulesSync(x, start) {
        var dirs = nodeModulesPaths(start, opts);
        for (var i = 0; i < dirs.length; i++) {
            var dir = dirs[i];
            var m = loadAsFileSync(path.join(dir, '/', x));
            if (m) return m;
            var n = loadAsDirectorySync(path.join(dir, '/', x));
            if (n) return n;
        }
    }
};

var resolve$1 = createCommonjsModule(function (module, exports) {
async.core = core_1;
async.isCore = function isCore(x) { return core_1[x]; };
async.sync = sync$3;

exports = async;
module.exports = async;
});

var index$5 = [
  "a",
  "abbr",
  "acronym",
  "address",
  "applet",
  "area",
  "article",
  "aside",
  "audio",
  "b",
  "base",
  "basefont",
  "bdi",
  "bdo",
  "bgsound",
  "big",
  "blink",
  "blockquote",
  "body",
  "br",
  "button",
  "canvas",
  "caption",
  "center",
  "cite",
  "code",
  "col",
  "colgroup",
  "command",
  "content",
  "data",
  "datalist",
  "dd",
  "del",
  "details",
  "dfn",
  "dialog",
  "dir",
  "div",
  "dl",
  "dt",
  "element",
  "em",
  "embed",
  "fieldset",
  "figcaption",
  "figure",
  "font",
  "footer",
  "form",
  "frame",
  "frameset",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "head",
  "header",
  "hgroup",
  "hr",
  "html",
  "i",
  "iframe",
  "image",
  "img",
  "input",
  "ins",
  "isindex",
  "kbd",
  "keygen",
  "label",
  "legend",
  "li",
  "link",
  "listing",
  "main",
  "map",
  "mark",
  "marquee",
  "math",
  "menu",
  "menuitem",
  "meta",
  "meter",
  "multicol",
  "nav",
  "nextid",
  "nobr",
  "noembed",
  "noframes",
  "noscript",
  "object",
  "ol",
  "optgroup",
  "option",
  "output",
  "p",
  "param",
  "picture",
  "plaintext",
  "pre",
  "progress",
  "q",
  "rb",
  "rbc",
  "rp",
  "rt",
  "rtc",
  "ruby",
  "s",
  "samp",
  "script",
  "section",
  "select",
  "shadow",
  "slot",
  "small",
  "source",
  "spacer",
  "span",
  "strike",
  "strong",
  "style",
  "sub",
  "summary",
  "sup",
  "svg",
  "table",
  "tbody",
  "td",
  "template",
  "textarea",
  "tfoot",
  "th",
  "thead",
  "time",
  "title",
  "tr",
  "track",
  "tt",
  "u",
  "ul",
  "var",
  "video",
  "wbr",
  "xmp"
]
;

var htmlTagNames = Object.freeze({
	default: index$5
});

var htmlTagNames$1 = ( htmlTagNames && index$5 ) || htmlTagNames;

function clean$2(ast, newObj) {
  ["raws", "sourceIndex", "source", "before", "after", "trailingComma"].forEach(
    name => {
      delete newObj[name];
    }
  );

  if (
    ast.type === "media-query" ||
    ast.type === "media-query-list" ||
    ast.type === "media-feature-expression"
  ) {
    delete newObj.value;
  }

  if (ast.type === "css-rule") {
    delete newObj.params;
  }

  if (ast.type === "selector-combinator") {
    newObj.value = newObj.value.replace(/\s+/g, " ");
  }

  if (ast.type === "media-feature") {
    newObj.value = newObj.value.replace(/ /g, "");
  }

  if (
    (ast.type === "value-word" &&
      ((ast.isColor && ast.isHex) ||
        ["initial", "inherit", "unset", "revert"].indexOf(
          newObj.value.replace().toLowerCase()
        ) !== -1)) ||
    ast.type === "media-feature" ||
    ast.type === "selector-root-invalid" ||
    ast.type === "selector-pseudo"
  ) {
    newObj.value = newObj.value.toLowerCase();
  }
  if (ast.type === "css-decl") {
    newObj.prop = newObj.prop.toLowerCase();
  }
  if (ast.type === "css-atrule" || ast.type === "css-import") {
    newObj.name = newObj.name.toLowerCase();
  }
  if (ast.type === "value-number") {
    newObj.unit = newObj.unit.toLowerCase();
  }

  if (
    (ast.type === "media-feature" ||
      ast.type === "media-keyword" ||
      ast.type === "media-type" ||
      ast.type === "media-unknown" ||
      ast.type === "media-url" ||
      ast.type === "media-value" ||
      ast.type === "selector-root-invalid" ||
      ast.type === "selector-attribute" ||
      ast.type === "selector-string" ||
      ast.type === "selector-class" ||
      ast.type === "selector-combinator" ||
      ast.type === "value-string") &&
    newObj.value
  ) {
    newObj.value = cleanCSSStrings(newObj.value);
  }

  if (ast.type === "css-import" && newObj.importPath) {
    newObj.importPath = cleanCSSStrings(newObj.importPath);
  }

  if (ast.type === "selector-attribute") {
    newObj.attribute = newObj.attribute.trim();

    if (newObj.namespace) {
      if (typeof newObj.namespace === "string") {
        newObj.namespace = newObj.namespace.trim();

        if (newObj.namespace.length === 0) {
          newObj.namespace = true;
        }
      }
    }

    if (newObj.value) {
      newObj.value = newObj.value.trim().replace(/^['"]|['"]$/g, "");
      delete newObj.quoted;
    }
  }

  if (
    (ast.type === "media-value" ||
      ast.type === "media-type" ||
      ast.type === "value-number" ||
      ast.type === "selector-root-invalid" ||
      ast.type === "selector-class" ||
      ast.type === "selector-combinator" ||
      ast.type === "selector-tag") &&
    newObj.value
  ) {
    newObj.value = newObj.value.replace(
      /([\d.eE+-]+)([a-zA-Z]*)/g,
      (match, numStr, unit) => {
        const num = Number(numStr);
        return isNaN(num) ? match : num + unit.toLowerCase();
      }
    );
  }

  if (ast.type === "media-url") {
    newObj.value = newObj.value
      .replace(/^url\(\s+/gi, "url(")
      .replace(/\s+\)$/gi, ")");
  }

  if (ast.type === "selector-tag") {
    const lowercasedValue = ast.value.toLowerCase();

    if (htmlTagNames$1.indexOf(lowercasedValue) !== -1) {
      newObj.value = lowercasedValue;
    }

    if (["from", "to"].indexOf(lowercasedValue) !== -1) {
      newObj.value = lowercasedValue;
    }
  }

  // Workaround when `postcss-values-parser` parse `not`, `and` or `or` keywords as `value-func`
  if (ast.type === "css-atrule" && ast.name.toLowerCase() === "supports") {
    delete newObj.value;
  }
}

function cleanCSSStrings(value) {
  return value.replace(/'/g, '"').replace(/\\([^a-fA-F\d])/g, "$1");
}

var clean_1$2 = clean$2;

function getAncestorCounter(path$$1, typeOrTypes) {
  const types = [].concat(typeOrTypes);

  let counter = -1;
  let ancestorNode;

  while ((ancestorNode = path$$1.getParentNode(++counter))) {
    if (types.indexOf(ancestorNode.type) !== -1) {
      return counter;
    }
  }

  return -1;
}

function getAncestorNode$1(path$$1, typeOrTypes) {
  const counter = getAncestorCounter(path$$1, typeOrTypes);
  return counter === -1 ? null : path$$1.getParentNode(counter);
}

function getPropOfDeclNode$1(path$$1) {
  const declAncestorNode = getAncestorNode$1(path$$1, "css-decl");

  return (
    declAncestorNode &&
    declAncestorNode.prop &&
    declAncestorNode.prop.toLowerCase()
  );
}

function isSCSS$1(parser, text) {
  const hasExplicitParserChoice = parser === "less" || parser === "scss";
  const IS_POSSIBLY_SCSS = /(\w\s*: [^}:]+|#){|@import[^\n]+(url|,)/;
  return hasExplicitParserChoice
    ? parser === "scss"
    : IS_POSSIBLY_SCSS.test(text);
}

function isWideKeywords$1(value) {
  return (
    ["initial", "inherit", "unset", "revert"].indexOf(value.toLowerCase()) !==
    -1
  );
}

function isKeyframeAtRuleKeywords$1(path$$1, value) {
  const atRuleAncestorNode = getAncestorNode$1(path$$1, "css-atrule");
  return (
    atRuleAncestorNode &&
    atRuleAncestorNode.name &&
    atRuleAncestorNode.name.toLowerCase().endsWith("keyframes") &&
    ["from", "to"].indexOf(value.toLowerCase()) !== -1
  );
}

function maybeToLowerCase$1(value) {
  return value.includes("$") ||
    value.includes("@") ||
    value.includes("#") ||
    value.startsWith("%") ||
    value.startsWith("--") ||
    value.startsWith(":--") ||
    (value.includes("(") && value.includes(")"))
    ? value
    : value.toLowerCase();
}

function insideValueFunctionNode$1(path$$1, functionName) {
  const funcAncestorNode = getAncestorNode$1(path$$1, "value-func");
  return (
    funcAncestorNode &&
    funcAncestorNode.value &&
    funcAncestorNode.value.toLowerCase() === functionName
  );
}

function insideICSSRuleNode$1(path$$1) {
  const ruleAncestorNode = getAncestorNode$1(path$$1, "css-rule");

  return (
    ruleAncestorNode &&
    ruleAncestorNode.raws &&
    ruleAncestorNode.raws.selector &&
    (ruleAncestorNode.raws.selector.startsWith(":import") ||
      ruleAncestorNode.raws.selector.startsWith(":export"))
  );
}

function insideAtRuleNode$1(path$$1, atRuleName) {
  const atRuleAncestorNode = getAncestorNode$1(path$$1, "css-atrule");

  return (
    atRuleAncestorNode && atRuleAncestorNode.name.toLowerCase() === atRuleName
  );
}

function isURLFunction$1(node) {
  return node.type === "value-func" && node.value.toLowerCase() === "url";
}

function isLastNode$1(path$$1, node) {
  const parentNode = path$$1.getParentNode();
  if (!parentNode) {
    return false;
  }
  const nodes = parentNode.nodes;
  return nodes && nodes.indexOf(node) === nodes.length - 1;
}

function isHTMLTag$1(value) {
  return htmlTagNames$1.indexOf(value.toLowerCase()) !== -1;
}

function isDetachedRulesetDeclaration$1(node) {
  // If a Less file ends up being parsed with the SCSS parser, Less
  // variable declarations will be parsed as atrules with names ending
  // with a colon, so keep the original case then.
  return (
    node.selector &&
    node.selector.type !== "selector-root-invalid" &&
    ((typeof node.selector === "string" && /^@.+:.*$/.test(node.selector)) ||
      (node.selector.value && /^@.+:.*$/.test(node.selector.value)))
  );
}

function isParenGroupNode$1(node) {
  return node.type === "value-paren_group";
}

function isForKeywordNode$1(node) {
  return (
    node.type === "value-word" &&
    ["from", "through", "end"].indexOf(node.value) !== -1
  );
}

function isIfElseKeywordNode$1(node) {
  return (
    node.type === "value-word" &&
    ["and", "or", "not"].indexOf(node.value) !== -1
  );
}

function isEachKeywordNode$1(node) {
  return node.type === "value-word" && node.value === "in";
}

function isMathOperatorNode$1(node) {
  return (
    node.type === "value-operator" &&
    ["+", "-", "/", "*", "%"].indexOf(node.value) !== -1
  );
}

function isEqualityOperatorNode$1(node) {
  return node.type === "value-word" && ["==", "!="].indexOf(node.value) !== -1;
}

function isRelationalOperatorNode$1(node) {
  return (
    node.type === "value-word" &&
    ["<", ">", "<=", ">="].indexOf(node.value) !== -1
  );
}

function isSCSSControlDirectiveNode$1(node) {
  return (
    node.type === "css-atrule" &&
    ["if", "else", "for", "each", "while"].indexOf(node.name) !== -1
  );
}

function isSCSSMap$1(node) {
  return node.type === "css-decl" && node.prop && node.prop.startsWith("$");
}

function hasLessExtendValueNode$1(node) {
  return (
    node.value &&
    node.value.type === "value-root" &&
    node.value.group &&
    node.value.group.type === "value-value" &&
    node.value.group.group &&
    node.value.group.group.type === "value-func" &&
    node.value.group.group.value === "extend"
  );
}

function hasComposesValueNode$1(node) {
  return (
    node.value &&
    node.value.type === "value-root" &&
    node.value.group &&
    node.value.group.type === "value-value" &&
    node.prop.toLowerCase() === "composes"
  );
}

function hasParensAroundValueNode$1(node) {
  return (
    node.value &&
    node.value.group &&
    node.value.group.group &&
    node.value.group.group.type === "value-paren_group" &&
    node.value.group.group.open !== null &&
    node.value.group.group.close !== null
  );
}

function isPostcssSimpleVar$1(currentNode, nextNode) {
  return (
    currentNode.value === "$$" &&
    currentNode.type === "value-func" &&
    nextNode &&
    nextNode.type === "value-word" &&
    !nextNode.raws.before
  );
}
var utils$4 = {
  getAncestorCounter,
  getAncestorNode: getAncestorNode$1,
  getPropOfDeclNode: getPropOfDeclNode$1,
  insideValueFunctionNode: insideValueFunctionNode$1,
  insideICSSRuleNode: insideICSSRuleNode$1,
  insideAtRuleNode: insideAtRuleNode$1,
  isLastNode: isLastNode$1,
  isSCSSControlDirectiveNode: isSCSSControlDirectiveNode$1,
  isDetachedRulesetDeclaration: isDetachedRulesetDeclaration$1,
  isKeyframeAtRuleKeywords: isKeyframeAtRuleKeywords$1,
  isHTMLTag: isHTMLTag$1,
  isRelationalOperatorNode: isRelationalOperatorNode$1,
  isEqualityOperatorNode: isEqualityOperatorNode$1,
  isMathOperatorNode: isMathOperatorNode$1,
  isEachKeywordNode: isEachKeywordNode$1,
  isParenGroupNode: isParenGroupNode$1,
  isForKeywordNode: isForKeywordNode$1,
  isSCSS: isSCSS$1,
  isSCSSMap: isSCSSMap$1,
  isURLFunction: isURLFunction$1,
  isWideKeywords: isWideKeywords$1,
  isIfElseKeywordNode: isIfElseKeywordNode$1,
  maybeToLowerCase: maybeToLowerCase$1,
  hasLessExtendValueNode: hasLessExtendValueNode$1,
  hasComposesValueNode: hasComposesValueNode$1,
  hasParensAroundValueNode: hasParensAroundValueNode$1,
  isPostcssSimpleVar: isPostcssSimpleVar$1
};

const docBuilders$7 = doc.builders;
const concat$6 = docBuilders$7.concat;
const join$4 = docBuilders$7.join;
const line$4 = docBuilders$7.line;
const hardline$5 = docBuilders$7.hardline;
const softline$3 = docBuilders$7.softline;
const group$2 = docBuilders$7.group;
const fill$3 = docBuilders$7.fill;
const indent$4 = docBuilders$7.indent;

const docUtils$6 = doc.utils;
const removeLines$1 = docUtils$6.removeLines;


const getAncestorNode = utils$4.getAncestorNode;
const getPropOfDeclNode = utils$4.getPropOfDeclNode;
const insideValueFunctionNode = utils$4.insideValueFunctionNode;
const insideICSSRuleNode = utils$4.insideICSSRuleNode;
const insideAtRuleNode = utils$4.insideAtRuleNode;
const isSCSSControlDirectiveNode = utils$4.isSCSSControlDirectiveNode;
const isForKeywordNode = utils$4.isForKeywordNode;
const isEachKeywordNode = utils$4.isEachKeywordNode;
const isEqualityOperatorNode = utils$4.isEqualityOperatorNode;
const isDetachedRulesetDeclaration = utils$4.isDetachedRulesetDeclaration;
const isSCSS = utils$4.isSCSS;
const isSCSSMap = utils$4.isSCSSMap;
const isIfElseKeywordNode = utils$4.isIfElseKeywordNode;
const isHTMLTag = utils$4.isHTMLTag;
const isURLFunction = utils$4.isURLFunction;
const isMathOperatorNode = utils$4.isMathOperatorNode;
const isLastNode = utils$4.isLastNode;
const isParenGroupNode = utils$4.isParenGroupNode;
const isRelationalOperatorNode = utils$4.isRelationalOperatorNode;
const isKeyframeAtRuleKeywords = utils$4.isKeyframeAtRuleKeywords;
const isWideKeywords = utils$4.isWideKeywords;
const hasComposesValueNode = utils$4.hasComposesValueNode;
const hasLessExtendValueNode = utils$4.hasLessExtendValueNode;
const hasParensAroundValueNode = utils$4.hasParensAroundValueNode;
const maybeToLowerCase = utils$4.maybeToLowerCase;
const isPostcssSimpleVar = utils$4.isPostcssSimpleVar;

function genericPrint$2(path$$1, options, print) {
  const node = path$$1.getValue();

  /* istanbul ignore if */
  if (!node) {
    return "";
  }

  if (typeof node === "string") {
    return node;
  }

  switch (node.type) {
    case "css-comment-yaml":
      return node.value;
    case "css-root": {
      const nodes = printNodeSequence(path$$1, options, print);

      if (nodes.parts.length) {
        return concat$6([nodes, hardline$5]);
      }

      return nodes;
    }
    case "css-comment": {
      if (node.raws.content) {
        return node.raws.content;
      }
      const text = options.originalText.slice(
        options.locStart(node),
        options.locEnd(node)
      );
      const rawText = node.raws.text || node.text;
      // Workaround a bug where the location is off.
      // https://github.com/postcss/postcss-scss/issues/63
      if (text.indexOf(rawText) === -1) {
        if (node.raws.inline) {
          return concat$6(["// ", rawText]);
        }
        return concat$6(["/* ", rawText, " */"]);
      }
      return text;
    }
    case "css-rule": {
      return concat$6([
        path$$1.call(print, "selector"),
        node.important ? " !important" : "",
        node.nodes
          ? concat$6([
              " {",
              node.nodes.length > 0
                ? indent$4(
                    concat$6([hardline$5, printNodeSequence(path$$1, options, print)])
                  )
                : "",
              hardline$5,
              "}",
              isDetachedRulesetDeclaration(node) ? ";" : ""
            ])
          : ";"
      ]);
    }
    case "css-decl": {
      return concat$6([
        node.raws.before.replace(/[\s;]/g, ""),
        insideICSSRuleNode(path$$1) ? node.prop : maybeToLowerCase(node.prop),
        node.raws.between.trim() === ":" ? ":" : node.raws.between.trim(),
        // When the following less construct &:extend(.foo); is parsed with scss,
        // it will put a space after `:` and break it. Ideally we should parse
        // less files with less, but we can hardcode this to work with scss as
        // well.
        hasLessExtendValueNode(node) ? "" : " ",
        hasComposesValueNode(node)
          ? removeLines$1(path$$1.call(print, "value"))
          : path$$1.call(print, "value"),
        node.raws.important
          ? node.raws.important.replace(/\s*!\s*important/i, " !important")
          : node.important
            ? " !important"
            : "",
        node.raws.scssDefault
          ? node.raws.scssDefault.replace(/\s*!default/i, " !default")
          : node.scssDefault
            ? " !default"
            : "",
        node.raws.scssGlobal
          ? node.raws.scssGlobal.replace(/\s*!global/i, " !global")
          : node.scssGlobal
            ? " !global"
            : "",
        node.nodes
          ? concat$6([
              " {",
              indent$4(
                concat$6([softline$3, printNodeSequence(path$$1, options, print)])
              ),
              softline$3,
              "}"
            ])
          : ";"
      ]);
    }
    case "css-atrule": {
      const isDetachedRulesetCall =
        node.params && /^\(\s*\)$/.test(node.params);

      return concat$6([
        "@",
        // If a Less file ends up being parsed with the SCSS parser, Less
        // variable declarations will be parsed as at-rules with names ending
        // with a colon, so keep the original case then.
        isDetachedRulesetCall || node.name.endsWith(":")
          ? node.name
          : maybeToLowerCase(node.name),
        node.params
          ? concat$6([
              isDetachedRulesetCall ? "" : " ",
              path$$1.call(print, "params")
            ])
          : "",
        node.selector
          ? indent$4(concat$6([" ", path$$1.call(print, "selector")]))
          : "",
        node.value
          ? group$2(
              concat$6([
                " ",
                path$$1.call(print, "value"),
                isSCSSControlDirectiveNode(node)
                  ? hasParensAroundValueNode(node)
                    ? " "
                    : line$4
                  : ""
              ])
            )
          : node.name === "else"
            ? " "
            : "",
        node.nodes
          ? concat$6([
              isSCSSControlDirectiveNode(node) ? "" : " ",
              "{",
              indent$4(
                concat$6([
                  node.nodes.length > 0 ? softline$3 : "",
                  printNodeSequence(path$$1, options, print)
                ])
              ),
              softline$3,
              "}"
            ])
          : ";"
      ]);
    }
    // postcss-media-query-parser
    case "media-query-list": {
      const parts = [];
      path$$1.each(childPath => {
        const node = childPath.getValue();
        if (node.type === "media-query" && node.value === "") {
          return;
        }
        parts.push(childPath.call(print));
      }, "nodes");

      return group$2(indent$4(join$4(line$4, parts)));
    }
    case "media-query": {
      return concat$6([
        join$4(" ", path$$1.map(print, "nodes")),
        isLastNode(path$$1, node) ? "" : ","
      ]);
    }
    case "media-type": {
      return adjustNumbers(adjustStrings(node.value, options));
    }
    case "media-feature-expression": {
      if (!node.nodes) {
        return node.value;
      }
      return concat$6(["(", concat$6(path$$1.map(print, "nodes")), ")"]);
    }
    case "media-feature": {
      return maybeToLowerCase(
        adjustStrings(node.value.replace(/ +/g, " "), options)
      );
    }
    case "media-colon": {
      return concat$6([node.value, " "]);
    }
    case "media-value": {
      return adjustNumbers(adjustStrings(node.value, options));
    }
    case "media-keyword": {
      return adjustStrings(node.value, options);
    }
    case "media-url": {
      return adjustStrings(
        node.value.replace(/^url\(\s+/gi, "url(").replace(/\s+\)$/gi, ")"),
        options
      );
    }
    case "media-unknown": {
      return adjustStrings(node.value, options);
    }
    // postcss-selector-parser
    case "selector-root-invalid": {
      // This is likely a SCSS nested property: `background: { color: red; }`.
      return adjustNumbers(
        adjustStrings(maybeToLowerCase(node.value), options)
      );
    }
    case "selector-root": {
      const atRuleAncestorNode = getAncestorNode(path$$1, "css-atrule");
      const insideAtRuleNode =
        atRuleAncestorNode &&
        ["extend", "custom-selector", "nest"].indexOf(
          atRuleAncestorNode.name
        ) !== -1;

      return group$2(
        concat$6([
          atRuleAncestorNode && atRuleAncestorNode.name === "custom-selector"
            ? concat$6([atRuleAncestorNode.customSelector, line$4])
            : "",
          join$4(
            concat$6([",", insideAtRuleNode ? line$4 : hardline$5]),
            path$$1.map(print, "nodes")
          )
        ])
      );
    }
    case "selector-comment": {
      return node.value;
    }
    case "selector-string": {
      return adjustStrings(node.value, options);
    }
    case "selector-tag": {
      const parentNode = path$$1.getParentNode();
      const index = parentNode && parentNode.nodes.indexOf(node);
      const prevNode = index && parentNode.nodes[index - 1];

      return concat$6([
        node.namespace
          ? concat$6([node.namespace === true ? "" : node.namespace.trim(), "|"])
          : "",
        prevNode.type === "selector-nesting"
          ? node.value
          : adjustNumbers(
              isHTMLTag(node.value) ||
              isKeyframeAtRuleKeywords(path$$1, node.value)
                ? node.value.toLowerCase()
                : node.value
            )
      ]);
    }
    case "selector-id": {
      return concat$6(["#", node.value]);
    }
    case "selector-class": {
      return concat$6([".", adjustNumbers(adjustStrings(node.value, options))]);
    }
    case "selector-attribute": {
      return concat$6([
        "[",
        node.namespace
          ? concat$6([node.namespace === true ? "" : node.namespace.trim(), "|"])
          : "",
        node.attribute.trim(),
        node.operator ? node.operator : "",
        node.value
          ? quoteAttributeValue(
              adjustStrings(node.value.trim(), options),
              options
            )
          : "",
        node.insensitive ? " i" : "",
        "]"
      ]);
    }
    case "selector-combinator": {
      if (
        node.value === "+" ||
        node.value === ">" ||
        node.value === "~" ||
        node.value === ">>>"
      ) {
        const parentNode = path$$1.getParentNode();
        const leading =
          parentNode.type === "selector-selector" &&
          parentNode.nodes[0] === node
            ? ""
            : line$4;
        return concat$6([leading, node.value, isLastNode(path$$1, node) ? "" : " "]);
      }
      const leading = node.value.trim().startsWith("(") ? line$4 : "";
      const value =
        adjustNumbers(adjustStrings(node.value.trim(), options)) || line$4;
      return concat$6([leading, value]);
    }
    case "selector-universal": {
      return concat$6([
        node.namespace
          ? concat$6([node.namespace === true ? "" : node.namespace.trim(), "|"])
          : "",
        adjustNumbers(node.value)
      ]);
    }
    case "selector-selector": {
      return group$2(indent$4(concat$6(path$$1.map(print, "nodes"))));
    }
    case "selector-pseudo": {
      return concat$6([
        maybeToLowerCase(node.value),
        node.nodes && node.nodes.length > 0
          ? concat$6(["(", join$4(", ", path$$1.map(print, "nodes")), ")"])
          : ""
      ]);
    }
    case "selector-nesting": {
      return node.value;
    }
    // postcss-values-parser
    case "value-root": {
      return path$$1.call(print, "group");
    }
    case "value-comment": {
      return concat$6([
        node.inline ? "//" : "/*",
        node.value,
        node.inline ? "" : "*/"
      ]);
    }
    case "value-comma_group": {
      const parentNode = path$$1.getParentNode();
      const declAncestorProp = getPropOfDeclNode(path$$1);
      const isGridValue =
        declAncestorProp &&
        parentNode.type === "value-value" &&
        (declAncestorProp === "grid" ||
          declAncestorProp.startsWith("grid-template"));
      const atRuleAncestorNode = getAncestorNode(path$$1, "css-atrule");
      const isControlDirective =
        atRuleAncestorNode && isSCSSControlDirectiveNode(atRuleAncestorNode);

      const printed = path$$1.map(print, "groups");
      const parts = [];
      const insideURLFunction = insideValueFunctionNode(path$$1, "url");

      let didBreak = false;
      for (let i = 0; i < node.groups.length; ++i) {
        parts.push(printed[i]);

        // Ignore value inside `url()`
        if (insideURLFunction) {
          continue;
        }

        const iPrevNode = node.groups[i - 1];
        const iNode = node.groups[i];
        const iNextNode = node.groups[i + 1];
        const iNextNextNode = node.groups[i + 2];

        if (isPostcssSimpleVar(iNode, iNextNode)) {
          continue;
        }
        // Ignore after latest node (i.e. before semicolon)
        if (!iNextNode) {
          continue;
        }

        // Ignore colon
        if (iNode.value === ":") {
          continue;
        }

        // Ignore `@` in Less (i.e. `@@var;`)
        if (iNode.type === "value-atword" && iNode.value === "") {
          continue;
        }

        // Ignore `~` in Less (i.e. `content: ~"^//* some horrible but needed css hack";`)
        if (iNode.value === "~") {
          continue;
        }

        if (
          (iPrevNode &&
            iPrevNode.type === "value-comment" &&
            iPrevNode.inline) ||
          (iNextNode.type === "value-comment" && iNextNode.inline)
        ) {
          continue;
        }

        const isHash = iNode.type === "value-word" && iNode.value === "#";
        const isLeftCurlyBrace =
          iNode.type === "value-word" && iNode.value === "{";
        const isNextLeftCurlyBrace =
          iNextNode.type === "value-word" && iNextNode.value === "{";
        const isRightCurlyBrace =
          iNode.type === "value-word" && iNode.value === "}";
        const isNextRightCurlyBrace =
          iNextNode.type === "value-word" && iNextNode.value === "}";

        // Ignore interpolation in SCSS (i.e. ``#{variable}``)
        if (
          isHash ||
          isLeftCurlyBrace ||
          isNextRightCurlyBrace ||
          (isNextLeftCurlyBrace &&
            iNextNode.raws &&
            iNextNode.raws.before === "") ||
          (isRightCurlyBrace && iNextNode.raws && iNextNode.raws.before === "")
        ) {
          continue;
        }

        const isNextHash =
          iNextNode.type === "value-word" && iNextNode.value === "#";

        const isMathOperator = isMathOperatorNode(iNode);
        const isNextMathOperator = isMathOperatorNode(iNextNode);

        const isMultiplication =
          !isNextHash && isMathOperator && iNode.value === "*";
        const isNextMultiplication =
          !isRightCurlyBrace && isNextMathOperator && iNextNode.value === "*";

        const isDivision = !isNextHash && isMathOperator && iNode.value === "/";
        const isNextDivision =
          !isRightCurlyBrace && isNextMathOperator && iNextNode.value === "/";

        const isAddition = !isNextHash && isMathOperator && iNode.value === "+";
        const isNextAddition =
          !isRightCurlyBrace && isNextMathOperator && iNextNode.value === "+";

        const isPrevFunction = iPrevNode && iPrevNode.type === "value-func";
        const isFunction = iNode.type === "value-func";
        const isNextFunction = iNextNode.type === "value-func";
        const isNextNextFunction =
          iNextNextNode && iNextNextNode.type === "value-func";

        const isPrevWord =
          iPrevNode &&
          ["value-word", "value-atword"].indexOf(iPrevNode.type) !== -1;
        const isWord =
          ["value-word", "value-atword"].indexOf(iNode.type) !== -1;
        const isNextWord =
          ["value-word", "value-atword"].indexOf(iNextNode.type) !== -1;
        const isNextNextWord =
          iNextNextNode &&
          ["value-word", "value-atword"].indexOf(iNextNextNode.type) !== -1;

        // Math operators
        const insideCalcFunction = insideValueFunctionNode(path$$1, "calc");

        const hasSpaceBeforeOperator =
          isNextNextFunction || isNextNextWord || isFunction || isWord;

        const hasSpaceAfterOperator =
          isNextFunction || isNextWord || isPrevFunction || isPrevWord;

        if (
          (isMathOperator || isNextMathOperator) &&
          // Multiplication
          !isMultiplication &&
          !isNextMultiplication &&
          // Division
          !(isNextDivision && (hasSpaceBeforeOperator || insideCalcFunction)) &&
          !(isDivision && (hasSpaceAfterOperator || insideCalcFunction)) &&
          // Addition
          !(isNextAddition && hasSpaceBeforeOperator) &&
          !(isAddition && hasSpaceAfterOperator)
        ) {
          const isNextParenGroup = isParenGroupNode(iNextNode);
          const isNextValueNumber = iNextNode.type === "value-number";

          if (
            (iNextNode.raws && iNextNode.raws.before === "") ||
            (isMathOperator &&
              (isNextParenGroup ||
                isNextWord ||
                isNextValueNumber ||
                isMathOperatorNode(iNextNode)) &&
              (!iPrevNode || (iPrevNode && isMathOperatorNode(iPrevNode))))
          ) {
            continue;
          }
        }

        const isEqualityOperator =
          isControlDirective && isEqualityOperatorNode(iNode);
        const isRelationalOperator =
          isControlDirective && isRelationalOperatorNode(iNode);
        const isNextEqualityOperator =
          isControlDirective && isEqualityOperatorNode(iNextNode);
        const isNextRelationalOperator =
          isControlDirective && isRelationalOperatorNode(iNextNode);
        const isNextIfElseKeyword =
          isControlDirective && isIfElseKeywordNode(iNextNode);
        const isEachKeyword = isControlDirective && isEachKeywordNode(iNode);
        const isNextEachKeyword =
          isControlDirective && isEachKeywordNode(iNextNode);
        const isForKeyword =
          atRuleAncestorNode &&
          atRuleAncestorNode.name === "for" &&
          isForKeywordNode(iNode);
        const isNextForKeyword =
          isControlDirective && isForKeywordNode(iNextNode);
        const IsNextColon = iNextNode.value === ":";

        if (isGridValue) {
          if (iNode.source.start.line !== iNextNode.source.start.line) {
            parts.push(hardline$5);
            didBreak = true;
          } else {
            parts.push(" ");
          }
        } else if (iNode.type === "value-comment" && iNode.inline) {
          parts.push(hardline$5);
        } else if (
          isNextMathOperator ||
          isNextEqualityOperator ||
          isNextRelationalOperator ||
          isNextIfElseKeyword ||
          isForKeyword ||
          isEachKeyword ||
          (atRuleAncestorNode &&
            atRuleAncestorNode.name.toLowerCase() === "namespace")
        ) {
          parts.push(" ");
        } else if (
          !IsNextColon ||
          isEqualityOperator ||
          isRelationalOperator ||
          isNextForKeyword ||
          isNextEachKeyword
        ) {
          parts.push(line$4);
        }
      }

      if (didBreak) {
        parts.unshift(hardline$5);
      }

      if (isControlDirective) {
        return group$2(indent$4(concat$6(parts)));
      }

      return group$2(indent$4(fill$3(parts)));
    }
    case "value-paren_group": {
      const parentNode = path$$1.getParentNode();

      if (
        parentNode &&
        isURLFunction(parentNode) &&
        (node.groups.length === 1 ||
          (node.groups.length > 0 &&
            node.groups[0].type === "value-comma_group" &&
            node.groups[0].groups.length > 0 &&
            node.groups[0].groups[0].type === "value-word" &&
            node.groups[0].groups[0].value.startsWith("data:")))
      ) {
        return concat$6([
          node.open ? path$$1.call(print, "open") : "",
          join$4(",", path$$1.map(print, "groups")),
          node.close ? path$$1.call(print, "close") : ""
        ]);
      }

      if (!node.open) {
        const printed = path$$1.map(print, "groups");
        const res = [];

        for (let i = 0; i < printed.length; i++) {
          if (i !== 0) {
            res.push(concat$6([",", line$4]));
          }
          res.push(printed[i]);
        }
        return group$2(indent$4(fill$3(res)));
      }

      const declNode = path$$1.getParentNode(2);

      return group$2(
        concat$6([
          node.open ? path$$1.call(print, "open") : "",
          indent$4(
            concat$6([
              softline$3,
              join$4(
                concat$6([
                  ",",
                  declNode && isSCSSMap(declNode) ? hardline$5 : line$4
                ]),
                path$$1.map(print, "groups")
              )
            ])
          ),
          isSCSS(options.parser, options.originalText) &&
          node.groups.length > 1 &&
          options.trailingComma !== "none"
            ? ","
            : "",
          softline$3,
          node.close ? path$$1.call(print, "close") : ""
        ])
      );
    }
    case "value-value": {
      return path$$1.call(print, "group");
    }
    case "value-func": {
      const insideAtRuleSupportsNode = insideAtRuleNode(path$$1, "supports");
      const isKeyword =
        ["not", "and", "or"].indexOf(node.value.toLowerCase()) !== -1;

      return concat$6([
        node.value,
        insideAtRuleSupportsNode && isKeyword ? " " : "",
        path$$1.call(print, "group")
      ]);
    }
    case "value-paren": {
      return node.value;
    }
    case "value-number": {
      return concat$6([printNumber$1(node.value), maybeToLowerCase(node.unit)]);
    }
    case "value-operator": {
      return node.value;
    }
    case "value-word": {
      if ((node.isColor && node.isHex) || isWideKeywords(node.value)) {
        return node.value.toLowerCase();
      }
      return node.value;
    }
    case "value-colon": {
      return concat$6([
        node.value,
        insideValueFunctionNode(path$$1, "url") ? "" : line$4
      ]);
    }
    case "value-comma": {
      return concat$6([node.value, " "]);
    }
    case "value-string": {
      return util$1.printString(
        node.raws.quote + node.value + node.raws.quote,
        options
      );
    }
    case "value-atword": {
      return concat$6(["@", node.value]);
    }
    case "value-unicode-range": {
      return node.value;
    }
    default:
      /* istanbul ignore next */
      throw new Error(`Unknown postcss type ${JSON.stringify(node.type)}`);
  }
}

function printNodeSequence(path$$1, options, print) {
  const node = path$$1.getValue();
  const parts = [];
  let i = 0;
  path$$1.map(pathChild => {
    const prevNode = node.nodes[i - 1];
    if (
      prevNode &&
      prevNode.type === "css-comment" &&
      prevNode.text.trim() === "prettier-ignore"
    ) {
      const childNode = pathChild.getValue();
      parts.push(
        options.originalText.slice(
          options.locStart(childNode),
          options.locEnd(childNode)
        )
      );
    } else {
      parts.push(pathChild.call(print));
    }

    if (i !== node.nodes.length - 1) {
      if (
        (node.nodes[i + 1].type === "css-comment" &&
          !util$1.hasNewline(
            options.originalText,
            options.locStart(node.nodes[i + 1]),
            { backwards: true }
          )) ||
        (node.nodes[i + 1].type === "css-atrule" &&
          node.nodes[i + 1].name === "else" &&
          node.nodes[i].type !== "css-comment")
      ) {
        parts.push(" ");
      } else {
        parts.push(hardline$5);
        if (
          utilShared.isNextLineEmpty(
            options.originalText,
            pathChild.getValue(),
            options
          )
        ) {
          parts.push(hardline$5);
        }
      }
    }
    i++;
  }, "nodes");

  return concat$6(parts);
}

const STRING_REGEX = /(['"])(?:(?!\1)[^\\]|\\[\s\S])*\1/g;
const NUMBER_REGEX = /(?:\d*\.\d+|\d+\.?)(?:[eE][+-]?\d+)?/g;
const STANDARD_UNIT_REGEX = /[a-zA-Z]+/g;
const WORD_PART_REGEX = /[$@]?[a-zA-Z_\u0080-\uFFFF][\w\-\u0080-\uFFFF]*/g;
const ADJUST_NUMBERS_REGEX = RegExp(
  STRING_REGEX.source +
    `|` +
    `(${WORD_PART_REGEX.source})?` +
    `(${NUMBER_REGEX.source})` +
    `(${STANDARD_UNIT_REGEX.source})?`,
  "g"
);

function adjustStrings(value, options) {
  return value.replace(STRING_REGEX, match =>
    util$1.printString(match, options)
  );
}

function quoteAttributeValue(value, options) {
  const quote = options.singleQuote ? "'" : '"';
  return value.includes('"') || value.includes("'")
    ? value
    : quote + value + quote;
}

function adjustNumbers(value) {
  return value.replace(
    ADJUST_NUMBERS_REGEX,
    (match, quote, wordPart, number, unit) =>
      !wordPart && number
        ? (wordPart || "") + printNumber$1(number) + maybeToLowerCase(unit || "")
        : match
  );
}

function printNumber$1(rawNumber) {
  return (
    util$1
      .printNumber(rawNumber)
      // Remove trailing `.0`.
      .replace(/\.0(?=$|e)/, "")
  );
}

var printerPostcss = {
  print: genericPrint$2,
  hasPrettierIgnore: util$1.hasIgnoreComment,
  massageAstNode: clean_1$2
};

// format based on https://github.com/prettier/prettier/blob/master/src/main/core-options.js
var options$6 = {
  singleQuote: options$3.singleQuote
};

const lineColumnToIndex$1 = util$1.lineColumnToIndex;
const getLast$1 = util$1.getLast;

// Based on:
// https://github.com/github/linguist/blob/master/lib/linguist/languages.yml

const languages$1 = [
  {
    name: "CSS",
    since: "1.4.0",
    parsers: ["css"],
    group: "CSS",
    tmScope: "source.css",
    aceMode: "css",
    codemirrorMode: "css",
    codemirrorMimeType: "text/css",
    extensions: [".css", ".pcss", ".postcss"],
    liguistLanguageId: 50,
    vscodeLanguageIds: ["css", "postcss"]
  },
  {
    name: "Less",
    since: "1.4.0",
    parsers: ["less"],
    group: "CSS",
    extensions: [".less"],
    tmScope: "source.css.less",
    aceMode: "less",
    codemirrorMode: "css",
    codemirrorMimeType: "text/css",
    liguistLanguageId: 198,
    vscodeLanguageIds: ["less"]
  },
  {
    name: "SCSS",
    since: "1.4.0",
    parsers: ["scss"],
    group: "CSS",
    tmScope: "source.scss",
    aceMode: "scss",
    codemirrorMode: "css",
    codemirrorMimeType: "text/x-scss",
    extensions: [".scss"],
    liguistLanguageId: 329,
    vscodeLanguageIds: ["scss"]
  }
];

const postcss = {
  get parse() {
    return eval("require")("./parser-postcss");
  },
  astFormat: "postcss",
  locEnd: function(node) {
    const endNode = node.nodes && getLast$1(node.nodes);
    if (endNode && node.source && !node.source.end) {
      node = endNode;
    }
    if (node.source) {
      return lineColumnToIndex$1(node.source.end, node.source.input.css);
    }
    return null;
  },
  locStart: function(node) {
    if (node.source) {
      return lineColumnToIndex$1(node.source.start, node.source.input.css) - 1;
    }
    return null;
  }
};

// TODO: switch these to just `postcss` and use `language` instead.
const parsers$1 = {
  css: postcss,
  less: postcss,
  scss: postcss
};

const printers$1 = {
  postcss: printerPostcss
};

var languageCss = {
  languages: languages$1,
  options: options$6,
  parsers: parsers$1,
  printers: printers$1
};

const concat$7 = docBuilders$2.concat;
const join$5 = docBuilders$2.join;
const softline$4 = docBuilders$2.softline;
const hardline$6 = docBuilders$2.hardline;
const line$5 = docBuilders$2.line;
const group$3 = docBuilders$2.group;
const indent$5 = docBuilders$2.indent;
const ifBreak$2 = docBuilders$2.ifBreak;

// http://w3c.github.io/html/single-page.html#void-elements
const voidTags = [
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr"
];

// Formatter based on @glimmerjs/syntax's built-in test formatter:
// https://github.com/glimmerjs/glimmer-vm/blob/master/packages/%40glimmer/syntax/lib/generation/print.ts

function print(path$$1, options, print) {
  const n = path$$1.getValue();

  /* istanbul ignore if*/
  if (!n) {
    return "";
  }

  switch (n.type) {
    case "Program": {
      return group$3(
        join$5(softline$4, path$$1.map(print, "body").filter(text => text !== ""))
      );
    }
    case "ElementNode": {
      const isVoid = voidTags.indexOf(n.tag) !== -1;
      const closeTag = isVoid ? concat$7([" />", softline$4]) : ">";
      const hasChildren = n.children.length > 0;
      const getParams = (path$$1, print) =>
        indent$5(
          concat$7([
            n.attributes.length ? line$5 : "",
            join$5(line$5, path$$1.map(print, "attributes")),

            n.modifiers.length ? line$5 : "",
            join$5(line$5, path$$1.map(print, "modifiers")),

            n.comments.length ? line$5 : "",
            join$5(line$5, path$$1.map(print, "comments"))
          ])
        );

      // The problem here is that I want to not break at all if the children
      // would not break but I need to force an indent, so I use a hardline.
      /**
       * What happens now:
       * <div>
       *   Hello
       * </div>
       * ==>
       * <div>Hello</div>
       * This is due to me using hasChildren to decide to put the hardline in.
       * I would rather use a {DOES THE WHOLE THING NEED TO BREAK}
       */
      return concat$7([
        group$3(
          concat$7([
            "<",
            n.tag,
            getParams(path$$1, print),
            ifBreak$2(softline$4, ""),
            closeTag
          ])
        ),
        group$3(
          concat$7([
            indent$5(join$5(softline$4, [""].concat(path$$1.map(print, "children")))),
            ifBreak$2(hasChildren ? hardline$6 : "", ""),
            !isVoid ? concat$7(["</", n.tag, ">"]) : ""
          ])
        )
      ]);
    }
    case "BlockStatement": {
      const pp = path$$1.getParentNode(1);
      const isElseIf =
        pp &&
        pp.inverse &&
        pp.inverse.body[0] === n &&
        pp.inverse.body[0].path.parts[0] === "if";
      const hasElseIf =
        n.inverse &&
        n.inverse.body[0] &&
        n.inverse.body[0].type === "BlockStatement" &&
        n.inverse.body[0].path.parts[0] === "if";
      const indentElse = hasElseIf ? a => a : indent$5;
      if (n.inverse) {
        return concat$7([
          isElseIf
            ? concat$7(["{{else ", printPathParams(path$$1, print), "}}"])
            : printOpenBlock(path$$1, print),
          indent$5(concat$7([hardline$6, path$$1.call(print, "program")])),
          n.inverse && !hasElseIf ? concat$7([hardline$6, "{{else}}"]) : "",
          n.inverse
            ? indentElse(concat$7([hardline$6, path$$1.call(print, "inverse")]))
            : "",
          isElseIf ? "" : concat$7([hardline$6, printCloseBlock(path$$1, print)])
        ]);
      } else if (isElseIf) {
        return concat$7([
          concat$7(["{{else ", printPathParams(path$$1, print), "}}"]),
          indent$5(concat$7([hardline$6, path$$1.call(print, "program")]))
        ]);
      }
      /**
       * I want this boolean to be: if params are going to cause a break,
       * not that it has params.
       */
      const hasParams = n.params.length > 0 || n.hash.pairs.length > 0;
      const hasChildren = n.program.body.length > 0;
      return concat$7([
        printOpenBlock(path$$1, print),
        group$3(
          concat$7([
            indent$5(concat$7([softline$4, path$$1.call(print, "program")])),
            hasParams && hasChildren ? hardline$6 : "",
            printCloseBlock(path$$1, print)
          ])
        )
      ]);
    }
    case "ElementModifierStatement":
    case "MustacheStatement": {
      const pp = path$$1.getParentNode(1);
      const isConcat = pp && pp.type === "ConcatStatement";
      return group$3(
        concat$7([
          /*n.escaped ? "{{{" : */ "{{",
          printPathParams(path$$1, print),
          isConcat ? "" : softline$4,
          /*.escaped ? "}}}" :*/ "}}"
        ])
      );
    }
    case "SubExpression": {
      return group$3(
        concat$7([
          "(",
          printPath(path$$1, print),
          indent$5(concat$7([line$5, group$3(join$5(line$5, getParams(path$$1, print)))])),
          softline$4,
          ")"
        ])
      );
    }
    case "AttrNode": {
      const quote = n.value.type === "TextNode" ? '"' : "";
      return concat$7([n.name, "=", quote, path$$1.call(print, "value"), quote]);
    }
    case "ConcatStatement": {
      return concat$7([
        '"',
        group$3(
          indent$5(
            join$5(
              softline$4,
              path$$1
                .map(partPath => print(partPath), "parts")
                .filter(a => a !== "")
            )
          )
        ),
        '"'
      ]);
    }
    case "Hash": {
      return concat$7([join$5(line$5, path$$1.map(print, "pairs"))]);
    }
    case "HashPair": {
      return concat$7([n.key, "=", path$$1.call(print, "value")]);
    }
    case "TextNode": {
      let leadingSpace = "";
      let trailingSpace = "";

      // preserve a space inside of an attribute node where whitespace present, when next to mustache statement.
      const inAttrNode = path$$1.stack.indexOf("attributes") >= 0;

      if (inAttrNode) {
        const parentNode = path$$1.getParentNode(0);
        const isConcat = parentNode.type === "ConcatStatement";
        if (isConcat) {
          const parts = parentNode.parts;
          const partIndex = parts.indexOf(n);
          if (partIndex > 0) {
            const partType = parts[partIndex - 1].type;
            const isMustache = partType === "MustacheStatement";
            if (isMustache) {
              leadingSpace = " ";
            }
          }
          if (partIndex < parts.length - 1) {
            const partType = parts[partIndex + 1].type;
            const isMustache = partType === "MustacheStatement";
            if (isMustache) {
              trailingSpace = " ";
            }
          }
        }
      }
      return n.chars
        .replace(/^\s+/, leadingSpace)
        .replace(/\s+$/, trailingSpace);
    }
    case "MustacheCommentStatement": {
      const dashes = n.value.indexOf("}}") > -1 ? "--" : "";
      return concat$7(["{{!", dashes, n.value, dashes, "}}"]);
    }
    case "PathExpression": {
      return n.original;
    }
    case "BooleanLiteral": {
      return String(n.value);
    }
    case "CommentStatement": {
      return concat$7(["<!--", n.value, "-->"]);
    }
    case "StringLiteral": {
      return `"${n.value}"`;
    }
    case "NumberLiteral": {
      return String(n.value);
    }
    case "UndefinedLiteral": {
      return "undefined";
    }
    case "NullLiteral": {
      return "null";
    }

    /* istanbul ignore next */
    default:
      throw new Error("unknown glimmer type: " + JSON.stringify(n.type));
  }
}

function printPath(path$$1, print) {
  return path$$1.call(print, "path");
}

function getParams(path$$1, print) {
  const node = path$$1.getValue();
  let parts = [];

  if (node.params.length > 0) {
    parts = parts.concat(path$$1.map(print, "params"));
  }

  if (node.hash && node.hash.pairs.length > 0) {
    parts.push(path$$1.call(print, "hash"));
  }
  return parts;
}

function printPathParams(path$$1, print) {
  let parts = [];

  parts.push(printPath(path$$1, print));
  parts = parts.concat(getParams(path$$1, print));

  return indent$5(group$3(join$5(line$5, parts)));
}

function printBlockParams(path$$1) {
  const block = path$$1.getValue();
  if (!block.program || !block.program.blockParams.length) {
    return "";
  }
  return concat$7([" as |", block.program.blockParams.join(" "), "|"]);
}

function printOpenBlock(path$$1, print) {
  return group$3(
    concat$7([
      "{{#",
      printPathParams(path$$1, print),
      printBlockParams(path$$1, print),
      softline$4,
      "}}"
    ])
  );
}

function printCloseBlock(path$$1, print) {
  return concat$7(["{{/", path$$1.call(print, "path"), "}}"]);
}

function clean$4(ast, newObj) {
  // (Glimmer/HTML) ignore TextNode whitespace
  if (ast.type === "TextNode") {
    if (ast.chars.replace(/\s+/, "") === "") {
      return null;
    }
    newObj.chars = ast.chars.replace(/^\s+/, "").replace(/\s+$/, "");
  }
}

var printerGlimmer = {
  print,
  massageAstNode: clean$4
};

// Based on:
// https://github.com/github/linguist/blob/master/lib/linguist/languages.yml

const languages$2 = [
  {
    type: "markup",
    group: "HTML",
    aliases: ["hbs", "htmlbars"],
    extensions: [".handlebars", ".hbs"],
    tm_scope: "text.html.handlebars",
    ace_mode: "handlebars",
    language_id: 155,
    since: null // unreleased
  }
];

const parsers$2 = {
  glimmer: {
    get parse() {
      return eval("require")("./parser-glimmer");
    },
    astFormat: "glimmer",
    locEnd: function(node) {
      return node.loc && node.loc.end;
    },
    locStart: function(node) {
      return node.loc && node.loc.start;
    }
  }
};

const printers$2 = {
  glimmer: printerGlimmer
};

var languageHandlebars = {
  languages: languages$2,
  parsers: parsers$2,
  printers: printers$2
};

const docBuilders$8 = doc.builders;
const concat$8 = docBuilders$8.concat;
const join$6 = docBuilders$8.join;
const hardline$7 = docBuilders$8.hardline;
const line$6 = docBuilders$8.line;
const softline$5 = docBuilders$8.softline;
const group$4 = docBuilders$8.group;
const indent$6 = docBuilders$8.indent;
const ifBreak$3 = docBuilders$8.ifBreak;



function genericPrint$3(path$$1, options, print) {
  const n = path$$1.getValue();
  if (!n) {
    return "";
  }

  if (typeof n === "string") {
    return n;
  }

  switch (n.kind) {
    case "Document": {
      return concat$8([
        join$6(concat$8([hardline$7, hardline$7]), path$$1.map(print, "definitions")),
        hardline$7
      ]);
    }
    case "OperationDefinition": {
      const hasOperation = options.originalText[options.locStart(n)] !== "{";
      const hasName = !!n.name;
      return concat$8([
        hasOperation ? n.operation : "",
        hasOperation && hasName ? concat$8([" ", path$$1.call(print, "name")]) : "",
        n.variableDefinitions && n.variableDefinitions.length
          ? group$4(
              concat$8([
                "(",
                indent$6(
                  concat$8([
                    softline$5,
                    join$6(
                      concat$8([ifBreak$3("", ", "), softline$5]),
                      path$$1.map(print, "variableDefinitions")
                    )
                  ])
                ),
                softline$5,
                ")"
              ])
            )
          : "",
        printDirectives(path$$1, print, n),
        n.selectionSet ? (!hasOperation && !hasName ? "" : " ") : "",
        path$$1.call(print, "selectionSet")
      ]);
    }
    case "FragmentDefinition": {
      return concat$8([
        "fragment ",
        path$$1.call(print, "name"),
        " on ",
        path$$1.call(print, "typeCondition"),
        printDirectives(path$$1, print, n),
        " ",
        path$$1.call(print, "selectionSet")
      ]);
    }
    case "SelectionSet": {
      return concat$8([
        "{",
        indent$6(
          concat$8([
            hardline$7,
            join$6(
              hardline$7,
              path$$1.call(
                selectionsPath => printSequence(selectionsPath, options, print),
                "selections"
              )
            )
          ])
        ),
        hardline$7,
        "}"
      ]);
    }
    case "Field": {
      return group$4(
        concat$8([
          n.alias ? concat$8([path$$1.call(print, "alias"), ": "]) : "",
          path$$1.call(print, "name"),
          n.arguments.length > 0
            ? group$4(
                concat$8([
                  "(",
                  indent$6(
                    concat$8([
                      softline$5,
                      join$6(
                        concat$8([ifBreak$3("", ", "), softline$5]),
                        path$$1.call(
                          argsPath => printSequence(argsPath, options, print),
                          "arguments"
                        )
                      )
                    ])
                  ),
                  softline$5,
                  ")"
                ])
              )
            : "",
          printDirectives(path$$1, print, n),
          n.selectionSet ? " " : "",
          path$$1.call(print, "selectionSet")
        ])
      );
    }
    case "Name": {
      return n.value;
    }
    case "StringValue": {
      if (n.block) {
        return concat$8([
          '"""',
          hardline$7,
          join$6(hardline$7, n.value.replace(/"""/g, "\\$&").split("\n")),
          hardline$7,
          '"""'
        ]);
      }
      return concat$8(['"', n.value.replace(/["\\]/g, "\\$&"), '"']);
    }
    case "IntValue":
    case "FloatValue":
    case "EnumValue": {
      return n.value;
    }
    case "BooleanValue": {
      return n.value ? "true" : "false";
    }
    case "NullValue": {
      return "null";
    }
    case "Variable": {
      return concat$8(["$", path$$1.call(print, "name")]);
    }
    case "ListValue": {
      return group$4(
        concat$8([
          "[",
          indent$6(
            concat$8([
              softline$5,
              join$6(
                concat$8([ifBreak$3("", ", "), softline$5]),
                path$$1.map(print, "values")
              )
            ])
          ),
          softline$5,
          "]"
        ])
      );
    }
    case "ObjectValue": {
      return group$4(
        concat$8([
          "{",
          options.bracketSpacing && n.fields.length > 0 ? " " : "",
          indent$6(
            concat$8([
              softline$5,
              join$6(
                concat$8([ifBreak$3("", ", "), softline$5]),
                path$$1.map(print, "fields")
              )
            ])
          ),
          softline$5,
          ifBreak$3("", options.bracketSpacing && n.fields.length > 0 ? " " : ""),
          "}"
        ])
      );
    }
    case "ObjectField":
    case "Argument": {
      return concat$8([
        path$$1.call(print, "name"),
        ": ",
        path$$1.call(print, "value")
      ]);
    }

    case "Directive": {
      return concat$8([
        "@",
        path$$1.call(print, "name"),
        n.arguments.length > 0
          ? group$4(
              concat$8([
                "(",
                indent$6(
                  concat$8([
                    softline$5,
                    join$6(
                      concat$8([ifBreak$3("", ", "), softline$5]),
                      path$$1.call(
                        argsPath => printSequence(argsPath, options, print),
                        "arguments"
                      )
                    )
                  ])
                ),
                softline$5,
                ")"
              ])
            )
          : ""
      ]);
    }

    case "NamedType": {
      return path$$1.call(print, "name");
    }

    case "VariableDefinition": {
      return concat$8([
        path$$1.call(print, "variable"),
        ": ",
        path$$1.call(print, "type"),
        n.defaultValue ? concat$8([" = ", path$$1.call(print, "defaultValue")]) : ""
      ]);
    }

    case "TypeExtensionDefinition": {
      return concat$8(["extend ", path$$1.call(print, "definition")]);
    }

    case "ObjectTypeExtension":
    case "ObjectTypeDefinition": {
      return concat$8([
        path$$1.call(print, "description"),
        n.description ? hardline$7 : "",
        n.kind === "ObjectTypeExtension" ? "extend " : "",
        "type ",
        path$$1.call(print, "name"),
        n.interfaces.length > 0
          ? concat$8([
              " implements ",
              join$6(
                determineInterfaceSeparator(
                  options.originalText.substr(
                    options.locStart(n),
                    options.locEnd(n)
                  )
                ),
                path$$1.map(print, "interfaces")
              )
            ])
          : "",
        printDirectives(path$$1, print, n),
        n.fields.length > 0
          ? concat$8([
              " {",
              indent$6(
                concat$8([
                  hardline$7,
                  join$6(
                    hardline$7,
                    path$$1.call(
                      fieldsPath => printSequence(fieldsPath, options, print),
                      "fields"
                    )
                  )
                ])
              ),
              hardline$7,
              "}"
            ])
          : ""
      ]);
    }

    case "FieldDefinition": {
      return concat$8([
        path$$1.call(print, "description"),
        n.description ? hardline$7 : "",
        path$$1.call(print, "name"),
        n.arguments.length > 0
          ? group$4(
              concat$8([
                "(",
                indent$6(
                  concat$8([
                    softline$5,
                    join$6(
                      concat$8([ifBreak$3("", ", "), softline$5]),
                      path$$1.call(
                        argsPath => printSequence(argsPath, options, print),
                        "arguments"
                      )
                    )
                  ])
                ),
                softline$5,
                ")"
              ])
            )
          : "",
        ": ",
        path$$1.call(print, "type"),
        printDirectives(path$$1, print, n)
      ]);
    }

    case "DirectiveDefinition": {
      return concat$8([
        path$$1.call(print, "description"),
        n.description ? hardline$7 : "",
        "directive ",
        "@",
        path$$1.call(print, "name"),
        n.arguments.length > 0
          ? group$4(
              concat$8([
                "(",
                indent$6(
                  concat$8([
                    softline$5,
                    join$6(
                      concat$8([ifBreak$3("", ", "), softline$5]),
                      path$$1.call(
                        argsPath => printSequence(argsPath, options, print),
                        "arguments"
                      )
                    )
                  ])
                ),
                softline$5,
                ")"
              ])
            )
          : "",
        concat$8([" on ", join$6(" | ", path$$1.map(print, "locations"))])
      ]);
    }

    case "EnumTypeExtension":
    case "EnumTypeDefinition": {
      return concat$8([
        path$$1.call(print, "description"),
        n.description ? hardline$7 : "",
        n.kind === "EnumTypeExtension" ? "extend " : "",
        "enum ",
        path$$1.call(print, "name"),
        printDirectives(path$$1, print, n),

        n.values.length > 0
          ? concat$8([
              " {",
              indent$6(
                concat$8([
                  hardline$7,
                  join$6(
                    hardline$7,
                    path$$1.call(
                      valuesPath => printSequence(valuesPath, options, print),
                      "values"
                    )
                  )
                ])
              ),
              hardline$7,
              "}"
            ])
          : ""
      ]);
    }

    case "EnumValueDefinition": {
      return concat$8([
        path$$1.call(print, "description"),
        n.description ? hardline$7 : "",
        path$$1.call(print, "name"),
        printDirectives(path$$1, print, n)
      ]);
    }

    case "InputValueDefinition": {
      return concat$8([
        path$$1.call(print, "description"),
        n.description ? (n.description.block ? hardline$7 : line$6) : "",
        path$$1.call(print, "name"),
        ": ",
        path$$1.call(print, "type"),
        n.defaultValue ? concat$8([" = ", path$$1.call(print, "defaultValue")]) : "",
        printDirectives(path$$1, print, n)
      ]);
    }

    case "InputObjectTypeExtension":
    case "InputObjectTypeDefinition": {
      return concat$8([
        path$$1.call(print, "description"),
        n.description ? hardline$7 : "",
        n.kind === "InputObjectTypeExtension" ? "extend " : "",
        "input ",
        path$$1.call(print, "name"),
        printDirectives(path$$1, print, n),
        n.fields.length > 0
          ? concat$8([
              " {",
              indent$6(
                concat$8([
                  hardline$7,
                  join$6(
                    hardline$7,
                    path$$1.call(
                      fieldsPath => printSequence(fieldsPath, options, print),
                      "fields"
                    )
                  )
                ])
              ),
              hardline$7,
              "}"
            ])
          : ""
      ]);
    }

    case "SchemaDefinition": {
      return concat$8([
        "schema",
        printDirectives(path$$1, print, n),
        " {",
        n.operationTypes.length > 0
          ? indent$6(
              concat$8([
                hardline$7,
                join$6(
                  hardline$7,
                  path$$1.call(
                    opsPath => printSequence(opsPath, options, print),
                    "operationTypes"
                  )
                )
              ])
            )
          : "",
        hardline$7,
        "}"
      ]);
    }

    case "OperationTypeDefinition": {
      return concat$8([
        path$$1.call(print, "operation"),
        ": ",
        path$$1.call(print, "type")
      ]);
    }

    case "InterfaceTypeExtension":
    case "InterfaceTypeDefinition": {
      return concat$8([
        path$$1.call(print, "description"),
        n.description ? hardline$7 : "",
        n.kind === "InterfaceTypeExtension" ? "extend " : "",
        "interface ",
        path$$1.call(print, "name"),
        printDirectives(path$$1, print, n),

        n.fields.length > 0
          ? concat$8([
              " {",
              indent$6(
                concat$8([
                  hardline$7,
                  join$6(
                    hardline$7,
                    path$$1.call(
                      fieldsPath => printSequence(fieldsPath, options, print),
                      "fields"
                    )
                  )
                ])
              ),
              hardline$7,
              "}"
            ])
          : ""
      ]);
    }

    case "FragmentSpread": {
      return concat$8([
        "...",
        path$$1.call(print, "name"),
        printDirectives(path$$1, print, n)
      ]);
    }

    case "InlineFragment": {
      return concat$8([
        "...",
        n.typeCondition
          ? concat$8([" on ", path$$1.call(print, "typeCondition")])
          : "",
        printDirectives(path$$1, print, n),
        " ",
        path$$1.call(print, "selectionSet")
      ]);
    }

    case "UnionTypeExtension":
    case "UnionTypeDefinition": {
      return group$4(
        concat$8([
          path$$1.call(print, "description"),
          n.description ? hardline$7 : "",
          group$4(
            concat$8([
              n.kind === "UnionTypeExtension" ? "extend " : "",
              "union ",
              path$$1.call(print, "name"),
              printDirectives(path$$1, print, n),
              n.types.length > 0
                ? concat$8([
                    " =",
                    ifBreak$3("", " "),
                    indent$6(
                      concat$8([
                        ifBreak$3(concat$8([line$6, "  "])),
                        join$6(concat$8([line$6, "| "]), path$$1.map(print, "types"))
                      ])
                    )
                  ])
                : ""
            ])
          )
        ])
      );
    }

    case "ScalarTypeExtension":
    case "ScalarTypeDefinition": {
      return concat$8([
        path$$1.call(print, "description"),
        n.description ? hardline$7 : "",
        n.kind === "ScalarTypeExtension" ? "extend " : "",
        "scalar ",
        path$$1.call(print, "name"),
        printDirectives(path$$1, print, n)
      ]);
    }

    case "NonNullType": {
      return concat$8([path$$1.call(print, "type"), "!"]);
    }

    case "ListType": {
      return concat$8(["[", path$$1.call(print, "type"), "]"]);
    }

    default:
      /* istanbul ignore next */
      throw new Error("unknown graphql type: " + JSON.stringify(n.kind));
  }
}

function printDirectives(path$$1, print, n) {
  if (n.directives.length === 0) {
    return "";
  }

  return concat$8([
    " ",
    group$4(
      indent$6(
        concat$8([
          softline$5,
          join$6(
            concat$8([ifBreak$3("", " "), softline$5]),
            path$$1.map(print, "directives")
          )
        ])
      )
    )
  ]);
}

function printSequence(sequencePath, options, print) {
  const count = sequencePath.getValue().length;

  return sequencePath.map((path$$1, i) => {
    const printed = print(path$$1);

    if (
      utilShared.isNextLineEmpty(
        options.originalText,
        path$$1.getValue(),
        options
      ) &&
      i < count - 1
    ) {
      return concat$8([printed, hardline$7]);
    }

    return printed;
  });
}

function canAttachComment$1(node) {
  return node.kind && node.kind !== "Comment";
}

function printComment$2(commentPath) {
  const comment = commentPath.getValue();

  switch (comment.kind) {
    case "Comment":
      return "#" + comment.value.trimRight();
    default:
      throw new Error("Not a comment: " + JSON.stringify(comment));
  }
}

function determineInterfaceSeparator(originalSource) {
  const start = originalSource.indexOf("implements");
  if (start === -1) {
    throw new Error("Must implement interfaces: " + originalSource);
  }
  let end = originalSource.indexOf("{");
  if (end === -1) {
    end = originalSource.length;
  }
  return originalSource.substr(start, end).includes("&") ? " & " : ", ";
}

var printerGraphql = {
  print: genericPrint$3,
  hasPrettierIgnore: util$1.hasIgnoreComment,
  printComment: printComment$2,
  canAttachComment: canAttachComment$1
};

// format based on https://github.com/prettier/prettier/blob/master/src/main/core-options.js
var options$9 = {
  bracketSpacing: options$3.bracketSpacing
};

// Based on:
// https://github.com/github/linguist/blob/master/lib/linguist/languages.yml

const languages$3 = [
  {
    name: "GraphQL",
    since: "1.5.0",
    parsers: ["graphql"],
    extensions: [".graphql", ".gql"],
    tmScope: "source.graphql",
    aceMode: "text",
    liguistLanguageId: 139,
    vscodeLanguageIds: ["graphql"]
  }
];

const parsers$3 = {
  graphql: {
    get parse() {
      return eval("require")("./parser-graphql");
    },
    astFormat: "graphql",
    locStart: function(node) {
      if (typeof node.start === "number") {
        return node.start;
      }
      return node.loc && node.loc.start;
    },
    locEnd: function(node) {
      if (typeof node.end === "number") {
        return node.end;
      }
      return node.loc && node.loc.end;
    }
  }
};

const printers$3 = {
  graphql: printerGraphql
};

var languageGraphql = {
  languages: languages$3,
  options: options$9,
  parsers: parsers$3,
  printers: printers$3
};

const docBuilders$10 = doc.builders;
const hardline$9 = docBuilders$10.hardline;
const literalline$3 = docBuilders$10.literalline;
const concat$10 = docBuilders$10.concat;
const markAsRoot$1 = docBuilders$10.markAsRoot;

function embed$2(path$$1, print, textToDoc, options) {
  const node = path$$1.getValue();

  if (node.type === "code" && node.lang !== null) {
    // only look for the first string so as to support [markdown-preview-enhanced](https://shd101wyy.github.io/markdown-preview-enhanced/#/code-chunk)
    const lang = node.lang.split(/\s/, 1)[0];
    const parser = getParserName(lang);
    if (parser) {
      const styleUnit = options.__inJsTemplate ? "~" : "`";
      const style = styleUnit.repeat(
        Math.max(3, util$1.getMaxContinuousCount(node.value, styleUnit) + 1)
      );
      const doc$$2 = textToDoc(node.value, { parser });
      return markAsRoot$1(
        concat$10([
          style,
          node.lang,
          hardline$9,
          replaceNewlinesWithLiterallines(doc$$2),
          style
        ])
      );
    }
  }

  return null;

  function getParserName(lang) {
    const supportInfo = support.getSupportInfo(null, {
      plugins: options.plugins
    });
    const language = supportInfo.languages.find(
      language =>
        language.name.toLowerCase() === lang ||
        (language.extensions &&
          language.extensions.find(ext => ext.substring(1) === lang))
    );
    if (language) {
      return language.parsers[0];
    }

    return null;
  }

  function replaceNewlinesWithLiterallines(doc$$2) {
    return docUtils$1.mapDoc(
      doc$$2,
      currentDoc =>
        typeof currentDoc === "string" && currentDoc.includes("\n")
          ? concat$10(
              currentDoc
                .split(/(\n)/g)
                .map((v, i) => (i % 2 === 0 ? v : literalline$3))
            )
          : currentDoc
    );
  }
}

var embed_1$2 = embed$2;

var pragma$2 = createCommonjsModule(function (module) {
"use strict";

const pragmas = ["format", "prettier"];

function startWithPragma(text) {
  const pragma = `@(${pragmas.join("|")})`;
  const regex = new RegExp(
    [
      `<!--\\s*${pragma}\\s*-->`,
      `<!--.*\n[\\s\\S]*(^|\n)[^\\S\n]*${pragma}[^\\S\n]*($|\n)[\\s\\S]*\n.*-->`
    ].join("|"),
    "m"
  );
  const matched = text.match(regex);
  return matched && matched.index === 0;
}

function extract(text) {
  // yaml (---) and toml (+++)
  const matched = text.match(
    /^((---|\+\+\+)(?:\n[\s\S]*?\n|\n)\2(?:\n|$))?([\s\S]*)/
  );
  const frontMatter = matched[1];
  const mainContent = matched[3];
  return { frontMatter, mainContent };
}

module.exports = {
  startWithPragma,
  hasPragma: text => startWithPragma(extract(text).mainContent.trimLeft()),
  insertPragma: text => {
    const extracted = extract(text);
    const pragma = `<!-- @${pragmas[0]} -->`;
    return extracted.frontMatter
      ? `${extracted.frontMatter}\n\n${pragma}\n\n${extracted.mainContent}`
      : `${pragma}\n\n${extracted.mainContent}`;
  }
};
});

const docBuilders$9 = doc.builders;
const concat$9 = docBuilders$9.concat;
const join$7 = docBuilders$9.join;
const line$7 = docBuilders$9.line;
const hardline$8 = docBuilders$9.hardline;
const softline$6 = docBuilders$9.softline;
const fill$4 = docBuilders$9.fill;
const align$2 = docBuilders$9.align;
const group$5 = docBuilders$9.group;
const printDocToString$3 = doc.printer.printDocToString;

const SINGLE_LINE_NODE_TYPES = ["heading", "tableCell", "link"];

const SIBLING_NODE_TYPES = ["listItem", "definition", "footnoteDefinition"];

const INLINE_NODE_TYPES = [
  "inlineCode",
  "emphasis",
  "strong",
  "delete",
  "link",
  "linkReference",
  "image",
  "imageReference",
  "footnote",
  "footnoteReference",
  "sentence",
  "whitespace",
  "word",
  "break"
];

const INLINE_NODE_WRAPPER_TYPES = INLINE_NODE_TYPES.concat([
  "tableCell",
  "paragraph",
  "heading"
]);

function genericPrint$4(path$$1, options, print) {
  const node = path$$1.getValue();

  if (shouldRemainTheSameContent(path$$1)) {
    return concat$9(
      util$1
        .splitText(
          options.originalText.slice(
            node.position.start.offset,
            node.position.end.offset
          )
        )
        .map(
          node =>
            node.type === "word"
              ? node.value
              : node.value === ""
                ? ""
                : printLine(path$$1, node.value, options)
        )
    );
  }

  switch (node.type) {
    case "root":
      if (node.children.length === 0) {
        return "";
      }
      return concat$9([normalizeDoc(printRoot(path$$1, options, print)), hardline$8]);
    case "paragraph":
      return printChildren(path$$1, options, print, {
        postprocessor: fill$4
      });
    case "sentence":
      return printChildren(path$$1, options, print);
    case "word":
      return node.value
        .replace(/[*]/g, "\\*") // escape all `*`
        .replace(
          new RegExp(
            [
              `(^|[${util$1.punctuationCharRange}])(_+)`,
              `(_+)([${util$1.punctuationCharRange}]|$)`
            ].join("|"),
            "g"
          ),
          (_, text1, underscore1, underscore2, text2) =>
            (underscore1
              ? `${text1}${underscore1}`
              : `${underscore2}${text2}`
            ).replace(/_/g, "\\_")
        ); // escape all `_` except concating with non-punctuation, e.g. `1_2_3` is not considered emphasis
    case "whitespace": {
      const parentNode = path$$1.getParentNode();
      const index = parentNode.children.indexOf(node);
      const nextNode = parentNode.children[index + 1];

      const proseWrap =
        // leading char that may cause different syntax
        nextNode && /^>|^([-+*]|#{1,6}|[0-9]+[.)])$/.test(nextNode.value)
          ? "never"
          : options.proseWrap;

      return printLine(path$$1, node.value, { proseWrap });
    }
    case "emphasis": {
      const parentNode = path$$1.getParentNode();
      const index = parentNode.children.indexOf(node);
      const prevNode = parentNode.children[index - 1];
      const nextNode = parentNode.children[index + 1];
      const hasPrevOrNextWord = // `1*2*3` is considered emphais but `1_2_3` is not
        (prevNode &&
          prevNode.type === "sentence" &&
          prevNode.children.length > 0 &&
          util$1.getLast(prevNode.children).type === "word" &&
          !util$1.getLast(prevNode.children).hasTrailingPunctuation) ||
        (nextNode &&
          nextNode.type === "sentence" &&
          nextNode.children.length > 0 &&
          nextNode.children[0].type === "word" &&
          !nextNode.children[0].hasLeadingPunctuation);
      const style =
        hasPrevOrNextWord || getAncestorNode$2(path$$1, "emphasis") ? "*" : "_";
      return concat$9([style, printChildren(path$$1, options, print), style]);
    }
    case "strong":
      return concat$9(["**", printChildren(path$$1, options, print), "**"]);
    case "delete":
      return concat$9(["~~", printChildren(path$$1, options, print), "~~"]);
    case "inlineCode": {
      const backtickCount = util$1.getMaxContinuousCount(node.value, "`");
      const style = backtickCount === 1 ? "``" : "`";
      const gap = backtickCount ? " " : "";
      return concat$9([style, gap, node.value, gap, style]);
    }
    case "link":
      switch (options.originalText[node.position.start.offset]) {
        case "<":
          return concat$9(["<", node.url, ">"]);
        case "[":
          return concat$9([
            "[",
            printChildren(path$$1, options, print),
            "](",
            printUrl(node.url, ")"),
            printTitle(node.title, options),
            ")"
          ]);
        default:
          return options.originalText.slice(
            node.position.start.offset,
            node.position.end.offset
          );
      }
    case "image":
      return concat$9([
        "![",
        node.alt || "",
        "](",
        printUrl(node.url, ")"),
        printTitle(node.title, options),
        ")"
      ]);
    case "blockquote":
      return concat$9(["> ", align$2("> ", printChildren(path$$1, options, print))]);
    case "heading":
      return concat$9([
        "#".repeat(node.depth) + " ",
        printChildren(path$$1, options, print)
      ]);
    case "code": {
      if (
        // the first char may point to `\n`, e.g. `\n\t\tbar`, just ignore it
        /^\n?( {4,}|\t)/.test(
          options.originalText.slice(
            node.position.start.offset,
            node.position.end.offset
          )
        )
      ) {
        // indented code block
        const alignment = " ".repeat(4);
        return align$2(
          alignment,
          concat$9([alignment, join$7(hardline$8, node.value.split("\n"))])
        );
      }

      // fenced code block
      const styleUnit = options.__inJsTemplate ? "~" : "`";
      const style = styleUnit.repeat(
        Math.max(
          3,
          util$1.getMaxContinuousCount(node.value, styleUnit) + 1
        )
      );
      return concat$9([
        style,
        node.lang || "",
        hardline$8,
        join$7(hardline$8, node.value.split("\n")),
        hardline$8,
        style
      ]);
    }
    case "yaml":
    case "toml": {
      const style = node.type === "yaml" ? "---" : "+++";
      return node.value
        ? concat$9([style, hardline$8, node.value, hardline$8, style])
        : concat$9([style, hardline$8, style]);
    }
    case "html": {
      const parentNode = path$$1.getParentNode();
      return replaceNewlinesWithHardlines(
        parentNode.type === "root" &&
        util$1.getLast(parentNode.children) === node
          ? node.value.trimRight()
          : node.value
      );
    }
    case "list": {
      const nthSiblingIndex = getNthListSiblingIndex(
        node,
        path$$1.getParentNode()
      );

      const isGitDiffFriendlyOrderedList =
        node.ordered &&
        node.children.length > 1 &&
        /^\s*1(\.|\))/.test(
          options.originalText.slice(
            node.children[1].position.start.offset,
            node.children[1].position.end.offset
          )
        );

      return printChildren(path$$1, options, print, {
        processor: (childPath, index) => {
          const prefix = getPrefix();
          return concat$9([
            prefix,
            align$2(
              " ".repeat(prefix.length),
              printListItem(childPath, options, print, prefix)
            )
          ]);

          function getPrefix() {
            const rawPrefix = node.ordered
              ? (index === 0
                  ? node.start
                  : isGitDiffFriendlyOrderedList
                    ? 1
                    : node.start + index) +
                (nthSiblingIndex % 2 === 0 ? ". " : ") ")
              : nthSiblingIndex % 2 === 0
                ? "- "
                : "* ";

            // do not print trailing spaces for empty list item since it might be treated as `break` node
            // by [doc-printer](https://github.com/prettier/prettier/blob/1.10.2/src/doc/doc-printer.js#L395-L405),
            // we don't want to preserve unnecessary trailing spaces.
            const listItem = childPath.getValue();
            return listItem.children.length
              ? alignListPrefix(rawPrefix, options)
              : rawPrefix;
          }
        }
      });
    }
    case "thematicBreak": {
      const counter = getAncestorCounter$1(path$$1, "list");
      if (counter === -1) {
        return "---";
      }
      const nthSiblingIndex = getNthListSiblingIndex(
        path$$1.getParentNode(counter),
        path$$1.getParentNode(counter + 1)
      );
      return nthSiblingIndex % 2 === 0 ? "***" : "---";
    }
    case "linkReference":
      return concat$9([
        "[",
        printChildren(path$$1, options, print),
        "]",
        node.referenceType === "full"
          ? concat$9(["[", node.identifier, "]"])
          : node.referenceType === "collapsed"
            ? "[]"
            : ""
      ]);
    case "imageReference":
      switch (node.referenceType) {
        case "full":
          return concat$9(["![", node.alt || "", "][", node.identifier, "]"]);
        default:
          return concat$9([
            "![",
            node.alt,
            "]",
            node.referenceType === "collapsed" ? "[]" : ""
          ]);
      }
    case "definition":
      return concat$9([
        "[",
        node.identifier,
        "]: ",
        printUrl(node.url),
        printTitle(node.title, options)
      ]);
    case "footnote":
      return concat$9(["[^", printChildren(path$$1, options, print), "]"]);
    case "footnoteReference":
      return concat$9(["[^", node.identifier, "]"]);
    case "footnoteDefinition": {
      const nextNode = path$$1.getParentNode().children[path$$1.getName() + 1];
      return concat$9([
        "[^",
        node.identifier,
        "]: ",
        group$5(
          concat$9([
            align$2(
              " ".repeat(options.tabWidth),
              printChildren(path$$1, options, print, {
                processor: (childPath, index) =>
                  index === 0
                    ? group$5(concat$9([softline$6, softline$6, childPath.call(print)]))
                    : childPath.call(print)
              })
            ),
            nextNode && nextNode.type === "footnoteDefinition" ? softline$6 : ""
          ])
        )
      ]);
    }
    case "table":
      return printTable(path$$1, options, print);
    case "tableCell":
      return printChildren(path$$1, options, print);
    case "break":
      return concat$9([
        /\s/.test(options.originalText[node.position.start.offset])
          ? "  "
          : "\\",
        hardline$8
      ]);
    case "tableRow": // handled in "table"
    case "listItem": // handled in "list"
    default:
      throw new Error(`Unknown markdown type ${JSON.stringify(node.type)}`);
  }
}

function printListItem(path$$1, options, print, listPrefix) {
  const node = path$$1.getValue();
  const prefix = node.checked === null ? "" : node.checked ? "[x] " : "[ ] ";
  return concat$9([
    prefix,
    printChildren(path$$1, options, print, {
      processor: (childPath, index) => {
        if (index === 0 && childPath.getValue().type !== "list") {
          return align$2(" ".repeat(prefix.length), childPath.call(print));
        }

        const alignment = " ".repeat(
          clamp(options.tabWidth - listPrefix.length, 0, 3) // 4+ will cause indented code block
        );
        return concat$9([alignment, align$2(alignment, childPath.call(print))]);
      }
    })
  ]);
}

function alignListPrefix(prefix, options) {
  const additionalSpaces = getAdditionalSpaces();
  return (
    prefix +
    " ".repeat(
      additionalSpaces >= 4 ? 0 : additionalSpaces // 4+ will cause indented code block
    )
  );

  function getAdditionalSpaces() {
    const restSpaces = prefix.length % options.tabWidth;
    return restSpaces === 0 ? 0 : options.tabWidth - restSpaces;
  }
}

function getNthListSiblingIndex(node, parentNode) {
  return getNthSiblingIndex(
    node,
    parentNode,
    siblingNode => siblingNode.ordered === node.ordered
  );
}

function replaceNewlinesWithHardlines(str) {
  return join$7(hardline$8, str.split("\n"));
}

function getNthSiblingIndex(node, parentNode, condition) {
  condition = condition || (() => true);

  let index = -1;

  for (const childNode of parentNode.children) {
    if (childNode.type === node.type && condition(childNode)) {
      index++;
    } else {
      index = -1;
    }

    if (childNode === node) {
      return index;
    }
  }
}

function getAncestorCounter$1(path$$1, typeOrTypes) {
  const types = [].concat(typeOrTypes);

  let counter = -1;
  let ancestorNode;

  while ((ancestorNode = path$$1.getParentNode(++counter))) {
    if (types.indexOf(ancestorNode.type) !== -1) {
      return counter;
    }
  }

  return -1;
}

function getAncestorNode$2(path$$1, typeOrTypes) {
  const counter = getAncestorCounter$1(path$$1, typeOrTypes);
  return counter === -1 ? null : path$$1.getParentNode(counter);
}

function printLine(path$$1, value, options) {
  if (options.proseWrap === "preserve" && value === "\n") {
    return hardline$8;
  }

  const isBreakable =
    options.proseWrap === "always" &&
    !getAncestorNode$2(path$$1, SINGLE_LINE_NODE_TYPES);
  return value !== ""
    ? isBreakable
      ? line$7
      : " "
    : isBreakable
      ? softline$6
      : "";
}

function printTable(path$$1, options, print) {
  const node = path$$1.getValue();
  const contents = []; // { [rowIndex: number]: { [columnIndex: number]: string } }

  path$$1.map(rowPath => {
    const rowContents = [];

    rowPath.map(cellPath => {
      rowContents.push(
        printDocToString$3(cellPath.call(print), options).formatted
      );
    }, "children");

    contents.push(rowContents);
  }, "children");

  const columnMaxWidths = contents.reduce(
    (currentWidths, rowContents) =>
      currentWidths.map((width, columnIndex) =>
        Math.max(width, util$1.getStringWidth(rowContents[columnIndex]))
      ),
    contents[0].map(() => 3) // minimum width = 3 (---, :--, :-:, --:)
  );

  return join$7(hardline$8, [
    printRow(contents[0]),
    printSeparator(),
    join$7(hardline$8, contents.slice(1).map(printRow))
  ]);

  function printSeparator() {
    return concat$9([
      "| ",
      join$7(
        " | ",
        columnMaxWidths.map((width, index) => {
          switch (node.align[index]) {
            case "left":
              return ":" + "-".repeat(width - 1);
            case "right":
              return "-".repeat(width - 1) + ":";
            case "center":
              return ":" + "-".repeat(width - 2) + ":";
            default:
              return "-".repeat(width);
          }
        })
      ),
      " |"
    ]);
  }

  function printRow(rowContents) {
    return concat$9([
      "| ",
      join$7(
        " | ",
        rowContents.map((rowContent, columnIndex) => {
          switch (node.align[columnIndex]) {
            case "right":
              return alignRight(rowContent, columnMaxWidths[columnIndex]);
            case "center":
              return alignCenter(rowContent, columnMaxWidths[columnIndex]);
            default:
              return alignLeft(rowContent, columnMaxWidths[columnIndex]);
          }
        })
      ),
      " |"
    ]);
  }

  function alignLeft(text, width) {
    return concat$9([text, " ".repeat(width - util$1.getStringWidth(text))]);
  }

  function alignRight(text, width) {
    return concat$9([" ".repeat(width - util$1.getStringWidth(text)), text]);
  }

  function alignCenter(text, width) {
    const spaces = width - util$1.getStringWidth(text);
    const left = Math.floor(spaces / 2);
    const right = spaces - left;
    return concat$9([" ".repeat(left), text, " ".repeat(right)]);
  }
}

function printRoot(path$$1, options, print) {
  /** @typedef {{ index: number, offset: number }} IgnorePosition */
  /** @type {Array<{start: IgnorePosition, end: IgnorePosition}>} */
  const ignoreRanges = [];

  /** @type {IgnorePosition | null} */
  let ignoreStart = null;

  const children = path$$1.getValue().children;
  children.forEach((childNode, index) => {
    switch (isPrettierIgnore(childNode)) {
      case "start":
        if (ignoreStart === null) {
          ignoreStart = { index, offset: childNode.position.end.offset };
        }
        break;
      case "end":
        if (ignoreStart !== null) {
          ignoreRanges.push({
            start: ignoreStart,
            end: { index, offset: childNode.position.start.offset }
          });
          ignoreStart = null;
        }
        break;
      default:
        // do nothing
        break;
    }
  });

  return printChildren(path$$1, options, print, {
    processor: (childPath, index) => {
      if (ignoreRanges.length !== 0) {
        const ignoreRange = ignoreRanges[0];

        if (index === ignoreRange.start.index) {
          return concat$9([
            children[ignoreRange.start.index].value,
            options.originalText.slice(
              ignoreRange.start.offset,
              ignoreRange.end.offset
            ),
            children[ignoreRange.end.index].value
          ]);
        }

        if (ignoreRange.start.index < index && index < ignoreRange.end.index) {
          return false;
        }

        if (index === ignoreRange.end.index) {
          ignoreRanges.shift();
          return false;
        }
      }

      return childPath.call(print);
    }
  });
}

function printChildren(path$$1, options, print, events$$1) {
  events$$1 = events$$1 || {};

  const postprocessor = events$$1.postprocessor || concat$9;
  const processor = events$$1.processor || (childPath => childPath.call(print));

  const node = path$$1.getValue();
  const parts = [];

  let lastChildNode;

  path$$1.map((childPath, index) => {
    const childNode = childPath.getValue();

    const result = processor(childPath, index);
    if (result !== false) {
      const data = {
        parts,
        prevNode: lastChildNode,
        parentNode: node,
        options
      };

      if (!shouldNotPrePrintHardline(childNode, data)) {
        parts.push(hardline$8);

        if (
          shouldPrePrintDoubleHardline(childNode, data) ||
          shouldPrePrintTripleHardline(childNode, data)
        ) {
          parts.push(hardline$8);
        }

        if (shouldPrePrintTripleHardline(childNode, data)) {
          parts.push(hardline$8);
        }
      }

      parts.push(result);

      lastChildNode = childNode;
    }
  }, "children");

  return postprocessor(parts);
}

/** @return {false | 'next' | 'start' | 'end'} */
function isPrettierIgnore(node) {
  if (node.type !== "html") {
    return false;
  }
  const match = node.value.match(
    /^<!--\s*prettier-ignore(?:-(start|end))?\s*-->$/
  );
  return match === null ? false : match[1] ? match[1] : "next";
}

function shouldNotPrePrintHardline(node, data) {
  const isFirstNode = data.parts.length === 0;
  const isInlineNode = INLINE_NODE_TYPES.indexOf(node.type) !== -1;

  const isInlineHTML =
    node.type === "html" &&
    INLINE_NODE_WRAPPER_TYPES.indexOf(data.parentNode.type) !== -1;

  return isFirstNode || isInlineNode || isInlineHTML;
}

function shouldPrePrintDoubleHardline(node, data) {
  const isSequence = (data.prevNode && data.prevNode.type) === node.type;
  const isSiblingNode =
    isSequence && SIBLING_NODE_TYPES.indexOf(node.type) !== -1;

  const isInTightListItem =
    data.parentNode.type === "listItem" && !data.parentNode.loose;

  const isPrevNodeLooseListItem =
    data.prevNode && data.prevNode.type === "listItem" && data.prevNode.loose;

  const isPrevNodePrettierIgnore = isPrettierIgnore(data.prevNode) === "next";

  return (
    isPrevNodeLooseListItem ||
    !(isSiblingNode || isInTightListItem || isPrevNodePrettierIgnore)
  );
}

function shouldPrePrintTripleHardline(node, data) {
  const isPrevNodeList = data.prevNode && data.prevNode.type === "list";
  const isIndentedCode =
    node.type === "code" &&
    /\s/.test(data.options.originalText[node.position.start.offset]);

  return isPrevNodeList && isIndentedCode;
}

function shouldRemainTheSameContent(path$$1) {
  const ancestorNode = getAncestorNode$2(path$$1, [
    "linkReference",
    "imageReference"
  ]);

  return (
    ancestorNode &&
    (ancestorNode.type !== "linkReference" ||
      ancestorNode.referenceType !== "full")
  );
}

function normalizeDoc(doc$$2) {
  return docUtils$1.mapDoc(doc$$2, currentDoc => {
    if (!currentDoc.parts) {
      return currentDoc;
    }

    if (currentDoc.type === "concat" && currentDoc.parts.length === 1) {
      return currentDoc.parts[0];
    }

    const parts = [];

    currentDoc.parts.forEach(part => {
      if (part.type === "concat") {
        parts.push.apply(parts, part.parts);
      } else if (part !== "") {
        parts.push(part);
      }
    });

    return Object.assign({}, currentDoc, {
      parts: normalizeParts(parts)
    });
  });
}

function printUrl(url, dangerousCharOrChars) {
  const dangerousChars = [" "].concat(dangerousCharOrChars || []);
  return new RegExp(dangerousChars.map(x => `\\${x}`).join("|")).test(url)
    ? `<${url}>`
    : url;
}

function printTitle(title, options) {
  if (!title) {
    return "";
  }
  if (title.includes('"') && title.includes("'") && !title.includes(")")) {
    return ` (${title})`; // avoid escaped quotes
  }
  // faster than using RegExps: https://jsperf.com/performance-of-match-vs-split
  const singleCount = title.split("'").length - 1;
  const doubleCount = title.split('"').length - 1;
  const quote =
    singleCount > doubleCount
      ? '"'
      : doubleCount > singleCount
        ? "'"
        : options.singleQuote
          ? "'"
          : '"';
  title = title.replace(new RegExp(`(${quote})`, "g"), "\\$1");
  return ` ${quote}${title}${quote}`;
}

function normalizeParts(parts) {
  return parts.reduce((current, part) => {
    const lastPart = util$1.getLast(current);

    if (typeof lastPart === "string" && typeof part === "string") {
      current.splice(-1, 1, lastPart + part);
    } else {
      current.push(part);
    }

    return current;
  }, []);
}

function clamp(value, min, max) {
  return value < min ? min : value > max ? max : value;
}

function clean$5(ast, newObj, parent) {
  delete newObj.position;

  // for codeblock
  if (ast.type === "code") {
    delete newObj.value;
  }
  // for whitespace: "\n" and " " are considered the same
  if (ast.type === "whitespace" && ast.value === "\n") {
    newObj.value = " ";
  }
  // for insert pragma
  if (
    parent &&
    parent.type === "root" &&
    parent.children.length > 0 &&
    (parent.children[0] === ast ||
      ((parent.children[0].type === "yaml" ||
        parent.children[0].type === "toml") &&
        parent.children[1] === ast)) &&
    ast.type === "html" &&
    pragma$2.startWithPragma(ast.value)
  ) {
    return null;
  }
}

function hasPrettierIgnore$1(path$$1) {
  const index = +path$$1.getName();

  if (index === 0) {
    return false;
  }

  const prevNode = path$$1.getParentNode().children[index - 1];
  return isPrettierIgnore(prevNode) === "next";
}

var printerMarkdown = {
  print: genericPrint$4,
  embed: embed_1$2,
  massageAstNode: clean$5,
  hasPrettierIgnore: hasPrettierIgnore$1,
  insertPragma: pragma$2.insertPragma
};

const CATEGORY_MARKDOWN = "Markdown";

// format based on https://github.com/prettier/prettier/blob/master/src/main/core-options.js
var options$12 = {
  proseWrap: {
    since: "1.8.2",
    category: CATEGORY_MARKDOWN,
    type: "choice",
    default: [
      { since: "1.8.2", value: true },
      { since: "1.9.0", value: "preserve" }
    ],
    description: "How to wrap prose. (markdown)",
    choices: [
      {
        since: "1.9.0",
        value: "always",
        description: "Wrap prose if it exceeds the print width."
      },
      {
        since: "1.9.0",
        value: "never",
        description: "Do not wrap prose."
      },
      {
        since: "1.9.0",
        value: "preserve",
        description: "Wrap prose as-is."
      },
      { value: false, deprecated: "1.9.0", redirect: "never" },
      { value: true, deprecated: "1.9.0", redirect: "always" }
    ]
  },
  singleQuote: options$3.singleQuote
};

// Based on:
// https://github.com/github/linguist/blob/master/lib/linguist/languages.yml

const languages$4 = [
  {
    name: "Markdown",
    since: "1.8.0",
    parsers: ["remark"],
    aliases: ["pandoc"],
    aceMode: "markdown",
    codemirrorMode: "gfm",
    codemirrorMimeType: "text/x-gfm",
    wrap: true,
    extensions: [
      ".md",
      ".markdown",
      ".mdown",
      ".mdwn",
      ".mkd",
      ".mkdn",
      ".mkdown",
      ".ron",
      ".workbook"
    ],
    filenames: ["README"],
    tmScope: "source.gfm",
    linguistLanguageId: 222,
    vscodeLanguageIds: ["markdown"]
  }
];

const remark = {
  get parse() {
    return eval("require")("./parser-markdown");
  },
  astFormat: "mdast",
  hasPragma: pragma$2.hasPragma,
  locStart: node => node.position.start.offset,
  locEnd: node => node.position.end.offset
};

const parsers$4 = {
  remark,
  // TODO: Delete this in 2.0
  markdown: remark
};

const printers$4 = {
  mdast: printerMarkdown
};

var languageMarkdown = {
  languages: languages$4,
  options: options$12,
  parsers: parsers$4,
  printers: printers$4
};

const docUtils$7 = doc.utils;
const docBuilders$12 = doc.builders;
const hardline$11 = docBuilders$12.hardline;
const concat$12 = docBuilders$12.concat;

function embed$4(path$$1, print, textToDoc, options) {
  const node = path$$1.getValue();

  switch (node.type) {
    case "text": {
      const parent = path$$1.getParentNode();
      // Inline JavaScript
      if (
        parent.type === "script" &&
        ((!parent.attribs.lang && !parent.attribs.lang) ||
          parent.attribs.type === "text/javascript" ||
          parent.attribs.type === "application/javascript")
      ) {
        const parser = options.parser === "flow" ? "flow" : "babylon";
        const doc$$2 = textToDoc(getText(options, node), { parser });
        return concat$12([hardline$11, doc$$2]);
      }

      // Inline TypeScript
      if (
        parent.type === "script" &&
        (parent.attribs.type === "application/x-typescript" ||
          parent.attribs.lang === "ts")
      ) {
        const doc$$2 = textToDoc(
          getText(options, node),
          { parser: "typescript" },
          options
        );
        return concat$12([hardline$11, doc$$2]);
      }

      // Inline Styles
      if (parent.type === "style") {
        const doc$$2 = textToDoc(getText(options, node), { parser: "css" });
        return concat$12([hardline$11, docUtils$7.stripTrailingHardline(doc$$2)]);
      }

      break;
    }

    case "attribute": {
      /*
       * Vue binding sytax: JS expressions
       * :class="{ 'some-key': value }"
       * v-bind:id="'list-' + id"
       * v-if="foo && !bar"
       * @click="someFunction()"
       */
      if (/(^@)|(^v-)|:/.test(node.key) && !/^\w+$/.test(node.value)) {
        const doc$$2 = textToDoc(node.value, {
          parser: parseJavaScriptExpression,
          // Use singleQuote since HTML attributes use double-quotes.
          // TODO(azz): We still need to do an entity escape on the attribute.
          singleQuote: true
        });
        return concat$12([
          node.key,
          '="',
          util$1.hasNewlineInRange(node.value, 0, node.value.length)
            ? doc$$2
            : docUtils$7.removeLines(doc$$2),
          '"'
        ]);
      }
    }
  }
}

function parseJavaScriptExpression(text, parsers) {
  // Force parsing as an expression
  const ast = parsers.babylon(`(${text})`);
  // Extract expression from the declaration
  return {
    type: "File",
    program: ast.program.body[0].expression
  };
}

function getText(options, node) {
  return options.originalText.slice(
    options.locStart(node),
    options.locEnd(node)
  );
}

var embed_1$4 = embed$4;

var clean$6 = function(ast) {
  if (ast.type === "text") {
    return null;
  }
};

const docBuilders$11 = doc.builders;
const concat$11 = docBuilders$11.concat;
const join$8 = docBuilders$11.join;
const hardline$10 = docBuilders$11.hardline;
const line$8 = docBuilders$11.line;
const softline$7 = docBuilders$11.softline;
const group$6 = docBuilders$11.group;
const indent$7 = docBuilders$11.indent;

// http://w3c.github.io/html/single-page.html#void-elements
const voidTags$1 = {
  area: true,
  base: true,
  br: true,
  col: true,
  embed: true,
  hr: true,
  img: true,
  input: true,
  link: true,
  meta: true,
  param: true,
  source: true,
  track: true,
  wbr: true
};

function genericPrint$5(path$$1, options, print) {
  const n = path$$1.getValue();
  if (!n) {
    return "";
  }

  if (typeof n === "string") {
    return n;
  }

  switch (n.type) {
    case "root": {
      return printChildren$1(path$$1, print);
    }
    case "directive": {
      return concat$11(["<", n.data, ">", hardline$10]);
    }
    case "text": {
      return n.data.replace(/\s+/g, " ").trim();
    }
    case "script":
    case "style":
    case "tag": {
      const selfClose = voidTags$1[n.name] ? ">" : " />";
      const children = printChildren$1(path$$1, print);

      const hasNewline = util$1.hasNewlineInRange(
        options.originalText,
        options.locStart(n),
        options.locEnd(n)
      );

      return group$6(
        concat$11([
          hasNewline ? hardline$10 : "",
          "<",
          n.name,
          printAttributes(path$$1, print),

          n.children.length ? ">" : selfClose,

          n.name.toLowerCase() === "html"
            ? concat$11([hardline$10, children])
            : indent$7(children),
          n.children.length ? concat$11([softline$7, "</", n.name, ">"]) : hardline$10
        ])
      );
    }
    case "comment": {
      return concat$11(["<!-- ", n.data.trim(), " -->"]);
    }
    case "attribute": {
      if (!n.value) {
        return n.key;
      }
      return concat$11([n.key, '="', n.value, '"']);
    }

    default:
      /* istanbul ignore next */
      throw new Error("unknown htmlparser2 type: " + n.type);
  }
}

function printAttributes(path$$1, print) {
  const node = path$$1.getValue();

  return concat$11([
    node.attributes.length ? " " : "",
    indent$7(join$8(line$8, path$$1.map(print, "attributes")))
  ]);
}

function printChildren$1(path$$1, print) {
  const children = [];
  path$$1.each(childPath => {
    const child = childPath.getValue();
    if (child.type !== "text") {
      children.push(hardline$10);
    }
    children.push(childPath.call(print));
  }, "children");
  return concat$11(children);
}

var printerHtmlparser2 = {
  print: genericPrint$5,
  massageAstNode: clean$6,
  embed: embed_1$4,
  hasPrettierIgnore: util$1.hasIgnoreComment
};

// Based on:
// https://github.com/github/linguist/blob/master/lib/linguist/languages.yml

const languages$5 = [
  {
    name: "HTML",
    since: null, // unreleased
    parsers: ["parse5"],
    group: "HTML",
    tmScope: "text.html.basic",
    aceMode: "html",
    codemirrorMode: "htmlmixed",
    codemirrorMimeType: "text/html",
    aliases: ["xhtml"],
    extensions: [".html", ".htm", ".html.hl", ".inc", ".st", ".xht", ".xhtml"],
    linguistLanguageId: 146,
    vscodeLanguageIds: ["html"]
  }
];

const parsers$5 = {
  parse5: {
    get parse() {
      return eval("require")("./parser-parse5");
    },
    astFormat: "htmlparser2",
    locEnd: function(node) {
      return node.__location && node.__location.endOffset;
    },
    locStart: function(node) {
      return node.__location && node.__location.startOffset;
    }
  }
};

const printers$5 = {
  htmlparser2: printerHtmlparser2
};

var languageHtml = {
  languages: languages$5,
  parsers: parsers$5,
  printers: printers$5
};

const docBuilders$14 = doc.builders;
const concat$14 = docBuilders$14.concat;
const hardline$13 = docBuilders$14.hardline;

function embed$6(path$$1, print, textToDoc, options) {
  const node = path$$1.getValue();
  const parent = path$$1.getParentNode();
  if (!parent || parent.tag !== "root" || node.unary) {
    return null;
  }

  let parser;

  if (node.tag === "style") {
    const langAttr = node.attrs.find(attr => attr.name === "lang");
    if (!langAttr || langAttr.value === "postcss") {
      parser = "css";
    } else if (langAttr.value === "scss") {
      parser = "scss";
    } else if (langAttr.value === "less") {
      parser = "less";
    }
  }

  if (node.tag === "script") {
    const langAttr = node.attrs.find(attr => attr.name === "lang");
    if (!langAttr) {
      parser = "babylon";
    } else if (langAttr.value === "ts" || langAttr.value === "tsx") {
      parser = "typescript";
    }
  }

  if (!parser) {
    return null;
  }

  return concat$14([
    options.originalText.slice(node.start, node.contentStart),
    hardline$13,
    textToDoc(options.originalText.slice(node.contentStart, node.contentEnd), {
      parser
    }),
    options.originalText.slice(node.contentEnd, node.end)
  ]);
}

var embed_1$6 = embed$6;

const docBuilders$13 = doc.builders;
const concat$13 = docBuilders$13.concat;
const hardline$12 = docBuilders$13.hardline;

function genericPrint$6(path$$1, options, print) {
  const n = path$$1.getValue();
  const res = [];
  let index = n.start;

  path$$1.each(childPath => {
    const child = childPath.getValue();
    res.push(options.originalText.slice(index, child.start));
    res.push(childPath.call(print));
    index = child.end;
  }, "children");

  // If there are no children, we just print the node from start to end.
  // Otherwise, index should point to the end of the last child, and we
  // need to print the closing tag.
  res.push(options.originalText.slice(index, n.end));

  // Only force a trailing newline if there were any contents.
  if (n.tag === "root" && n.children.length) {
    res.push(hardline$12);
  }

  return concat$13(res);
}

const clean$9 = (ast, newObj) => {
  delete newObj.start;
  delete newObj.end;
  delete newObj.contentStart;
  delete newObj.contentEnd;
};

var printerVue = {
  print: genericPrint$6,
  embed: embed_1$6,
  massageAstNode: clean$9
};

// Based on:
// https://github.com/github/linguist/blob/master/lib/linguist/languages.yml

const languages$6 = [
  {
    name: "Vue",
    since: "1.10.0",
    parsers: ["vue"],
    group: "HTML",
    tmScope: "text.html.vue",
    aceMode: "html",
    codemirrorMode: "htmlmixed",
    codemirrorMimeType: "text/html",
    extensions: [".vue"],
    linguistLanguageId: 146,
    vscodeLanguageIds: ["vue"]
  }
];

const parsers$6 = {
  vue: {
    get parse() {
      return eval("require")("./parser-vue");
    },
    astFormat: "vue"
  }
};

const printers$6 = {
  vue: printerVue
};

var languageVue = {
  languages: languages$6,
  parsers: parsers$6,
  printers: printers$6
};

var thirdParty$1 = ( thirdParty && thirdParty__default ) || thirdParty;

function loadPlugins(plugins, pluginSearchDirs) {
  if (!plugins) {
    plugins = [];
  }

  if (!pluginSearchDirs) {
    pluginSearchDirs = [];
  }
  // unless pluginSearchDirs are provided, auto-load plugins from node_modules that are parent to Prettier
  if (!pluginSearchDirs.length) {
    const autoLoadDir = thirdParty$1.findParentDir(
      thirdParty$1.findParentDir(__dirname, "prettier"),
      "node_modules"
    );
    if (autoLoadDir) {
      pluginSearchDirs = [autoLoadDir];
    }
  }

  const internalPlugins = [
    languageJs,
    languageCss,
    languageHandlebars,
    languageGraphql,
    languageMarkdown,
    languageHtml,
    languageVue
  ];

  const externalManualLoadPluginInfos = plugins.map(pluginName => {
    let requirePath;
    try {
      // try local files
      requirePath = resolve$1.sync(path.resolve(process.cwd(), pluginName));
    } catch (e) {
      // try node modules
      requirePath = resolve$1.sync(pluginName, { basedir: process.cwd() });
    }
    return {
      name: pluginName,
      requirePath
    };
  });

  const externalAutoLoadPluginInfos = pluginSearchDirs
    .map(pluginSearchDir => {
      const resolvedPluginSearchDir = path.resolve(
        process.cwd(),
        pluginSearchDir
      );

      if (!isDirectory(resolvedPluginSearchDir)) {
        throw new Error(
          `${pluginSearchDir} does not exist or is not a directory`
        );
      }

      const nodeModulesDir = path.resolve(
        resolvedPluginSearchDir,
        "node_modules"
      );

      return findPluginsInNodeModules(nodeModulesDir).map(pluginName => ({
        name: pluginName,
        requirePath: resolve$1.sync(pluginName, {
          basedir: resolvedPluginSearchDir
        })
      }));
    })
    .reduce((a, b) => a.concat(b), []);

  const externalPlugins = lodash_uniqby(
    externalManualLoadPluginInfos.concat(externalAutoLoadPluginInfos),
    "requirePath"
  ).map(externalPluginInfo =>
    Object.assign(
      { name: externalPluginInfo.name },
      eval("require")(externalPluginInfo.requirePath)
    )
  );

  return internalPlugins.concat(externalPlugins);
}

function findPluginsInNodeModules(nodeModulesDir) {
  const pluginPackageJsonPaths = globby.sync(
    ["prettier-plugin-*/package.json", "@prettier/plugin-*/package.json"],
    { cwd: nodeModulesDir }
  );
  return pluginPackageJsonPaths.map(path.dirname);
}

function isDirectory(dir) {
  try {
    return fs.statSync(dir).isDirectory();
  } catch (e) {
    return false;
  }
}
var loadPlugins_1 = loadPlugins;

var mimicFn = (to, from) => {
	// TODO: use `Reflect.ownKeys()` when targeting Node.js 6
	for (const prop of Object.getOwnPropertyNames(from).concat(Object.getOwnPropertySymbols(from))) {
		Object.defineProperty(to, prop, Object.getOwnPropertyDescriptor(from, prop));
	}
};

var mem = createCommonjsModule(function (module) {
'use strict';


const cacheStore = new WeakMap();

const defaultCacheKey = function (x) {
	if (arguments.length === 1 && (x === null || x === undefined || (typeof x !== 'function' && typeof x !== 'object'))) {
		return x;
	}

	return JSON.stringify(arguments);
};

module.exports = (fn, opts) => {
	opts = Object.assign({
		cacheKey: defaultCacheKey,
		cache: new Map()
	}, opts);

	const memoized = function () {
		const cache = cacheStore.get(memoized);
		const key = opts.cacheKey.apply(null, arguments);

		if (cache.has(key)) {
			const c = cache.get(key);

			if (typeof opts.maxAge !== 'number' || Date.now() < c.maxAge) {
				return c.data;
			}
		}

		const ret = fn.apply(null, arguments);

		cache.set(key, {
			data: ret,
			maxAge: Date.now() + (opts.maxAge || 0)
		});

		return ret;
	};

	mimicFn(memoized, fn);

	cacheStore.set(memoized, opts.cache);

	return memoized;
};

module.exports.clear = fn => {
	const cache = cacheStore.get(fn);

	if (cache && typeof cache.clear === 'function') {
		cache.clear();
	}
};
});

var semver$3 = createCommonjsModule(function (module, exports) {
exports = module.exports = SemVer;

// The debug function is excluded entirely from the minified version.
/* nomin */ var debug;
/* nomin */ if (typeof process === 'object' &&
    /* nomin */ process.env &&
    /* nomin */ process.env.NODE_DEBUG &&
    /* nomin */ /\bsemver\b/i.test(process.env.NODE_DEBUG))
  /* nomin */ debug = function() {
    /* nomin */ var args = Array.prototype.slice.call(arguments, 0);
    /* nomin */ args.unshift('SEMVER');
    /* nomin */ console.log.apply(console, args);
    /* nomin */ };
/* nomin */ else
  /* nomin */ debug = function() {};

// Note: this is the semver.org version of the spec that it implements
// Not necessarily the package version of this code.
exports.SEMVER_SPEC_VERSION = '2.0.0';

var MAX_LENGTH = 256;
var MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || 9007199254740991;

// Max safe segment length for coercion.
var MAX_SAFE_COMPONENT_LENGTH = 16;

// The actual regexps go on exports.re
var re = exports.re = [];
var src = exports.src = [];
var R = 0;

// The following Regular Expressions can be used for tokenizing,
// validating, and parsing SemVer version strings.

// ## Numeric Identifier
// A single `0`, or a non-zero digit followed by zero or more digits.

var NUMERICIDENTIFIER = R++;
src[NUMERICIDENTIFIER] = '0|[1-9]\\d*';
var NUMERICIDENTIFIERLOOSE = R++;
src[NUMERICIDENTIFIERLOOSE] = '[0-9]+';


// ## Non-numeric Identifier
// Zero or more digits, followed by a letter or hyphen, and then zero or
// more letters, digits, or hyphens.

var NONNUMERICIDENTIFIER = R++;
src[NONNUMERICIDENTIFIER] = '\\d*[a-zA-Z-][a-zA-Z0-9-]*';


// ## Main Version
// Three dot-separated numeric identifiers.

var MAINVERSION = R++;
src[MAINVERSION] = '(' + src[NUMERICIDENTIFIER] + ')\\.' +
                   '(' + src[NUMERICIDENTIFIER] + ')\\.' +
                   '(' + src[NUMERICIDENTIFIER] + ')';

var MAINVERSIONLOOSE = R++;
src[MAINVERSIONLOOSE] = '(' + src[NUMERICIDENTIFIERLOOSE] + ')\\.' +
                        '(' + src[NUMERICIDENTIFIERLOOSE] + ')\\.' +
                        '(' + src[NUMERICIDENTIFIERLOOSE] + ')';

// ## Pre-release Version Identifier
// A numeric identifier, or a non-numeric identifier.

var PRERELEASEIDENTIFIER = R++;
src[PRERELEASEIDENTIFIER] = '(?:' + src[NUMERICIDENTIFIER] +
                            '|' + src[NONNUMERICIDENTIFIER] + ')';

var PRERELEASEIDENTIFIERLOOSE = R++;
src[PRERELEASEIDENTIFIERLOOSE] = '(?:' + src[NUMERICIDENTIFIERLOOSE] +
                                 '|' + src[NONNUMERICIDENTIFIER] + ')';


// ## Pre-release Version
// Hyphen, followed by one or more dot-separated pre-release version
// identifiers.

var PRERELEASE = R++;
src[PRERELEASE] = '(?:-(' + src[PRERELEASEIDENTIFIER] +
                  '(?:\\.' + src[PRERELEASEIDENTIFIER] + ')*))';

var PRERELEASELOOSE = R++;
src[PRERELEASELOOSE] = '(?:-?(' + src[PRERELEASEIDENTIFIERLOOSE] +
                       '(?:\\.' + src[PRERELEASEIDENTIFIERLOOSE] + ')*))';

// ## Build Metadata Identifier
// Any combination of digits, letters, or hyphens.

var BUILDIDENTIFIER = R++;
src[BUILDIDENTIFIER] = '[0-9A-Za-z-]+';

// ## Build Metadata
// Plus sign, followed by one or more period-separated build metadata
// identifiers.

var BUILD = R++;
src[BUILD] = '(?:\\+(' + src[BUILDIDENTIFIER] +
             '(?:\\.' + src[BUILDIDENTIFIER] + ')*))';


// ## Full Version String
// A main version, followed optionally by a pre-release version and
// build metadata.

// Note that the only major, minor, patch, and pre-release sections of
// the version string are capturing groups.  The build metadata is not a
// capturing group, because it should not ever be used in version
// comparison.

var FULL = R++;
var FULLPLAIN = 'v?' + src[MAINVERSION] +
                src[PRERELEASE] + '?' +
                src[BUILD] + '?';

src[FULL] = '^' + FULLPLAIN + '$';

// like full, but allows v1.2.3 and =1.2.3, which people do sometimes.
// also, 1.0.0alpha1 (prerelease without the hyphen) which is pretty
// common in the npm registry.
var LOOSEPLAIN = '[v=\\s]*' + src[MAINVERSIONLOOSE] +
                 src[PRERELEASELOOSE] + '?' +
                 src[BUILD] + '?';

var LOOSE = R++;
src[LOOSE] = '^' + LOOSEPLAIN + '$';

var GTLT = R++;
src[GTLT] = '((?:<|>)?=?)';

// Something like "2.*" or "1.2.x".
// Note that "x.x" is a valid xRange identifer, meaning "any version"
// Only the first item is strictly required.
var XRANGEIDENTIFIERLOOSE = R++;
src[XRANGEIDENTIFIERLOOSE] = src[NUMERICIDENTIFIERLOOSE] + '|x|X|\\*';
var XRANGEIDENTIFIER = R++;
src[XRANGEIDENTIFIER] = src[NUMERICIDENTIFIER] + '|x|X|\\*';

var XRANGEPLAIN = R++;
src[XRANGEPLAIN] = '[v=\\s]*(' + src[XRANGEIDENTIFIER] + ')' +
                   '(?:\\.(' + src[XRANGEIDENTIFIER] + ')' +
                   '(?:\\.(' + src[XRANGEIDENTIFIER] + ')' +
                   '(?:' + src[PRERELEASE] + ')?' +
                   src[BUILD] + '?' +
                   ')?)?';

var XRANGEPLAINLOOSE = R++;
src[XRANGEPLAINLOOSE] = '[v=\\s]*(' + src[XRANGEIDENTIFIERLOOSE] + ')' +
                        '(?:\\.(' + src[XRANGEIDENTIFIERLOOSE] + ')' +
                        '(?:\\.(' + src[XRANGEIDENTIFIERLOOSE] + ')' +
                        '(?:' + src[PRERELEASELOOSE] + ')?' +
                        src[BUILD] + '?' +
                        ')?)?';

var XRANGE = R++;
src[XRANGE] = '^' + src[GTLT] + '\\s*' + src[XRANGEPLAIN] + '$';
var XRANGELOOSE = R++;
src[XRANGELOOSE] = '^' + src[GTLT] + '\\s*' + src[XRANGEPLAINLOOSE] + '$';

// Coercion.
// Extract anything that could conceivably be a part of a valid semver
var COERCE = R++;
src[COERCE] = '(?:^|[^\\d])' +
              '(\\d{1,' + MAX_SAFE_COMPONENT_LENGTH + '})' +
              '(?:\\.(\\d{1,' + MAX_SAFE_COMPONENT_LENGTH + '}))?' +
              '(?:\\.(\\d{1,' + MAX_SAFE_COMPONENT_LENGTH + '}))?' +
              '(?:$|[^\\d])';

// Tilde ranges.
// Meaning is "reasonably at or greater than"
var LONETILDE = R++;
src[LONETILDE] = '(?:~>?)';

var TILDETRIM = R++;
src[TILDETRIM] = '(\\s*)' + src[LONETILDE] + '\\s+';
re[TILDETRIM] = new RegExp(src[TILDETRIM], 'g');
var tildeTrimReplace = '$1~';

var TILDE = R++;
src[TILDE] = '^' + src[LONETILDE] + src[XRANGEPLAIN] + '$';
var TILDELOOSE = R++;
src[TILDELOOSE] = '^' + src[LONETILDE] + src[XRANGEPLAINLOOSE] + '$';

// Caret ranges.
// Meaning is "at least and backwards compatible with"
var LONECARET = R++;
src[LONECARET] = '(?:\\^)';

var CARETTRIM = R++;
src[CARETTRIM] = '(\\s*)' + src[LONECARET] + '\\s+';
re[CARETTRIM] = new RegExp(src[CARETTRIM], 'g');
var caretTrimReplace = '$1^';

var CARET = R++;
src[CARET] = '^' + src[LONECARET] + src[XRANGEPLAIN] + '$';
var CARETLOOSE = R++;
src[CARETLOOSE] = '^' + src[LONECARET] + src[XRANGEPLAINLOOSE] + '$';

// A simple gt/lt/eq thing, or just "" to indicate "any version"
var COMPARATORLOOSE = R++;
src[COMPARATORLOOSE] = '^' + src[GTLT] + '\\s*(' + LOOSEPLAIN + ')$|^$';
var COMPARATOR = R++;
src[COMPARATOR] = '^' + src[GTLT] + '\\s*(' + FULLPLAIN + ')$|^$';


// An expression to strip any whitespace between the gtlt and the thing
// it modifies, so that `> 1.2.3` ==> `>1.2.3`
var COMPARATORTRIM = R++;
src[COMPARATORTRIM] = '(\\s*)' + src[GTLT] +
                      '\\s*(' + LOOSEPLAIN + '|' + src[XRANGEPLAIN] + ')';

// this one has to use the /g flag
re[COMPARATORTRIM] = new RegExp(src[COMPARATORTRIM], 'g');
var comparatorTrimReplace = '$1$2$3';


// Something like `1.2.3 - 1.2.4`
// Note that these all use the loose form, because they'll be
// checked against either the strict or loose comparator form
// later.
var HYPHENRANGE = R++;
src[HYPHENRANGE] = '^\\s*(' + src[XRANGEPLAIN] + ')' +
                   '\\s+-\\s+' +
                   '(' + src[XRANGEPLAIN] + ')' +
                   '\\s*$';

var HYPHENRANGELOOSE = R++;
src[HYPHENRANGELOOSE] = '^\\s*(' + src[XRANGEPLAINLOOSE] + ')' +
                        '\\s+-\\s+' +
                        '(' + src[XRANGEPLAINLOOSE] + ')' +
                        '\\s*$';

// Star ranges basically just allow anything at all.
var STAR = R++;
src[STAR] = '(<|>)?=?\\s*\\*';

// Compile to actual regexp objects.
// All are flag-free, unless they were created above with a flag.
for (var i = 0; i < R; i++) {
  debug(i, src[i]);
  if (!re[i])
    re[i] = new RegExp(src[i]);
}

exports.parse = parse;
function parse(version, loose) {
  if (version instanceof SemVer)
    return version;

  if (typeof version !== 'string')
    return null;

  if (version.length > MAX_LENGTH)
    return null;

  var r = loose ? re[LOOSE] : re[FULL];
  if (!r.test(version))
    return null;

  try {
    return new SemVer(version, loose);
  } catch (er) {
    return null;
  }
}

exports.valid = valid;
function valid(version, loose) {
  var v = parse(version, loose);
  return v ? v.version : null;
}


exports.clean = clean;
function clean(version, loose) {
  var s = parse(version.trim().replace(/^[=v]+/, ''), loose);
  return s ? s.version : null;
}

exports.SemVer = SemVer;

function SemVer(version, loose) {
  if (version instanceof SemVer) {
    if (version.loose === loose)
      return version;
    else
      version = version.version;
  } else if (typeof version !== 'string') {
    throw new TypeError('Invalid Version: ' + version);
  }

  if (version.length > MAX_LENGTH)
    throw new TypeError('version is longer than ' + MAX_LENGTH + ' characters')

  if (!(this instanceof SemVer))
    return new SemVer(version, loose);

  debug('SemVer', version, loose);
  this.loose = loose;
  var m = version.trim().match(loose ? re[LOOSE] : re[FULL]);

  if (!m)
    throw new TypeError('Invalid Version: ' + version);

  this.raw = version;

  // these are actually numbers
  this.major = +m[1];
  this.minor = +m[2];
  this.patch = +m[3];

  if (this.major > MAX_SAFE_INTEGER || this.major < 0)
    throw new TypeError('Invalid major version')

  if (this.minor > MAX_SAFE_INTEGER || this.minor < 0)
    throw new TypeError('Invalid minor version')

  if (this.patch > MAX_SAFE_INTEGER || this.patch < 0)
    throw new TypeError('Invalid patch version')

  // numberify any prerelease numeric ids
  if (!m[4])
    this.prerelease = [];
  else
    this.prerelease = m[4].split('.').map(function(id) {
      if (/^[0-9]+$/.test(id)) {
        var num = +id;
        if (num >= 0 && num < MAX_SAFE_INTEGER)
          return num;
      }
      return id;
    });

  this.build = m[5] ? m[5].split('.') : [];
  this.format();
}

SemVer.prototype.format = function() {
  this.version = this.major + '.' + this.minor + '.' + this.patch;
  if (this.prerelease.length)
    this.version += '-' + this.prerelease.join('.');
  return this.version;
};

SemVer.prototype.toString = function() {
  return this.version;
};

SemVer.prototype.compare = function(other) {
  debug('SemVer.compare', this.version, this.loose, other);
  if (!(other instanceof SemVer))
    other = new SemVer(other, this.loose);

  return this.compareMain(other) || this.comparePre(other);
};

SemVer.prototype.compareMain = function(other) {
  if (!(other instanceof SemVer))
    other = new SemVer(other, this.loose);

  return compareIdentifiers(this.major, other.major) ||
         compareIdentifiers(this.minor, other.minor) ||
         compareIdentifiers(this.patch, other.patch);
};

SemVer.prototype.comparePre = function(other) {
  if (!(other instanceof SemVer))
    other = new SemVer(other, this.loose);

  // NOT having a prerelease is > having one
  if (this.prerelease.length && !other.prerelease.length)
    return -1;
  else if (!this.prerelease.length && other.prerelease.length)
    return 1;
  else if (!this.prerelease.length && !other.prerelease.length)
    return 0;

  var i = 0;
  do {
    var a = this.prerelease[i];
    var b = other.prerelease[i];
    debug('prerelease compare', i, a, b);
    if (a === undefined && b === undefined)
      return 0;
    else if (b === undefined)
      return 1;
    else if (a === undefined)
      return -1;
    else if (a === b)
      continue;
    else
      return compareIdentifiers(a, b);
  } while (++i);
};

// preminor will bump the version up to the next minor release, and immediately
// down to pre-release. premajor and prepatch work the same way.
SemVer.prototype.inc = function(release, identifier) {
  switch (release) {
    case 'premajor':
      this.prerelease.length = 0;
      this.patch = 0;
      this.minor = 0;
      this.major++;
      this.inc('pre', identifier);
      break;
    case 'preminor':
      this.prerelease.length = 0;
      this.patch = 0;
      this.minor++;
      this.inc('pre', identifier);
      break;
    case 'prepatch':
      // If this is already a prerelease, it will bump to the next version
      // drop any prereleases that might already exist, since they are not
      // relevant at this point.
      this.prerelease.length = 0;
      this.inc('patch', identifier);
      this.inc('pre', identifier);
      break;
    // If the input is a non-prerelease version, this acts the same as
    // prepatch.
    case 'prerelease':
      if (this.prerelease.length === 0)
        this.inc('patch', identifier);
      this.inc('pre', identifier);
      break;

    case 'major':
      // If this is a pre-major version, bump up to the same major version.
      // Otherwise increment major.
      // 1.0.0-5 bumps to 1.0.0
      // 1.1.0 bumps to 2.0.0
      if (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0)
        this.major++;
      this.minor = 0;
      this.patch = 0;
      this.prerelease = [];
      break;
    case 'minor':
      // If this is a pre-minor version, bump up to the same minor version.
      // Otherwise increment minor.
      // 1.2.0-5 bumps to 1.2.0
      // 1.2.1 bumps to 1.3.0
      if (this.patch !== 0 || this.prerelease.length === 0)
        this.minor++;
      this.patch = 0;
      this.prerelease = [];
      break;
    case 'patch':
      // If this is not a pre-release version, it will increment the patch.
      // If it is a pre-release it will bump up to the same patch version.
      // 1.2.0-5 patches to 1.2.0
      // 1.2.0 patches to 1.2.1
      if (this.prerelease.length === 0)
        this.patch++;
      this.prerelease = [];
      break;
    // This probably shouldn't be used publicly.
    // 1.0.0 "pre" would become 1.0.0-0 which is the wrong direction.
    case 'pre':
      if (this.prerelease.length === 0)
        this.prerelease = [0];
      else {
        var i = this.prerelease.length;
        while (--i >= 0) {
          if (typeof this.prerelease[i] === 'number') {
            this.prerelease[i]++;
            i = -2;
          }
        }
        if (i === -1) // didn't increment anything
          this.prerelease.push(0);
      }
      if (identifier) {
        // 1.2.0-beta.1 bumps to 1.2.0-beta.2,
        // 1.2.0-beta.fooblz or 1.2.0-beta bumps to 1.2.0-beta.0
        if (this.prerelease[0] === identifier) {
          if (isNaN(this.prerelease[1]))
            this.prerelease = [identifier, 0];
        } else
          this.prerelease = [identifier, 0];
      }
      break;

    default:
      throw new Error('invalid increment argument: ' + release);
  }
  this.format();
  this.raw = this.version;
  return this;
};

exports.inc = inc;
function inc(version, release, loose, identifier) {
  if (typeof(loose) === 'string') {
    identifier = loose;
    loose = undefined;
  }

  try {
    return new SemVer(version, loose).inc(release, identifier).version;
  } catch (er) {
    return null;
  }
}

exports.diff = diff;
function diff(version1, version2) {
  if (eq(version1, version2)) {
    return null;
  } else {
    var v1 = parse(version1);
    var v2 = parse(version2);
    if (v1.prerelease.length || v2.prerelease.length) {
      for (var key in v1) {
        if (key === 'major' || key === 'minor' || key === 'patch') {
          if (v1[key] !== v2[key]) {
            return 'pre'+key;
          }
        }
      }
      return 'prerelease';
    }
    for (var key in v1) {
      if (key === 'major' || key === 'minor' || key === 'patch') {
        if (v1[key] !== v2[key]) {
          return key;
        }
      }
    }
  }
}

exports.compareIdentifiers = compareIdentifiers;

var numeric = /^[0-9]+$/;
function compareIdentifiers(a, b) {
  var anum = numeric.test(a);
  var bnum = numeric.test(b);

  if (anum && bnum) {
    a = +a;
    b = +b;
  }

  return (anum && !bnum) ? -1 :
         (bnum && !anum) ? 1 :
         a < b ? -1 :
         a > b ? 1 :
         0;
}

exports.rcompareIdentifiers = rcompareIdentifiers;
function rcompareIdentifiers(a, b) {
  return compareIdentifiers(b, a);
}

exports.major = major;
function major(a, loose) {
  return new SemVer(a, loose).major;
}

exports.minor = minor;
function minor(a, loose) {
  return new SemVer(a, loose).minor;
}

exports.patch = patch;
function patch(a, loose) {
  return new SemVer(a, loose).patch;
}

exports.compare = compare;
function compare(a, b, loose) {
  return new SemVer(a, loose).compare(new SemVer(b, loose));
}

exports.compareLoose = compareLoose;
function compareLoose(a, b) {
  return compare(a, b, true);
}

exports.rcompare = rcompare;
function rcompare(a, b, loose) {
  return compare(b, a, loose);
}

exports.sort = sort;
function sort(list, loose) {
  return list.sort(function(a, b) {
    return exports.compare(a, b, loose);
  });
}

exports.rsort = rsort;
function rsort(list, loose) {
  return list.sort(function(a, b) {
    return exports.rcompare(a, b, loose);
  });
}

exports.gt = gt;
function gt(a, b, loose) {
  return compare(a, b, loose) > 0;
}

exports.lt = lt;
function lt(a, b, loose) {
  return compare(a, b, loose) < 0;
}

exports.eq = eq;
function eq(a, b, loose) {
  return compare(a, b, loose) === 0;
}

exports.neq = neq;
function neq(a, b, loose) {
  return compare(a, b, loose) !== 0;
}

exports.gte = gte;
function gte(a, b, loose) {
  return compare(a, b, loose) >= 0;
}

exports.lte = lte;
function lte(a, b, loose) {
  return compare(a, b, loose) <= 0;
}

exports.cmp = cmp;
function cmp(a, op, b, loose) {
  var ret;
  switch (op) {
    case '===':
      if (typeof a === 'object') a = a.version;
      if (typeof b === 'object') b = b.version;
      ret = a === b;
      break;
    case '!==':
      if (typeof a === 'object') a = a.version;
      if (typeof b === 'object') b = b.version;
      ret = a !== b;
      break;
    case '': case '=': case '==': ret = eq(a, b, loose); break;
    case '!=': ret = neq(a, b, loose); break;
    case '>': ret = gt(a, b, loose); break;
    case '>=': ret = gte(a, b, loose); break;
    case '<': ret = lt(a, b, loose); break;
    case '<=': ret = lte(a, b, loose); break;
    default: throw new TypeError('Invalid operator: ' + op);
  }
  return ret;
}

exports.Comparator = Comparator;
function Comparator(comp, loose) {
  if (comp instanceof Comparator) {
    if (comp.loose === loose)
      return comp;
    else
      comp = comp.value;
  }

  if (!(this instanceof Comparator))
    return new Comparator(comp, loose);

  debug('comparator', comp, loose);
  this.loose = loose;
  this.parse(comp);

  if (this.semver === ANY)
    this.value = '';
  else
    this.value = this.operator + this.semver.version;

  debug('comp', this);
}

var ANY = {};
Comparator.prototype.parse = function(comp) {
  var r = this.loose ? re[COMPARATORLOOSE] : re[COMPARATOR];
  var m = comp.match(r);

  if (!m)
    throw new TypeError('Invalid comparator: ' + comp);

  this.operator = m[1];
  if (this.operator === '=')
    this.operator = '';

  // if it literally is just '>' or '' then allow anything.
  if (!m[2])
    this.semver = ANY;
  else
    this.semver = new SemVer(m[2], this.loose);
};

Comparator.prototype.toString = function() {
  return this.value;
};

Comparator.prototype.test = function(version) {
  debug('Comparator.test', version, this.loose);

  if (this.semver === ANY)
    return true;

  if (typeof version === 'string')
    version = new SemVer(version, this.loose);

  return cmp(version, this.operator, this.semver, this.loose);
};

Comparator.prototype.intersects = function(comp, loose) {
  if (!(comp instanceof Comparator)) {
    throw new TypeError('a Comparator is required');
  }

  var rangeTmp;

  if (this.operator === '') {
    rangeTmp = new Range(comp.value, loose);
    return satisfies(this.value, rangeTmp, loose);
  } else if (comp.operator === '') {
    rangeTmp = new Range(this.value, loose);
    return satisfies(comp.semver, rangeTmp, loose);
  }

  var sameDirectionIncreasing =
    (this.operator === '>=' || this.operator === '>') &&
    (comp.operator === '>=' || comp.operator === '>');
  var sameDirectionDecreasing =
    (this.operator === '<=' || this.operator === '<') &&
    (comp.operator === '<=' || comp.operator === '<');
  var sameSemVer = this.semver.version === comp.semver.version;
  var differentDirectionsInclusive =
    (this.operator === '>=' || this.operator === '<=') &&
    (comp.operator === '>=' || comp.operator === '<=');
  var oppositeDirectionsLessThan =
    cmp(this.semver, '<', comp.semver, loose) &&
    ((this.operator === '>=' || this.operator === '>') &&
    (comp.operator === '<=' || comp.operator === '<'));
  var oppositeDirectionsGreaterThan =
    cmp(this.semver, '>', comp.semver, loose) &&
    ((this.operator === '<=' || this.operator === '<') &&
    (comp.operator === '>=' || comp.operator === '>'));

  return sameDirectionIncreasing || sameDirectionDecreasing ||
    (sameSemVer && differentDirectionsInclusive) ||
    oppositeDirectionsLessThan || oppositeDirectionsGreaterThan;
};


exports.Range = Range;
function Range(range, loose) {
  if (range instanceof Range) {
    if (range.loose === loose) {
      return range;
    } else {
      return new Range(range.raw, loose);
    }
  }

  if (range instanceof Comparator) {
    return new Range(range.value, loose);
  }

  if (!(this instanceof Range))
    return new Range(range, loose);

  this.loose = loose;

  // First, split based on boolean or ||
  this.raw = range;
  this.set = range.split(/\s*\|\|\s*/).map(function(range) {
    return this.parseRange(range.trim());
  }, this).filter(function(c) {
    // throw out any that are not relevant for whatever reason
    return c.length;
  });

  if (!this.set.length) {
    throw new TypeError('Invalid SemVer Range: ' + range);
  }

  this.format();
}

Range.prototype.format = function() {
  this.range = this.set.map(function(comps) {
    return comps.join(' ').trim();
  }).join('||').trim();
  return this.range;
};

Range.prototype.toString = function() {
  return this.range;
};

Range.prototype.parseRange = function(range) {
  var loose = this.loose;
  range = range.trim();
  debug('range', range, loose);
  // `1.2.3 - 1.2.4` => `>=1.2.3 <=1.2.4`
  var hr = loose ? re[HYPHENRANGELOOSE] : re[HYPHENRANGE];
  range = range.replace(hr, hyphenReplace);
  debug('hyphen replace', range);
  // `> 1.2.3 < 1.2.5` => `>1.2.3 <1.2.5`
  range = range.replace(re[COMPARATORTRIM], comparatorTrimReplace);
  debug('comparator trim', range, re[COMPARATORTRIM]);

  // `~ 1.2.3` => `~1.2.3`
  range = range.replace(re[TILDETRIM], tildeTrimReplace);

  // `^ 1.2.3` => `^1.2.3`
  range = range.replace(re[CARETTRIM], caretTrimReplace);

  // normalize spaces
  range = range.split(/\s+/).join(' ');

  // At this point, the range is completely trimmed and
  // ready to be split into comparators.

  var compRe = loose ? re[COMPARATORLOOSE] : re[COMPARATOR];
  var set = range.split(' ').map(function(comp) {
    return parseComparator(comp, loose);
  }).join(' ').split(/\s+/);
  if (this.loose) {
    // in loose mode, throw out any that are not valid comparators
    set = set.filter(function(comp) {
      return !!comp.match(compRe);
    });
  }
  set = set.map(function(comp) {
    return new Comparator(comp, loose);
  });

  return set;
};

Range.prototype.intersects = function(range, loose) {
  if (!(range instanceof Range)) {
    throw new TypeError('a Range is required');
  }

  return this.set.some(function(thisComparators) {
    return thisComparators.every(function(thisComparator) {
      return range.set.some(function(rangeComparators) {
        return rangeComparators.every(function(rangeComparator) {
          return thisComparator.intersects(rangeComparator, loose);
        });
      });
    });
  });
};

// Mostly just for testing and legacy API reasons
exports.toComparators = toComparators;
function toComparators(range, loose) {
  return new Range(range, loose).set.map(function(comp) {
    return comp.map(function(c) {
      return c.value;
    }).join(' ').trim().split(' ');
  });
}

// comprised of xranges, tildes, stars, and gtlt's at this point.
// already replaced the hyphen ranges
// turn into a set of JUST comparators.
function parseComparator(comp, loose) {
  debug('comp', comp);
  comp = replaceCarets(comp, loose);
  debug('caret', comp);
  comp = replaceTildes(comp, loose);
  debug('tildes', comp);
  comp = replaceXRanges(comp, loose);
  debug('xrange', comp);
  comp = replaceStars(comp, loose);
  debug('stars', comp);
  return comp;
}

function isX(id) {
  return !id || id.toLowerCase() === 'x' || id === '*';
}

// ~, ~> --> * (any, kinda silly)
// ~2, ~2.x, ~2.x.x, ~>2, ~>2.x ~>2.x.x --> >=2.0.0 <3.0.0
// ~2.0, ~2.0.x, ~>2.0, ~>2.0.x --> >=2.0.0 <2.1.0
// ~1.2, ~1.2.x, ~>1.2, ~>1.2.x --> >=1.2.0 <1.3.0
// ~1.2.3, ~>1.2.3 --> >=1.2.3 <1.3.0
// ~1.2.0, ~>1.2.0 --> >=1.2.0 <1.3.0
function replaceTildes(comp, loose) {
  return comp.trim().split(/\s+/).map(function(comp) {
    return replaceTilde(comp, loose);
  }).join(' ');
}

function replaceTilde(comp, loose) {
  var r = loose ? re[TILDELOOSE] : re[TILDE];
  return comp.replace(r, function(_, M, m, p, pr) {
    debug('tilde', comp, _, M, m, p, pr);
    var ret;

    if (isX(M))
      ret = '';
    else if (isX(m))
      ret = '>=' + M + '.0.0 <' + (+M + 1) + '.0.0';
    else if (isX(p))
      // ~1.2 == >=1.2.0 <1.3.0
      ret = '>=' + M + '.' + m + '.0 <' + M + '.' + (+m + 1) + '.0';
    else if (pr) {
      debug('replaceTilde pr', pr);
      if (pr.charAt(0) !== '-')
        pr = '-' + pr;
      ret = '>=' + M + '.' + m + '.' + p + pr +
            ' <' + M + '.' + (+m + 1) + '.0';
    } else
      // ~1.2.3 == >=1.2.3 <1.3.0
      ret = '>=' + M + '.' + m + '.' + p +
            ' <' + M + '.' + (+m + 1) + '.0';

    debug('tilde return', ret);
    return ret;
  });
}

// ^ --> * (any, kinda silly)
// ^2, ^2.x, ^2.x.x --> >=2.0.0 <3.0.0
// ^2.0, ^2.0.x --> >=2.0.0 <3.0.0
// ^1.2, ^1.2.x --> >=1.2.0 <2.0.0
// ^1.2.3 --> >=1.2.3 <2.0.0
// ^1.2.0 --> >=1.2.0 <2.0.0
function replaceCarets(comp, loose) {
  return comp.trim().split(/\s+/).map(function(comp) {
    return replaceCaret(comp, loose);
  }).join(' ');
}

function replaceCaret(comp, loose) {
  debug('caret', comp, loose);
  var r = loose ? re[CARETLOOSE] : re[CARET];
  return comp.replace(r, function(_, M, m, p, pr) {
    debug('caret', comp, _, M, m, p, pr);
    var ret;

    if (isX(M))
      ret = '';
    else if (isX(m))
      ret = '>=' + M + '.0.0 <' + (+M + 1) + '.0.0';
    else if (isX(p)) {
      if (M === '0')
        ret = '>=' + M + '.' + m + '.0 <' + M + '.' + (+m + 1) + '.0';
      else
        ret = '>=' + M + '.' + m + '.0 <' + (+M + 1) + '.0.0';
    } else if (pr) {
      debug('replaceCaret pr', pr);
      if (pr.charAt(0) !== '-')
        pr = '-' + pr;
      if (M === '0') {
        if (m === '0')
          ret = '>=' + M + '.' + m + '.' + p + pr +
                ' <' + M + '.' + m + '.' + (+p + 1);
        else
          ret = '>=' + M + '.' + m + '.' + p + pr +
                ' <' + M + '.' + (+m + 1) + '.0';
      } else
        ret = '>=' + M + '.' + m + '.' + p + pr +
              ' <' + (+M + 1) + '.0.0';
    } else {
      debug('no pr');
      if (M === '0') {
        if (m === '0')
          ret = '>=' + M + '.' + m + '.' + p +
                ' <' + M + '.' + m + '.' + (+p + 1);
        else
          ret = '>=' + M + '.' + m + '.' + p +
                ' <' + M + '.' + (+m + 1) + '.0';
      } else
        ret = '>=' + M + '.' + m + '.' + p +
              ' <' + (+M + 1) + '.0.0';
    }

    debug('caret return', ret);
    return ret;
  });
}

function replaceXRanges(comp, loose) {
  debug('replaceXRanges', comp, loose);
  return comp.split(/\s+/).map(function(comp) {
    return replaceXRange(comp, loose);
  }).join(' ');
}

function replaceXRange(comp, loose) {
  comp = comp.trim();
  var r = loose ? re[XRANGELOOSE] : re[XRANGE];
  return comp.replace(r, function(ret, gtlt, M, m, p, pr) {
    debug('xRange', comp, ret, gtlt, M, m, p, pr);
    var xM = isX(M);
    var xm = xM || isX(m);
    var xp = xm || isX(p);
    var anyX = xp;

    if (gtlt === '=' && anyX)
      gtlt = '';

    if (xM) {
      if (gtlt === '>' || gtlt === '<') {
        // nothing is allowed
        ret = '<0.0.0';
      } else {
        // nothing is forbidden
        ret = '*';
      }
    } else if (gtlt && anyX) {
      // replace X with 0
      if (xm)
        m = 0;
      if (xp)
        p = 0;

      if (gtlt === '>') {
        // >1 => >=2.0.0
        // >1.2 => >=1.3.0
        // >1.2.3 => >= 1.2.4
        gtlt = '>=';
        if (xm) {
          M = +M + 1;
          m = 0;
          p = 0;
        } else if (xp) {
          m = +m + 1;
          p = 0;
        }
      } else if (gtlt === '<=') {
        // <=0.7.x is actually <0.8.0, since any 0.7.x should
        // pass.  Similarly, <=7.x is actually <8.0.0, etc.
        gtlt = '<';
        if (xm)
          M = +M + 1;
        else
          m = +m + 1;
      }

      ret = gtlt + M + '.' + m + '.' + p;
    } else if (xm) {
      ret = '>=' + M + '.0.0 <' + (+M + 1) + '.0.0';
    } else if (xp) {
      ret = '>=' + M + '.' + m + '.0 <' + M + '.' + (+m + 1) + '.0';
    }

    debug('xRange return', ret);

    return ret;
  });
}

// Because * is AND-ed with everything else in the comparator,
// and '' means "any version", just remove the *s entirely.
function replaceStars(comp, loose) {
  debug('replaceStars', comp, loose);
  // Looseness is ignored here.  star is always as loose as it gets!
  return comp.trim().replace(re[STAR], '');
}

// This function is passed to string.replace(re[HYPHENRANGE])
// M, m, patch, prerelease, build
// 1.2 - 3.4.5 => >=1.2.0 <=3.4.5
// 1.2.3 - 3.4 => >=1.2.0 <3.5.0 Any 3.4.x will do
// 1.2 - 3.4 => >=1.2.0 <3.5.0
function hyphenReplace($0,
                       from, fM, fm, fp, fpr, fb,
                       to, tM, tm, tp, tpr, tb) {

  if (isX(fM))
    from = '';
  else if (isX(fm))
    from = '>=' + fM + '.0.0';
  else if (isX(fp))
    from = '>=' + fM + '.' + fm + '.0';
  else
    from = '>=' + from;

  if (isX(tM))
    to = '';
  else if (isX(tm))
    to = '<' + (+tM + 1) + '.0.0';
  else if (isX(tp))
    to = '<' + tM + '.' + (+tm + 1) + '.0';
  else if (tpr)
    to = '<=' + tM + '.' + tm + '.' + tp + '-' + tpr;
  else
    to = '<=' + to;

  return (from + ' ' + to).trim();
}


// if ANY of the sets match ALL of its comparators, then pass
Range.prototype.test = function(version) {
  if (!version)
    return false;

  if (typeof version === 'string')
    version = new SemVer(version, this.loose);

  for (var i = 0; i < this.set.length; i++) {
    if (testSet(this.set[i], version))
      return true;
  }
  return false;
};

function testSet(set, version) {
  for (var i = 0; i < set.length; i++) {
    if (!set[i].test(version))
      return false;
  }

  if (version.prerelease.length) {
    // Find the set of versions that are allowed to have prereleases
    // For example, ^1.2.3-pr.1 desugars to >=1.2.3-pr.1 <2.0.0
    // That should allow `1.2.3-pr.2` to pass.
    // However, `1.2.4-alpha.notready` should NOT be allowed,
    // even though it's within the range set by the comparators.
    for (var i = 0; i < set.length; i++) {
      debug(set[i].semver);
      if (set[i].semver === ANY)
        continue;

      if (set[i].semver.prerelease.length > 0) {
        var allowed = set[i].semver;
        if (allowed.major === version.major &&
            allowed.minor === version.minor &&
            allowed.patch === version.patch)
          return true;
      }
    }

    // Version has a -pre, but it's not one of the ones we like.
    return false;
  }

  return true;
}

exports.satisfies = satisfies;
function satisfies(version, range, loose) {
  try {
    range = new Range(range, loose);
  } catch (er) {
    return false;
  }
  return range.test(version);
}

exports.maxSatisfying = maxSatisfying;
function maxSatisfying(versions, range, loose) {
  var max = null;
  var maxSV = null;
  try {
    var rangeObj = new Range(range, loose);
  } catch (er) {
    return null;
  }
  versions.forEach(function (v) {
    if (rangeObj.test(v)) { // satisfies(v, range, loose)
      if (!max || maxSV.compare(v) === -1) { // compare(max, v, true)
        max = v;
        maxSV = new SemVer(max, loose);
      }
    }
  });
  return max;
}

exports.minSatisfying = minSatisfying;
function minSatisfying(versions, range, loose) {
  var min = null;
  var minSV = null;
  try {
    var rangeObj = new Range(range, loose);
  } catch (er) {
    return null;
  }
  versions.forEach(function (v) {
    if (rangeObj.test(v)) { // satisfies(v, range, loose)
      if (!min || minSV.compare(v) === 1) { // compare(min, v, true)
        min = v;
        minSV = new SemVer(min, loose);
      }
    }
  });
  return min;
}

exports.validRange = validRange;
function validRange(range, loose) {
  try {
    // Return '*' instead of '' so that truthiness works.
    // This will throw if it's invalid anyway
    return new Range(range, loose).range || '*';
  } catch (er) {
    return null;
  }
}

// Determine if version is less than all the versions possible in the range
exports.ltr = ltr;
function ltr(version, range, loose) {
  return outside(version, range, '<', loose);
}

// Determine if version is greater than all the versions possible in the range.
exports.gtr = gtr;
function gtr(version, range, loose) {
  return outside(version, range, '>', loose);
}

exports.outside = outside;
function outside(version, range, hilo, loose) {
  version = new SemVer(version, loose);
  range = new Range(range, loose);

  var gtfn, ltefn, ltfn, comp, ecomp;
  switch (hilo) {
    case '>':
      gtfn = gt;
      ltefn = lte;
      ltfn = lt;
      comp = '>';
      ecomp = '>=';
      break;
    case '<':
      gtfn = lt;
      ltefn = gte;
      ltfn = gt;
      comp = '<';
      ecomp = '<=';
      break;
    default:
      throw new TypeError('Must provide a hilo val of "<" or ">"');
  }

  // If it satisifes the range it is not outside
  if (satisfies(version, range, loose)) {
    return false;
  }

  // From now on, variable terms are as if we're in "gtr" mode.
  // but note that everything is flipped for the "ltr" function.

  for (var i = 0; i < range.set.length; ++i) {
    var comparators = range.set[i];

    var high = null;
    var low = null;

    comparators.forEach(function(comparator) {
      if (comparator.semver === ANY) {
        comparator = new Comparator('>=0.0.0');
      }
      high = high || comparator;
      low = low || comparator;
      if (gtfn(comparator.semver, high.semver, loose)) {
        high = comparator;
      } else if (ltfn(comparator.semver, low.semver, loose)) {
        low = comparator;
      }
    });

    // If the edge version comparator has a operator then our version
    // isn't outside it
    if (high.operator === comp || high.operator === ecomp) {
      return false;
    }

    // If the lowest version comparator has an operator and our version
    // is less than it then it isn't higher than the range
    if ((!low.operator || low.operator === comp) &&
        ltefn(version, low.semver)) {
      return false;
    } else if (low.operator === ecomp && ltfn(version, low.semver)) {
      return false;
    }
  }
  return true;
}

exports.prerelease = prerelease;
function prerelease(version, loose) {
  var parsed = parse(version, loose);
  return (parsed && parsed.prerelease.length) ? parsed.prerelease : null;
}

exports.intersects = intersects;
function intersects(r1, r2, loose) {
  r1 = new Range(r1, loose);
  r2 = new Range(r2, loose);
  return r1.intersects(r2)
}

exports.coerce = coerce;
function coerce(version) {
  if (version instanceof SemVer)
    return version;

  if (typeof version !== 'string')
    return null;

  var match = version.match(re[COERCE]);

  if (match == null)
    return null;

  return parse((match[1] || '0') + '.' + (match[2] || '0') + '.' + (match[3] || '0')); 
}
});

var hasOwnProperty$1 = Object.prototype.hasOwnProperty;

var pseudomap = PseudoMap;

function PseudoMap (set) {
  if (!(this instanceof PseudoMap)) // whyyyyyyy
    throw new TypeError("Constructor PseudoMap requires 'new'")

  this.clear();

  if (set) {
    if ((set instanceof PseudoMap) ||
        (typeof Map === 'function' && set instanceof Map))
      set.forEach(function (value, key) {
        this.set(key, value);
      }, this);
    else if (Array.isArray(set))
      set.forEach(function (kv) {
        this.set(kv[0], kv[1]);
      }, this);
    else
      throw new TypeError('invalid argument')
  }
}

PseudoMap.prototype.forEach = function (fn, thisp) {
  thisp = thisp || this;
  Object.keys(this._data).forEach(function (k) {
    if (k !== 'size')
      fn.call(thisp, this._data[k].value, this._data[k].key);
  }, this);
};

PseudoMap.prototype.has = function (k) {
  return !!find(this._data, k)
};

PseudoMap.prototype.get = function (k) {
  var res = find(this._data, k);
  return res && res.value
};

PseudoMap.prototype.set = function (k, v) {
  set(this._data, k, v);
};

PseudoMap.prototype.delete = function (k) {
  var res = find(this._data, k);
  if (res) {
    delete this._data[res._index];
    this._data.size--;
  }
};

PseudoMap.prototype.clear = function () {
  var data = Object.create(null);
  data.size = 0;

  Object.defineProperty(this, '_data', {
    value: data,
    enumerable: false,
    configurable: true,
    writable: false
  });
};

Object.defineProperty(PseudoMap.prototype, 'size', {
  get: function () {
    return this._data.size
  },
  set: function (n) {},
  enumerable: true,
  configurable: true
});

PseudoMap.prototype.values =
PseudoMap.prototype.keys =
PseudoMap.prototype.entries = function () {
  throw new Error('iterators are not implemented in this version')
};

// Either identical, or both NaN
function same (a, b) {
  return a === b || a !== a && b !== b
}

function Entry$1 (k, v, i) {
  this.key = k;
  this.value = v;
  this._index = i;
}

function find (data, k) {
  for (var i = 0, s = '_' + k, key = s;
       hasOwnProperty$1.call(data, key);
       key = s + i++) {
    if (same(data[key].key, k))
      return data[key]
  }
}

function set (data, k, v) {
  for (var i = 0, s = '_' + k, key = s;
       hasOwnProperty$1.call(data, key);
       key = s + i++) {
    if (same(data[key].key, k)) {
      data[key].value = v;
      return
    }
  }
  data.size++;
  data[key] = new Entry$1(k, v, key);
}

var map = createCommonjsModule(function (module) {
if (process.env.npm_package_name === 'pseudomap' &&
    process.env.npm_lifecycle_script === 'test')
  process.env.TEST_PSEUDOMAP = 'true';

if (typeof Map === 'function' && !process.env.TEST_PSEUDOMAP) {
  module.exports = Map;
} else {
  module.exports = pseudomap;
}
});

var yallist = Yallist;

Yallist.Node = Node;
Yallist.create = Yallist;

function Yallist (list) {
  var self = this;
  if (!(self instanceof Yallist)) {
    self = new Yallist();
  }

  self.tail = null;
  self.head = null;
  self.length = 0;

  if (list && typeof list.forEach === 'function') {
    list.forEach(function (item) {
      self.push(item);
    });
  } else if (arguments.length > 0) {
    for (var i = 0, l = arguments.length; i < l; i++) {
      self.push(arguments[i]);
    }
  }

  return self
}

Yallist.prototype.removeNode = function (node) {
  if (node.list !== this) {
    throw new Error('removing node which does not belong to this list')
  }

  var next = node.next;
  var prev = node.prev;

  if (next) {
    next.prev = prev;
  }

  if (prev) {
    prev.next = next;
  }

  if (node === this.head) {
    this.head = next;
  }
  if (node === this.tail) {
    this.tail = prev;
  }

  node.list.length--;
  node.next = null;
  node.prev = null;
  node.list = null;
};

Yallist.prototype.unshiftNode = function (node) {
  if (node === this.head) {
    return
  }

  if (node.list) {
    node.list.removeNode(node);
  }

  var head = this.head;
  node.list = this;
  node.next = head;
  if (head) {
    head.prev = node;
  }

  this.head = node;
  if (!this.tail) {
    this.tail = node;
  }
  this.length++;
};

Yallist.prototype.pushNode = function (node) {
  if (node === this.tail) {
    return
  }

  if (node.list) {
    node.list.removeNode(node);
  }

  var tail = this.tail;
  node.list = this;
  node.prev = tail;
  if (tail) {
    tail.next = node;
  }

  this.tail = node;
  if (!this.head) {
    this.head = node;
  }
  this.length++;
};

Yallist.prototype.push = function () {
  for (var i = 0, l = arguments.length; i < l; i++) {
    push(this, arguments[i]);
  }
  return this.length
};

Yallist.prototype.unshift = function () {
  for (var i = 0, l = arguments.length; i < l; i++) {
    unshift(this, arguments[i]);
  }
  return this.length
};

Yallist.prototype.pop = function () {
  if (!this.tail) {
    return undefined
  }

  var res = this.tail.value;
  this.tail = this.tail.prev;
  if (this.tail) {
    this.tail.next = null;
  } else {
    this.head = null;
  }
  this.length--;
  return res
};

Yallist.prototype.shift = function () {
  if (!this.head) {
    return undefined
  }

  var res = this.head.value;
  this.head = this.head.next;
  if (this.head) {
    this.head.prev = null;
  } else {
    this.tail = null;
  }
  this.length--;
  return res
};

Yallist.prototype.forEach = function (fn, thisp) {
  thisp = thisp || this;
  for (var walker = this.head, i = 0; walker !== null; i++) {
    fn.call(thisp, walker.value, i, this);
    walker = walker.next;
  }
};

Yallist.prototype.forEachReverse = function (fn, thisp) {
  thisp = thisp || this;
  for (var walker = this.tail, i = this.length - 1; walker !== null; i--) {
    fn.call(thisp, walker.value, i, this);
    walker = walker.prev;
  }
};

Yallist.prototype.get = function (n) {
  for (var i = 0, walker = this.head; walker !== null && i < n; i++) {
    // abort out of the list early if we hit a cycle
    walker = walker.next;
  }
  if (i === n && walker !== null) {
    return walker.value
  }
};

Yallist.prototype.getReverse = function (n) {
  for (var i = 0, walker = this.tail; walker !== null && i < n; i++) {
    // abort out of the list early if we hit a cycle
    walker = walker.prev;
  }
  if (i === n && walker !== null) {
    return walker.value
  }
};

Yallist.prototype.map = function (fn, thisp) {
  thisp = thisp || this;
  var res = new Yallist();
  for (var walker = this.head; walker !== null;) {
    res.push(fn.call(thisp, walker.value, this));
    walker = walker.next;
  }
  return res
};

Yallist.prototype.mapReverse = function (fn, thisp) {
  thisp = thisp || this;
  var res = new Yallist();
  for (var walker = this.tail; walker !== null;) {
    res.push(fn.call(thisp, walker.value, this));
    walker = walker.prev;
  }
  return res
};

Yallist.prototype.reduce = function (fn, initial) {
  var acc;
  var walker = this.head;
  if (arguments.length > 1) {
    acc = initial;
  } else if (this.head) {
    walker = this.head.next;
    acc = this.head.value;
  } else {
    throw new TypeError('Reduce of empty list with no initial value')
  }

  for (var i = 0; walker !== null; i++) {
    acc = fn(acc, walker.value, i);
    walker = walker.next;
  }

  return acc
};

Yallist.prototype.reduceReverse = function (fn, initial) {
  var acc;
  var walker = this.tail;
  if (arguments.length > 1) {
    acc = initial;
  } else if (this.tail) {
    walker = this.tail.prev;
    acc = this.tail.value;
  } else {
    throw new TypeError('Reduce of empty list with no initial value')
  }

  for (var i = this.length - 1; walker !== null; i--) {
    acc = fn(acc, walker.value, i);
    walker = walker.prev;
  }

  return acc
};

Yallist.prototype.toArray = function () {
  var arr = new Array(this.length);
  for (var i = 0, walker = this.head; walker !== null; i++) {
    arr[i] = walker.value;
    walker = walker.next;
  }
  return arr
};

Yallist.prototype.toArrayReverse = function () {
  var arr = new Array(this.length);
  for (var i = 0, walker = this.tail; walker !== null; i++) {
    arr[i] = walker.value;
    walker = walker.prev;
  }
  return arr
};

Yallist.prototype.slice = function (from, to) {
  to = to || this.length;
  if (to < 0) {
    to += this.length;
  }
  from = from || 0;
  if (from < 0) {
    from += this.length;
  }
  var ret = new Yallist();
  if (to < from || to < 0) {
    return ret
  }
  if (from < 0) {
    from = 0;
  }
  if (to > this.length) {
    to = this.length;
  }
  for (var i = 0, walker = this.head; walker !== null && i < from; i++) {
    walker = walker.next;
  }
  for (; walker !== null && i < to; i++, walker = walker.next) {
    ret.push(walker.value);
  }
  return ret
};

Yallist.prototype.sliceReverse = function (from, to) {
  to = to || this.length;
  if (to < 0) {
    to += this.length;
  }
  from = from || 0;
  if (from < 0) {
    from += this.length;
  }
  var ret = new Yallist();
  if (to < from || to < 0) {
    return ret
  }
  if (from < 0) {
    from = 0;
  }
  if (to > this.length) {
    to = this.length;
  }
  for (var i = this.length, walker = this.tail; walker !== null && i > to; i--) {
    walker = walker.prev;
  }
  for (; walker !== null && i > from; i--, walker = walker.prev) {
    ret.push(walker.value);
  }
  return ret
};

Yallist.prototype.reverse = function () {
  var head = this.head;
  var tail = this.tail;
  for (var walker = head; walker !== null; walker = walker.prev) {
    var p = walker.prev;
    walker.prev = walker.next;
    walker.next = p;
  }
  this.head = tail;
  this.tail = head;
  return this
};

function push (self, item) {
  self.tail = new Node(item, self.tail, null, self);
  if (!self.head) {
    self.head = self.tail;
  }
  self.length++;
}

function unshift (self, item) {
  self.head = new Node(item, null, self.head, self);
  if (!self.tail) {
    self.tail = self.head;
  }
  self.length++;
}

function Node (value, prev, next, list) {
  if (!(this instanceof Node)) {
    return new Node(value, prev, next, list)
  }

  this.list = list;
  this.value = value;

  if (prev) {
    prev.next = this;
    this.prev = prev;
  } else {
    this.prev = null;
  }

  if (next) {
    next.prev = this;
    this.next = next;
  } else {
    this.next = null;
  }
}

var lruCache = LRUCache;

// This will be a proper iterable 'Map' in engines that support it,
// or a fakey-fake PseudoMap in older versions.



// A linked list to keep track of recently-used-ness


// use symbols if possible, otherwise just _props
var hasSymbol = typeof Symbol === 'function';
var makeSymbol;
if (hasSymbol) {
  makeSymbol = function (key) {
    return Symbol.for(key)
  };
} else {
  makeSymbol = function (key) {
    return '_' + key
  };
}

var MAX = makeSymbol('max');
var LENGTH = makeSymbol('length');
var LENGTH_CALCULATOR = makeSymbol('lengthCalculator');
var ALLOW_STALE = makeSymbol('allowStale');
var MAX_AGE = makeSymbol('maxAge');
var DISPOSE = makeSymbol('dispose');
var NO_DISPOSE_ON_SET = makeSymbol('noDisposeOnSet');
var LRU_LIST = makeSymbol('lruList');
var CACHE = makeSymbol('cache');

function naiveLength () { return 1 }

// lruList is a yallist where the head is the youngest
// item, and the tail is the oldest.  the list contains the Hit
// objects as the entries.
// Each Hit object has a reference to its Yallist.Node.  This
// never changes.
//
// cache is a Map (or PseudoMap) that matches the keys to
// the Yallist.Node object.
function LRUCache (options) {
  if (!(this instanceof LRUCache)) {
    return new LRUCache(options)
  }

  if (typeof options === 'number') {
    options = { max: options };
  }

  if (!options) {
    options = {};
  }

  var max = this[MAX] = options.max;
  // Kind of weird to have a default max of Infinity, but oh well.
  if (!max ||
      !(typeof max === 'number') ||
      max <= 0) {
    this[MAX] = Infinity;
  }

  var lc = options.length || naiveLength;
  if (typeof lc !== 'function') {
    lc = naiveLength;
  }
  this[LENGTH_CALCULATOR] = lc;

  this[ALLOW_STALE] = options.stale || false;
  this[MAX_AGE] = options.maxAge || 0;
  this[DISPOSE] = options.dispose;
  this[NO_DISPOSE_ON_SET] = options.noDisposeOnSet || false;
  this.reset();
}

// resize the cache when the max changes.
Object.defineProperty(LRUCache.prototype, 'max', {
  set: function (mL) {
    if (!mL || !(typeof mL === 'number') || mL <= 0) {
      mL = Infinity;
    }
    this[MAX] = mL;
    trim(this);
  },
  get: function () {
    return this[MAX]
  },
  enumerable: true
});

Object.defineProperty(LRUCache.prototype, 'allowStale', {
  set: function (allowStale) {
    this[ALLOW_STALE] = !!allowStale;
  },
  get: function () {
    return this[ALLOW_STALE]
  },
  enumerable: true
});

Object.defineProperty(LRUCache.prototype, 'maxAge', {
  set: function (mA) {
    if (!mA || !(typeof mA === 'number') || mA < 0) {
      mA = 0;
    }
    this[MAX_AGE] = mA;
    trim(this);
  },
  get: function () {
    return this[MAX_AGE]
  },
  enumerable: true
});

// resize the cache when the lengthCalculator changes.
Object.defineProperty(LRUCache.prototype, 'lengthCalculator', {
  set: function (lC) {
    if (typeof lC !== 'function') {
      lC = naiveLength;
    }
    if (lC !== this[LENGTH_CALCULATOR]) {
      this[LENGTH_CALCULATOR] = lC;
      this[LENGTH] = 0;
      this[LRU_LIST].forEach(function (hit) {
        hit.length = this[LENGTH_CALCULATOR](hit.value, hit.key);
        this[LENGTH] += hit.length;
      }, this);
    }
    trim(this);
  },
  get: function () { return this[LENGTH_CALCULATOR] },
  enumerable: true
});

Object.defineProperty(LRUCache.prototype, 'length', {
  get: function () { return this[LENGTH] },
  enumerable: true
});

Object.defineProperty(LRUCache.prototype, 'itemCount', {
  get: function () { return this[LRU_LIST].length },
  enumerable: true
});

LRUCache.prototype.rforEach = function (fn, thisp) {
  thisp = thisp || this;
  for (var walker = this[LRU_LIST].tail; walker !== null;) {
    var prev = walker.prev;
    forEachStep(this, fn, walker, thisp);
    walker = prev;
  }
};

function forEachStep (self, fn, node, thisp) {
  var hit = node.value;
  if (isStale(self, hit)) {
    del(self, node);
    if (!self[ALLOW_STALE]) {
      hit = undefined;
    }
  }
  if (hit) {
    fn.call(thisp, hit.value, hit.key, self);
  }
}

LRUCache.prototype.forEach = function (fn, thisp) {
  thisp = thisp || this;
  for (var walker = this[LRU_LIST].head; walker !== null;) {
    var next = walker.next;
    forEachStep(this, fn, walker, thisp);
    walker = next;
  }
};

LRUCache.prototype.keys = function () {
  return this[LRU_LIST].toArray().map(function (k) {
    return k.key
  }, this)
};

LRUCache.prototype.values = function () {
  return this[LRU_LIST].toArray().map(function (k) {
    return k.value
  }, this)
};

LRUCache.prototype.reset = function () {
  if (this[DISPOSE] &&
      this[LRU_LIST] &&
      this[LRU_LIST].length) {
    this[LRU_LIST].forEach(function (hit) {
      this[DISPOSE](hit.key, hit.value);
    }, this);
  }

  this[CACHE] = new map(); // hash of items by key
  this[LRU_LIST] = new yallist(); // list of items in order of use recency
  this[LENGTH] = 0; // length of items in the list
};

LRUCache.prototype.dump = function () {
  return this[LRU_LIST].map(function (hit) {
    if (!isStale(this, hit)) {
      return {
        k: hit.key,
        v: hit.value,
        e: hit.now + (hit.maxAge || 0)
      }
    }
  }, this).toArray().filter(function (h) {
    return h
  })
};

LRUCache.prototype.dumpLru = function () {
  return this[LRU_LIST]
};

LRUCache.prototype.inspect = function (n, opts) {
  var str = 'LRUCache {';
  var extras = false;

  var as = this[ALLOW_STALE];
  if (as) {
    str += '\n  allowStale: true';
    extras = true;
  }

  var max = this[MAX];
  if (max && max !== Infinity) {
    if (extras) {
      str += ',';
    }
    str += '\n  max: ' + util.inspect(max, opts);
    extras = true;
  }

  var maxAge = this[MAX_AGE];
  if (maxAge) {
    if (extras) {
      str += ',';
    }
    str += '\n  maxAge: ' + util.inspect(maxAge, opts);
    extras = true;
  }

  var lc = this[LENGTH_CALCULATOR];
  if (lc && lc !== naiveLength) {
    if (extras) {
      str += ',';
    }
    str += '\n  length: ' + util.inspect(this[LENGTH], opts);
    extras = true;
  }

  var didFirst = false;
  this[LRU_LIST].forEach(function (item) {
    if (didFirst) {
      str += ',\n  ';
    } else {
      if (extras) {
        str += ',\n';
      }
      didFirst = true;
      str += '\n  ';
    }
    var key = util.inspect(item.key).split('\n').join('\n  ');
    var val = { value: item.value };
    if (item.maxAge !== maxAge) {
      val.maxAge = item.maxAge;
    }
    if (lc !== naiveLength) {
      val.length = item.length;
    }
    if (isStale(this, item)) {
      val.stale = true;
    }

    val = util.inspect(val, opts).split('\n').join('\n  ');
    str += key + ' => ' + val;
  });

  if (didFirst || extras) {
    str += '\n';
  }
  str += '}';

  return str
};

LRUCache.prototype.set = function (key, value, maxAge) {
  maxAge = maxAge || this[MAX_AGE];

  var now = maxAge ? Date.now() : 0;
  var len = this[LENGTH_CALCULATOR](value, key);

  if (this[CACHE].has(key)) {
    if (len > this[MAX]) {
      del(this, this[CACHE].get(key));
      return false
    }

    var node = this[CACHE].get(key);
    var item = node.value;

    // dispose of the old one before overwriting
    // split out into 2 ifs for better coverage tracking
    if (this[DISPOSE]) {
      if (!this[NO_DISPOSE_ON_SET]) {
        this[DISPOSE](key, item.value);
      }
    }

    item.now = now;
    item.maxAge = maxAge;
    item.value = value;
    this[LENGTH] += len - item.length;
    item.length = len;
    this.get(key);
    trim(this);
    return true
  }

  var hit = new Entry(key, value, len, now, maxAge);

  // oversized objects fall out of cache automatically.
  if (hit.length > this[MAX]) {
    if (this[DISPOSE]) {
      this[DISPOSE](key, value);
    }
    return false
  }

  this[LENGTH] += hit.length;
  this[LRU_LIST].unshift(hit);
  this[CACHE].set(key, this[LRU_LIST].head);
  trim(this);
  return true
};

LRUCache.prototype.has = function (key) {
  if (!this[CACHE].has(key)) return false
  var hit = this[CACHE].get(key).value;
  if (isStale(this, hit)) {
    return false
  }
  return true
};

LRUCache.prototype.get = function (key) {
  return get(this, key, true)
};

LRUCache.prototype.peek = function (key) {
  return get(this, key, false)
};

LRUCache.prototype.pop = function () {
  var node = this[LRU_LIST].tail;
  if (!node) return null
  del(this, node);
  return node.value
};

LRUCache.prototype.del = function (key) {
  del(this, this[CACHE].get(key));
};

LRUCache.prototype.load = function (arr) {
  // reset the cache
  this.reset();

  var now = Date.now();
  // A previous serialized cache has the most recent items first
  for (var l = arr.length - 1; l >= 0; l--) {
    var hit = arr[l];
    var expiresAt = hit.e || 0;
    if (expiresAt === 0) {
      // the item was created without expiration in a non aged cache
      this.set(hit.k, hit.v);
    } else {
      var maxAge = expiresAt - now;
      // dont add already expired items
      if (maxAge > 0) {
        this.set(hit.k, hit.v, maxAge);
      }
    }
  }
};

LRUCache.prototype.prune = function () {
  var self = this;
  this[CACHE].forEach(function (value, key) {
    get(self, key, false);
  });
};

function get (self, key, doUse) {
  var node = self[CACHE].get(key);
  if (node) {
    var hit = node.value;
    if (isStale(self, hit)) {
      del(self, node);
      if (!self[ALLOW_STALE]) hit = undefined;
    } else {
      if (doUse) {
        self[LRU_LIST].unshiftNode(node);
      }
    }
    if (hit) hit = hit.value;
  }
  return hit
}

function isStale (self, hit) {
  if (!hit || (!hit.maxAge && !self[MAX_AGE])) {
    return false
  }
  var stale = false;
  var diff = Date.now() - hit.now;
  if (hit.maxAge) {
    stale = diff > hit.maxAge;
  } else {
    stale = self[MAX_AGE] && (diff > self[MAX_AGE]);
  }
  return stale
}

function trim (self) {
  if (self[LENGTH] > self[MAX]) {
    for (var walker = self[LRU_LIST].tail;
         self[LENGTH] > self[MAX] && walker !== null;) {
      // We know that we're about to delete this one, and also
      // what the next least recently used key will be, so just
      // go ahead and set it now.
      var prev = walker.prev;
      del(self, walker);
      walker = prev;
    }
  }
}

function del (self, node) {
  if (node) {
    var hit = node.value;
    if (self[DISPOSE]) {
      self[DISPOSE](hit.key, hit.value);
    }
    self[LENGTH] -= hit.length;
    self[CACHE].delete(hit.key);
    self[LRU_LIST].removeNode(node);
  }
}

// classy, since V8 prefers predictable objects.
function Entry (key, value, length, now, maxAge) {
  this.key = key;
  this.value = value;
  this.length = length;
  this.now = now;
  this.maxAge = maxAge || 0;
}

var sigmund_1 = sigmund;
function sigmund (subject, maxSessions) {
    maxSessions = maxSessions || 10;
    var notes = [];
    var analysis = '';
    var RE = RegExp;

    function psychoAnalyze (subject, session) {
        if (session > maxSessions) return;

        if (typeof subject === 'function' ||
            typeof subject === 'undefined') {
            return;
        }

        if (typeof subject !== 'object' || !subject ||
            (subject instanceof RE)) {
            analysis += subject;
            return;
        }

        if (notes.indexOf(subject) !== -1 || session === maxSessions) return;

        notes.push(subject);
        analysis += '{';
        Object.keys(subject).forEach(function (issue, _, __) {
            // pseudo-private values.  skip those.
            if (issue.charAt(0) === '_') return;
            var to = typeof subject[issue];
            if (to === 'function' || to === 'undefined') return;
            analysis += issue;
            psychoAnalyze(subject[issue], session + 1);
        });
    }
    psychoAnalyze(subject, 0);
    return analysis;
}

// vim: set softtabstop=4 shiftwidth=4:

var fnmatch = createCommonjsModule(function (module, exports) {
// Based on minimatch.js by isaacs <https://npmjs.org/package/minimatch>

  var platform = typeof process === "object" ? process.platform : "win32";

  if (module) module.exports = minimatch;
  else exports.minimatch = minimatch;

  minimatch.Minimatch = Minimatch;

  var cache = minimatch.cache = new lruCache({max: 100})
    , GLOBSTAR = minimatch.GLOBSTAR = Minimatch.GLOBSTAR = {};

  var qmark = "[^/]"

    // * => any number of characters
    , star = qmark + "*?"

    // ** when dots are allowed.  Anything goes, except .. and .
    // not (^ or / followed by one or two dots followed by $ or /),
    // followed by anything, any number of times.
    , twoStarDot = "(?:(?!(?:\\\/|^)(?:\\.{1,2})($|\\\/)).)*?"

    // not a ^ or / followed by a dot,
    // followed by anything, any number of times.
    , twoStarNoDot = "(?:(?!(?:\\\/|^)\\.).)*?"

    // characters that need to be escaped in RegExp.
    , reSpecials = charSet("().*{}+?[]^$\\!");

// "abc" -> { a:true, b:true, c:true }
  function charSet (s) {
    return s.split("").reduce(function (set, c) {
      set[c] = true;
      return set
    }, {})
  }

// normalizes slashes.
  var slashSplit = /\/+/;

  minimatch.monkeyPatch = monkeyPatch;
  function monkeyPatch () {
    var desc = Object.getOwnPropertyDescriptor(String.prototype, "match");
    var orig = desc.value;
    desc.value = function (p) {
      if (p instanceof Minimatch) return p.match(this)
      return orig.call(this, p)
    };
    Object.defineProperty(String.prototype, desc);
  }

  minimatch.filter = filter;
  function filter (pattern, options) {
    options = options || {};
    return function (p, i, list) {
      return minimatch(p, pattern, options)
    }
  }

  function ext (a, b) {
    a = a || {};
    b = b || {};
    var t = {};
    Object.keys(b).forEach(function (k) {
      t[k] = b[k];
    });
    Object.keys(a).forEach(function (k) {
      t[k] = a[k];
    });
    return t
  }

  minimatch.defaults = function (def) {
    if (!def || !Object.keys(def).length) return minimatch

    var orig = minimatch;

    var m = function minimatch (p, pattern, options) {
      return orig.minimatch(p, pattern, ext(def, options))
    };

    m.Minimatch = function Minimatch (pattern, options) {
      return new orig.Minimatch(pattern, ext(def, options))
    };

    return m
  };

  Minimatch.defaults = function (def) {
    if (!def || !Object.keys(def).length) return Minimatch
    return minimatch.defaults(def).Minimatch
  };


  function minimatch (p, pattern, options) {
    if (typeof pattern !== "string") {
      throw new TypeError("glob pattern string required")
    }

    if (!options) options = {};

        // shortcut: comments match nothing.
    if (!options.nocomment && pattern.charAt(0) === "#") {
      return false
    }

    // "" only matches ""
    if (pattern.trim() === "") return p === ""

    return new Minimatch(pattern, options).match(p)
  }

  function Minimatch (pattern, options) {
    if (!(this instanceof Minimatch)) {
      return new Minimatch(pattern, options, cache)
    }

    if (typeof pattern !== "string") {
      throw new TypeError("glob pattern string required")
    }

    if (!options) options = {};

        // windows: need to use /, not \
        // On other platforms, \ is a valid (albeit bad) filename char.
    if (platform === "win32") {
      pattern = pattern.split("\\").join("/");
    }

    // lru storage.
    // these things aren't particularly big, but walking down the string
    // and turning it into a regexp can get pretty costly.
    var cacheKey = pattern + "\n" + sigmund_1(options);
    var cached = minimatch.cache.get(cacheKey);
    if (cached) return cached
    minimatch.cache.set(cacheKey, this);

    this.options = options;
    this.set = [];
    this.pattern = pattern;
    this.regexp = null;
    this.negate = false;
    this.comment = false;
    this.empty = false;

      // make the set of regexps etc.
    this.make();
  }

  Minimatch.prototype.make = make;
  function make () {
    // don't do it more than once.
    if (this._made) return

    var pattern = this.pattern;
    var options = this.options;

      // empty patterns and comments match nothing.
    if (!options.nocomment && pattern.charAt(0) === "#") {
      this.comment = true;
      return
    }
    if (!pattern) {
      this.empty = true;
      return
    }

    // step 1: figure out negation, etc.
    this.parseNegate();

      // step 2: expand braces
    var set = this.globSet = this.braceExpand();

    if (options.debug) console.error(this.pattern, set);

        // step 3: now we have a set, so turn each one into a series of path-portion
        // matching patterns.
        // These will be regexps, except in the case of "**", which is
        // set to the GLOBSTAR object for globstar behavior,
        // and will not contain any / characters
    set = this.globParts = set.map(function (s) {
        return s.split(slashSplit)
      });

    if (options.debug) console.error(this.pattern, set);

        // glob --> regexps
    set = set.map(function (s, si, set) {
      return s.map(this.parse, this)
    }, this);

    if (options.debug) console.error(this.pattern, set);

        // filter out everything that didn't compile properly.
    set = set.filter(function (s) {
      return -1 === s.indexOf(false)
    });

    if (options.debug) console.error(this.pattern, set);

    this.set = set;
  }

  Minimatch.prototype.parseNegate = parseNegate;
  function parseNegate () {
    var pattern = this.pattern
      , negate = false
      , options = this.options
      , negateOffset = 0;

    if (options.nonegate) return

    for ( var i = 0, l = pattern.length
      ; i < l && pattern.charAt(i) === "!"
      ; i ++) {
      negate = !negate;
      negateOffset ++;
    }

    if (negateOffset) this.pattern = pattern.substr(negateOffset);
    this.negate = negate;
  }

// Brace expansion:
// a{b,c}d -> abd acd
// a{b,}c -> abc ac
// a{0..3}d -> a0d a1d a2d a3d
// a{b,c{d,e}f}g -> abg acdfg acefg
// a{b,c}d{e,f}g -> abdeg acdeg abdeg abdfg
//
// Invalid sets are not expanded.
// a{2..}b -> a{2..}b
// a{b}c -> a{b}c
  minimatch.braceExpand = function (pattern, options) {
    return new Minimatch(pattern, options).braceExpand()
  };

  Minimatch.prototype.braceExpand = braceExpand;
  function braceExpand (pattern, options) {
    options = options || this.options;
    pattern = typeof pattern === "undefined"
        ? this.pattern : pattern;

    if (typeof pattern === "undefined") {
      throw new Error("undefined pattern")
    }

    if (options.nobrace ||
      !pattern.match(/\{.*\}/)) {
      // shortcut. no need to expand.
      return [pattern]
    }

    var escaping = false;

      // examples and comments refer to this crazy pattern:
      // a{b,c{d,e},{f,g}h}x{y,z}
      // expected:
      // abxy
      // abxz
      // acdxy
      // acdxz
      // acexy
      // acexz
      // afhxy
      // afhxz
      // aghxy
      // aghxz

      // everything before the first \{ is just a prefix.
      // So, we pluck that off, and work with the rest,
      // and then prepend it to everything we find.
    if (pattern.charAt(0) !== "{") {
      // console.error(pattern)
      var prefix = null;
      for (var i = 0, l = pattern.length; i < l; i ++) {
        var c = pattern.charAt(i);
          // console.error(i, c)
        if (c === "\\") {
          escaping = !escaping;
        } else if (c === "{" && !escaping) {
          prefix = pattern.substr(0, i);
          break
        }
      }

      // actually no sets, all { were escaped.
      if (prefix === null) {
        // console.error("no sets")
        return [pattern]
      }

      var tail = braceExpand(pattern.substr(i), options);
      return tail.map(function (t) {
        return prefix + t
      })
    }

    // now we have something like:
    // {b,c{d,e},{f,g}h}x{y,z}
    // walk through the set, expanding each part, until
    // the set ends.  then, we'll expand the suffix.
    // If the set only has a single member, then'll put the {} back

    // first, handle numeric sets, since they're easier
    var numset = pattern.match(/^\{(-?[0-9]+)\.\.(-?[0-9]+)\}/);
    if (numset) {
      // console.error("numset", numset[1], numset[2])
      var suf = braceExpand(pattern.substr(numset[0].length), options)
        , start = +numset[1]
        , end = +numset[2]
        , inc = start > end ? -1 : 1
        , set = [];
      for (var i = start; i != (end + inc); i += inc) {
        // append all the suffixes
        for (var ii = 0, ll = suf.length; ii < ll; ii ++) {
          set.push(i + suf[ii]);
        }
      }
      return set
    }

    // ok, walk through the set
    // We hope, somewhat optimistically, that there
    // will be a } at the end.
    // If the closing brace isn't found, then the pattern is
    // interpreted as braceExpand("\\" + pattern) so that
    // the leading \{ will be interpreted literally.
    var i = 1 // skip the \{
      , depth = 1
      , set = []
      , member = ""
      , sawEnd = false
      , escaping = false;

    function addMember () {
      set.push(member);
      member = "";
    }

    // console.error("Entering for")
    FOR: for (i = 1, l = pattern.length; i < l; i ++) {
        var c = pattern.charAt(i);
          // console.error("", i, c)

        if (escaping) {
          escaping = false;
          member += "\\" + c;
        } else {
          switch (c) {
            case "\\":
              escaping = true;
              continue

            case "{":
              depth ++;
              member += "{";
              continue

            case "}":
              depth --;
                // if this closes the actual set, then we're done
              if (depth === 0) {
                addMember();
                  // pluck off the close-brace
                i ++;
                break FOR
              } else {
                member += c;
                continue
              }

            case ",":
              if (depth === 1) {
                addMember();
              } else {
                member += c;
              }
              continue

            default:
              member += c;
              continue
          } // switch
        } // else
      } // for

    // now we've either finished the set, and the suffix is
    // pattern.substr(i), or we have *not* closed the set,
    // and need to escape the leading brace
    if (depth !== 0) {
      // console.error("didn't close", pattern)
      return braceExpand("\\" + pattern, options)
    }

    // x{y,z} -> ["xy", "xz"]
    // console.error("set", set)
    // console.error("suffix", pattern.substr(i))
    var suf = braceExpand(pattern.substr(i), options);
      // ["b", "c{d,e}","{f,g}h"] ->
      //   [["b"], ["cd", "ce"], ["fh", "gh"]]
    var addBraces = set.length === 1;
      // console.error("set pre-expanded", set)
    set = set.map(function (p) {
      return braceExpand(p, options)
    });
      // console.error("set expanded", set)


      // [["b"], ["cd", "ce"], ["fh", "gh"]] ->
      //   ["b", "cd", "ce", "fh", "gh"]
    set = set.reduce(function (l, r) {
      return l.concat(r)
    });

    if (addBraces) {
      set = set.map(function (s) {
        return "{" + s + "}"
      });
    }

    // now attach the suffixes.
    var ret = [];
    for (var i = 0, l = set.length; i < l; i ++) {
      for (var ii = 0, ll = suf.length; ii < ll; ii ++) {
        ret.push(set[i] + suf[ii]);
      }
    }
    return ret
  }

// parse a component of the expanded set.
// At this point, no pattern may contain "/" in it
// so we're going to return a 2d array, where each entry is the full
// pattern, split on '/', and then turned into a regular expression.
// A regexp is made at the end which joins each array with an
// escaped /, and another full one which joins each regexp with |.
//
// Following the lead of Bash 4.1, note that "**" only has special meaning
// when it is the *only* thing in a path portion.  Otherwise, any series
// of * is equivalent to a single *.  Globstar behavior is enabled by
// default, and can be disabled by setting options.noglobstar.
  Minimatch.prototype.parse = parse;
  var SUBPARSE = {};
  function parse (pattern, isSub) {
    var options = this.options;

      // shortcuts
    if (!options.noglobstar && pattern === "**") return GLOBSTAR
    if (pattern === "") return ""

    var re = ""
      , hasMagic = !!options.nocase
      , escaping = false
      // ? => one single character
      , patternListStack = []
      , plType
      , stateChar
      , inClass = false
      , reClassStart = -1
      , classStart = -1
      // . and .. never match anything that doesn't start with .,
      // even when options.dot is set.
      , patternStart = pattern.charAt(0) === "." ? "" // anything
        // not (start or / followed by . or .. followed by / or end)
        : options.dot ? "(?!(?:^|\\\/)\\.{1,2}(?:$|\\\/))"
          : "(?!\\.)";

    function clearStateChar () {
      if (stateChar) {
        // we had some state-tracking character
        // that wasn't consumed by this pass.
        switch (stateChar) {
          case "*":
            re += star;
            hasMagic = true;
            break
          case "?":
            re += qmark;
            hasMagic = true;
            break
          default:
            re += "\\"+stateChar;
            break
        }
        stateChar = false;
      }
    }

    for ( var i = 0, len = pattern.length, c
      ; (i < len) && (c = pattern.charAt(i))
      ; i ++ ) {

      if (options.debug) {
        console.error("%s\t%s %s %j", pattern, i, re, c);
      }

      // skip over any that are escaped.
      if (escaping && reSpecials[c]) {
        re += "\\" + c;
        escaping = false;
        continue
      }

      SWITCH: switch (c) {
          case "/":
            // completely not allowed, even escaped.
            // Should already be path-split by now.
            return false

          case "\\":
            clearStateChar();
            escaping = true;
            continue

          // the various stateChar values
          // for the "extglob" stuff.
          case "?":
          case "*":
          case "+":
          case "@":
          case "!":
            if (options.debug) {
              console.error("%s\t%s %s %j <-- stateChar", pattern, i, re, c);
            }

            // all of those are literals inside a class, except that
            // the glob [!a] means [^a] in regexp
            if (inClass) {
              if (c === "!" && i === classStart + 1) c = "^";
              re += c;
              continue
            }

            // if we already have a stateChar, then it means
            // that there was something like ** or +? in there.
            // Handle the stateChar, then proceed with this one.
            clearStateChar();
            stateChar = c;
              // if extglob is disabled, then +(asdf|foo) isn't a thing.
              // just clear the statechar *now*, rather than even diving into
              // the patternList stuff.
            if (options.noext) clearStateChar();
            continue

          case "(":
            if (inClass) {
              re += "(";
              continue
            }

            if (!stateChar) {
              re += "\\(";
              continue
            }

            plType = stateChar;
            patternListStack.push({ type: plType
              , start: i - 1
              , reStart: re.length });
              // negation is (?:(?!js)[^/]*)
            re += stateChar === "!" ? "(?:(?!" : "(?:";
            stateChar = false;
            continue

          case ")":
            if (inClass || !patternListStack.length) {
              re += "\\)";
              continue
            }

            hasMagic = true;
            re += ")";
            plType = patternListStack.pop().type;
              // negation is (?:(?!js)[^/]*)
              // The others are (?:<pattern>)<type>
            switch (plType) {
              case "!":
                re += "[^/]*?)";
                break
              case "?":
              case "+":
              case "*": re += plType;
              case "@": break // the default anyway
            }
            continue

          case "|":
            if (inClass || !patternListStack.length || escaping) {
              re += "\\|";
              escaping = false;
              continue
            }

            re += "|";
            continue

          // these are mostly the same in regexp and glob
          case "[":
            // swallow any state-tracking char before the [
            clearStateChar();

            if (inClass) {
              re += "\\" + c;
              continue
            }

            inClass = true;
            classStart = i;
            reClassStart = re.length;
            re += c;
            continue

          case "]":
            //  a right bracket shall lose its special
            //  meaning and represent itself in
            //  a bracket expression if it occurs
            //  first in the list.  -- POSIX.2 2.8.3.2
            if (i === classStart + 1 || !inClass) {
              re += "\\" + c;
              escaping = false;
              continue
            }

            // finish up the class.
            hasMagic = true;
            inClass = false;
            re += c;
            continue

          default:
            // swallow any state char that wasn't consumed
            clearStateChar();

            if (escaping) {
              // no need
              escaping = false;
            } else if (reSpecials[c]
              && !(c === "^" && inClass)) {
              re += "\\";
            }

            re += c;

        } // switch
    } // for


    // handle the case where we left a class open.
    // "[abc" is valid, equivalent to "\[abc"
    if (inClass) {
      // split where the last [ was, and escape it
      // this is a huge pita.  We now have to re-walk
      // the contents of the would-be class to re-translate
      // any characters that were passed through as-is
      var cs = pattern.substr(classStart + 1)
        , sp = this.parse(cs, SUBPARSE);
      re = re.substr(0, reClassStart) + "\\[" + sp[0];
      hasMagic = hasMagic || sp[1];
    }

    // handle the case where we had a +( thing at the *end*
    // of the pattern.
    // each pattern list stack adds 3 chars, and we need to go through
    // and escape any | chars that were passed through as-is for the regexp.
    // Go through and escape them, taking care not to double-escape any
    // | chars that were already escaped.
    var pl;
    while (pl = patternListStack.pop()) {
      var tail = re.slice(pl.reStart + 3);
        // maybe some even number of \, then maybe 1 \, followed by a |
      tail = tail.replace(/((?:\\{2})*)(\\?)\|/g, function (_, $1, $2) {
        if (!$2) {
          // the | isn't already escaped, so escape it.
          $2 = "\\";
        }

        // need to escape all those slashes *again*, without escaping the
        // one that we need for escaping the | character.  As it works out,
        // escaping an even number of slashes can be done by simply repeating
        // it exactly after itself.  That's why this trick works.
        //
        // I am sorry that you have to see this.
        return $1 + $1 + $2 + "|"
      });

        // console.error("tail=%j\n   %s", tail, tail)
      var t = pl.type === "*" ? star
          : pl.type === "?" ? qmark
            : "\\" + pl.type;

      hasMagic = true;
      re = re.slice(0, pl.reStart)
        + t + "\\("
        + tail;
    }

    // handle trailing things that only matter at the very end.
    clearStateChar();
    if (escaping) {
      // trailing \\
      re += "\\\\";
    }

    // only need to apply the nodot start if the re starts with
    // something that could conceivably capture a dot
    var addPatternStart = false;
    switch (re.charAt(0)) {
      case ".":
      case "[":
      case "(": addPatternStart = true;
    }

    // if the re is not "" at this point, then we need to make sure
    // it doesn't match against an empty path part.
    // Otherwise a/* will match a/, which it should not.
    if (re !== "" && hasMagic) re = "(?=.)" + re;

    if (addPatternStart) re = patternStart + re;

        // parsing just a piece of a larger pattern.
    if (isSub === SUBPARSE) {
      return [ re, hasMagic ]
    }

    // skip the regexp for non-magical patterns
    // unescape anything in it, though, so that it'll be
    // an exact match against a file etc.
    if (!hasMagic) {
      return globUnescape(pattern)
    }

    var flags = options.nocase ? "i" : ""
      , regExp = new RegExp("^" + re + "$", flags);

    regExp._glob = pattern;
    regExp._src = re;

    return regExp
  }

  minimatch.makeRe = function (pattern, options) {
    return new Minimatch(pattern, options || {}).makeRe()
  };

  Minimatch.prototype.makeRe = makeRe;
  function makeRe () {
    if (this.regexp || this.regexp === false) return this.regexp

        // at this point, this.set is a 2d array of partial
        // pattern strings, or "**".
        //
        // It's better to use .match().  This function shouldn't
        // be used, really, but it's pretty convenient sometimes,
        // when you just want to work with a regex.
    var set = this.set;

    if (!set.length) return this.regexp = false
    var options = this.options;

    var twoStar = options.noglobstar ? star
        : options.dot ? twoStarDot
          : twoStarNoDot
      , flags = options.nocase ? "i" : "";

    var re = set.map(function (pattern) {
      return pattern.map(function (p) {
        return (p === GLOBSTAR) ? twoStar
            : (typeof p === "string") ? regExpEscape(p)
              : p._src
      }).join("\\\/")
    }).join("|");

      // must match entire pattern
      // ending in a * or ** will make it less strict.
    re = "^(?:" + re + ")$";

      // can match anything, as long as it's not this.
    if (this.negate) re = "^(?!" + re + ").*$";

    try {
      return this.regexp = new RegExp(re, flags)
    } catch (ex) {
        return this.regexp = false
      }
  }

  minimatch.match = function (list, pattern, options) {
    var mm = new Minimatch(pattern, options);
    list = list.filter(function (f) {
      return mm.match(f)
    });
    if (options.nonull && !list.length) {
      list.push(pattern);
    }
    return list
  };

  Minimatch.prototype.match = match;
  function match (f, partial) {
    // console.error("match", f, this.pattern)
    // short-circuit in the case of busted things.
    // comments, etc.
    if (this.comment) return false
    if (this.empty) return f === ""

    if (f === "/" && partial) return true

    var options = this.options;

      // windows: need to use /, not \
      // On other platforms, \ is a valid (albeit bad) filename char.
    if (platform === "win32") {
      f = f.split("\\").join("/");
    }

    // treat the test path as a set of pathparts.
    f = f.split(slashSplit);
    if (options.debug) {
      console.error(this.pattern, "split", f);
    }

    // just ONE of the pattern sets in this.set needs to match
    // in order for it to be valid.  If negating, then just one
    // match means that we have failed.
    // Either way, return on the first hit.

    var set = this.set;
      // console.error(this.pattern, "set", set)

    for (var i = 0, l = set.length; i < l; i ++) {
      var pattern = set[i];
      var hit = this.matchOne(f, pattern, partial);
      if (hit) {
        if (options.flipNegate) return true
        return !this.negate
      }
    }

    // didn't get any hits.  this is success if it's a negative
    // pattern, failure otherwise.
    if (options.flipNegate) return false
    return this.negate
  }

// set partial to true to test if, for example,
// "/a/b" matches the start of "/*/b/*/d"
// Partial means, if you run out of file before you run
// out of pattern, then that's fine, as long as all
// the parts match.
  Minimatch.prototype.matchOne = function (file, pattern, partial) {
    var options = this.options;

    if (options.debug) {
      console.error("matchOne",
      { "this": this
        , file: file
        , pattern: pattern });
    }

    if (options.matchBase && pattern.length === 1) {
      file = path.basename(file.join("/")).split("/");
    }

    if (options.debug) {
      console.error("matchOne", file.length, pattern.length);
    }

    for ( var fi = 0
        , pi = 0
        , fl = file.length
        , pl = pattern.length
      ; (fi < fl) && (pi < pl)
      ; fi ++, pi ++ ) {

      if (options.debug) {
        console.error("matchOne loop");
      }
      var p = pattern[pi]
        , f = file[fi];

      if (options.debug) {
        console.error(pattern, p, f);
      }

      // should be impossible.
      // some invalid regexp stuff in the set.
      if (p === false) return false

      if (p === GLOBSTAR) {
        if (options.debug)
          console.error('GLOBSTAR', [pattern, p, f]);

            // "**"
            // a/**/b/**/c would match the following:
            // a/b/x/y/z/c
            // a/x/y/z/b/c
            // a/b/x/b/x/c
            // a/b/c
            // To do this, take the rest of the pattern after
            // the **, and see if it would match the file remainder.
            // If so, return success.
            // If not, the ** "swallows" a segment, and try again.
            // This is recursively awful.
            //
            // a/**/b/**/c matching a/b/x/y/z/c
            // - a matches a
            // - doublestar
            //   - matchOne(b/x/y/z/c, b/**/c)
            //     - b matches b
            //     - doublestar
            //       - matchOne(x/y/z/c, c) -> no
            //       - matchOne(y/z/c, c) -> no
            //       - matchOne(z/c, c) -> no
            //       - matchOne(c, c) yes, hit
        var fr = fi
          , pr = pi + 1;
        if (pr === pl) {
          if (options.debug)
            console.error('** at the end');
              // a ** at the end will just swallow the rest.
              // We have found a match.
              // however, it will not swallow /.x, unless
              // options.dot is set.
              // . and .. are *never* matched by **, for explosively
              // exponential reasons.
          for ( ; fi < fl; fi ++) {
            if (file[fi] === "." || file[fi] === ".." ||
            (!options.dot && file[fi].charAt(0) === ".")) return false
          }
          return true
        }

        // ok, let's see if we can swallow whatever we can.
        WHILE: while (fr < fl) {
            var swallowee = file[fr];

            if (options.debug) {
              console.error('\nglobstar while',
                file, fr, pattern, pr, swallowee);
            }

            // XXX remove this slice.  Just pass the start index.
            if (this.matchOne(file.slice(fr), pattern.slice(pr), partial)) {
              if (options.debug)
                console.error('globstar found match!', fr, fl, swallowee);
                  // found a match.
              return true
            } else {
              // can't swallow "." or ".." ever.
              // can only swallow ".foo" when explicitly asked.
              if (swallowee === "." || swallowee === ".." ||
              (!options.dot && swallowee.charAt(0) === ".")) {
                if (options.debug)
                  console.error("dot detected!", file, fr, pattern, pr);
                break WHILE
              }

              // ** swallows a segment, and continue.
              if (options.debug)
                console.error('globstar swallow a segment, and continue');
              fr ++;
            }
          }
        // no match was found.
        // However, in partial mode, we can't say this is necessarily over.
        // If there's more *pattern* left, then
        if (partial) {
          // ran out of file
          // console.error("\n>>> no match, partial?", file, fr, pattern, pr)
          if (fr === fl) return true
        }
        return false
      }

      // something other than **
      // non-magic patterns just have to match exactly
      // patterns with magic have been turned into regexps.
      var hit;
      if (typeof p === "string") {
        if (options.nocase) {
          hit = f.toLowerCase() === p.toLowerCase();
        } else {
          hit = f === p;
        }
        if (options.debug) {
          console.error("string match", p, f, hit);
        }
      } else {
        hit = f.match(p);
        if (options.debug) {
          console.error("pattern match", p, f, hit);
        }
      }

      if (!hit) return false
    }

    // Note: ending in / means that we'll get a final ""
    // at the end of the pattern.  This can only match a
    // corresponding "" at the end of the file.
    // If the file ends in /, then it can only match a
    // a pattern that ends in /, unless the pattern just
    // doesn't have any more for it. But, a/b/ should *not*
    // match "a/b/*", even though "" matches against the
    // [^/]*? pattern, except in partial mode, where it might
    // simply not be reached yet.
    // However, a/b/ should still satisfy a/*

    // now either we fell off the end of the pattern, or we're done.
    if (fi === fl && pi === pl) {
      // ran out of pattern and filename at the same time.
      // an exact hit!
      return true
    } else if (fi === fl) {
      // ran out of file, but still had pattern left.
      // this is ok if we're doing the match as part of
      // a glob fs traversal.
      return partial
    } else if (pi === pl) {
      // ran out of pattern, still have file left.
      // this is only acceptable if we're on the very last
      // empty segment of a file with a trailing slash.
      // a/* should match a/b/
      var emptyFileEnd = (fi === fl - 1) && (file[fi] === "");
      return emptyFileEnd
    }

    // should be unreachable.
    throw new Error("wtf?")
  };


// replace stuff like \* with *
  function globUnescape (s) {
    return s.replace(/\\(.)/g, "$1")
  }


  function regExpEscape (s) {
    return s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")
  }
});

var ini = createCommonjsModule(function (module, exports) {
"use strict";
// Based on iniparser by shockie <https://npmjs.org/package/iniparser>
var __awaiter = (commonjsGlobal && commonjsGlobal.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (commonjsGlobal && commonjsGlobal.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });

/**
 * define the possible values:
 * section: [section]
 * param: key=value
 * comment: ;this is a comment
 */
var regex = {
    section: /^\s*\[(([^#;]|\\#|\\;)+)\]\s*([#;].*)?$/,
    param: /^\s*([\w\.\-\_]+)\s*[=:]\s*(.*?)\s*([#;].*)?$/,
    comment: /^\s*[#;].*$/,
};
/**
 * Parses an .ini file
 * @param file The location of the .ini file
 */
function parse(file) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    fs.readFile(file, 'utf8', function (err, data) {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve(parseString(data));
                    });
                })];
        });
    });
}
exports.parse = parse;
function parseSync(file) {
    return parseString(fs.readFileSync(file, 'utf8'));
}
exports.parseSync = parseSync;
function parseString(data) {
    var sectionBody = {};
    var sectionName = null;
    var value = [[sectionName, sectionBody]];
    var lines = data.split(/\r\n|\r|\n/);
    lines.forEach(function (line) {
        var match;
        if (regex.comment.test(line)) {
            return;
        }
        if (regex.param.test(line)) {
            match = line.match(regex.param);
            sectionBody[match[1]] =
                match[2];
        }
        else if (regex.section.test(line)) {
            match = line.match(regex.section);
            sectionName = match[1];
            sectionBody = {};
            value.push([sectionName, sectionBody]);
        }
    });
    return value;
}
exports.parseString = parseString;
});

unwrapExports(ini);

var name$1 = "editorconfig";
var version$3 = "0.15.0";
var description$1 = "EditorConfig File Locator and Interpreter for Node.js";
var keywords = ["editorconfig","core"];
var main$1 = "index.js";
var bin$1 = {"editorconfig":"bin/editorconfig"};
var contributors = ["Hong Xu (topbug.net)","Jed Mao (https://github.com/jedmao/)","Trey Hunner (http://treyhunner.com)"];
var directories = {"bin":"./bin","lib":"./lib"};
var scripts$1 = {"clean":"rimraf dist","prebuild":"npm run clean","build":"tsc","pretest":"npm run lint && npm run build && npm run copy && cmake .","test":"ctest .","pretest:ci":"npm run pretest","test:ci":"ctest -VV --output-on-failure .","lint":"npm run eclint && npm run tslint","eclint":"eclint check --indent_size ignore \"src/**\"","tslint":"tslint --project tslint.json","copy":"cpy package.json .npmignore LICENSE README.md CHANGELOG.md dist && cpy src/bin/* dist/bin && cpy src/lib/fnmatch*.* dist/lib","prepub":"npm run lint && npm run build && npm run copy","pub":"npm publish ./dist"};
var repository$1 = {"type":"git","url":"git://github.com/editorconfig/editorconfig-core-js.git"};
var bugs = "https://github.com/editorconfig/editorconfig-core-js/issues";
var author$1 = "EditorConfig Team";
var license$1 = "MIT";
var dependencies$1 = {"@types/commander":"^2.11.0","@types/semver":"^5.4.0","commander":"^2.11.0","lru-cache":"^4.1.1","semver":"^5.4.1","sigmund":"^1.0.1"};
var devDependencies$1 = {"@types/mocha":"^2.2.43","cpy-cli":"^1.0.1","eclint":"^2.4.3","mocha":"^4.0.1","rimraf":"^2.6.2","should":"^13.1.2","tslint":"^5.7.0","typescript":"^2.5.3"};
var _package$2 = {
	name: name$1,
	version: version$3,
	description: description$1,
	keywords: keywords,
	main: main$1,
	bin: bin$1,
	contributors: contributors,
	directories: directories,
	scripts: scripts$1,
	repository: repository$1,
	bugs: bugs,
	author: author$1,
	license: license$1,
	dependencies: dependencies$1,
	devDependencies: devDependencies$1
};

var _package$3 = Object.freeze({
	name: name$1,
	version: version$3,
	description: description$1,
	keywords: keywords,
	main: main$1,
	bin: bin$1,
	contributors: contributors,
	directories: directories,
	scripts: scripts$1,
	repository: repository$1,
	bugs: bugs,
	author: author$1,
	license: license$1,
	dependencies: dependencies$1,
	devDependencies: devDependencies$1,
	default: _package$2
});

var pkg = ( _package$3 && _package$2 ) || _package$3;

var editorconfig = createCommonjsModule(function (module, exports) {
"use strict";
var __awaiter = (commonjsGlobal && commonjsGlobal.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (commonjsGlobal && commonjsGlobal.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });





exports.parseString = ini.parseString;
// tslint:disable-next-line:no-var-requires

var knownProps = {
    end_of_line: true,
    indent_style: true,
    indent_size: true,
    insert_final_newline: true,
    trim_trailing_whitespace: true,
    charset: true,
};
function fnmatch$$1(filepath, glob) {
    var matchOptions = { matchBase: true, dot: true, noext: true };
    glob = glob.replace(/\*\*/g, '{*,**/**/**}');
    return fnmatch(filepath, glob, matchOptions);
}
function getConfigFileNames(filepath, options) {
    var paths = [];
    do {
        filepath = path.dirname(filepath);
        paths.push(path.join(filepath, options.config));
    } while (filepath !== options.root);
    return paths;
}
function processMatches(matches, version) {
    // Set indent_size to 'tab' if indent_size is unspecified and
    // indent_style is set to 'tab'.
    if ('indent_style' in matches
        && matches.indent_style === 'tab'
        && !('indent_size' in matches)
        && semver$3.gte(version, '0.10.0')) {
        matches.indent_size = 'tab';
    }
    // Set tab_width to indent_size if indent_size is specified and
    // tab_width is unspecified
    if ('indent_size' in matches
        && !('tab_width' in matches)
        && matches.indent_size !== 'tab') {
        matches.tab_width = matches.indent_size;
    }
    // Set indent_size to tab_width if indent_size is 'tab'
    if ('indent_size' in matches
        && 'tab_width' in matches
        && matches.indent_size === 'tab') {
        matches.indent_size = matches.tab_width;
    }
    return matches;
}
function processOptions(options, filepath) {
    if (options === void 0) { options = {}; }
    return {
        config: options.config || '.editorconfig',
        version: options.version || pkg.version,
        root: path.resolve(options.root || path.parse(filepath).root),
    };
}
function buildFullGlob(pathPrefix, glob) {
    switch (glob.indexOf('/')) {
        case -1:
            glob = '**/' + glob;
            break;
        case 0:
            glob = glob.substring(1);
            break;
        default:
            break;
    }
    return path.join(pathPrefix, glob);
}
function extendProps(props, options) {
    if (props === void 0) { props = {}; }
    if (options === void 0) { options = {}; }
    for (var key in options) {
        if (options.hasOwnProperty(key)) {
            var value = options[key];
            var key2 = key.toLowerCase();
            var value2 = value;
            if (knownProps[key2]) {
                value2 = value.toLowerCase();
            }
            try {
                value2 = JSON.parse(value);
            }
            catch (e) { }
            if (typeof value === 'undefined' || value === null) {
                // null and undefined are values specific to JSON (no special meaning
                // in editorconfig) & should just be returned as regular strings.
                value2 = String(value);
            }
            props[key2] = value2;
        }
    }
    return props;
}
function parseFromConfigs(configs, filepath, options) {
    return processMatches(configs
        .reverse()
        .reduce(function (matches, file) {
        var pathPrefix = path.dirname(file.name);
        file.contents.forEach(function (section) {
            var glob = section[0];
            var options2 = section[1];
            if (!glob) {
                return;
            }
            var fullGlob = buildFullGlob(pathPrefix, glob);
            if (!fnmatch$$1(filepath, fullGlob)) {
                return;
            }
            matches = extendProps(matches, options2);
        });
        return matches;
    }, {}), options.version);
}
function getConfigsForFiles(files) {
    var configs = [];
    for (var i in files) {
        if (files.hasOwnProperty(i)) {
            var file = files[i];
            var contents = ini.parseString(file.contents);
            configs.push({
                name: file.name,
                contents: contents,
            });
            if ((contents[0][1].root || '').toLowerCase() === 'true') {
                break;
            }
        }
    }
    return configs;
}
function readConfigFiles(filepaths) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, Promise.all(filepaths.map(function (name) { return new Promise(function (resolve) {
                    fs.readFile(name, 'utf8', function (err, data) {
                        resolve({
                            name: name,
                            contents: err ? '' : data,
                        });
                    });
                }); }))];
        });
    });
}
function readConfigFilesSync(filepaths) {
    var files = [];
    var file;
    filepaths.forEach(function (filepath) {
        try {
            file = fs.readFileSync(filepath, 'utf8');
        }
        catch (e) {
            file = '';
        }
        files.push({
            name: filepath,
            contents: file,
        });
    });
    return files;
}
function opts(filepath, options) {
    if (options === void 0) { options = {}; }
    var resolvedFilePath = path.resolve(filepath);
    return [
        resolvedFilePath,
        processOptions(options, resolvedFilePath),
    ];
}
function parseFromFiles(filepath, files, options) {
    if (options === void 0) { options = {}; }
    return __awaiter(this, void 0, void 0, function () {
        var _a, resolvedFilePath, processedOptions;
        return __generator(this, function (_b) {
            _a = opts(filepath, options), resolvedFilePath = _a[0], processedOptions = _a[1];
            return [2 /*return*/, files.then(getConfigsForFiles)
                    .then(function (configs) { return parseFromConfigs(configs, resolvedFilePath, processedOptions); })];
        });
    });
}
exports.parseFromFiles = parseFromFiles;
function parseFromFilesSync(filepath, files, options) {
    if (options === void 0) { options = {}; }
    var _a = opts(filepath, options), resolvedFilePath = _a[0], processedOptions = _a[1];
    return parseFromConfigs(getConfigsForFiles(files), resolvedFilePath, processedOptions);
}
exports.parseFromFilesSync = parseFromFilesSync;
function parse(_filepath, _options) {
    if (_options === void 0) { _options = {}; }
    return __awaiter(this, void 0, void 0, function () {
        var _a, resolvedFilePath, processedOptions, filepaths;
        return __generator(this, function (_b) {
            _a = opts(_filepath, _options), resolvedFilePath = _a[0], processedOptions = _a[1];
            filepaths = getConfigFileNames(resolvedFilePath, processedOptions);
            return [2 /*return*/, readConfigFiles(filepaths)
                    .then(getConfigsForFiles)
                    .then(function (configs) { return parseFromConfigs(configs, resolvedFilePath, processedOptions); })];
        });
    });
}
exports.parse = parse;
function parseSync(_filepath, _options) {
    if (_options === void 0) { _options = {}; }
    var _a = opts(_filepath, _options), resolvedFilePath = _a[0], processedOptions = _a[1];
    var filepaths = getConfigFileNames(resolvedFilePath, processedOptions);
    var files = readConfigFilesSync(filepaths);
    return parseFromConfigs(getConfigsForFiles(files), resolvedFilePath, processedOptions);
}
exports.parseSync = parseSync;
});

unwrapExports(editorconfig);

var editorconfigToPrettier = editorConfigToPrettier;

function editorConfigToPrettier(editorConfig) {
  if (!editorConfig || Object.keys(editorConfig).length === 0) {
    return null;
  }

  const result = {};

  if (editorConfig.indent_style) {
    result.useTabs = editorConfig.indent_style === "tab";
  }

  if (editorConfig.indent_size === "tab") {
    result.useTabs = true;
  }

  if (result.useTabs && editorConfig.tab_width) {
    result.tabWidth = editorConfig.tab_width;
  } else if (
    editorConfig.indent_style === "space" &&
    editorConfig.indent_size &&
    editorConfig.indent_size !== "tab"
  ) {
    result.tabWidth = editorConfig.indent_size;
  } else if (editorConfig.tab_width !== undefined) {
    result.tabWidth = editorConfig.tab_width;
  }

  if (editorConfig.max_line_length && editorConfig.max_line_length !== "off") {
    result.printWidth = editorConfig.max_line_length;
  }

  if (editorConfig.quote_type === "single") {
    result.singleQuote = true;
  } else if (editorConfig.quote_type === "double") {
    result.singleQuote = false;
  }

  return result;
}

function markerExists (files, markers) {
  return markers.some(function(marker) {
    return files.some(function(file) {
      return file === marker;
    });
  });
}

function traverseFolder (directory, levels, markers) {
  var files = fs.readdirSync(directory);
  if (levels === 0) {
    return null;
  } else if (markerExists(files, markers)) {
    return directory;
  } else {
    return traverseFolder(path.resolve(directory, '..'), levels - 1, markers);
  }
}

var findProjectRoot = function findRoot(dir, opts) { 
  if (!dir) throw new Error("Directory not defined");
  opts = opts || {};
  var levels  = opts.maxDepth || findRoot.MAX_DEPTH;
  var markers = opts.markers  || findRoot.MARKERS;
  return traverseFolder(dir, levels, markers); 
};

var MAX_DEPTH = 9;
var MARKERS   = [ '.git', '.hg' ];

findProjectRoot.MAX_DEPTH = MAX_DEPTH;
findProjectRoot.MARKERS = MARKERS;

var resolveConfigEditorconfig = createCommonjsModule(function (module) {
"use strict";








const maybeParse = (filePath, config, parse) => {
  const root = findProjectRoot(path.dirname(path.resolve(filePath)));
  return filePath && parse(filePath, { root });
};

const editorconfigAsyncNoCache = (filePath, config) => {
  return Promise.resolve(maybeParse(filePath, config, editorconfig.parse)).then(
    editorconfigToPrettier
  );
};
const editorconfigAsyncWithCache = mem(editorconfigAsyncNoCache);

const editorconfigSyncNoCache = (filePath, config) => {
  return editorconfigToPrettier(
    maybeParse(filePath, config, editorconfig.parseSync)
  );
};
const editorconfigSyncWithCache = mem(editorconfigSyncNoCache);

function getLoadFunction(opts) {
  if (!opts.editorconfig) {
    return () => null;
  }

  if (opts.sync) {
    return opts.cache ? editorconfigSyncWithCache : editorconfigSyncNoCache;
  }

  return opts.cache ? editorconfigAsyncWithCache : editorconfigAsyncNoCache;
}

function clearCache() {
  mem.clear(editorconfigSyncWithCache);
  mem.clear(editorconfigAsyncWithCache);
}

module.exports = {
  getLoadFunction,
  clearCache
};
});

var resolveConfig_1 = createCommonjsModule(function (module) {
"use strict";








const getExplorerMemoized = mem(opts =>
  thirdParty$1.cosmiconfig("prettier", {
    sync: opts.sync,
    cache: opts.cache,
    rcExtensions: true,
    transform: result => {
      if (result && result.config) {
        delete result.config.$schema;
      }
      return result;
    }
  })
);

/** @param {{ cache: boolean, sync: boolean }} opts */
function getLoadFunction(opts) {
  // Normalize opts before passing to a memoized function
  opts = Object.assign({ sync: false, cache: false }, opts);
  return getExplorerMemoized(opts).load;
}

function _resolveConfig(filePath, opts, sync) {
  opts = Object.assign({ useCache: true }, opts);
  const loadOpts = {
    cache: !!opts.useCache,
    sync: !!sync,
    editorconfig: !!opts.editorconfig
  };
  const load = getLoadFunction(loadOpts);
  const loadEditorConfig = resolveConfigEditorconfig.getLoadFunction(loadOpts);
  const arr = [load, loadEditorConfig].map(l => l(filePath, opts.config));

  const unwrapAndMerge = arr => {
    const result = arr[0];
    const editorConfigured = arr[1];
    const merged = Object.assign(
      {},
      editorConfigured,
      mergeOverrides(Object.assign({}, result), filePath)
    );

    if (!result && !editorConfigured) {
      return null;
    }

    return merged;
  };

  if (loadOpts.sync) {
    return unwrapAndMerge(arr);
  }

  return Promise.all(arr).then(unwrapAndMerge);
}

const resolveConfig = (filePath, opts) => _resolveConfig(filePath, opts, false);

resolveConfig.sync = (filePath, opts) => _resolveConfig(filePath, opts, true);

function clearCache() {
  mem.clear(getExplorerMemoized);
  resolveConfigEditorconfig.clearCache();
}

function resolveConfigFile(filePath) {
  const load = getLoadFunction({ sync: false });
  return load(filePath).then(result => {
    return result ? result.filepath : null;
  });
}

resolveConfigFile.sync = filePath => {
  const load = getLoadFunction({ sync: true });
  const result = load(filePath);
  return result ? result.filepath : null;
};

function mergeOverrides(configResult, filePath) {
  const options = Object.assign({}, configResult.config);
  if (filePath && options.overrides) {
    const relativeFilePath = path.relative(
      path.dirname(configResult.filepath),
      filePath
    );
    for (const override of options.overrides) {
      if (
        pathMatchesGlobs(
          relativeFilePath,
          override.files,
          override.excludeFiles
        )
      ) {
        Object.assign(options, override.options);
      }
    }
  }

  delete options.overrides;
  return options;
}

// Based on eslint: https://github.com/eslint/eslint/blob/master/lib/config/config-ops.js
function pathMatchesGlobs(filePath, patterns, excludedPatterns) {
  const patternList = [].concat(patterns);
  const excludedPatternList = [].concat(excludedPatterns || []);
  const opts = { matchBase: true };

  return (
    patternList.some(pattern => minimatch_1(filePath, pattern, opts)) &&
    !excludedPatternList.some(excludedPattern =>
      minimatch_1(filePath, excludedPattern, opts)
    )
  );
}

module.exports = {
  resolveConfig,
  resolveConfigFile,
  clearCache
};
});

const version = require$$0.version;


const getSupportInfo = support.getSupportInfo;








// Luckily `opts` is always the 2nd argument
function _withPlugins(fn) {
  return function() {
    const args = Array.from(arguments);
    const opts = args[1] || {};
    args[1] = Object.assign({}, opts, {
      plugins: loadPlugins_1(opts.plugins, opts.pluginSearchDirs)
    });
    return fn.apply(null, args);
  };
}

function withPlugins(fn) {
  const resultingFn = _withPlugins(fn);
  if (fn.sync) {
    resultingFn.sync = _withPlugins(fn.sync);
  }
  return resultingFn;
}

const formatWithCursor = withPlugins(core.formatWithCursor);

var prettier = {
  formatWithCursor,

  format(text, opts) {
    return formatWithCursor(text, opts).formatted;
  },

  check: function(text, opts) {
    try {
      const formatted = formatWithCursor(text, opts).formatted;
      return formatted === text;
    } catch (e) {
      return false;
    }
  },

  doc,

  resolveConfig: resolveConfig_1.resolveConfig,
  resolveConfigFile: resolveConfig_1.resolveConfigFile,
  clearConfigCache: resolveConfig_1.clearCache,

  getFileInfo: withPlugins(getFileInfo_1),
  getSupportInfo: withPlugins(getSupportInfo),

  version,

  util: utilShared,

  /* istanbul ignore next */
  __debug: {
    parse: withPlugins(core.parse),
    formatAST: withPlugins(core.formatAST),
    formatDoc: withPlugins(core.formatDoc),
    printToDoc: withPlugins(core.printToDoc),
    printDocToString: withPlugins(core.printDocToString)
  }
};

module.exports = prettier;
