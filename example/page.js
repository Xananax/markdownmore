module.exports = function(markdown){


	// Adds text around the generated html
	function wrapHTML(data,locals){
		data.str = '<html><head><title>'+
			locals.title+
			'</title>'+
			locals.styles.map(function(s){return '<link rel="stylesheet" media="all" href="'+s+'.css"></link>'}).join('')+
			'</head><body><h1>'+locals.title+'</h1>'+
			data.str+
			'<div id="markdownRaw">'+
				'<a href="#" class="toggler">Show Raw Markdown</a>'+
				'<div class="togglee">'+
					'<textarea id="markdownText" cols="55" rows="20">'+locals.markdownText+'</textarea>'+
				'</div>'+
			'</div>'+
			locals.scripts.map(function(s){return '<script src="'+s+'.js"></script>'}).join('')+
			'</body></html>'
		;
	}

	// registers functions on the generated html
	markdown.register('after')(wrapHTML);
	
};