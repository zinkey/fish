Fish.ready(function(sandbox) {
	var url = sandbox.getUrl();
	var value = url.split("?")[1].replace("page=","");
	$("#ppt").css("background","url(ppt/"+value+"/bg.jpg)");
});