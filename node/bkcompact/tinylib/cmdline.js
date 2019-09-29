var pobjects = require("./pobjects.js");
/*
	Need to add validation and possibly pre-read in order to avoid mistaking option values with commands.
*/
var exports = (function() {
	function CmdLine() {
		this.args = process.argv.slice(2);
		this.node = process.argv[0];
		this.script = process.argv[1];
		return pobjects.envelope(CmdLine, this);
	}
	CmdLine.prototype.$$options = {};
	CmdLine.prototype.$$variables = {};
	CmdLine.prototype.$$commands = {};
	CmdLine.prototype.option  = function(optname, alias, defarg) {
		if (typeof alias == "string" && alias.length > 0) throw "The alias argument to option has to be one symbol only";
		if (optname in this.$$options) return this.$$options[optname];
		for (var i = 0; i < this.args.length; i++) {
			if (this.args[i] == ("--" + optname) || (alias != null && this.args[i] == ("-" + alias))) {
				this.$$options[optname] = defarg?defarg:true;
				this.args.splice(i,1);
				if (defarg) return defarg;
				return true;
			}
			var len = 0;
			if (this.args[i].indexOf("--" + optname + ":") == 0) {
				len = ("--" + optname +":").length;
			} else if (alias != null && this.args[i].indexOf("-" + alias +":") == 0) {
				len = ("-" + alias +":").length;
			}
			
			if (len > 0) {
				var v = this.args[i].slice(len);
				
				this.args.splice(i,1);
				if (v != null && v.length > 0) {
					this.$$options[optname] = v;
				
					return v;
				}
				if (defarg) {
					this.$$options[optname] = defarg;
					return defarg;
				} else {
					this.$$options[optname] = true;
					return true;
				}
				
			}
		}
		return false;
	}
	CmdLine.prototype.flag  = function(optname, alias) {
		if (typeof alias == "string" && alias.length > 0) throw "The alias argument to flag has to be one symbol only";
		if (optname in this.$$options) return true;
		for (var i = 0; i < this.args.length; i++) {
			if (this.args[i] == ("--" + optname) || (alias != null && this.args[i] == ("-" + alias))) {
				this.$$options[optname] = true;
				this.args.splice(i,1);
				return true;
				
			}
		}
		return false;
	}
	CmdLine.prototype.variable  = function(varname, defaultVal) {
		if (varname in this.$$variables) return this.$$variables[varname];
		for (var i = 0; i < this.args.length; i++) {
			if (this.args[i].indexOf(varname + "=") == 0) {
				var val = this.args[i].slice((varname + "=").length);
				if (val.indexOf("\'") == 0 || val.indexOf("\"") == 0) val = val.slice(1,-1);
				this.$$variables[varname] = val;
				this.args.splice(i);
				return val;
			}
		}
		return null;
	}
	CmdLine.prototype.hascommand = function(cmdname) {
		if (cmdname in this.$$commands) return true;
		for (var i = 0; i < this.args.length; i++) {
			if (this.args[i] == cmdname) {
				this.$$commands[cmdname] = true;
				this.args.slice(i,1);
				return true;
			}
				
		}
		return false;
	}
	/*
		callback := function(CmdLine, args)
	*/
	CmdLine.prototype.command = function(cmdname, /* 0 or more */ args, /* required */ callback) {
		if (this.hascommand(cmdname)) {
			if (arguments.length >= 2) {
				var cb = arguments[arguments.length - 1];
				if (typeof cb != "function") throw "The last argument to command has to be a function(CmdLine, args ...)";
				var args = [this];
				for (var i = 1; i < arguments.length - 1; args.push(arguments[i++]));
				return cb.apply(null, args);
			} else {
				throw "command requires at least two arguments (cmdname, callback)";
			}
		} else {
			return null;
		}
	}
	
	return CmdLine;
})();

module.exports = exports;
