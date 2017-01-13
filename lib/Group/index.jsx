import React, { Component, PropTypes } from 'react';
import getByPath from 'lodash.get';

export default (Target) => {
  class Group extends Component {
    constructor(props, context) {
      super(props, context);

      this.getValue = this.getValue.bind(this);
      this.updateState = this.updateState.bind(this);
    }

    getChildContext() {
      const prevGroupsPath = this.context.neoform.groupsPath || [];
      const currentGroupsPath = prevGroupsPath.concat(this.props.name);

      return {
        neoform: {
          updateState: this.updateState,
          getValue: this.getValue,
          groupsPath: currentGroupsPath,
          state: this.context.neoform.state
        }
      };
    }

    getValue(prop, name) {
      const neoform = this.context.neoform;

      if (prop in neoform.state) {
        const prevGroupsPath = neoform.groupsPath || [];
        const currentPath = prevGroupsPath.concat(this.props.name, name);

        return getByPath(neoform.state[prop], currentPath);
      }
    }

    updateState(prop, newState) {
      this.context.neoform.updateState(prop, {
        [this.props.name]: newState
      });
    }

    render() {
      return (
        <Target {...this.props}/>
      );
    }
  }

  Group.contextTypes = {
    neoform: PropTypes.object
  };

  Group.childContextTypes = {
    neoform: PropTypes.object
  };

  Group.propTypes = {
    name: PropTypes.string
  };

  return Group;
};
