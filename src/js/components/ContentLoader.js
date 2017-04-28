import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

class ContentLoader extends Component {
  render() {
    const { align, children, isLoading } = this.props;

    const alignClass = align ? `is-${align}` : null;

    return (
      <div className={cn('contentloader', {'is-loading': isLoading}, alignClass)}>
        {children}
      </div>
    );
  }
}

ContentLoader.contextTypes = {
  align: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
  isLoading: PropTypes.bool,
};

export default ContentLoader
