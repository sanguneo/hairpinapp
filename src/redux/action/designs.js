import axios from 'axios';
import {Alert} from 'react-native';

import ImageResizer from 'react-native-image-resizer';
import RNFS from '../../service/RNFS_wrapper';
import HairpinDB from '../../service/HairpinDB'

import * as types from '../actionType/designs';
import {hairpinserver} from '../../config/env.json';

const originalDirPath = `${RNFS.PlatformDependPath}/_original_/`;

export function refresh(refreshkey=Date.now()){
	return {type: types.DESIGNREFRESH, refresh: refreshkey};
}
export function setPhoto(photoObj){
	return {type: types.SETPHOTO, photoObj};
}

export function pushDesign(design){
	return {type: types.PUSHDESIGN, design};
}

export function getDesigns(designTotalList){
	return {type: types.DESIGNLISTUPDATE, designTotalList};
}

export function getOneDesign(revealedDesign) {
	return {type: types.GETONEDESIGN, revealedDesign};
}

export function getDesignsAsync(limit=false, offset=false) {
	return async (dispatch, getState) => {
		const {signhash} = getState().user;
		HairpinDB.getDesigns((designTotalList) => {
			dispatch(getDesigns(designTotalList));
		}, signhash, limit, offset);
	}
}

export function getOneDesignAsync(designHash) {
	if (!designHash || designHash === '') return;
	return async (dispatch, getState) => {
		const refresh = Date.now();
		const {signhash} = getState().user;
		const originalPath = `${originalDirPath}${signhash}_${designHash}`;
		HairpinDB.getOneDesign((oneDesign, oneDesignTag) => {
			dispatch(getOneDesign({
				designHash,
				designLeftImage: {uri: `file://${originalPath}_CROP_LEFT.scalb?refresh=${refresh}`},
				designLeftImageSrc: {uri: `file://${originalPath}_SRC_LEFT.scalb?refresh=${refresh}`},
				designRightImage: {uri: `file://${originalPath}_CROP_RIGHT.scalb?refresh=${refresh}`},
				designRightImageSrc: {uri: `file://${originalPath}_SRC_RIGHT.scalb?refresh=${refresh}`},
				designRegdate: oneDesign.reg_date,
				designTitle: oneDesign.title,
				designTag: oneDesignTag,
				designRecipe: oneDesign.recipe,
				designComment: oneDesign.comment,
			}));
		}, designHash, signhash);
	}
}

export function saveDesign(designinfo, callback) {
	return async (dispatch, getState) => {
		const {signhash} = getState().user;
		const originalPath = `${originalDirPath}${signhash}_${designinfo.designHash}`;
		
		const resizeBatch = (sideCase, cb) => {
			const side = sideCase.charAt(0).toUpperCase() + sideCase.slice(1);
			ImageResizer.createResizedImage(designinfo[`design${side}Image`].uri.replace('file://', ''), 400, 800, 'JPEG', 100, 0, originalDirPath
			).then(({uri}) => {
				const renamed = `${originalPath}_CROP_${side.toUpperCase()}.scalb`;
				RNFS.moveFile( uri.replace('file://', ''), renamed).then(() => {
					RNFS.unlink(designinfo[`design${side}Image`].uri.replace('file://', '')).catch(()=>{});
				});
			}).catch((err) => console.log(err));
			ImageResizer.createResizedImage(designinfo[`design${side}ImageSrc`].uri.replace('file://', ''), 800, 800, 'JPEG', 100, 0, originalDirPath
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
		HairpinDB.insertTag(designinfo.signhash, designinfo.designHash, designinfo.designTag);
		
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

export function resaveDesign(designinfo, callback) {
	return async (dispatch, getState) => {
		const {signhash} = getState().user;
		const originalPath = `${originalDirPath}${signhash}_${designinfo.designHash}`;

		const resizeBatch = (sideCase, cb) => {
			const side = sideCase.charAt(0).toUpperCase() + sideCase.slice(1);
			ImageResizer.createResizedImage(designinfo[`design${side}Image`].uri.replace('file://', ''), 400, 800, 'JPEG', 100, 0, originalDirPath
			).then(({uri}) => {
				const renamed = `${originalPath}_CROP_${side.toUpperCase()}.scalb`;
				RNFS.moveFile( uri.replace('file://', ''), renamed).then(() => {
					RNFS.unlink(designinfo[`design${side}Image`].uri.replace('file://', '')).catch((e)=>console.log(e));
				});
			}).catch((err) => console.log(err));
			ImageResizer.createResizedImage(designinfo[`design${side}ImageSrc`].uri.replace('file://', ''), 800, 800, 'JPEG', 100, 0, originalDirPath
			).then(({uri}) => {
				const renamed = `${originalPath}_SRC_${side.toUpperCase()}.scalb`;
				RNFS.moveFile( uri.replace('file://', ''), renamed).then(() => {});
			}).catch((err) => console.log(err));
			cb();
		};

		const makeThumb = (cb)=> {
			RNFS.moveFile(designinfo.designMergedImage.replace('file://', ''), `${originalPath}.scalb`).then(() => {
				ImageResizer.createResizedImage(`${originalPath}.scalb`, 100, 100, 'JPEG', 100, 0).then(({uri}) => {
					const renamed = `${RNFS.PlatformDependPath}/_thumb_/${signhash}_${designinfo.designHash}.scalb`;
					RNFS.moveFile(uri.replace('file://', ''), renamed).then(() => cb());
				}).catch((err) => console.log(err));
			});
		}
		HairpinDB.updateDesign(	signhash, designinfo.designHash,
								designinfo.designTitle, designinfo.designRecipe, designinfo.designComment);
		HairpinDB.insertTag(designinfo.signhash, designinfo.designHash, designinfo.designTag);

		resizeBatch('left',() => resizeBatch('right', () => makeThumb(()=>{
			callback(`${RNFS.PlatformDependPath}/_thumb_/${signhash}_${designinfo.designHash}.scalb`);
			dispatch(refresh());
			dispatch(getOneDesignAsync(designinfo.designHash));
			dispatch(getDesignsAsync());
		})))
	}
}

export function deleteDesign(callback=(()=>{})) {
	return async (dispatch, getState) => {
		const {signhash} = getState().user;
		const {designHash} = getState().designs.revealedDesign;
		const originalPath = `${originalDirPath}${signhash}_${designHash}`;

		const deleteBatch = (sideCase, cb) => {
			const side = sideCase.charAt(0).toUpperCase() + sideCase.slice(1);
			RNFS.unlink(`${originalPath}_CROP_${side.toUpperCase()}.scalb`).catch((e)=>console.log(e));
			RNFS.unlink(`${originalPath}_SRC_${side.toUpperCase()}.scalb`).catch((e)=>console.log(e));
			cb();
		}

		const deleteThumb = (cb)=> {
			RNFS.unlink(`${RNFS.PlatformDependPath}/_thumb_/${signhash}_${designHash}.scalb`).catch((e)=>console.log(e));
			cb();
		}
		const doDelete = ()=> {
			HairpinDB.deleteDesign(signhash, designHash);
			deleteBatch('left', () => deleteBatch('right', () => deleteThumb(() => {
				dispatch(refresh());
				dispatch(getDesignsAsync());
			})));
			callback();
		}

		Alert.alert('','삭제하면 복구할 수 없습니다.\n그래도 삭제하시겠습니까?\n',
			[{text: '확인', onPress: () => {doDelete()}}, {text: '취소'}]);
	}
}

export function uploadDesign(designinfo, callback) {
	return async (dispatch) => {
		console.log(designinfo);
	}
}