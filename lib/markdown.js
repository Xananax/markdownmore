var md = require('markdown').markdown;
var dialect = require('./dialect');

module.exports = (function(){

	var hooks = {
		'before':[]
	,	'json':{}
	,	'command':{}
	,	'html':[]
	,	'after':[]
	,	'transform':[]
	};
	var urlRegExp = /^((((http|ftp)s?:)?\/\/)|\.\/)[^\s]+$/;
	var commandRegExp = /^([a-zA-Z0-9]+)(?:\s(.+)$)?/;

	function escapeRegExp(str) {
		return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
	}

	function run_hooks(hooks,data,locals){
		var i = 0, l = hooks.length,fn;
		for(i;i<l;i++){
			fn = hooks[i];
			fn(data,locals,data);
		}
	}

	function insertAt(arr,index,remove,newArr){
		if(index>arr.length){index=arr.length;}
		if(!newArr){newArr = remove;remove = 0;}
		Array.prototype.splice.apply(arr,[index,remove].concat(newArr));
		return arr;
	}


	function render(content,locals){
		if(!content){return '';}
		locals = locals || {};
		var dataBefore = {str:content}
		if(hooks['before'] && hooks.before.length){run_hooks(hooks.before,dataBefore,locals);}

		var jsonMLTree = md.parse(dataBefore.str,(locals && locals.dialect) || dialect);
		run_json_filters(locals,jsonMLTree);
		if(hooks['transform'] && hooks.transform.length){run_hooks(hooks.transform,jsonMLTree,locals);}
		
		var htmlTree = md.toHTMLTree(jsonMLTree);
		if(hooks['html'] && hooks.html.length){run_hooks(hooks.html,htmlTree,locals);}
		var data = {str:md.renderJsonML(htmlTree)}
		if(hooks['after'] && hooks.after.length){run_hooks(hooks.after,data,locals);}
		return data.str;
	}

	function register_hook(hook_name,fn){
		if(!fn){return register_hook_curry(hook_name);}
		if(!hooks[hook_name]){throw new Error('hook "'+hook_name+'" does not exist');}
		hooks[hook_name].push(fn);
		return register_hook_curry(hook_name);
	}

	function register_hook_curry(hook_name){
		return function(fn){
			return register_hook(hook_name,fn);
		}
	}

	function run_json_filters(locals,root){
		var refs = root[1].references;
		(function parseJson(jsonml,index,arr){
			var i = 0, l, ref,type,fns;
			if(typeof jsonml == 'string'){
				if(index == 0 || arr[0] == 'inlinecode' || !jsonml || /^\s+?\n?$/.test(jsonml)){return;}
				type = 'string';
			}
			else if(Array.isArray(jsonml)){
				type = jsonml[0];

				if(type === 'link' && !urlRegExp.test(jsonml[1].href)){
					jsonml[1].label = jsonml[1].href;
					jsonml[0] = "shortcode";
					delete jsonml[1].href;
					type = "shortcode";
				}
				else if(type === "link_ref"){
					var ref = jsonml[1].ref;
					if(!refs || !refs[ref]){
						jsonml[0] = "shortcode";
						type = "shortcode";
					}
				}

				if(type === 'shortcode' && commandRegExp.test(jsonml[2])){
					var match = commandRegExp.exec(jsonml[2]);
					var cmd = match[1];
					if(hooks.command[cmd]){
						var args = ((match[2] && match[2].split('|')) || [])
							.concat((jsonml[1].label && jsonml[1].label.split('|')) || [])
						;
						ret = hooks.command[cmd](cmd,args,locals);
						if(!ret){arr[index] = '';type='null';}
						else{
							arr[index] = ret;
							type = (typeof ret == 'string' && 'string') || ret[0];
						}
					}
				}

				var _i = 0;
				for(_i;_i<jsonml.length;_i++){
					parseJson(jsonml[_i],_i,jsonml);
				}
			}
			else{
				// properties object
				return;
			}
			
			if((fns = hooks.json[type]) && (l = fns.length)){
				for(i=0;i<l;i++){
					ret = fns[i](arr[index],locals,arr,index);
					if(ret){
						if(Array.isArray(ret)){
							insertAt(arr,index,1,ret);
						}
						else{
							arr[index] = ret;
						}
					}
				}
			}
		})(root);
	}

	function register_json_filter(type,fn){
		if(!hooks.json[type]){hooks.json[type] = [];}
		hooks.json[type].push(fn);
	}

	function register_shortcode_filter(regex,fn){
		if(!(regex instanceof RegExp)){
			regex = new RegExp('^'+escapeRegExp(regex)+'$','g');
		}
		var filter = function(jsonml,locals,parent,index){
			var str = jsonml[2];
			var props = jsonml[1];
			if(regex.test(str)){
				var ret = fn.call(filter,str,props,locals,jsonml,parent,index);
				return ret;
			}
		}
		filter.regExp = regex;
		register_json_filter('shortcode',filter);
	}

	function register_command_filter(name,fn){
		var filter = function(cmd,args,locals){
			return fn.apply(locals,args);
		}
		hooks.command[name] = filter;
	}

	function register_string_filter(fn){
		var filter = function(jsonml,locals,parent){
			if(Array.isArray(jsonml)){
				jsonml = jsonml.map(function(chunk,i){
					return filter(chunk,locals,parent);
				});
			}else{
				if(jsonml && typeof jsonml == 'string'){
					var ret = fn.call(filter,jsonml,locals,parent);
					if(ret){return ret;}
				}
			}
			return jsonml;
		}
		register_json_filter('string',filter);
	}

	function register_token_filter(getRegExp,tokenize){
		register_string_filter(function(str,locals,parent){
			var regExp = getRegExp(locals);
			if(str.match(regExp)){
				var source = [''], index=0;
				str.replace(regExp,function(match){
					var i = 1
					,	l = arguments.length-2
					,	args=[]
					//,	capture = arguments[l+1] 
					,	offset = arguments[l]
					,	chunk = str.slice(index,offset)
					,	ret
					;
					index = offset + match.length;
					
					for(i;i<l;i++){
						args.push(arguments[i]);
					}
					args.push(match);
					if(chunk){source.push(chunk);}
					var ret = tokenize.apply(locals,args);
					if(ret){source.push(ret);}
				});
				if(index<str.length){
					source.push(str.slice(index));
				}
				return source;
			}
		});
	}

	render.register = register_hook;
	render.markdown = md;
	render.registerJsonFilter = register_json_filter;
	render.registerShortcode = register_shortcode_filter;
	render.registerStringFilter = register_string_filter;
	render.registerCommandFilter = register_command_filter;
	render.registerTokenFilter = register_token_filter;
	render.escapeRegExp = escapeRegExp;
	return render;

})();