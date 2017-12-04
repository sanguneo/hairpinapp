import Immutable from 'seamless-immutable';

import * as types from '../actionType/designs';

const initialState = Immutable({
	refresh: '',
	designTotalList: []
});

export default function design(state = initialState, action = {}) {
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
		default:
			return state;
	}
}
