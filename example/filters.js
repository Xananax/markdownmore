module.exports = function(markdown){


	require('../filters/templating')(markdown);
	require('../filters/headers')(markdown);
	require('../filters/checkboxes')(markdown);
	require('../filters/embed')(markdown);
	require('../filters/entities')(markdown);
	require('../filters/icons')(markdown);
	require('../filters/iframes')(markdown);
	require('../filters/linebreaks')(markdown);
	require('../filters/mentions-hashtags')(markdown);
	require('../filters/wrap')(markdown);
	
	// OPTIONAL PLUGINS:
	require('../filters/toc')(markdown);
	require('../filters/calculus')(markdown);

	// specific for the demo:
	require('./page')(markdown);
	

}