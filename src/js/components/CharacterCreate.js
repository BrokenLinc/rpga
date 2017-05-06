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
      <div>
        <h1>New Character</h1>

        <div>{ name }</div>
        <Portrait imageFile={imageFile} />

        <Button onClick={ this.rollCharacter }>Re-roll</Button>
        <Button onClick={ this.keepCharacter }>Keep</Button>
    </div>
    );
  }
}

CharacterCreate.contextTypes = {
  router: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
};

export default CharacterCreate
