import React, { Component, PropTypes } from 'react';
import cn from 'classnames';

class Icon extends Component {
    render() {
      const { name } = this.props;
      return (
        <i className={cn('zmdi',`zmdi-${name}`)}></i>
      );
    }
}

Icon.propTypes = {
  name: PropTypes.string.isRequired,
};

export default Icon;
