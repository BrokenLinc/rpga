import React, { Component, PropTypes } from 'react';
import cn from 'classnames';

class ContentLoader extends Component {
  render() {
    const { children, isLoading } = this.props;

    return (
      <div className={cn('contentloader', {'is-loading': isLoading})}>
        {children}
      </div>
    );
  }
}

ContentLoader.contextTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
  isLoading: PropTypes.bool,
};

export default ContentLoader
