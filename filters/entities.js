module.exports = function(markdown){

	var options = {
		template:'<span class="entity entity-%%icon%%>%%content%%</span>'
	,	characters:{
			'\(c\)':['copyright','©']
		,	'--':['dash','—']
		,	'<3':['heart','♥']
		,	'\(tm\)':['trademark','™']
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
		}
	};

	markdown.register('before',function(data,locals){

		var additionalCharacters = markdown.getOpt(locals,['markdown','entities','characters'],false);
		var tmpl = markdown.getOpt(locals,['markdown','entities','template'],template);
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
		var seek = new RegExp('('+charsString.join('|')+')','g');
		data.str = data.str.replace(seek,function(total,icon){
			var i = chars[icon] || icon;
			return tmpl.replace(/%%icon%%/,i[0]).replace('%%content%%',i[1]);
		});
	});
}