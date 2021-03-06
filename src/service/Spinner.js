export default (spinnerType='rotatingPlane', spinnerSize=40, spinnerColor='#FFFFFF') => {
	return 	'<!DOCTYPE html>' +
			'<html lang="en">' +
			'<head>' +
			'	<meta charset="UTF-8">' +
			'	<title>' + spinnerType + '</title>' +
			'	<style>' +
			'		html,body{width: 100%, height: 100%;position: relative;}' +
			'		.spinner {' +
			'			width:' + spinnerSize + 'px;' +
			'			height:' + spinnerSize + 'px;' +
			'			background-color: ' + spinnerColor + ';' +
			'			position: relative;' +
			'			left: calc(50% - '+ (spinnerSize/2) + 'px);' +
			'			top: calc(50% - '+ (spinnerSize/2) + 'px);' +
			'		}' +
			'		.rotatingPlane {' +
			'			-webkit-animation: sk-rotateplane 1.2s infinite ease-in-out;' +
			'			animation: sk-rotateplane 1.2s infinite ease-in-out;' +
			'		}' +
			'' +
			'		@-webkit-keyframes sk-rotateplane {' +
			'			0% { -webkit-transform: perspective(120px) }' +
			'			50% { -webkit-transform: perspective(120px) rotateY(180deg) }' +
			'			100% { -webkit-transform: perspective(120px) rotateY(180deg) rotateX(180deg) }' +
			'		}' +
			'' +
			'		@keyframes sk-rotateplane {' +
			'			0% {' +
			'				transform: perspective(120px) rotateX(0deg) rotateY(0deg);' +
			'				-webkit-transform: perspective(120px) rotateX(0deg) rotateY(0deg)' +
			'			}' +
			'			50% {' +
			'				transform: perspective(120px) rotateX(-180.1deg) rotateY(0deg);' +
			'				-webkit-transform: perspective(120px) rotateX(-180.1deg) rotateY(0deg)' +
			'			}' +
			'			100% {' +
			'				transform: perspective(120px) rotateX(-180deg) rotateY(-179.9deg);' +
			'				-webkit-transform: perspective(120px) rotateX(-180deg) rotateY(-179.9deg);' +
			'			}' +
			'		}' +
			'	</style>' +
			'</head>' +
			'<body>' +
			'	<div class="spinner '+spinnerType+'"></div>' +
			'</body>' +
			'</html>';
}