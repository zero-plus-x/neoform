import React, { Component } from 'react';
import { getValue, setValue } from '~/neoform-plain-object-helpers/src/';

import Form from '../Form';

class App extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = props.data;
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

export default App;
