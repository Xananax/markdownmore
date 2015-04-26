var registered = false;

module.exports = function(markdown){

	if(registered){return false;}
	registered = true;

	var options = {
		characters:{}
	};

	markdown.modifier = function(character,fn){
		if(arguments.length>1){
			options.characters[character] = fn;
			return markdown.modifier;
		}
		return options.characters[character];
	}


	markdown.registerTokenFilter(
		function(locals){
			return locals.markdown.modifiers.regExp;
		}
	,	function tokenize(mod,word,match){
			var fn = options.characters[mod];
			if(typeof fn == 'function'){
				return fn.call(this,word);
			}
		}
	);

	markdown.register('before',function(data,locals){
		if(!locals.markdown){locals.markdown = {};}
		if(!locals.markdown.modifiers){locals.markdown.modifiers = {};}
		var class_prefix = locals.markdown.modifiers.class_prefix || options.class_prefix;
		locals.markdown.modifiers.class = class_prefix+' '+class_prefix+'-'
		var additionalCharacters = locals.markdown.modifiers.characters;
		if(additionalCharacters){
			for(var n in additionalCharacters){
				options.characters[n] = additionalCharacters[n];
			}
		}
		var charsString = Object.keys(options.characters).map(markdown.escapeRegExp).join('|');
		locals.markdown.modifiers.regExp = new RegExp('(?:('+charsString+')([a-zA-Z0-9-_]+))','g');
	});

}