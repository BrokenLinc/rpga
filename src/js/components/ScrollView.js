const DO_FAKE_SCROLL = false;

const rubberBandMovement = distance => {
  return distance < 49 ?
    distance :
    Math.sqrt(Math.max(0, distance)) * 7;
};

class ScrollView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      paddingTop: 0,
      paddingBottom: 0,
    };
  }
  touchstart = (event) => {
    this.lastPageY = event.touches.item(0).pageY;
    this.hasScrolled = false;
  }
  touchmove = (event) => {
    const thisPageY = event.touches.item(0).pageY;
    const movement = thisPageY - this.lastPageY;

    const allowUp = (this.el.scrollTop > 0);
    const allowDown = (this.el.scrollTop < this.el.scrollHeight - this.el.offsetHeight);

    const scrollingUp = (movement > 0);
    const scrollingDown = !scrollingUp;
    const canScroll = (scrollingUp && allowUp) || (scrollingDown && allowDown);

    if (canScroll) {
      this.hasScrolled = true;
      event.stopPropagation();
    } else {
      event.preventDefault();

      if(DO_FAKE_SCROLL) {
        if(!this.hasScrolled) {
          this.isFakeScrolling = true;

          if(scrollingUp) {
            this.setState({
              paddingTop: rubberBandMovement(movement),
            });
          }
          if(scrollingDown) {
            this.setState({
              paddingBottom: rubberBandMovement(-movement),
            });
          }
        }
      }
    }
  }
  touchend = () => {
    if(DO_FAKE_SCROLL) {
      this.isFakeScrolling = false;
      this.collapsePadding();
    }
  }
  collapsePadding = () => {
    // Tween it down to zero until interrupted or within 1/2px
    const { paddingTop, paddingBottom } = this.state;
    if(paddingTop > 0 || paddingBottom > 0 && !this.isFakeScrolling) {
      const newPaddingTop = paddingTop < 0.5 ? 0 : paddingTop * 0.9;
      const newPaddingBottom = paddingBottom < 0.5 ? 0 : paddingBottom * 0.9;
      this.setState({
        paddingTop: newPaddingTop,
        paddingBottom: newPaddingBottom,
      });
      window.requestAnimationFrame(this.collapsePadding);
    }
  }
  componentDidUpdate() {
    if(this.state.paddingBottom) {
      this.el.scrollTop = this.el.scrollHeight - this.el.offsetHeight;
    }
  }
  render() {
    const { paddingTop, paddingBottom } = this.state;
    const { children, className, alwaysShowScrollbars } = this.props;

    return (
      <div
        ref={el => { this.el = el; }}
        className={cn('scrollable', className)}
        onTouchStart={this.touchstart}
        onTouchMove={this.touchmove}
        onTouchEnd={this.touchend}
        onTouchCancel={this.touchend}
        style={{
          overflowY: alwaysShowScrollbars ? 'scroll' : 'auto',
          WebkitOverflowScrolling: 'touch',
          paddingTop,
          paddingBottom
        }}
      >
        {children}
      </div>
    );
  }
}

ScrollView.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
  className: PropTypes.string,
  alwaysShowScrollbars: PropTypes.bool,
};

export default ScrollView;
