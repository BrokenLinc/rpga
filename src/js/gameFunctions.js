import { clamp, filter, find, sample, sumBy } from 'lodash';

import base from './base';
import paths from './paths';
import { rint } from './utils';
import { ItemTypes } from './constants';
import { Items } from './generators';
import { characterSpec, itemSpec } from './specs';

const ACTIVITY_SECONDS = 10;

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
    skills: [],
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
    ) + rint(-2, 4))
  }, sample(possibleItems));
}

const timeOfDay = () => {
  const hours = new Date().getHours();
  let timeOfDay = 'Tonight';
  if(hours >= 2) timeOfDay = 'This morning';
  if(hours >= 12) timeOfDay = 'This afternoon';
  if(hours >= 17) timeOfDay = 'This evening';
  if(hours >= 20) timeOfDay = 'Tonight';
  return timeOfDay;
};

const doActivity = (user, _character, activity) => {
  const character = getFullCharacter(_character);

  // random adventure
  const result = sample(activity.results);
  // TODO: success/failure roll

  // result with no success script are auto-success.
  const isSuccess = !(result.success && result.failure) || (rint(1,20) > 20);

  // generate data and template extras
  const data = {
    returnDate: new Date().getTime() + ACTIVITY_SECONDS * 1000,
    claimed: false,
  };
  const templateData = {
    character,
    timeOfDay: timeOfDay(),
  };

  // things that may or may not happen
  if(result.npc) {
    templateData.npc = result.npc();
  }
  if(result.life) {
    data.life = clamp(character.life + result.life, 0, 5);
  }
  if(isSuccess && result.item) {
    data.item = dropItem(character, result);
  }
  if(!isSuccess) {
    data.skillgain = result.skill;
  }

  assign(templateData, data)

  data.awayMessage = activity.awayMessage(templateData);
  data.returnMessage = activity.returnMessage(templateData);
  data.story = result.story(templateData);

  // optional templates
  if(isSuccess && result.success) {
    data.story += ' ' + result.success(templateData);
  }
  if(!isSuccess && result.failure) {
    data.story += ' ' + result.failure(templateData);
  }

  base.update(`users/${user.uid}/characters/${character.key}/activity`, { data });
}

const returnFromMission = (user, character) => {
  const { activity } = character;
  const { life, item, skillgain } = activity;

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
  if(skillgain) {
    base.update(`users/${user.uid}/characters/${character.key}/skills`, {
      data: { [skillgain]: (get(character, `skills.${skillgain}`) || 0) + 1 },
    });
  }
  base.update(`users/${user.uid}/characters/${character.key}/activity`, {
    data: {
      claimed: true,
    }
  });
};

const getEquippedItem = (items, type) => {
  return find(items, { type, isEquipped: true });
};

const toggleEquip = (user, character, item) => {
  if(item.isEquipped) {
    //unequip item
    base.remove(`users/${user.uid}/characters/${character.key}/items/${item.key}/isEquipped`);
  } else {
    // unequip old item
    const oldItem = getEquippedItem(character.items, item.type);
    if(oldItem) {
      base.remove(`users/${user.uid}/characters/${character.key}/items/${oldItem.key}/isEquipped`);
    }
    // equip item
    base.update(`users/${user.uid}/characters/${character.key}/items/${item.key}`, {
      data: { isEquipped: true }
    });
  }
}

const trashItem = (user, character, item) => {
  base.remove(`users/${user.uid}/characters/${character.key}/items/${item.key}`);
}

const createCharacterAndRedirect = (user, character, router) => {
  return base.push(`users/${user.uid}/characters`, {
    data: character,
  }).then(newLocation => {
    router.push(paths.character(newLocation.key));
  });
}

module.exports = {
  doActivity,
  returnFromMission,
  getFullCharacter,
  generateCharacter,
  toggleEquip,
  trashItem,
  createCharacterAndRedirect,
};
