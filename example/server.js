var fs = require('fs');
module.exports = function(port){
	port = port || 3000;
	require('http').createServer(function(req,res){
		var url = req.url;
		if(!url || url=='/'){url='/index.html';}
		var mimeType = url.match(/\.html$/) ? 'text/html; charset=utf-8' : url.match(/\.js$/)?'application/javascript':url.match(/\.css$/) ? 'text/css':'text/plain';
		fs.readFile(__dirname+'/public'+url,{encoding:'utf8'},function (err,data) {
			if (err) {
				res.writeHead(404);
				res.end(JSON.stringify(err));
				return;
			}
			res.setHeader('Content-Type', mimeType);
			res.writeHead(200);
			res.end(data);
		});
	}).listen(port);
	console.log('listening on '+port);
}