module.exports = {
	checkbox:{
		class_prefix: 'input-checkbox'
	,	id_prefix: 'checkbox'
	,	ids:0
	}
,	embed:{
		class_prefix:'embed'
	,	providers:{
			'dailymotion.com':function(frag,w,h){
				frag = frag.split('_');
				var url = frag.shift();
				var id = frag.shift().replace(/-/g,'');
				var tag = frag.shift();
				if(!url){return false;}
				w = w || 480;
				h = h || 270;
				return ([
					'iframe'
				,	{
						height:h+'px'
					,	width:w+'px'
					,	allowfullscreen:'allowfullscreen'
					,	src:'//www.dailymotion.com/embed/'+url
					,	frameborder:'0'
					}
				]);
			}
		}
	}
,	entities:{
		class_prefix:'entity'
	,	render:function(className,content){
			return ['span',{class:className},['span',content]];
		}
	,	characters:{
			'(c)':['copyright','©']
		,	'<3':['heart','♥']
		,	'(tm)':['trademark','™']
		,	'(r)':['registered','®']
		,	'~=':['approx','≈']
		,	'>=':['greaterOrEqual','≥']
		,	'<=':['lowerOrEqual','≤']
		,	'!=':['notEqual','≠']
		,	'-->>':['rightArrow','⇒']
		,	'<<--':['leftArrow','⇐']
		,	'<<-->>':['leftRightArr','⇔']
		,	'->':['rightArr','→']
		,	'<-':['leftArr','←']
		,	'<->':['leftRightArr','↔']
		,	'--':['dash','—']
		}
	}
,	headers:{
		id_prefix:''
	,	level:3
	}
,	icons:{
		class_prefix:'fa'
	,	render:function(className,content){
			return ['i',{class:className},['span',content]];
		}
	,	characters:{
			'+':'plus-circle'
		,	'-':'minus-circle'
		,	'#':'check'
		,	'x':'times'
		,	'?':'question'
		}
	}
,	iframes:{
		class_prefix:'iframe'
	,	default_width:400
	,	default_height:300
	,	default_border:0
	}
,	wrap:{
		class_suffix:'-wrapper'
	,	wrappers:['table']
	}
,	toc:{
		max_level:3
	,	min_level:1
	,	class_prefix:'toc'
	,	title:'Table of Contents'
	}
}