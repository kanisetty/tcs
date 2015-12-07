/**
pretty checkbox for Tempo. Handles keyboard-only input via enter and spacebar and calls a callback when toggled.
Requires checkbox.css.
usage:
	-html: <div id="chk"/>
	-js: var checked = true; // initial state
		function cb(checked){ if(checked){...} else{...} } // handle toggle
		$("chk").checkbox(checked, callback); // turn the div into a checkbox
**/
(function( $ ) {
	var toggle = function(el){
			var wasChecked = el.hasClass('checked-box');
			
			if(wasChecked){
				el.removeClass('checked-box').addClass('unchecked-box');
			}
			else{
				el.removeClass('unchecked-box').addClass('checked-box');
			}
			
			// return new state
			return !wasChecked;
	}
	
	var methods = {
		isChecked : function(el){
		
			return el.children("a").hasClass('checked-box')?true:false;
		}
	}
	
	$.fn.checkbox = function(checked, callback) {
		if(methods[checked]){
			return methods[checked](this);
		}
		else{
			return this.each(function() {
		  
				// add an anchor for keyboard-only usage, with the checkbox image class
				var anchor = $('<a href="#" ' + (checked ? 'class="checked-box"' : 'class="unchecked-box"') +'/>');
				$(this).append(anchor);
				
				// register click, enter, and spacebar events for the checkbox
				anchor.click(function(e){
					e.preventDefault();
					var checked = toggle($(this));
					if(typeof callback != "undefined"){
						callback(checked);
					}
				});		
				anchor.keydown(function(e){			
					if(e.keyCode === 32)
					{
						var checked = toggle($(this));
						if(typeof callback != "undefined"){
							callback(checked);
						}
					}
				});
			});
		}
	}
})( jQuery );
