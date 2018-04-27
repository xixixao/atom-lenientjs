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
        const grammarSubscription = editor.observeGrammar(({scopeName}) => {
          if (
            !editor.buffer.isLenient &&
            /\.js$/.test(editor.getPath()) &&
            scopeName === 'source.coffee'
          ) {
            editor.buffer.file = getMappedFile(
              editor.buffer.file,
              this.onWriteError,
            );
            editor.buffer.load({internal: true});
            editor.buffer.isLenient = true;
          } else if (editor.buffer.isLenient) {
            editor.buffer.file = editor.buffer.file.originalFile;
            editor.buffer.load({internal: true});
            editor.buffer.isLenient = false;
          }
        });
        this.subscriptions.add(grammarSubscription);
        editor.onDidDestroy(() => {
          grammarSubscription.dispose();
        });
      }),
    );
  },

  onWriteError(error) {
    atom.notifications.addError("Couldn't save Lenient file", {
      detail: error.toString(),
      stack: error.stack,
      dismissable: true,
    });
  },

  deactivate() {
    this.subscriptions.dispose();
  },
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
        callback(error);
      }
    },
  });
