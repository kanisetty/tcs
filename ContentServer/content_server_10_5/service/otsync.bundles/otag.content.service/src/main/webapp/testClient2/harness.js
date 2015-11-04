var testReport = {
};

var testHarness = new function(){
	
	this.version = "v4";
	
	this.runStep = function(name, remainingTests, remainingSteps) {
		var test = tests[name];
		
		if (remainingTests == null){
			remainingTests = [];
		}
		
		// skip to the next test if the current version doesn't apply to this test
		if(test.VERSIONS != null){
			if(test.VERSIONS.indexOf(testHarness.version) == -1 ){
				testReport[name] = {
						msg : "skipped for " + testHarness.version,
						pass : true
				};
				testHarness.runNextTest(remainingTests, false);
				return;
			}
		}
		try{
			var data;

			if (remainingSteps == null) {
				remainingSteps = Object.keys(test);
			}

			var stepName = remainingSteps[0];			
			if (test[stepName].itr == undefined) {
				test[stepName].itr = 0;
			}

			if (test[stepName].loop == undefined || (test[stepName].itr + 1) >= test[stepName].loop) {
				test[stepName].itr = -1; // reset the count
				stepName = remainingSteps.shift();
			}
			
			// skip any steps that don't apply to the current version
			while (test[stepName].versions != null && (test[stepName].versions.indexOf(testHarness.version) == -1)){
				if(remainingSteps.length > 0){
					stepName = remainingSteps.shift();
				}
				else{
					testReport[name] = {
							msg: "",
							pass : true
					};
					testHarness.runNextTest(remainingTests);
					return;
				}
			}

			// skip to the next step (there must be one!) if this is a VERSIONS field (not a step at all)
			if(stepName == "VERSIONS" ) {				
				stepName = remainingSteps.shift();
			}
			test[stepName].itr++;
			
			if (test[stepName].libraryStep != undefined) {
				var libStep = utils.clone(test[stepName].libraryStep);
				if (test[stepName].variables != undefined) {
					for (var variable in test[stepName].variables) {
						libStep = utils.recursiveReplace('$' + variable + '$', test[stepName].variables[variable], libStep);
					}
				}
				libStep.variables = test[stepName].variables;
				libStep.versions = test[stepName].versions;
				test[stepName] = libStep;
			}
			
			var step = test[stepName];
			
			testHarness.showStatus("Running test " + name + ", step " + stepName);
			
			var url = utils.tokenize(test, step.url);
			url = (step.url.indexOf('://') != -1) ? url : '../' + this.version + '/' + url;
			
			// get parameters, substituting variables as necessary
			var params = {};
			var i = 0;
			for(var param in step.params){
				var value = step.params[param];
				value = utils.tokenize(test, value);
				
				// Have to build the query string manually for DELETEs
				if (step.verb == 'DELETE' || step.verb == 'PUT') {
					url += (i++ == 0) ? '?':'&';
					url += param + '=' + value;
				}
				else {
					params[param] = value;
				}
			}
			
			if (step.type == 'multipart/form-data'){
				var boundary = 'otsync' + Math.floor(Math.random() * 1000000000);
				var multidata = "";
				var contentType = (step.contentType != undefined) ? step.contentType : "text/plain";
				var fileContents = (step.binaryData == true) ? step.fileContents : utils.tokenize(test, step.fileContents);
				
				//add filepart
				multidata += utils.AddFormFilePart(boundary, step.fileName, contentType, fileContents);
				
				//add all the params
				for(var p in params){
					multidata += utils.AddFormData(boundary, p, params[p]);
				};
				
				//add footer
				multidata += '\r\n--' + boundary + '--';
				
				utils.UploadBinaryFile(url, step.verb, boundary, multidata,
					function(data) {	//success handler
						testHarness.checkResponse(name, stepName, remainingSteps, remainingTests, data);
					},
					function() {		//error handler
						testReport[name] = {
								msg : "at " + stepName + ": " + errorThrown,
								pass : false
						};
						testHarness.runNextTest(remainingTests);
					}
				);
			}
			else {
				if (step.binaryResponse == true) {
					var queryStr = '';
					for (var param in params) {
						queryStr += (queryStr != '') ? '&' : '?';
						queryStr += param + "=" + encodeURI(params[param]);
					}
					url += queryStr;
					data = utils.GetBinaryFileData(url, step.verb,
						function(data) {	//success handler
							testHarness.checkResponse(name, stepName, remainingSteps, remainingTests, data);
						},
						function() {		//error handler
							testReport[name] = {
									msg : "at " + stepName + ": " + errorThrown,
									pass : false
							};
							testHarness.runNextTest(remainingTests);
						}
					);
					testHarness.checkResponse(name, stepName, remainingSteps, remainingTests, data);
				}
				else {
					$.ajax({
						url : url,
						type : step.verb,
						data : params,
						dataType: step.dataType == null ? "json" : step.dataType,
						contentType : 'application/x-www-form-urlencoded',
						success : function(data) {
							if (step.expectError != null) {
								testReport[name] = {
									msg : "at " + stepName + ": got status 200 OK instead of " + step.expectError,
									pass : false
								};
								testHarness.runNextTest(remainingTests);
							}
							else {
								testHarness.checkResponse(name, stepName, remainingSteps, remainingTests, data);
							}
						},
						error : function(jqXHR, textStatus, errorThrown){
							if(step.expectError != null){
								if(step.expectError == jqXHR.status){
									testHarness.checkResponse(name, stepName, remainingSteps, remainingTests, null);
								}
								else {
									testReport[name] = {
										msg : "at " + stepName + ": got status " + jqXHR.status + " instead of " + step.expectError,
										pass : false
									};
									testHarness.runNextTest(remainingTests);
								}
							}
							else {
								testReport[name] = {
										msg : "at " + stepName + ": " + errorThrown,
										pass : false
								};
								testHarness.runNextTest(remainingTests);
							}
						}
					});
				}
			}
			
		} catch ( e ){
			testReport[name] = {
					msg : "at " + stepName + ": " + e,
					pass : false
			};
			testHarness.runNextTest(remainingTests);
		}

	};
	

	this.checkResponse = function(name, stepName, remainingSteps, remainingTests, data) {
		var step = tests[name][stepName];
		var success = true;
		
		try {
			var content;
			if (step.binaryResponse == true) {
				content = data;
				data = { content: utils.StringToArrayBuffer(content) };
			}
			else if(typeof data == "string"){
				content = data;
				data = { content: content };
			}
			if(data == null && ( step.expectType != null || step.expect != null )){
				success = false;
				testReport[name] = {
					msg: "due to empty response",
					pass: false
				};
			}
			else{
				// check expected types
				for (var field in step.expectType) {
					var expected = step.expectType[field];
					var actual = typeof (eval("data." + field));
					if (expected != actual){
						testReport[name] = {
							msg: "at " + stepName + ": expected type '" + expected 
								+ "' but got '" + actual + "'"
								+ " for field " + field,
							pass : false
						};
						success = false;
						break;
					}
				}
				
				//check expected values
				//check expected values
				if(success){
					for(var field in step.expect){
						success = checkField(name, field, step, stepName, data, true);
						if(!success){
							break;
						}
					}
				}
				if(success){
					for(var field in step.expectNot){
						success = checkField(name, field, step, stepName, data, false);
						if(!success){
							break;
						}
					}
				}
			}
			
			/**
			// 
			// uncomment this block to log the approximate JSON form of event log results--useful for
			// adding automated event-log testing to tests that don't have it yet
			//
			if(success && (typeof data.events == "object")){
				var events = data.events;
				var json = '"events.length": ' + events.length + ',\n';
				for(var i in events){
					for(var field in events[i]){
						if(field == "info" || field == "seqNo" || field == "type" || field == "clientID") continue;
						if(typeof events[i][field] == "string")
							json += '"events[' + i + '].' + field + '": "' + events[i][field] + '",\n';
						else
							json += '"events[' + i + '].' + field + '": ' + events[i][field] + ',\n';
					}
				}
				
				console.info(json);
			}			
			**/
			
			if(success && remainingSteps.length > 0) {
				// remember requested fields
				for (var field in step.remember){
					var variableName = step.remember[field];
					step[variableName] = eval("data." + field);
				}
				
				testHarness.runStep(name, remainingTests, remainingSteps);
			}
			else {
				if(success){
					testReport[name] = {
							msg: "",
							pass : true
					};
				}
				testHarness.runNextTest(remainingTests);
			}
		} catch (e) {
			testReport[name] = {
					msg: "at " + stepName + ": exception:  '" + e,
					pass : false
			};
			testHarness.runNextTest(remainingTests);
		}
	};
	
	var checkField = function(name, field, step, stepName, data, target){
		var expected = (step.binaryCompare == true) ? step.expect[field] : utils.tokenize(tests[name], step.expect[field]);
		var actual = eval("data." + field);
		if (step.binaryResponse == true) {
			if (utils.binaryCompare(expected, actual) != target) {
				testReport[name] = {
						msg: "at " + stepName + ": expected binary " + (target ? "did not match" : "should not match") + " for field " + field,
						pass : false
					};
					success = false;
					return false;
			}
		}
		else {
			if((expected == actual) != target){
				testReport[name] = {
					msg: "at " + stepName + ": expected " + (target ? "'" : "anything but '") + expected
						+ "' but got '" + actual + "'"
						+ " for field " + field,
					pass : false
				};
				success = false;
				return false;
			}
		}
		return true;
	};
	
	this.runNextTest = function(remainingTests, doCleanUp){
		doCleanUp = typeof doCleanUp === 'undefined' ? true : doCleanUp;
		
		if(doCleanUp){
			testHarness.cleanUp();
		}
		if(remainingTests.length > 0){
			var nextTest = remainingTests.shift();
			console.log('Running test ' + nextTest);
			testHarness.runStep(nextTest, remainingTests);
		}
		else{
			testHarness.showStatus("Done.");
			testHarness.showReport();
		}
	};
	
	this.cleanUp = function(){
		console.log("Running clean up logic");
		var users = ["test1", "test2", "test3"];
		var password = "livelink";
		var tvID = 0;
		var cstoken = "";
		
		for(user in users){
			var username = users[user];

			$.ajax({
				url: '../' + testHarness.version + '/auth',
				type: 'POST',
				data: { 'username': username, 'password': password },
				dataType: 'json',
				async: false,
				success: function(data) {
					cstoken = data.cstoken;
					tvID = data.publicTempoVolumeID;
					
					$.ajax({
						url: '../' + testHarness.version + '/nodes/' + data.rootFolder + '/children',
						type: 'GET',
						data: { 'cstoken' : cstoken },
						dataType: 'json',
						async: false,
						success: function(data) {
							testHarness.deleteChildren(cstoken, data.childNodes);
						},
						error: function(jqXHR, textStatus, errorThrown){}
					});
				},
				error: function(jqXHR, textStatus, errorThrown){
				}
			});
		}
		
		if (tvID > 0) {
			$.ajax({
				url: '../' + testHarness.version + '/auth',
				type: 'POST',
				data: { 'username': "Admin", 'password': "livelink" },
				dataType: 'json',
				async: false,
				success: function(data) {
					var adminCStoken = data.cstoken;
					
					$.ajax({
						url: '../' + testHarness.version + '/nodes/' + tvID + '/children',
						type: 'GET',
						data: { 'cstoken' : cstoken },
						dataType: 'json',
						async: false,
						success: function(data) {
							testHarness.deleteChildren(adminCStoken, data.childNodes);
						},
						error: function(jqXHR, textStatus, errorThrown){}
					});
				},
				error: function(jqXHR, textStatus, errorThrown){
				}
			});

		}

		console.log("Clean up logic completed");
	};
	
	this.deleteChildren = function(cstoken, nodeIDs) {
		if (nodeIDs.length > 0) {
			for (var i in nodeIDs) {
				var id = nodeIDs[i];
				
				$.ajax({
					url: '../' + testHarness.version + '/nodes/' + id + '?cstoken=' + cstoken,
					type: 'DELETE',
					dataType: 'json',
					async: false,
					success: function(data) {},
					error: function(jqXHR, textStatus, errorThrown){}
				});
			}
		}
	};
	
	this.showReport = function(){
		$("#report").empty();
		
		for ( var testName in testReport) {
			var status = testReport[testName];
			$("#report").append($('<div />')
				.append($('<div />')
				.addClass(status.pass ? 'test-pass' : 'test-fail')
				.text(testName + (status.pass ? " passed " : " failed ") + status.msg)));
		}
		
		$('#report').append($('<div />').append($('<div class="full"/>')
				.text('Clear')
				.button()
				.click(function(){
					testReport = {};
					$("#report").empty().text('No tests run');
					$("#accordion").accordion("activate", 0);
					testHarness.showStatus("Ready");
				})));
		
		$("#accordion").accordion("activate", 1);
	};
	
	this.showStatus = function(msg){
		$("#status").text(msg);
	};
};

