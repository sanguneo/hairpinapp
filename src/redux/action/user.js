import {AsyncStorage, Alert} from 'react-native';

import axios from 'axios';
const RNFS = require('../../service/RNFS_wrapper');

import * as types from '../actionType/user';
import {hairpinserver} from '../../config/env.json';

export function refresh(refreshkey=Date.now()){
	return {type: types.REFRESH, refresh: refreshkey};
}

export function loginDone(user){
	RNFS.readDir(`${RNFS.PlatformDependPath}/_thumb_`)
		.then(result => {
			const resarr = [];
			result.forEach(e => resarr.push(e.path));
			console.log(resarr);
		})
		.catch(err => {
			console.error(err.message, err.code);
		});
	AsyncStorage.setItem('user', JSON.stringify(user));
	return {type: types.LOGGEDIN, user};
}
export function logout() {
	AsyncStorage.removeItem('user');
	return {type: types.LOGGEDOUT};
}

export function login(userinfo, callback=(()=>{})) {
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
						name: response.data.nickname,
						recipesize: response.data.designsize,
						followersize: response.data.followersize,
						followingsize: response.data.followingsize
					}));
					callback();
				}

				RNFS.exists(pPath).then((res) => {
					if (res) {
						loginOK();
					} else {
						RNFS.downloadFile({
							fromUrl: `http://${hairpinserver}/upload/profiles/${response.data.signhash}`,
							toFile: pPath
						}).promise.then((res) => {
							loginOK();
						}).catch(e => {
							console.error('error', e);
						});
					}
				}).catch((err) => {
					console.error(err);
				});
			} else if (response.data.message === 'noaccount')  {
				Alert.alert('사용자 정보가 존재하지 않습니다.')
			} else if (response.data.message === 'invalidpw')  {
				Alert.alert('패스워드를 다시 확인해주세요.');
			}
		}).catch(e => {
			console.log('error', e);
		});
	};
}

export function update(userstat) {
	return {type: types.USERUPDATE, userstat};
}

export function updateAsync(precallback) {
	return async (dispatch, getState) => {
		const usertoken = await getState().user.token;
		axios.get(
			'http://hpserver.sanguneo.com/user/userstat',
			{
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
					nekotnipriah: await usertoken
				}
			}
		).then((response) => {
			precallback();
			if (response.data.message === 'success') {
				const resUserstat = {
					recipesize: response.data.designsize,
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


export function joinAsync(userinfo, callback) {
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
					Alert.alert('','회원가입이 완료되었습니다.',
						[{text: '확인', onPress: () => {callback()}}]);
				}).catch(e => console.error('error', e));
			} else if (response.data.message == 'emailexist') {
				Alert.alert('사용중인 이메일 입니다.');
			} else {
				Alert.alert('입력값을 확인해주세요!');
			}
		}).catch(e => {
			console.log('error', e);
		});
	};
}

export function modifyAsync(userinfo, callback) {
	return async (dispatch) => {
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
				RNFS.copyFile(
					userinfo.modifyProfile.uri.replace('file://', ''),
					RNFS.PlatformDependPath + '/_profiles_/' + response.data.signhash + '.scalb'
				).then(() => {
					RNFS.unlink(
						userinfo.modifyProfile.uri.replace('file://', '')
					).catch(e => {});
					dispatch(loginDone({ name: response.data.nickname, refresh: Math.random() * 10000}));
					Alert.alert('','회원정보 수정이 완료되었습니다.',
						[{text: '확인', onPress: () => {callback()}}]);
				}).catch(e => console.error('error', e));
			} else if (response.data.message == 'emailexist') {
				Alert.alert('사용중인 이메일 입니다.');
			} else {
				Alert.alert('입력값을 확인해주세요!');
			}
		}).catch(e => {
			console.log('error', e);
		});
	};
}