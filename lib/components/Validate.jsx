import React, { Component, PropTypes } from 'react';

const propName = 'valid';

export default (validators) => (Target) => {
  class Validate extends Component {
    componentWillReceiveProps(nextProps, nextContext) {
      Object.keys(validators).forEach((field) => {
        const prevState = this.context.neoform.state;
        const nextState = nextContext.neoform.state;

        if (
          prevState.value &&
          prevState.value[field] !== nextState.value[field] &&
          (field in nextState.value)
        ) {
          const result = validators[field](nextState.value[field]);

          if (!nextState[propName] || result !== nextState[propName][field]) {
            nextContext.neoform.updateState(propName, field, result);
          }
        }
      });
    }

    render() {
      return (
        <Target {...this.props}/>
      );
    }
  }

  Validate.contextTypes = {
    neoform: PropTypes.object
  };

  return Validate;
};
