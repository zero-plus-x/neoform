/* eslint-disable no-console */
import React, { Component } from 'react';

import { getValue, setValue } from '../../neoform-plain-object-helpers/src';
import Form from './Form';

class Demo extends Component {
  constructor(props) {
    super(props);

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
    this.onInvalid = this.onInvalid.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(name, value) {
    this.setState((prevState) => setValue(prevState, name, value));
  }

  onInvalid() {
    console.log('invalid:', this.state);
  }

  onSubmit() {
    console.log('submit:', this.state);
  }

  render() {
    return (
      <Form
        data={this.state}
        getValue={getValue}
        onChange={this.onChange}
        onInvalid={this.onInvalid}
        onSubmit={this.onSubmit}
      />
    );
  }
}

export default Demo;
