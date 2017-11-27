import axios from 'axios';

import * as types from '../actionType/user';

export function login(user) {
	return {type: types.LOGGEDIN, user};
}

export function logout() {
	// window.sessionStorage.removeItem('hairpinToken');
	return {type: types.LOGGEDOUT};
}

export function loginAsync(userinfo, precallback) {
	return async (dispatch) => {
		axios.post(
			'https://hpserver.sanguneo.com/user/login',
			userinfo,
			{
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json'
				}
			}
		).then((response) => {
			precallback();
			if (response.data.message === 'success') {
				const resUserinfo = {
					token: response.data.token,
					_id: response.data._id,
					email: response.data.email,
					signhash: response.data.signhash,
					name: response.data.nickname,
					recipesize: response.data.designsize,
					followersize: response.data.followersize,
					followingsize: response.data.followingsize,
					status: true
				};
				window.sessionStorage.setItem('hairpinToken', JSON.stringify(resUserinfo));
				dispatch(login(resUserinfo));
			} else if (response.data.message === 'noaccount')  {
				alert('사용자 정보가 존재하지 않습니다.\n가입하시겠습니까?')
			} else if (response.data.message === 'invalidpw')  {
				alert('패스워드를 다시 확인해주세요.');
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