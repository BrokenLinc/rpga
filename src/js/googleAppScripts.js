import aja from 'aja';

const URLS = {
  getContent: 'https://script.google.com/macros/s/AKfycbw3pCXSRVvrcfgIceKQmOsP1LZje3cXhDIdevmHrrWqfq9J24E/exec',
};

const callbacks = {};
let callbackCount = 0;

window.appScriptCallback = (res) => {
  const callback = callbacks[res.callbackName];
  callback && callback(res.data);
};

const get = (url, callback) => {
  const callbackName = `callback${callbackCount}`;
  callbacks[callbackName] = callback;
  aja()
    .method('get')
    .url(url)
    .data({combat: 20, callback: 'appScriptCallback', callbackName: callbackName})
    .type('jsonp')
    .go();
  callbackCount++;
}

module.exports = {
  googleAppScriptsGet: get,
  GOOGLE_APP_SCRIPT_URLS: URLS,
};
