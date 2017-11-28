import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Platform, KeyboardAvoidingView, Text, TextInput, StyleSheet } from 'react-native';

class LabeledInput extends Component {
	static propTypes = {
		label: PropTypes.string.isRequired,
		placeholder: PropTypes.string,
		value: PropTypes.any,
		onChange: PropTypes.func.isRequired,
		secureTextEntry: PropTypes.bool,
		style: PropTypes.object,
		labelStyle: PropTypes.object,
		inputStyle: PropTypes.object,
		placeholderTextColor: PropTypes.string

	};
	static defaultProps = {
		label: '라벨',
		placeholder: '여기에 입력해 주세요',
		onChange: this.handleInputChange,
		secureTextEntry: false,
		style: {},
		labelStyle: {height: 50},
		inputStyle: {height: 50},
		placeholderTextColor: '#bbb'
	};

	constructor(props) {
		super(props);
		this.state = {
			value: props.value,
			label: props.label,
			placeholder: props.placeholder,
		}
		this.handleInputChange = this.handleInputChange.bind(this);
	}

	handleInputChange(event) {
		this.setState({
			value: event.nativeEvent.text
		});
	}

	render() {
		return (
			<KeyboardAvoidingView style={[styles.wrapper, this.props.style]}>
				<Text style={[styles.label, this.props.labelStyle]}>{this.state.label}</Text>
				<TextInput style={[styles.input, this.props.inputStyle]}
						   value={this.state.value}
						   onChange={this.props.onChange}
						   editable={true}
						   placeholder={this.state.placeholder}
						   underlineColorAndroid={'transparent'}
						   underlineColorIos={'transparent'}
						   placeholderTextColor={this.props.placeholderTextColor}
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
		height: 50,
		textAlign: 'center',
		textAlignVertical: 'center',
		color: '#000',
		fontWeight: 'bold',
		fontSize: 15
	},
	input: {
		flex: 0.7,
		height: 50,
		textAlign: 'center',
		color: '#000',
		fontSize: 15
	}
});


export default LabeledInput


