'use strict';

import React, {Component} from 'react';
import {AdMobBanner} from 'react-native-admob';
import admob_config from '../config/admob';
import {StyleSheet, View} from 'react-native';

export default class AdBar extends Component {
	render() {
		return (
			<View style={[styles.barBox, this.props.style]}>
				<AdMobBanner
					bannerSize="smartBannerPortrait"
					adUnitID={admob_config.bottomBanner}
					didFailToReceiveAdWithError={console.log}
				/>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	barBox: {
		height: 50,
		flexDirection: 'row',
		justifyContent: 'center',
		marginRight: -0.5
	}
});
