import { StackNavigator, DrawerNavigator, TabNavigator} from 'react-navigation';
import CardStackStyleInterpolator from 'react-navigation/src/views/CardStack/CardStackStyleInterpolator';

import Drawer from './containers/Drawer';
import MainTotal from './containers/MainTotal';
import Login from './containers/Login';
import Join from './containers/Join';

import FooterAdBar from "./containers/FooterAdBar";

const StackNavigation = StackNavigator({
	Main	:	{ screen: MainTotal		},
	Login	:	{ screen: Login 		},
	Join	:	{ screen: Join 			},
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

const TabNavigation = TabNavigator({
	Main: {
		screen: StackNavigation
	},
}, {
	tabBarComponent : FooterAdBar,
	tabBarPosition: 'bottom',
	animationEnabled: true
});

const BaseNavigation = DrawerNavigator({
	Main: {
		screen: TabNavigation
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
