import React, { Component } from 'react';
import { getByFieldName, setByFieldName } from '~/neoform-plain-object-helpers/src/';

import Form from '../Form';

class App extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = props.data;
    this.onChange = this.onChange.bind(this);
  }

  onChange(name, value) {
    this.setState((prevState) => setByFieldName(prevState, name, value));
  }

  render() {
    return (
      <Form
        data={this.state}
        getValue={getByFieldName}
        onChange={this.onChange}
      />
    );
  }
}

export default App;
