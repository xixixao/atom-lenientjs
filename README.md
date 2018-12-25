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

## Known Issues

- No Support for local Prettier settings
- Git integration shows changes between Lenient and underlying JS
- No compat mode option
- No size limit of file for which Lenient kicks in

## Development

See https://github.com/xixixao/lenientjs
