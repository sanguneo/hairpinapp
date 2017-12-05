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
		this.executeQuery(query);
	}

	insertTag(signhash, photohash, iTags) {
		const tagquery = `DELETE FROM 'ca_tag' WHERE 'photohash'='${photohash}' AND 'signhash'='${signhash}';`;
		const tagreturn = (tag) => `INSERT INTO 'ca_tag'('name','photohash','signhash') VALUES ('${tag}','${photohash}','${signhash}');`;
		// let tagnamereturn = (tag) => `INSERT INTO 'ca_tagname'('tagname') SELECT '${tag}' WHERE NOT EXISTS(SELECT 1 FROM 'ca_tagname' WHERE 'tagname' = '${tag}');`;

		this.executeQuery(tagquery);
		
		iTags.forEach((tag) => {
			this.executeQuery(tagreturn(tag));
			// this.executeQuery(tagnamereturn(tag));
		});
	}

	getTagnames(callback, signhash) {
		callback([
			{tagname: '상구너'},
			{tagname: '구나'},
			{tagname: 'omg'},
			{tagname: '와우'},
			{tagname: 'zzzz'},
			{tagname: 'asfasf'},
			{tagname: 7},
			{tagname: 8},
		]);
		// const whereCondition = (signhash && signhash!== '') && `WHERE signhash='${signhash}' `;
		// this.executeQuery(`SELECT name as tagname FROM 'ca_tag' ${whereCondition}GROUP BY tagname;`, (results) => {
		// 	callback(results.rows.raw());
		// })
	}

	getDesigns(callback, signhash, limit=false, offset=false) {
		const query = `SELECT * FROM ca_photo WHERE signhash='${signhash}' ORDER BY idx DESC${limit ? (' LIMIT ' + limit) : ''}${offset?(' OFFSET ' + offset): ''};`;
		this.executeQuery(query, (results) => {
			callback(results.rows.raw());
		});
	}
	getOneDesign(callback, designHash, signhash) {
		const query = `SELECT * FROM ca_photo WHERE signhash='${signhash}'AND photohash='${designHash}';`;
		const tagquery = `SELECT * FROM ca_tag WHERE signhash='${signhash}'AND photohash='${designHash}';`;
		this.executeQuery(query, (results) => {
			this.executeQuery(tagquery, (tagresults) => {
				callback(results.rows.raw()[0], tagresults.rows.raw().map(tag=> tag.name));
			});
		});
	}

	updateDesign(signhash, photohash, title, recipe, comment) {
		const query = "UPDATE `ca_photo` SET `title` = '" + title + "',`recipe` = '" + recipe.replace('\n', '\\n') + "',`comment` = '" + comment.replace('\n', '\\n') + "'" +
			"  WHERE `photohash` = '"+photohash+"' AND `signhash` = '"+signhash+"'";
		this.executeQuery(query);
	}

	deleteDesign(signhash, photohash) {
		const query  = "DELETE FROM `ca_photo` WHERE `photohash` = '"+photohash+"' AND `signhash` = '"+signhash+"'";
		const tagquery = "DELETE FROM `ca_tag` WHERE `photohash` = '"+photohash+"' AND `signhash` = '"+signhash+"'";
		this.executeQuery(query);
		this.executeQuery(tagquery);
	}

}
const HairpinDBInstance = new HairpinDBClass();
export default HairpinDBInstance;