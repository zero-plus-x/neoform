import React, { Component } from 'react';

import { getValue, setValue } from 'neoform-plain-object-helpers';
import Form from './Form';

class App extends Component {
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
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(name, value) {
    this.setState((prevState) => setValue(prevState, name, value));
  }

  onSubmit() {
    this.props.onSubmit(this.state);
  }

  render() {
    return (
      <Form
        data={this.state}
        getValue={getValue}
        onChange={this.onChange}
        onInvalid={this.props.onInvalid}
        onSubmit={this.onSubmit}
      />
    );
  }
}

export default App;
