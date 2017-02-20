import { map } from 'lodash';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import cn from 'classnames';

import base from '../base';

class SignIn extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: 'landerson@352inc.com',
      password: 'password',
      error: null,
    };

    this.onEmailChange = this.onEmailChange.bind(this);
    this.onPasswordChange = this.onPasswordChange.bind(this);
    this.onSignInClick = this.onSignInClick.bind(this);
    // this.onSignUpClick = this.onSignUpClick.bind(this);
    this.onSignOutClick = this.onSignOutClick.bind(this);
  }
  onEmailChange(event) {
    this.setState({ email: event.target.value });
  }
  onPasswordChange(event) {
    this.setState({ password: event.target.value });
  }
  onSignInClick(event) {
    const { email, password } = this.state;
    const { router } = this.context;

    this.setState({ error: null });

    base.authWithPassword({ email, password }, (error, user) => {
      if(error) {
        this.setState({ error });
      } else {
        // Give it a second, it's going to space
        setTimeout(() => { router.push('/characters'); }, 1);
      }
    });

    event.preventDefault();
  }
  // onSignUpClick(event) {
  //   const { email, password } = this.state;
  //
  //   event.preventDefault();
  // }
  onSignOutClick(event) {
    base.unauth();
    event.preventDefault();
  }
  render() {
    const { user } = this.props;
    const { email, password, error } = this.state;

    return user.email ? (
      <div className="form">
        You're already signed in as { user.email }.<br/>
        <a onClick={ this.onSignOutClick } href="javascript:void(0)">Sign out</a>.
      </div>
    ) : (
      <div className={cn('form', {'is-error':error})}>
        <div className="form-group">
          <label>Email</label>
    		  <input value={ email } onChange={ this.onEmailChange } className="form-control" type="text" placeholder="Email"/>
        </div>
        <div className="form-group">
          <label>Password</label>
          <input value={ password } onChange={ this.onPasswordChange } className="form-control" type="password" placeholder="Password"/>
        </div>
        <button onClick={ this.onSignInClick } className="btn btn-success">Sign In</button>
      </div>
    );
  };
}

SignIn.propTypes = {
  user: PropTypes.object.isRequired,
};

SignIn.contextTypes = {
  router: PropTypes.object,
  //user: PropTypes.object,
};

//export default SignIn;

export default connect(
  (state) => ({
    user: state.user,
  })
)(SignIn);
