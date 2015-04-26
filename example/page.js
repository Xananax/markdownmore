module.exports = function(markdown){


	var ribbon = '<a href="https://github.com/Xananax/markdownmore"><img style="position: absolute; top: 0; left: 0; border: 0;" src="https://camo.githubusercontent.com/567c3a48d796e2fc06ea80409cc9dd82bf714434/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f6c6566745f6461726b626c75655f3132313632312e706e67" alt="Fork me on GitHub" data-canonical-src="https://s3.amazonaws.com/github/ribbons/forkme_left_darkblue_121621.png"></a>';

	// Adds text around the generated html
	function wrapHTML(data,locals){
		data.str = '<html><head><title>'+
			locals.title+
			'</title>'+
			locals.styles.map(function(s){return '<link rel="stylesheet" media="all" href="'+s+'.css"></link>'}).join('')+
			'</head><body><h1 style="text-align:center">'+locals.title+'</h1>'+
			data.str+
			'<div id="markdownRaw">'+
				'<a href="#" class="toggler">Show Raw Markdown</a>'+
				'<div class="togglee">'+
					'<textarea id="markdownText" cols="55" rows="20">'+locals.markdownText+'</textarea>'+
				'</div>'+
			'</div>'+
			ribbon+
			locals.scripts.map(function(s){return '<script src="'+s+'.js"></script>'}).join('')+
			'</body></html>'
		;
	}

	// registers functions on the generated html
	markdown.register('after')(wrapHTML);
	
};