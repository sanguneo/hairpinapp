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

export function getDesignsByTag(designTagList){
	return {type: types.DESIGNUPDATEBYTAG, designTagList};
}

export function getOneDesign(revealedDesign) {
	return {type: types.GETONEDESIGN, revealedDesign};
}

export function getTagnames(designTagnameList) {
	return {type: types.REFRESHTAGS, designTagnameList};
}

export function getDesignsAsync(limit=false, offset=false) {
	return async (dispatch, getState) => {
		const {signhash} = getState().user;
		HairpinDB.getDesigns((designTotalList) => {
			dispatch(getDesigns(designTotalList));
		}, signhash, limit, offset);
	}
}

export function getDesignsByTagAsync(tagname, limit=false, offset=false) {
	return async (dispatch, getState) => {
		const {signhash} = getState().user;
		HairpinDB.getDesignsByTag((designTagList) => {
			dispatch(getDesignsByTag(designTagList));
		}, signhash, tagname, limit, offset);
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
				designUploaded: oneDesign.uploaded
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
		HairpinDB.insertTag(signhash, designinfo.designHash, designinfo.designTag);
		
		resizeBatch('left',() => resizeBatch('right', () => makeThumb(()=>{
			callback(`${RNFS.PlatformDependPath}/_thumb_/${signhash}_${designinfo.designHash}.scalb`);
			dispatch(pushDesign({
				signhash,
				photohash: designinfo.designHash,
				reg_date: designinfo.designRegdate,
				title: designinfo.designTitle,
				design: designinfo.designRecipe,
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
					RNFS.moveFile(uri.replace('file://', ''), renamed);
				}).catch((err) => console.log(err));
			});
			cb();
		}
		HairpinDB.updateDesign(	signhash, designinfo.designHash,
								designinfo.designTitle, designinfo.designRecipe, designinfo.designComment);
		HairpinDB.insertTag( signhash, designinfo.designHash,
			designinfo.designTag);

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

		Alert.alert(null,'삭제하면 복구할 수 없습니다.\n그래도 삭제하시겠습니까?\n',
			[{text: '확인', onPress: () => {doDelete()}}, {text: '취소'}]);
	}
}

export function uploadDesign(uploadedType=1, errorcallback=(()=>{})) {
	return async (dispatch, getState) => {
		const {token, signhash} = getState().user;
		const {
			designHash,
			designRegdate,
			designLeftImageSrc,
			designRightImageSrc,
			designTitle,
			designTag,
			designRecipe,
			designComment,
			designUploaded
		} = getState().designs.revealedDesign;

		let formdata = new FormData();
		const appendTo = (formdata, uri, name, part) => formdata.append('designimage', { uri: uri.split('?')[0], name: `${name}_${part}.scalb`, type: 'image/jpeg'});
		appendTo(formdata, designLeftImageSrc.uri, `${signhash}_${designHash}`,`SRC_LEFT`);
		appendTo(formdata, designRightImageSrc.uri, `${signhash}_${designHash}`,`SRC_RIGHT`);
		appendTo(formdata, `file://${originalDirPath}${signhash}_${designHash}.scalb`, `${signhash}_${designHash}`,`ORG`);
		appendTo(formdata, `file://${RNFS.PlatformDependPath}/_thumb_/${signhash}_${designHash}.scalb`, `${signhash}_${designHash}`,`THUMB`);

		formdata.append('designHash', designHash);
		formdata.append('designRegdate', designRegdate);
		formdata.append('designTitle', designTitle);
		formdata.append('designTag', JSON.stringify(designTag));
		formdata.append('designRecipe', designRecipe);
		formdata.append('designComment', designComment);
		formdata.append('uploadedType', uploadedType);

		axios.post(
			`https://${hairpinserver}/design/upload`,
			formdata,
			{
				headers: {
					Accept: 'application/json',
					'Content-Type': 'multipart/form-data',
					nekotnipriah: token
				}
			}
		).then((response) => {
			console.log(response.data);
			if (response.data.message === 'success') {
				HairpinDB.uploadDesign(	signhash, designHash, uploadedType);
			} else {
			}
		}).catch(e => {console.log('error', e);errorcallback();});
	}
}

export function getTagnamesAsync() {
	return async (dispatch, getState) => {
		const {signhash} = getState().user;
		HairpinDB.getTagnames((designTagnameList)=> {
			dispatch(getTagnames(designTagnameList));
		}, signhash);
	}
}

