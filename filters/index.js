
module.exports = function(markdown){

	require('./templating')(markdown);
	require('./headers')(markdown);
	require('./checkboxes')(markdown);
	require('./embed')(markdown);
	require('./entities')(markdown);
	require('./icons')(markdown);
	require('./iframes')(markdown);
	require('./linebreaks')(markdown);
	require('./mentions-hashtags')(markdown);
	require('./wrap')(markdown);
	
}