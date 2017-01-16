import React, { Component, PropTypes } from 'react';
import getBySelector from 'lodash.get';

export default (Target) => {
  class FormValidation extends Component {
    constructor(props) {
      super(props);

      this.state = {};
      this.validators = {};
      this.registerValidator = this.registerValidator.bind(this);
      this.getValidation = this.getValidation.bind(this);
      this.setValidation = this.setValidation.bind(this);
      this.validate = this.validate.bind(this);
    }

    getChildContext() {
      return {
        neoform: {
          ...this.context.neoform,
          registerValidator: this.registerValidator,
          getValidation: this.getValidation,
          setValidation: this.setValidation
        }
      };
    }

    registerValidator(name, validator) {
      this.validators[name] = validator;
    }

    getValidation(name) {
      return this.state[name];
    }

    setValidation(name, value) {
      this.setState({
        [name]: value
      });
    }

    validate(data) {
      return Promise.all(
        Object.keys(this.validators).map((name) => {
          const value = getBySelector(data, name);
          const validator = this.validators[name](value);

          return new Promise((resolve, reject) => {
            validator
             .then(() => {
               this.setState({
                 [name]: {
                   status: true
                 }
               }, resolve);
             })
             .catch((error) => {
               this.setState({
                 [name]: {
                   status: false,
                   message: error
                 }
               }, reject);
             });
          });
        })
      )
      .catch(() => Promise.reject(this.state));
    }

    render() {
      return (
        <Target
          {...this.props}
          validate={this.validate}
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
