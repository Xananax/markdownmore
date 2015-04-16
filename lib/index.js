var markdown = require('./markdown')
require('../filters')(markdown);

module.exports = markdown;