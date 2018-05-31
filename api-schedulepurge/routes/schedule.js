const express = require('express');
const createError = require('http-errors');
const router = express.Router();
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const url = require('url');
const serviceAuth = require('../services/serviceAuth.js');
const serviceSegmentPurge = require('../services/serviceSegmentPurge.js');
const extend = require('extend');

/* GET home page. */
router.get('/', function(req, res, next) {
  let serviceA = new serviceAuth(req, url);
  serviceA.AuthentificationRequest(req, res, next, function(result){
	  if(result){
		  res.send('Auth Succeed for the user, connexion established to main DB');
		  /*we established a connexion so we start to check the segment table, as getting server is a Global service, we can call it within the serviceA class*/
		  let serverMO = {
				  'Main': serviceA.gServerInfoMain(),
				  'Out': serviceA.gServerInfoOut()
		  }
		  let serviceSP = new serviceSegmentPurge(serverMO);
		  serviceSP.segmentPurgeRequest(function(result){
			  if(result){
				  console.log(result);
			  }
		  });
	  }  
  });
 
});

module.exports = router;
