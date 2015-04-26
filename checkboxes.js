sync_checkboxes = function(md_text){

	/**
	 * Syncs Checkboxes in an element with the markdown text
	 * use to check the markdown when  the user checks the
	 * corresponding checkbox in the html.
	 * 
	 * @param  {DOM note} element  the html container
	 * @param  {string} markdown the original markdown string
	 * @param  {function} filter   a function to further filter
	 *                             checkboxes
	 * @return {string}          the synced markdown
	 * 
	 * 	`filter` receives an input of type checkbox and the
	 * 	position of the checkbox, and should return true if the
	 * 	checkbox should be accounted for, for example:
	 * 	
	 * 	```
	 * 	function(checkbox,i){
	 * 		return checkbox.className && /input-checkbox/.test(checkbox.className);
	 * 	}
	 * 	```
	 */
	function syncCheckBoxesAndText(element,markdown,filter){
		if(!markdown){return '';}
		if(!element){return markdown;}
		var inputs = element.getElementsByTagName('input')
		,	l = inputs && inputs.length
		,	i = 0
		,	checkboxes = []
		;
		if(!l){return markdown;}
		for(i;i<l;i++){
			if(inputs[i].type && inputs[i].type.match(/checkbox/i) && (!filter || filter(inputs[i]))){
				checkboxes.push(inputs[i].checked);
			}
		}
		markdown = markdown.replace(/\[(\s|x|\*|✓|✔|☑|×|X|✕|☓|✖|✗|✘|#)\]/g,function(total,inside){
			var checked = checkboxes.shift() || false;
			var sign = checked ? '✔' : ' ';
			return '['+sign+']';
		});
		return markdown;
	}

	/**
	 * Syncs a checkbox in the markdown text with
	 * the it's equivalent in html. Supposes checkboxes
	 * have a tabIndex and that the tabIndex is ordered.
	 *
	 * This works best if you have only one markdown text
	 * in your page, in a container, because tabIndexes will match
	 * If you run the filter on several markdown texts, then ids for
	 * a single container will not match anymore (apart from
	 * the first one)
	 * 
	 * @param  {DOM node} checkbox the checkbox, which is
	 *                    			assumed to have a "tabIndex"
	 *                    			property
	 * @param  {string} markdown the original markdown string
	 * @return {string}          the synced markdown
	 * 
	 */
	function replaceSingleCheckBox(checkbox,markdown){
		if(!markdown){return '';}
		if(!checkbox){return markdown;}
		var id = checkbox.tabIndex;
		var checked = checkbox.checked;
		var i = -1;
		markdown = markdown.replace(/\[(\s|x|\*|✓|✔|☑|×|X|✕|☓|✖|✗|✘|#)\]/g,function(total,inside){
			i++;
			if(i!==id){return total;}
			var sign = checked ? '✔' : ' ';
			return '['+sign+']';
		});
		return markdown;
	}

	/**
	 * Creates a function that checks a clicked element in a
	 * container to verify it is a checkbox; if yes, calls
	 * functions to sync it's state with the markdown
	 * @param  {DOM node} container the container
	 */
	function makeCheck(container){
		return function check(evt){
			if(evt.target && /input/i.test(evt.target.tagName) && evt.target.type && /checkbox/i.test(evt.target.type)){
				var response = {
					message:'this is the result of syncing the checkbox you just clicked with the markdown text'
				,	single: replaceSingleCheckBox(evt.target,md_text)
				,	sweeping: syncCheckBoxesAndText(container,md_text)
				,	original: md_text
				};
				console.log(response);
			}
		}
	}

	/**
	 * Attaches a click event to body to check
	 * when a checkbox is clicked.
	 */
	function attachCheckEvent(){
		var body = document.getElementsByTagName('body')[0];
		var check = makeCheck(body);
		if(body.attachEvent){
			body.attachEvent('onclick',check);
		}
		else if(body.addEventListener){
			body.addEventListener('click',check,false);
		}
	}


	attachCheckEvent();
};