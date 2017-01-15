import React, { Component, PropTypes } from 'react';
import getBySelector from 'lodash.get';
import setBySelector from 'lodash.set';

export default (Target) => {
  class FormValidation extends Component {
    constructor(props) {
      super(props);

      this.state = {};
      this.getValidation = this.getValidation.bind(this);
      this.setValidation = this.setValidation.bind(this);
    }

    getChildContext() {
      return {
        neoform: {
          ...this.context.neoform,
          getValidation: this.getValidation,
          setValidation: this.setValidation
        }
      };
    }

    getValidation(name) {
      return getBySelector(this.state, name);
    }

    setValidation(name, value) {
      this.setState((prevState) => setBySelector(prevState, name, value));
    }

    render() {
      return (
        <Target
          {...this.props}
          validation={this.state}
        />
      );
    }
  }

  FormValidation.contextTypes = {
    neoform: PropTypes.object
  };

  FormValidation.childContextTypes = {
    neoform: PropTypes.object
  };

  return FormValidation;
};
