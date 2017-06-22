import React from 'react';

import Form from '~/neoform/src/Form';
import FormValidation from '~/neoform-validation/src/Form';

import Input from '../Input';

const requiredValidator = (value) => {
  if (typeof value === 'undefined' || value === null || value === '') {
    return Promise.reject('required');
  }

  return Promise.resolve();
};

const MyForm = ({
  data,
  validate,
  validationStatus,
  validationFields,
  onSubmit
}) => (
  <form
    onSubmit={(e) => {
      e.preventDefault();
      validate(onSubmit);
    }}
  >
    <h1>simple form</h1>
    <h2>personal data</h2>
    <div>
      <label>
        first name (required)
        <Input name="firstName" validator={requiredValidator}/>
      </label>
    </div>
    <div>
      <label>
        last name (required)
        <Input name="lastName" validator={requiredValidator}/>
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
                first name
                <Input name={`friends[${index}].firstName`}/>
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
        <div style={{ color: 'red' }}>
          <div>Form is invalid</div>
          <div>{JSON.stringify(validationFields)}</div>
        </div>
      )
    }
  </form>
);

export default Form(FormValidation(MyForm));
