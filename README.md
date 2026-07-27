# aeft.jsx

Public repository of Adobe After Effects expressions and scripts.

## Overview

This project keeps AE snippets organized like a lightweight codebase:

- `src/expressions` for copy/paste expressions
- `src/scripts` for full ScriptUI or utility scripts
- `src/lib` for shared script helpers and templates

The expressions folder is now organized by intent, and each file contains one snippet for easier discovery.

## Project Structure

```text
src/
├── expressions/
│   ├── README.md
│   ├── color/
│   ├── controllers/
│   │   └── velocity-driven/
│   ├── counters/
│   ├── datetime/
│   ├── keyframes/
│   ├── layout/
│   └── text/
├── lib/
└── scripts/
    └── composition/
```

## Usage

### Expressions

1. Open a file from `src/expressions`.
2. Copy its contents.
3. Paste into an After Effects expression field.
4. Adjust layer/control names called out in comments.

### Scripts

- Run `.jsx` scripts from `File > Scripts > Run Script File...`
- Or place them in your After Effects Scripts directory.

## Formatting

- Run `yarn pretty` to format all `.js`/`.jsx` source files with Prettier.

## License

ISC (see `LICENSE`).
