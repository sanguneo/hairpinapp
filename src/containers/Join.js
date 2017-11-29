import React, { Component } from 'react';
import { View, ScrollView, Image, StyleSheet } from 'react-native';

import {connect} from 'react-redux';
import * as userActions from '../redux/action/user';

import FormWrapper from '../components/FormWrapper';
import LabeledInput from '../components/LabeledInput';
import Button from '../components/Button';
import Hr from '../components/Hr';

import profile from '../assets/img/profile.png';


class Join extends Component {
	static navigationOptions = ({ navigation }) => ({
		headerTitle: '회원가입',
		headerTitleStyle :{alignSelf: 'center', color: '#fff', fontWeight: 'normal'},
		headerRight: (
			<View style={{width: 32, height: 32, marginHorizontal: 8}}/>
		),
	})

	constructor(props) {
		super(props);
		this.state = {
			loginNickname: null,
			loginEmail: null,
			loginPassword: null,
			loginPasswordChk: null
		}
	}

	handleInputChange(label, event) {
		this.setState({[label]: event.nativeEvent.text});
	}

	render() {
		return (
			<View style={styles.wrapper}>
				<ScrollView style={styles.container} keyboardShouldPersistTaps='handled'>
					<View style={styles.imgView}>
						<Image source={profile} style={styles.img} />
					</View>
					<FormWrapper>
						<LabeledInput label="닉네임" placeholder="닉네임을 입력하세요"
									  value={this.state.loginNickname}
									  onChange={(e) => this.handleInputChange('loginNickname', e)} />
						<LabeledInput label="이메일" placeholder="이메일을 입력하세요"
									  value={this.state.loginEmail}
									  keyboardType="email-address"
									  onChange={(e) => this.handleInputChange('loginId', e)} />
						<Hr lineColor="#878787" />
						<LabeledInput label="패스워드" placeholder="패스워드를 입력하세요"
									  value={this.state.loginPassword}
									  secureTextEntry={true}
									  onChange={(e) => this.handleInputChange('loginPassword', e)} />
						<Hr lineColor="#878787" />
						<LabeledInput label="확인" placeholder="패스워드를 다시 입력하세요"
									  value={this.state.loginPasswordChk}
									  secureTextEntry={true}
									  onChange={(e) => this.handleInputChange('loginPasswordChk', e)} />
					</FormWrapper>
					<View style={styles.btns}>
						<Button label="회원가입" onPress={()=> {console.log(this.state)}} buttonColor="#d9663c"/>
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
		marginBottom: 20
	}
});


function mapStateToProps(state) {
	return {
		user: state.user,
		app: state.app,
		navigation: state.navigation
	};
}

export default connect(mapStateToProps)(Join);


