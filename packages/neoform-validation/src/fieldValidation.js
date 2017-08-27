import { Component } from 'react';
import PropTypes from 'prop-types';
import { createEagerFactory, setDisplayName, wrapDisplayName } from 'recompose';
import omit from 'just-omit';

const fieldValidation = (Target) => {
  const factory = createEagerFactory(Target);

  class FieldValidation extends Component {
    constructor(props, context) {
      super(props, context);

      this.validate = this.validate.bind(this);
    }

    componentDidMount() {
      if (this.props.validator) {
        this.context.neoform.registerValidator(this.props.name, this.props.validator);
      }
    }

    componentWillReceiveProps(nextProps) {
      // TODO: think about how to test this as a part of demo test suite
      if (nextProps.validator && nextProps.validator !== this.props.validator) {
        this.context.neoform.registerValidator(this.props.name, nextProps.validator);
      }
    }

    componentWillUnmount() {
      if (this.props.validator) {
        this.context.neoform.unregisterValidator(this.props.name);
      }
    }

    validate() {
      if (this.props.validator) {
        this.context.neoform.validate(this.props.name);
      }
    }

    render() {
      const validation = this.context.neoform.getValidation(this.props.name);

      return factory({
        ...omit(this.props, 'validator'),
        validate: this.validate,
        validationStatus: validation.status,
        validationMessage: validation.message
      });
    }
  }

  FieldValidation.contextTypes = {
    neoform: PropTypes.object
  };

  FieldValidation.propTypes = {
    validator: PropTypes.func
  };

  if (process.env.NODE_ENV !== 'production') {
    return setDisplayName(wrapDisplayName(Target, 'fieldValidation'))(FieldValidation);
  }

  return FieldValidation;
};

export default fieldValidation;
