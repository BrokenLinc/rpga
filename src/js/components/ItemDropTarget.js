import React, { Component, PropTypes } from 'react';
import { DropTarget } from 'react-dnd';

const style = {
  height: '12rem',
  width: '12rem',
  marginRight: '1.5rem',
  marginBottom: '1.5rem',
  color: 'white',
  padding: '1rem',
  textAlign: 'center',
  fontSize: '1rem',
  lineHeight: 'normal',
  float: 'left',
};

class ItemDropTarget extends Component {
  render() {
    const { accepts, children, isOver, canDrop, connectDropTarget, lastDroppedItem } = this.props;
    const isActive = isOver && canDrop;

    let backgroundColor = '#222';
    if (isActive) {
      backgroundColor = 'darkgreen';
    } else if (canDrop) {
      backgroundColor = 'darkkhaki';
    }

    return connectDropTarget(
      <div style={{ ...style, backgroundColor }}>
        {/*isActive ?
          'Release to drop' :
          `This itemSlot accepts: ${accepts.join(', ')}`
        */}

        {/*lastDroppedItem &&
          <p>Last dropped: {JSON.stringify(lastDroppedItem)}</p>
        */}
        { children }

      </div>,
    );
  }
}

ItemDropTarget.propTypes = {
  connectDropTarget: PropTypes.func.isRequired,
  isOver: PropTypes.bool.isRequired,
  canDrop: PropTypes.bool.isRequired,
  accepts: PropTypes.arrayOf(PropTypes.string).isRequired,
  lastDroppedItem: PropTypes.object,
  onDrop: PropTypes.func.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
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
)(ItemDropTarget);
