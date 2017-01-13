import React from 'react';
import { render } from 'react-dom';
import { compose } from 'recompose';

import { Value, Validate, Form, Group } from '../lib/';

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
        onChange={(e) => {
          changeValue(e.target.value);
        }}
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

const MyGroup1 = Group(
  (props) => <div {...props}/>
);
const MyGroup2 = Group(
  (props) => <div {...props}/>
);

const MyForm = ({ values = {}, validation = {} }) => (
  <form
    onSubmit={(e) => {
      console.log('values', values);
      console.log('validation', validation);
      e.preventDefault();
    }}
  >
    <h1>form</h1>
    <MyGroup1 name="group1">
      <h2>group1</h2>
      <MyGroup2 name="group2">
        <h3>group2</h3>
        <div>
          <label>First Field</label>
          <Input initialValue="Hej" name="firstField" placeholder="First Field"/>
        </div>
        <div>
          <label>Second Field</label>
          <Input initialValue="Hej2" name="secondField" placeholder="Second Field"/>
        </div>
      </MyGroup2>
    </MyGroup1>
    <div>
      <label>
        <Checkbox initialValue={false} name="checkbox"/>
        Some Checkbox
      </label>
    </div>
    <button>Send</button>
  </form>
);

const App = compose(
  Form(console.log)
)(MyForm);

render(
  <App/>,
  global.document.getElementById('app'),
);
