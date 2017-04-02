import { assign, filter, sample, sumBy } from 'lodash';

import { characterSpec } from './specs';

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
  return sumBy(getEquippedItems(character.items), 'combat');
};

const getActionTotal = (type, character) => {
  return sumBy(getActionItems(type, character), 'combat');
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
  };
};

module.exports = {
  rint,
  getFullCharacter,
  generateCharacter,
  // getCombatValues,
  // getEquippedItems,
  // getActionItems,
  // getCombatTotal,
  // getActionTotal,
};
