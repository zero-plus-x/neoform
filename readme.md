<p align="center">
  <img src="./logo.png" width="300"/>
</p>

<p align="center">
  <a href="https://travis-ci.org/zero-plus-x/neoform"><img src="https://img.shields.io/travis/zero-plus-x/neoform/master.svg?style=flat-square" alt="travis"/></a>
  <a href="https://codecov.io/github/zero-plus-x/neoform"><img src="https://img.shields.io/codecov/c/github/zero-plus-x/neoform/master.svg?style=flat-square" alt="travis"/></a>
</p>

---

Better form state management for React where data state is directly mapped to form fields, so form becomes just a representation and changing interface for that data state.

* [Usage](#usage)
  * [Intro](#intro)
  * [`field`](#field)
  * [`form`](#form)
  * [App](#app)
    * [`getValue`](#getvalue)
    * [`setValue`](#setvalue)
  * [Validation](#validation)
    * [`fieldValidation`](#fieldvalidation)
    * [`formValidation`](#formvalidation)
    * [Validators](#validators)
* [FAQ](#faq)
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

Each data field can be referenced with a "key" or "property" path. You might be familiar with this concept from working with immutable data structures or helpers like `lodash.get()`.

```js
"user": {
  "name": "Pepe",  // "user.name"
  "status": "sad", // "user.status"
  "friends": [
    "darkness"     // "user.friends.0"
  ]
}
```

The first core idea of NeoForm is to map data to form fields using these key/property paths. We'll refer to this data as "form state" below.

Let's see how it works with a step-by-step example. First, we need to install the following set of dependencies:

```
yarn add prop-types recompose neoform neoform-validation neoform-plain-object-helpers
```

We'll start with creating a simple input:

### `field`

```js
const MyInput = () => (
  <input/>
);

export default MyInput;
```

After wrapping this input with `field` [HOC](https://medium.com/@dan_abramov/mixins-are-dead-long-live-higher-order-components-94a0d2f9e750) from NeoForm we'll have:

#### `value` and `onChange` props

A `value` from a form state (can be used in checkbox as a `checked` attribute if it's boolean, and so on) and `onChange` handler to let NeoForm know that value should be changed:

```js
import { field } from 'neoform';

const MyInput = ({ value, onChange }) => (
  <input
    value={value}
    onChange={(e) => onChange(e.target.value)}
  />
);

export default field(MyInput);
```

Use `(e) => e.target.checked` if you have a checkbox or just `(value) => value` if you have some custom/3rd-party field implementation.

### `form`

Now when the input is ready we can use it in a form:

```js
import MyInput from '../MyInput';

const MyForm = () => (
  <form>
    <MyInput name="user.name"/>
    <MyInput name="user.status"/>
    <MyInput name="user.friends.0"/>
  </form>
);

export default MyForm;
```

Let's connect this form to NeoForm by wrapping it with a `form` HOC:

```js
import { form } from 'neoform';

import MyInput from '../MyInput';

const MyForm = () => (
  <form>
    <MyInput name="user.name"/>
    <MyInput name="user.status"/>
    <MyInput name="user.friends.0"/>
  </form>
);

export default form(MyForm);
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
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(name, value) {
    this.setState((prevState) => setValue(prevState, name, value));
  }

  onSubmit() {
    console.log('submit:', this.state.data);
  }

  render() {
    <MyForm
      data={this.state.data}
      getValue={getValue}
      onChange={this.onChange}
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

:information_source: Consider using [Recompose `pure()` HOC](https://github.com/acdlite/recompose/blob/master/docs/API.md#pure) or [`React.PureComponent`](https://facebook.github.io/react/docs/react-api.html#react.purecomponent) for fields to avoid unnecessary renders and get performance boost in some cases.

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

#### `fieldValidation`

`fieldValidation` is another HOC:

```js
import { field } from 'neoform';
import { fieldValidation } from 'neoform-validation';

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

export default field(fieldValidation(MyInput));
```

Where the props are:

* `validate` – validation action, can be called whenever you want (`onChange`, `onBlur`, etc)
* `validationStatus` – `true` | `false` | `undefined` status of field validation
* `validationMessage` – an optional message passed from validator

#### `formValidation`

```js
import { form } from 'neoform';
import { formValidation } from 'neoform-validation';

import MyInput from '../MyInput';

const MyForm = ({
  /* data, */
  validate,
  validationStatus,
  onInvalid,
  onSubmit
}) => (
  <form onSubmit={(e) => {
    validate(onSubmit, onInvalid)
    e.preventDefault();
  }}>
    <MyInput name="user.name"/>
    <MyInput name="user.status"/>
    <MyInput name="user.friends.0"/>
  </form>
);

export default form(formValidation(MyForm));
```

Where:

* `validate` – entire form validation action: it will validate all fields and if they're valid it will invoke a first provided callback (`onSubmit` handler in most cases) or second callback (something like `onInvalid`) if they're invalid
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

To use a validator you should just pass it in a `validator` prop to an individual field:

```js
import { requiredValidator } from '../validators'

// …

<form>
  <MyInput name="user.name" validator={requiredValidator} />
  <MyInput name="user.status"/>
  <MyInput name="user.friends.0"/>
</form>

// …
```

:tv: [Check out live demo](https://www.webpackbin.com/bins/-KrbNqAfDYNwm07UmzTb).

## FAQ

> But this is just like my entire form is a single component with a single `onChange`!

Right.

> Does it affect performance because of re-rendering entire form on every field change?

Probably in some cases it does. But as it was mentioned here before consider using [Recompose `pure()` HOC](https://github.com/acdlite/recompose/blob/master/docs/API.md#pure) or [`React.PureComponent`](https://facebook.github.io/react/docs/react-api.html#react.purecomponent) to avoid that.

> What about Redux?

Absolutely same approach: call an action on form `onChange` and then use plain/immutable helper to return updated data state from a reducer.


## Status

This is a [monorepo](https://github.com/babel/babel/blob/master/doc/design/monorepo.md) composed of these packages:

| package | version | description |
| ------- | ------- | ----------- |
| [neoform](packages/neoform/) | [![npm](https://img.shields.io/npm/v/neoform.svg?style=flat-square)](https://www.npmjs.com/package/neoform) | Core toolkit with `form` and `field` HOCs |
| [neoform-validation](packages/neoform-validation/) | [![npm](https://img.shields.io/npm/v/neoform-validation.svg?style=flat-square)](https://www.npmjs.com/package/neoform-validation) | `formValidation` and `fieldValidation` HOCs |
| [neoform-plain-object-helpers](packages/neoform-plain-object-helpers/) | [![npm](https://img.shields.io/npm/v/neoform-plain-object-helpers.svg?style=flat-square)](https://www.npmjs.com/package/neoform-plain-object-helpers) | `getValue` and `setValue` helpers for plain object state |
| [neoform-immutable-helpers](packages/neoform-immutable-helpers/) | [![npm](https://img.shields.io/npm/v/neoform-immutable-helpers.svg?style=flat-square)](https://www.npmjs.com/package/neoform-immutable-helpers) | `getValue` and `setValue` helpers for [Immutable](https://github.com/facebook/immutable-js) state |

## Development

1. Create a new folder in `packages/`, let's say `neoform-foo`.
2. See `package.json` in already existing packages and create new `neoform-foo/package.json`.
3. Put source code in `neoform-foo/src/`, it will be transpiled and bundled into `neoform-foo/dist/`, `neoform-foo/lib/` and `neoform-foo/es/`.
4. Put tests written with Jest in `neoform-foo/test/`.
5. Put demo in `neoform-foo/demo/`, it will be rendered and wrapped with HMR.

Available scripts using [Start](https://github.com/start-runner/start):

```
yarn start build <package>
yarn start demo <package>
yarn start test
yarn start testWatch
yarn start lint
```

Available demos:

```
yarn start demo neoform
yarn start demo neoform-validation
```
