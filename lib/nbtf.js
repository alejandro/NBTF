/* This program is free software. It comes without any warranty, to
 * the extent permitted by applicable law. You can redistribute it
 * and/or modify it under the terms of the Do What The Fuck You Want
 * To Public License, Version 2, as published by Sam Hocevar. See
 * http://sam.zoy.org/wtfpl/COPYING for more details. */



module.exports = function nbtf() {
	var binary = require('./binary');
	
	var TagType = {
		"End" : 0,
		"Byte" : 1,
		"Short" : 2,
		"Int" : 3,
		"Long" : 4,
		"Float" : 5,
		"Double" : 6,
		"ByteArray" : 7,
		"String" : 8,
		"List" : 9,
		"Compound" : 10
	};
	
	var getTagName = function(type) {
		for(name in TagType) {
			if(TagType.hasOwnProperty(name) && TagType[name] == type) {
				return name;
			}
		}
	}
	
	var ValueReader = function(binaryReader) {
		var intReader = function(bits) {
			return function() {
				return binaryReader.getInt(bits, true);
			}
		}
		
		var floatReader = function(precisionBits, exponentBits) {
			return function() {
				return binaryReader.getFloat(precisionBits, exponentBits);
			}
		}
		
		this.getByte = intReader(8);
		this.getShort = intReader(16);
		this.getInt = intReader(32);
		this.getLong = intReader(64);
		this.getFloat = floatReader(23, 8);
		this.getDouble = floatReader(52, 11);
		
		
		this.getByteArray = function() {
			var len = this.getInt(),
				bytes = [],
				i = 0;
			for(; i < len; i++) {
				bytes.push(this.getByte());
			}
			return new Buffer(bytes);
		};
		
		this.getString = function() {
			return binaryReader.getUTF8(this.getShort());
		};
		
		this.getList = function() {
			var type = this.getByte(),
			    length = this.getInt(),
			    values = [],
			    i = 0;
			for(; i < length; i++) {
				values.push(this['get' + getTagName(type)]());
			}
			return values;
		}
		
		this.getCompound = function() {
			var values = {};
			while(true) {
				var type = this.getByte();
				if(type === TagType.End) {
					break;
				}
				var name = this.getString();
				var value = this['get' + getTagName(type)]();
				values[name] = value;
			}
			return values;
		}
		
	}
	
	var parseData = function(data) {
		var binaryReader = new binary.Reader(data, true);
		var valueReader = new ValueReader(binaryReader);
		
		var type = valueReader.getByte();
		if(type != TagType.Compound) {
			throw 'Root tag is not a compound!';
		}
		
		var name = valueReader.getString();
		var value = valueReader.getCompound();
		
		if(name === '') {
			return value;
		} else {
			var result = {};
			result[name] = value;
			return result;
		}
	};
	
	this.parse = function(data) {
		return parseData(data);
	}
}