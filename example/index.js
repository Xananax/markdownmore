var markdown = require('../index')
require('./filters')(markdown);
require('./maths')(markdown);

var readFile = function(file){return require('fs').readFileSync(__dirname+'/'+file,{encoding:'utf8'});}
var readme = readFile('../README.md');
var readme_for_js = readme.replace(/"/g,'\\"').replace(/\n/g,'\\n');

var md = markdown(readme,{
	exampleVar:'(I am replaced)'
,	title:'Markdown-Additions Examples'
,	checkboxPrefix:'checkbox'
,	checkboxIds:0
,	minimumTOCLevel:3
,	script: '<script>\n'+readFile('checkboxes.js').replace(/\/\*markdown_text\*\//,readme_for_js)+'\n</script>'
});

require('fs').writeFileSync(__dirname+'/generated-readme.html',md,{encoding:'utf8'});

require('http').createServer(function(req,res){
	res.setHeader('Content-Type', 'text/html; charset=utf-8');
	res.end(md);
}).listen(3000);
console.log('listening on 3000');