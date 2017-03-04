import React, { PropTypes, Component } from 'react';
import { DragSource } from 'react-dnd';
import cn from 'classnames';

class DraggableItem extends Component {
  render() {
    const { item, isDragging, connectDragSource } = this.props;

    return connectDragSource(
      <div className={cn('item', { 'is-dragging': isDragging })}>
        { item.name }
      </div>
    );
  }
}

DraggableItem.propTypes = {
  connectDragSource: PropTypes.func.isRequired,
  isDragging: PropTypes.bool.isRequired,
  item: PropTypes.object.isRequired,
}

export default DragSource(
  props => props.item.type,
  {
    beginDrag({ item }) {
      return { item };
    },
  },
  (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  })
)(DraggableItem);
