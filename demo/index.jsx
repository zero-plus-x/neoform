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
      style={style}
      type="text"
      onChange={(e) => changeValue(e.target.value)}
    />
  );
};

const Input = Field(MyInput);

const MyCheckbox = ({ changeValue, value, ...props }) => (
  <input
    {...props}
    checked={value}
    type="checkbox"
    onChange={(e) => changeValue(e.target.checked)}
  />
);

const Checkbox = Field(MyCheckbox);

const MyForm = ({ value = {}, valid = {} }) => (
  <form
    onSubmit={(e) => {
      console.log('fields', value);
      console.log('validation', valid);
      e.preventDefault();
    }}
  >
    <h1>Simple Form</h1>
    <div>
      <label>First Field</label>
      <Input name="firstField" placeholder="First Field" value=""/>
    </div>
    <div>
      <label>Last Name</label>
      <Input name="secondField" placeholder="Second Field" value=""/>
    </div>
    <div>
      <label>
        <Checkbox name="checkbox" value={false}/>
        Some Checkbox
      </label>
    </div>
    <button disabled={valid.firstField === false || !value.checkbox}>Send</button>
  </form>
);

const App = compose(
  Form(console.log),
  Validate({
    firstField: (value) => value !== ''
  })
)(MyForm);

render(
  <App/>,
  global.document.getElementById('app'),
);
