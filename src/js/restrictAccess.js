import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import SignIn from './components/SignIn';

const restrictAccess = (ChildComponent) => {
  class RestrictedComponent extends Component {
    render() {
      const { user } = this.props;

      if (user.isLoading) return null;

      return user.email ? <ChildComponent {...this.props}/> : <SignIn/>
    }
  }
  return connect(
    (state) => ({
      user: state.user,
    })
  )(RestrictedComponent);
};

export default restrictAccess;
