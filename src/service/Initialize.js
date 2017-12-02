'use strict';
const RNFS = require('./RNFS_wrapper');

import {AsyncStorage} from 'react-native';
import * as userActions from '../redux/action/user';

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
		Store.dispatch(userActions.loginDone(JSON.parse(user)));
		callback();
	});
};