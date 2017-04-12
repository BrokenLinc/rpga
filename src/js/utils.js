import { assign, filter, sample, sumBy } from 'lodash';

import { ItemTypes, ItemScales } from './constants';
import { characterSpec, itemSpec } from './specs';

const rint = (min, max) => {
  return min + Math.floor(Math.random() * (max - min + 1));
};

const getFullCharacter = (_character) => {
  const character = characterSpec(_character);
  return assign(getCombatValues(character), character);
};

const getCombatValues = (character) => {
  return {
    isCharacter: true,
    combat: getCombatTotal(character),
    attack: getActionTotal('attack', character),
    defense: getActionTotal('defense', character),
    attacks: getActionItems('attack', character),
    defenses: getActionItems('defense', character),
  };
};

const getEquippedItems = (items) => {
  //return filter(items, 'slot');
  return filter(items, 'isEquipped');
};

const getActionItems = (type, character) => {
  return filter(getEquippedItems(character.items), { combatAction: type });
};

const getCombatTotal = (character) => {
  // base 2 combat
  return 2 + sumBy(getEquippedItems(character.items), 'combat');
};

const getActionTotal = (type, character) => {
  // base 1 attack, 1 defense
  return 1 + sumBy(getActionItems(type, character), 'combat');
};

const generateCharacter = () => {
  const imageFiles = [
    'character1.png',
    'character2.png',
    'character3.png',
    'character4.png',
    'character5.png',
    'character6.png',
  ];
  const names = [
    'Crampus the Wise',
    'Jellybean the Spice Queen',
  ];
  return {
    name: sample(names),
    imageFile: sample(imageFiles),
    items: [{
      name: 'Questionable Dagger',
      imageFile: 'top-hat.png',
      type: ItemTypes.WEAPON,
      combatAction: 'attack',
      combat: 1,
      isEquipped: true,
    }],
  };
};

// const generateItem = (combat) => {
//   // TODO: clone sample from a list. Apply scalar automatically.
//   const item = {
//     name: 'Top Hat (w/bird)',
//     imageFile: 'top-hat.png',
//     type: ItemTypes.HEAD,
//     combatAction: 'defense',
//   };
//   item.combat = ItemScales[item.type] * Math.ceil(combat/16) + rint(0,1);
//   return item;
// };

module.exports = {
  rint,
  getFullCharacter,
  generateCharacter,
  //generateItem,
  // getCombatValues,
  // getEquippedItems,
  // getActionItems,
  // getCombatTotal,
  // getActionTotal,
};
