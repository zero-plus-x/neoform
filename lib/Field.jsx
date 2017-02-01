import React, { Component, PropTypes } from 'react';

const defaultOnChangeHandler = (value) => value;

export default (valueProp = 'value', onChangeHandler = defaultOnChangeHandler) => (Target) => {
  class Field extends Component {
    constructor(...args) {
      super(...args);

      this.onChange = this.onChange.bind(this);
    }

    onChange(arg) {
      const value = onChangeHandler(arg);

      this.context.neoform.updateData(this.props.name, value);
    }

    render() {
      const props = {
        ...this.props,
        [valueProp]: this.context.neoform.getValue(this.props.name),
        onChange: this.onChange
      };

      return (
        <Target {...props}/>
      );
    }
  }

  Field.contextTypes = {
    neoform: PropTypes.object
  };

  Field.propTypes = {
    name: PropTypes.string.isRequired
  };

  return Field;
};
