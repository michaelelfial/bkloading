const fs = require("fs");

var exports = (function() {
	
	function LinearEnum(path, reXclude) {
		this.path = path;
		this.reXclude = reXclude;
	}
	LinearEnum.prototype.all = function(callback /* dirent */) {
		var dirents = fs.readdirSync(this.path, { withFileTypes: true });
		return dirents;
	}
	
	return LinearEnum;
})();



module.exports = exports;