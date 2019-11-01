var pobjects = require("./pobjects.js");
const fs = require("fs");

var exports = (function() {
	function Directory(path) {
		this.path = path;
		return pobjects.envelope(Directory, this);
	}
	Directory.prototype.list = function() {
		return fs.readdirSync(this.path, {withFileTypes: true});
	}
	Directory.prototype.cd = function(rel) {
		///
	}
	
	
	
	
	
})();

module.exports = exports;