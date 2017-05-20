import { clamp, clone, filter, find, sample, sumBy } from 'lodash';

import base from './base';
import paths from './paths';
import { rint } from './utils';
import { ItemTypes } from './constants';
import { Items } from './generators';
import { characterSpec, itemSpec } from './specs';

const ACTIVITY_SECONDS = 10;

const getFullCharacter = (_character) => {
  const character = characterSpec(_character);
  const combatCharacter = getCombatValues(character);

  return assign({}, combatCharacter, character);
};

const getCombatValues = (character) => {
  return {
    isCharacter: true,
    combat: getCombatTotal(character),
  };
};

const getCombatTotal = (character) => {
  return sumBy(getEquippedItems(character.items), 'combat');
};

const getEquippedItems = (items) => {
  return filter(items, 'isEquipped');
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
      description: 'The blade says "Made in China". The handle says "Made in USA". Did these nations ever even exist?',
      type: ItemTypes.WEAPON,
      combat: 1,
      isEquipped: true,
    }],
    skills: [],
  };
};

const dropItem = (level, result) => {
  const itemKeywords = sample(result.item).split(' ');
  const possibleItems = filter(Items, item => {
    for(let i in itemKeywords) {
      if(item.keywords.indexOf(itemKeywords[i]) === -1) {
        return false;
      }
    }
    return true;
  });

  const combat = Math.max(1, level + rint(0,1) + rint(-1,1));
  const skillBonus = Math.max(1, level + rint(0,1) + rint(-1,1));

  return assign({ combat, skillBonus }, sample(possibleItems));
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

  // result with no success script are auto-success.
  // const roll = Math.random() * 20;
  // const isSuccess = !(result.success && result.failure) || (roll >= 10);
  let isSuccess = true;
  let life = character.life;

  // generate data and template extras
  // use "null" to clear last entry
  const data = {
    returnDate: new Date().getTime() + ACTIVITY_SECONDS * 1000,
    claimed: false,
    item: null,
    // skillgain: null,
    life: 0,
    fightStory: null,
  };
  const templateData = {
    character,
    timeOfDay: timeOfDay(),
  };

  if(result.life) {
    life = clamp(life + result.life, 0, 5);
  }

  // things that may or may not happen
  if(result.npc) {
    const npc = result.npc({
      life: 5,
      combat: rint(1,10),
    });
    templateData.npc = npc;

    // combat!
    if(result.isFight) {
      const combatTotal = npc.combat + character.combat;
      const npcCheck = npc.combat / combatTotal;
      const characterCheck = character.combat / combatTotal;
      let turn = 0;

      data.fightStory = `A fight with ${npc.name} (${npc.combat} combat) begins. `;

      while(life > 0 && npc.life > 0) {
        console.log(life, npc.life);
        if(turn % 2) {
          if(Math.random() > npcCheck) {
            npc.life--;
          }
        } else  {
          if(Math.random() > characterCheck) {
            life--;
          }
        }
        turn++;
      }
      if(life <= 0) {
        data.fightStory += npc.life < 5 ?
          `${character.name} got ${npc.name} down to ${npc.life} life, but in the end was slain.`
          : `${character.name} was utterly demolished by ${npc.name}.`;
        isSuccess = false;
      } else {
        data.fightStory += `${character.name} was victorious over ${npc.name}!`;
        isSuccess = true;
      }
    }
  }
  if(isSuccess && result.item) {
    data.item = dropItem(character.level, result); // TODO: scale to opponent, not character
  }
  data.life = life - character.life;

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
  const { life, item } = activity;

  if(item) {
    base.push(`users/${user.uid}/characters/${character.key}/items`, {
      data: item,
    }).then(({ key }) => {
      base.update(`users/${user.uid}/characters/${character.key}/activity/item`, {
        data: { key },
      });
    });
  }
  if(life !== 0) {
    console.log(character.life + life);
    base.update(`users/${user.uid}/characters/${character.key}`, {
      data: { life: clamp(character.life + life, 0, 5) },
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
