const express = require('express');
const createError = require('http-errors');
const router = express.Router();
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
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

class serviceGlobal {
    constructor(init) {
    	this.params = [];
    	this.serverInfoMain = {}; 
    	this.serverInfoOut = {};
    	
    	if(init) this.sServerInfoMain(init.Main);
    	if(init) this.sServerInfoOut(init.Out);
    }
    
    gParams(){
    	return this.params;
    }
    
    sParams(name, type, value){
    	this.params.push({'name': name, 'type': type, 'value': value});
    }
    
    resetParams(){
    	this.params = [];
    }
    
    gServerInfoMain(key = null){
    	if(key != null){
    		return this.serverInfoMain[key];
    	}
    	return this.serverInfoMain;
    }
    
    gServerInfoOut(key = null){
		if(key != null){
			return this.serverInfoOut[key];
    	}
    	return this.serverInfoOut;
    }
    
    sServerInfoMain(serv, dbM = null){
    	extend(this.serverInfoMain, serv);
    	if(dbM != null){
    		this.serverInfoMain.database = dbM;
    		this.serverInfoMain.options = {database: dbM, useColumnNames: true};
    	}
    }
    
    sServerInfoOut(serv, dbO = null){
    	extend(this.serverInfoOut, serv);
    	if(dbO != null){
    		this.serverInfoOut.database = dbO;
    		this.serverInfoOut.options = {database: dbO, useColumnNames: true};
    	}
    }
    
    parseServerInfo(serverDataInfo){
    	let serv = {};
    	let dbM = null;
    	let dbO = null;
    	
    	serverDataInfo.forEach(function(serverData){
    		serv = {
				server: serverData['Server_Name'].value,
				user: serverData['server_login'].value, //for mssql
				userName: serverData['server_login'].value, //for tedious
				password: serverData['server_passwordClear'].value,
				port: '1433'
    		};
    		dbM = serverData['User_DataBase'].value;
    		dbO = serverData['User_DataBaseOutbound'].value;
    	});
    	//developpement rule (delete in prod)
    	serv.server = "192.168.22.202"; 
    	return [serv, dbM, dbO];
    }
}
/*this function allows to auth the user on */

module.exports = serviceGlobal;
