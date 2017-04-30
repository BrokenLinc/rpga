// import { assign, get } from 'lodash';

import generators from './generators';

const t = (strings, ...keys) => {
  return (function(...values) {
    var dict = values[values.length - 1] || {};
    var result = [strings[0]];
    keys.forEach(function(key, i) {
      var value = Number.isInteger(key) ? values[key] : get(dict, key, 'something');
      result.push(value, strings[i + 1]);
    });
    return result.join('');
  });
}

const Activities = {
  ADVENTURE: {
    label: 'Go adventuring',
    icon: 'flag',
    returnMessage: t`You can tell ${'character.name'} is back because the air smells like demon eggs.`,
    awayMessage: t`${'character.name'} is out sifting through piles of junk and will return soon.`,
    results: [{
      story: data => {
        return t`${'timeOfDay'} ${'character.name'} went out scavenging, met a disgusting rat man named ${'npc.name'} and found ${'item.article'} ${'item.name'}.`(assign({
          npc: generators.Monsters.RAT(),
        }, data))
      },
      item: ['fancy', 'metal houseware'],
    }],
  },
  REST: {
    label: 'Stay in bed',
    icon: 'bed',
    returnMessage: t`${'character.name'} staggers out of bed mumbling something about a dream.`,
    awayMessage: t`${'character.name'} is in bed, with visions of sugar plums pillaging a dank dungeon.`,
    results: [{
      story: t`${'character.name'} had a dream where Michael Keaton was running for president on a "pro-jello" campaign platform. Nevertheless, a complete night's rest was had.`,
      life: 5,
    }],
  },
};

module.exports = {
  Activities,
};
