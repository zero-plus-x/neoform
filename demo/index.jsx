import React from 'react';
import { render } from 'react-dom';
import { compose } from 'recompose';

import { Form, Field, Validate } from '../lib/';

const MyInput = ({ valid, changeValue, ...props }) => {
  const style = {
    backgroundColor: valid === false ? 'red' : 'white'
  };

  return (
    <input
      {...props}
      type="text"
      style={style}
      onChange={(e) => changeValue(e.target.value)}
    />
  );
};

const Input = Field(MyInput);

const MyCheckbox = ({ changeValue, value, ...props }) => (
  <input
    {...props}
    type="checkbox"
    checked={value}
    onChange={(e) => changeValue(e.target.checked)}
  />
);

const Checkbox = Field(MyCheckbox);

const MyForm = (({ value = {}, valid = {} }) => (
  <form
    onSubmit={(e) => {
      console.log('fields', value);
      console.log('validation', valid);
      e.preventDefault();
    }}
  >
    <h1>hej</h1>
    <Input name="input" value="dns" />
    <Input name="input2" value="pdr" />
    <Checkbox name="checkbox" value={false} />
    <button disabled={valid.input === false || !value.checkbox}>submit</button>
  </form>
));

const App = compose(
  Form(console.log),
  Validate({
    input: (value) => value !== ''
  })
)(MyForm);

render(
  <App />,
  global.document.getElementById('app'),
);
