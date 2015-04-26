registered = false;

module.exports = function(markdown){

	if(registered){return false;}
	registered = true;

	var options = {
			evaluate: /\{\{([^`'"][\s\S]+?)\}\}/g
		,	iterate : /^(?:each|for|#) (\w+)(?:\s*?,\s*?(\w+))?\s+?in\s+([\s\S]+)$/
		,	end:/^end$/
		,	conditionalElse:/^else$/
		,	conditional:/^(?:\?|if)\s+?([\s\S]+)$/
		,	escape:/^!\s?([\s\S]+)$/
		,	interpolate: /^([\s\S]+)$/
		}
	,	escapes = {
			'"':      '"'
		,	'\\':     '\\'
		,	'\r':     'r'
		,	'\n':     'n'
		,	'\t':     't'
		,	'\u2028': 'u2028'
		,	'\u2029': 'u2029'
		}
	,	escaper = /(\\|"|\r|\n|\t|\u2028|\u2029)/g
	,	entitiesEscape= {
			'&': '&amp;'
		,	'<': '&lt;'
		,	'>': '&gt;'
		,	'"': '&quot;'
		,	"'": '&#x27;'
		,	'/': '&#x2F;'
		}
	,	entitiesRegex=/[&<>"'\/"]/g;
	;

	function escapeEntities(string){
		if (string == null) return '';
		return ('' + string).replace(entitiesRegex, function(match) {
			return entitiesEscape[match];
		});
	}

	function templateSafe(str,escape){
		var src = '";\n';
		if(/\(/.test(str)){
			src+='__p+=(function(_d){try{return _d.'+str+';}catch(e){return "";}})(locals)'
		}
		else{
			src+='__p+=((__t=(locals.'+str+'))===null?"":'+
			(escape?'__escape(__t)':'__t')+')'
		}
		src+=';\n__p+="';
		return src;
	}

	function template(text,locals){
		var source = '__p="';
		var index = 0;
		var render;
		text.replace(options.evaluate, function(match,inside,offset){
			source += text.slice(index, offset)
        		.replace(escaper, function(match) { return '\\' + escapes[match]; });
			var m;
			if(options.iterate.test(inside)){
				m = (options.iterate.exec(inside) || []);
				var v = m[1];
				var current = '___parent.'+m[3];
				var o = '__obj__'
				var i = '__i__';
				var k = m[2] || 'key';
				var l = 'length';
				var ks = '___keys___'
				source+='";\n(function(___parent){\n'+
					'\tif(!'+current+'){return;}\n'+
					'\tvar __obj__='+current+','+i+'=0,'+ks+','+v+',locals={'+v+':null,first:true,last:false,odd:false,even:true};\n'+
					'\tif(!Array.isArray('+o+')){'+ks+'=Object.keys('+o+');'+l+'='+ks+'.length;}\n'+
					'\telse{'+l+'='+o+'.length;}\n'+
					'\tfor('+i+';'+i+'<'+l+';'+i+'++){\n'+
					'\t\t'+k+'= ('+ks+'?'+ks+'['+i+']:'+i+');\n'+
					'\t\tlocals.'+k+'='+k+';locals.first=('+i+'==0);locals.last=('+i+'>='+l+');locals.even=(('+i+' %2)==0);locals.odd=!locals.even;\n'+
					'\t\tlocals.'+v+'='+o+'['+k+'];\n\t\t__p+="'
				;
					
			}
			else if(options.conditional.test(inside)){
				m = (options.conditional.exec(inside) || []);
				var condition = m[1];
				if(condition){
					condition = condition.replace(/(^|\s|\(|\||&)((?:\w+)[\w\d]+)/g,'$1locals.$2');
					source+='";\n(function(){\n'+
						'\tif('+condition+'){\n__p+="'
					;
				}
			}
			else if(options.conditionalElse.test(inside)){
				source+='";\n\t}else{\n__p+="';
			}
			else if(options.end.test(inside)){
				source+='";\n}})(locals);locals=arguments[0];\n__p+="';
			}
			else if(options.escape.test(inside)){
				m = (options.escape.exec(inside) || []);
				source+=templateSafe(m[1],true);
			}
			else if(options.interpolate.test(inside)){
				m = (options.interpolate.exec(inside) || []);
				source+=templateSafe(m[1]);
			}
			index = offset + match.length;
		});
		if(index<text.length){
			source+='";__p+="'+text.slice(index).replace(escaper, function(match) { return '\\' + escapes[match]; })+'";__p+="';
		}
		source+='";\nreturn __p;\n';
		
		try{
			render = new Function('locals','__escape',source);
		}catch(e){
			e.source = source;
			console.log('-----------------------');
			console.log(source);
			console.log('-----------------------');
			throw e;
		}

		if(locals){
			return render(locals,escapeEntities);
		}
		var template = function(locals){
			return render.call(this,locals,escapeEntities);
		}
		source='function(locals,__escape){\n'+source+'}';
		template.source = source;
		return template;
	}

	// Simple mustache-like variables replacement
	markdown.register('before',function(data,locals){
		data.str = template(data.str,locals || {});
	});

}