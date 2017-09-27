var modules = require('./routes/modulesNode');
var routes = require('./routes');
var params = require('./config/default');

var app = modules.express();

app.get('/', function(req, res){
	res.setHeader('Content-Type', 'text/html');
	modules.fs.readFile(routes.home, function(req, data){
		res.write(data);
		res.end();
	});
})
app.get('/log', function(req, res){
	res.setHeader('Content-Type', 'text/html');
	res.end('logFile');
})


app.listen(params.port);
console.log('Serveur web lancé sur localhost:'+params.port+' ...');