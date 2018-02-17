import { createElement, Component } from 'react';
import PropTypes from 'prop-types';
import { setDisplayName, wrapDisplayName } from 'recompose';

const field = (Target) => {
  class Field extends Component {
    constructor(props, context) {
      super(props, context);

      this.onChange = this.onChange.bind(this);
    }

    onChange(value) {
      return this.context.neoform.updateData(this.props.name, value);
    }

    render() {
      return createElement(Target, {
        ...this.props,
        value: this.context.neoform.getValue(this.props.name),
        onChange: this.onChange
      });
    }
  }

  Field.propTypes = {
    name: PropTypes.string.isRequired
  };

  Field.contextTypes = {
    neoform: PropTypes.object
  };

  if (process.env.NODE_ENV !== 'production') {
    return setDisplayName(wrapDisplayName(Target, 'field'))(Field);
  }

  return Field;
};

export default field;
