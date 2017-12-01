import Immutable from 'seamless-immutable';

import * as types from '../actionType/design';

const initialState = Immutable({
	refresh: '',
});

export default function design(state = initialState, action = {}) {
	switch (action.type) {
		case types.DESIGNREFRESH :
			return Object.assign({}, state, {
				refresh: action.refresh
			});
		default:
			return state;
	}
}
