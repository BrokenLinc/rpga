import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { RouteTransition } from 'react-router-transition';
import { Icon } from 'semantic-ui-react'

import base from '../base';
import paths from '../paths';

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

    return (
      <div className="pagetemplate">
        { !user.isLoading && user.email ? (
          <header className="pageheader">
            <nav>
              <span>undermud</span>
              <Link to={ paths.characters() }><Icon name="address book" fitted /></Link>
              <a onClick={ this.onSignOutClick } href="javascript:void(0)"><Icon name="log out" fitted /></a>
            </nav>
          </header>
        ) : null }
        <RouteTransition
          className="routetransition"
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
