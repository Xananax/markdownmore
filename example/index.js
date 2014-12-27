var markdown = require('../index')
var additions = require('./filters')(markdown)
var readme = require('fs').readFileSync(__dirname+'/../README.md',{encoding:'utf8'});
var md = markdown(readme,{
	exampleVar:'(I am replaced)'
,	title:'Markdown-Additions Examples'
,	checkboxPrefix:'checkbox'
,	checkboxIds:0
,	minimumTOCLevel:3
});

require('fs').writeFileSync(__dirname+'/generated-readme.html',md,{encoding:'utf8'});

require('http').createServer(function(req,res){
	res.setHeader('Content-Type', 'text/html; charset=utf-8');
	res.end(md);
}).listen(3000);
console.log('listening on 3000');