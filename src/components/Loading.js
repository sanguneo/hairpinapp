'use strict';

import React, {Component} from 'react';
import {StyleSheet, Animated, Image, Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');

import spinner from '../assets/img/icon/spinner.gif';

export default class Loading extends Component {
	state = { show: true }
	show(){
		this.animatedValue.setValue(1);
		this.setState({show: true})
	}
	hide(){
		Animated.timing(this.animatedValue, {
			toValue: 0,
			duration: 500,
			delay: 1000
		}).start();
		setTimeout(()=>this.setState({show: false}), 1550);
	}
	componentWillMount() {
		this.animatedValue = new Animated.Value(1);
	}

	render() {
		return (this.state.show ? (
			<Animated.View style={[styles.spinner, this.props.style, {opacity: this.animatedValue}]}>
				<Image style={styles.spinnerImage} source={spinner} />
			</Animated.View>
		) : null);
	}
}

const styles = StyleSheet.create({
	spinner: {
		position: 'absolute',
		zIndex: 10,
		width,
		height,
		backgroundColor: 'rgba(0,0,0,0.9)',
		justifyContent: 'center'
	},
	spinnerImage: {
		width: 40,
		height: 40,
		marginBottom: 80,
		alignSelf: 'center'
	}
});
