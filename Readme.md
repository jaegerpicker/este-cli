Este-cli
==========
CLI tool for managing and working with Este.js projects

# Available commands

## este-cli new [name] [directory]
Creates new este app by cloining it from repository to optionall directory (defaults tu current working directory). Installs all the dependencies and resets git repository so it no longer points to Este.js.

## este-cli generate|g [type] [args..]
Runs one of the generators listed below. All generators need to be run from root directory (the one with src folder within)

Following variables are set by default and are planned to be supported by `.esterc` file:
- `__root__` - defaults to `src/client`
- `__server__` - defaults to `src/server`

### page
```bash
$ este-cli g page todos
```
Will create a page in `__root__/pages/todos.react.js`. If name is nested, the folders will respect it as well. 

Currently, it won't update `routes.js` file although this feature is planned.

### store
```bash
$ este-cli g store todos
```
Will create a store in `__root__/todos/store.js`. Before install, it will run `actions`, `state` and `cursor` generators to ensure they are present and correctly importend. If name is nested (e.g. `todos/edit`) store will be created in a `__root__/todos/edit/store.js`.

Currently, it won't add any actions to an `actions.js` file by default. This feature is planned in next releases.

### action
```bash
$ este-cli g action todos myAction`
```
Will create an action file if missing (`__root__/todos/actions.js`), export `myAction` that dispatches itself and add it to `setToString` properties. If name is nested (e.g. `todos/edit`) actions will be created in a `__root__/todos/edit/actions.js`. 

Currently, it won't update `store` with newly created action although this feature is planned in next releases. It will be able to handle imports properly (e.g. `import * from actions` and `import {myAction} from actions`.

### component
```bash
$ este-cli g component authenticatedOnly
```
Will create a component in `__root__/components/authenticatedOnly.js`. If name is nested (e.g. `todos/authenticatedOnly`) component will be created in a `__root__/component/edit/authenticatedOnly.js`

### cursor
```bash
$ este-cli g cursor todos
```
Will create `__root__/state.js` if missing and export `todos` cursor pointing to `todos` state. Will also run `state` generator to ensure `todos` is present in `initialstate.js`

### state
```bash
$ este-cli g cursor todos
```
Will create `__server__/initialstate.js` if missing and add `todos` property to the state if not present already. If name is nested (e.g. `todos/edit`, it will be converted to camelCase string)
