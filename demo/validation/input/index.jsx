import React, { Component } from 'react';
import { render } from 'react-dom';
import setByPath from 'lodash.set';
import { Form, Field } from '../../../lib/';
import { FormValidation, FieldValidation } from '../../../plugins/validation/';

const Input = Field(({ changeValue, ...props }) => {
  return (
    <input
      {...props}
      type="text"
      onChange={(e) => changeValue(e.target.value)}
    />
  );
});

const ValidationInput = Field(FieldValidation(({
  validate,
  validationStatus,
  validationMessage,
  value,
  changeValue,
  ...props
}) => {
  const style = {
    backgroundColor: validationStatus === false ? 'red' : 'white'
  };
  const renderError = () => {
    if (validationStatus !== false || !validationMessage) {
      return null;
    }

    return (
      <span>{validationMessage}</span>
    );
  };

  return (
    <span>
      <input
        {...props}
        style={style}
        type="text"
        value={value}
        onBlur={() => validate(value)}
        onChange={(e) => changeValue(e.target.value)}
      />
      {renderError()}
    </span>
  );
}));


const requiredValidator = (value) => {
  return value === '' ?
         Promise.reject('required') :
         Promise.resolve();
};

const MyForm = Form(FormValidation(({ data, validationStatus }) => {
  return (
    <form
      onSubmit={(e) => {
        console.log('data', data);
        console.log('validation', validationStatus);
        e.preventDefault();
      }}
    >
      <h1>simple form</h1>
      <h2>personal data</h2>
      <div>
        <label>
          first name
          <Input name="firstName"/>
        </label>
      </div>
      <div>
        <label>
          last name
          <Input name="lastName"/>
        </label>
      </div>
      <h2>phone numbers (required)</h2>
      <ul>
        {
          data.phoneNumbers.map((phoneNumber, index) => (
            <li key={index}>
              <ValidationInput name={`phoneNumbers[${index}]`} validator={requiredValidator}/>
            </li>
          ))
        }
      </ul>
      <hr/>
      <button type="submit">submit</button>
    </form>
  );
}));

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      firstName: 'John',
      lastName: 'Doe',
      phoneNumbers: [
        '123123',
        '456456'
      ]
    };

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

render(
  <App/>,
  global.document.getElementById('app')
);
