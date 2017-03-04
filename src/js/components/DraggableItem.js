import React, { PropTypes, Component } from 'react';
import { DragSource } from 'react-dnd';

const style = {
  border: '1px dashed gray',
  backgroundColor: 'white',
  padding: '0.5rem 1rem',
  marginRight: '1.5rem',
  marginBottom: '1.5rem',
  cursor: 'move',
  float: 'left',
  color: 'black',
};

class DraggableItem extends Component {
  render() {
    const { name, isDragging, connectDragSource } = this.props;
    const opacity = isDragging ? 0.4 : 1;

    return connectDragSource(
      <div style={{ ...style, opacity }}>
        { name }
      </div>,
    );
  }
}

DraggableItem.propTypes = {
  connectDragSource: PropTypes.func.isRequired,
  isDragging: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
}

export default DragSource(
  props => props.type,
  {
    beginDrag(props) {
      return {
        name: props.name,
      };
    },
  },
  (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  })
)(DraggableItem);
