import { clamp, clone, filter, find, sample, sumBy } from 'lodash';

import base from './base';
import paths from './paths';
import { rint } from './utils';
import { ItemTypes } from './constants';
import { Items, Words } from './generators';
import t from './templatizer';
import { characterSpec, itemSpec } from './specs';

const ACTIVITY_SECONDS = 10;
const MAX_LIFE = 5;
const MAX_ITEMS_EQUIPPABLE = 6;
const MAC_COMBAT_PER_LEVEL = 10;

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
    'char-1.png',
    'char-2.png',
    'char-3.png',
    'char-4.png',
    'char-5.png',
    'char-6.png',
    'char-7.png',
    'char-8.png',
    'char-9.png',
    'char-10.png',
    'char-11.png',
    'char-12.png',
  ];
  return {
    name: t(Words.CHARACTER_NAME())(),
    imageFile: sample(imageFiles),
    items: [{
      article: 'a',
      name: 'Cheap Pocketknife',
      imageFile: 'knife-1.png',
      description: 'The blade says "Made in China". The handle says "Made in USA". Did these nations ever even exist?',
      type: ItemTypes.WEAPON,
      combat: 5,
      isEquipped: true,
    }],
  };
};

const dropItem = (level, result) => {
  // const itemKeywords = sample(result.item || ['junk']).split(' ');
  // const possibleItems = filter(Items, item => {
  //   for(let i in itemKeywords) {
  //     if(item.keywords.indexOf(itemKeywords[i]) === -1) {
  //       return false;
  //     }
  //   }
  //   return true;
  // });

  const item = sample(Items);
  const factor = item.type === ItemTypes.WEAPON ? 5 : 1;

  // TODO: refactor into formula
  const combat = Math.max(1, (level * factor) + rint(0,factor) + rint(-factor,factor));
  const skillBonus = Math.max(1, (level * 1) + rint(0,1) + rint(-1,1));

  return assign({ combat, skillBonus }, item);
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
    life: 0,
    fightStory: null,
    xp: activity.isSafe ? 0 : (activity.minLevel + activity.minLevel), // base xp
  };

  // Prep malleable life value
  if(result.life) {
    life = clampLife(life + result.life);
  }

  // Prep template info for stories
  const potentialItem = dropItem(character.level, result); // TODO: scale to opponent, not character
  const templateData = {
    character,
    timeOfDay: timeOfDay(),
    item: potentialItem,
  };

  // things that may or may not happen
  if(result.npc) {
    const npcLevel = rint(activity.minLevel, activity.maxLevel);
    const npc = result.npc({
      level: npcLevel,
      life: 4,
      combat: rollCombat(npcLevel),
    });
    templateData.npc = npc;
    npc.name = t(npc.name)(templateData); // npc names can have dynamic elements

    // combat!
    if(result.isFight) {
      const combatTotal = npc.combat + character.combat;
      const npcCheck = npc.combat / combatTotal;
      const characterCheck = character.combat / combatTotal;
      let turn = 0;

      data.fightStory = `A fight with {npc} (${npc.combat} combat) begins. `;

      while(life > 0 && npc.life > 0) {
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
        // character died
        data.fightStory += npc.life < 5 ?
          `{character} got {npc} down to ${npc.life} life, but in the end was slain. `
          : '{character} was utterly demolished by ${npc}. ';
      } else {
        // npc died
        data.fightStory += '{character} was victorious over {npc}! ';
        data.xp += npc.level * 2; // fight win, get double xp
      }
    }
  }
  // character can die from fight OR taking adventure dmg
  if(life <= 0) {
    isSuccess = false;
    data.xp = Math.ceil(data.xp / 2); // fail, get half xp
  }
  if(isSuccess && result.item) {
    data.item = potentialItem;
  }
  data.life = life - character.life;

  assign(templateData, data)

  data.awayMessage = t(activity.awayMessage)(templateData);
  data.returnMessage = t(activity.returnMessage)(templateData);
  data.story = t(result.story)(templateData);
  if(data.fightStory) {
    data.fightStory = t(data.fightStory)(templateData);
  }

  // optional templates
  if(isSuccess && result.success) {
    data.story += ' ' + t(result.success)(templateData);
  }
  if(!isSuccess && result.failure) {
    data.story += ' ' + t(result.failure)(templateData);
  }

  base.update(`users/${user.uid}/characters/${character.key}/activity`, { data });
}

const returnFromMission = (user, character) => {
  const { activity } = character;
  const { life, item } = activity;

  const characterUpdateData = {};
  if(life !== 0) {
    characterUpdateData.life = clampLife(character.life + life);
  }
  const levelXP = getLevelXP(character.level);
  let newXP = character.xp + (activity.xp || 0);
  if(newXP >= levelXP) {
    newXP -= levelXP;
    characterUpdateData.level = character.level + 1;
    characterUpdateData.life = MAX_LIFE;
  }
  characterUpdateData.xp = newXP;

  if(item) {
    base.push(`users/${user.uid}/characters/${character.key}/items`, {
      data: item,
    }).then(({ key }) => {
      base.update(`users/${user.uid}/characters/${character.key}/activity/item`, {
        data: { key },
      });
    });
  }
  base.update(`users/${user.uid}/characters/${character.key}`, {
    data: characterUpdateData,
  });
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

const rollCombat = (level) => {
  return (level - 1) * MAC_COMBAT_PER_LEVEL + rint(1,MAC_COMBAT_PER_LEVEL);
};

const getLevelXP = (currentLevel) => {
  let total = 0;
  for(let i = currentLevel; i > 0; i--) {
    total += i;
  }
  return total * 20;
};

const clampLife = (life) => {
  return clamp(life, 0, MAX_LIFE);
};

module.exports = {
  doActivity,
  returnFromMission,
  getFullCharacter,
  generateCharacter,
  toggleEquip,
  trashItem,
  createCharacterAndRedirect,
  getLevelXP,
};
