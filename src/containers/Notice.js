import React, { Component } from 'react';
import { View, ScrollView, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import * as noticeActions from '../redux/action/notice';
import Lightbox from '../components/Lightbox';
import Loading from '../components/Loading';
import Formatter from '../utils/Formatter';

import {connect} from 'react-redux';

import close from '../assets/img/icon/close.png';

const {width, height} = Dimensions.get('window')

class Notice extends Component {
	static navigationOptions = ({ navigation }) => ({
		headerTitle: '공지사항',
		headerTitleStyle :{alignSelf: 'center', color: '#fff', fontWeight: 'normal'},
		headerRight: (
			<View style={{width: 32, height: 32, marginHorizontal: 8}}/>
		),
	})

	state = {
		noticeList: [],
		noticeItem: {}
	}

	constructor(props) {
		super(props);
		this.state = {
			noticeList: [],
			noticeItem: {}
		}
	}

	fetchNoticeList() {
		// this.loadR.show();
		this.props.dispatch(noticeActions.getNotice((data)=>
			this.setState({noticeList: data},()=> {
				this.loadR.hide();
			})
		))
	}

	fetchOneNotice(id) {
		this.loadR.show();
		this.props.dispatch(noticeActions.getOneNotice(id, (data)=>
			this.setState({noticeItem: data}, ()=> {
				this.loadR.hide();
				this.openLightbox();
			})
		));
	}

	openLightbox() {
		this.noticeOne._open();
	}

	componentWillMount() {
		this.fetchNoticeList()
	}

	render() {
		const noticeListItems = this.state.noticeList.map((item)=>
			<View key={item._id} style={styles.noticeItemView} >
				<TouchableOpacity onPress={()=>this.fetchOneNotice(item._id)} >
					<Text style={styles.noticeItemTitle}>{item.title}</Text>
					<Text style={styles.noticeItemRegdate}>{Formatter.isoFormatter(item.regDate)}</Text>
				</TouchableOpacity>
			</View>
		)
		return (
			<View style={styles.wrapper}>
				<ScrollView style={styles.container}>
					{noticeListItems}
				</ScrollView>
				<Lightbox collapsed={true} hideTop={true} ref={ref => this.noticeOne = ref}>
					<ScrollView style={{ paddingHorizontal: 10, paddingBottom: 10, height: height - 150}}>
						<TouchableOpacity key={'icon'} style={[styles.closeBtn]} onPress={() => { this.noticeOne._close(); }}>
							<Image source={close} style={[styles.close, {tintColor: this.props.color}]} />
						</TouchableOpacity>
						<Text style={[styles.noticeItemTitle, {marginRight: 30,height: 50}]} ellipsizeMode='tail'>{this.state.noticeItem.title}</Text>
						<Text style={[styles.noticeItemRegdate, {height: 20}]}>{Formatter.isoFormatter(this.state.noticeItem.regDate)}</Text>
						<Text style={{paddingTop: 10, paddingBottom: 5, fontSize: 16}}>
							{this.state.noticeItem.content && this.state.noticeItem.content.replace(/\\n/g, '\n')}
						</Text>
					</ScrollView>
				</Lightbox>
				<Loading  ref={ref => this.loadR = ref} show={true}/>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	wrapper: {
		flex: 1,
	},
	container: {
		margin: 5,
		borderWidth: 1,
		borderColor: '#ddd',
	},
	closeBtn: {
		position: 'absolute',
		top: 5,
		right: -5,
		zIndex: 10,

	},
	close: {
		width: 25,
		height: 25,
		margin: 5,
		tintColor: 'black'
	},
	noticeItemView: {
		flex: 1,
		padding: 10,
		borderBottomWidth: 1,
		borderBottomColor: '#bbb',
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
	},
});


function mapStateToProps(state) {
	return {
		app: state.app
	};
}

export default connect(mapStateToProps)(Notice);


