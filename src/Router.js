import { StackNavigator, DrawerNavigator } from 'react-navigation';

import Drawer from './containers/Drawer';
import MainScreen from './containers/MainScreen';

const StackNavigation = StackNavigator({
	Main: { screen: MainScreen },
	Test: { screen: MainScreen },
}, {
	cardStyle: { backgroundColor: '#fff'},
	transitionConfig : () => ({transitionSpec:{duration: 0}}),
	headerMode: 'screen',
	navigationOptions: {
		headerTitleStyle: { color: '#fff', fontWeight: 'normal' },
		headerStyle: { backgroundColor: '#36384C'},
	},
});

const BaseNavigation = DrawerNavigator({
	Main: {
		screen: StackNavigation
	},
}, {
	contentComponent: Drawer,
	drawerWidth: 200,
	contentOptions: {
		style: {
			marginTop: 24
		}
	}
});


export default BaseNavigation;
