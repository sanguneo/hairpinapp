'use strict';
const SQLiteLib = require('react-native-sqlite-storage');
class SQLiteClass {
	constructor() {
		this.db = SQLiteLib.openDatabase({name: 'consultAlbum.db', createFromLocation: 1});
	}

	getDB() {
		return this.db;
	}

	closeDB() {
		this.db.close();
	}

	executeQuery(query, callback, errCallback) {
		if(!query || query === '') {
			console.warn('no arguments');
			return;
		}
		this.db.transaction((tx) => {
			tx.executeSql(query,[], (tx, results) => {
				if(typeof callback == 'function') callback(results);
			}, (errCallback || console.error));
		})
	}

	insertDesign(signhash, photohash, regdate, title, recipe, comment) {
		let query = `INSERT INTO 'ca_photo'('signhash', 'photohash','reg_date','title','recipe','comment') ` +
			`VALUES ('${signhash}', '${photohash}','${regdate}','${title}','${recipe.replace('\n', '\\n')}','${comment.replace('\n', '\\n')}');`;
		this.executeQuery(query);
	}

	insertTag(i_tags, photohash, signhash) {
		let tagquery = `DELETE FROM 'ca_tag' WHERE 'photohash'='${photohash}' AND 'signhash'='${signhash}';`;
		let tagreturn = (tag) => `INSERT INTO 'ca_tag'('name','photohash','signhash') VALUES ('${tag}','${photohash}','${signhash}');`;
		// let tagnamereturn = (tag) => `INSERT INTO 'ca_tagname'('tagname') SELECT '${tag}' WHERE NOT EXISTS(SELECT 1 FROM 'ca_tagname' WHERE 'tagname' = '${tag}');`;

		this.executeQuery(tagquery);

		i_tags.forEach((tag) => {
			this.executeQuery(tagreturn(tag));
			// this.executeQuery(tagnamereturn(tag));
		});
	}

	selectTagname(callback) {
		this.executeQuery(`SELECT name as tagname FROM 'ca_tag' GROUP BY tagname;`, (callback || (() => {})));
	}

	getDesigns(callback, signhash, limit, offset=false) {
		let query = `SELECT * FROM ca_photo WHERE signhash='${signhash}' ORDER BY idx DESC${limit&&(' LIMIT ' + limit)}${offset?(' OFFSET ' + offset): ''};`;
		this.executeQuery(query, (results) => {
			let rows = results.rows.raw(); // shallow copy of rows Array
			callback(rows);
		});
	}

}
const SQLiteInstance = new SQLiteClass();
export default SQLiteInstance;