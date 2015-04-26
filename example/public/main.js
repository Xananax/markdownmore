function checkFontHasLoaded($){
	var $span = $('<span class="fa" style="display:none"></span>').appendTo('body');
	if ($span.css('fontFamily') !== 'FontAwesome' ) {
		$('body').addClass('noFontAwesome')
	}
	$span.remove();
}

function checkboxes($){
	var markdownText = $('#markdownText').val();
	sync_checkboxes(markdownText);
}

function toggles($){
	$('.togglee').each(function(){
		var $togglee = $(this).addClass('hide');
		var $toggler = $togglee.siblings('.toggler');

		$toggler.on('click',function(evt){
			evt.preventDefault();
			$togglee.toggleClass('hide');
			return false;
		});

	});
}

jQuery(function($){
	
	toggles($);
	checkboxes($);
	checkFontHasLoaded($);

});