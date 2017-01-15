import React, { Component } from 'react';
import { render } from 'react-dom';
import { compose } from 'recompose';
import setBySelector from 'lodash.set';
import { Form, Field } from '../lib/';
import { FieldValidation, FormValidation } from '../plugins/validation/';

const MyInput = ({ validate, validationStatus, validationMessage, changeValue, ...props }) => {
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
        onChange={(e) => {
          changeValue(e.target.value);
          validate(e.target.value);
        }}
      />
      {renderError()}
    </span>
  );
};

const Input = compose(
  Field,
  FieldValidation((value) => value === '' ? Promise.reject('required') : Promise.resolve())
)(MyInput);

const MyForm = Form(FormValidation(({ validation, data }) => {
  return (
    <form
      onSubmit={(e) => {
        console.log('data', data);
        console.log('validation', validation);
        e.preventDefault();
      }}
    >
      <div>
        <label>club name</label>
        <Input name="name"/>
      </div>
      <h2>members</h2>
      {
        data.members.map((member, memberIndex) => (
          <div key={memberIndex}>
            <h3>member {memberIndex + 1}</h3>
            <div>
              <label>first name</label>
              <Input name={`members[${memberIndex}].firstName`}/>
            </div>
            <div>
              <label>last name</label>
              <Input name={`members[${memberIndex}].lastName`}/>
            </div>
            <h4>hobbies</h4>
            <ul>
              {
                member.hobbies.map((hobby, hobbyIndex) => (
                  <li key={hobbyIndex}>
                    <Input name={`members[${memberIndex}].hobbies[${hobbyIndex}]`}/>
                  </li>
                ))
              }
            </ul>
          </div>
        ))
      }
      <button>submit</button>
    </form>
  );
}));

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: 'Club Name',
      members: [
        {
          firstName: 'John',
          lastName: 'Doe',
          hobbies: [
            'test 1',
            'test 2'
          ]
        },
        {
          firstName: 'Jane',
          lastName: 'Doe',
          hobbies: [
            'test 3',
            'test 4'
          ]
        }
      ]
    };

    this.onChange = this.onChange.bind(this);
  }

  onChange(name, value) {
    this.setState((prevState) => setBySelector(prevState, name, value));
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
