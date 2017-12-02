import React from 'react';
import { Provider } from 'react-redux';
import { View } from 'react-native';

import Store from './redux/Store';
import BaseNavigation from './Router';

const initialize = require('./service/Initialize');

class App extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			loaded: false
		}
		initialize(Store, ()=>
			setTimeout(()=> {this.setState({loaded : true});},0)
		)
	}

	render() {
		return (
			<Provider store={Store}>
				{this.state.loaded ? <BaseNavigation /> : <View/>}
			</Provider>
		)
	}
}

export default App;
