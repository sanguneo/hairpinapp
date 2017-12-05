import { StackNavigator, DrawerNavigator, TabNavigator} from 'react-navigation';
import CardStackStyleInterpolator from 'react-navigation/src/views/CardStack/CardStackStyleInterpolator';

// Components
import Drawer from './containers/Drawer';
import Login from './containers/Login';
import Join from './containers/Join';
import Modify from './containers/Modify';

import MainTotal from './containers/MainTotal';
import Tags from './containers/Tags';
import Write from './containers/Write';
import Edit from './containers/Edit';
import Reveal from './containers/Reveal';
import ImgSourceView from './containers/ImgSourceView';


// Advertise (Must located under other components)
import FooterAdBar from "./containers/FooterAdBar";


const StackNavigation = StackNavigator({
	Main			:	{ screen: MainTotal		},
	Total			:	{ screen: MainTotal 	},
	Tags			:	{ screen: Tags 			},
	Write			:	{ screen: Write 		},
	Edit			:	{ screen: Edit			},
	Reveal			:	{ screen: Reveal 		},
	ImgSourceView	:	{ screen: ImgSourceView	},

	Login			:	{ screen: Login 		},
	Join			:	{ screen: Join 			},
	Modify			:	{ screen: Modify 		},
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

// User defined footer added screen(navigation).
const FooterAdded = TabNavigator({Main:{screen:StackNavigation}},{tabBarComponent:FooterAdBar,tabBarPosition:"bottom"});

//
const BaseNavigation = DrawerNavigator({
	Main: { screen: FooterAdded }
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
