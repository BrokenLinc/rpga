import React, { Component, PropTypes } from 'react';
import { DropTarget } from 'react-dnd';
import cn from 'classnames';

class Inventory extends Component {
  render() {
    const { canDrop, children, className, connectDropTarget, isOver } = this.props;

    return connectDropTarget(
      <div className={cn(className, { 'can-drop': canDrop, 'is-over': isOver })}>
        {children}
      </div>
    );
  }
}

Inventory.propTypes = {
  accepts: PropTypes.arrayOf(PropTypes.string).isRequired,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
  className: PropTypes.string,
  connectDropTarget: PropTypes.func.isRequired,
  onDrop: PropTypes.func.isRequired,
};

export default DropTarget(
  props => props.accepts,
  {
    drop(props, monitor) {
      props.onDrop(monitor.getItem());
    },
  },
  (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
  })
)(Inventory);
