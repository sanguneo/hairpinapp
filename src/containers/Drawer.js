/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

import profile from '../assets/img/profile.png';
import subscribe from '../assets/img/icon/subscribe.png';
import tags from '../assets/img/icon/tags.png';
import total from '../assets/img/icon/images.png';
import close from '../assets/img/icon/close.png';
import notice from '../assets/img/icon/speaker.png';

class Drawer extends Component {
	render() {
		return (
			<View style={styles.drawer}>
				<TouchableOpacity onPress={() => this.props.navigation.navigate('Login', {name: 'Lucy'})}>
					<Image style={styles.profile} source={profile} />
				</TouchableOpacity>
				<TouchableOpacity style={styles.drawerBtnItem}>
					<Image style={styles.drawerBtnItemImage} source={total} />
					<Text style={styles.drawerBtnItemLabel}>전체보기</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.drawerBtnItem}>
					<Image style={styles.drawerBtnItemImage} source={tags} />
					<Text style={styles.drawerBtnItemLabel}>태그보기</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.drawerBtnItem}>
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

export default Drawer;


