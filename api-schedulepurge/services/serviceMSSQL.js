var sql = require('mssql');
/*deprecated yet useful service to connect DB bypassing schematic tables (like dbo.liste)*/
let dbConfig = {
		server:'192.168.22.202',
		database:'supervisor_main',
		user:'developpement',
		password:'developpement',
		port: 1433,
		options:{
			database: 'supervisor_main'
		}
}

const MSSQLQuery = function(query, params = null, callback, Config = null){
	
	if(Config != null){
		dbConfig = Config;
	}
    var dbConn = new sql.ConnectionPool(dbConfig);
    dbConn.connect().then(function () {

        var request = new sql.Request(dbConn);
        /*ajouts de paramètres dans la query*/
        if(params != null){
			for(let i = 0; i < params.length; i++){
				request.input(params[i].name, eval(params[i].type), params[i].value);
			}
        }
		/*récupération des données de la query*/
        request.query(query).then(function (recordSet) {
            callback(null, recordSet, dbConn.close());
        }).catch(function (err) {
        	callback(err, null, dbConn.close());
        });
    }).catch(function (err) {
    	callback(err, null, null);
    });
}

exports.MSSQLQuery = MSSQLQuery;