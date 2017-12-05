'use strict';
import {Platform} from 'react-native';
const RNFS = require('react-native-fs');
RNFS.PlatformDependPath = (Platform.OS === 'ios') ? RNFS.DocumentDirectoryPath : RNFS.DocumentDirectoryPath;
// module.exports = RNFS;

export default RNFS;