import SignIn from './SignIn';

class RestrictedComponent extends Component {
  render() {
    const { ChildComponent, user } = this.props;

    if (user.isLoading) return null;

    return user.email ? <ChildComponent {...this.props}/> : <SignIn/>
  }
}
RestrictedComponent.propTypes = {
  ChildComponent: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
};

export default RestrictedComponent;
