module.exports = function(markdown){

	var alphabet = 'abcdefghijklmnopqrstuvwxyz'.toUpperCase().split('');

	var mathMethods = 'abs|acos|acosh|asin|asinh|atan|atan2|atanh|cbrt|ceil|clz32|cos|cosh|exp|expm1|floor|fround|hypot|imul|log|log10|log1p|log2|max|min|pow|random|round|sign|sin|sqrt|tan|tanh|trunc';
	var expressionToken = '(([a-zA-Z]+)=(([0-9\\.]+)|([a-zA-Z]+)|\\(([^ ]+)\\)))(\\!)?'
	var regexp = new RegExp(expressionToken,'g');
	var mathMethodsRegexp = new RegExp('('+mathMethods+')(\\(.+?\\))','g');

	function parseMaths(jsonml,locals){
		var i, l, ret,r;
		if(typeof jsonml == 'string'){
			var m = regexp.exec(jsonml);
			if(m){
				jsonml = jsonml.replace(regexp,function(total,capture,variable,value,value2,reference,expression,negate){
					var e = {
						variable: variable
					,	value: value || expression
					,	reference:reference
					,	is:{
							expression:!!expression
						,	number:!!value
						,	reference:!!reference
						}
					};
					var ret = parseChunk(e,locals);
					return negate ? '' : ret;
				});
			}
			return jsonml;
		}
		else{
			for(i=0,l=jsonml.length;i<l;i++){
				ret = parseMaths(jsonml[i],locals);
				if(ret){jsonml[i] = ret;}
			}
		}
	}

	function parseChunk(e,locals){
		if(!locals._m_stash){locals._m_stash = {};}
		if(e.is.reference){e.value = (locals._m_stash[e.reference] && locals._m_stash[e.reference].value) || 0;}
		if(e.is.expression){
			e.value = e.value
				.replace(mathMethodsRegexp,'Math.$1$2')
				.replace(/([a-zA-Z]+)/g,function(total,v){
					return (locals._m_stash[v] && locals._m_stash[v].value) || total;
				});
			try{
				eval('e.value='+e.value+';');
			}
			catch(e){}
		}
		locals._m_stash[e.variable] = e;
		return e.value+'';
	};

	markdown.register('json',parseMaths);

}