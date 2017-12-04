import React from 'react';
import {View} from 'react-native';

import ImageViewer from 'react-native-image-zoom-viewer';

export default class ImgSourceViewScreen extends React.Component {
	static navigationOptions = ({ navigation }) => ({
		headerTitle: navigation.state.params.screentitle,
		headerRight: (
			<View style={{width: 32, height: 32, marginHorizontal: 8}}/>
		),
	})

	render() {
		return <ImageViewer imageUrls={[{url: this.props.navigation.state.params.image}]}/>;
	}
}