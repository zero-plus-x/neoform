/* eslint-disable promise/always-return */
import { Component } from 'react';
import PropTypes from 'prop-types';
import { createEagerFactory, setDisplayName, wrapDisplayName } from 'recompose';
import omit from 'just-omit';

const isValidForm = (fields) => Object.keys(fields).every((name) => fields[name].status === true);

const formValidation = (Target) => {
  const factory = createEagerFactory(Target);

  class FormValidation extends Component {
    constructor(props, context) {
      super(props, context);

      this.validators = {};
      this.state = {
        fields: {}
      };
      this.getValidation = this.getValidation.bind(this);
      this.validateForm = this.validateForm.bind(this);
      this.validateField = this.validateField.bind(this);
      this.registerValidator = this.registerValidator.bind(this);
      this.unregisterValidator = this.unregisterValidator.bind(this);
    }

    getChildContext() {
      return {
        neoform: {
          ...this.context.neoform,
          getValidation: this.getValidation,
          validate: this.validateField,
          registerValidator: this.registerValidator,
          unregisterValidator: this.unregisterValidator
        }
      };
    }

    registerValidator(name, validator) {
      this.validators[name] = validator;
    }

    unregisterValidator(name) {
      this.validators = omit(this.validators, name);

      this.setState((prevState) => ({
        fields: omit(prevState.fields, name)
      }));
    }

    getValidation(name) {
      return this.state.fields[name] || {};
    }

    validateField(name) {
      const validator = this.validators[name];
      const value = this.context.neoform.getValue(name);

      validator(value)
        .then((message) => {
          this.setState((prevState) => ({
            fields: {
              ...prevState.fields,
              [name]: {
                status: true,
                message
              }
            }
          }));
        })
        .catch((message) => {
          this.setState((prevState) => ({
            fields: {
              ...prevState.fields,
              [name]: {
                status: false,
                message
              }
            }
          }));
        });
    }

    validateForm(successHandler, errorHandler) {
      const fields = {};

      return Promise.all(
        Object.keys(this.validators)
          .map((name) => {
            const validator = this.validators[name];
            const value = this.context.neoform.getValue(name);

            return validator(value)
              .then((message) => {
                fields[name] = {
                  status: true,
                  message
                };
              })
              .catch((message) => {
                fields[name] = {
                  status: false,
                  message
                };
              });
          })
      )
      .then(() => {
        this.setState({ fields });

        if (isValidForm(fields) && typeof successHandler === 'function') {
          successHandler();
        } else if (typeof errorHandler === 'function') {
          errorHandler();
        }
      });
    }

    render() {
      return factory({
        ...this.props,
        validate: this.validateForm,
        validationStatus: isValidForm(this.state.fields)
      });
    }
  }

  FormValidation.contextTypes = {
    neoform: PropTypes.object
  };

  FormValidation.childContextTypes = {
    neoform: PropTypes.object
  };

  if (process.env.NODE_ENV !== 'production') {
    return setDisplayName(wrapDisplayName(Target, 'formValidation'))(FormValidation);
  }

  return FormValidation;
};

export default formValidation;
