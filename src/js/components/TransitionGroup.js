import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

const TRANSITION = {
  'expand-60': {
    enterTimeout: 300,
    LeaveTimeout: 300,
  },
  'expand-160': {
    enterTimeout: 300,
    LeaveTimeout: 300,
  },
  'flex-grow': {
    enterTimeout: 300,
    LeaveTimeout: 300,
  },
};

class TransitionGroup extends Component {
  render() {
    const {
      children,
      className,
      component = 'div',
      transition = 'expand-60',
    } = this.props;

    const transitionProps = TRANSITION[transition];

    return (
          <ReactCSSTransitionGroup
            component={component}
            className={className}
            transitionName={`rt-${transition}`}
            transitionEnterTimeout={transitionProps.enterTimeout}
            transitionLeaveTimeout={transitionProps.LeaveTimeout}>
            {children}
          </ReactCSSTransitionGroup>
    );
  }
}

TransitionGroup.contextTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
  className: PropTypes.string,
  component: PropTypes.string,
  transitionName: PropTypes.oneOf([
    'expand-60',
    'expand-160',
    'flex-grow',
  ]),
};

export default TransitionGroup
