import React, { PropTypes, Component } from 'react';
import { DragSource } from 'react-dnd';
import cn from 'classnames';

import { itemImage } from '../paths';

class DraggableItem extends Component {
  componentDidMount() {
    this.props.connectDragPreview(this.image);
  }
  render() {
    const { item, isDragging, connectDragSource } = this.props;

    return connectDragSource(
      <div className={cn('item', { 'is-dragging': isDragging })}>
        <img ref={(c) => { this.image = c; }} className="item__image" src={itemImage(item.imageFile)} />
        <div className="item__tooltip">
            <div className="item__name">{ item.name }</div>
            <div className="item__type">{ item.type }</div>
        </div>
    </div>
    );
  }
}

DraggableItem.propTypes = {
  connectDragPreview: PropTypes.func.isRequired,
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
    connectDragPreview: connect.dragPreview(),
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  })
)(DraggableItem);
