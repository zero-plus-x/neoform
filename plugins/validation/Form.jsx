import React, { Component, PropTypes } from 'react';

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
      return this.state[name];
    }

    setValidation(name, value) {
      this.setState({
        [name]: value
      });
    }

    render() {
      return (
        <Target
          {...this.props}
          validationStatus={this.state}
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
