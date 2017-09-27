/*this file contains all the project routes*/
var config = require('./config.json');
exports.home = config.webRoutes.home;
exports.logs = config.webRoutes.logs;
exports.feedrss = config.webRoutes.feedrss;