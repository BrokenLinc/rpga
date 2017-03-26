import { assign } from 'lodash';

module.exports = {
  characterSpec: (o) => assign({
    name: 'Unknown',
    life: 5,
    imageFile: 'character1.png',
  }, o),
};
