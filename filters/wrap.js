registered = false;

module.exports = function(markdown){

	if(registered){return false;}
	registered = true;

	var options = {
		class_suffix:'-wrapper'
	}

	function wrap(element){
		markdown.registerJsonFilter(element,function(jsonml,locals,parent,index){
			//if(parent && parent[0] == 'span' && parent[1]['data-type']){return;}
			return [[
				'span'
			,	{class:element+locals.markdown.wrap.class_suffix}
			,	jsonml
			]];
		});
	}

	function register_wrappers(locals){
		var wrappers = locals.markdown.wrap.wrappers;
		var i=0, l = wrappers && wrappers.length;
		if(l){
			for(i,l;i<l;i++){
				wrap(wrappers[i]);
			}
		}
	}

	markdown.register('before',function(data,locals){
		if(!locals.markdown){locals.markdown={};}
		if(!locals.markdown.wrap){locals.markdown.wrap = {};}
		locals.markdown.wrap.class_suffix = locals.markdown.wrap.class_suffix || options.class_suffix;
		register_wrappers(locals);
	});

	markdown.wrap = wrap;
}