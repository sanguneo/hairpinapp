import React, { Component } from 'react';
import { Dimensions, Platform, View, FlatList, ScrollView, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Thumbnail from '../components/Thumbnail';

import {connect} from 'react-redux';
import * as designActions from '../redux/action/designs';
const RNFS = require('../service/RNFS_wrapper');


const logo = require('../assets/img/logo.png');
const menu = require('../assets/img/icon/menu.png');

const {width, height, deviceWidth, deviceHeight, scale} = (function() {
	let i = Dimensions.get('window')
	return {
		width: i.width,
		height: i.height,
		deviceWidth: i.width * i.scale,
		deviceHeight: i.height * i.scale,
		scale: i.scale
	};
})();

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
	constructor(props) {
		super(props)
		this.numColumns = Math.floor(width / 135);
		console.log(this.numColumns)
	}


	updateThumbs() {
		if(!this.props.user.signhash || this.props.user.signhash === '') return;
		this.props.dispatch(designActions.getDesignAsync());
	}

	componentDidMount() {
		this.updateThumbs();
	}

	render() {
		const thumbnailPath = `${RNFS.PlatformDependPath}/_original_/${this.props.user.signhash}_`;
		return (
			<View style={styles.wrapper}>
				<FlatList initialNumToRender={20} numColumns={this.numColumns} contentContainerStyle={styles.container}
						  data={this.props.designs.designTotalList} keyExtractor={item => item.idx}
						  renderItem={({item}) => <Thumbnail title={item.title} regdate={item.reg_date}
															 source={`${thumbnailPath}${item.photohash}.scalb`} />}
				/>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	wrapper: {
		flex: 1,
		paddingVertical: 5,
	},
	container: {
		alignSelf: 'center',
		alignContent: 'flex-start',
		justifyContent: 'flex-start'
	},
});



function mapStateToProps(state) {
	return {
		designs: state.designs,
		user: state.user,
		app: state.app
	};
}

export default connect(mapStateToProps)(MainScreen);

