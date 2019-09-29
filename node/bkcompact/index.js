
var cmdline = require("./tinylib/cmdline.js");

function main() {
	console.log(process.argv);
	var cl = new cmdline();
	
	console.log("option --x " + cl.option("x", null, "alpha"))
	console.log("flag --f " + cl.flag("f"));
	console.log("var v1=" + cl.variable("v1"));
	
}


main();