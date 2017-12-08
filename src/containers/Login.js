import React, { Component } from 'react';
import { View, ScrollView, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';
import RNFS from '../service/RNFS_wrapper';

import {connect} from 'react-redux';
import * as userActions from '../redux/action/user';
import * as designActions from '../redux/action/designs';

import FormWrapper from '../components/FormWrapper';
import LabeledInput from '../components/LabeledInput';
import Button from '../components/Button';
import Hr from '../components/Hr';
import Loading from '../components/Loading';

import profile from '../assets/img/profile.png';


class Login extends Component {
	static navigationOptions = ({ navigation }) => ({
		headerTitle: '로그인',
		headerTitleStyle :{alignSelf: 'center', color: '#fff', fontWeight: 'normal'},
		headerRight: (
			<View style={{width: 32, height: 32, marginHorizontal: 8}}/>
		),
	})

	constructor(props) {
		super(props);
		this.state = {
			loginEmail: null,
			loginPassword: null,
		}
	}

	handleInputChange(label, event) {
		this.setState({[label]: event.nativeEvent.text});
	}


	login() {
		this.loadR.show();
		this.props.dispatch(userActions.login({
			email: this.state.loginEmail,
			password: this.state.loginPassword
		}, () => {
			this.props.dispatch(designActions.getDesignsAsync());
			this.loadR.hide();
			setTimeout(()=> this.props.navigation.goBack(null), 500);
		}), (p)=> this.loadR.updateProg(p))
	}

	logout() {
		this.setState({
			loginEmail: null,
			loginPassword: null,
		},()=> {
			this.props.dispatch(userActions.logout());
		});
	}
	componentWillMount(){
		this.props.dispatch(userActions.updateAsync());
	}

	render() {
		let loggedin = this.props.user.signhash && this.props.user.signhash !== '' ? true : false;
		let pPath = RNFS.PlatformDependPath + '/_profiles_/' + this.props.user.signhash + '.scalb';
		let profileImage = loggedin ? {uri: 'file://' + pPath + '?key=' + this.props.user.refresh} : profile;
		return (
			<View style={styles.wrapper}>
				<ScrollView style={styles.container} keyboardShouldPersistTaps='handled'>
					<View style={styles.imgView}>
						<Image source={profileImage} style={styles.img} />
					</View>
					<View style={styles.indicatorView}>
						<View style={styles.indicator}><Text style={styles.indiNum}>{this.props.user.designsize}</Text><Text style={styles.indiLabel}>designs</Text></View>
						<View style={styles.indicator}><Text style={styles.indiNum}>{this.props.user.followersize}</Text><Text style={styles.indiLabel}>follower</Text></View>
						<View style={styles.indicator}><Text style={styles.indiNum}>{this.props.user.followingsize}</Text><Text style={styles.indiLabel}>following</Text></View>
					</View>
					<FormWrapper>
						{loggedin ?
							[
								<LabeledInput key="name" label="닉네임" placeholder="닉네임을 입력하세요"
											  value={this.props.user.name}
											  readOnly={loggedin}/>,
								<Hr key="hr2" lineColor="#878787" />,
								<LabeledInput key="email" label="이메일" placeholder="이메일을 입력하세요"
											  value={this.props.user.email}
											  readOnly={loggedin}/>,
							] : [
								<LabeledInput key="email_ol" label="이메일" placeholder="이메일을 입력하세요"
											  value={this.state.loginEmail}
											  keyboardType="email-address"
											  readOnly={loggedin}
											  onChange={(e) => this.handleInputChange('loginEmail', e)} />,
								<Hr key="hr2" lineColor="#878787" />,
								<LabeledInput key="pw" label="패스워드" placeholder="패스워드를 입력하세요"
											  value={this.state.loginPassword}
											  secureTextEntry={true}
											  readOnly={loggedin}
											  onChange={(e) => this.handleInputChange('loginPassword', e)} />
							]
						}
					</FormWrapper>
					{!loggedin ?
						[
							<View style={styles.btns} key={'login'}>
								<Button label="로그인" onPress={()=> {this.login()}} buttonColor="#3692d9" style={{width: 300}}/>
							</View>,
							<View style={[styles.btns, {marginTop: 10}]} key={'join'}>
								<Button label="회원가입" onPress={()=> {this.props.navigation.navigate('Join')}} buttonColor="#bd6592" style={{width: 300}}/>
							</View>
						] : [
							<View style={styles.btns} key={'logout'}>
								<Button label="로그아웃" onPress={()=> {this.logout()}} buttonColor="#d9663c" style={{width: 300}}/>
							</View>,
							<View style={[styles.btns, {marginTop: 10}]} key={'modify'}>
								<Button label="정보수정" onPress={()=> {this.props.navigation.navigate('Modify')}} buttonColor="#bd6592" style={{width: 300}}/>
							</View>
						]
					}
				</ScrollView>
				<Loading  ref={ref => this.loadR = ref}/>
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
	},
	imgView: {
		flex: 1,
		flexDirection: 'row',
		height: 200,
		justifyContent: 'center',
		marginVertical: 20,
	},
	img: {
		width: 200,
		height: 200,
		borderColor: '#eee',
		borderWidth: 1
	},
	indicatorView: {
		flex: 1,
		flexDirection: 'row',
		height: 50,
		justifyContent: 'center',
		marginTop: 0,
		marginBottom: 20,
	},
	indicator: {
		flexDirection: 'column',
		width: 100,
		height: 50,
	},
	indiNum: {
		flex: 1,
		textAlign: 'center',
		textAlignVertical: 'center',
		fontSize: 20,
		fontWeight: 'bold',
		fontFamily: 'Verdana',
		color: 'black'
	},
	indiLabel: {
		flex: 1,
		textAlign: 'center',
		textAlignVertical: 'center',
		fontSize: 13,
		fontFamily: 'Verdana',
		color: 'black'
	},
	btns: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'center',
		marginTop: 20,
	}
});


function mapStateToProps(state) {
	return {
		user: state.user,
		app: state.app
	};
}

export default connect(mapStateToProps)(Login);


