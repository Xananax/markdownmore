module.exports = function(markdown){
	// creates a Table of Contents Automatically
	// This function adds the ids to the titles
	// the function that actually adds the TOC in the
	// document is below
	markdown.registerJsonFilter(function(jsonml,locals){
		if(jsonml[0] === 'header'){
			var level = jsonml[1].level;
			if(level>locals.minimumTOCLevel){return false;}
			if(jsonml[1].id){return false;}
			var title = jsonml[2];
			var id = 'toc-'+title.toLowerCase().replace(/\s/g,'-').replace(/:|\[|\]|\{|\}|\%|\(|\)|\^|\$/,'');
			jsonml[1].id = id;
			if(!locals.tocLinks){locals.tocLinks = [];}
			locals.tocLinks.push([
				'li'
			,	[
					'link'
				,	{href:'#'+id}
				,	title[0].toUpperCase()+title.slice(1)
				]
			]);
			return true;
		}
		return false;
	});

}