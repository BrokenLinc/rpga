import { assign, clamp, filter, sample, sumBy } from 'lodash';

import base from './base';
import { rint } from './utils';
import { ItemTypes } from './constants';
import { Items } from './generators';
import { characterSpec, itemSpec } from './specs';

const getFullCharacter = (_character) => {
  const character = characterSpec(_character);
  return assign(getCombatValues(character), character);
};

const getCombatValues = (character) => {
  return {
    isCharacter: true,
    attack: getActionTotal('attack', character),
    skill: getCharacterSkill(character),
  };
};

const getEquippedItems = (items) => {
  return filter(items, 'isEquipped');
};

const getActionItems = (type, character) => {
  return filter(getEquippedItems(character.items), { combatAction: type });
};

const getActionTotal = (type, character) => {
  return sumBy(getActionItems(type, character), 'combat');
};

const getCharacterSkill = (character) => {
  const skillItems = filter(
    getEquippedItems(character.items),
    ({ combatAction }) => (combatAction != 'attack')
  );
  return skillItems.length ? {
    name: skillItems[0].combatAction,
    value: skillItems[0].combat,
  } : {
    name: 'skill',
    value: 0,
  };
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

const dropItem = (character, result) => {
  const itemKeywords = sample(result.item).split(' ');
  const possibleItems = filter(Items, item => {
    for(let i in itemKeywords) {
      if(item.keywords.indexOf(itemKeywords[i]) === -1) {
        return false;
      }
    }
    return true;
  });

  return assign({
    combat: Math.max((1,
      Math.random() > 0.5 ?
      character.skill.value :
      (character.attack)
    ) + rint(0, 2))
  }, sample(possibleItems));
}

const doActivity = (user, _character, activity) => {
  const character = getFullCharacter(_character);
  const returnDate = new Date().getTime() + 10000; // 10sec

  // generate result and item
  const result = sample(activity.results);
  const data = {
    returnDate,
    returnMessage: activity.returnMessage({ character }),
    awayMessage: activity.awayMessage({ character }),
    claimed: false,
  };
  if(result.life) {
    data.life = clamp(character.life + result.life, 0, 5);
  }
  if(result.item) {
    // generate item from activity result
    data.item = dropItem(character, result);
  }

  const hours = new Date().getHours();
  let timeOfDay = 'Tonight';
  if(hours >= 2) timeOfDay = 'This morning';
  if(hours >= 12) timeOfDay = 'This afternoon';
  if(hours >= 17) timeOfDay = 'This evening';
  if(hours >= 20) timeOfDay = 'Tonight';

  data.story = result.story({ character, item: data.item, timeOfDay });

  base.update(`users/${user.uid}/characters/${character.key}/activity`, { data });
}

const returnFromMission = (user, character) => {
  const { activity } = character;
  const { life, item } = activity;

  if(item) {
    base.push(`users/${user.uid}/characters/${character.key}/items`, {
      data: item,
    });
  }
  if(life) {
    base.update(`users/${user.uid}/characters/${character.key}`, {
      data: { life },
    });
  }
  base.update(`users/${user.uid}/characters/${character.key}/activity`, {
    data: {
      claimed: true,
    }
  });
};

module.exports = {
  doActivity,
  returnFromMission,
  getFullCharacter,
  generateCharacter,
};
