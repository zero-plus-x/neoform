import React, { Component } from 'react';
import setByPath from 'lodash.set';

import Form from '../Form';

class App extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = props.data;
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
