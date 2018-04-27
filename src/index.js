'use babel';

import {CompositeDisposable} from 'atom';
import * as nodeStream from 'stream';

const TransformStream = nodeStream.Transform;
const WriteStream = nodeStream.Writable;

export default {
  subscriptions: null,

  activate(state) {
    this.subscriptions = new CompositeDisposable();

    this.subscriptions.add(
      atom.workspace.observeTextEditors(editor => {
        let lastGrammar = null;
        const grammarSubscription = editor.observeGrammar(grammar => {
          const {scopeName} = grammar;
          const hasBackingFile = !!editor.getPath();
          const hasUnsavedChanges = editor.isModified();
          if (
            !editor.buffer.isLenient &&
            ((editor.getPath() || '').endsWith('.js') ||
              ((lastGrammar || {}).scopeName || '').startsWith('source.js')) &&
            scopeName === 'source.coffee'
          ) {
            if (hasBackingFile) {
              editor.buffer.file = getMappedFile(editor.buffer.file, error => {
                this.onWriteError("Couldn't save Lenient file", error);
              });
              if (!hasUnsavedChanges) {
                editor.buffer.load({internal: true});
              }
            }
            if (hasUnsavedChanges) {
              const {jsToLenient} = require('./transpile');
              transpileEditor(editor, jsToLenient, error => {
                this.onWriteError("Couldn't convert to Lenient", error);
                editor.setGrammar(lastGrammar);
              });
            }
            editor.buffer.isLenient = true;
          } else if (editor.buffer.isLenient) {
            if (hasBackingFile) {
              editor.buffer.file = editor.buffer.file.originalFile;
              if (!hasUnsavedChanges) {
                editor.buffer.load({internal: true});
              }
            }
            if (hasUnsavedChanges) {
              const {lenientToJS} = require('./transpile');
              transpileEditor(editor, lenientToJS, error => {
                this.onWriteError("Couldn't convert from Lenient", error);
              });
            }
            editor.buffer.isLenient = false;
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

  onWriteError(message, error) {
    atom.notifications.addError(message, {
      detail: error.toString(),
      stack: error.stack,
      dismissable: true,
    });
  },

  deactivate() {
    this.subscriptions.dispose();
  },
};

const transpileEditor = (editor, fn, onError) => {
  try {
    editor.setText(fn(editor.getText()));
  } catch (error) {
    onError(error);
    // Important, we don't want the syntax setting to succeed
    throw error;
  }
};

const getMappedFile = (file, onError) => {
  const {jsToLenient, lenientToJS} = require('./transpile');
  return {
    getPath: () => file.getPath(),
    createReadStream: () => readThrough(file.createReadStream(), jsToLenient),
    createWriteStream: () => writeThroughTo(file, lenientToJS, onError),
    existsSync: file.existsSync,
    onDidChange: file.onDidChange,
    onDidDelete: file.onDidDelete,
    onDidRename: file.onDidRename,
    originalFile: file,
  };
};

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

const writeThroughTo = (file, fn, onError) =>
  new WriteStream({
    write(text, _encoding, callback) {
      try {
        const transformed = fn(text.toString());
        // Now we managed to transform, so it's safe to write to the file
        file.createWriteStream().write(transformed, callback);
      } catch (error) {
        onError(error);
        // Make sure Atom knows the saving failed
        callback(error);
      }
    },
  });
