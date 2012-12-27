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

	render('<div class="title">Fish</div><div class="content">前三页是ajax拉取数据再渲染。后两页是直接渲染。</div>');

	function render(html){
		$("#ppt").hide().html(html).show("slow");
	}

});