function SelectBox(name, showAllOptions) {
	var focused = false;
	var keepActive = false;
	
	var _hideMenuIfNotFocused = function() {
		if (!focused) {
			$("#" + name).removeClass("select-active");
			$("#" + name).removeClass("select-open");
		}
	}

	var _showHideItems = function() {
		var lastVisible;

		$("#" + name + " ul a").each(function() {
			if ($("#" + name + " .select-value").attr('value') != $(this).attr('value')) {
				$(this).parents("li").show();
				lastVisible = $(this).parents("li");
			}
			else {
				$(this).parents("li").hide();
			}
			
			$(this).parents("li").removeClass("last");
		});
		
		if (lastVisible != null) {
			lastVisible.addClass("last");
		}
	}
	
	var _FindPreviousLink = function(current) {
		var previous = null;
		
		$("#" + name + " a:visible").each(function() {
			if ($(this).get(0) === current.get(0)) {
				return false;
			}
			previous = $(this);
		});
		
		return previous;
	};
	
	var _FindNextLink = function(current) {
		var next = null;
		var nextFound = false;
		
		$("#" + name + " a:visible").each(function() {
			if (nextFound) {
				next = $(this);
				return false;
			}
			
			if ($(this).get(0) === current.get(0)) {
				nextFound = true;
			}
		});
		
		return next;
	};
	
	
	// events
	$("#" + name).click(function(e) {
		if ($("#" + name).is('.select-open')) {
			$("#" + name).removeClass('select-open');
		}
		else {
			$("#" + name + " .select-value a, #" + name + " .select-left a").focus();
			$("#" + name).addClass('select-open');
		}
	});
	
	$("#" + name + " .select-option").click(function(e) {
		keepActive = true;
		$("#" + name + " .select-value").attr('value', $(this).attr('value'));
		if(!showAllOptions){
			_showHideItems();
		};
		
		$("#" + name + " .select-value a").html($(this).html());
		$("#" + name + " .select-value a").focus();
	});
		
	$("#" + name + " .select-value a").focus(function(e) {
		$("#" + name).addClass("select-active");
	});
	
	$("#" + name + " a").blur(function(e) {
		focused = false;
		setTimeout(function() { _hideMenuIfNotFocused() }, 30);
		
	});
	
	$("#" + name + " a").focus(function(e) {
		focused = true;
	});
	
	$("#" + name + " .select-option").keypress(function(e) {
		if (e.keyCode == 13) { // enter key
			$(this).click();
		}
	});
	
	$("#" + name + " a").keypress(function(e) {	
		var item;
		
		switch (e.keyCode) {
		case 38:	//up key
			item = _FindPreviousLink($(this));
			if (item != null) {
				$(this).blur();
				item.focus();
			}
			break;
			
		case 40:	//down key
			item = _FindNextLink($(this));
			if (item != null) {
				$(this).blur();
				item.focus();
			}
			break;
		}
	});
	
	$("#" + name + " .select-option").mousedown(function(e) {
		e.preventDefault();
	});

	if(!showAllOptions){
		_showHideItems();	
	}
}
