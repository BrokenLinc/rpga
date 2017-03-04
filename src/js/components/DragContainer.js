import React, { Component, PropTypes } from 'react';

import { ItemTypes } from '../constants';
import DraggableItem from './DraggableItem';
import ItemDropTarget from './ItemDropTarget';
import InventoryDropTarget from './InventoryDropTarget';

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
            <InventoryDropTarget
              key={index}
              className="itemslot"
              accepts={accepts}
              onDrop={item => this.handleDrop(index, item)}
            >
              <DraggableItem
                name="fake dagger"
                type={ItemTypes.WEAPON}
              />
            </InventoryDropTarget>
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

export default DragContainer;
