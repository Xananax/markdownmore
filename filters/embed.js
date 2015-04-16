module.exports = function(markdown){

	var options = {
		class_prefix:'embed'
	,	providers:{
			'youtube.com':function(frag,className,w,h){
				frag = frag.split('?');
				var i=0,l=frag.length;
				while(i < frag.length && !url && !/^v=/.test(frag[i])){
					i++;
				}
				var url = frag[i];
				if(!url){return false;}
				w = w || 560;
				h = h || 315;
				return ('<div class="'+className+'">'+
					'<iframe src="http://www.youtube.com/embed/'+url+'" frameborder="0" height="'+h+'px" width="'+w+'px" allowfullscreen></iframe>'+
				'</div>');
			}
		,	'youtu.be':function(frag,className,w,h){
				url = frag.split('?').shift();
				w = w || 560;
				h = h || 315;
				return ('<div class="'+className+'">'+
					'<iframe src="http://www.youtube.com/embed/'+url+'" frameborder="0" height="'+h+'px" width="'+w+'px" allowfullscreen></iframe>'+
				'</div>')
				;
			}
		,	'vimeo.com':function(frag,className,w,h){
				var url = frag.split('/').pop();
				w = w || 281;
				h = h || 500;
				return ('<div class="'+className+'">'+
					'<iframe src="http://player.vimeo.com/video/'+url+'" frameborder="0" height="'+h+'px" width="'+w+'px"  webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>'+
				'</div>')
				;
			}
		}
	}

	function embeds(data,locals){
		var providers = [];
		var additionalProviders = markdown.getOpt(locals,['markdown','embed','providers'],false);
		var pre = markdown.getOpt(locals,['markdown','embed','class_prefix'],options.class_prefix);
		var n;
		if(additionalProviders){
			for(n in additionalProviders){
				options.providers[n] = additionalProviders[n];
			}
		}
		for(n in options.providers){providers.push(n);}
		providers = providers.join('|').replace('.','\.');
		var seek = new RegExp('^(\d\d+x\d\d+:)?((?:https?:)\/\/(?:w+\.)?('+providers+')\/(.*?))\s|\n|$','gi');
		data.str = data.str.replace(seek,function(total,size,url,provider,fragment){
			var fn = options.providers[provider];
			if(!fn){return url;}
			var size = size?size.replace(':','').split('x'):[];
			var className = pre+' '+pre+'-'+provider.replace(/\.(com|net|org)$/,'').replace('.','');
			var ret = fn(fragment,className,size[0],size[1],url);
			return ret? ret : url;
		});
	}

	// registers function on the raw text:
	markdown.register('before')(embeds);
}