module.exports = function(markdown){
	// replaces |>SomeRandomString with a link to "SomeRandomString"
	markdown.registerJsonFilter(/(\|>\s?[\w\d]+?)(\s|$|\.)/g,function(chunk){
		if(chunk.match(this.regExp)){
			var url = chunk.replace(/^\|>\s?/,'');
			return ['link',{class:'note-link',href:"/"+url},url];
		}
		return chunk
	});
}