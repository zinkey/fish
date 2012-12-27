Fish.ready(function(sandbox) {

	var dir = sandbox.getDir();
	var hash = sandbox.getHash();
	var href = sandbox.getHref();
	var path = sandbox.getPath();
	var realpath = sandbox.getRealpath();
	var url = sandbox.getUrl();
	var file = sandbox.getFile();

	$("#ppt").css("background","url("+dir+"/bg.jpg)");
	
	$.ajax({
	  url: dir+"template.html",
	  context: document.body
	}).done(function(data) { 
		if (sandbox.getHash()!=location.hash){
			return;
		}
		render(YayaTemplate(data).render({
			dir:dir,
			hash:hash,
			href:href,
			path:path,
			realpath:realpath,
			url:url,
			file:file
		}));
	});

	function render(html){
		$("#ppt").hide().html(html).show("slow");
	}

});