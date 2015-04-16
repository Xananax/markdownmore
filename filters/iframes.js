module.exports = function(markdown){

	markdown.register('before',function(data,locals){

		var class_prefix = markdown.getOpt(locals,['markdown','iframe','class_prefix'],'iframe');
		var h = markdown.getOpt(locals,['markdown','iframe','height'],'400');
		var w = markdown.getOpt(locals,['markdown','iframe','width'],'300');
		var b = markdown.getOpt(locals,['markdown','iframe','border'],'0');

		data.str = data.str.replace(/iframe\[(.*?)\]/g,function(total,url){
			var provider = url.replace(/^https?:/,'')
				.replace(/^\/+/,'')
				.split('/').shift()
				.replace(/\.(com|org|net)/,'')
				.replace(/\.(\w+)$/,'$1')
				.split('.')
				.shift()
			;
			var className = class_prefix+' '+class_prefix+'-'+provider;
			return ('<div class="'+className+'">'+
				'<iframe src="'+url+'" frameborder="'+b+'" height="'+h+'px" width="'+w+'px"></iframe>'+
				'</div>')
			;
		});

	});
}