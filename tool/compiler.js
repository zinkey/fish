#!/usr/bin/env node
var fs = require("fs");
var args = process.argv.slice(2);
var configfile = args[0];
function readFile(filename,callback){
	fs.readFile(filename,"utf8",function(err,data){
		if (err) throw err;
		callback&&callback(data);
	});
}
function writeFile(filename,content,callback){
	fs.writeFile(filename,content, function (err) {
  		if (err) throw err;
		callback&&callback();
	});
}
readFile(configfile,function(data){
	var config = eval("("+data+")");
	for (var i in config){
		var array = config[i];
		var content = "";
		var num = 0;
		for (var j=0;j<array.length;j++){
			readFile(array[j],(function(j){
				return	function(data2){
					data2 = data2.replace(/([\s\S]*)(\}\s*\)\s*;?)/m,"$1},\""+ array[j]+"\");");
					content += data2;
					if (++num == array.length){
						writeFile(i,content);
					}
				}
			})(j));
		}
	}
});