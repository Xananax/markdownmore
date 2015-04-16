var md = require('markdown').markdown;

module.exports = (function(){

	var hooks = {
		'before':[]
	,	'json':[]
	,	'html':[]
	,	'after':[]
	};

	function getOpt(obj,path,def){
		if(!obj || !path){return def;}
		if(path.length){
			var key = path.shift();
			for(var n in obj){
				if(n==key){
					return getOpt(path,def,obj[n]);
				}
			}
			return def;
		}
		return obj;
	}

	function run_hooks(hooks,data,locals){
		var i = 0, l = hooks.length,fn;
		for(i;i<l;i++){
			fn = hooks[i];
			fn(data,locals,data);
		}
	}


	function render(content,locals){
		if(!content){return '';}
		locals = locals || {};
		var dataBefore = {str:content}
		if(hooks['before'] && hooks.before.length){run_hooks(hooks.before,dataBefore,locals);}
		var jsonMLTree = md.parse(dataBefore.str,(locals && locals.dialect) || md.Markdown.dialects.Maruku);
		if(hooks['json'] && hooks.json.length){run_hooks(hooks.json,jsonMLTree,locals);}
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

	function make_json_filter(regxp,baseElem,parse){
		if(!parse){
			parse = baseElem;
			baseElem = 'span';
		}
		var f;
		if(typeof regxp == 'function'){
			f = function Check(jsonml,locals){
				var r = regxp.call(f,jsonml,locals);
				if(r === false){
					var i = 1, l = jsonml.length;
					for(i;i<l;i++){
						if(Array.isArray(jsonml[i])){
							Check(jsonml[i],locals);
						}
					}
				}
			}
		}
		else{
			f = function Filter(jsonml,locals){
				var i, l, ret,r;
				if(typeof jsonml == 'string'){
					if(jsonml.match(regxp)){
						jsonml = jsonml.split(regxp);
						ret = [baseElem];
						for(i=0,l=jsonml.length;i<l;i++){
							if(!jsonml[i] || !jsonml[i].length){continue;}
							r = parse.call(f,jsonml[i],locals,ret);
							if(r && r.length){ret.push(r);}
						}
						return ret;
					}
					return jsonml;
				}
				else{
					for(i=0,l=jsonml.length;i<l;i++){
						ret = Filter(jsonml[i],locals);
						if(ret){jsonml[i] = ret;}
					}
				}
			}
			f.regExp = regxp;
		}
		return f;
	}

	function register_json_filter(regxp,baseElem,parse){
		var filter = make_json_filter(regxp,baseElem,parse);
		register_hook('json',filter);
	}

	render.register = register_hook;
	render.markdown = md;
	render.makeJsonFilter = make_json_filter;
	render.registerJsonFilter = register_json_filter;
	render.getOpt = getOpt;
	return render;

})();