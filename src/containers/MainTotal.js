import React, { Component } from 'react';
import { Platform, View, Text, Image, TouchableOpacity } from 'react-native';

const logo = require('../assets/img/logo.png');
const menu = require('../assets/img/icon/menu.png');

class MainScreen extends Component {
	static navigationOptions = ({ navigation }) => ({
		headerLeft: (
			<TouchableOpacity onPress={() => {navigation.navigate('DrawerOpen')}}>
				<Image source={menu} style={{width: 32, height: 32, marginHorizontal: 8, tintColor: '#fff'}}/>
			</TouchableOpacity>
		),
		headerTitle: (navigation.state.routeName&& navigation.state.routeName === 'Main' ?
			<Image source={logo} style={[{width: 123, height: 40}, Platform.OS === 'android' ? {alignSelf:'center'} : {}]}/> : '전체보기'
		),
		headerRight: (
			<View style={{width: 32, height: 32, marginHorizontal: 8}}/>
		),
	})
	render() {
		return (
			<View>
				<Text>React Native Boilerplate</Text>
				<TouchableOpacity onPress={()=>{this.props.navigation.goBack()}}>
					<Text>{this.props.navigation.state.params? this.props.navigation.state.params.name : ''}</Text>
				</TouchableOpacity>
			</View>
		);
	}
}

export default MainScreen;


