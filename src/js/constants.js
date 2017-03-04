const ItemTypes = {
  HEAD: 'head',
  WEAPON: 'weapon',
};

const ItemSlots = {
  HEAD: { slot: 'head', accepts: [ItemTypes.HEAD] },
  LEFTHAND: { slot: 'lefthand', accepts: [ItemTypes.WEAPON] },
};

module.exports = {
  ItemSlots,
  ItemTypes,
};
