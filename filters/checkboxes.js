module.exports = function(markdown){
	
	var getOpt = markdown.getOpt;

	// replaces [*], [ ], and [x] with custom markup to avoid
	// being parsed as link references
	markdown.register('before',function(data,locals){
		data.str = data.str.replace(/\[((\s)|(x|\\?\*|✓|✔|☑)|(×|X|✕|☓|✖|✗|✘))\](\(.*?\)?)/g,function(total,inside,space,ticked,disabled,label){
			return '|CHECKBOX|'+(space?'S':ticked?'T':'D')+'|'+'|ENDCHECKBOX|';
		});
	});

	// replaces the custom markup generated above with checkboxes
	markdown.registerJsonFilter(/(\|CHECKBOX\|[STD]\|(.*?)\|ENDCHECKBOX\|)/g,function(chunk,locals){
		if(!locals.markdown){locals.markdown={};}
		if(!locals.markdown.checkbox){locals.markdown.checkbox={};}
		if(!locals.markdown.checkbox.ids){locals.markdown.checkbox.ids=0;}
		if(chunk.match(this.regExp)){
			chunk = chunk.split('|');
			var type = chunk[2];
			var text = chunk[3];
			var id_pre = getOpt(locals.markdown.checkbox,['id_prefix'],'checkbox');
			var class_pre = getOpt(locals.markdown.checkbox,['class_prefix'],'input-checkbox');
			var checkboxId = locals.markdown.checkbox.ids++;
			var id = id_pre+checkboxId;
			var checked = type == 'T' || type == 'D';
			var disabled = type == 'D';
			var checkbox = ["input",{type:"checkbox",'tabindex':checkboxId+"",class:class_pre,id:id}];
			if(checked){checkbox[1].checked = 'checked';}
			if(disabled){checkbox[1].disabled = 'disabled';}
			var elem = [
				'label'
			,	{class:class_pre+'-label','for':id}
			,	checkbox
			,	['span'
				,	{class:class_pre+'-label-text'}
				,	text
				]
			];
			return elem;
		}
		return chunk
	});
}