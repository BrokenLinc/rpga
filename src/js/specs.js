import { assign } from 'lodash';

module.exports = {
  characterSpec: (o) => assign({
    name: 'Unknown',
    life: 5,
    imageFile: 'character1.png',
  }, o),
  itemSpec: (o) => assign({
    name: 'Unknown',
    imageFile: 'top-hat.png',
  }, o),
};
