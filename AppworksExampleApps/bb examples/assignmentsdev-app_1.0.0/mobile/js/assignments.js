/**
 * # Assignments
 * An assignment viewer component for
 * OpenText Application Gateway.
 *
 * **Version** 1.0.0
 */

/* jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true,
    strict:true, undef:true, unused:true, curly:true, browser:true,
    jquery: true */
/* global App */

;(function () {
  // Keep JavaScript definitions strict
  "use strict";

  // Create the application
  var Assignments = new App();

  /**
   * ## Initialization
   * Set up initial events and load data.
   */

  /**
   * ### Assignments.init
   *
   * Application initialization.
   */
  Assignments.init = function () {
    // Only trigger the initialization once
    if (this.initialized) {
      return;
    }
    this.initialized = true;

    // Bind events for the application
    bindEvents();
	
	try{
		if(Assignments.session.clientOS.toLowerCase() == "blackberry") {
			findComponent("tasksviewbb");
			findComponent("workflowviewbb");
		}
	} catch(e) {
		console.log("no bb");
	}
    // Get assignment list data
    getAssignments();
  };

  /**
   * ### bindEvents
   *
   * Bind any events for the page.
   */
  function bindEvents () {
    $(document.body)
      .on("click", "#assignments > li", function (event) {
        $(this).find(".metadata").toggle();
      })
      .on("click", "#assignments > li .open-assignment", function (event) {
        // Don't trigger default events
        event.preventDefault();
        event.stopPropagation();

        // Open the assignment
        openAssignment($(this).parents("li").data("assignment"));
      });
  }

  /**
   * ## Data Loading
   * Load data for the application.
   */

  /**
   * ### getAssignments
   *
   * Get the assignments list from the server.
   */
  function getAssignments () {
    clearData();
		
	if(Assignments.session.clientOS.toLowerCase() == "blackberry")
	{	
		try{
		Assignments.ajax({
			url: Assignments.session.baseURL + "/assignments/v1/assignments"
			, success : function(data){showData(data.assignments)}
			, fail : function(error){onError(apputil.T("label.Error") + error.errMsg)}
		});
		} catch(e)
		{
			onError(apputil.T("label.Error") + e)
		}
	}
	else
	{
		try{
			Assignments.ajax({url: Assignments.session.baseURL + "/assignments/v1/assignments"})
			.done(function (data) {
			  showData(data.assignments);
			}).fail(function (error) {
			  onError(apputil.T("label.Error") + error.errMsg);
			});
		} catch(e)
		{
			onError(apputil.T("label.Error") + e)
		}
	}
  }
   
  //}

  /**
   * #### onError
   *
   * Clear list data and show the error.
   *
   * @param error    The error message string.
   */
  function onError (error) {
    clearData();
    $("#page-title").text(error);
  }

  /**
   * ## Display Data
   * Bind the data to fields within the application and
   * show it to the user.
   */

  /**
   * ### showData
   *
   * Bind the data to the view.
   *
   * @param data    Object containing the assignment list data.
   */
  function showData (data) {
    
    var idx, dataLen = data.length, lst = [],
      assignment, $row, priority, overdue;

    for (idx = 0; idx < dataLen; idx += 1) {
      assignment = data[idx];

      // Get the priority
      priority = formatPriority(assignment.priority);
      overdue = (assignment.due && new Date(assignment.due) < new Date());

      // Create the element
	  // note: cursor: pointer is a workaround for an iOS bug which prevents clicks on non-anchors from firing
      lst.push("<li style='cursor: pointer' data-type='" + assignment.type +
        "' data-id='" + assignment.id +
        "' data-subwork='" + assignment.subwork +
        "' data-step='" + assignment.step +
        "'>");
      lst.push('<div class="row-fluid">');

      // Add the basic information
      lst.push('<div class="span10">');

      // Assignment Name
      lst.push("<h4>" +
        assignment.name.replace(/</g, "&lt;").replace(/>/g, "&gt;") +
        "</h4>");

      // Location
      lst.push("<div><span class='grid-heading'>" + apputil.T("label.Location") + ":</span> " +
        assignment.location + "</div>");

      // Due Date
      lst.push("<div><span class='grid-heading'>" + apputil.T("label.Due") + ":</span> " +
        "<span" + (overdue ? " class='overdue'" : "") + ">" +
        (assignment.due ? Assignments.format.date(assignment.due) : apputil.T("label.None")) +
        "</span></div>");

      // Add the extra metadata
      lst.push("<div class='metadata'>");
      
      // Status
      lst.push("<div><span class='grid-heading'>" + apputil.T("label.Status") + ":</span> " +
    	        assignment.status + "</div>");

      // Priority
      lst.push("<div><span class='grid-heading'>" + apputil.T("label.Priority") + ":</span> " +
        "<span class='priority-" + priority.toLowerCase() + "'>" + priority +
        "</span></div>");

      lst.push("</div>");
      lst.push("</div>");

      // Add the open button
      lst.push("<div class='span2 open-assignment'>");
      lst.push("<a class='btn btn-circle pull-right'>");
      lst.push("<i class='icon-chevron-right'></i></a>");
      lst.push("</div>");

      lst.push("</div>");
      lst.push("</li>");

      $(lst.join(""))
        .appendTo($("#assignments")).data("assignment", assignment);

      // Clear the list
      lst.length = 0;
    }
  }

  /**
   * ### clearData
   *
   * Clear all assignment data.
   */
  function clearData () {
    // Clear assignment list
    $("#page-title").text(apputil.T("label.Assignments"));
    $("#assignments").html("");
  }

  /**
   * ## Miscellaneous
   * Helper functions for the application.
   */

  /**
   * ### formatPriority
   *
   * Formats the priority into a human-readable format.
   *
   * @param value    The priority value.
   * @return         String representing the priority.
   */
  function formatPriority (value) {
    // Default to medium
    var priority = apputil.T("priority.Medium");

    // Change value based on Content Server values
    if (value === 0) {
      priority = apputil.T("priority.Low");
    } else if (value === 100) {
      priority = apputil.T("priority.High");
    }
    return priority;
  }

  /**
   * ### openAssignment
   *
   * Opens an assignment in its specific viewer.
   *
   * @param data        Data to pass to the component viewer.
   */
  function openAssignment (data) {
    
	if(Assignments.session.clientOS.toLowerCase() == "blackberry")
	{	
		try {
		
			var destComponentName = null;
		
			if(data.type == "task") {
				if(Assignments.findComponentInArray("tasksviewbb")) {
					destComponentName = 'tasksviewbb';
				} else {
					alert(apputil.T("error.NoTasksViewComponent"));
				}
			}
			
			if(data.type == "workflow") {
				if(Assignments.findComponentInArray("workflowviewbb")) {
					destComponentName = 'workflowviewbb';
				} else {
					alert(apputil.T("error.NoWorkFlowViewComponent"));
				}
			}
		
			var thisAppsName = 'assignmentsdev-app';
			var thisAppReturnHandler = 'onReturnFromComponent';

			var destMethod = 'onCallFromApp';
			var dataForDest = { 'data' : data, 'action' : 'assignment'};			
		
			Assignments.openComponent(destComponentName, thisAppsName, destMethod, dataForDest, thisAppReturnHandler);
			
		} catch(e) {
				alert(apputil.T("error.ErrorOpeningAssignment") + " : " + e);
		}
	} else {
  
		Assignments.execRequest("Components", "launchAssignmentViewer",
		 [data.type, JSON.stringify(data)])
		  .fail(function (err) {
			alert(apputil.T("error.NoViewerIsAvailableForThisTypeOfAssignment"));
		  });
	}
  }
  
  function findComponent(component) {
	try
	{
		Assignments.findComponent(component);
	}
	catch(e) {
		alert("Error in findComponent() :" + e);
	}
  }
  
  
  // Manually start the application
  Assignments.start();
}).call(this);
