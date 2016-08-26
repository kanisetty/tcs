$(document).ready(function() {
    "use strict";
    
    $('.hide-initially').hide();
    
    var task = new App();
    var taskData = task.getParameters();
    var nodeID = taskData.id;
    var deviceStrategy = task.getDeviceStrategy();
	var _gatewayURL = null;

	task.init = function() {
	      
		if (this.initialized) {
			return;
		}

		$('#close-button').click(task.close);

		deviceStrategy.getGatewayURL()
			.done(function(gatewayURL){
				_gatewayURL = gatewayURL;

				this.initialized = true;
				task.showTask();
			})
			.fail(function(error) {
				alert(error);
			});

	};
	
	$("input,textarea,select, .calendarIcon").on("keypress, keydown, change, click", function(){ 
		
		$('#task-update-btn').removeAttr('disabled');
		$('#updateConfirmation').html('');
	});
	
	$('#task-update-btn').click( function(){
  	  task.updateTask();
	});
	
	task.updateTask = function(){
	    	
		var str = '?__ignore=';
		var errorRequiredField = '';
	    
		if( typeof $('#name').val() != 'undefined' && $('#name').val() != '' ){	    	
				
				str += '&name=' + $('#name').val();
	    }
		else{
			errorRequiredField = apputil.T('error.Name is required');	
		}
	    	
	    if( typeof $('#assignedTo').val() != 'undefined' ){
	    		
	    	str += '&assignedTo=' + $('#assignedTo').val();
	    }
	    
	    if( typeof $('#comments').val() != 'undefined' ){
	    	
	    	str += '&comments=' + $('#comments').val();
	    }
			
	    if( errorRequiredField=='' && typeof $('#startDate').val() != 'undefined' ){
	
	    	if( $('#startDate').val() != '' ){
	    		
	    		str += '&startDate=' + moment($('#startDate').val()).utc().format("YYYY-MM-DDTHH:mm:ss[Z]");
	    	}
	    	else{
	    		errorRequiredField = apputil.T('error.Start Date is required');
	    	}
	    }
		
	    if( $('#dueDate').val() != '' ){
				    		
			str += '&dueDate=' + moment($('#dueDate').val()).utc().format("YYYY-MM-DDTHH:mm:ss[Z]");
	    }
	    else{
	    	str += '&dueDate=';
	    }

		// check that start and due dates are valid
		if ($('#dueDate').val() && $('#startDate').val()) {
			if (moment($('#dueDate').val(), 'YYYY-MM-DD HH:MM A').isBefore($('#startDate').val(), 'YYYY-MM-DD HH:MM A')) {
				errorRequiredField = apputil.T('error.Due date must be after start');
			}
		}
		
		if( typeof $('#instructions').val() != 'undefined' ){
				
			str += '&instructions=' + $('#instructions').val();
		}
		
		if( typeof $('#priority').val() != 'undefined' ){
				
			str += '&priority=' + $('#priority').val();
		}
		
		if( typeof $('#status').val() != 'undefined' ){
				
			str += '&status=' + $('#status').val();
		}

		$('#task-update-btn').attr('disabled','disabled');
		
		if(errorRequiredField==''){

            $.when(task.runRequestWithAuth({
		    	type: "PUT",
		    	url: _gatewayURL + "/tasks/v5/tasks/" + nodeID + str
		    	})).done(function() {
		    
		    		$('#taskData').fadeOut('fast');
	    			$('#node-name').text(apputil.T("Success! The task has been updated"));
					$('.done').show();
		    		
		    	}).fail(onRequestFail);
		}
		else{
			
			$('#node-name').text(errorRequiredField);
		}
	};
	    
	
	task.showTask = function(){
		
		if (isValidId(nodeID)) {
				
            $.when(task.runRequestWithAuth({
				url: _gatewayURL + "/tasks/v5/tasks/" + nodeID
			})).done(function(data) {
									
					task.renderTaskInfo(data);
				})
				.fail(onRequestFail);
		}
	};
		
	function isValidId(nodeId) {
	
		var isInvalid = (isNaN(nodeId) || nodeId === "");

		if (isInvalid) {
		 	  
			$('#node-name').text(apputil.T("error.Invalid task ID"));
		}

			return !isInvalid;
	};
		    
	function onRequestFail(error) {
		
		$('#node-name').text( error );
	};

	$('#assignedTo').keydown(function() {
      
		$(this).attr('dataUnusable', 'true');
	});
	
	$('#assignedTo').blur(function() {
        var item = $(this);

        if (item.attr('dataUnusable') == 'true') {
             item.val('');
        }
	});
	        
	task.renderTaskInfo = function(data){
				
		$('#assignedTo').val(data.assignedTo);
		$('#assignedTo').typeahead({
                
			source: function(query, process) {

				return $.when(task.runRequestWithAuth({
					url: _gatewayURL + '/content/v5/users',
					data: {filter: query}
				})).done(function(data) {
					var options = [];
                    for (var i in data.users) {
                             
                        options.push('<span data-fieldid="assignedToHidden" data-username="' + data.users[i].userName + '">' +
                                data.users[i].userName + '</span>');
                    }
                    return process(options);
                });
                },
                matcher: function(item) {
                                return true;        // always match, our api takes care of the filtering.
                },
                updater: function(item) {
                                item = $(item);
                                
                               $('#assignedTo').attr('dataUnusable', 'false');
                               $('#assignedToHidden').val(item.attr('data-username'));
                                
                                return item.text();
                },
                highlighter: function(item) {
                                return item;
                },
                minLength: 2,
                items: 5
			});	
		
		if( data.comments && data.comments.length > 0 ){
			
			$('#comments').val(data.comments);
		}
		
		//initialize the due date picker		
		var duePicker = task.outputDate('datetimepickerDue', data.dueDate);
		duePicker.data('datetimepicker').setStartDate(moment(data.startDate, "YYYY-MM-DDTHH:mm:ssZ").add('hour', 1).toDate());
		
		if( data.startDate && data.startDate.length > 0 ){
			
			//initialize the start date picker
			var startPicker = task.outputDate('datetimepickerStart', data.startDate);
			if( data.dueDate && data.dueDate.length > 0 ){
				startPicker.data('datetimepicker').setEndDate(moment(data.dueDate, "YYYY-MM-DDTHH:mm:ssZ").toDate());		
			}
			
			startPicker.on('changeDate', function(ev){		    	
				var newDateLimit = ev.localDate;
		    	if( newDateLimit != null){
		    		newDateLimit.setHours(newDateLimit.getHours() + 1);		    		
		    		duePicker.data('datetimepicker').setStartDate(newDateLimit);
		    	}
		    	else{
		    		duePicker.data('datetimepicker').setStartDate(null);
		    	}
		    });			
		}		
		
		duePicker.on('changeDate', function(ev){

	    	var newDateLimit = ev.localDate;	    	
	    	if( newDateLimit != null){
	    		newDateLimit.setHours(newDateLimit.getHours() + 1);    	
	    		startPicker.data('datetimepicker').setEndDate(newDateLimit);
	    	}
	    	else{
	    		startPicker.data('datetimepicker').setEndDate(null);
	    	}
	    });
		
		if( data.instructions && data.instructions.length > 0 ){
			
			$('#instructions').val(data.instructions);
		}
		
		if( data.name && data.name.length > 0 ){
			
			$('#node-name').text(data.name);
			$('#name').val(data.name);
		}
		
		if( data.priority && data.priority.length > 0 ){
	
			$('#priority').val(data.priority);
		}		
		
		if( data.status && data.status.length > 0 ){
			
			$('#status').val(data.status);
		}	

	};
   	

	
	task.outputDate = function(inputId, theDate){
		
		var picker = $('#'+ inputId).datetimepicker({
		      language: 'en', pick12HourFormat: true, pickSeconds: false, format:"yyyy-MM-dd HH:mm PP"
		});		
		
		if( theDate != null ) {			
			picker.data('datetimepicker').setLocalDate(moment(theDate, "YYYY-MM-DDTHH:mm:ssZ").toDate());
		}
		
		return picker;
	};
	
	task.start();

});