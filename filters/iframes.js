registered = false;

module.exports = function(markdown){

	if(registered){return false;}
	registered = true;

	var options = {
		class_prefix:'iframe'
	,	default_width:400
	,	default_height:300
	,	default_border:0
	}


	markdown.registerCommandFilter('iframe',function(src,size,border){
		var height,width;
		var provider = src.replace(/^https?:/,'')
			.replace(/^\/+/,'')
			.split('/').shift()
			.replace(/\.(com|org|net)/,'')
			.replace(/\.(\w+)$/,'$1')
			.split('.')
			.shift()
		;
		if(size){
			size = size.split('x');
			width = size.shift();
			height = size.shift() || width;
		}
		var props = {
			src:src
		,	width: (width || this.markdown.iframe.default_width)+'px'
		,	height: (height || this.markdown.iframe.default_height)+'px'
		,	frameborder: (border || this.markdown.iframe.default_border)+''
		}
		var className = this.markdown.iframe.className+provider;
		return [
			'span'
		,	{class:className}
		,	[
				'iframe'
			,	props
			]
		]
	});

	markdown.register('before',function(data,locals){
		if(!locals.markdown){locals.markdown={};}
		if(!locals.markdown.iframe){locals.markdown.iframe = {};}
		var pre = locals.markdown.iframe.class_prefix || options.class_prefix;
		locals.markdown.iframe.default_height = locals.markdown.iframe.default_height || options.default_height;
		locals.markdown.iframe.default_width = locals.markdown.iframe.default_width || options.default_width;
		locals.markdown.iframe.default_border = locals.markdown.iframe.default_border || options.default_border;
		locals.markdown.iframe.className = pre+' '+pre+'-';

	});
}