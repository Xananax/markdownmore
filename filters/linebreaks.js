registered = false;

module.exports = function(markdown){

	if(registered){return false;}
	registered = true;

	// replaces line breaks with two spaces then break
	markdown.register('before',function(data){
		data.str = data.str.replace(/([^\s])\n/g,'$1  \n');
	});
}