module.exports = function(readme){
	return {
		title:'Markdown-More Examples'
	,	scripts:[
			'vendor/prism'
		,	'//code.jquery.com/jquery-1.11.2.min'
		,	'checkboxes'
		,	'main'
		]
	,	'styles':[
			'vendor/prism'
		,	'//maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min'
		,	'main'
		]
	,	markdownText: readme
	,	helpers:{
			add:function(a,b){return a+b;}
		}
	,	markdown:require('./options')
	};
}