'use strict';

import React, {Component} from 'react';
import {StyleSheet, Animated, View, WebView, Text, Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');

import Spinner from '../service/Spinner';

export default class Loading extends Component {
	state = { show: true, progress: null }
	updateProg = (progress) => this.setState({progress});
	show(){
		this.animatedValue.setValue(1);
		this.setState({show: true})
	}
	hide(){
		Animated.timing(this.animatedValue, {
			toValue: 0,
			duration: 500,
			delay: 500
		}).start(() =>
			this.setState({show: false, progress: null})
		);
	}
	componentWillMount = () => this.animatedValue = new Animated.Value(1);

	render = () => this.state.show ? (
		<Animated.View style={[styles.spinner, this.props.style, {opacity: this.animatedValue}]}>
			<View style={styles.spinnerViewWrap}>
				<WebView source={{html: Spinner()}} style={[ styles.spinnerWebView]}/>
			</View>
			{this.state.progress ? <Text style={styles.indicator}>{this.state.progress}</Text> : null}
		</Animated.View>):null
}

const styles = StyleSheet.create({
	spinner: {
		position: 'absolute',
		zIndex: 10,
		width,
		height,
		paddingBottom: 160,
		backgroundColor: 'rgba(0,0,0,0.9)',
		justifyContent: 'center'
	},
	spinnerViewWrap: {
		width: 80,
		height: 60,
		alignSelf: 'center'
	},
	spinnerWebView: {
		width: 80,
		height: 80,
		backgroundColor: 'transparent',
		alignSelf: 'center'
	},
	indicator: {
		width: 200,
		height: 30,
		alignSelf: 'center',
		textAlign: 'center',
		textAlignVertical: 'center',
		color: '#ffffff'

	}
});
