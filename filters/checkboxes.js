registered = false;

module.exports = function(markdown){

	if(registered){return false;}
	registered = true;

	var options = {
		class_prefix: 'input-checkbox'
	,	id_prefix: 'checkbox'
	}

	markdown.register('before',function(data,locals){
		if(!locals.markdown){locals.markdown={};}
		if(!locals.markdown.checkbox){locals.markdown.checkbox={};}
		if(!locals.markdown.checkbox.ids){locals.markdown.checkbox.ids=0;}
		if(locals.markdown.checkbox.class_prefix){options.class_prefix = locals.markdown.checkbox.class_prefix;}
		if(locals.markdown.checkbox.id_prefix){options.id_prefix = locals.markdown.checkbox.id_prefix;}
	});

	markdown.registerShortcode(/(\s)|(x|\*|✓|✔|☑)|(×|X|✕|☓|✖|✗|✘)/,function(str,meta,locals){

		var id_pre = options.id_prefix
		,	class_pre = options.class_prefix
		,	id = id_pre+(locals.markdown.checkbox.ids++)
		,	match = str.match(this.regExp)
		,	value = (meta.title || meta.label) || ''
		;

		var props = {
			type:'checkbox'
		,	class:class_pre
		,	id:id
		,	name:id
		}
		if(match[2]){props.checked = '';}
		if(match[3]){props.checked = '';props.disabled='';}
		if(value){props.value = value;}
		var elem = ['label'
		,	{
				id:id+'-wrapper'
			,	'for':id
			,	class:class_pre+'-wrapper'
			}
		,	[
				'input'
			,	props
			]
		,	[
				'label'
			,	{
					id:id+'-label'
				,	'for':id
				,	class:class_pre+'-label-wrapper'
				}
			]
		];
		if(meta.label){
			elem[3].push([
				'span'
			,	{class:class_pre+'-label-text'}
			,	meta.label
			]);
		}
		return [elem];
	});
}
