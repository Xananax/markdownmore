module.exports = function(markdown){

	markdown.registerJsonFilter(function(jsonml,locals){
		if(jsonml[0] === 'header'){
			var level = jsonml[1].level;
			if(level>locals.minimumTOCLevel){return false;}
			if(jsonml[1].id){return false;}
			var title = jsonml[2];
			var id = 'toc-'+title.toLowerCase().replace(/\s/g,'-').replace(/:|\[|\]|\{|\}|\%|\(|\)|\^|\$/,'');
			jsonml[1].id = id;
			if(!locals.tocLinks){locals.tocLinks = [];}
			locals.tocLinks.push([
				'li'
			,	[
					'link'
				,	{href:'#'+id}
				,	title[0].toUpperCase()+title.slice(1)
				]
			]);
			return true;
		}
		return false;
	});

	markdown.register('before',function(data,locals){
		data.str = data.str.replace(/\[((\s)|(x|\\?\*|✓|✔|☑)|(x|×|X|✕|☓|✖|✗|✘|#))\]/g,function(total,inside,space,ticked,disabled){
			return '|CHECKBOX|'+(space?'S':ticked?'T':'D')+'|ENDCHECKBOX|';
		});
	});

	markdown.registerJsonFilter(/(\|CHECKBOX\|[STD]\|ENDCHECKBOX\|[A-Za-z0-9]*)/g,function(chunk,locals){
		if(chunk.match(this.regExp)){
			chunk = chunk.split('|');
			var type = chunk[2];
			var text = chunk[4];
			var pre = locals.checkboxPrefix;
			var checkboxId = locals.checkboxIds++;
			var id = pre+checkboxId;
			var checked = type == 'T' || type == 'D';
			var disabled = type == 'D';
			var checkbox = ["input",{type:"checkbox",'tabindex':checkboxId+"",class:'input-checkbox',id:id}];
			if(checked){checkbox[1].checked = 'checked';}
			if(disabled){checkbox[1].disabled = 'disabled';}
			var elem = [
				'label'
			,	{class:'checkbox','for':id}
			,	checkbox
			,	['span'
				,	{class:'checkbox-label'}
				,	text
				]
			];
			return elem;
		}
		return chunk
	});

	markdown.registerJsonFilter(/([@#][A-Za-z0-9][A-Za-z0-9_]{0,40})/g,function(chunk){
		if(chunk[0].match(/@|#/)){
			var type = (chunk[0]=='@'?'mention':'hashtag');
			return ['span'
			,	{
					class:type
				,	'data-for':type+':'+chunk.substr(1)
				}
			,	chunk
			];
		}
		return chunk;
	})

	markdown.registerJsonFilter(/(\n|\r)/g,function(chunk){
		if(chunk.match(this.regExp)){
			return ['linebreak'];
		}
		return chunk;
	});

	markdown.registerJsonFilter(/(<-|->)/g,function(chunk){
		if(chunk.match(this.regExp)){
			var dirLeft = (chunk[0]=='<');
			return ['span',{class:'arrow arrow-'+(dirLeft?'left':'right')}, dirLeft?'←':'→'];
		}
		return chunk;
	});


	markdown.registerJsonFilter(/(>[\w\d]+?)(\s|$|\.)/g,function(chunk){
		if(chunk[0]=='>'){
			var url = chunk.replace('>','');
			return ['link',{class:'note-link',href:"/"+url},url];
		}
		return chunk
	});

	markdown.registerJsonFilter(function(jsonml,locals){
		if(locals.tocLinks){
			locals.tocLinks.unshift('ul',{class:'toc'});
			jsonml.splice(1,0,locals.tocLinks);
		}
		return true;
	});

	function mustacheLike(data,locals){
		data.str = data.str.replace(/(?:\{\{(.*?)\}\})/g,function(total,key){
			return (locals && locals[key]) || '';
		});
	}

	function wrapHTML(data,locals){
		data.str = '<html><head><title>'+
			locals.title+
			'</title></head><body><h1>TOC</h1>'+
			data.str+
			'</body></html>'
	}

	markdown.register('before')(mustacheLike);
	markdown.register('after')(wrapHTML);
	
};