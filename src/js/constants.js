import { assign, get, sample } from 'lodash';

const ItemTypes = {
  WEAPON: 'weapon',
  SPECIAL: 'special',
};

const Dict = {
  RAT_FIRST_NAMES: () => sample([
    'Francis',
    'Felippe',
    'Cal',
    'Skeev',
    'Killet',
    'Kreen',
    'Sark',
  ]),
  RAT_TITLES: () => sample([
    'Cutter',
    'Skitterer',
    'Snapper',
    'Furry',
    'Whiskered',
    'Many-clawed',
    'Collector',
  ]),
  RAT_NAME: () => sample([
    `${Dict.RAT_TITLES()} ${Dict.RAT_FIRST_NAMES()}`,
    `${Dict.RAT_FIRST_NAMES()} the ${Dict.RAT_TITLES()}`,
  ]),
  CHIMP_FIRST_NAMES: () => sample([
    'Chippers',
    'Cupcake',
    'Nanners',
    'Popeye',
    'Skippy',
    'Chatters',
    'Goodboye',
    'Fruitcake',
  ]),
  CHIMP_TITLES: () => sample([
    'Space Engineer',
    'Commander',
    'Orbital Captain',
    'Hose-Scrubber',
    'Captain',
    'Security Consultant',
    'Moon Architect',
    'Comrade',
  ]),
  CHIMP_NAME: () => sample([
    `${Dict.CHIMP_TITLES()} ${Dict.CHIMP_FIRST_NAMES()}`,
    `${Dict.CHIMP_FIRST_NAMES()} the ${Dict.CHIMP_TITLES()}`,
  ]),
};

const Monsters = {
  RAT: () => ({
    name: Dict.RAT_NAME(),
    //attackToDefenseRatio: 0.5,
  }),
  CHIMP: () => ({
    name: Dict.CHIMP_NAME(),
  }),
};

const Items = [{
  article: 'a',
  name: 'Bird on a Hat',
  imageFile: 'top-hat.png',
  type: ItemTypes.SPECIAL,
  combatAction: 'birdlore',
  keywords: 'fancy black bird animal hat',
},{
  article: 'an old pair of',
  name: 'Stonerwashed Jeans',
  imageFile: 'top-hat.png',
  type: ItemTypes.SPECIAL,
  combatAction: 'smoking',
  keywords: '80s legs',
},{
  article: 'a pair of',
  name: 'Mismatched Kicking Boots',
  imageFile: 'top-hat.png',
  type: ItemTypes.WEAPON,
  combatAction: 'attack',
  keywords: 'black rugged shoes',
},{
  article: 'a set of',
  name: 'Pristine White Gloves',
  imageFile: 'top-hat.png',
  type: ItemTypes.SPECIAL,
  combatAction: 'cleaning',
  keywords: 'fancy white hands',
},{
  article: 'a',
  name: 'Spoon of Doom',
  imageFile: 'top-hat.png',
  type: ItemTypes.WEAPON,
  combatAction: 'attack',
  keywords: 'metal houseware',
}];

function t(strings, ...keys) {
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
    returnMessage: t`You can tell ${'character.name'} is back because the air smells like demon eggs.`,
    awayMessage: t`${'character.name'} is out sifting through piles of junk and will return soon.`,
    results: [{
      story: data => {
        return t`${'timeOfDay'} ${'character.name'} went out scavenging, met a disgusting rat man named ${'npc.name'} and found ${'item.article'} ${'item.name'}.`(assign({
          npc: Monsters.RAT(),
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
  ItemTypes,
  Activities,
  Items,
  Monsters,
};
