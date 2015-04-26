registered = false;
module.exports = function(markdown){

	if(registered){return false;}
	registered = true;

	var options = {
		class_prefix:'entity'
	,	render:function(className,content){
			return ['span'
			,	{class:className}
			,	['span',content]
			];
		}
	,	characters:{
			'(c)':['copyright','©']
		,	'<3':['heart','♥']
		,	'(tm)':['trademark','™']
		,	'(r)':['registered','®']
		,	'~=':['approx','≈']
		,	'>=':['greaterOrEqual','≥']
		,	'<=':['lowerOrEqual','≤']
		,	'!=':['notEqual','≠']
		,	'-->>':['rightArrow','⇒']
		,	'<<--':['leftArrow','⇐']
		,	'<<-->>':['leftRightArr','⇔']
		,	'->':['rightArr','→']
		,	'<-':['leftArr','←']
		,	'<->':['leftRightArr','↔']
		,	'--':['dash','—']
		}
	};

	markdown.registerTokenFilter(
		function(locals){
			return locals.markdown.entities.regExp;
		}
	,	function tokenize(token){
			var pre = this.markdown.entities.class;
			var entities = options.characters;
			var render = this.markdown.entities.render;
			if(entities[token]){
				var e = entities[token];
				return render(pre+e[0],e[1]);
			}
		}
	);

	markdown.register('before',function(data,locals){
		if(!locals.markdown){locals.markdown = {};}
		if(!locals.markdown.entities){locals.markdown.entities = {};}
		var class_prefix = locals.markdown.entities.class_prefix || options.class_prefix;
		locals.markdown.entities.class = class_prefix+' '+class_prefix+'-';
		locals.markdown.entities.render = locals.markdown.entities.render || options.render;
		var additionalCharacters = locals.markdown.entities.characters;
		if(additionalCharacters){
			for(var n in additionalCharacters){
				options.characters[n] = additionalCharacters[n];
			}
		}
		var charsString = Object.keys(options.characters).map(markdown.escapeRegExp).join('|');
		locals.markdown.entities.regExp = new RegExp('('+charsString+')','g');
	});
}