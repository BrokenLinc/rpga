import { characterImage } from '../paths';

class Portrait extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
    };
  }
  render() {
    const { className, imageFile, large } = this.props;

    return (
      <div className={cn('characterlistitem__portrait', 'portrait', {'is-large':large}, className)}>
        <img src={characterImage(imageFile)}/>
      </div>
    );
  }
}

Portrait.contextTypes = {
  imageFile: PropTypes.string,
  className: PropTypes.string,
  large: PropTypes.string,
};

export default Portrait
