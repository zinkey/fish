～ Fish ～～～～


## 介绍

Fish是一个hash驱动的OPOA轻量实现，主要作用是实现通过hash变化来执行不同的js操作。

## 使用方法

Fish只提供了三种方法：

1.Fish.start 开始侦听hash
	
	Fish.start()
	
2.Fish.stop 停止侦听hash

	Fish.stop()

3.Fish.ready 运行

	Fish.ready(function(){

		alert("ok!");

	});


在html页面引入fish.js后，当hash值是#!这样的形式时，fish会去载入#!后面跟的js地址并执行。
比如访问index.html#!a.js,则会去载入a.js。而a.js需书写为上面3中的形式。
"#!"后面的我们称之为path,如上例中的a.js。这个path的路径是相对于html页面的，可自由书写。如index.html#!../b.js则会去加载index.html上一层级中的b.js。而index.html#!/c.js则会去加载根目录下的c.js。


router路由

如果直接写index.html#!a.js有时候不能满足我们的一些需求，比如直观上看起来我们希望访问index.html#!a则表示访问index.html#!a.js。那我们则需要配置router了。配置router非常简单且强大，还记得上面1中的Fish.start吧,这个方法可以带一个config对象，里面可以设置router,比如我们可以这样配置：

	Fish.start({
		router:functon(path){
			return path+".js";
		};
	})

router里面的传入参数表示地址栏#!后面的值，而返回值则是实际想要访问js的地址（相对于html页面，当然你也可以写绝对路径）。再来一个例子，有时候为了版本控制，我们希望一些js不要访问的是缓存的内容，那我们可以这样配置：

	var version = "1.0.0"
	Fish.start({
		router:functon(path){
			return path+".js?"+version;
		};
	})

那么我们访问index.html#!a的时候会去加载a.js?1.0.0。
之前提到，#!也可以是绝对路径。比如访问http://uloveit.com.cn/fish/index.html#!http://www.abc.com/1.js，那么是不是可以加载这个1.js呢？其实是不行的，因为这样跨域了，为了安全性默认是不能加载跨域脚步的。但我们可以通过设置crossdomain来允许(但建议采用下面的形式来避免访问跨域js带来的风险)：

	var map = {
		"a":"http://www.abc.com/1.js",
		"b":"http://www.cba.com/2.js",
		"404":"404.js"
	};
	Fish.start({
		router:functon(path){
			return map[path]||map["404"];
		},
		crossdomain:true
	})


现在再来看看Fish.ready这个方法。这个方法会有一个sandbox参数可调用。

	Fish.ready(function(sandbox){
		alert(sandbox.getUrl());
	})

具体方法和对照表如下：

	var version = "abc";
	Fish.start({
		router:functon(path){
			return path+"/display.js?"+version;
		}
	});

	访问：http://localhost/etao/fish/demo/#!ppt/3

	sandbox.getDir():http://localhost/etao/fish/demo/ppt/3/
	sandbox.getHash:#!ppt/3
	sandbox.getHref:http://localhost/etao/fish/demo/#!ppt/3
	sandbox.getPath:ppt/3
	sandbox.getRealpath:ppt/3/display.js?abc
	sandbox.getUrl:http://localhost/etao/fish/demo/ppt/3/display.js?abc
	sandbox.getFile:http://localhost/etao/fish/demo/ppt/3/display.js

这里的getHash以及getHref都是页面访问时的值。如果我们做一个ajax异步操作，当结果返回时，我们可以通过判断sandbox.getHash()是否等于location.hash来决定是否渲染页面。

sandbox的这些是默认方法，如果觉得不够用，可以扩充，还是在Fish.start里面扩张：

	Fish.start({
		sandbox:{
			myGetHash:function(){
				return this.getHash();
			}
		}
	});

这样就扩展了一个sandbox.myGetHash方法，作用同sandbox.getHash一样。在自定义扩展的方法里，this指向sandbox，所以可以用sandbox默认提供的方法来构建新的方法。


##打包

如果需要将动态访问的js打包起来，这样就不需要动态去加载了，可以使用tool文件夹里面的compiler.js。把需要打包的js（使用Fish.ready的js文件）写在一个配置文件里面，如config.js：
	
	{
		"merge.js":[
			"1.js",
			"2.js"
		]
	}

这样就会生成merger.js，在Fish.start前引入这个js，则当访问index.html#!1.js时就不需要动态去请求了。


##说明
	
打包会自动添加路径到Fish.ready的第二个参数中，
	
	Fish.ready(function(sandbox){
		alert("ok");
	},"1.js");

当第二个参数有值时，会预先缓存下来，当hash变化时不会去动态请求js。所以当特殊情况可采用这种方式拦截请求。但一般情况不建议手工书写。一般开发时候书写1.js如下：

	Fish.ready(function(sandbox){
		alert("ok");
	});

demo:http://uloveit.com.cn/fish/demo/