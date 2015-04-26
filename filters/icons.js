registered = false;

module.exports = function(markdown){

	if(registered){return false;}
	registered = true;

	var options = {
		class_prefix:'fa'
	,	render:function(className,content){
			return ['i'
			,	{class:className}
			,	['span',content]
			];
		}
	,	characters:{
			'+':'plus-circle'
		,	'-':'minus-circle'
		,	'#':'check'
		,	'x':'times'
		,	'?':'question'
		}
	};

	markdown.registerTokenFilter(
		function(locals){
			return locals.markdown.icons.regExp;
		}
	,	function tokenize(token){
			var pre = this.markdown.icons.class;
			var icons = options.characters;
			var className = pre+(icons[token] || 'default');
			var render = this.markdown.icons.render;
			return render(className,token);
		}
	);

	markdown.register('before',function(data,locals){
		if(!locals.markdown){locals.markdown = {};}
		if(!locals.markdown.icons){locals.markdown.icons = {};}
		var class_prefix = locals.markdown.icons.class_prefix || options.class_prefix;
		locals.markdown.icons.class = class_prefix+' '+class_prefix+'-';
		locals.markdown.icons.render = locals.markdown.icons.render || options.render;
		var additionalCharacters = locals.markdown.icons.characters;
		if(additionalCharacters){
			for(var n in additionalCharacters){
				options.characters[n] = additionalCharacters[n];
			}
		}
		var charsString = Object.keys(options.characters).map(markdown.escapeRegExp).join('|');
		locals.markdown.icons.regExp = new RegExp('(?:\\(('+charsString+')\\))','g');
	});

}