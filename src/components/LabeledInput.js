import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { KeyboardAvoidingView, Text, TextInput, StyleSheet } from 'react-native';

class LabeledInput extends Component {
	static propTypes = {
		label: PropTypes.string.isRequired,
		placeholder: PropTypes.string,
		value: PropTypes.any,
		onChange: PropTypes.func,
		secureTextEntry: PropTypes.bool,
		style: PropTypes.object,
		labelStyle: PropTypes.object,
		inputStyle: PropTypes.object,
		placeholderTextColor: PropTypes.string,
		keyboardType: PropTypes.string,
		readOnly: PropTypes.bool

	};
	static defaultProps = {
		label: '라벨',
		placeholder: '여기에 입력해 주세요',
		onChange: this.handleInputChange,
		secureTextEntry: false,
		style: {},
		labelStyle: {height: 40},
		inputStyle: {height: 40},
		placeholderTextColor: '#bbb',
		keyboardType: 'default',
		readOnly: false
	};

	render() {
		return (
			<KeyboardAvoidingView style={[styles.wrapper, this.props.style]}>
				<Text style={[styles.label, this.props.labelStyle]}>{this.props.label}</Text>
				<TextInput style={[styles.input, this.props.inputStyle]}
						   ref={ref => this.textinput = ref}
						   value={this.props.value}
						   onChange={this.props.onChange}
						   editable={!this.props.readOnly}
						   placeholder={this.props.placeholder}
						   underlineColorAndroid={'transparent'}
						   underlineColorIos={'transparent'}
						   placeholderTextColor={this.props.placeholderTextColor}
						   keyboardType={this.props.keyboardType}
						   secureTextEntry={this.props.secureTextEntry}
				/>
			</KeyboardAvoidingView>
		);
	}
}

const styles = StyleSheet.create({
	wrapper: {
		flex: 1,
		flexDirection: 'row',
	},
	label: {
		flex: 0.3,
		height: 40,
		textAlign: 'center',
		textAlignVertical: 'center',
		color: '#000',
		fontWeight: 'bold',
		fontSize: 15
	},
	input: {
		flex: 0.7,
		height: 40,
		textAlign: 'left',
		color: '#000',
		fontSize: 15
	}
});


export default LabeledInput


