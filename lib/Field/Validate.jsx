import React, { Component, PropTypes } from 'react';

export default (validator) => (Target) => {
  class Validate extends Component {
    componentWillReceiveProps(nextProps) {
      if (nextProps.value !== this.props.value) {
        validator(nextProps.value)
          .then(() => {
            if (this.getValidation().status !== true) {
              this.context.neoform.updateState('validation', {
                [this.props.name]: {
                  status: true
                }
              });
            }
          })
          .catch((error) => {
            if (this.getValidation().status !== false) {
              this.context.neoform.updateState('validation', {
                [this.props.name]: {
                  status: false,
                  message: error
                }
              });
            }
          });
      }
    }

    getValidation() {
      return this.context.neoform.getValue('validation', this.props.name) || {};
    }

    render() {
      const { status, message } = this.getValidation();

      return (
        <Target
          {...this.props}
          valid={status}
          validationMessage={message}
        />
      );
    }
  }

  Validate.propTypes = {
    name: PropTypes.string,
    value: PropTypes.any
  };

  Validate.contextTypes = {
    neoform: PropTypes.object
  };

  return Validate;
};
