# Coding conventions

The following is a list of conventions we follow when working in the [fcp-sfc-core] (https://github.com/DEFRA/fcp-sfd-core) repositories.

- [File names](#file-names)
- [Functions](#functions)
- [Use import instead of require](#use-import-instead-of-require)

## File names

All file names should be [kebab-case] (https://www.freecodecamp.org/news/snake-case-vs-camel-case-vs-pascal-case-vs-kebab-case-whats-the-difference/#kebab-case), for example `awesome-people.js`

To ensure cross-platform compatibility file names should always be written in lower case. This includes the use of acronyms in the file name. For example `convert-to-csv.js`.

Unit test files should be the same as the thing being tested with `.test` added to the end, for example `thing.test.js`. The `test/` folder structure should mirror the `src/` folder.

## Functions

We define our functions as arrow functions expressions.

```javascript
// Do this! - Arrow function expression
const helloWorld = (data) => {
  returns 'Hello, world!'
}

// DON'T do this - Function declaration
function helloWorld () {
  return 'Hello, world!'
}

// OR this - Function expression
const greet = function(name) {
  return 'Hello, world!'
}
```

## Use import instead of require

We are using ES6 modules in the codebase, so we standardise on using the `import` statement for importing modules rather
than require.

```javascript
import { myFunction } from './utils/my-function.js'

// Avoid - CommonJS syntax
const myFunction = require('./utils/my-function.js')
```
