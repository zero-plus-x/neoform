import React, { Component } from 'react';
import setByPath from 'lodash.set';

import Form from '../Form';

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

    this.onChange = this.onChange.bind(this);
  }

  onChange(name, value) {
    this.setState((prevState) => setByPath(prevState, name, value));
  }

  render() {
    return (
      <Form data={this.state} onChange={this.onChange}/>
    );
  }
}

export default App;
