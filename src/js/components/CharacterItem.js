import { Card, Checkbox, Label, Modal } from 'semantic-ui-react'

import paths from '../paths';
import gameFunctions from '../gameFunctions';

class CharacterItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      isFlipped: false
    };
  }
  open = () => {
    this.setState({ isOpen: true });
  }
  close = () => {
    this.setState({ isOpen: false, isFlipped: false });
  }
  flip = () => {
    this.setState({ isFlipped: !this.state.isFlipped });
  }
  toggleEquip = () => {
    const { user } = this.context;
    const { character, item } = this.props;
    gameFunctions.toggleEquip(user, character, item);
  }
  trash = () => {
    const { user } = this.context;
    const { character, item } = this.props;
    gameFunctions.trashItem(user, character, item);
  }
  render() {
    const { isOpen, isFlipped } = this.state;
    const { character, item } = this.props;
    const { description, name, type, combat, combatAction, isEquipped, imageFile, skill, skillBonus } = item;

    const plusMinus = (value) => {
      return value >= 0 ? `+${value}` : `-${value}`
    };

    let bonuses = [];
    combat && bonuses.push(`${plusMinus(combat)} combat`);
    skill && bonuses.push(`${plusMinus(skillBonus)} ${skill}`);
    bonuses = bonuses.join(', ');

    const block = (
      <div className="characteritem">
        <button className="characteritem__content" onClick={this.open}>
          <div className="characteritem__image">
            <img src={paths.itemImage(imageFile)} />
          </div>
          <div className="characteritem__info">
            <h4>{ name }</h4>
            <div className="characteritem__bonuses">{ bonuses }</div>
            <Label color={isEquipped ? 'green' : null}>{ type }</Label>
          </div>
        </button>
        <Modal basic closeOnDimmerClick={false} open={isOpen} className="characteritem__detail" style={{lineHeight:'1.4285em'}}>
          <div className={cn('cardflipper', {'is-flipped':isFlipped})} onClick={this.flip}>
            <Card
              image={paths.itemImage(imageFile)}
            />
            <Card
              header={name}
              meta={bonuses}
              description={description}
              extra={<Label color={isEquipped ? 'green' : null}>{ type }</Label>}
            />
          </div>
          <div className="characteritem__actions">
            <div>
              <Button inverted circular icon color="red" onClick={this.trash}>
                <Icon name="trash" />
              </Button>
              <div className="buttonlabel">trash</div>
            </div>
            <div>
              <Checkbox toggle className="large" checked={isEquipped} onChange={this.toggleEquip} />
              <div className="buttonlabel">{isEquipped ? 'equipped' : 'unequipped'}</div>
            </div>
            <div>
              <Button inverted circular icon onClick={this.close}>
                <Icon name="remove" />
              </Button>
              <div className="buttonlabel">done</div>
            </div>
          </div>
        </Modal>
      </div>
    );

    return block;
  }
}

CharacterItem.contextTypes = {
  user: PropTypes.object.isRequired,
};

CharacterItem.propTypes = {
  character: PropTypes.object.isRequired,
  item: PropTypes.object.isRequired,
};

export default CharacterItem;
