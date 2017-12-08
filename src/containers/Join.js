import React, { Component } from 'react';
import { View, ScrollView, Image, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';

import {connect} from 'react-redux';
import * as userActions from '../redux/action/user';

import {emailcheck} from '../utils/Validation';

import FormWrapper from '../components/FormWrapper';
import LabeledInput from '../components/LabeledInput';
import Button from '../components/Button';
import Hr from '../components/Hr';
import Loading from '../components/Loading';

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
			joinProfile: profile,
			joinNickname: null,
			joinEmail: null,
			joinPassword: null,
			joinPasswordChk: null
		}
	}

	handleInputChange(label, event) {
		this.setState({[label]: event.nativeEvent.text});
	}

	setProfileImage() {
		ImagePicker.openPicker({
			width: 400,
			height: 400,
			cropping: true
		}).then(img => {
			this.setState({joinProfile: {uri: img.path}});
		}).catch(e => (e.code !== 'E_PICKER_CANCELLED') && console.log(e));
	}


	formCheck() {
		if (!this.state.joinProfile.uri) {
			Alert.alert('확인', '이미지를 선택해주세요.');
			return false;
		} else if (!this.state.joinNickname && this.state.joinNickname.length <= 0) {
			Alert.alert('확인', '닉네임을 입력해주세요.');
			this.joinNickname.focus();
			return false;
		} else if (!this.state.joinEmail && this.state.joinNickname.length <= 0) {
			Alert.alert('확인', '이메일을 입력해주세요.');
			this.joinEmail.focus();
			return false;
		} else if (!emailcheck(this.state.joinEmail)) {
			Alert.alert('확인', '이메일을 형식에 맞게 입력해주세요.');
			this.joinEmail.focus();
			return false;
		} else if (this.state.joinPassword.length < 8) {
			Alert.alert('확인', '패스워드는 8자 이상이어야합니다.');
			this.joinPassword.focus();
			return false;
		} else if (this.state.joinPassword !== this.state.joinPasswordChk) {
			Alert.alert('확인', '패스워드 확인문자가 일치하지않습니다.');
			this.joinPasswordChk.focus();
			return false;
		}
		return true;
	}
	submit() {
		if (!this.formCheck()) return;
		this.props.dispatch(userActions.joinAsync(this.state, () => {
			this.props.navigation.goBack(null);
		}, (p)=> this.loadR.updateProg(p), ()=> this.loadR.hide()));
	}

	render() {
		return (
			<View style={styles.wrapper}>
				<ScrollView style={styles.container} keyboardShouldPersistTaps='handled'>
					<View style={styles.imgView}>
						<TouchableOpacity onPress={()=> {this.setProfileImage()}}>
							<Image source={this.state.joinProfile} style={styles.img} />
						</TouchableOpacity>
					</View>
					<FormWrapper>
						<LabeledInput label="닉네임" placeholder="닉네임을 입력하세요"
									  value={this.state.joinNickname} ref={ref => this.joinNickname = ref}
									  onChange={(e) => this.handleInputChange('joinNickname', e)} />
						<Hr lineColor="#878787" />
						<LabeledInput label="이메일" placeholder="이메일을 입력하세요"
									  value={this.state.joinEmail} ref={ref => this.joinEmail = ref}
									  keyboardType="email-address"
									  onChange={(e) => this.handleInputChange('joinEmail', e)} />
						<Hr lineColor="#878787" />
						<LabeledInput label="패스워드" placeholder="패스워드를 입력하세요"
									  value={this.state.joinPassword} ref={ref => this.joinPassword = ref}
									  secureTextEntry={true}
									  onChange={(e) => this.handleInputChange('joinPassword', e)} />
						<Hr lineColor="#878787" />
						<LabeledInput label="확인" placeholder="패스워드를 다시 입력하세요"
									  value={this.state.joinPasswordChk} ref={ref => this.joinPasswordChk = ref}
									  secureTextEntry={true}
									  onChange={(e) => this.handleInputChange('joinPasswordChk', e)} />
					</FormWrapper>
					<View style={styles.btns}>
						<Button label="회원가입" onPress={()=> {this.submit()}} buttonColor="#3692d9" style={{width: 300}}/>
					</View>
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
		app: state.app
	};
}

export default connect(mapStateToProps)(Join);


