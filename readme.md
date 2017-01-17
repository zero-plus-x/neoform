# NeoForm

Better form state management for React in which data from API can be directly mapped to form fields, so form becomes just a representation and changing interface for that data, as it should be.

WIP.

## Install

```sh
npm install --save neoform
# or
yarn add neoform
```

## Usage

Let say you have some data like this:

```js
const data = {
  firstName: 'John',
  lastName: 'Doe',
  friends: [
    {
      firstName: 'Sad',
      lastName: 'Pepe'
    },
    {
      firstName: 'Forever',
      lastName: 'Alone'
    }
  ]
};

export default data;
```

And you want to create a form to 1) represent and 2) change it.

First, you need to wrap your `<input/>` in a `Field` and tell it how to get changed data:

```js
import { Field } from 'neoform';

const MyInput = ({ changeValue, value, ...props }) => (
  <input
    {...props}
    type="text"
    value={value}
    onChange={(e) => changeValue(e.target.value)}
  />
);

export default Field(MyInput);

```

Then wrap `<form>` in `Form`, mapping every `MyInput` to specific data values with a special `path` syntax in `name` property ([lodash.get](https://lodash.com/docs/4.17.4#get) is used internally):

```js
import { Form } from 'neoform';
import MyInput from 'my-components/MyInput';

const MyForm = ({ data }) => (
  <form onSubmit={(e) => { console.log(data); e.preventDefault(); }}>
    <h2>personal</h2>
    <div>
      <label>
        first name
        <MyInput name="firstName"/>
      </label>
    </div>
    <div>
      <label>
        last name
        <MyInput name="lastName"/>
      </label>
    </div>
    <h2>friends</h2>
    <ul>
      <li>
        <div>
          <label>
            first name
            <MyInput name="friends[0].firstName"/>
          </label>
        </div>
        <div>
          <label>
            last name
            <MyInput name="friends[1].lastName"/>
          </label>
        </div>
      </li>
    </ul>
    <button type="submit">submit</button>
  </form>
);

export default Form(MyForm);
```

Use `MyForm` by passing `data` and managing its changes with `onChange` the way you like:

```js
import setByPath from 'lodash.set';
import MyForm from 'my-components/MyForm';
import data from './data';

class App extends Component {
  constructor(...args) {
    super(...args);

    this.state = data;
    this.onChange = this.onChange.bind(this);
  }

  onChange(name, value) {
    this.setState((prevState) => setByPath(prevState, name, value));
  }

  render() {
    return (
      <MyForm
        data={this.state}
        onChange={this.onChange}
      />
    );
  }
}

export default App;

```

See examples in [demo/](demo/) for more details like validation:

```sh
DEMO=<demo name> yarn run demo
```

available demos:

* `simple` – nested form data with dynamic array (default)
* `validation/input` – input validation triggering `onBlur`
* `validation/submit` – form validation triggering `onSubmit`
