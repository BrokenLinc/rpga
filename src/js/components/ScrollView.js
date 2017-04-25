import React, { Component, PropTypes } from 'react';
import cn from 'classnames';

class ScrollView extends Component {
  constructor(props) {
    super(props);

    this.touchstart = this.touchstart.bind(this);
    this.touchmove = this.touchmove.bind(this);
  }
  touchstart(event) {
    this.lastPageY = event.pageY;
  }
  touchmove(event) {
    const allowUp = (this.el.scrollTop > 0);
    const allowDown = (this.el.scrollTop < this.el.scrollHeight);

    var scrollingUp = (event.pageY > this.lastPageY);
    var scrollingDown = !scrollingUp;
    var canScroll = (scrollingUp && allowUp) || (scrollingDown && allowDown);
    this.lastPageY = event.pageY;

    if (canScroll) {
      event.stopPropagation();
    } else {
      event.preventDefault();
    }
  }
  render() {
    const { children, className } = this.props;

    return (
      <div
        ref={el => { this.el = el; }}
        className={cn('scrollable', className)}
        onTouchStart={this.touchstart}
        onTouchMove={this.touchmove}
        style={{
          overflowY: 'scroll',
          WebkitOverflowScrolling: 'touch',
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
};

export default ScrollView;
