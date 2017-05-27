import { connect } from 'react-redux';
import { RouteTransition } from 'react-router-transition';

import base from '../base';
import paths from '../paths';

class PageTemplate extends Component {
  onSignOutClick = (event) => {
    base.unauth();
    event.preventDefault();
  }
  render() {
    const { children, location, user } = this.props;

    const isUserLoaded = (!user.isLoading && !!user.email);

    return (
      <div className="pagetemplate">
        { isUserLoaded && (
          <header className="pageheader">
            <nav>
              <span>undermud</span>
              <Link to={ paths.characters() }><Icon name="address book" /> characters</Link>
              <a onClick={ this.onSignOutClick } href="javascript:void(0)">quit <Icon name="log out" /></a>
            </nav>
          </header>
        )}
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
