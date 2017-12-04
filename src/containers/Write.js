import React, { Component } from 'react';
import { View, ScrollView, Text, Image, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import { captureRef } from "react-native-view-shot";
import Crypt from '../utils/Crypt';

import {connect} from 'react-redux';
import * as designActions from '../redux/action/designs';


import FormWrapper from '../components/FormWrapper';
import LabeledInput from '../components/LabeledInput';
import LabeledTagInput from '../components/LabeledTagInput';
import Button from '../components/Button';
import Hr from '../components/Hr';

import pickphoto from '../assets/img/pickphoto.png';
import AutoGrowingTextInput from "../components/AutoGrowingTextInput";

const ImgOpt = {
	width: 400,
	height: 400,
	cropping: true
}

class Write extends Component {
	static navigationOptions = ({ navigation }) => ({
		headerTitle: '디자인 작성하기',
		headerTitleStyle :{alignSelf: 'center', color: '#fff', fontWeight: 'normal'},
		headerRight: (
			<View style={{width: 32, height: 32, marginHorizontal: 8}}/>
		),
	})

	constructor(props) {
		super(props);
		this.state = {
			designHash: null,
			designRegdate: null,
			designLeftImage: pickphoto,
			designLeftImageSrc: null,
			designRightImage: pickphoto,
			designRightImageSrc: null,
			designTitle: '',
			designTag: [],
			designRecipe: '',
			designComment: '',
		}
		this.scrollYPos = 0;
	}

	_whereLine(event) {
		this.scrollYPos = event.nativeEvent.contentOffset.y;
	}

	handleInputChange(label, event) {
		this.setState({[label]: event.nativeEvent.text});
	}

	getDesignhash() {
		const designRegdate = Date.now();
		const designHash = new Crypt().getAntCode(designRegdate);
		this.setState({designRegdate, designHash});
		return designHash;
	}

	setDesignImage(side) {
		if(!side || side === '' || !['left', 'right'].includes(side)) return;
		const sideCase = side.charAt(0).toUpperCase() + side.slice(1);
		ImagePicker.openPicker({
			width: 200,
			height: 400,
			cropping: true
		}).then(img => this.setState({
			[`design${sideCase}Image`]: {uri: img.path},
			[`design${sideCase}ImageSrc`]: {uri: img.sourceURL}
		})).catch(e => (e.code !== 'E_PICKER_CANCELLED') && console.log(e));
	}

	formCheck() {
		if (!this.state.designLeftImage.uri) {
			Alert.alert('왼쪽 이미지를 선택해주세요.');
			return false;
		} else if (!this.state.designRightImage.uri) {
			Alert.alert('오른쪽 이미지를 선택해주세요.');
			return false;
		}
		return true;
	}

	combineImage(callback) {
		captureRef(this.imgView, {
			format: "jpg",
			quality: 1
		}).then(
			uri => callback(uri),
			error => console.error("image mergeFailed", error)
		);
	}

	submit() {
		if (!this.formCheck()) return;
		this.getDesignhash();
		this.combineImage((designMergedImage) => {
			this.props.dispatch(designActions.saveDesign({ designMergedImage,...this.state},
				() => this.props.navigation.goBack(null)
			));
		});
	}

	render() {
		return (
			<View style={styles.wrapper}>
				<ScrollView style={styles.container} ref={ref=> this.ScrollView = ref} onScroll={event => this._whereLine(event)}  keyboardShouldPersistTaps='handled'>
					<View style={styles.imgView} ref={ref=> this.imgView = ref} collapsable={false}>
						<TouchableOpacity onPress={()=> {this.setDesignImage('left')}}>
							<Image source={this.state.designLeftImage} style={styles.img} />
						</TouchableOpacity>
						<TouchableOpacity onPress={()=> {this.setDesignImage('right')}}>
							<Image source={this.state.designRightImage} style={styles.img} />
						</TouchableOpacity>
					</View>
					<Text style={styles.formLabel}>기본정보</Text>
					<FormWrapper style={{flex: 1, marginHorizontal: 10}}>
						<LabeledInput label="제목" placeholder="제목을 입력하세요"
									  value={this.state.designTitle}
									  onChange={(e) => this.handleInputChange('designTitle', e)} />
						<Hr lineColor="#878787" />
						<LabeledTagInput label="테그" placeholder="테그를 입력하세요"
										 onChange={(designTag)=>{this.setState({designTag})}}
										 value={this.state.designTag} />
					</FormWrapper>
					<Text style={styles.formLabel}>레시피</Text>
					<FormWrapper style={{flex: 1, marginHorizontal: 10}}>
						<AutoGrowingTextInput
							contentLineFunc = {(e)=> {this._whereLine(e);}}
							onChangeText={(designRecipe) => {this.setState({designRecipe})}}
							measureBottom={(e)=> this.ScrollView.scrollTo({y: this.scrollYPos + e})}
							value={this.state.designRecipe}
							placeholder={'레시피'}
							blurOnSubmit={false}
						/>
					</FormWrapper>
					<Text style={styles.formLabel}>코멘트</Text>
					<FormWrapper style={{flex: 1, marginHorizontal: 10}}>
						<AutoGrowingTextInput
							contentLineFunc = {(e)=> {this._whereLine(e);}}
							onChangeText={(designComment) => {this.setState({designComment})}}
							measureBottom={(e)=> this.ScrollView.scrollTo({y: this.scrollYPos + e})}
							value={this.state.designComment}
							placeholder={'코멘트'}
							blurOnSubmit={false}
						/>
					</FormWrapper>
					<View style={styles.btns}>
						<Button label="작성하기" onPress={()=> {this.submit()}} buttonColor="#3692d9" style={{flex: 1, marginHorizontal: 10}}/>
					</View>
				</ScrollView>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	wrapper: {
		flex: 1,
	},
	container: {
		flex: 1,
	},
	formLabel: {
		flex: 1,
		marginTop: 20,
		marginBottom: 10,
		marginHorizontal: 30,

		fontSize: 18,
		fontWeight: 'bold',
		textAlign: 'left',
		textAlignVertical: 'center'
	},
	img: {
		width: 200,
		height: 400,
		borderColor: '#eee',
		borderWidth: 1
	},
	imgView: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'center',
		height: 400,
		alignItems: 'center',
		marginVertical: 20,
	},
	btns: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 20,
		marginBottom: 20
	}
});


function mapStateToProps(state) {
	return {
		user: state.user,
		app: state.app
	};
}

export default connect(mapStateToProps)(Write);