function BackChannel(theusername) {	
	var username = theusername;
	var token = "";
	var clientID = "";
	var cstoken = "";
	var since = -1;
	var ok = true;
	
	this.start = function(){
		$.ajax({
			url : '../' + testHarness.version + '/auth/',
			type: 'POST',
			data: { username : username, password : "livelink" },
			dataType: 'json',
			success: function(data) {
				if(data.ok){
					clientID = data.clientID;
					token = data.token;
					cstoken = data.cstoken;
					connect();
				}
				else {
					console.error("Back-channel auth failed");
				}
			},
			error: function(jqXHR, textStatus, errorThrown){
				alert("Couldn't auth back-channel user " + username);
			}
		});
	};	

	function connect(){
		$.ajax({
			url : '../' + testHarness.version + '/notifications',
			type : 'GET',
			dataType: 'text',
			data : { clientID : clientID, token : token, cstoken: cstoken, since: since },
			success : function(data) {
				if(data != null && data != ""){
					var obj = JSON.parse(data);
					console.info(username + " got:" + data);
					token = obj.token;
					if(obj.cstoken != null)	cstoken = obj.cstoken;
					if(obj.isStale){
						since = obj.maxSeqNo;
					}
					else if(obj.events != null && obj.events.length > 0){
						var newSince = obj.events[obj.events.length - 1].seqNo;
						if(newSince != null) since = newSince
					}
					if(obj.ok === false) ok = false;
				}
			},
			error : function(data){ ok = false; },
			complete : function(){
				if(ok){
					connect();
				}
			}
		});
	};
};

