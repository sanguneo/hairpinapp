import React, { Component } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import axios from 'axios';
import {hairpinserver} from '../../config/env.json';

import {connect} from 'react-redux';


class NoticeOne extends Component {
	static navigationOptions = {
		header: null
	}

	constructor(props) {
		super(props);
		this.state = {
		}
	}

	fetchOneNotice(id) {
		axios.get(
			`https://${hairpinserver}/notice/${id}`,
			{
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json'
				}
			}
		).then(response => {
			if (response.data.code === 340){
				console.log(response.data.notice)
			} else {

			}
		}).catch(e => {
			console.log('error', e);
		});
	}

	componentWillMount() {
		this.fetchOneNotice(this.props.navigation.state.params.id);
	}

	render() {
		return (
			<View style={styles.wrapper}>
				<ScrollView style={styles.container}>
				</ScrollView>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	wrapper: {
		flex: 1,
	},
	noticeItemView: {
		flex: 1,
		padding: 10,
		borderBottomWidth: 0.5,
		borderBottomColor: '#999',
	},
	noticeItemTitle: {
		flex: 1,
		fontSize: 20,
		fontWeight: 'bold',
		textAlignVertical: 'center'
	},
	noticeItemRegdate: {
		flex: 1,
		fontSize: 12,
		textAlign: 'right'
	}
});


function mapStateToProps(state) {
	return {
		app: state.app
	};
}

export default connect(mapStateToProps)(NoticeOne);


