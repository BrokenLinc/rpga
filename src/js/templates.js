import { Monsters } from './generators';

const Activities = {
  SPACE_CENTER: {
    minLevel: 1,
    maxLevel: 2,
    label: 'The Space Center',
    icon: 'space shuttle',
    awayMessage: '{character} was last seen heading toward the defunct Soviet space center.',
    returnMessage: '{character} made it back from the space center...',
    results: [{
      npc: Monsters.RAT,
      item: ['tech', 'space', 'soviet'],
      story: '{now} {character} went out to the space center, met a disgusting {npc.race} named {npc} and found {an item}. He tripped on the way back and took light damage.',
      life: -1,
    }],
  },
  FOREST: {
    minLevel: 1,
    maxLevel: 2,
    label: 'The Forest',
    icon: '',
    awayMessage: '{character} has left for the dank-ass forest.',
    returnMessage: '{character} is back, covered in cobwebs...',
    results: [{
      npc: Monsters.RAT,
      isFight: true,
      item: ['nature'],
      story: '{now} {character} went out to the forest, and met a disgusting {npc.race} named {npc}. {character} pulled out a small pan-pipe and let loose with a fly tune. Unfortunately, {npc} hated it, and attacked.',
      success: '{npc} was beaten to death, and his corpse yielded a {an item}.',
      failure: '{character} went home wounded.',
    }],
  },
  WHARF: {
    minLevel: 1,
    maxLevel: 2,
    label: 'The Wharf',
    icon: 'anchor',
    awayMessage: '{character} has left for the wharf, where leathery creatures are known to trade slimy trinkets.',
    returnMessage: '{character} arrives back on a moist, briny wind...',
    results: [{
      npc: Monsters.RAT,
      item: ['ocean', 'fish', 'wet'],
      story: '{now} {character} went out to the wharf, and met a disgusting {npc.race} named {npc}.',
      success: 'After some "negotiating", {npc} offered up {an item}.',
      failure: 'It was embarrassing for everyone.',
    }],
  },
  REST: {
    isSafe: true,
    label: 'Stop and Rest',
    icon: 'bed',
    awayMessage: '{character} is curled up in a dank napsack, with visions of sugar plums pillaging a dank dungeon.',
    returnMessage: '{character} meets the day, mumbling something about a dream...',
    results: [{
      life: 5,
      story: '{character} had a dream where Michael Keaton was running for president on a "pro-jello" campaign platform. It was terrifying, yet strangley arousing. Nevertheless, a complete night\'s rest was had.',
    }],
  },
};

module.exports = {
  Activities,
};
