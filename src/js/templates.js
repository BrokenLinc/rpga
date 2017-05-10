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
    returnMessage: t`${'character.name'} made it back from the space center.`,
    awayMessage: t`${'character.name'} was last seen heading toward the defunct Soviet space center.`,
    results: [{
      npc: generators.Monsters.RAT,
      item: ['tech', 'space', 'soviet'],
      skill: 'scavenging',
      story: t`${'timeOfDay'} ${'character.name'} went out to the space center, met a disgusting rat man named ${'npc.name'} and found ${'item.article'} ${'item.name'}.`,
    }],
  },
  WHARF: {
    label: 'Walk the Wharf',
    icon: 'anchor',
    returnMessage: t`${'character.name'} arrives back on a moist, briny wind.`,
    awayMessage: t`${'character.name'} has left for the wharf, where leathery creatures are known to trade slimy trinkets.`,
    results: [{
      npc: generators.Monsters.RAT,
      item: ['ocean', 'fish', 'wet'],
      skill: 'negotiating',
      story: t`${'timeOfDay'} ${'character.name'} went out to the wharf, met a disgusting rat man named ${'npc.name'}.`,
      success: t`After some "negotiating", ${'npc.name'} offered up ${'item.article'} ${'item.name'}.`,
      failure: t`It was embarrassing for everyone.`,
    }],
  },
  REST: {
    label: 'Stay in bed',
    icon: 'bed',
    returnMessage: t`${'character.name'} staggers out of bed mumbling something about a dream.`,
    awayMessage: t`${'character.name'} is in bed, with visions of sugar plums pillaging a dank dungeon.`,
    results: [{
      life: 5,
      story: t`${'character.name'} had a dream where Michael Keaton was running for president on a "pro-jello" campaign platform. Nevertheless, a complete night's rest was had.`,
    }],
  },
};

module.exports = {
  Activities,
};
