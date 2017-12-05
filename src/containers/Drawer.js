/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import RNFS from '../service/RNFS_wrapper';

import {connect} from 'react-redux';

import profile from '../assets/img/profile.png';
import subscribe from '../assets/img/icon/subscribe.png';
import tags from '../assets/img/icon/tags.png';
import total from '../assets/img/icon/images.png';
import close from '../assets/img/icon/close.png';
import notice from '../assets/img/icon/speaker.png';

class Drawer extends Component {
	constructor(props) {
		super(props);
		this.goContainer = this.goContainer.bind(this);
	}
	goContainer(containerName) {
		if(this.props.user.token && this.props.user.token !== '') {
			return typeof containerName == 'string' && this.props.navigation.navigate(containerName);
		}
		Alert.alert('', '로그인이 되어있지 않습니다.\n로그인페이지로 이동합니다.',
			[{text: '확인', onPress: () => {this.props.navigation.navigate('Login')}}]);
	}
	render() {
		let pPath = RNFS.PlatformDependPath + '/_profiles_/' + this.props.user.signhash + '.scalb';
		let profileImage = this.props.user.signhash ? {uri: 'file://' + pPath + '?key=' + this.props.user.refresh} : profile;
		return (
			<View style={styles.drawer}>
				<TouchableOpacity onPress={() => this.props.navigation.navigate('Login')}>
					<Image style={styles.profile} source={profileImage} />
					<Text style={styles.name}>{this.props.user.name||'로그인'}</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.drawerBtnItem} onPress={() => this.goContainer('Total')}>
					<Image style={styles.drawerBtnItemImage} source={total} />
					<Text style={styles.drawerBtnItemLabel}>전체보기</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.drawerBtnItem}>
					<Image style={styles.drawerBtnItemImage} source={tags} />
					<Text style={styles.drawerBtnItemLabel}>태그보기</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.drawerBtnItem} onPress={() => this.goContainer('Write')}>
					<Image style={styles.drawerBtnItemImage} source={subscribe} />
					<Text style={styles.drawerBtnItemLabel}>작성하기</Text>
				</TouchableOpacity>
				<TouchableOpacity style={[styles.drawerBtnItem, styles.drawerBtnAbsolute, {bottom: 50}]}>
					<Image style={styles.drawerBtnItemImage} source={notice} />
					<Text style={styles.drawerBtnItemLabel}>공지사항</Text>
				</TouchableOpacity>
				<TouchableOpacity style={[styles.drawerBtnItem, styles.drawerBtnAbsolute, {bottom: 0}]}>
					<Image style={styles.drawerBtnItemImage} source={close} />
					<Text style={styles.drawerBtnItemLabel}>메뉴닫기</Text>
				</TouchableOpacity>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	drawer: {
		flexDirection: 'column',
		flex: 1,
		backgroundColor: '#20232a',

	},
	profile: {
		width: 200,
		height: 200
	},
	name: {
		width: 200,
		height: 25,
		textAlign: 'right',
		marginTop: -30,
		paddingHorizontal: 10,
		backgroundColor: 'rgba(255,255,255,0.65)',
		fontSize: 18,
		fontWeight: 'bold',
		textShadowColor: 'white',
		textShadowOffset: {width: 0.1, height: 0.1},
		textShadowRadius: 5
	},
	drawerBtnItem: {
		flexDirection: 'row',
		height: 50,
	},
	drawerBtnItemImage: {
		width: 36,
		height: 36,
		margin: 7,
		marginLeft: 14,
		tintColor: '#d4d4d4'
	},
	drawerBtnItemLabel: {
		width: 200 - 71,
		height: 50,
		textAlign: 'center',
		textAlignVertical: 'center',
		fontSize: 17,
		color: '#d4d4d4'
	},
	drawerBtnAbsolute: {
		position: 'absolute',
	}
});
function mapStateToProps(state) {
	return {
		user: state.user,
		app: state.app
	};
}

export default connect(mapStateToProps)(Drawer);

