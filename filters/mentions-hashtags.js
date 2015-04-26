registered = false;

module.exports = function(markdown){

	if(registered){return false;}
	registered = true;

	require('./modifiers')(markdown);

	markdown.modifier
		('@',function(word,locals){
			return [
				'a'
			,	{class:'mention',href:'#/mentions/'+word}
			,	['em','@']
			,	['span',word]
			]
		})
		('#',function(word,locals){
			return [
				'a'
			,	{class:'hashtag',href:'#/hashtags/'+word}
			,	['em','#']
			,	['span',word]
			]
		})
	;

}