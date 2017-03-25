module.exports = {
  character: (key) => `/${key}`,
  characters: () => '/',
  characterCreate: () => '/new',
  characterItems: (key) => `/${key}/items`,
  characterImage: (file) => `images/${file}`,
  itemImage: (file) => `images/${file}`,
};
