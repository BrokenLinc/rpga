import { assign, get, sample } from 'lodash';

const ItemTypes = {
  // HEAD: 'head',
  // CHEST: 'chest',
  // LEGS: 'legs',
  // HANDS: 'hands',
  // FEET: 'feet',
  WEAPON: 'weapon',
  SPECIAL: 'special',
  // JEWELRY: 'jewelry',
};

// const ItemSlots = {
//   HEAD: { slot: 'head', accepts: [ItemTypes.HEAD] },
//   CHEST: { slot: 'chest', accepts: [ItemTypes.CHEST] },
//   LEGS: { slot: 'legs', accepts: [ItemTypes.LEGS] },
//   HANDS: { slot: 'hands', accepts: [ItemTypes.HANDS] },
//   FEET: { slot: 'feet', accepts: [ItemTypes.FEET] },
//   LEFTHAND: { slot: 'lefthand', accepts: [ItemTypes.WEAPON] },
//   RIGHTHAND: { slot: 'righthand', accepts: [ItemTypes.WEAPON] },
//   JEWELRY: { slot: 'jewelry', accepts: [ItemTypes.JEWELRY] },
// };

// const ItemScales = {
//   // head: 2,
//   // chest: 2,
//   // legs: 1,
//   // hands: 1,
//   // feet: 1,
//   weapon: 1,
//   special: 1,
//   // jewelry: 1,
// };

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
  SCAVENGING: {
    label: 'Go scavenging',
    minCombat: 1,
    maxCombat: 100,
    returnMessage: t`You can tell ${'character.name'} is back because the air smells like demon eggs.`,
    awayMessage: t`${'character.name'} is out sifting through piles of junk and will return soon.`,
    results: [{
      story: data => {
        return t`${'character.name'} went out scavenging, met a disgusting rat man named ${'npc.name'} and found ${'item.name'}.`(assign({
          npc: Monsters.RAT(),
        }, data))
      },
      items: [{
        name: 'Bird on a Hat',
        imageFile: 'top-hat.png',
        type: ItemTypes.SPECIAL,
        combatAction: 'birdlore',
      // },{
      //   name: 'Stonerwashed Jeans',
      //   imageFile: 'top-hat.png',
      //   type: ItemTypes.LEGS,
      //   combatAction: 'defense',
      // },{
      //   name: 'Mismatched Boots',
      //   imageFile: 'top-hat.png',
      //   type: ItemTypes.FEET,
      //   combatAction: 'defense',
      // },{
      //   name: 'Pristine White Gloves',
      //   imageFile: 'top-hat.png',
      //   type: ItemTypes.HANDS,
      //   combatAction: 'defense',
      },{
        name: 'Spoon of DOOM',
        imageFile: 'top-hat.png',
        type: ItemTypes.WEAPON,
        combatAction: 'attack',
      }],
    }],
  },
  NOPE: {
    label: 'Go noping',
    minCombat: 20,
    maxCombat: 40,
    returnMessage: t`Nope?`,
    awayMessage: t`Nope...`,
    results:[{
      story: t`Nope!`,
      monster: Monsters.RATSCOUT,
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
  // ItemSlots,
  ItemTypes,
  //ItemScales,
  Activities,
};
