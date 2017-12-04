import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Image, StyleSheet, Text, TouchableOpacity} from 'react-native';
import Formatter from '../utils/Formatter';

export default class Thumbnail extends Component {
	static propTypes = {
		title: PropTypes.string,
		regdate: PropTypes.any,
		source: PropTypes.string.isRequired,
		style: PropTypes.object,
		onPress: PropTypes.func
	}
	render() {
		return (
			<TouchableOpacity
				style={[styles.thumbnail, this.props.style]}
				onPress={this.props.onPress}>
				<Image source={{uri: 'file://' + this.props.source.replace('file://', '')}} style={styles.thumbImage} />
				<Text style={styles.thumbnailText} numberOfLines={1} ellipsizeMode='tail'>{this.props.title}</Text>
			</TouchableOpacity>
		);
	}
}

const styles = StyleSheet.create({
	thumbnail: {
		width: 125,
		height: 165,
		marginHorizontal: 5,
		marginBottom: 10,
		borderWidth: 1,
		borderColor: '#c0c0c0'
	},
	thumbImageWrapper: {
		justifyContent: 'center',
		alignItems: 'center'
	},
	thumbImage: {
		width: 125,
		height: 125,
		alignSelf:'center'
	},
	thumbnailText: {
		height: 40,
		textAlignVertical: 'top',
		paddingHorizontal: 5,
		fontSize: 13
	}
});
