'use strict';
// const RNFS = require('./RNFS_wrapper');
import RNFS from './RNFS_wrapper';

import {AsyncStorage, PermissionsAndroid, Alert, Platform} from 'react-native';
import * as userActions from '../redux/action/user';

async function requestPermission() {
	try {await PermissionsAndroid.request( PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);}
	catch (err) { console.warn(err)}
}

module.exports = (Store, callback) => {
	// Make Initial Directory
	RNFS.readDir(RNFS.PlatformDependPath)
		.then(result => {
			let resarr = [];
			result.forEach(e => resarr.push(e.path));
			if (resarr.indexOf(RNFS.PlatformDependPath + '/_original_') < 0) {
				RNFS.mkdir(RNFS.PlatformDependPath + '/_original_');
			}
			if (resarr.indexOf(RNFS.PlatformDependPath + '/_thumb_') < 0) {
				RNFS.mkdir(RNFS.PlatformDependPath + '/_thumb_');
			}
			if (resarr.indexOf(RNFS.PlatformDependPath + '/_profiles_') < 0) {
				RNFS.mkdir(RNFS.PlatformDependPath + '/_profiles_');
			}
		})
		.catch(err => {
			console.error(err.message, err.code);
		});

	// Get user status from AsyncStorage then fetch to user props
	AsyncStorage.getItem('user').then((user) => {
		(Platform.OS === 'android') && requestPermission();
		Store.dispatch(userActions.loginDone(JSON.parse(user)));
		callback();
	});
};