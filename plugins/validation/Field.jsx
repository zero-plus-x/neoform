import React, { Component, PropTypes } from 'react';

export default (validator) => (Target) => {
  class FieldValidation extends Component {
    constructor(...args) {
      super(...args);

      this.validate = this.validate.bind(this);
    }

    getValidation() {
      return this.context.neoform.getValidation(this.props.name) || {};
    }

    validate(value) {
      return validator(value)
        .then(() => {
          if (this.getValidation().status !== true) {
            this.context.neoform.setValidation(this.props.name, {
              status: true
            });
          }
        })
        .catch((error) => {
          if (this.getValidation().status !== false) {
            this.context.neoform.setValidation(this.props.name, {
              status: false,
              message: error
            });
          }
        });
    }

    render() {
      const { status, message } = this.getValidation();

      return (
        <Target
          {...this.props}
          validate={this.validate}
          validationMessage={message}
          validationStatus={status}
        />
      );
    }
  }

  FieldValidation.propTypes = {
    name: PropTypes.string
  };

  FieldValidation.contextTypes = {
    neoform: PropTypes.object
  };

  return FieldValidation;
};
