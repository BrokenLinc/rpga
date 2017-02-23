import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { RouteTransition } from 'react-router-transition';

import base from '../base';

class PageTemplate extends Component {
  constructor(props) {
    super(props);

    this.onSignOutClick = this.onSignOutClick.bind(this);
  }
  onSignOutClick(event) {
    base.unauth();
    event.preventDefault();
  }
  render() {
    const { children, location, user } = this.props;

    let menu = null;

    if(!user.isLoading) {
      menu = user.email ? (
        <div>
          <Link to="/">Dashboard</Link>
          <Link to="/characters">Characters</Link>
          <a onClick={ this.onSignOutClick } href="javascript:void(0)">Sign out</a>
        </div>
      ) : null;
    }

    return (
      <div>
        <header>
          Project Name
          { menu }
        </header>
        <RouteTransition
          pathname={location.pathname}
          atEnter={{ opacity: 0 }}
          atLeave={{ opacity: 0 }}
          atActive={{ opacity: 1 }}
        >
          {children}
        </RouteTransition>
      </div>
    );
  }
}

PageTemplate.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
};

export default connect(
  (state) => ({
    user: state.user,
  })
)(PageTemplate);
