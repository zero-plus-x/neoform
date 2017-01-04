import React, { Component, PropTypes } from 'react';

const propName = 'value';

export default (Target) => {
  class Field extends Component {
    constructor(...args) {
      super(...args);

      this.onChange = this.onChange.bind(this);
    }

    componentWillMount() {
      this.context.neoform.updateState(propName, this.props.name, this.props.value);
    }

    onChange(value) {
      this.context.neoform.updateState(propName, this.props.name, value);
    }

    getValue() {
      if (this.context.neoform.propName) {
        return this.context.neoform[propName][this.props.name];
      }

      return this.props.value;
    }

    getState() {
      return Object.keys(this.context.neoform).reduce((result, key) => {
        const group = this.context.neoform[key];

        if (this.props.name in group) {
          result[key] = group[this.props.name];
        } else if (key === propName) {
          result[key] = this.props.value;
        }

        return result;
      }, {});
    }

    render() {
      const state = this.getState();
      // console.log(state);
      const props = {
        ...this.props,
        ...state,
        changeValue: this.onChange
      };

      return (
        <Target { ...props } />
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
