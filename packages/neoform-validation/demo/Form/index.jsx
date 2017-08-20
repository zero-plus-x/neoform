import React from 'react';

import { Form } from 'neoform';
import { FormValidation } from '../../src';

import Input from '../Input';

const requiredValidator = (value) => {
  if (typeof value === 'undefined' || value === null || value === '') {
    return Promise.reject('required');
  }

  return Promise.resolve('valid');
};

const MyForm = ({
  data,
  validate,
  validationStatus,
  onSubmit,
  onInvalid
}) => (
  <form
    onSubmit={(e) => {
      e.preventDefault();
      validate(onSubmit, onInvalid);
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
    <div>
      <label>
        country
        <Input name="country"/>
      </label>
    </div>
    <h2>friends</h2>
    <ul>
      {
        data.friends.map((friend, index) => (
          <li key={index}>
            <div>
              <label>
                first name (required)
                <Input name={`friends[${index}].firstName`} validator={requiredValidator}/>
              </label>
            </div>
            <div>
              <label>
                last name
                <Input name={`friends[${index}].lastName`}/>
              </label>
            </div>
          </li>
        ))
      }
    </ul>
    <button type="submit">submit</button>
    {
      validationStatus === false && (
        <div style={{ color: 'red' }}>Form is invalid</div>
      )
    }
  </form>
);

export default Form(FormValidation(MyForm));
