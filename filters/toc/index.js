registered = false;

module.exports = function(markdown){

	if(registered){return false;}
	registered = true;

	require('../headers');

	var options = {
		max_level:3
	,	min_level:0
	,	class_prefix:'toc'
	,	title:'Table of Contents'
	}

	markdown.register('before',function(data,locals){
		if(!locals.markdown){locals.markdown = {};}
		if(!locals.markdown.toc){locals.markdown.toc = {};}
		locals.markdown.toc.max_level = locals.markdown.toc.max_level || options.max_level;
		locals.markdown.toc.min_level = locals.markdown.toc.min_level || options.min_level;
		locals.markdown.toc.class_prefix = locals.markdown.toc.class_prefix || options.class_prefix;
		locals.markdown.toc.title = locals.markdown.toc.title || options.title;
	});

	markdown.register('transform',function(jsonml,locals){
		var headers = locals && locals.markdown && locals.markdown.headers && locals.markdown.headers.ids;
		
		if(headers){
			var pre = locals.markdown.toc.class_prefix;
			var max_level = locals.markdown.toc.max_level;
			var min_level = locals.markdown.toc.min_level;
			var title = locals.markdown.toc.title;
			var links = [];
			for(var id in headers){
				var h = headers[id];
				var level = h[0];
				var text = h[1];
				if(level>max_level || level<=min_level){continue;}
				links.push([
					'li'
				,	{'class':pre+'-element '+pre+'-'+level}
				,	[
						'a'
					,	{class:pre+'-link',href:'#'+id}
					,	text
					]
				]);
			}
			if(links.length){
				links.unshift('ul',{class:pre+'-list'});
				var toc = ['div',{class:pre}];
				if(title){
					toc.push(['h1',{class:pre+'-title'},title]);
				}
				toc.push(links);
				jsonml.splice(1,0,toc);
			}
		}
	});
}