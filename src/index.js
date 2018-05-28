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
      editor.buffer.file = editor.buffer.file.originalFile;
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
