'use strict';

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Animated, Dimensions, Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

const {width, height} = Dimensions.get('window');

export default class Lightbox extends Component {
	static propTypes = {
		fromValue: PropTypes.number.isRequired,
		toValue: PropTypes.number.isRequired,
		duration: PropTypes.number.isRequired,
		stylekey: PropTypes.string.isRequired,
		style: PropTypes.object,
		title: PropTypes.string,
		color: PropTypes.string,
		bgColor: PropTypes.string.isRequired,
		close: PropTypes.func,
		collapsed: PropTypes.bool,
		hideTop: PropTypes.bool,
		children: PropTypes.element.isRequired
	};

	static defaultProps = {
		fromValue: 0,
		toValue: 1,
		duration: 500,
		bgColor: 'white',
		color: 'black',
		stylekey: 'opacity'
	};

	state = {height: 0};
	collapsedStyle = {};


	_propclose() {
		if (this.props.close) this.props.close();
	}
	_open() {
		setTimeout(() => {
			this.setState({height});
			Animated.timing(this.animatedValue, {
				toValue: this.props.toValue,
				duration: this.props.duration
			}).start();
		}, 50);

	}
	_close() {
		Animated.timing(this.animatedValue, {
			toValue: this.props.fromValue,
			duration: this.props.duration
		}).start(() => this.setState({height: 0}));
	}

	componentWillMount() {
		if (this.props.collapsed) this.collapsedStyle = {paddingTop: 0, marginBottom: 0};
		this.animatedValue = new Animated.Value(this.props.fromValue);
	}
	render() {
		const animatedStyle = {};
		animatedStyle[this.props.stylekey] = this.animatedValue;
		const top = !this.props.hideTop
			? [	<TouchableOpacity key={'icon'} style={[styles.closeBtn]} onPress={() => { this._close(); this._propclose(); }}>
					<Image source={require('../assets/img/icon/close.png')} style={[styles.close, {tintColor: this.props.color}]} />
				</TouchableOpacity>,
				<Text key={'title'} style={[styles.title, {color: this.props.color}]}>
					{this.props.title}
				</Text>
			] : null;
		const collapsedStyle = {};
		if (this.props.hideTop) collapsedStyle.paddingTop = 0;
		return (
			<Animated.View style={[styles.container, animatedStyle, this.props.style, this.state]}>
				<View style={[ styles.animatedview, {backgroundColor: this.props.bgColor}, collapsedStyle ]}>
					{top}
					{this.props.children}
				</View>
			</Animated.View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		top: 0,
		left: 0,
		width: width,
		backgroundColor: 'rgba(0,0,0,0.8)',
		alignItems: 'center',
		justifyContent: 'center'
	},
	animatedview: {
		width: width - 50,
		backgroundColor: 'white',
		paddingTop: 50,
		marginBottom: 100
	},
	title: {
		flex: 1,
		position: 'absolute',
		textAlignVertical: 'center',
		elevation: 1,
		backgroundColor: 'white',
		top: 0,
		left: 0,
		right: 0,
		paddingHorizontal: 10,
		height: 50,
		zIndex: 5,
		fontSize: 17,
		color: 'black'
	},
	closeBtn: {
		position: 'absolute',
		elevation: 1,
		top: 0,
		right: 0,
		zIndex: 10
	},
	close: {
		width: 30,
		height: 30,
		margin: 10,
		tintColor: 'black'
	}
});
