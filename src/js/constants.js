import { get } from 'lodash';

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

const ItemScales = {
  head: 2,
  chest: 2,
  legs: 1,
  hands: 1,
  feet: 1,
  weapon: 5,
  special: 3,
  jewelry: 1,
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
    maxCombat: 20,
    returnMessage: t`You can tell ${'character.name'} is back because the air smells like demon eggs.`,
    awayMessage: t`${'character.name'} is out sifting through piles of junk and will return soon.`,
    results: [{
      story: t`${'character.name'} went out scavenging, and found ${'item.name'}.`,
      items: [{
        name: 'Bird on a Hat',
        imageFile: 'top-hat.png',
        type: ItemTypes.SPECIAL,
        combatAction: 'attack',
      },{
        name: 'Stonerwashed Jeans',
        imageFile: 'top-hat.png',
        type: ItemTypes.LEGS,
        combatAction: 'defense',
      },{
        name: 'Mismatched Boots',
        imageFile: 'top-hat.png',
        type: ItemTypes.FEET,
        combatAction: 'defense',
      },{
        name: 'Pristine White Gloves',
        imageFile: 'top-hat.png',
        type: ItemTypes.HANDS,
        combatAction: 'defense',
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
      story: 'Nope!',
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
  ItemSlots,
  ItemTypes,
  ItemScales,
  Activities,
};
