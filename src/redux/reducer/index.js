import { combineReducers } from 'redux';
import BaseNavigation from '../../Router';
import user from './user';
import designs from './designs';


export default combineReducers({
	navigation: (state, action) => BaseNavigation.router.getStateForAction(action, state),
	state: (state = {}) => state,
	user,
	designs
});