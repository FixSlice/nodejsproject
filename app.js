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
app.get('/logs', function(req, res){
	res.setHeader('Content-Type', 'text/html');
	modules.fs.readFile(routes.logs, function(req, data){
		res.write(data);
		res.end();
	});
})
app.get('/feedrss', function(req, res){
	res.setHeader('Content-Type', 'text/html');
	modules.fs.readFile(routes.feedrss, function(req, data){
		res.write(data);
		res.end();
	});
})


app.listen(params.port);
console.log('Serveur web lancé sur localhost:'+params.port+' ...');