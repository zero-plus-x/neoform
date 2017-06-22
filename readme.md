# NeoForm

[![travis](https://img.shields.io/travis/zero-plus-x/neoform/master.svg?style=flat-square)](https://travis-ci.org/zero-plus-x/neoform)
[![coverage](https://img.shields.io/codecov/c/github/zero-plus-x/neoform/master.svg?style=flat-square)](https://codecov.io/github/zero-plus-x/neoform)

Better form state management for React where data state is directly mapped to form fields, so form becomes just a representation and changing interface for that data state.

* [Usage](#usage)
  * [Intro](#intro)
  * [`Field`](#field)
  * [`Form`](#form)
  * [App](#app)
    * [`getValue`](#getValue)
    * [`setValue`](#setValue)
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

Each data field can be referenced with a "key" or “property” path. You might be familiar with this concept from working with immutable data structures or helpers like `lodash.get()`.

```js
"user": {
  "name": "Pepe",  // "user.name"
  "status": "sad", // "user.status"
  "friends": [
    "darkness"     // "user.friends[0]"
  ]
}
```

The first core idea of NeoForm is to map data to form fields using these key/property paths. We'll refer to this data as "form state" below.

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

A `value` from a form state (can be used in checkbox as a `checked` attribute if it's boolean, and so on) and `onChange` handler to let NeoForm know that value should be changed:

```js
import { Field } from 'neoform';

const MyInput = ({ value, onChange }) => (
  <input
    value={value}
    onChange={(e) => onChange(e.target.value)}
  />
);

export default Field(MyInput);
```

Use `(e) => e.target.checked` if you have a checkbox or just `(value) => value` if you have some custom/3rd-party field implementation.

### `Form`

Now when the input is ready we can use use it in a form:

```js
import MyInput from '../MyInput';

const MyForm = () => (
  <form>
    <MyInput name="user.name" />
    <MyInput name="user.status" />
    <MyInput name="user.friends[0]" />
  </form>
);

export default MyForm;
```

Let's connect this form to NeoForm by wrapping it with a `Form` HOC:

```js
import { Form } from 'neoform';

import MyInput from '../MyInput';

const MyForm = () => (
  <form>
    <MyInput name="user.name" />
    <MyInput name="user.status" />
    <MyInput name="user.friends[0]" />
  </form>
);

export default Form(MyForm);
```

### App

Finally, we assemble everything together:

```js
import { setValue, getValue } from 'neoform-plain-object-helpers';

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
    this.setState((prevState) => setValue(prevState, name, value))
  }

  onSubmit() {
    console.log(`Submitting ${this.state.data}`)
  }

  render() {
    <MyForm
      data={this.state.data}
      valueGetter={getValue}
      onChange={this.onChangeHandler}
      onSubmit={this.onSubmit}
    />
  }
}
```

What's going on here? As you may guessed, all fields in NeoForm are controlled. So, in order to update them, we need to update data state:

#### `getValue`

First, we need to specify `getValue` prop to tell NeoForm how exactly it should retrieve field value from data state. The reason to do that is because you might have a plain object data, Immutable or something else with a different "interface".

Instead of writing your own `getValue` function, you can use one from  [neoform-plain-object-helpers](https://github.com/zero-plus-x/neoform/tree/master/packages/neoform-plain-object-helpers) or [neoform-immutable-helpers](https://github.com/zero-plus-x/neoform/tree/master/packages/neoform-immutable-helpers) package.

`getValue` arguments:

* `data` — form data state
* `name` — field name

#### `setValue`

Second, we have only one `onChange` handler for the entire form instead of multiple ones for each field. So, whenever some field requests a change, we need to update form data by updating the state so updated value is passed to that field with a new render.

Instead of writing your own handler, you can use `setValue` helper from  [neoform-plain-object-helpers](https://github.com/zero-plus-x/neoform/tree/master/packages/neoform-plain-object-helpers) or [neoform-immutable-helpers](https://github.com/zero-plus-x/neoform/tree/master/packages/neoform-immutable-helpers) package.

`setValue` arguments:

* `data` — form data state
* `name` — field name
* `value` — new field value

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

export default Field(FieldValidation(MyInput));
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

export default Form(FormValidation(MyForm));
```

Where:

* `validate` – entire form validation action. It will validate all fields and if they're valid, it will a provided callback (`onSubmit` handler in most cases)
* `validationStatus` – `true` | `false` | `undefined` status of entire form validation

#### Validators

"Validator" is just a Promise. Rejected one is for `validationStatus: false` prop and resolved is for `validationStatus: true`. An optional argument passed to a rejected or fulfilled Promise becomes `validationMessage` prop.

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
