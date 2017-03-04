import { map } from 'lodash';
import React, { Component, PropTypes } from 'react';

import base from '../base';
import { ItemTypes } from '../constants';
import DraggableItem from './DraggableItem';
import GenericDropTarget from './GenericDropTarget';

const allItemTypes = map(ItemTypes, (t) => t);

class Inventory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      isLoading: true,
    };

    this.handleDrop = this.handleDrop.bind(this);
  }
  componentDidMount(){
    const { characterKey, uid } = this.props;

    this.ref = base.bindToState(`users/${uid}/characters/${characterKey}/items`, {
      context: this,
      state: 'items',
      asArray: true,
      keepKeys: true,
      then: () => {
        this.setState({isLoading: false})
      },
    });
  }
  componentWillUnmount(){
    base.removeBinding(this.ref);
  }
  handleDrop(data) {
    if(data.item.slot) {
      // TODO: unequip
      console.log('unequip', data.item);
    }
  }
  render() {
    const { items } = this.state;

    return (
      <div>
        <GenericDropTarget
          className="inventory"
          accepts={allItemTypes}
          onDrop={this.handleDrop}
        >
          {map(items, (item) => item.slot ? null :
            <DraggableItem
              key={item.key}
              item={item}
            />
          )}
        </GenericDropTarget>
      </div>
    );
  }
}

Inventory.propTypes = {
  uid: PropTypes.string.isRequired,
  characterKey: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
};

export default Inventory;
