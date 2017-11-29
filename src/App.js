import React from 'react';
import { Provider } from 'react-redux';

import Store from './redux/Store';
import BaseNavigation from './Router';

const initialize = require('./service/initialize');

const App = () => {
	initialize(Store);
	return (
		<Provider store={Store}>
			<BaseNavigation />
		</Provider>
	)
};

export default App;
