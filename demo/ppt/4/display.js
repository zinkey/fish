Fish.ready(function(sandbox) {

	var dir = sandbox.getDir();

	$("#ppt").css("background","url("+dir+"/bg.jpg)");
	
	/*
	$.ajax({
	  url: dir+"template.html",
	  context: document.body
	}).done(function(data) { 
		if (sandbox.getHash()!=location.hash){
			return;
		}
		render(YayaTemplate(data).render({}));
	});
	*/

	render('<div class="title">Fish</div><div class="content">可通过compiler.js将需要打包的部分或全部js合并，并在html页面中引用。</div>');

	function render(html){
		$("#ppt").hide().html(html).show("slow");
	}

});