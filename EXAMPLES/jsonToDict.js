function jsobj_to_dict(o) {
	var d = new Dict();

	for (var key in o)	{
		var value = o[key];

		if (!(typeof value === "string" || typeof value === "number")) {
			value = jsobj_to_dict(value);
		}
		d.set(key, value);
	}
	return d;
}

function dict_to_jsobj(dict) {
	var o = new Object();
	var keys = dict.getkeys();

	if (keys instanceof Array) {
		for (var i = 0; i < keys.length; i++)
		{
			var value = dict.get(keys[i]);

			if (value && value["push_to_coll"]) {
				value = dict_to_jsobj(value);
			}
			o[keys[i]] = value;
		}
	} else {
		var value = dict.get(keys);
		o[keys] = value;
	}

	return o;
}
