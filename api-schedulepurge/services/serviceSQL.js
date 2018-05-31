const sql = require('tedious');
const TYPES = require('tedious').TYPES;

let dbConfig = {
	server:'192.168.22.202',
	database:'supervisor_main',
	userName:'developpement',
	password:'developpement',
	options:{
		database: 'supervisor_main',
		useColumnNames: true
	}
}

const SQLQuery = function(query, params = null, callback, Config = null){
	/*connexion à la base, par défaut supervisor_main*/
	if(Config != null){
		dbConfig = Config;
	}
	const connection = new sql.Connection(dbConfig);
	let results = [];
	connection.on('connect', function(err) {
		if(err){
			return err;
		}
		else{
			/*préparation de la query*/
			const request = new sql.Request(query, function(err, rowCount) {
				if(err){
					return callback(err);
				}
				callback(null, results);
			});
			/*ajouts de paramètres dans la query*/
			if(params != null){
				for(let i = 0; i < params.length; i++){
					request.addParameter(params[i].name, eval(params[i].type), params[i].value);
				}
			}
			/*récupération des données de la query*/
			request.on('row', function(rowObject) {
				results.push(rowObject);
			  });
			
			/*execution du sql*/
			connection.execSql(request);
		}
	});
	
	return results;
	
}

const SQLProdStock = function(query, params){
	
}


exports.SQLQuery = SQLQuery;
exports.SQLProdStock = SQLProdStock;