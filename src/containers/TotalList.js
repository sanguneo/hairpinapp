import React, { Component } from 'react';
import { Dimensions, Platform, View, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Thumbnail from '../components/Thumbnail';

import {connect} from 'react-redux';
import * as designActions from '../redux/action/designs';
import RNFS from '../service/RNFS_wrapper';
import Formatter from '../utils/Formatter';


import logo from '../assets/img/logo.png';
import menu from '../assets/img/icon/menu.png';

const {width, height, deviceWidth, deviceHeight, scale} = (function() {
	let i = Dimensions.get('window');
	return {
		width: i.width,
		height: i.height,
		deviceWidth: i.width * i.scale,
		deviceHeight: i.height * i.scale,
		scale: i.scale
	};
})();

class TotalList extends Component {
	static navigationOptions = ({ navigation }) => ({
		headerTitleStyle :{alignSelf: 'center', color: '#fff', fontWeight: 'normal',textAlign: 'center', justifyContent: 'center'},
		headerLeft: (navigation.state.routeName&& navigation.state.routeName === 'Main' &&
			<TouchableOpacity onPress={() => {navigation.navigate('DrawerOpen')}}>
				<Image source={menu} style={{width: 32, height: 32, marginHorizontal: 8, tintColor: '#fff'}}/>
			</TouchableOpacity>
		),
		headerTitle: (navigation.state.routeName&& navigation.state.routeName === 'Main' ?
			<Image source={logo} resizeMode="contain" style={[{width: 123, height: 40,flex: 1}, Platform.OS === 'android' ? {alignSelf:'center'} : {}]}/> : '전체보기'
		),
		headerRight: (
			<View style={{width: 32, height: 32, marginHorizontal: 8}}/>
		),
	});
	constructor(props) {
		super(props)
		this.numColumns = Math.floor(width / 135);
		this.goDesign = this.goDesign.bind(this);
	}

	componentDidMount() {
		if(!this.props.user.signhash || this.props.user.signhash === '') return;
		this.props.dispatch(designActions.getDesignsAsync());
	}

	goDesign(designHash, screentitle) {
		this.props.navigation.navigate('Reveal', {designHash, screentitle, dispatch: this.props.dispatch.bind(this)});
	}

	render() {
		const thumbnailPath = `${RNFS.PlatformDependPath}/_original_/${this.props.user.signhash}_`;
		const {refresh} = this.props.designs;
		return (
			<View style={styles.wrapper}>
				<FlatList initialNumToRender={20} numColumns={this.numColumns} contentContainerStyle={styles.container}
						  data={this.props.designs.designTotalList} keyExtractor={item => item.idx}
						  renderItem={({item}) => {
							  const title = item.title ? item.title : item.reg_date
								  									? Formatter.dateFormatter(item.reg_date) : 'noname';
							  return <Thumbnail title={title}
										 designHash={item.photohash}
										 source={`${thumbnailPath}${item.photohash}.scalb?refresh=${refresh}`}
										 onPress={() => this.goDesign(item.photohash, title)}/>}}
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

export default connect(mapStateToProps)(TotalList);

