import React, { Component, PropTypes } from 'react';

export default (validator) => (Target) => {
  class Validate extends Component {
    componentWillReceiveProps(nextProps, nextContext) {
      if (nextProps.value !== this.props.value) {
        const state = nextContext.neoform.state;

        validator(nextProps.value)
          .then(() => {
            if (
              !('validation' in state) ||
              !(this.props.name in state.validation) ||
              state.validation[this.props.name].status !== true
            ) {
              this.context.neoform.updateState('validation', this.props.name, {
                status: true
              });
            }
          })
          .catch((error) => {
            if (
              !('validation' in state) ||
              !(this.props.name in state.validation) ||
              state.validation[this.props.name].status !== false
            ) {
              this.context.neoform.updateState('validation', this.props.name, {
                status: false,
                message: error
              });
            }
          });
      }
    }

    getValidationStatus() {
      if (
        ('validation' in this.context.neoform.state) &&
        (this.props.name in this.context.neoform.state.validation)
      ) {
        return this.context.neoform.state.validation[this.props.name].status;
      }
    }

    getValidationMessage() {
      if (
        ('validation' in this.context.neoform.state) &&
        (this.props.name in this.context.neoform.state.validation)
      ) {
        return this.context.neoform.state.validation[this.props.name].message;
      }
    }

    render() {
      return (
        <Target
          {...this.props}
          valid={this.getValidationStatus()}
          validationMessage={this.getValidationMessage()}
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
