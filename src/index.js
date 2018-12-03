'use babel';

import {CompositeDisposable} from 'atom';
import * as nodeStream from 'stream';

const TransformStream = nodeStream.Transform;
const WriteStream = nodeStream.Writable;

const COULDNT_SAVE_LENIENT_FILE = "Couldn't save Lenient file";
const COULDNT_CONVERT_TO_LENIENT = "Couldn't convert to Lenient";

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
          const shouldConvertToJS = scopeName === 'source.js.lenient';
          const shouldConvertToJSON = scopeName === 'source.json.lenient';
          if (
            !editor.buffer.isLenient &&
            (shouldConvertToJS || shouldConvertToJSON)
          ) {
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
        onWriteError(COULDNT_SAVE_LENIENT_FILE, error);
      });
      if (!hasUnsavedChanges) {
        editor.buffer.load({internal: true});
      }
    }
    if (hasUnsavedChanges && lastGrammar != null) {
      const {jsToLenient} = require('./transpile')({language});
      transpileEditor(editor, jsToLenient, error => {
        onWriteError(COULDNT_CONVERT_TO_LENIENT, error);
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
        onWriteError("Couldn't convert from Lenient", error);
      });
    }
    editor.buffer.isLenient = false;
  },

  deactivate() {
    this.subscriptions.dispose();
    // We don't want to switch off lenient grammar when user is just closing
    // editor
    if (!atom.unloading) {
      this.lenientEditors.forEach(editor => {
        if (editor.buffer.isLenient) {
          // don't propagate error to make sure deactivation succeeds
          // and make sure this editor works when the package is reactivated
          try {
            this.disableLenient(editor);
          } catch (error) {}
          editor.buffer.isLenient = false;
        }
      });
    }
    this.lenientEditors = [];
  },
};

const onWriteError = (message, error) => {
  atom.notifications.addError(message, {
    detail: error.toString(),
    stack: error.stack,
    dismissable: true,
  });
};

const onWriteSuccess = () => {
  atom.notifications
    .getNotifications()
    .filter(notification => {
      const message = notification.getMessage();
      return (
        message === COULDNT_SAVE_LENIENT_FILE ||
        message === COULDNT_CONVERT_TO_LENIENT
      );
    })
    .forEach(notification => notification.dismiss());
};

const scopeNameToLanguage = scopeName =>
  scopeName.startsWith('source.json') ? 'json' : 'js';

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
      onWriteSuccess();
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
