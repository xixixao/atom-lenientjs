'use babel';

import {CompositeDisposable} from 'atom';
import * as nodeStream from 'stream';

const TransformStream = nodeStream.Transform;
const WriteStream = nodeStream.Writable;

export default {
  subscriptions: null,
  lenientEditors: [],

  activate(state) {
    this.subscriptions = new CompositeDisposable();
    this.subscriptions.add(
      atom.workspace.observeTextEditors(editor => {
        let lastGrammar = null;
        const grammarSubscription = editor.observeGrammar(grammar => {
          const {scopeName} = grammar;
          const toJS = scopeName === 'source.js.lenient';
          const toJSON = scopeName === 'source.json.lenient';
          if (!editor.buffer.isLenient && (toJS || toJSON)) {
            const language = scopeNameToLanguage(scopeName);
            this.enableLenient(editor, lastGrammar, language);
          } else if (editor.buffer.isLenient) {
            this.disableLenient(editor);
          }
          lastGrammar = grammar;
        });
        this.subscriptions.add(grammarSubscription);
        editor.onDidDestroy(() => {
          grammarSubscription.dispose();
        });
      }),
    );
  },

  enableLenient(editor, lastGrammar, language) {
    const hasBackingFile = !!editor.getPath();
    const hasUnsavedChanges = editor.isModified();
    if (hasBackingFile) {
      const currentFile = editor.buffer.file;
      editor.buffer.file = getMappedFile(currentFile, language, error => {
        this.onWriteError("Couldn't save Lenient file", error);
      });
      if (!hasUnsavedChanges) {
        editor.buffer.load({internal: true});
      }
    }
    if (hasUnsavedChanges) {
      const {jsToLenient} = require('./transpile')({language});
      transpileEditor(editor, jsToLenient, error => {
        this.onWriteError("Couldn't convert to Lenient", error);
        editor.setGrammar(lastGrammar);
      });
    }
    this.lenientEditors.push(editor);
    editor.buffer.isLenient = true;
  },

  disableLenient(editor) {
    const hasBackingFile = !!editor.getPath();
    const hasUnsavedChanges = editor.isModified();
    if (hasBackingFile) {
      editor.buffer.file = getOriginalFile(editor.buffer.file);
      if (!hasUnsavedChanges) {
        editor.buffer.load({internal: true});
      }
    }
    if (hasUnsavedChanges) {
      const language = scopeNameToLanguage(editor.getGrammar().scopeName);
      const {lenientToJS} = require('./transpile')({language});
      transpileEditor(editor, lenientToJS, error => {
        this.onWriteError("Couldn't convert from Lenient", error);
      });
    }
    editor.buffer.isLenient = false;
  },

  // TODO: immediately kill all error notifications after successful write
  onWriteError(message, error) {
    atom.notifications.addError(message, {
      detail: error.toString(),
      stack: error.stack,
      dismissable: true,
    });
  },

  deactivate() {
    this.subscriptions.dispose();
    this.lenientEditors.forEach(editor => {
      if (editor.buffer.isLenient) {
        try {
          this.disableLenient(editor);
        } catch (error) {
          // don't propagate error to make sure deactivation succeeds
          // and make sure this editor works when the package is reactivated
          editor.buffer.isLenient = false;
        }
      }
    });
    this.lenientEditors = [];
  },
};

const scopeNameToLanguage = scopeName =>
  scopeName === 'source.js.lenient' ? 'js' : 'json';

const transpileEditor = (editor, fn, onError) => {
  try {
    editor.setText(fn(editor.getText()));
  } catch (error) {
    onError(error);
    // Important, we don't want the syntax setting to succeed
    throw error;
  }
};

const getMappedFile = (file, language, onError) => {
  const {jsToLenient, lenientToJS} = require('./transpile')({language});
  const newFile = newForwardingObject(file);
  newFile.createReadStream = () =>
    readThrough(file.createReadStream(), jsToLenient);
  newFile.createWriteStream = () => writeThroughTo(file, lenientToJS, onError);
  newFile._originalFile = file;
  return newFile;
};

const getOriginalFile = file => file._originalFile;

const readThrough = (source, fn) => source.pipe(through(fn));

const through = fn =>
  new TransformStream({
    transform(text, _encoding, callback) {
      callback(null, fn(text.toString()));
    },
    decodeStrings: false,
  });

// // Conceptually this is what we want, but we cannot use this code directly
// // because we would wipe the file on error, as the file is wiped when we
// // open it for writing.
// writeThrough(file.createWriteStream(), lenientToJS),
// const writeThrough = (destination, fn) => {
//   const newDestination = through(fn);
//   newDestination.pipe(destination);
//   return newDestination;
// };

const writeThroughTo = (file, fn, onError) => {
  let underlyingStream = null;
  return new WriteStream({
    // Note that Atom actually doesn't stream files atm., we get the whole
    // file in one call
    write(text, _encoding, callback) {
      let transformed = null;
      try {
        transformed = fn(text.toString());
      } catch (error) {
        onError(error);
        // Make sure Atom knows the saving failed
        callback(error);
        return;
      }
      // Now we managed to transform, so it's safe to write to the file
      underlyingStream = file.createWriteStream();
      underlyingStream.write(transformed, callback);
    },

    final(callback) {
      underlyingStream.end(callback);
    },
  });
};

const newForwardingObject = object => {
  // Poor man's facade! We cannot use prototypical inheritence because Atom
  // would think we're an ordinary File and would read directly from disk
  // instead of using `createReadStream`
  const newObject = {};
  let methods = object;
  while (methods != null && methods.constructor !== Object) {
    for (const name of Object.getOwnPropertyNames(methods)) {
      const method = methods[name];
      if (name[0] !== '_' && typeof method === 'function') {
        newObject[name] = method.bind(object);
      }
    }
    methods = Object.getPrototypeOf(methods);
  }
  return newObject;
};
