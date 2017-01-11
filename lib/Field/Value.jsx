import React, { Component, PropTypes } from 'react';

export default (Target) => {
  class Value extends Component {
    constructor(...args) {
      super(...args);

      this.onChange = this.onChange.bind(this);
    }

    componentWillMount() {
      this.context.neoform.updateState('values', this.props.name, this.props.initialValue);
    }

    onChange(value) {
      this.context.neoform.updateState('values', this.props.name, value);
    }

    getValue() {
      if (!('values' in this.context.neoform.state)) {
        return this.props.initialValue;
      }

      return this.context.neoform.state.values[this.props.name];
    }

    render() {
      // TODO: omit
      const { initialValue, ...props } = this.props; // eslint-disable-line no-unused-vars

      return (
        <Target
          {...props}
          changeValue={this.onChange}
          value={this.getValue()}
        />
      );
    }
  }

  Value.contextTypes = {
    neoform: PropTypes.object
  };

  Value.propTypes = {
    initialValue: PropTypes.any,
    name: PropTypes.string,
    value: PropTypes.any
  };

  return Value;
};
