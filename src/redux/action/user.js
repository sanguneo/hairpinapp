import {AsyncStorage, Alert} from 'react-native';

import axios from 'axios';

import * as types from '../actionType/user';
import {hairpinserver} from '../../config/env.json';

export function login(user){
	AsyncStorage.setItem('user', JSON.stringify(user));
	return {type: types.LOGGEDIN, user};
}
export function logout() {
	AsyncStorage.removeItem('user');
	return {type: types.LOGGEDOUT};
}

export function loginAsync(userinfo) {
	return async (dispatch) => {
		axios.post(
			`https://${hairpinserver}/user/login`,
			userinfo,
			{
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json;charset=UTF-8'
				}
			}
		).then((response) => {
			if (response.data.message === 'success') {
				dispatch(login({
					token: response.data.token,
					_id: response.data._id,
					email: response.data.email,
					signhash: response.data.signhash,
					name: response.data.nickname,
					recipesize: response.data.designsize,
					followersize: response.data.followersize,
					followingsize: response.data.followingsize
				}));
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
				//let userinfo = JSON.parse(window.sessionStorage.getItem('hairpinToken'));
				//userinfo = Object.assign({}, userinfo, resUserstat);
				//window.sessionStorage.setItem('hairpinToken', JSON.stringify(userinfo));
			}
		}).catch(e => {
			console.log('error', e);
		});
	};
}