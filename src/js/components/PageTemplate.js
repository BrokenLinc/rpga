import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

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
    const { children, user } = this.props;

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
        {children}
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
