import React, { PropTypes, Component } from 'react';
import { DragSource } from 'react-dnd';

const style = {
  border: '1px dashed gray',
  backgroundColor: 'white',
  padding: '0.5rem 1rem',
  marginRight: '1.5rem',
  marginBottom: '1.5rem',
  cursor: 'move',
  display: 'block',
  color: 'black',
};

class DraggableItem extends Component {
  render() {
    const { item, isDragging, connectDragSource } = this.props;
    const opacity = isDragging ? 0.4 : 1;

    return connectDragSource(
      <div style={{ ...style, opacity }}>
        { item.name }
      </div>,
    );
  }
}

DraggableItem.propTypes = {
  connectDragSource: PropTypes.func.isRequired,
  isDragging: PropTypes.bool.isRequired,
  // name: PropTypes.string.isRequired,
  // type: PropTypes.string.isRequired,
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
