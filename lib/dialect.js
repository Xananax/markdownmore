var markdown = require('markdown').markdown;
var dialect = module.exports = markdown.Markdown.subclassDialect(markdown.Markdown.dialects.Maruku);

var langs = {
	'js':'javascript'
,	'htm':'markup'
,	'html':'markup'
}

dialect.inline["`"] = function inlineCode( text ) {
	// Inline code block. as many backticks as you like to start it
	// Always skip over the opening ticks.
	var m = text.match( /(`+)(?:(\w+)\s*?\n)?(([\s\S]*?)\1)/ );
	if(m && m[3]){
		var length = m[1].length + m[3].length;
		var text = m[4];
		if(m[1].length > 2){
			if(m[2]){
				length+=m[2].length+1;
				var lang = m[2].replace(/\s/g,'').toLowerCase();
				lang = langs[lang] ? langs[lang] : lang;
				return [length,["code_block",{class:'language-'+lang},text]]
			}
			return [length,["code_block",text]]
		}
		return [length,["inlinecode", text]];
	}
	else {
		// TODO: No matching end code found - warn!
		return [1,"`"];
	}
}