import base from '../base';
import paths from '../paths';
import gameFunctions from '../gameFunctions';
import Portrait from './Portrait';

class CharacterCreate extends Component {
  constructor(props) {
    super(props);

    this.state = {
      character: gameFunctions.generateCharacter(),
    };
  }
  rollCharacter = () => {
    this.setState({
      character: gameFunctions.generateCharacter(),
    });
  }
  keepCharacter = () => {
    const { router, user } = this.context;
    const { character } = this.state;

    gameFunctions.createCharacterAndRedirect(user, character, router);
  }
  render() {
    const { name, imageFile } = this.state.character;

    return (
      <div className="charactercreate">

        <Portrait imageFile={imageFile} large />
        <div className="charactercreate__name">{ name }</div>

        <Button.Group>
          <Button basic color="teal" onClick={ this.rollCharacter }>Nope</Button>
          <Button basic color="teal" onClick={ this.keepCharacter }>Invite</Button>
        </Button.Group>
    </div>
    );
  }
}

CharacterCreate.contextTypes = {
  router: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
};

export default CharacterCreate
