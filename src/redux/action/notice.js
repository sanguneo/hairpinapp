import axios from 'axios';
import {Alert} from 'react-native';

export function getNotice(callback, errorCallback=(()=>{})) {
	return async () => {
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
				callback(response.data.notice);
			} else {
			}
		}).catch(e => {
			console.log('error', e);
			errorCallback(e)
		});
	}
}

export function getOneNotice(id, callback, errorCallback=(()=>{})) {
	return async () => {
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
				callback(response.data.notice);
			} else {
			}
		}).catch(e => {
			console.log('error', e);
			errorCallback(e)
		});
	}
}