## 0.4.1 (May 29, 2015)

#### Bug Fixes

* Fixed wrong relative path to component when creating a new element

## 0.4 (May 29, 2015)

#### New Features

* Added `-v` flag to `new` command to see detailed output of underlying process (including `npm install`)
* `new` command now shows a fancy spinner
* Added new `element` generator to generate feature components, e.g. `todos/list.react.js`
* When writing new generator, you can now either export a function or an object in `locals` and `mapFileTokens`
* Generator will now warn you when trying to work on a non-este directory

#### Bug Fixes

* Several bug fixes to the `core` + test coverage
* Fixed few cases when `new` command was failing silently
* Route generator now respects formatting with line breaks

#### Other

* Build now on Travis with test coverage badge