import { combineReducers } from 'redux';
import BaseNavigation from '../../Router';
import user from './user';
import design from './design';


export default combineReducers({
	navigation: (state, action) => BaseNavigation.router.getStateForAction(action, state),
	state: (state = {}) => state,
	user,
	design
});