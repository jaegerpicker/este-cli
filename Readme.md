este-cli [![Join the chat at https://gitter.im/steida/este](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/steida/este) [![Dependency Status](https://david-dm.org/grabbou/este-cli.svg)](https://david-dm.org/grabbou/este-cli) [![Inline docs](http://inch-ci.org/github/grabbou/este-cli.svg?branch=master)](http://inch-ci.org/github/grabbou/este-cli)
==========

A command line interface tool that seeks to automate some tasks when working on a Este.js project.

[![NPM](https://nodei.co/npm/este-cli.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/este-cli/)

## What is Este.js?

> The most complete React/Flux dev stack and starter kit for isomorphic functional web apps. Forget about [evil frameworks](http://tomasp.net/blog/2015/library-frameworks/), learn laser focused libraries and patterns instead.

Go, try it out [here](http://github.com/steida/este)

## Getting started

The latest version of this package is available via NPM with the below command:

```bash
$ npm install -g este-cli
```

## Available commands

### Create application

```shell
este-cli new <name> [location] --keep-git|-k
```

This command creates completely fresh `Este` project by cloning it from Github repository to a location provided (defaults to `name` passed). When flag `-k` is passed, Este.js git repository is kept, a new instance is generated otherwise.
## Available generators

### Page

```bash
$ este-cli g page [name]
```

Creates a new page component in `src/client/pages/[name].react.js`

### Store

```bash
$ este-cli g store [name]
```

Creates a new store in `src/client/[name]/store.js`. Runs `action`, `state` and `cursor` generators to ensure they are correctly imported in store.

### Action

```bash
$ este-cli g action [name] [actionName]`
```

Creates simple `[actionName]` action in `src/client/[name]/actions.js` and exports it. If `[actionName]` is nested, it will be converted to camelCase. If `actions.js` file is missing, it will be created.

**Note**:
This generator won't add a store switch with newly created action although this feature is planned.

### Component

```bash
$ este-cli g component [name]
```

Creates top-level reusable component in `src/client/components/[name].react.js` that exports a function which wrapps `BaseComponent` passed.

**NOTE**:
This generator always adds a component that wraps another one. Support for plain components is on the way.

### Cursor

```bash
$ este-cli g cursor [name]
```

Creates a `[name]` cursor pointing to `[name]` state. IF file is missing, it will be created.

### State

```bash
$ este-cli g state [name]
```

Creates a `[name]` state in `src/server/initialstate.js`. If the file is missing, it will be created.

## License

The MIT License (MIT)

Copyright (c) 2015 Mike Grabowski

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
