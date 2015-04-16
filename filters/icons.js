module.exports = function(markdown){

	var options = {
		template:'<i class="fa fa-%%icon%%></i>'
	,	characters:{
			'+':'plus-circle'
		,	'-':'minus-circle'
		,	'#':'check'
		,	'x':'times'
		,	'?':'question'
		}
	};

	// replaces (+) with <i class="fa fa-plus-circle"></i>,
	// (x) with <i class="fa fa-times"></i>, and so on
	markdown.register('before',function(data,locals){

		var additionalCharacters = markdown.getOpt(locals,['markdown','icons','characters'],false);
		var tmpl = markdown.getOpt(locals,['markdown','icons','template'],template);
		var chars = options.characters;
		var charsString = [];
		var n;
		if(additionalCharacters){
			for(n in additionalCharacters){
				chars[n] = additionalCharacters[n];
			}
		}
		for(n in chars){
			charsString.push(n);
		}
		var seek = new RegExp('\(('+charsString.join('|')+')\)','g');
		data.str = data.str.replace(seek,function(total,icon){
			var i = chars[icon] || icon;
			return tmpl.replace(/%%icon%%/,i);
		});
	});
}