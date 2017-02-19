import React from 'react';
import ReactDOM from 'react-dom';

import '../css/app.less';

const MainView = () => (
	<h1>Hello world!</h1>
);

var mainView = React.createElement(MainView);

ReactDOM.render(mainView, document.getElementById("main"));