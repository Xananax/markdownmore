modulex-exports = function(markdown){
	// follow up to the Table of Contents creation
	// This function actually inserts the TOC in the document
	markdown.registerJsonFilter(function(jsonml,locals){
		if(locals.tocLinks){
			locals.tocLinks.unshift('ul',{class:'toc'});
			jsonml.splice(1,0,locals.tocLinks);
		}
		return true;
	});
}