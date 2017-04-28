import { assign, clamp, filter, sample } from 'lodash';

import base from './base';
import { getFullCharacter, rint } from './utils';
import { Items } from './constants';

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

  console.log(character);

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
};
