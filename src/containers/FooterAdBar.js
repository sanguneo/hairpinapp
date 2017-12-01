/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import { View, Image, TouchableWithoutFeedback, Keyboard } from 'react-native';
import AdBar from "../components/AdBar";

import close from "../assets/img/icon/close.png"

class FooterAdBar extends React.Component {
	state = { show: false }

	componentWillMount() {
		this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', ()=> {this.setState({show: false})});
		this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', ()=> {this.setState({show: true})});
	}
	componentWillUnmount () {
		this.keyboardDidShowListener.remove();
		this.keyboardDidHideListener.remove();
	}

	show() {
		this.setState({show: true});
	}
	hide() {
		this.setState({show: false}, ()=> {
			setTimeout(() => {
				this.show();
			}, 60000)
		});
	}

	render() {
		return (this.state.show
			? <View>
				<AdBar />
				<TouchableWithoutFeedback onPress={()=> {this.hide()}}>
					<View style={{position: 'absolute', right: 0,
						borderColor: 'lightgray', borderLeftWidth: 1,borderBottomWidth: 1, backgroundColor: 'white', opacity: 0.85}}>
						<Image source={close} style={{width: 20, height: 20}} />
					</View>
				</TouchableWithoutFeedback>
			  </View>
			: null);
	}
}
export default FooterAdBar;


