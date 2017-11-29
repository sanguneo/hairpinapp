import React, { Component } from 'react';
import { Platform, View, ScrollView, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

import {connect} from 'react-redux';
import * as userActions from '../redux/action/user';

import FormWrapper from '../components/FormWrapper';
import LabeledInput from '../components/LabeledInput';
import Button from '../components/Button';
import Hr from '../components/Hr';

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

	render() {
		let loggedin = this.props.user.signhash && this.props.user.signhash !== '';
		return (
			<View style={styles.wrapper}>
				<ScrollView style={styles.container} keyboardShouldPersistTaps='handled'>
					<View style={styles.imgView}>
						<Image source={profile} style={styles.img} />
					</View>
					<FormWrapper>
						<LabeledInput label="이메일" placeholder="이메일을 입력하세요"
									  value={this.state.loginEmail}
									  keyboardType="email-address"
									  onChange={(e) => this.handleInputChange('loginEmail', e)} />
						<Hr lineColor="#878787" />
						<LabeledInput label="패스워드" placeholder="패스워드를 입력하세요"
									  value={this.state.loginPassword}
									  secureTextEntry={true}
									  onChange={(e) => this.handleInputChange('loginPassword', e)} />
					</FormWrapper>
					{!loggedin ?
						[	<View style={styles.btns} key={'login'}>
								<Button label="로그인" onPress={()=> {this.props.dispatch(userActions.loginAsync({email: this.state.loginEmail,password: this.state.loginPassword}))}} buttonColor="#3692d9"/>
							</View>,
							<View style={[styles.btns, {marginTop: 10}]} key={'join'}>
								<Button label="회원가입" onPress={()=> {this.props.navigation.navigate('Join')}} buttonColor="#bd6592"/>
							</View>
						] :
						[	<View style={styles.btns} key={'login'}>
							<Button label="로그아웃" onPress={()=> {console.log(this.state)}} buttonColor="#d9663c"/>
						</View>,
							<View style={[styles.btns, {marginTop: 10}]} key={'join'}>
								<Button label="정보수정" onPress={()=> {this.props.navigation.navigate('Modify')}} buttonColor="#bd6592"/>
							</View>
						]
					}
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
	},
	img: {
		width: 300,
		height: 300,
		borderColor: '#eee',
		borderWidth: 1
	},
	imgView: {
		flex: 1,
		flexDirection: 'column',
		height: 300,
		alignItems: 'center',
		marginVertical: 20,
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


