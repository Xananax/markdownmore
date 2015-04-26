module.exports = function(markdown){

	var mathjs = require('mathjs');
	var regExp = /([a-zA-Z$][a-zA-Z0-9_$]*)?=(?:\(([\s\S]+)\)(!)?)/m;

	markdown.registerTokenFilter(
		function(locals){
			return regExp;
		}
	,	function tokenize(variable,expression,negate,match){
			var scope = this.markdown.calculus;
			var _var = (variable?variable+' = ':'');
			var expression = _var+expression;
			var props = {class: 'math'};
			var render;
			try{
				render = _var+mathjs.eval(expression,scope);
			}catch(e){
				props.class+=' math-invalid';
				props['data-error'] = e.toString();
				render = expression;
			}
			return negate? '' : ['span',props,render];
		}
	);

	markdown.register('before',function(data,locals){
		if(!locals.markdown){locals.markdown = {};}
		if(!locals.markdown.calculus){locals.markdown.calculus = {};}
	});
}