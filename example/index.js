var markdown = require('../lib/markdown');
var fs = require('fs');
var readme = fs.readFileSync(__dirname+'/../README.md',{encoding:'utf8'});
var locals = require('./locals')(readme);
var server = require('./server');

require('./filters')(markdown);
var md = markdown(readme,locals);
fs.writeFileSync(__dirname+'/public/index.html',md,{encoding:'utf8'});

server(3000);