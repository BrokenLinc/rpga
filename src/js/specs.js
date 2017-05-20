// import { assign } from 'lodash';

module.exports = {
  characterSpec: (o) => assign({
    name: 'Unknown',
    life: 5,
    imageFile: 'character1.png',
    level: 1,
    xp: 0,
  }, o),
  itemSpec: (o) => assign({
    name: 'Unknown',
    imageFile: 'top-hat.png',
    combat: 0,
    skillBonus: 0,
    level: 1,
  }, o),
};
