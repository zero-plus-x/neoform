import React from 'react';
import { render } from 'react-dom';
import { compose } from 'recompose';

import { Value, Validate, Form } from '../lib/';

const MyInput = ({ valid, validationMessage, changeValue, ...props }) => {
  const style = {
    backgroundColor: valid === false ? 'red' : 'white'
  };
  const renderError = (message) => {
    if (!message) {
      return null;
    }

    return (
      <span>{message}</span>
    );
  };

  return (
    <span>
      <input
        {...props}
        style={style}
        type="text"
        onChange={(e) => changeValue(e.target.value)}
      />
      {renderError(validationMessage)}
    </span>
  );
};

const Input = compose(
  Value,
  Validate((value) => value === '' ? Promise.reject('oh no!') : Promise.resolve())
)(MyInput);

const MyCheckbox = ({ changeValue, value, ...props }) => (
  <input
    {...props}
    checked={value}
    type="checkbox"
    onChange={(e) => changeValue(e.target.checked)}
  />
);

const Checkbox = Value(MyCheckbox);

const MyForm = ({ values = {}, validation = {} }) => (
  <form
    onSubmit={(e) => {
      console.log('values', values);
      console.log('validation', validation);
      e.preventDefault();
    }}
  >
    <h1>Simple Form</h1>
    <div>
      <label>First Field</label>
      <Input initialValue="Hej" name="firstField" placeholder="First Field"/>
    </div>
    <div>
      <label>
        <Checkbox initialValue={false} name="checkbox"/>
        Some Checkbox
      </label>
    </div>
    <button disabled={(validation.firstField && validation.firstField.status === false)}>Send</button>
  </form>
);

const App = compose(
  Form(console.log)
)(MyForm);

render(
  <App/>,
  global.document.getElementById('app'),
);
