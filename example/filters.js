module.exports = function(markdown){

	// creates a Table of Contents Automatically
	// This function adds the ids to the titles
	// the function that actually adds the TOC in the
	// document is below
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

	// replaces [*], [ ], and [x] with custom markup to avoid
	// being parsed as link references
	markdown.register('before',function(data,locals){
		data.str = data.str.replace(/\[((\s)|(x|\\?\*|✓|✔|☑)|(x|×|X|✕|☓|✖|✗|✘|#))\]/g,function(total,inside,space,ticked,disabled){
			return '|CHECKBOX|'+(space?'S':ticked?'T':'D')+'|ENDCHECKBOX|';
		});
	});

	// replaces the custom markup generated above with checkboxes
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

	// replaces @mention and #hashtag with spans
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

	// replaces line breaks with <br>
	markdown.registerJsonFilter(/(\n|\r)/g,function(chunk){
		if(chunk.match(this.regExp)){
			return ['linebreak'];
		}
		return chunk;
	});

	// replaces <- and -> with unicode arrows
	markdown.registerJsonFilter(/(<-|->)/g,function(chunk){
		if(chunk.match(this.regExp)){
			var dirLeft = (chunk[0]=='<');
			return ['span',{class:'arrow arrow-'+(dirLeft?'left':'right')}, dirLeft?'←':'→'];
		}
		return chunk;
	});

	// replaces |>SomeRandomString with a link to "SomeRandomString"
	markdown.registerJsonFilter(/(\|>\s?[\w\d]+?)(\s|$|\.)/g,function(chunk){
		if(chunk.match(this.regExp)){
			var url = chunk.replace(/^\|>\s?/,'');
			return ['link',{class:'note-link',href:"/"+url},url];
		}
		return chunk
	});

	// follow up to the Table of Contents creation
	// This function actually inserts the TOC in the document
	markdown.registerJsonFilter(function(jsonml,locals){
		if(locals.tocLinks){
			locals.tocLinks.unshift('ul',{class:'toc'});
			jsonml.splice(1,0,locals.tocLinks);
		}
		return true;
	});

	// Simple mustache-like variables replacement
	function mustacheLike(data,locals){
		data.str = data.str.replace(/(?:\{\{(.*?)\}\})/g,function(total,key){
			return (locals && locals[key]) || '';
		});
	}

	// Adds text around the generated html
	function wrapHTML(data,locals){
		data.str = '<html><head><title>'+
			locals.title+
			'</title></head><body><h1>TOC</h1>'+
			data.str+locals.script
			'</body></html>'
	}

	// registers function on the raw text:
	markdown.register('before')(mustacheLike);

	// registers functions on the generated html
	markdown.register('after')(wrapHTML);

	// there is no need for:
	// markdown.register('json')(...)
	// because all the json functions have been created with
	// markdown.registerJsonFilter wich automatically
	// registers the functions
	
};