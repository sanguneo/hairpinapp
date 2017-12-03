import React, { Component } from 'react';
import { Platform, View, ScrollView, Image, TouchableOpacity, StyleSheet } from 'react-native';

// import Thumbnail from "../components/Thumbnail";

import {connect} from 'react-redux';
const RNFS = require('../service/RNFS_wrapper');


const logo = require('../assets/img/logo.png');
const menu = require('../assets/img/icon/menu.png');

class MainScreen extends Component {
	static navigationOptions = ({ navigation }) => ({
		headerTitleStyle :{alignSelf: 'center', color: '#fff', fontWeight: 'normal'},
		headerLeft: (navigation.state.routeName&& navigation.state.routeName === 'Main' &&
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
	});

	// updateThumbs() {
	// 	if(!this.props.user.signhash || this.props.user.signhash === '') return;
	// 	const thumbnailPath = `${RNFS.PlatformDependPath}/_original_/${this.props.user.signhash}_`;
	// 	this.props.dispatch(designActions.getDesign(this.props.user.signhash, (designRows)=> {
	// 		this.setState({thumbnails : designRows.map((row) =>
	// 			<Thumbnail key={row.idx} title={row.title} regdate={row.regdate}
	// 					   source={`${thumbnailPath}${row.photohash}.scalb`} style={{}}/>)});
	// 	}))
	// }
	//
	// componentDidMount() {
	// 	this.updateThumbs();
	// }

	render() {
		return (
			<View style={styles.wrapper}>
				
				<ScrollView style={styles.container}>
					{/*{this.state.thumbnails}*/}
				</ScrollView>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	wrapper: {
		flex: 1,
	},
	container: {
		flex: 1,
	}
});



function mapStateToProps(state) {
	return {
		design: state.design,
		user: state.user,
		app: state.app
	};
}

export default connect(mapStateToProps)(MainScreen);

