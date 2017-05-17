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
  SPACE_CENTER: {
    label: 'Scavenge the Space Center',
    icon: 'space shuttle',
    awayMessage: t`${'character.name'} was last seen heading toward the defunct Soviet space center.`,
    returnMessage: t`${'character.name'} made it back from the space center.`,
    results: [{
      npc: generators.Monsters.RAT,
      item: ['tech', 'space', 'soviet'],
      skill: 'scavenging',
      story: t`${'timeOfDay'} ${'character.name'} went out to the space center, met a disgusting rat man named ${'npc.name'} and found ${'item.article'} ${'item.name'}.`,
    }],
  },
  FOREST: {
    label: 'Explore the Forest',
    icon: '',
    awayMessage: t`${'character.name'} has left for the dank-ass forest.`,
    returnMessage: t`${'character.name'} is back, covered in cobwebs.`,
    results: [{
      npc: generators.Monsters.RAT,
      item: ['nature'],
      skill: 'nature',
      story: t`${'timeOfDay'} ${'character.name'} went out to the forest, and met a disgusting rat man named ${'npc.name'}. ${'character.name'} pulled out a small pan-pipe and let loose with a fly tune.`,
      success: t`${'npc.name'} was impressed and offered up ${'item.article'} ${'item.name'}.`,
      failure: t`It was embarrassing for everyone.`,
    }],
  },
  WHARF: {
    label: 'Walk the Wharf',
    icon: 'anchor',
    awayMessage: t`${'character.name'} has left for the wharf, where leathery creatures are known to trade slimy trinkets.`,
    returnMessage: t`${'character.name'} arrives back on a moist, briny wind.`,
    results: [{
      npc: generators.Monsters.RAT,
      item: ['ocean', 'fish', 'wet'],
      skill: 'negotiating',
      story: t`${'timeOfDay'} ${'character.name'} went out to the wharf, and met a disgusting rat man named ${'npc.name'}.`,
      success: t`After some "negotiating", ${'npc.name'} offered up ${'item.article'} ${'item.name'}.`,
      failure: t`It was embarrassing for everyone.`,
    }],
  },
  REST: {
    label: 'Stay in bed',
    icon: 'bed',
    awayMessage: t`${'character.name'} is in bed, with visions of sugar plums pillaging a dank dungeon.`,
    returnMessage: t`${'character.name'} staggers out of bed mumbling something about a dream.`,
    results: [{
      life: 5,
      story: t`${'character.name'} had a dream where Michael Keaton was running for president on a "pro-jello" campaign platform. Nevertheless, a complete night's rest was had.`,
    }],
  },
};

module.exports = {
  Activities,
};
