import React, { Component, PropTypes } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

const TRANSITION = {
  'expand-60': {
    enterTimeout: 300,
    LeaveTimeout: 300,
  },
  'expand-160': {
    enterTimeout: 300,
    LeaveTimeout: 300,
  },
}

class TransitionGroup extends Component {
  render() {
    const {
      children,
      component = 'div',
      transition = 'expand-60',
    } = this.props;

    const transitionProps = TRANSITION[transition];

    return (
          <ReactCSSTransitionGroup
            component={component}
            transitionName={`rt-${transition}`}
            transitionEnterTimeout={transitionProps.enterTimeout}
            transitionLeaveTimeout={transitionProps.LeaveTimeout}>
            {children}
          </ReactCSSTransitionGroup>
    );
  }
}

TransitionGroup.contextTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
  component: PropTypes.string,
  transitionName: PropTypes.oneOf([
    'expand-60',
    'expand-160',
  ]),
};

export default TransitionGroup
