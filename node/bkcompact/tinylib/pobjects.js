var exports = (function() {
	var _targets = {};
	function createHandlerFor(targetClass) {
		if (targetClass.__symbolmark != null) {
			return _targets[targetClass.__symbolmark];
		}
		targetClass.__symbolmark = Symbol("Class handler"); 
		return produceHandlerFor(targetClass.prototype);
	}
	function produceHandlerFor(proto) { // Separate to minimize the closure
		var publics = {};
		var methods = {};
		for (var k in proto) {
			if (k.indexOf("$$") == 0) {
				// completely private
			} else if (k.indexOf("$") == 0) {
				// Read only if field, private if function
				if (typeof proto[k] != "function") {
					publics[k] = 1;
				}
			} else {
				// Read only if function, public otherwise
				if (typeof proto[k] == "function") {
					if (proto[k].$replaceable === true) {
						publics[k] = 2; // Function that can be replaced on individual instances. It cannot access private fields
					} else {
						publics[k] = 1;
						methods[k] = true;
					}
				} else {
					publics[k] = 2;
				}
			}
		}
		
		return {
			get: function(target, prop, receiver) {
				if (publics[prop] > 0) {
					if (methods[prop]) {
						return function() {
							return target[prop].apply(target, arguments);
						}
					}
					return Reflect.get(...arguments);
				}
				return undefined;
			},
			set: function(target, prop, val) {
				if (publics[prop] > 1) {
					return Reflect.set(...arguments);
				} else {
					throw prop + " is not writable";
				}
			},
			has: function(target, prop) {
				if (publics[prop] > 0) return Reflect(...arguments);
				return false;
			}
		};
	}
	return {
		envelope: function(classFunction, instance) {
			return new Proxy(instance, createHandlerFor(classFunction));
		}
	}
})();

module.exports = exports;