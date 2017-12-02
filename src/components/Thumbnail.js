import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Image, StyleSheet, Text, TouchableOpacity} from 'react-native';
import Util from '../utils/Formatter';

export default class Thumbnail extends Component {
	static propTypes = {
		title: PropTypes.string,
		regdate: PropTypes.any,
		source: PropTypes.object.isRequired,
		style: PropTypes.object.isRequired,
		onPress: PropTypes.func
	}
	render() {
		const title = this.props.title
			? this.props.title
			: this.props.regdate
				? Util.dateFormatter(this.props.regdate)
				: 'noname';
		return (
			<TouchableOpacity
				style={[styles.thumbnail, this.props.style]}
				onPress={this.props.onPress}>
				<Image source={{uri: this.props.source}} style={styles.thumbImage} />
				<Text style={styles.thumbnailText} numberOfLines={1} ellipsizeMode='tail' >{title}</Text>
			</TouchableOpacity>
		);
	}
}

const styles = StyleSheet.create({
	thumbnail: {
		width: 150,
		height: 200
	},
	thumbImageWrapper: {
		justifyContent: 'center',
		alignItems: 'center'
	},
	thumbImage: {
		width: 150,
		height: 150
	},
	thumbnailText: {
		height: 50,
		textAlignVertical: 'top',
		paddingHorizontal: 5,
		fontSize: 13
	}
});
