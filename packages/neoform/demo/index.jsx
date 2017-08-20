import React, { Component } from 'react';

import { getValue, setValue } from 'neoform-plain-object-helpers';
import Form from './Form';

class Demo extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      firstName: 'John',
      lastName: 'Doe',
      phoneNumbers: [
        123123,
        456456
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
    this.setState((prevState) => setValue(prevState, name, value));
  }

  render() {
    return (
      <Form
        data={this.state}
        getValue={getValue}
        onChange={this.onChange}
      />
    );
  }
}

export default Demo;
