/**
 * @name:Fish - a hash driven OPOA
 * @author:yaya
 * 2012 MIT License
 */
;(function(win){
	if (win.Fish){
		return;
	}
	var lasthash,
		timer,
		ie67listen,
		iframedocument,
		fn,
		tag,
		isrun,
		config,
		mapfn = {},
		doc = document,
		interval = 50,
		ie = /msie (\d+\.\d+)/i.test(navigator.userAgent)?(doc.documentMode || + RegExp["$1"]):false,
		ie67 = (ie&&ie<8) || (!("onhashchange" in win)),
		fishcallbackname = "__FishCallback__"+(+new Date).toString(36),
		ref = doc.getElementsByTagName('script')[0],
		Fish = {
			ready:function(callback,realpath){ 
				fn = callback;
				if (realpath){
					mapfn[absolutizeURI(location.href,realpath)] = callback;
				}
			},
			start:function(conf){
				if (isrun){
					return;
				}
				config = conf || {};
				if (config.sandbox){
					for (var i in config.sandbox){
						if (obj.hasOwnProperty(i)){
							Sandbox.prototype[i] = (function(i){
								return function(){
									return config.sandbox[i].apply(this,arguments);
								}
							})(i);
						}
					}
				}
				if (ie67){
	                if (!ie67listen){
	                    ie67listen = true;
	                    lasthash = getHash();
	                    ie67init();
	                }
	            }
	            else{
	                if (win.attachEvent){
	                    win.attachEvent("onhashchange",handle);
	                }
	                else{
	                     win.addEventListener("hashchange",handle,false);
	                }
	            }
				handle();
				isrun = true;
			},
			stop:function(){
				if (ie67){
	                clearTimeout(timer);
	            }
	            else{
	                if (win.detachEvent){
	                    win.detachEvent("hashchange",handle);
	                }
	                else{
	                    win.removeEventListener("hashchange",handle,false);
	                }
	            }
				isrun = false;
			}
		},
		getHash = function(){
	  		if (ie == 6){
	  			 return '#' + location.href.replace(/^[^#]*#?(.*)$/, "$1");
	  		}
	        return location.hash;
	    },
	    poll = function() {
	    	var hash = getHash();
	        if (hash !== lasthash) {
	            lasthash = hash;
	            hashChange(hash);
	        }
	        timer = setTimeout(poll, interval);
	    },
	    hashChange = function(hash) {
	    	try {
	            iframedocument.open();
	            iframedocument.write('<html><head><title>'+doc.title+" "+hash+'</title>'+(doc.domain != location.hostname && doc.domain != ( '[' + location.hostname + ']' )?'<script>document.domain="'+doc.domain+'";<\/script>':'')+'<script>parent.Fish.'+fishcallbackname+'("'+hash+'")<\/script></head></html>');
	            iframedocument.close();
	        } catch (ex) {}
	    },
	    ie67init = function(){
	        Fish[fishcallbackname] = function(argument) {
	            var c = argument;
	            var ch = getHash();
	            if (c != ch) {
	                location.hash = c; 
	                lasthash = c;
	            }
	            handle();    
	        }
	        var iframe = doc.createElement("iframe");
	        iframe.height = 0;
	        iframe.width = 0;
	        iframe.style.display = "none";
	        iframe.tabindex = "-1";
	        iframe.title = "empty";
	        iframe.src = "javascript:0;";
	        doc.documentElement.insertBefore(iframe,doc.documentElement.firstChild);
	        iframedocument = iframe.contentWindow.document;
	        doc.onpropertychange = function(){
	            try {
	                if ( event.propertyName === 'title' ) {
	                    iframedocument.title = doc.title + " " +getHash();
	                }
	            } catch(ex) {}
	        };
	        hashChange(getHash());
	        poll();
	    },
	    parseURI = function(url) {
			var m = String(url).replace(/^\s+|\s+$/g, '').match(/^([^:\/?#]+:)?(\/\/(?:[^:@]*(?::[^:@]*)?@)?(([^:\/?#]*)(?::(\d*))?))?([^?#]*)(\?[^#]*)?(#[\s\S]*)?/);
			return (m ? {
				href     : m[0] || '',
				protocol : m[1] || '',
				authority: m[2] || '',
				host     : m[3] || '',
				hostname : m[4] || '',
				port     : m[5] || '',
				pathname : m[6] || '',
				search   : m[7] || '',
				hash     : m[8] || ''
			} : null);
		},
	    removeDotSegments = function(input) {
			var output = [];
			input.replace(/^(\.\.?(\/|$))+/, '')
				.replace(/\/(\.(\/|$))+/g, '/')
				.replace(/\/\.\.$/, '/../')
				.replace(/\/?[^\/]*/g, function (p) {
					if (p === '/..'){
						output.pop();
					}
					else{
						output.push(p);
					}
			});
			return output.join('').replace(/^\//, input.charAt(0) === '/' ? '/' : '');
		},
	    absolutizeURI = function(base, href) {
			href = parseURI(href || '');
			base = parseURI(base || '');
			return !href || !base ? null : (href.protocol || base.protocol) +(href.protocol || href.authority ? href.authority : base.authority) + removeDotSegments(href.protocol || href.authority || href.pathname.charAt(0) === '/' ? href.pathname : (href.pathname ? ((base.authority && !base.pathname ? '/' : '') + base.pathname.slice(0, base.pathname.lastIndexOf('/') + 1) + href.pathname) : base.pathname)) + (href.protocol || href.authority || href.pathname ? href.search : (href.search || base.search)) + href.hash;
		},
		Sandbox = function(args){
			args = args || {};
			for (var i in args){
				var l = i.charAt(0);
				this["get"+i.replace(l,l.toUpperCase())]=(function(i){
					return function(){
						return args[i];
					}
				})(i);
			}
		},
		getUrlObj = function(hash){
			var url;
			var file;
			var dir;
			var path;
			var realpath;
			path = realpath =  hash.slice(2,hash.length);
			if (config.router){
				realpath = config.router(realpath);
			}
			url = absolutizeURI(location.href,realpath);
			file = url.replace(/([^#\?]*).*/,"$1");
			if (file.charAt(file.lastIndexOf("/")-1)=="/"){
				dir = file+"/";
			}
			else{
				dir = file.slice(0,file.lastIndexOf("/")+1);
			}
			return {
				hash:hash,
				url:url,
				file:file,
				dir:dir,
				path:path,
				realpath:realpath,
				href:location.href
			};
		},
		handle = function(){
			var hash = getHash();
			if (hash.charAt(1)=="!"){
				var obj = getUrlObj(hash);
				if (parseURI(obj.url).host != location.host && !config.crossdomain){
					return;
				}
				if (mapfn[obj.file]){
					mapfn[obj.file](new Sandbox(obj));
					return;
				}
				loadjs(obj);
			}
		},
		loadjs = function(obj){
			tag = new Date-Math.random();
			var script = doc.createElement("script");
			script.onload = script.onreadystatechange = function () {
				if (!script.readyState || script.readyState == "loaded"|| script.readyState == "complete") {
					var sandbox = new Sandbox(obj);
					mapfn[obj.file] = fn;
					if (script.getAttribute("tag") == tag && fn){
						fn(sandbox);
					}
					ref.parentNode.removeChild(script);
				}
			};
			script.setAttribute('type','text/javascript');
			script.setAttribute("src",obj.url);
			script.setAttribute('tag',tag);
			ref.parentNode.insertBefore(script, ref);
		};
	win.Fish = Fish;	
})(window);