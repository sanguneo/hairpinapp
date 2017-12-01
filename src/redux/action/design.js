import {Alert} from 'react-native';

import axios from 'axios';
const RNFS = require('../../service/RNFS_wrapper');

import * as types from '../actionType/design';
import {hairpinserver} from '../../config/env.json';

export function refresh(refresh){
	return {type: types.DESIGNREFRESH, refresh};
}

export function saveDesign(designinfo, callback) {
	return async (dispatch) => {

	}
}

export function designDesign(userinfo, callback) {
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
					dispatch(refresh(Math.random() * 10000));
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