import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

class Drawer extends Component {
	render() {
		return (
			<View>
				<Text>left</Text>
				<TouchableOpacity onPress={() => this.props.navigation.navigate('Test', {name: 'Lucy'})}>
					<Text>asdfsadfsda</Text>
				</TouchableOpacity>
			</View>
		);
	}
}
export default Drawer;


