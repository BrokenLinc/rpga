import CharacterItem from './CharacterItem';

class CharacterItemList extends Component {
  render() {
    const { character } = this.props;
    const { items } = character;

    return (
      <div className="characteritemlist">
        {map(items, (item) => (
          <CharacterItem key={item.key} character={character} item={item} />
        ))}
      </div>
    );
  }
}

CharacterItemList.contextTypes = {
  user: PropTypes.object.isRequired,
};

CharacterItemList.propTypes = {
  character: PropTypes.object.isRequired,
};

export default CharacterItemList;
