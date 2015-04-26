registered = false;

module.exports = function(markdown){

	if(registered){return false;}
	registered = true;

	var options = {
		class_prefix:'embed'
	,	providers:{
			'youtube.com':function(frag,w,h){
				frag = frag.split('?');
				var i=0,l=frag.length;
				while(i < l && !url && !/^v=/.test(frag[i])){
					i++;
				}
				var url = frag[i];
				if(!url){return false;}
				url = url.replace(/v=/,'');
				w = w || 560;
				h = h || 315;
				//return [];
				return ([
					'iframe'
				,	{
						height:h+'px'
					,	width:w+'px'
					,	allowfullscreen:'allowfullscreen'
					,	src:'//www.youtube.com/embed/'+url
					,	frameborder:'0'
					}
				]);
			}
		,	'youtu.be':function(frag,w,h){
				url = frag.split('?').shift();
				w = w || 560;
				h = h || 315;
				return ([
					'iframe'
				,	{
						src:'//www.youtube.com/embed/'+url
					,	frameborder:'0'
					,	height:h+'px'
					,	width:w+'px'
					,	allowfullscreen:'allowfullscreen'
					}
				]);
			}
		,	'vimeo.com':function(frag,w,h){
				var url = frag.split('/').pop();
				w = w || 281;
				h = h || 500;
				return ([
					'iframe'
				,	{	
						src:'//player.vimeo.com/video/'+url
					,	frameborder:'0'
					,	height:h+'px'
					,	width:w+'px'
					,	allowfullscreen:'allowfullscreen'
					,	webkitallowfullscreen:'webkitallowfullscreen'
					,	mozallowfullscreen:'mozallowfullscreen'
					}
				]);
			}
		}
	}

	markdown.register('before',function embeds(data,locals){
		if(!locals.markdown){locals.markdown={};}
		if(!locals.markdown.embed){locals.markdown.embed = {};}
		var pre = locals.markdown.embed.class_prefix || options.class_prefix;
		locals.markdown.embed.class = pre+' '+pre+'-';
		var providers = [];
		var additionalProviders = locals.markdown.embed.providers;
		var n;
		if(additionalProviders){
			for(n in additionalProviders){
				options.providers[n] = additionalProviders[n];
			}
		}
		
		providers = Object.keys(options.providers).map(markdown.escapeRegExp).join('|');
		var seek = new RegExp('(?:(^|\n)(?:(\\d\\d+)x(\\d\\d+):)?(?:(?:https?:)\\/\\/(?:w+\\.)?('+providers+')\/(.*?)))(\n|$)','g');
		locals.markdown.embed.regExp = seek;
	});

	markdown.registerTokenFilter(
		function(locals){
			return locals.markdown.embed.regExp;
		}
	,	function tokenize(start,width,height,provider,fragment,end,match){
			var fn = options.providers[provider];
			var className = this.markdown.embed.class+provider.replace(/\.(com|net|org)$/,'').replace(/\./,'');
			var embed = fn(fragment,width,height);
			if(!embed){return false;}
			var elem = [
				'span'
			,	{class:className}
			,	embed
			];
			return elem;
		}
	);

}