var Tasks = new function(){

	this.tasksList = [];
	this.usersWithPerms = [];
	this.usernames = [];
	
	this.AddEvents = function() {
		
		var bodyTag = $("body");
		bodyTag.delegate(".taskStatusMenu", "change", function(e) {

			var targetObject = $(this).parents('.task');
			var data = targetObject.tmplItem().data;

			//update Task				
			Tasks.UpdateTask(data.taskID, $(this).val());				
		});
		bodyTag.delegate(".createTaskButton", "click", function(e) {

			if (!isPlaceholderSupported())
			{
				clear_placeholder('taskNameInput', T('LABEL.TaskDescription'));
				clear_placeholder('taskAssignedToInput', T('LABEL.EnterAssigneeName'));
			}
			
			var folderID = Browse.GetCurrentFolderInfo().DATAID;
			var taskName = $("#taskNameInput").val();
			var assignedTo = $("#taskAssignedToInput").val();
			var dueDate = $("#taskDueDateInput").val();
			var dueDateDate = new Date( dueDate );
			var currentDate = new Date();
			
			if ( ( dueDate.length > 0 ) && ( dueDateDate.getTime() < currentDate.getTime() ) ) {
				//error
				$("#taskDueDateInput").val("");
				ui.MessageController.ShowError(T('ERROR.DueDateMustBeInTheFuture'));
			}
			else if (( assignedTo.length > 0) && ( Tasks.usernames.indexOf( assignedTo ) < 0 )) {
				//error
				$("#taskAssignedToInput").val("");
				ui.MessageController.ShowError(T('ERROR.AssigneeMustBeACollaborator'));
			}
			else if ( taskName.length <= 0 ) {
				//error
				ui.MessageController.ShowError(T('ERROR.TaskDescriptionIsRequiredToCreateTask'));
			}
			else {
				//create Task				
				Tasks.CreateTask(folderID,taskName,assignedTo,dueDate);
			}

			if (!isPlaceholderSupported())
			{
				add_placeholder('taskNameInput', T('LABEL.TaskDescription'));
				add_placeholder('taskAssignedToInput', T('LABEL.EnterAssigneeName'));
			}
		});
		bodyTag.delegate(".taskCancel", "click", function(e) {

			var targetObject = $(this).parents('.task');
			var data = targetObject.tmplItem().data;

			//delete Task			
			Tasks.DeleteTask(data.taskID, data);				
		});
		bodyTag.delegate("#taskDueDateLink", "keypress", function(e) {
			if ( e.which == 32 ){
				//open the datepicker for the space bar
				$("#taskDueDateInput").datepicker( "show" );
			}
		});
	};
	
	this.DrawTasksArea = function (){
		
		Tasks.GetUsers();
		
		taskInfoTmplVar = {};
		ui.LoadTemplateInEmptyElement("#taskInfoTemplate_tmpl", taskInfoTmplVar, "#taskInfo");		
		if((Tasks.tasksList).length > 0 ){
			ui.LoadTemplateInEmptyElement("#task_tmpl",Tasks.tasksList,"#tasks");
		}else{
			ui.LoadTemplateInEmptyElement("#emptyTaskList_tmpl",taskInfoTmplVar,"#tasks");
		}	
		
		if ( Tasks.usersWithPerms.indexOf( info.userName ) > -1 ) {
			ui.LoadTemplateInEmptyElement("#createTask_tmpl", taskInfoTmplVar, "#taskCreation");		
			Tasks.AddAssigneeAutoComplete("#taskAssignedToInput");		
			Tasks.AddDatePicker("#taskDueDateInput","#taskDateSelected");
			
			if (!isPlaceholderSupported())
			{
				add_placeholder('taskNameInput', T('LABEL.TaskDescription'));
				add_placeholder('taskAssignedToInput', T('LABEL.EnterAssigneeName'));
			}

		}
	};
	
	this.AddDatePicker = function(inputID, displayDataSpan){
		var datePickerIcon = info.repo + '/img/datepicker.png';
		var offset = new Date().getTimezoneOffset() / 60; 
		var hour = pad(12 + offset); //we will set the time to be 12 noon so that the timezone offset is easier to calculate
		var dateFormatStr = 'yy-mm-ddT'+ hour +':00:00Z';
		
		$(inputID).datepicker({
			buttonImage: datePickerIcon,
			buttonImageOnly: true,
			showOn: 'button',
			showAnim: 'slideDown',
			dateFormat: dateFormatStr,
			onSelect: function( date ){
				$(displayDataSpan).text( utils.DateStringToShortDate(date,true) );
			},
			showButtonPanel:true,
			closeText:'Clear',
			onClose: function( date, inst ) {
				if ( jQuery.type(inst.currentDay) === "number" ) {
					$(displayDataSpan).text(T('LABEL.None'));
					$(inputID).val("");
				}
			}
		});
	};
	
	this.AddAssigneeAutoComplete = function(inputID) {

		var usersInShare = [];
		
		for( var key in Collaborators.collaboratorsList){
		
			var searchObj ={};
			var csDisplayName = info.displayNameFormat;
			var displayName;
			
			if ( Collaborators.collaboratorsList[key].FirstName && Collaborators.collaboratorsList[key].LastName ) {
				csDisplayName = csDisplayName.replace( "%1", Collaborators.collaboratorsList[key].FirstName );
				csDisplayName = csDisplayName.replace( "%2", '' );
				csDisplayName = csDisplayName.replace( "%3", Collaborators.collaboratorsList[key].LastName );
				csDisplayName = csDisplayName.replace( "%4", Collaborators.collaboratorsList[key].Name );
				displayName = Collaborators.collaboratorsList[key].DisplayName + " (" + Collaborators.collaboratorsList[key].Name + ")"
			} else {
				csDisplayName = Collaborators.collaboratorsList[key].Name;
				displayName = Collaborators.collaboratorsList[key].Name;
			}
			
			searchObj.label = csDisplayName + " " + displayName;
			searchObj.value = Collaborators.collaboratorsList[key].Name;
			searchObj.ID = Collaborators.collaboratorsList[key].UserID;
			searchObj.IsExternalUser = Collaborators.collaboratorsList[key].IsExternalUser;
			searchObj.displayName = displayName;
			usersInShare.push(searchObj);

		}
		
		if ( Collaborators.collaboratorsList.length < 1 ) {
			var searchObj ={};

			searchObj.label = info.displayName + " " + info.userName;
			searchObj.value = info.userName;
			searchObj.ID = info.userID;
			searchObj.IsExternalUser = info.isExternal;
			searchObj.displayName = info.displayName + " (" + info.userName + ")";
			usersInShare.push(searchObj);
		}
		
		$(inputID).autocomplete({
			source: usersInShare
		})
		.data( "ui-autocomplete" )._renderItem = function( ul, item ) {
			ul.addClass('searchUserAutoComplete');
			if(typeof item.IsExternalUser === "undefined" || !item.IsExternalUser ){
				return $( "<li></li>" )
					.data( "autocomplete-item", item )
					.append( "<a class='AutoCompDisplay'><div class='shareUserImage AutoCompImg'><img src=" + ui.GetProfilePicUrl(item.ID) + " onerror='ui.MissingUserImg(this,false);'/></div><div class='AutoCompName autoCompSmall'>" + htmlEncode(item.displayName) + "</div><br style='clear: both;'></a>" )
					.appendTo( ul );
			}
			else{
				return $( "<li></li>" )
					.data( "autocomplete-item", item)
					.append( "<a class='AutoCompDisplay'><div class='shareUserImage AutoCompImg'><img src=" + info.repo + "/img/image_user_placeholder.svg" + " /></div><div class='AutoCompName autoCompSmall'>" + htmlEncode(item.displayName) + "</div><br style='clear: both;'></a>" )
					.appendTo( ul );
			}
		};
		
		$(inputID).click( function() {
			$(inputID).val("");
		});
	
	};
	
	this.GetUsers = function() {
		
		Tasks.usernames = [];
		Tasks.usersWithPerms = [];
		
		if ( Browse.currentData.USERID == info.userID ) {
			Tasks.usernames.push(info.userName );
			Tasks.usersWithPerms.push(info.userName );
		}
		
		for( var key in Collaborators.collaboratorsList){
		
			Tasks.usernames.push(Collaborators.collaboratorsList[key].Name);
		
			if ( Collaborators.collaboratorsList[key].IsReadOnly != true) {
				Tasks.usersWithPerms.push(Collaborators.collaboratorsList[key].Name);
			}
		}
	};
	
	function pad(num) {
		var s = "00" + num;
		return s.substr(s.length-2);
	}

};

