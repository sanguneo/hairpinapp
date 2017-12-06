import React, { Component } from 'react';
import { View, ScrollView, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Lightbox from '../components/Lightbox';
import Loading from '../components/Loading';
import axios from 'axios';
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

	constructor(props) {
		super(props);
		this.state = {
			noticeList: [],
			noticeItem: {}
		}
	}

	fetchNoticeList() {
		axios.get(
			'http://hpserver.sanguneo.com/notice/plain',
			{
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json'
				}
			}
		).then(response => {
			if (response.data.code === 320){
				this.setState({noticeList: response.data.notice},()=> {
					this.loadR.hide();
				});
			} else {
			}
		}).catch(e => {
			console.log('error', e);
		});
	}

	fetchOneNotice(id) {
		this.loadR.show();
		axios.get(
			`http://hpserver.sanguneo.com/notice/${id}`,
			{
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json'
				}
			}
		).then(response => {
			if (response.data.code === 340){
				this.setState({noticeItem: response.data.notice}, ()=> {
					this.loadR.hide();
					this.openLightbox();
				});
			} else {
			}
		}).catch(e => {
			console.log('error', e);
		});
	}

	openLightbox() {
		this.noticeOne._open();
	}

	componentWillMount() {
		this.fetchNoticeList()
	}
	componentDidMount() {
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
						<Text style={[styles.noticeItemTitle, {height: 50}]}>{this.state.noticeItem.title}</Text>
						<Text style={[styles.noticeItemRegdate, {height: 20}]}>{Formatter.isoFormatter(this.state.noticeItem.regDate)}</Text>
						<Text style={{paddingTop: 10, paddingBottom: 5, fontSize: 16}}>
							{this.state.noticeItem.content && this.state.noticeItem.content.replace(/\\n/g, '\n')}
						</Text>
					</ScrollView>
				</Lightbox>
				<Loading  ref={ref => this.loadR = ref}/>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	wrapper: {
		flex: 1,
	},
	closeBtn: {
		position: 'absolute',
		top: 5,
		right: -5,
		zIndex: 10,

	},
	close: {
		width: 30,
		height: 30,
		margin: 5,
		tintColor: 'black'
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
	},
});


function mapStateToProps(state) {
	return {
		app: state.app
	};
}

export default connect(mapStateToProps)(Notice);


