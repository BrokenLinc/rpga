import { connect } from 'react-redux';
import { Form, Message, Segment } from 'semantic-ui-react';

import base from '../base';

class SignIn extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: 'landerson@352inc.com',
      password: 'password',
      error: null,
    };
  }
  onEmailChange = (event) => {
    this.setState({ email: event.target.value });
  }
  onPasswordChange = (event) => {
    this.setState({ password: event.target.value });
  }
  onSignInFormSubmit = (event) => {
    const { email, password } = this.state;
    const { router } = this.context;

    this.setState({ error: null });

    base.authWithPassword({ email, password }, (error, user) => {
      if(error) {
        this.setState({ error });
      } else {
        // Give it a second, it's going to space
        // setTimeout(() => { router.push('/characters'); }, 1);
      }
    });

    event.preventDefault();
  }
  // onSignUpClick(event) {
  //   const { email, password } = this.state;
  //
  //   event.preventDefault();
  // }
  onSignOutClick = (event) => {
    base.unauth();
    event.preventDefault();
  }
  render() {
    const { user } = this.context;
    const { email, password, error } = this.state;

    if (user.isLoading) return null;

    return user.email ? (
      <Message>
        You're already signed in as { user.email }.<br/>
        <a onClick={ this.onSignOutClick } href="javascript:void(0)">Sign out</a>.
      </Message>
    ) : (
      <Segment color={ error ? 'red' : null }>
        <Form onSubmit={ this.onSignInFormSubmit } warning={!!error}>
          <Message warning header="Oops! Check your spelling and try again."/>
          <Form.Input label="Email" value={ email } onChange={ this.onEmailChange } placeholder="someone@gmail.com" error={!!error} />
          <Form.Input label="Password" value={ password } onChange={ this.onPasswordChange } type="password" error={!!error} />
          <Form.Button type="submit">Sign In</Form.Button>
        </Form>
      </Segment>
    );
  };
}

SignIn.contextTypes = {
  router: PropTypes.object,
  user: PropTypes.object,
};

export default SignIn;
