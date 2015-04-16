module.exports = function(markdown){
	// replaces line breaks with <br>
	markdown.registerJsonFilter(/(\n|\r)/g,function(chunk){
		if(chunk.match(this.regExp)){
			return ['linebreak'];
		}
		return chunk;
	});
}