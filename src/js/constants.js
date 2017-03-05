const ItemTypes = {
  HEAD: 'head',
  CHEST: 'chest',
  LEGS: 'legs',
  HANDS: 'hands',
  FEET: 'feet',
  WEAPON: 'weapon',
  SPECIAL: 'special',
  JEWELRY: 'jewelry',
};

const ItemSlots = {
  HEAD: { slot: 'head', accepts: [ItemTypes.HEAD] },
  CHEST: { slot: 'chest', accepts: [ItemTypes.CHEST] },
  LEGS: { slot: 'legs', accepts: [ItemTypes.LEGS] },
  HANDS: { slot: 'hands', accepts: [ItemTypes.HANDS] },
  FEET: { slot: 'feet', accepts: [ItemTypes.FEET] },
  LEFTHAND: { slot: 'lefthand', accepts: [ItemTypes.WEAPON] },
  RIGHTHAND: { slot: 'righthand', accepts: [ItemTypes.WEAPON] },
  JEWELRY: { slot: 'jewelry', accepts: [ItemTypes.JEWELRY] },
};

module.exports = {
  ItemSlots,
  ItemTypes,
};
