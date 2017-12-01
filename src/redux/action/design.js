import {Alert} from 'react-native';

import axios from 'axios';
import ImageResizer from 'react-native-image-resizer';

const RNFS = require('../../service/RNFS_wrapper');

import * as types from '../actionType/design';
import {hairpinserver} from '../../config/env.json';

export function refresh(refresh){
	return {type: types.DESIGNREFRESH, refresh};
}

export function saveDesign(designinfo, callback) {
	return async (dispatch, getState) => {
		let {signhash} = getState().user;
		const originalPath = `${RNFS.PlatformDependPath}/_original_/${signhash}_${designinfo.photohash}`;

		const resizeBatch = (sideCase, callback) => {
			let side = sideCase.charAt(0).toUpperCase() + sideCase.slice(1)
			ImageResizer.createResizedImage(designinfo[`design${side}Image`].uri.replace('file://', ''), 400, 800, 'JPEG', 100, 0
			).then(({uri}) => {
				let renamed = `${originalPath}_CROP_${side.toUpperCase()}.scalb`;
				RNFS.moveFile( uri.replace('file://', ''), renamed).then(() => {
					RNFS.unlink(designinfo[`design${side}Image`].uri.replace('file://', '')).catch(()=>{});
				});
			}).catch((err) => console.log(err));
			ImageResizer.createResizedImage(designinfo[`design${side}ImageSrc`].uri.replace('file://', ''), 800, 800, 'JPEG', 100, 0
			).then(({uri}) => {
				let renamed = `${originalPath}_SRC_${side.toUpperCase()}.scalb`;
				RNFS.moveFile( uri.replace('file://', ''), renamed).then(() => {});
			}).catch((err) => console.log(err));
			callback();
		}

		const makeThumb = (callback)=> {
			RNFS.moveFile(designinfo.designMergedImage.replace('file://', ''), `${originalPath}.scalb`).then(() => {
				ImageResizer.createResizedImage(`${originalPath}.scalb`, 100, 100, 'JPEG', 100, 0).then(({uri}) => {
					let renamed = `${RNFS.PlatformDependPath}/_thumb_/${signhash}_${designinfo.photohash}.scalb`;
					RNFS.moveFile(uri.replace('file://', ''), renamed).then(() => callback());
				}).catch((err) => console.log(err));
			});
		}

		// done
		resizeBatch('left',()=> {
		resizeBatch('right', ()=> {
		makeThumb(()=> {
			RNFS.readDir(RNFS.PlatformDependPath + '/_original_')
				.then(result => {
					let resarr = [];
					result.forEach(e => resarr.push(e.path));
					console.log(resarr);
				})
				.catch(err => {
					console.error(err.message, err.code);
				});
		});});});
		//done
	}
}

export function uploadDesign(designinfo, callback) {
	return async (dispatch) => {
		console.log(designinfo);
	}
}