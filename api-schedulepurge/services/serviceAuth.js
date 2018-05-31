const express = require('express');
const createError = require('http-errors');
const router = express.Router();
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const url = require('url');
const sqlserv = require('./serviceSQL.js');
const serviceGlobal = require('./serviceGlobal.js');
const extend = require('extend');

/* GET auth listing. */

/*
 * Règles de gestion du script de purge
 * Le script de purge permet d'exécuter des procédures stockées de purges à l'aide de paramètres spécifiques
 * Ce script cherche dans les outbound des clients les segments de purge ainsi que les critères affiliés afin de les lancer comme paramètres des PStockées
 * 
 * 1)Dans un premier temps, nous allons vérifier l'authentification de l'utilisateur par BO
 * 2)Si l'utilisateur est authentifié, nous récupérons tous les segments et effectuons les instructions nécessaires pour exécuter les procédures stockées
 * 3)Nous indiquons si les opérations se sont biens terminées / mal exécutées
 */

class serviceAuth extends serviceGlobal {
    constructor(req, url, init) {
    	super(init);
    	this.urlHttp = url.parse(req.url, true);
    }
    
    gUrlHttp(){
    	return this.urlHttp;
    }
    
    authSupervisorQuery(){
    	return "SELECT S.Server_Name, S.server_login, S.server_passwordClear, UAC.User_DataBase, UAC.User_DataBaseOutbound" +
    	" FROM supervisor.UserAddonClient as UAC" +
    	" INNER JOIN supervisor.Server as S ON (UAC.Farm_Id = S.Farm_Id)";
    }
    authMainQuery(){
    	return "SELECT User_login FROM dbo.UserInfo ";
    }
   
    authentificationServ(callback){
    	const keyBO = 'bo_id' in this.urlHttp.query ? this.urlHttp.query.bo_id : false;
    	let query = null;
    	if (Number.isNaN(keyBO)) {
    		query = this.authSupervisorQuery() +
    				" WHERE User_URL like '%@User_URL%'" +
    				this.sParams('User_URL', 'TYPES.VarChar', keyBO);
    	}
    	else{
    		query = this.authSupervisorQuery() +
    				" WHERE User_ID = @User_Id"
    		this.sParams('User_ID', 'TYPES.Int', keyBO);
    	}
    	
    	sqlserv.SQLQuery(query, this.gParams(), function(error, results){
    		if(!error){
    			return callback(results);
    		}
    	})
    	this.resetParams();
    }
    authentificationWS(callback){
    	const keyLogin = 'login' in this.urlHttp.query ? this.urlHttp.query.login : false;
    	const keyMdp = 'mdp' in this.urlHttp.query ? this.urlHttp.query.mdp : false;
    	let query = this.authMainQuery() +
    			" WHERE User_Login = @User_Login" +
    			" AND User_PasswordMD5 = dbo.fn_MD5(@User_PasswordMD5)";
    	this.sParams('User_Login', 'TYPES.VarChar', keyLogin);
    	this.sParams('User_PasswordMD5', 'TYPES.VarChar', keyMdp);
    	sqlserv.SQLQuery(query, this.gParams(), function(error, results){
    		if(!error){
    			return callback(results);
    		}
    	}, this.gServerInfoMain());
    	this.resetParams();
    }
    
     AuthentificationRequest(req, res, next, callback){
    	/*first auth to BO Databases*/
    	let self = this;
    	self.authentificationServ(function(res1){
    		if(res1.length > 0){
    			let serv = self.parseServerInfo(res1);
    			self.sServerInfoMain(serv[0], serv[1]);
    			self.sServerInfoOut(serv[0], serv[2]);
    			/*user auth Databases*/
    			self.authentificationWS(function(res2){
    				/*user is recognized*/
    				if(res2.length > 0){
    					callback(true);
    				} 
    			});
    		}
    	});
    }
}
/*this function allows to auth the user on */

module.exports = serviceAuth;
