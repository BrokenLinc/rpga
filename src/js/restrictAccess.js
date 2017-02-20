import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

const restrictAccess = (ChildComponent) => {
  class RestrictedComponent extends Component {
    componentWillMount() {
      const { router } = this.context;
      const { user } = this.props;

      if(!user.email) {
        router.push('/');
      }
    }
    render() {
      return <ChildComponent {...this.props}/>
    }
  }
  RestrictedComponent.contextTypes = {
    router: PropTypes.object
  };
  return connect(
    (state) => ({
      user: state.user,
    })
  )(RestrictedComponent);
};

export default restrictAccess;
