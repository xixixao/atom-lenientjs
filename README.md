# Atom LenientJS

Atom package which enables Lenient syntax for JavaScript.

After installing this package, open a JS file and run `Set Syntax: Lenient JS` from command palette (Cmd+Shift+P on macOS), in case the syntax wasn't selected automatically.

When enabled, the code will be presented in Lenient syntax, but saved as pretty-printed standard JavaScript.

If you want to use Lenient syntax by default, open Atom config (on OS X from Atom menubar menu) and add `'source.js.lenient': ['js']` to `customFileTypes`, like this:

```
'*':
  core:
    customFileTypes:
      'source.js.lenient': [
        'js'
      ]
```

TODO: Support local Prettier settings
TODO: Git integration shows changes between Lenient and underlying JS
TOSO: Add Compat mode option
TODO: Limit size of file for which Lenient kicks in
TODO: Support file duplication/renaming

## Development

See https://github.com/xixixao/lenientjs
