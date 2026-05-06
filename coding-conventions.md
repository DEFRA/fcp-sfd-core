# Coding conventions

The following is a list of conventions we follow when working in the [fcp-sfc-core] (https://github.com/DEFRA/fcp-sfd-core) repositories.

- [File names](#file-names)
- [Functions](#functions)
- [Use import instead of require](#use-import-instead-of-require)
- [Line length](#line-length)
- [Try catch blocks](#try-catch-blocks)

## File names

All file names should be [kebab-case](https://www.freecodecamp.org/news/snake-case-vs-camel-case-vs-pascal-case-vs-kebab-case-whats-the-difference/#kebab-case), for example `awesome-people-service.js`

Other naming conventions are

- presenters `thing-presenter.js`
- routes `thing-routes.js`
- services `thing-service.js`

To ensure cross-platform compatibility file names should always be written in lower case. This includes the use of acronyms in the file name. For example `convert-to-csv.service.js`.

Unit test files should be the same as the thing being tested with `.test` added to the end, for example `thing-service.test.js`. The `test/` folder structure should mirror the `app/` folder.

All file names should be [kebab-case] (https://www.freecodecamp.org/news/snake-case-vs-camel-case-vs-pascal-case-vs-kebab-case-whats-the-difference/#kebab-case), for example `awesome-people-service.js`

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

## Line length

With one exception, lines should be kept to 120 characters or fewer. This helps improve readability, especially when working across different screen sizes or side-by-side with other files.

If a line goes over the limit — for example, when defining a function with wonderfully expressive parameter names 😁 — split it over multiple lines for clarity.

```javascript
// Bad!
const performMagic = (eyeOfLesserSpottedNewt, giantFruitBatDrool, pinchOfDragonWort, somethingThatHasReallyLongName) => {
  // Do something
}

// Good!
const performMagic = (
  eyeOfLesserSpottedNewt,
  giantFruitBatDrool,
  pinchOfDragonWort,
  somethingThatHasReallyLongName
  ) => {
  // Do something
}
```

The same goes when calling a method. The exception is when you have a string you can't break across multiple lines. This applies to `describe()` and `it()` in our test files; we'd rather a more verbose description than worry about the convention.
