import { Words } from './generators';

const PASS_LIMIT = 10; // prevent infinite loop

const t = (string) => {
  return (function(values) {
    // For anything not caught above, run the phrase generators
    let count = 0;
    while(count < PASS_LIMIT && string.indexOf('{') >= 0) {
      string = string.replace(/{character}/g, get(values, 'character.name'));
      string = string.replace(/{npc}/g, get(values, 'npc.name'));
      string = string.replace(/{item}/g, get(values, 'item.name'));
      string = string.replace(/{an item}/g, `${get(values, 'item.article')} <b>${get(values, 'item.name')}</b>`);
      string = string.replace(/{now}/g, get(values, 'timeOfDay'));
      string = string.replace(/{npc\.race}/g, get(values, 'npc.race'));

      for(let key in Words) {
        const regex = new RegExp(`{${key}}`, 'gi');
        string = string.replace(regex, Words[key]());
      }
      count ++;
    }

    return string;
  });
}

export default t;
