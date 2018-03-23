import React, { Component } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';

import {connect} from 'react-redux';
import * as designActions from '../redux/action/designs';


class Tags extends Component {
	static navigationOptions = ({ navigation }) => ({
		headerTitle: (
			<View style={styles.tagSearchView}>
				<TextInput style={styles.tagSearch} placeholder='검색어를 입력하세요'
						   onChange={navigation.state.params.onChange}
						   placeholderTextColor="#ddd"
						   underlineColorAndroid={'transparent'} underlineColorIos={'transparent'}/>
			</View>
		)
	})

	state = {
		query: ''
	}

	constructor(props) {
		super(props);
		this.props.navigation.setParams({
			onChange: this.handleInputChange.bind(this)
		});
	}

	handleInputChange(event) {
		this.setState({query: event.nativeEvent.text});
	}

	goTag(tagname) {
		this.props.navigation.navigate('TagList', {tagname})
	}

	componentWillMount() {
		this.props.dispatch(designActions.getTagnamesAsync());
	}

	render() {
		const designTagComponents = this.props.designs.designTagnameList.filter(
			(item) =>String(item.tagname).includes(this.state.query)).map((item, idx) =>(
			<TouchableOpacity key={idx} onPress={()=>this.goTag(item.tagname)}>
				<Text style={styles.tag}>#{item.tagname}</Text>
			</TouchableOpacity>
		));
		return (
			<View style={styles.wrapper}>
				<ScrollView style={styles.wrapper}>
					<View style={styles.container}>
						{designTagComponents}
					</View>
				</ScrollView>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	wrapper: {
		flex: 1,
	},
	container: {
		flex: 1,
		flexDirection: 'row',
		flexWrap: 'wrap',
		padding: 10
	},
	tag: {
		height: 40,
		paddingHorizontal: 10,
		margin: 5,
		backgroundColor: '#bbb',
		borderRadius: 5,
		elevation: 3,
		color: '#ffffff',
		fontWeight: 'bold',
		fontSize: 16,
		textAlign: 'center',
		textAlignVertical: 'center'
	},
	tagSearchView: {
		flex: 1,
		flexDirection: 'row',
		paddingVertical: 7,
		paddingHorizontal: 5,
	},
	tagSearch: {
		flex: 1,
		paddingHorizontal: 10,
		textAlign: 'left',
		color: '#fff',
		fontSize: 15,
		borderRadius: 5,
		backgroundColor: 'rgba(0,0,0,0.5)'
	}
});


function mapStateToProps(state) {
	return {
		designs: state.designs,
		user: state.user,
		app: state.app
	};
}

export default connect(mapStateToProps)(Tags);


