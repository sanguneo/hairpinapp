import Immutable from 'seamless-immutable';

import * as types from '../actionType/user';

const initialState = Immutable({
	status : false,
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
				status: true,
				...action.user
			});
		case types.LOGGEDOUT :
			return Object.assign({}, state, {
				status: false,
				token: '',
				_id: '',
				email: '',
				signhash: '',
				name: ''
			});
		case types.USERUPDATE :
			return Object.assign({}, state, action.userstat);
		default:
			return state;
	}
}
