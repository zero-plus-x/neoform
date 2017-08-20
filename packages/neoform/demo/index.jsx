/* eslint-disable no-console */
import React, { Component } from 'react';

import { getValue, setValue } from 'neoform-plain-object-helpers';
import Form from './Form';

class Demo extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      firstName: 'John',
      lastName: 'Doe',
      friends: [
        {
          firstName: 'Pepe',
          lastName: 'Sad'
        },
        {
          firstName: '',
          lastName: 'Darkness'
        }
      ]
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit() {
    console.log('submit:', this.state);
  }

  onChange(name, value) {
    this.setState((prevState) => setValue(prevState, name, value));
  }

  render() {
    return (
      <Form
        data={this.state}
        getValue={getValue}
        onChange={this.onChange}
        onSubmit={this.onSubmit}
      />
    );
  }
}

export default Demo;
