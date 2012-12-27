/*yaya event 1.1.0 under MIT License 2011.3.25*/
var YayaEvent = window.YayaEvent = (function(){
	var events = [];
	var  eventlist={};
	var tag = "action";
	function contains(item){
		for (var i=0;i<events.length;i++)
		{
			if (events[i]===item)
			{
				return true;
			}
		}
		return false;
	}
	function addEvt(type,listener){
		type = type.toLowerCase().replace(/^on/,"");
		if (document.addEventListener) {
			document.addEventListener(type,listener, false);
		} else if (document.attachEvent) {
			document.attachEvent('on' + type,listener);
		}
	}
	function bindevt(evt){
		addEvt(evt,function(e){
			e=e||window.event;
			var target = e.target||e.srcElement;
			while (target)
			{
				var action = target.getAttribute&&target.getAttribute(tag);
				if (action&&eventlist[action]&&eventlist[action][evt]&&eventlist[action][evt].call(target,e)!=true)
				{
					return;
				}
				target = target.parentNode;
			}
		});
	}
	return {
		unbind:function(map){
			for (var i in map)
			{
				map[i] = typeof map[i]=="object"?map[i]:[map[i]];
				for (var j=0;j<map[i].length;j++)
				{
					if (eventlist[i]&&eventlist[i][map[i][j]])
					{
						delete eventlist[i][map[i][j]];
					}
				}
			}
		},
		bind:function(map,_tag){
			tag=_tag||tag;
				for (var i in map)
				{
					if (!eventlist[i])
					{
						eventlist[i]={};
					}
					for (var evt in map[i])
					{
						if (!contains(evt))
						{
							events.push(evt);
							bindevt(evt);
						}
						eventlist[i][evt]=map[i][evt];
					}
				}
		}
	};
})();