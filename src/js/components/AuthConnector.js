/* Connects Rebase auth to Redux store */
// import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import base from '../base';
import { actionCreators } from '../redux';

class AuthConnector extends Component {
  componentWillMount(){
    const { signedIn, signedOut } = this.props;
    base.onAuth((user) => {
      if (user) {
        signedIn(user);
      } else {
        signedOut();
      }
    });
  }
  getChildContext() {
    const { user } = this.props;
    return { user };
  }
  render() {
    return this.props.children;
  }
}

AuthConnector.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
  signedIn: PropTypes.func.isRequired,
  signedIn: PropTypes.func.isRequired,
};

AuthConnector.childContextTypes = {
  user: PropTypes.object,
};

export default connect(
  (state) => ({
    user: state.user,
  }),
  (dispatch) => ({
    signedIn: (user) => { dispatch(actionCreators.signedIn(user)) },
    signedOut: () => { dispatch(actionCreators.signedOut()) },
  })
)(AuthConnector);
