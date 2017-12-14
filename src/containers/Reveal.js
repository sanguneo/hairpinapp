import React, { Component } from 'react';
import { View, ScrollView, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';

import {connect} from 'react-redux';
import * as designActions from '../redux/action/designs';

import FormWrapper from '../components/FormWrapper';
import LabeledInput from '../components/LabeledInput';
import LabeledTagInput from '../components/LabeledTagInput';
import Button from '../components/Button';
import Lightbox from '../components/Lightbox';
import Loading from '../components/Loading';
import Hr from '../components/Hr';

import recipe from '../assets/img/icon/recipe.png';
import comment from '../assets/img/icon/comment.png';
import cut from '../assets/img/icon/cut.png';
import remove from '../assets/img/icon/remove.png';
import earth from '../assets/img/icon/earth.png';
import follower from '../assets/img/icon/follower.png';
import privates from '../assets/img/icon/private.png';
import upload from '../assets/img/icon/upload.png';

const uploadIcons = [upload, privates, null, follower, null, null, null, earth];

class Reveal extends Component {
	static navigationOptions = ({ navigation }) => ({
		headerTitle: navigation.state.params.screentitle,
		headerTitleStyle :{alignSelf: 'center', color: '#fff', fontWeight: 'normal'},
		headerRight: (
			<TouchableOpacity onPress={()=>navigation.state.params.dispatch(designActions.deleteDesign(() => navigation.goBack(null)))}>
				<Image style={{width: 28, height: 28, marginHorizontal: 10, tintColor: 'white'}} source={remove}/>
			</TouchableOpacity>
		),
	})

	constructor(props) {
		super(props);
		this.state = {
			designHash: null,
			designRegdate: null,
			designLeftImage: null,
			designLeftImageSrc: null,
			designRightImage: null,
			designRightImageSrc: null,
			designTitle: '',
			designTag: [],
			designRecipe: '',
			designComment: ''
		}
	}

	getDesignSourceImage(side) {
		if(!side || side === '' || !['left', 'right'].includes(side)) return;
		const sideCase = side.charAt(0).toUpperCase() + side.slice(1);
		this.props.navigation.navigate('ImgSourceView', {image: this.props.designs.revealedDesign[`design${sideCase}ImageSrc`].uri, screentitle: (side==='left' ? 'Before' : 'After')});
	}

	componentWillMount() {
		const {designHash} = this.props.navigation.state.params;
		this.props.dispatch(designActions.getOneDesignAsync(designHash));
	}


	edit() {
		this.props.navigation.navigate('Edit', {
			screentitle: this.props.navigation.state.params.screentitle
		});
	}

	goTag(tagname) {
		this.props.navigation.navigate('TagList', {tagname})
	}

	upload() {
		const fDispatchUploadDesign = (type)=> {
			this.loadR.show(); this.props.dispatch(designActions.uploadDesign(type,() => this.loadR.hide(), (e) => this.loadR.updateProg(e)))
		}
		const alertShow = () => Alert.alert('업로드 공개유형을 선택하세요','디자인을 게시하고 공유하세요!\n취소하려면 창 바깥쪽을 터치하세요.',
			[	{text: '비공개',    onPress:()=>{fDispatchUploadDesign(1);}},
				{text: '팔로잉',    onPress:()=>{fDispatchUploadDesign(3);}},
				{text: '전체공개',  onPress:()=>{fDispatchUploadDesign(7);}}]);

		if (this.props.designs.revealedDesign.designUploaded !== 0)
			Alert.alert('이미 게시 되어있습니다','공개유형을 변경하시겠습니까?', [ {text: '확인', onPress: alertShow}, {text: '취소'}]);
		else alertShow();
	}

	openLightbox(referenceCase) {
		this[referenceCase]._open();
	}

	render() {
		let uploadIcon = uploadIcons[this.props.designs.revealedDesign.designUploaded];
		return (
			<View style={styles.wrapper}>
				<ScrollView style={styles.container} >
					<View style={styles.imgView} ref={ref=> this.imgView = ref} collapsable={false}>
						<TouchableOpacity onPress={()=> {this.getDesignSourceImage('left')}}>
							<Image source={this.props.designs.revealedDesign.designLeftImage} style={styles.img} />
						</TouchableOpacity>
						<TouchableOpacity onPress={()=> {this.getDesignSourceImage('right')}}>
							<Image source={this.props.designs.revealedDesign.designRightImage} style={styles.img} />
						</TouchableOpacity>
					</View>
					<View style={styles.imgLabels}>
						<Text style={[styles.imgLabel, {color: '#E3302D', borderLeftWidth: 1, borderRightWidth: 0.5}]}>Before</Text>
						<Text style={[styles.imgLabel, {color: '#3A8ECF', borderLeftWidth: 0.5, borderRightWidth: 1}]}>After</Text>
					</View>
					<Text style={styles.formLabel}>기본정보</Text>
					<FormWrapper style={{flex: 1, marginHorizontal: 10}}>
						<LabeledInput label="제목" placeholder="제목없음"readOnly={true}
									  value={this.props.designs.revealedDesign.designTitle} />
						<Hr lineColor="#878787" />
						<LabeledTagInput label="테그" placeholder="테그없음" readOnly={true}
										 onPressTag={(tagname)=>this.goTag(tagname)}
										 value={this.props.designs.revealedDesign.designTag}/>
					</FormWrapper>
					<View style={styles.btns}>{this.props.designs.revealedDesign.designRecipe ?
						<Button label="레시피" onPress={()=> this.openLightbox('design')}
								buttonColor="#ff412b" source={recipe} style={{flex: 1, marginLeft: 10, marginRight: this.props.designs.revealedDesign.designComment ? 5 : 10}}/>
						: null}{this.props.designs.revealedDesign.designComment ?
						<Button label="코멘트" onPress={()=> this.openLightbox('comment')}
								buttonColor="#3692d9" source={comment} style={{flex: 1, marginLeft: this.props.designs.revealedDesign.designRecipe ? 5 : 10, marginRight: 10}}/>: null}
					</View>
					<View style={[styles.btns, {marginBottom: 20}]}>
						<Button label="수정하기" onPress={()=> this.edit()}
								buttonColor="#bd6592" source={cut} style={{flex: 1, marginLeft: 10, marginRight: 5}}/>
						<Button onPress={()=> this.upload()}
								buttonColor="#60BF30" source={uploadIcon} style={{width: 40, marginLeft: 5, marginRight: 10}}/>
					</View>
				</ScrollView>
				<Loading  ref={ref => this.loadR = ref}/>
				<Lightbox title={'레시피'} ref={ref => this.design = ref}>
					<View style={{ paddingHorizontal: 10, paddingBottom: 10 }}>
						<Text style={{paddingTop: 10, paddingBottom: 5, fontSize: 16}}>
							{this.props.designs.revealedDesign.designRecipe === '' ? '레시피없음' : this.props.designs.revealedDesign.designRecipe}
						</Text>
					</View>
				</Lightbox>
				<Lightbox title={'코멘트'} ref={ref => this.comment = ref}>
					<View style={{ paddingHorizontal: 10, paddingBottom: 10 }}>
						<Text style={{paddingTop: 10, paddingBottom: 5, fontSize: 16}}>
							{this.props.designs.revealedDesign.designComment === '' ? '레시피없음' : this.props.designs.revealedDesign.designComment}
						</Text>
					</View>
				</Lightbox>
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
		height: 400
	},
	imgView: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'center',
		height: 400,
		alignItems: 'center',
		marginTop: 20,
	},
	imgLabels: {
		flex: 1,
		flexDirection: 'row',
		height: 40,
		marginBottom: 20,
		justifyContent: 'center'
	},
	imgLabel: {
		width: 200,
		fontSize: 20,
		fontWeight: 'bold',
		textAlign: 'center',
		textAlignVertical: 'center',
		borderBottomWidth: 1,
		borderColor: '#eee'
	},
	btns: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 10
	}
});


function mapStateToProps(state) {
	return {
		designs: state.designs,
		user: state.user,
		app: state.app
	};
}

export default connect(mapStateToProps)(Reveal);