utils = new function() {
	this.tokenize = function(context, str) {
		if (typeof(str) == 'string') {
			var pos = 0;
			var end;
			var varName;

			while ((pos = str.indexOf('$', pos)) != -1) {
				end = str.indexOf('$', ++pos);
				if (end != -1) {
					varName = str.substr(pos, end-pos);
					str = str.replace('$' + varName + '$', eval('context.' + varName));
				}
				else {
					break;
				}
			}
		}
		
		return str;
	};
	
	/**
	This function will make a duplicate copy of an object in memory
	so editing the copied value does not affect the original
	*/
	this.clone = function(obj) {
		if (null == obj || "object" != typeof obj) return obj;
		var copy = obj.constructor();
		for (var attr in obj) {
			if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
		}
		return copy;
	};
	
    //public method
    this.clone = function(oldObject) {
        var tempClone = {};

        if (typeof(oldObject) == "object")
            for (prop in oldObject)
                // for array use private method getCloneOfArray
                if ((typeof(oldObject[prop]) == "object") &&
                                (oldObject[prop]).__isArray)
                    tempClone[prop] = this.getCloneOfArray(oldObject[prop]);
                // for object make recursive call to getCloneOfObject
                else if (typeof(oldObject[prop]) == "object")
                    tempClone[prop] = this.clone(oldObject[prop]);
                // normal (non-object type) members
                else
                    tempClone[prop] = oldObject[prop];

        return tempClone;
    };

    //private method (to copy array of objects) - getCloneOfObject will use this internally
    var getCloneOfArray = function(oldArray) {
        var tempClone = [];

        for (var arrIndex = 0; arrIndex <= oldArray.length; arrIndex++) {
        	if (typeof(oldArray[arrIndex]) == "object")
                tempClone.push(this.getCloneOfObject(oldArray[arrIndex]));
            else
                tempClone.push(oldArray[arrIndex]);
        }
        
        return tempClone;
    };

    /**
	This method will recursively search and replace the values in a json object
	*/
	this.recursiveReplace = function(find, replace, json) {
		var escapedFind = find.replace(/\$/g, '\\$');
		for (property in json) {
			if (typeof(json[property]) == 'object') {
				json[property] = utils.recursiveReplace(find, replace, json[property]);
			}
			else if (typeof(json[property]) == 'string') {
				json[property] = json[property].replace(new RegExp(escapedFind, 'g'), replace);
			}
		}
		
		return json;	
	};
	
	this.AddFormFilePart = function(boundary, fileName, contentType, fileContents){
		var header = '--' + boundary;
		
		var datastr = header + '\r\nContent-Disposition: form-data; name="file"; filename="' 
		+ fileName + '" \r\nContent-type: ' + contentType + ' \r\n\r\n' + fileContents; 
		
		return datastr;		
	};
	
	this.AddFormData = function(boundary, key, value){
		
		var header = '\r\n--' + boundary;
		var datastr = header + '\r\nContent-Disposition: form-data; ';
		
		datastr += "name=" + ' "' + key + '" ';
		
		datastr += '\r\n\r\n' + value;
		
		return datastr;
	};
	
	this.GetBinaryFileData = function(url, success, error) { 
		var req = new XMLHttpRequest();  
		req.open('GET', url, false);  
		 
		req.overrideMimeType('application/octet-stream; charset=x-user-defined');
		req.onload = function(e) {
			if (req.status != 200) {
				error();
			}
		};		
		
		req.send(null);
		return req.response;
	};
	this.UploadBinaryFile = function(url, verb, boundary, blobOrFile, success, error) {
		var buf = utils.StringToArrayBuffer(blobOrFile);
		var req = new XMLHttpRequest();
		req.open(verb, url, true);
		
		req.setRequestHeader("Content-Type", "multipart/form-data; charset=x-user-defined; boundary=" + boundary);
		req.onload = function(e) {
			if (req.status == 200) {
				success(JSON.parse(req.responseText));
			}
			else {
				error();
			}
		};
		req.upload.onprogress = function(e) {  };
		
		req.send(buf);
	};
	this.StringToArrayBuffer = function(str) {
		var buf = new ArrayBuffer(str.length);
		var bufView = new Uint8Array(buf);
		for (var i=0, strLen=str.length; i<strLen; i++) {
			bufView[i] = str.charCodeAt(i);
		}
		return buf;
	};
	// takes 2 ArrayBuffer objects and compares them
	this.binaryCompare = function(bin1, bin2) {
		var bin1View = new Uint8Array(bin1);
		var bin2View = new Uint8Array(bin2);
		var len = bin1View.length;
		var i;
		
		if (bin1View.length != bin2View.length)
			return false;
		
		for (i = 0; i < len; i++) {
			if (bin1View[i] != bin2View[i]) {
				return false;
			}
		}
		
		return true;
	};
};

