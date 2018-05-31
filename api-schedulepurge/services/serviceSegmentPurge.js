const express = require('express');
const createError = require('http-errors');
const router = express.Router();
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const url = require('url');
const sqlserv = require('./serviceSQL.js');
const mssqlserv = require('./serviceMSSQL.js');
const serviceGlobal = require('./serviceGlobal.js');
const extend = require('extend');

/*
 * Script de purge
 * 1)récupération des segmentPurge_Id Done
 * 2)récupération des critères associés Done
 * 3)construction des tables cibles à l'aide des données de segmentation En cours (6 points)
 * 4)exécuter la procédure stockée de suppression des données En cours (6 points)
 * 
 */


class serviceSegmentPurge extends serviceGlobal {
	constructor(init) {
		super(init);
	}
	
	getQueryAllSegment(){
		return "SELECT TOP 3 C.Criteria_TableName, S.Segment_ID, C.Criteria_Query" +
		  " FROM Segment as S" + //change to SegmentPurge
		  " INNER JOIN Criteria as C on (C.Criteria_TableName = CONCAT ( 'C', S.Segment_ID))" +
		  " ORDER BY S.Segment_ID";
	}
	
	getQueryConstructTargetSegment(criteria){
		return "SELECT Liste_Id " + criteria;
	}
	
	getQueryCreateTableInsert(idTable, recordsets){
		return "CREATE TABLE " + idTable + {}
	}
	
	getAllSegmentPurge(callback){
		var query = getQueryAllSegment();
		//var query = "SELECT SegmentPurge_ID FROM "+super.gServerInfoOut('database')+".dbo.SegmentPurge";
		mssqlserv.MSSQLQuery(query, super.gParams(), function(error, results, actionClose){
    		if(error == null){
    			return callback(results);
    		}
    	}, super.gServerInfoOut());
    	super.resetParams();
	}
	
	constructTargetSegmentTable(segmentDataInfo, callback){
		let server = this.gServerInfoOut();
		segmentDataInfo.forEach(function(segmentData){
			let query = getQueryConstructTargetSegment(segmentData['Criteria_Query']);
			mssqlserv.MSSQLQuery(query, null, function(error, results, actionClose){
	    		if(error == null){
	    			console.log(results);
	    		}
				console.log(error);
	    	}, server);
    	});
	}
    
	 segmentPurgeRequest(callback){
		var self = this;
		self.getAllSegmentPurge(function(res1){
			if(res1.recordset.length > 0){
				self.constructTargetSegmentTable(res1.recordset, function(res2){
					return callback(res2);
				});
			}
		});
    }
}
/*this function allows to auth the user on */

module.exports = serviceSegmentPurge;
