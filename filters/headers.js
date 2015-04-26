registered = false;

module.exports = function(markdown){

	if(registered){return false;}
	registered = true;

	var options = {
		id_prefix:''
	,	level:3
	}

	markdown.registerJsonFilter('header',function(jsonml,locals){
		var max_level = locals.markdown.headers.level;
		var level = jsonml[1].level;
		if(level<=max_level){
			var n = 0;
			var pre = locals.markdown.headers.id_prefix;
			var ids = locals.markdown.headers.ids;
			var text = jsonml[2];
			while(Array.isArray(text)){
				text = text[3] || text[2];
			}
			if(jsonml[1].id){
				ids[jsonml[1].id] = [level,text];
				return;
			}
			var _id = pre+text
				.toLowerCase()
				.replace(/\s+/g,' ')
				.replace(/\s/,'-')
				.replace(/:|\[|\]|\{|\}|\%|\(|\)|\^|\$/,'')
			;
			var id = _id;
			while(ids[id]){
				id = _id+(n++);
			}
			ids[id] = [level,text];
			jsonml[1].id = id;
		}
	});

	markdown.register('before',function(data,locals){
		if(!locals.markdown){locals.markdown = {};}
		if(!locals.markdown.headers){locals.markdown.headers = {};}
		locals.markdown.headers.level = locals.markdown.headers.level || options.level;
		locals.markdown.headers.id_prefix = locals.markdown.headers.id_prefix || options.id_prefix;
		locals.markdown.headers.ids = locals.markdown.headers.ids || {};
	});

}