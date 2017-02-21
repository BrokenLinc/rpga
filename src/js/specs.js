import { assign } from 'lodash';

module.exports = {
  characterSpec: (o) => assign({
    power: 3,
  }, o),
};
