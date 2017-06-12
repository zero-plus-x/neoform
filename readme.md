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

The first core idea of NeoForm is to map data to form fields using these key/property paths. We'll refer to this data as “form state” below.

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

# TODO SKIPPED START

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

# TODO SKIPPED END

### `Form`

Now when the input is ready we can use use it in a form:

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

Let's connect this form to Neoform by wrapping it with a `Form` HOC:

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

const getByFieldName = (data, name) => {
  // return a value from data by field name
}

export default Form(getByFieldName)(MyForm);
```

We need to specify `getByFieldName` function to tell NeoForm how exactly it should retrieve field value from data state. The reason we need to do that is because you might have a plain object data, Immutable or something else with a different "interface".

`getByFieldName` arguments:
* `data` — form data state
* `name` — field name

Instead of writing your own `getByFieldName` function, you can use [neoform-plain-object-helpers](https://github.com/zero-plus-x/neoform/tree/master/packages/neoform-plain-object-helpers) or [neoform-immutable-helpers](https://github.com/zero-plus-x/neoform/tree/master/packages/neoform-immutable-helpers):

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

### App

Finally, we assemble everything together:

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

What's going on here? As you may gussed, all fields in NeoForm are controlled. So, in order to update them, we need to update data state.

And this is the second core idea of NeoForm — we have only one `onChange` handler for the entire form instead of multiple ones for each field. So, whenever some field requests a change, NeoForm updates data state and then passes updated value to that field with a new render.

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

Where the props are:

* `validate` – validation action, can be called whenever you want (`onChange`, `onBlur`, etc)
* `validationStatus` – `true` | `false` | `undefined` status of field validation
* `validationMessage` – an optional message passed from validator

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

* `validate` – entire form validation action. It will validate all fields and if they're valid, it will a provided callback (your `onSubmit` handler in most cases)
* `validationStatus` – `true` | `false` | `undefined` status of entire form validation

#### Validators

Validation process in NeoForm is always asynchronous and "validator" is just a Promise. Rejected one is for `validationStatus: false` prop and resolved is for `validationStatus: true`. An optional argument passed to a rejected or fulfilled Promise becomes `validationMessage` prop.

```js
export const requiredValidator = (value) => {
  if (value === '') {
    return Promise.reject('💩');
  }

  return Promise.resolve('🎉');
};
```

It's up to you how to manage multiple validators — with a simple `Promise.all()` or some complex asynchronous sequences — as long as validator returns a single Promise.

To use a validator you should just pass it in a `validator` prop to an inidividual field:

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

For a better understanding, you can play with some examples in this repo:

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
