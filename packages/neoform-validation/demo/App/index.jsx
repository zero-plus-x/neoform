import React, { Component } from 'react';
import setByPath from 'lodash.set';

import Form from '../Form';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
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
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(name, value) {
    this.setState((prevState) => setByPath(prevState, name, value));
  }

  onSubmit() {
    console.log('submit', this.state);
  }

  render() {
    return (
      <Form
        data={this.state}
        onChange={this.onChange}
        onSubmit={this.onSubmit}
      />
    );
  }
}

export default App;
