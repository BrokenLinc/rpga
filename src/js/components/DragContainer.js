import React, { Component, PropTypes } from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend, { NativeTypes } from 'react-dnd-html5-backend';

import { ItemTypes } from '../constants';
import DraggableItem from './DraggableItem';
import ItemDropTarget from './ItemDropTarget';

class DragContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      itemSlots: [
        { accepts: [ItemTypes.HEAD] },
        { accepts: [ItemTypes.WEAPON] },
      ],
      items: [
        { name: 'Hat', type: ItemTypes.HEAD },
        { name: 'Trident', type: ItemTypes.WEAPON },
      ],
    };
  }

  handleDrop(index, item) {
    // TODO: equip / unequp
  }

  render() {
    const { items, itemSlots } = this.state;

    return (
      <div>
        <div style={{ overflow: 'hidden', clear: 'both' }}>
          {itemSlots.map(({ accepts }, index) =>
            <ItemDropTarget
              accepts={accepts}
              onDrop={item => this.handleDrop(index, item)}
              key={index}
            >
              <DraggableItem
                name="fake dagger"
                type={ItemTypes.WEAPON}
              />
            </ItemDropTarget>
          )}
        </div>

        <div style={{ overflow: 'hidden', clear: 'both' }}>
          {items.map(({ name, type }, index) =>
            <DraggableItem
              name={name}
              type={type}
              key={index}
            />,
          )}
        </div>
      </div>
    );
  }
}

DragContainer.propTypes = {
};

export default DragDropContext(HTML5Backend)(DragContainer);
