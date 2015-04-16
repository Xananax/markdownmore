module.exports = function(markdown){


	// Adds text around the generated html
	function wrapHTML(data,locals){
		data.str = '<html><head><title>'+
			locals.title+
			'</title></head><body><h1>TOC</h1>'+
			data.str+locals.script
			'</body></html>'
	}

	// registers functions on the generated html
	markdown.register('after')(wrapHTML);
	
};