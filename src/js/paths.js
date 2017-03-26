module.exports = {
  character: (key) => `/${key}`,
  characters: () => '/',
  characterCreate: () => '/new',
  characterTab: (key, tab) => `/${key}/${tab}`,
  characterImage: (file) => `images/${file}`,
  itemImage: (file) => `images/${file}`,
};
