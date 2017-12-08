import {AsyncStorage, Alert} from 'react-native';

import axios from 'axios';
import RNFS from '../../service/RNFS_wrapper';

import * as types from '../actionType/user';
import {hairpinserver} from '../../config/env.json';

export function refresh(refreshkey=Date.now()){
	return {type: types.REFRESH, refresh: refreshkey};
}

export function loginDone(user){
	AsyncStorage.setItem('user', JSON.stringify(user));
	return {type: types.LOGGEDIN, user};
}
export function logout() {
	AsyncStorage.removeItem('user');
	return {type: types.LOGGEDOUT};
}

export function login(userinfo, callback=(()=>{}), errorcallback=(()=>{})) {
	return async (dispatch) => {
		axios.post(
			`https://${hairpinserver}/user/login`,
			userinfo,
			{
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json'
				}
			}
		).then((response) => {
			if (response.data.message === 'success') {
				let pPath = RNFS.PlatformDependPath + '/_profiles_/' + response.data.signhash + '.scalb';
				const loginOK = () => {
					dispatch(loginDone({
						token: response.data.token,
						_id: response.data._id,
						email: response.data.email,
						signhash: response.data.signhash,
						name: response.data.nickname
					}));
					dispatch(update({
						designsize: response.data.designsize,
						followersize: response.data.followersize,
						followingsize: response.data.followingsize,
					}));
				}
				RNFS.exists(pPath).then((res) => {
					if (res) {
						loginOK();
					} else {
						RNFS.downloadFile({
							fromUrl: `http://${hairpinserver}/upload/profiles/${response.data.signhash}`,
							toFile: pPath
						}).promise.then((res) => {loginOK();callback();}
						).catch(e => {console.log('error', e);errorcallback();});
					}
				}).catch((e) => {console.log('error', e);errorcallback();});
			} else if (response.data.message === 'noaccount')  {
				Alert.alert('사용자 정보가 존재하지 않습니다.')
			} else if (response.data.message === 'invalidpw')  {
				Alert.alert('패스워드를 다시 확인해주세요.');
			}
		}).catch(e => {console.log('error', e);errorcallback();});
	};
}

export function update(userstat) {
	return {type: types.USERUPDATE, userstat};
}

export function updateAsync() {
	return async (dispatch, getState) => {
		const {token} = getState().user;
		if(token === '') return;
		axios.get(
			'http://hpserver.sanguneo.com/user/userstat',
			{
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
					nekotnipriah: token
				}
			}
		).then((response) => {
			if (response.data.message === 'success') {
				const resUserstat = {
					designsize: response.data.designsize,
					followersize: response.data.followersize,
					followingsize: response.data.followingsize,
				};
				dispatch(update(resUserstat));
			}
		}).catch(e => {
			console.log('error', e);
		});
	};
}


export function joinAsync(userinfo, callback=(()=>{}), errorcallback=(()=>{})) {
	return async (dispatch) => {
		let formdata = new FormData();
		formdata.append('profile', {
			uri: userinfo.joinProfile.uri,
			type: 'image/jpeg',
			name: userinfo.joinEmail + '.scalb'
		});
		formdata.append('nickname', userinfo.joinNickname);
		formdata.append('email', userinfo.joinEmail);
		formdata.append('password', userinfo.joinPassword);
		axios.post(
			`https://${hairpinserver}/user/signup`,
			formdata,
			{
				headers: {
					Accept: 'application/json',
					'Content-Type': 'multipart/form-data'
				}
			}
		).then((response) => {
			if (response.data.message === 'success') {
				RNFS.copyFile(
					userinfo.joinProfile.uri.replace('file://', ''),
					RNFS.PlatformDependPath + '/_profiles_/' + response.data.signhash + '.scalb'
				).then(() => {
					Alert.alert('회원가입이 완료되었습니다',null, [{text: '확인', onPress: () => {callback()}}]);
				}).catch(e => {console.log('error', e);errorcallback();});
			} else if (response.data.message == 'emailexist') {
				Alert.alert('사용중인 이메일 입니다');
			} else {
				Alert.alert('입력값을 확인하세요!');
			}
		}).catch(e => {console.log('error', e);errorcallback();});
	};
}

export function modifyAsync(userinfo, callback=(()=>{}), errorcallback=(()=>{})) {
	return async (dispatch, getState) => {
		let formdata = new FormData();
		formdata.append('profile', {
			uri: userinfo.modifyProfile.uri,
			type: 'image/jpeg',
			name: userinfo.modifyEmail + '.scalb'
		});
		formdata.append('nickname', userinfo.modifyNickname);
		formdata.append('email', userinfo.modifyEmail);
		formdata.append('password', userinfo.modifyPassword);
		axios.post(
			`https://${hairpinserver}/user/modify`,
			formdata,
			{
				headers: {
					Accept: 'application/json',
					'Content-Type': 'multipart/form-data'
				}
			}
		).then((response) => {
			if (response.data.message === 'success') {
				if(userinfo.modifyProfile.uri.replace('file://', '').split('?')[0] !== RNFS.PlatformDependPath + '/_profiles_/' + response.data.signhash + '.scalb') {
					RNFS.copyFile(
						userinfo.modifyProfile.uri.replace('file://', ''),
						RNFS.PlatformDependPath + '/_profiles_/' + response.data.signhash + '.scalb'
					).then(() => {
						RNFS.unlink(userinfo.modifyProfile.uri.replace('file://', '')).catch(e => errorcallback());
					}).catch(e => {
						console.log('error', e);
						errorcallback();
					});
				}
				dispatch(loginDone(Object.assign({}, getState().user, { name: userinfo.modifyNickname, refresh: Math.random() * 10000})));
				Alert.alert('회원정보 수정이 완료되었습니다',null, [{text: '확인', onPress: () => {callback()}}]);
			} else {
				Alert.alert('입력값을 확인해주세요!');
			}
		}).catch(e => {console.log('error', e);errorcallback();});
	};
}