$(document).ready(function () {
	$.jsperanto.init(function(){
		// find all 'localize' classes and translate them: both text and title attr (if present)
		$('.localize').each(function() {
			var key = $(this).text().replace(/\./g, '');
			$(this).text( apputil.T('label.' + key) );
			
			var title = $(this).attr('title');
			if(title){
				var key = title.replace(/\./g, '');
				$(this).attr('title', apputil.T('label.' + key));
			}				
		});
	});
});

var apputil = new function(){
	/**
  
	This function will return an HTML decoded string

	@param	{String} value
	@return {String} The HTML decoded string
	*/
	this.htmlDecode = function(value){

		// if < or > is present in the value, encode them first before passing to $.html()
		var patt = /[<>]/i;
		if(patt.test(value))  
		{
			value = value.replace("<","&lt;").replace(">","&gt;");
		}
		var r = $('<div/>').html(value).text();
		return r;
	};
	
	/**
	This function will provide the translated string from the loaded dictionary that matches the passed key.

	@param {String} key
	@param {Object} data Object that contains properties named to match the variable substitution used in the
						dictionary object

	@return {String} The translated string
	*/
	this.T = function( key, data ){
		return  $.t( key, data );
	};
};