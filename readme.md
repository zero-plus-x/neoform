# NeoForm

[![travis](https://img.shields.io/travis/zero-plus-x/neoform/master.svg?style=flat-square)](https://travis-ci.org/zero-plus-x/neoform)
[![coverage](https://img.shields.io/codecov/c/github/zero-plus-x/neoform/master.svg?style=flat-square)](https://codecov.io/github/zero-plus-x/neoform)

Better form state management for React in which data state can be directly mapped to form fields, so form becomes just a representation and changing interface for that data state, as it should be.

## Status

This is a [monorepo](https://github.com/babel/babel/blob/master/doc/design/monorepo.md) composed of these packages:

| package | version | description |
| ------- | ------- | ----------- |
| [neoform](packages/neoform/) | [![npm](https://img.shields.io/npm/v/neoform.svg?style=flat-square)](https://www.npmjs.com/package/neoform) | Core toolkit with `Form` and `Field` HOCs |
| [neoform-validation](packages/neoform-validation/) | [![npm](https://img.shields.io/npm/v/neoform-validation.svg?style=flat-square)](https://www.npmjs.com/package/neoform-validation) | `FormValidation` and `FieldValidation` HOCs |

## Development

```sh
yarn start demo neoform
yarn start demo neoform-validation
```

## Build

```sh
yarn start build neoform
yarn start build neoform-validation
```

## TODO

* docs
