import React, { Component, PropTypes } from 'react';

class Item extends Component {
  render() {
    const { item, itemKey, toggleEquip } = this.props;
    const { name } = item;

    return (
      <div>
        { name }
        { toggleEquip ? (
          <a onClick={() => { toggleEquip(itemKey, item) }} href="javascript:void(0)">equip/unequip</a>
        ) : null }
      </div>
    );
  }
}

Item.propTypes = {
  item: PropTypes.object.isRequired,
  itemKey: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ]).isRequired,
  toggleEquip: PropTypes.func,
};

export default Item;
