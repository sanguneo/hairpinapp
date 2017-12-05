import Immutable from 'seamless-immutable';

import * as types from '../actionType/designs';

const initialState = Immutable({
	refresh: Date.now(),
	designTotalList: [],
	designTagList: [],
	revealedDesign: {
		designHash: null,
		designRegdate: null,
		designLeftImage: null,
		designLeftImageSrc: null,
		designRightImage: null,
		designRightImageSrc: null,
		designTitle: '',
		designTag: [],
		designRecipe: '',
		designComment: '',
		designUploaded: 0
	}
});

export default function designs(state = initialState, action = {}) {
	switch (action.type) {
		case types.DESIGNREFRESH :
			return Object.assign({}, state, {
				refresh: action.refresh
			});
		case types.DESIGNLISTUPDATE :
			return Object.assign({}, state, {
				designTotalList: action.designTotalList
			});
		case types.PUSHDESIGN :
			return Object.assign({}, state, {
				designTotalList: [action.design, ...state.designTotalList]
			});
		case types.GETONEDESIGN :
			return Object.assign({}, state, {
				revealedDesign: action.revealedDesign
			});
		case types.SETPHOTO :
			return Object.assign({}, state, {
				revealedDesign: Object.assign({}, state.revealedDesign, {
					...action.photoObj
				})
			});
		case types.REFRESHTAGS :
			return Object.assign({}, state, {
				designTagList: action.designTagList
			});
		default:
			return state;
	}
}
