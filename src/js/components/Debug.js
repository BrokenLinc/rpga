// import { googleAppScriptsGet, GOOGLE_APP_SCRIPT_URLS } from '../googleAppScripts';

class Debug extends Component {
  // getContent = () => {
  //   googleAppScriptsGet(GOOGLE_APP_SCRIPT_URLS.getContent, (data) => {
  //     console.log(data);
  //     // TODO: store in singleton
  //   });
  // }
  render() {
    return (
      <div>
        {/* <Button onClick={this.getContent}>Get Content</Button> */}
      </div>
    );
  }
}

Debug.contextTypes = {
  user: PropTypes.object.isRequired,
};

Debug.propTypes = {
  params: PropTypes.object,
};

export default Debug;
