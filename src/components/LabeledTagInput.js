import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { KeyboardAvoidingView, View, Text, TextInput, StyleSheet } from 'react-native';
import TagInput from './TagInput'

class LabeledTagInput extends Component {
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
		placeholder: '태그를 입력하세요',
		onChange: this.handleInputChange,
		secureTextEntry: false,
		style: {},
		labelStyle: {height: 40},
		inputStyle: {height: 40},
		placeholderTextColor: '#bbb',
		keyboardType: 'default',
		readOnly: false
	};

	constructor(props) {
		super(props);
		this.state = {
			tags: props.value,
			label: props.label,
			placeholder: props.placeholder,
		}
		this.handleInputChange = this.handleInputChange.bind(this);
		this.onChangeTags = this.onChangeTags.bind(this);
	}

	handleInputChange(event) {
		this.setState({
			value: event.nativeEvent.text
		});
	}

	onChangeTags(tags) {
		this.setState({tags});
		this.props.onChange(tags);
	};

	focus() {
		this.textinput.focus();
	}

	render() {
		return (
			<KeyboardAvoidingView style={[styles.wrapper, this.props.style]}>
				<Text style={[styles.label, this.props.labelStyle]}>{this.state.label}</Text>
				<View style={styles.input}>
					<TagInput value={this.state.tags}
						onChange={this.onChangeTags}
						tagTextColor="white"
						inputProps={{
							keyboardType: 'default',
							placeholder: this.props.placeholder,
							autoFocus: false
						}}
						readOnly={this.props.readOnly}
						parseOnBlur={true}
						numberOfLines={99}
						ref={'tag'}
					/>
				</View>
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
		marginRight: 5
	}
});


export default LabeledTagInput


