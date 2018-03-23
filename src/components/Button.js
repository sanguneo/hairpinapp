import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, TouchableHighlight, View, Text, Image,StyleSheet } from 'react-native';
let TouchableWeUse = null;
class Button extends Component {
	static propTypes = {
		touchableType: PropTypes.number,
		buttonColor: PropTypes.string.isRequired,
		style: PropTypes.object,
		imgStyle: PropTypes.object,
		labelStyle: PropTypes.object,
		label: PropTypes.string,
		onPress: PropTypes.func.isRequired,
		source: PropTypes.any,
	};
	static defaultProps = {
		touchableType: 0,
		style: {
			flex: 1,
			height: 40
		},
		source: null,
		label: null
	};

	constructor(props) {
		super(props);

	}
	componentWillMount() {
		switch(this.props.touchableType) {
			case 1 :
				TouchableWeUse = TouchableHighlight;
				break;
			case 0 :
			default :
				TouchableWeUse = TouchableOpacity;
				break;
		}
	}

	render() {
		return (
		<View style={[styles.container, this.props.style, {backgroundColor: this.props.buttonColor}]}>
			<TouchableWeUse style={styles.touchable} onPress={() => {this.props.onPress()}}>
				{this.props.source !== null ? <Image style={[styles.image, this.props.imgStyle]} source={this.props.source}/> : null}
				{this.props.label !== null ? <Text style={styles.label}>{this.props.label}</Text> : null}
			</TouchableWeUse>
		</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {

		borderRadius: 5,
	},
	touchable: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
	},
	image: {
		width: 30,
		height: 30,
		marginVertical: 5,
		tintColor: '#fff'
	},
	label: {
		height: 40,
		marginHorizontal: 10,
		textAlign: 'center',
		textAlignVertical: 'center',
		color: '#fff',
		fontSize: 17
	}
});


export default Button


