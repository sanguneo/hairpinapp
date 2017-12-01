'use strict';

import React, {Component} from 'react';
import {TextInput, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';

export default class AutoGrowingTextInput extends Component {
	static propTypes = {
		measureBottom: PropTypes.func.isRequired,
		value: PropTypes.string.isRequired,
		style: PropTypes.object,
		styleInput: PropTypes.object,
	};

	constructor(props) {
		super(props);
		this.state = {
			height: 0,
		};
		this.onContentSizeChange = this.onContentSizeChange.bind(this);
	}

	onContentSizeChange(event){
		let height = event.nativeEvent.contentSize.height;
		let lineCount = Math.floor((Math.floor(event.nativeEvent.contentSize.height) - 42 + 19)/19);
		let lineDiff = lineCount - this.state.lineBefore;
		this.setState({ height, lineBefore : lineCount },()=> this.props.measureBottom(lineDiff * 19));
	}

	render() {
		return (
			<TextInput {...this.props}
					   multiline={true}
					   onContentSizeChange={this.onContentSizeChange}
					   style={[styles.input, this.props.styleInput, {height: Math.max(36, this.state.height)}]}
					   defaultValue={this.props.value}
					   underlineColorAndroid={'transparent'}
					   underlineColorIos={'transparent'}
					   blurOnSubmit={false}
			/>
		);
	}
}

const styles = StyleSheet.create({
	input: {
		flex: 1,
		marginHorizontal: 20,
		textAlign: 'left',
		color: '#000',
		fontSize: 15
	}
});