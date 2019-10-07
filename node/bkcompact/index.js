
var cmdline = require("./tinylib/cmdline.js");
const tst = require("./tinylib/direnum.js");

function main() {
	console.log(process.argv);
	var cl = new cmdline();
	
	console.log("option --x " + cl.option("x", null, "alpha"))
	console.log("flag --f " + cl.flag("f"));
	console.log("var file=" + cl.variable("file"));
	
	var denum = new tst(cl.variable("file"));
	var arr = denum.all();
	for (var i = 0; i < arr.length; i++) {
		var ent = arr[i];
		console.log(ent.name);
	}
	
	// console.log("fullpath(file)=" + tst.fullpath(cl.variable("file")));
	
}


main();