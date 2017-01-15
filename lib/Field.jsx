import React, { Component, PropTypes } from 'react';

export default (Target) => {
  class Field extends Component {
    constructor(...args) {
      super(...args);

      this.onChange = this.onChange.bind(this);
    }

    onChange(value) {
      this.context.neoform.updateData(this.props.name, value);
    }

    render() {
      return (
        <Target
          {...this.props}
          changeValue={this.onChange}
          value={this.context.neoform.getValue(this.props.name)}
        />
      );
    }
  }

  Field.contextTypes = {
    neoform: PropTypes.object
  };

  Field.propTypes = {
    name: PropTypes.string
  };

  return Field;
};
