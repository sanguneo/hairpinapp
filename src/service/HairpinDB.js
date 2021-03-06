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

	insertTag(signhash, photohash, tagnames) {
		let tagquery = "DELETE FROM `ca_tag` WHERE `photohash`='"+photohash+"' AND `signhash`='"+signhash+"';";
		const tagreturn = (tag) => "INSERT INTO `ca_tag`(`signhash`,`photohash`,`name`) VALUES ('"+signhash+"','"+photohash+"','"+tag+"');";
		// let tagnamereturn = (tag) => `INSERT INTO 'ca_tagname'('tagname') SELECT '${tag}' WHERE NOT EXISTS(SELECT 1 FROM 'ca_tagname' WHERE 'tagname' = '${tag}');`;

		this.executeQuery(tagquery, ()=> {
			tagnames.reduce(function(a,b){if(a.indexOf(b)<0)a.push(b);return a;},[]).forEach((tagname) => {
				this.executeQuery(tagreturn(tagname));
				// this.executeQuery(tagnamereturn(tag));
			});
		});
	}

	getTagnames(callback, signhash) {
		const whereCondition = (signhash && signhash!== '') && `WHERE signhash='${signhash}' `;
		this.executeQuery(`SELECT name as tagname FROM 'ca_tag' ${whereCondition}GROUP BY tagname;`, (results) => {
			callback(results.rows.raw());
		})
	}

	getDesigns(callback, signhash, limit=false, offset=false) {
		const query = `SELECT * FROM ca_photo WHERE signhash='${signhash}' ORDER BY idx DESC${limit ? (' LIMIT ' + limit) : ''}${offset?(' OFFSET ' + offset): ''};`;
		this.executeQuery(query, (results) => {
			callback(results.rows.raw());
		});
	}

	getDesignsByTag(callback, signhash, tagname, limit=false, offset=false) {
		const query = 	`SELECT p.idx, p.photohash, p.reg_date, p.title, p.recipe, p.comment, p.signhash FROM ca_photo as p `+
			`LEFT JOIN ca_tag as t ON p.photohash = t.photohash WHERE ` +
			`t.signhash='${signhash}' AND t.name='${tagname}' ORDER BY p.idx DESC;`;
		this.executeQuery(query, (results) => {
			callback(results.rows.raw());
		});
	}

	getOneDesign(callback, designHash, signhash) {
		const query = `SELECT * FROM ca_photo WHERE signhash='${signhash}'AND photohash='${designHash}';`;
		const tagquery = `SELECT * FROM ca_tag WHERE signhash='${signhash}'AND photohash='${designHash}';`;
		this.executeQuery(query, (results) => {
			const row = results.rows.raw()[0]
			this.executeQuery(tagquery, (tagresults) => {
				row.recipe = row.recipe.replace(/\\n/g,'\n');
				row.comment = row.comment.replace(/\\n/g,'\n');
				callback(results.rows.raw()[0], tagresults.rows.raw().map(tag=> tag.name));
			});
		});
	}

	updateDesign(signhash, photohash, title, recipe, comment) {
		const query = "UPDATE `ca_photo` SET `title` = '" + title + "',`recipe` = '" + recipe.replace('\n', '\\n') + "',`comment` = '" + comment.replace('\n', '\\n') + "'" +
			"  WHERE `photohash` = '"+photohash+"' AND `signhash` = '"+signhash+"'";
		this.executeQuery(query);
	}

	uploadDesign(signhash, photohash, uploaded) {
		const query = "UPDATE `ca_photo` SET `uploaded` = '" + uploaded + "'" +
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