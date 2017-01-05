import React, { Component, PropTypes } from 'react';

export default (callback) => (Target) => {
  class Form extends Component {
    constructor(props) {
      super(props);

      this.state = {};

      this.updateState = this.updateState.bind(this);
    }

    getChildContext() {
      return {
        neoform: {
          updateState: this.updateState,
          ...this.state
        }
      };
    }

    updateState(prop, name, value) {
      this.setState((prevState) => ({
        [prop]: {
          ...prevState[prop],
          [name]: value
        }
      }), () => {
        if (typeof callback === 'function') {
          callback(prop, name, value);
        }
      });
    }

    render() {
      return (
        <Target { ...this.props } { ...this.state }/>
      );
    }
  }

  Form.childContextTypes = {
    neoform: PropTypes.object
  };

  return Form;
};
