import {Alert} from 'react-native';

import axios from 'axios';
import ImageResizer from 'react-native-image-resizer';
import HairpinDB from '../../service/HairpinDB'

const RNFS = require('../../service/RNFS_wrapper');

import * as types from '../actionType/designs';
import {hairpinserver} from '../../config/env.json';

export function refresh(refreshkey=Date.now()){
	return {type: types.DESIGNREFRESH, refresh: refreshkey};
}

export function getDesign(designTotalList){
	return {type: types.DESIGNLISTUPDATE, designTotalList};
}

export function getDesignAsync(limit=false, offset=false) {
	return async (dispatch, getState) => {
		const {signhash} = getState().user;
		HairpinDB.getDesigns((designTotalList) => {
			dispatch(getDesign(designTotalList));
		}, signhash, limit, offset);
	}
}

export function pushDesign(design){
	return {type: types.PUSHDESIGN, design};
}

export function saveDesign(designinfo, callback) {
	return async (dispatch, getState) => {
		const {signhash} = getState().user;
		const originalPath = `${RNFS.PlatformDependPath}/_original_/${signhash}_${designinfo.designHash}`;
		
		const resizeBatch = (sideCase, cb) => {
			const side = sideCase.charAt(0).toUpperCase() + sideCase.slice(1)
			ImageResizer.createResizedImage(designinfo[`design${side}Image`].uri.replace('file://', ''), 400, 800, 'JPEG', 100, 0,
				RNFS.PlatformDependPath + '/_original_/'
			).then(({uri}) => {
				const renamed = `${originalPath}_CROP_${side.toUpperCase()}.scalb`;
				RNFS.moveFile( uri.replace('file://', ''), renamed).then(() => {
					RNFS.unlink(designinfo[`design${side}Image`].uri.replace('file://', '')).catch(()=>{});
				});
			}).catch((err) => console.log(err));
			ImageResizer.createResizedImage(designinfo[`design${side}ImageSrc`].uri.replace('file://', ''), 800, 800, 'JPEG', 100, 0,
				RNFS.PlatformDependPath + '/_original_/'
			).then(({uri}) => {
				const renamed = `${originalPath}_SRC_${side.toUpperCase()}.scalb`;
				RNFS.moveFile( uri.replace('file://', ''), renamed).then(() => {});
			}).catch((err) => console.log(err));
			cb();
		}

		const makeThumb = (cb)=> {
			RNFS.moveFile(designinfo.designMergedImage.replace('file://', ''), `${originalPath}.scalb`).then(() => {
				ImageResizer.createResizedImage(`${originalPath}.scalb`, 100, 100, 'JPEG', 100, 0).then(({uri}) => {
					const renamed = `${RNFS.PlatformDependPath}/_thumb_/${signhash}_${designinfo.designHash}.scalb`;
					RNFS.moveFile(uri.replace('file://', ''), renamed).then(() => cb());
				}).catch((err) => console.log(err));
			});
		}

		HairpinDB.insertDesign(	signhash, designinfo.designHash, designinfo.designRegdate,
								designinfo.designTitle, designinfo.designRecipe, designinfo.designComment);
		HairpinDB.insertTag(designinfo.designTag, designinfo.designHash, designinfo.signhash);
		
		resizeBatch('left',() => resizeBatch('right', () => makeThumb(()=>{
			callback(`${RNFS.PlatformDependPath}/_thumb_/${signhash}_${designinfo.designHash}.scalb`);
			dispatch(pushDesign({
				signhash,
				photohash: designinfo.designHash,
				reg_date: designinfo.designRegdate,
				title: designinfo.designTitle,
				recipe: designinfo.designRecipe,
				comment: designinfo.designComment,
				uploaded: 0
			}));
		})))
	}
}

export function uploadDesign(designinfo, callback) {
	return async (dispatch) => {
		console.log(designinfo);
	}
}