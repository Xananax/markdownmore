module.exports = function(markdown){

	// replaces @mention and #hashtag with spans
	markdown.registerJsonFilter(/([@#][A-Za-z0-9][A-Za-z0-9_]{0,40})/g,function(chunk,locals){
		var pre = markdown.getOpt(locals,['markdown','mentions','class_prefix'],'')
		if(chunk[0].match(/@|#/)){
			var type = (chunk[0]=='@'?'mention':'hashtag');
			return ['span'
			,	{
					class:(pre?pre+'-':'')+type
				,	'data-for':type+':'+chunk.substr(1)
				}
			,	chunk
			];
		}
		return chunk;
	});

}