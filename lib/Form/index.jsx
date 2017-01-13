import React, { Component, PropTypes } from 'react';
import merge from 'lodash.merge';

export default (callback) => (Target) => {
  class Form extends Component {
    constructor(props) {
      super(props);

      this.state = {};

      this.getValue = this.getValue.bind(this);
      this.updateState = this.updateState.bind(this);
    }

    getChildContext() {
      return {
        neoform: {
          updateState: this.updateState,
          getValue: this.getValue,
          state: this.state
        }
      };
    }

    getValue(prop, name) {
      if (prop in this.state) {
        return this.state[prop][name];
      }
    }

    updateState(prop, newState) {
      this.setState((prevState) => ({
        [prop]: merge({}, prevState[prop], newState)
      }), () => {
        if (typeof callback === 'function') {
          callback(prop, newState);
        }
      });
    }

    render() {
      return (
        <Target {...this.props} {...this.state}/>
      );
    }
  }

  Form.childContextTypes = {
    neoform: PropTypes.object
  };

  return Form;
};
