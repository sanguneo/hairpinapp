import { StackNavigator, DrawerNavigator } from 'react-navigation';
import CardStackStyleInterpolator from 'react-navigation/src/views/CardStack/CardStackStyleInterpolator';

import Drawer from './containers/Drawer';
import MainTotal from './containers/MainTotal';
import Login from './containers/Login';


const StackNavigation = StackNavigator({
	Main	:	{ screen: MainTotal		},
	Login	:	{ screen: Login 		},
	Test	:	{ screen: MainTotal 	},
}, {
	cardStyle: { backgroundColor: '#fff'},
	transitionConfig: () => ({ screenInterpolator: CardStackStyleInterpolator.forHorizontal }),
	headerMode: 'screen',
	navigationOptions: ({ navigation }) => ({
		headerStyle: { backgroundColor: '#36384C'},
		headerTitleStyle: { alignSelf: 'center', color: '#fff', fontWeight: 'normal' },
		headerTintColor: '#fff',
	}),
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
