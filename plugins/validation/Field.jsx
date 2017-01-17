import React, { Component, PropTypes } from 'react';

const omitProp = (props, key) => {
  return Object.keys(props).reduce((result, nextKey) => {
    if (nextKey !== key) {
      result[nextKey] = props[nextKey];
    }

    return result;
  }, {});
};

export default (Target) => {
  class FieldValidation extends Component {
    constructor(...args) {
      super(...args);

      this.validate = this.validate.bind(this);
    }

    componentDidMount() {
      this.context.neoform.registerValidator(this.props.name, this.props.validator);
    }

    getValidation() {
      return this.context.neoform.getValidation(this.props.name) || {};
    }

    validate(value) {
      return this.props.validator(value)
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
      const props = omitProp(this.props, 'validator');

      return (
        <Target
          {...props}
          validate={this.validate}
          validationMessage={message}
          validationStatus={status}
        />
      );
    }
  }

  FieldValidation.propTypes = {
    name: PropTypes.string,
    validator: PropTypes.func
  };

  FieldValidation.contextTypes = {
    neoform: PropTypes.object
  };

  return FieldValidation;
};
