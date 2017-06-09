# NeoForm

[![travis](https://img.shields.io/travis/zero-plus-x/neoform/master.svg?style=flat-square)](https://travis-ci.org/zero-plus-x/neoform)
[![coverage](https://img.shields.io/codecov/c/github/zero-plus-x/neoform/master.svg?style=flat-square)](https://codecov.io/github/zero-plus-x/neoform)

Better form state management for React where data state is directly mapped to form fields, so form becomes just a representation and changing interface for that data state.

TOC

* [Usage](#usage)
  * [Intro](#intro)
  * [`Field`](#field)
  * [`Form`](#form)
  * [App](#app)
  * [Validation](#validation)
    * [`FieldValidation`](#fieldvalidation)
    * [`FormValidation`](#formvalidation)
    * [Validators](#validators)
* [Demo](#demo)
* [Status](#status)
* [Development](#development)

## Usage

### Intro

Let's say you have some data and you want to represent it as an HTML form with an Input for each data field.

```json
"user": {
  "name": "Pepe",
  "status": "sad",
  "friends": [
    "darkness"
  ]
}
```

Each data field can be referenced with a “key” or “property” path. You might be familiar with this concept from working with immutable data structures or helpers like `lodash.get()`.

```js
"user": {
  "name": "Pepe",  // "user.name"
  "status": "sad", // "user.status"
  "friends": [
    "darkness"     // "user.friends[0]"
  ]
}
```

The core idea of NeoForm is to map data to form fields using these key/property paths. We'll refer to this data as “form state” below.

Let's see how it works with a step-by-step example. We'll start with creating a simple input:

### `Field`

```js
const MyInput = () => (
  <input />
);

export default MyInput;
```

After wrapping this input with `Field` [HOC](https://medium.com/@dan_abramov/mixins-are-dead-long-live-higher-order-components-94a0d2f9e750) from NeoForm we'll have:

#### `value` and `onChange` props

A value from a form state (can be used in checkbox as a `checked` attribute if it's boolean, and so on) and `onChange` handler to let NeoForm know that value should be changed.

```js
import { Field } from 'neoform';

const MyInput = ({ value, onChange }) => (
  <input value={value} onChange={onChange} />
);

export default Field()(MyInput);
```

#### value getter (TODO sounds dumb. How to call it? Should we maybe remove it?)

# TODO DIDN'T REVIEW BELOW THIS LINE

Handler which should tell NeoForm about how to get that actual `value` (use `(e) => e.target.checked` if you have a checkbox or just `(value) => value` if you have some custom/3rd-party field implementation).

```js
import { Field } from 'neoform';

const MyInput = ({ value }) => (
  <input value={value} />
);

export default Field(
  (e) => e.target.value
)(MyInput);
```

### `Form`

Let's add our fields to a simple form:

```js
import MyInput from '../MyInput';

const MyForm = ({ data }) => (
  <form>
    <MyInput name="user.name" />
    <MyInput name="user.status" />
    <MyInput name="user.friends[0]" />
  </form>
);

export default MyForm;
```

And wrap it with a `Form` HOC provided by NeoForm:

```js
import { Form } from 'neoform';

import MyInput from '../MyInput';

const MyForm = (/* { data } */) => (
  <form>
    <MyInput name="user.name" />
    <MyInput name="user.status" />
    <MyInput name="user.friends[0]" />
  </form>
);

export default MyForm(
  (data, name) => // return a value from data by field name
)(MyForm);
```

Where `data` is actual data structure which you should provide to the MyForm from outside and `name` is a particular MyInput name. NeoForm should be taught on how to get a value by name because you might have a plain object data, Immutable or something else with a different "interface":

```js
import { Form } from 'neoform';
import { getByFieldName } from 'neoform-plain-object-helpers';

import MyInput from '../MyInput';

const MyForm = (/* { data } */) => (
  <form>
    <MyInput name="user.name" />
    <MyInput name="user.status" />
    <MyInput name="user.friends[0]" />
  </form>
);

export default MyForm(getByFieldName)(MyForm);
```

In this case it's just a `lodash.get(data, name)` under the hood.

### App

```js
import { setByFieldName } from 'neoform-plain-object-helpers';

import MyForm from '../MyForm';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: props.data
    };

    this.onChangeHandler = this.onChangeHandler.bind(this);
  }

  onChangeHandler(name, value) {
    // update data field in state with new value by field name
    this.setState((prevState) => setFieldByName(state, name, value))
  }

  onSubmit() {
    console.log('Submit!')
  }

  render() {
    <MyForm
      data={this.state.data}
      onChange={this.onChangeHandler}
      onSubmit={this.onSubmit}
    />
  }
}
```

What's going on here? The second idea of NeoForm: to have only one `onChange` handler for the entire form instead of having multiple hanlders for each field, so you can update state when some field was updated. And then after a new render fields will receive their new values by `name`.

```
+--------------+
|              |
|              |
|    +---------v---------+
|    |                   |
|    |    MyForm.data    |
|    |                   |
|    +---------+---------+
|              |
|       name   |
|              |
|    +---------v---------+
|    |                   |
|    |   MyInput.value   |
|    |                   |
|    +---------+---------+
|              |
|              |
|    +---------v---------+
|    |                   |
|    | MyInput.onChange  |
|    |                   |
|    +---------+---------+
|              |
|       name   |  value
|              |
|    +---------v---------+
|    |                   |
|    |  MyForm.onChange  |
|    |                   |
|    +---------+---------+
|              |
|       name   |  value
|              |
+--------------+
```

### Validation

Validation in NeoForm is always asynchronous.

#### `FieldValidation`

`FieldValidation` is another HOC:

```js
import { Field } from 'neoform';
import { FieldValidation } from 'neoform-validation';
import { compose } from 'recompose';

const MyInput = ({
  validate,
  validationStatus,
  validationMessage,
  ...props
}) => (
  <input {...props} onBlur={validate} />
  {
    validationStatus === false && (
      <span>{validationMessage}</span>
    )
  }
)

export default compose(
  Field((e) => e.target.value),
  FieldValidation()
)(MyInput)
```

Where:

* `validate` – validation action, should be called whenever you want (`onChange`, `onBlur`, etc)
* `validationStatus` – `true` | `false` | `undefined` status of field validation
* `validationMessage` – valid/invalid message passed to validator 
* `compose(…)` – same as manually composed HOCs like `Field(…)(FieldValidation()(MyInput))` but using awesome [recompose](https://github.com/acdlite/recompose)

#### `FormValidation`

```js
import { Form } from 'neoform';
import { getByFieldName } from 'neoform-plain-object-helpers';
import { FormValidation } from 'neoform-validation';

import MyInput from '../MyInput';

const MyForm = ({
  /* data, */
  validate,
  validationStatus,
  onSubmit
}) => (
  <form onSubmit={(e) => {
    e.preventDefault();
    validate(onSubmit)
  }}>
    <MyInput name="user.name" />
    <MyInput name="user.status" />
    <MyInput name="user.friends[0]" />
  </form>
);

export default compose(
  MyForm(getByFieldName),
  FormValidation()
)(MyForm);
```

Where:

* `validate` – entire form validation action which will call all fields validation and then provided callback if they are valid (your `onSubmit` handler in most cases)
* `validationStatus` – `true` | `false` | `undefined` status of entire form validation

#### Validators

Validation process in NeoForm is always asynchronous and "validator" is just a Promise. Rejected one is for `validationStatus: false` prop and resolved is for `validationStatus: true`. `validationMessage` prop is a message passed on fulfilling a Promise.

```js
export const requiredValidator = (value) => {
  if (value === '') {
    return Promise.reject('💩');
  }

  return Promise.resolve('🎉');
};
```

It's up to you on how to manage multiple validators, with `Promise.all()` or some sequence.

This validator can be passed as `validator` prop to fields then:

```js
import { requiredValidator } from '../validators'

// …

<form>
  <MyInput name="user.name" validator={requiredValidator} />
  <MyInput name="user.status" />
  <MyInput name="user.friends[0]" />
</form>

// …
```

## Demo

It's a good idea to play around with all this information with live examples:

```sh
yarn start demo neoform
yarn start demo neoform-validation
```

## Status

This is a [monorepo](https://github.com/babel/babel/blob/master/doc/design/monorepo.md) composed of these packages:

| package | version | description |
| ------- | ------- | ----------- |
| [neoform](packages/neoform/) | [![npm](https://img.shields.io/npm/v/neoform.svg?style=flat-square)](https://www.npmjs.com/package/neoform) | Core toolkit with `Form` and `Field` HOCs |
| [neoform-validation](packages/neoform-validation/) | [![npm](https://img.shields.io/npm/v/neoform-validation.svg?style=flat-square)](https://www.npmjs.com/package/neoform-validation) | `FormValidation` and `FieldValidation` HOCs |
| [neoform-plain-object-helpers](packages/neoform-plain-object-helpers/) | [![npm](https://img.shields.io/npm/v/neoform-plain-object-helpers.svg?style=flat-square)](https://www.npmjs.com/package/neoform-plain-object-helpers) | `getByFieldName` and `setByFieldName` helpers for plain object state |
| [neoform-immutable-helpers](packages/neoform-immutable-helpers/) | [![npm](https://img.shields.io/npm/v/neoform-immutable-helpers.svg?style=flat-square)](https://www.npmjs.com/package/neoform-immutable-helpers) | `getByFieldName` and `setByFieldName` helpers for [Immutable](https://github.com/facebook/immutable-js) state |

## Development

```sh
yarn start build neoform
yarn start build neoform-validation
yarn start build neoform-plain-object-helpers
yarn start build neoform-immutable-helpers
```