$(document).ready( function() {
	for ( var testName in tests) {
		$("#tests").append($('<div />').append($('<div class="half"/>')
			.text(testName)
			.button()
			.click(function(testName) {
				return function() {
					console.log('Running test ' + testName);
					testHarness.runStep(testName);
				};
			}(testName))));
	}
	
	$("#version-select").change(function(){
		testHarness.version = $(this).val();
	});
	
	$("#run_all_button").button().click(function() {
		var testList = Object.keys(tests);
		var firstTest = testList.shift();
		console.log('Running test ' + firstTest);
		testHarness.runStep(firstTest, testList);
	});
	
	$("#accordion").accordion();


	$("#userphoto").click(function (e) {
		var data = new FormData();
		
	
		jQuery.each($('#file')[0].files, function(i, file) {
		    data.append('file', file);
		});
		
		var cstoken = "";
		var userID = 0;
		
		$.ajax({
			url: '../' + testHarness.version + '/auth',
			type: 'POST',
			data: { 'username': "test1", 'password': "livelink" },
			dataType: 'json',
			async: false,
			success: function(data) { 
				cstoken = data.cstoken;
				userID = data.userID;
			}
		});
		
		$.ajax({
		    url: '../' + testHarness.version + '/users/' + userID + '/photo?cstoken=' + encodeURI(cstoken),
		    data: data,
		    cache: false,
		    contentType: false,
		    processData: false,
		    type: 'POST'
		});
	});	

	
	$("#startBackChannel").button().click(function() {
		var bc = new BackChannel($("#backChannelUser").val());
		bc.start();
	});
});
