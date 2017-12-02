const SQLiteLib = require('react-native-sqlite-storage');

class HairpinDBClass {
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
				if(typeof callback === 'function') callback(results);
			}, (errCallback || console.error));
		})
	}

	insertDesign(signhash, photohash, regdate, title, recipe, comment) {
		const query = `INSERT INTO 'ca_photo'('signhash', 'photohash','reg_date','title','recipe','comment') ` +
			`VALUES ('${signhash}', '${photohash}','${regdate}','${title}','${recipe.replace('\n', '\\n')}','${comment.replace('\n', '\\n')}');`;
		console.log(query);
		this.executeQuery(query);
	}

	insertTag(iTags, photohash, signhash) {
		const tagquery = `DELETE FROM 'ca_tag' WHERE 'photohash'='${photohash}' AND 'signhash'='${signhash}';`;
		const tagreturn = (tag) => `INSERT INTO 'ca_tag'('name','photohash','signhash') VALUES ('${tag}','${photohash}','${signhash}');`;
		// let tagnamereturn = (tag) => `INSERT INTO 'ca_tagname'('tagname') SELECT '${tag}' WHERE NOT EXISTS(SELECT 1 FROM 'ca_tagname' WHERE 'tagname' = '${tag}');`;

		this.executeQuery(tagquery);
		
		iTags.forEach((tag) => {
			this.executeQuery(tagreturn(tag));
			// this.executeQuery(tagnamereturn(tag));
		});
	}

	selectTagname(callback) {
		this.executeQuery(`SELECT name as tagname FROM 'ca_tag' GROUP BY tagname;`, (callback || (() => {})));
	}

	getDesigns(callback, signhash, limit=false, offset=false) {
		const query = `SELECT * FROM ca_photo WHERE signhash='${signhash}' ORDER BY idx DESC${limit ? (' LIMIT ' + limit) : ''}${offset?(' OFFSET ' + offset): ''};`;
		this.executeQuery(query, (results) => {
			const rows = results.rows.raw(); // shallow copy of rows Array
			callback(rows);
		});
	}

}
const HairpinDBInstance = new HairpinDBClass();
export default HairpinDBInstance;