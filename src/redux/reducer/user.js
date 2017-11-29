import Immutable from 'seamless-immutable';

import * as types from '../actionType/user';

const initialState = Immutable({
	token: '',
	_id: '',
	email: '',
	signhash: '',
	name: '',
	recipesize: 0,
	followersize: 0,
	followingsize: 0
});

export default function user(state = initialState, action = {}) {
	switch (action.type) {
		case types.LOGGEDIN :
			return Object.assign({}, state, {
				...action.user
			});
		case types.LOGGEDOUT :
			return Object.assign({}, state, {
				token: '',
				_id: '',
				email: '',
				signhash: '',
				name: '',
				recipesize: 0,
				followersize: 0,
				followingsize: 0
			});
		case types.USERUPDATE :
			return Object.assign({}, state, action.userstat);
		default:
			return state;
	}
}
