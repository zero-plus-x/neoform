import React from 'react';
import { getByFieldName } from '~/neoform-plain-object-helpers/src';
import Form from '~/neoform/src/Form';

import Input from '../Input';

const MyForm = ({ data }) => (
  <form
    onSubmit={(e) => {
      console.log(data);
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
    <h2>phone numbers</h2>
    <ul>
      {
        data.phoneNumbers.map((phoneNumber, index) => (
          <li key={index}>
            <Input name={`phoneNumbers[${index}]`}/>
          </li>
        ))
      }
    </ul>
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
  </form>
);

export default Form(getByFieldName)(MyForm);
