module.exports = function(markdown){
	// Simple mustache-like variables replacement
	function mustacheLike(data,locals){
		data.str = data.str.replace(/(?:\{\{(.*?)\}\})/g,function(total,key){
			var args = key.split(':');
			key = args.shift().key.split('.');
			var ret = markdown.getOpt(locals,key,'');
			if(typeof ret == 'function'){
				return ret.call(null,args);
			}
			return ret+args.join(':');
		});
	}

	// registers function on the raw text:
	markdown.register('before')(mustacheLike);
}