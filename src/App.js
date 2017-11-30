import React from 'react';
import { Provider } from 'react-redux';

import Store from './redux/Store';
import BaseNavigation from './Router';

const initialize = require('./service/Initialize');

const App = () => {
	initialize(Store);
	return (
		<Provider store={Store}>
			<BaseNavigation />
		</Provider>
	)
};

export default App;
