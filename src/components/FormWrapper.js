import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Platform, View, Text, TextInput, StyleSheet } from 'react-native';

class FormWrapper extends Component {
	static propTypes = {
		children: PropTypes.any.isRequired,
		style: PropTypes.object,
	};
	static defaultProps = {
		style: {width: 300},
	};

	render() {
		return (
			<View style={[styles.wrapper]}>
				<View style={[styles.container, this.props.style]}>
					{this.props.children}
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	wrapper: {
		flex: 1,
		flexDirection:'row',
		justifyContent: 'center'

	},
	container: {
		borderRadius: 5,
		marginHorizontal: 20,
		backgroundColor: '#f5f5f5',
	},
});


export default FormWrapper


