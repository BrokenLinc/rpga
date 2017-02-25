import { assign } from 'lodash';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import RestrictedComponent from './components/RestrictedComponent';

const restrictAccess = (ChildComponent) => {
  return connect(
    (state) => ({
      user: state.user,
    }),
    null,
    (stateProps, dispatchProps, ownProps) => (assign(
      { ChildComponent },
      stateProps,
      dispatchProps,
      ownProps
    ))
  )(RestrictedComponent);
};

export default restrictAccess;
