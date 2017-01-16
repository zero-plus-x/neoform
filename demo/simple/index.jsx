import React, { Component } from 'react';
import { render } from 'react-dom';
import setByPath from 'lodash.set';
import { Form, Field } from '../../lib/';

const Input = Field(({ changeValue, ...props }) => {
  return (
    <input
      {...props}
      type="text"
      onChange={(e) => changeValue(e.target.value)}
    />
  );
});

const MyForm = Form(({ data, addNewFriend }) => {
  return (
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
      <button type="button" onClick={addNewFriend}>add new friend</button>
      <hr/>
      <button type="submit">submit</button>
    </form>
  );
});

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      firstName: 'John',
      lastName: 'Doe',
      phoneNumbers: [
        '123123',
        '456456'
      ],
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

    this.onNewFriend = this.onNewFriend.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onChange(name, value) {
    this.setState((prevState) => setByPath(prevState, name, value));
  }

  onNewFriend() {
    this.setState((prevState) => ({
      friends: [
        ...prevState.friends,
        {
          firstName: 'This',
          lastName: 'Form'
        }
      ]
    }));
  }

  render() {
    return (
      <MyForm
        addNewFriend={this.onNewFriend}
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
