/**
List all tests here.

Each is test_name : { steps }
Each step is step_name : { parameters }
OR
	step_name : { 
		lib.library_test (see lib object, above)
		variables: {}
	}

Parameters can be (all are optional unless noted):
	url -- the url to hit (REQUIRED)
	verb -- the http verb (GET, POST, PUT, or DELETE) (REQUIRED)
	params -- the parameters to include with the request
	expectType -- gives expected return types. Fields returned but not listed here are ignored.
	expect -- gives expected return values. Fields returned but not listed here are ignored.
			For downloads, the special field "content" will contain the downloaded file (assumes the file downloads as a string).
	remember -- fields to remember, and the name to remember them by. Subsequent steps in the same
				tests can refer to the variable as "$<stepname>.<variablename>"
	
Tests should tear down what they set up so that the next run doesn't encounter old data.
**/
	
var tests = {
		
	auth_get_returnsOk: {
		step1: {
			url: "auth",
			verb: "GET",
			expectType: {
				"ok": "boolean"
			},
			expect: {
				"ok": true
			}
		}
	},
	
	auth_post_returnsOK: {
		auth: {
			libraryStep : lib.auth,
			variables : { userName : "test1" }
		}
	},
	
	auth_withBadCreds_returnsFalse: {
		step1: {
			url: "auth",
			verb: "POST",
			params: {
				username: "nosuchuser",
				password: "badpassword"
			},
			expectType: {
				"ok": "boolean",
				"auth": "boolean",
				cstoken: "undefined"
			},
			expect: {
				"ok": false,
				"auth": false
			}
		}
	},
	
	auth_withBadPassword_returnsFalse: {
		step1: {
			url: "auth",
			verb: "POST",
			params: {
				username: "test1",
				password: "badpassword"
			},
			expectType: {
				"ok": "boolean",
				"auth": "boolean",
				cstoken: "undefined"
			},
			expect: {
				"ok": false,
				"auth": false
			}
		}
	},
	
	auth_get_returnsAuthBad: {
		step1: {
			url: "https://badauth",
			verb: "GET",
			expectError: 0
		}
	},
	
	get_user_storage: {
		auth1: {
			libraryStep : lib.auth,
			variables : { userName : "test1" }
		},
		getUserInfo: {
			url: "users/$auth1.userid$",
			verb: "GET",
			params: {
				"cstoken": "$auth1.cookie$"
			},
			expectType: {
				"ok": "boolean",
				"storageLimit": "number"
			},
			expect: {
				"ok": true,
			},
		}
	},
	
	//************************************
	//Event Log Testing - Tempo-1915
	//************************************
	
	//This test will send a front channel request to test that the minSeqNo and maxSepNo is returned
	basic_backChannel: {
		VERSIONS: ["v4"],
		auth1: {
			libraryStep : lib.auth,
			variables : { userName : "test1" }
		},
		auth2: {
			libraryStep : lib.auth,
			variables : { userName : "test2" }
		},
		initialState: {
			url: "notifications",
			verb: "GET",
			params: {
				cstoken: "$auth1.cookie$",
				token: "$auth1.token$",
				clientID: "$auth1.clientID$",
				since: -1,
				eventLog: true
				// Note that we pass eventLog=true here to make this a front-channel request, not a back-channel connection.
				// While since = -1 will always result in an immediate return, since this sequence number is guaranteed to
				// be stale, the difference is that eventLog=true means no "token" will be returned, and the current
				// token (returned by auth) is still valid for use below
			},
			expectType: {
				"isStale": "boolean",
				"minSeqNo": "number",
				"maxSeqNo" : "number"
			},
			expect: {
				"ok": true,
				"isStale": true
			},
			remember: {
				"maxSeqNo": "lastEvent"				
			}
		},
		// do something to generate a notification
		createNode: {
			libraryStep: lib.createFolder,
			variables: {
				"parentID": "$auth1.rootFolder$",
				"name": "expected_name",
				"cstoken": "$auth1.cookie$"
			}
		},
		// This test is to ensure that the API, as a different user, returns the correct maxSeqNo after one more available event was added to the log
		
		initialState2: {
			url: "notifications",
			verb: "GET",
			params: {
				cstoken: "$auth2.cookie$",
				token: "$auth2.token$",
				clientID: "$auth2.clientID$",
				since: -1,
				eventLog: true
			},
			expectType: {
				"isStale": "boolean",
				"minSeqNo": "number",
				"maxSeqNo" : "number"
			},
			expect: {
				"ok": true,
				"isStale": true
			},
			remember: {
				maxSeqNo: "lastEvent"
			}
		},
		
		//This test is to confirm that a back channel connection will retrieve the new folder created
		
		eventLog: {
			url: "notifications",
			verb: "GET",
			params: {
				cstoken: "$auth1.cookie$",
				token: "$auth1.token$",
				clientID: "$auth1.clientID$",
				since: "$initialState.lastEvent$"
			},
			expectType: {
				"ok": "boolean",
				"events": "object"
			},
			expect: {
				"ok": true,
				"events.length": 1,
				"events[0].seqNo": "$initialState2.lastEvent$",
				"events[0].type": "notification",
				"events[0].subtype": "foldercreated",
				"events[0].name": "$createNode.variables.name$",
				"events[0].parentID": "$auth1.rootFolder$",
				"events[0].username": "$auth1.userName$",
				"events[0].userID": "$auth1.userID$",
				"events[0].firstName": "$auth1.firstName$",
				"events[0].lastName": "$auth1.lastName$"
			},
			remember: {
				token: "token"
			}
		},
		// Connecting again to the back-channel with the same sequence number retrieves the event again.
		// This covers cases in which a client receives a back-channel message but is killed before processing it.
		eventLogDoOver: {
			url: "notifications",
			verb: "GET",
			params: {
				cstoken: "$auth1.cookie$",
				token: "$eventLog.token$",
				clientID: "$auth1.clientID$",
				since: "$initialState.lastEvent$"
			},
			expectType: {
				"ok": "boolean",
				"events": "object"
			},
			expect: {
				"ok": true,
				"events.length": 1,
				"events[0].seqNo": "$initialState2.lastEvent$",
				"events[0].type": "notification",
				"events[0].subtype": "foldercreated",
				"events[0].name": "$createNode.variables.name$",
				"events[0].parentID": "$auth1.rootFolder$",
				"events[0].username": "$auth1.userName$",
				"events[0].userID": "$auth1.userID$",
				"events[0].firstName": "$auth1.firstName$",
				"events[0].lastName": "$auth1.lastName$"
			}
		},
		// test2 doesn't see the event
		eventLog2: {
			url: "notifications",
			verb: "GET",
			params: {
				cstoken: "$auth2.cookie$",
				token: "$auth2.token$",
				clientID: "$auth2.clientID$",
				since: "$initialState.lastEvent$",
				eventLog: true
			},
			expectType: {
				"ok": "boolean",
				"events": "object"
			},
			expect: {
				"ok": true,
				"events.length": 0
			}
		}
		
	},
	
	queued_events: {
		VERSIONS: ["v4"],
		auth1: {
			libraryStep : lib.auth,
			variables: { userName : "test1"}
		},
		initialState: {
			url: "notifications",
			verb: "GET",
			params: {
				cstoken: "$auth1.cookie$",
				token: "$auth1.token$",
				clientID: "$auth1.clientID$",
				since: -1
			},
			expectType: {
				"isStale": "boolean",
				"minSeqNo": "number",
				"maxSeqNo" : "number"
			},
			expect: {
				"ok": true,
				"isStale": true
			},
			remember: {
				"maxSeqNo": "lastEvent",
				"maxSeqNo + 1": "nextEvent",
				token : "token"
			}
		},
		// do something to generate two notifications
		createNode1: {
			libraryStep: lib.createFolder,
			variables: {
				"parentID": "$auth1.rootFolder$",
				"name": "expected_name1",
				"cstoken": "$auth1.cookie$"
			}
		},
		createNode2: {
			libraryStep: lib.createFolder,
			variables: {
				"parentID": "$auth1.rootFolder$",
				"name": "expected_name2",
				"cstoken": "$auth1.cookie$"
			}
		},
		// get back-channel, which should return both events at once from the Engine's queue
		eventLog: {
			url: "notifications",
			verb: "GET",
			params: {
				cstoken: "$auth1.cookie$",
				token: "$initialState.token$",
				clientID: "$auth1.clientID$",
				since: "$initialState.lastEvent$"
			},
			expectType: {
				"events": "object"
			},
			expect: {
				"events.length": 2,
				"events[0].seqNo": "$initialState.nextEvent$",
				"events[0].type": "notification",
				"events[0].subtype": "foldercreated",
				"events[0].name": "$createNode1.variables.name$",
				"events[0].parentID": "$auth1.rootFolder$",
				"events[0].username": "$auth1.userName$",
				"events[0].userID": "$auth1.userID$",
				"events[0].firstName": "$auth1.firstName$",
				"events[0].lastName": "$auth1.lastName$",
				"events[1].subtype" : "foldercreated",
				"events[1].name" : "$createNode2.variables.name$",
				"events[1].parentID": "$auth1.rootFolder$",
				"events[1].username": "$auth1.userName$",
				"events[1].userID": "$auth1.userID$",
				"events[1].firstName": "$auth1.firstName$",
				"events[1].lastName": "$auth1.lastName$"
			}
		}
	},
	
	// sharing a folder
	Event_Log_on_Shared_Folder: {
		VERSIONS: ["v4"],
		auth1: {
			libraryStep : lib.auth,
			variables : { userName : "test1" }
		},
		auth2: {
			libraryStep : lib.auth,
			variables : { userName : "test2" }
		},
		initialState: {
			url: "notifications",
			verb: "GET",
			params: {
				cstoken: "$auth1.cookie$",
				token: "$auth1.token$",
				clientID: "$auth1.clientID$",
				since: -1,
				eventLog: true
				// Note that we pass eventLog=true here to make this a front-channel request, not a back-channel connection.
				// While since = -1 will always result in an immediate return, since this sequence number is guaranteed to
				// be stale, the difference is that eventLog=true means no "token" will be returned, and the current
				// token (returned by auth) is still valid for use below
			},
			expectType: {
				"isStale": "boolean",
				"minSeqNo": "number",
				"maxSeqNo" : "number"
			},
			expect: {
				"ok": true,
				"isStale": true
			},
			remember: {
				"maxSeqNo": "lastEventShare",
				"maxSeqNo + 4": "nextEventShare"  // added 4 to the maxSeqNo due to create and share notifications which total 4 - create folder, share folder, create shared folder, accept shared folder
			}
		},
		createNode2: {
			libraryStep: lib.createFolder,
			variables: {
				"parentID": "$auth1.rootFolder$",
				"name": "Folder1",
				"cstoken": "$auth1.cookie$"
			}
		},
		share : {
			libraryStep : lib.share,
			variables : {
				id : "$createNode2.id$",
				userName : "test2",
				shareType : 2,
				cstoken : "$auth1.cookie$"
			}
		},
		accept : {
			libraryStep : lib.accept,
			variables : { id: "$createNode2.id$", cstoken: "$auth2.cookie$" }
		},
		
		initialShareState1: {
			url: "notifications",
			verb: "GET",
			params: {
				cstoken: "$auth2.cookie$",
				token: "$auth2.token$",
				clientID: "$auth2.clientID$",
				since: -1,
				eventLog: true
			},
			expectType: {
				"isStale": "boolean",
				"minSeqNo": "number",
				"maxSeqNo" : "number"
			},
			expect: {
				"ok": true,
				"isStale": true
			},
			remember: {
				maxSeqNo: "shareEvent1"
			}
		},
		
		// This test is to ensure that the API, as a different user, returns the correct maxSeqNo after one more available event was added to the log
		
		initialState2: {
			url: "notifications",
			verb: "GET",
			params: {
				cstoken: "$auth2.cookie$",
				token: "$auth2.token$",
				clientID: "$auth2.clientID$",
				since: -1,
				eventLog: true
			},
			expectType: {
				"isStale": "boolean",
				"minSeqNo": "number",
				"maxSeqNo" : "number"
			},
			expect: {
				"ok": true,
				"isStale": true
				//"maxSeqNo": "$initialState.nextEventShare$" --since the sequence numbers no longer get incremented by 1, this is an invalid test
			},
			remember: {
				maxSeqNo: "lastEventShare"
			}
		},
		
		//This test is to confirm that a back channel connection will retrieve the new folder created
		
		eventLog: {
			url: "notifications",
			verb: "GET",
			params: {
				cstoken: "$auth1.cookie$",
				token: "$auth1.token$",
				clientID: "$auth1.clientID$",
				since: "$initialState.lastEventShare$"
			},
			expectType: {
				"ok": "boolean",
				"events": "object"
			},
			expect: {
				"ok": true,
				"events.length": 3,
				"events[0].type": "notification",
				"events[0].subtype": "foldercreated",
				"events[0].name": "$createNode2.variables.name$",
				"events[0].parentID": "$auth1.rootFolder$",
				"events[0].username": "$auth1.userName$",
				"events[0].userID": "$auth1.userID$",
				"events[0].firstName": "$auth1.firstName$",
				"events[0].lastName": "$auth1.lastName$",
				"events[1].type": "notification",
				"events[1].subtype": "foldershared",
				"events[1].name": "$createNode2.variables.name$",
				"events[1].username": "$auth1.userName$",
				"events[1].userID": "$auth1.userID$",
				"events[1].firstName": "$auth1.firstName$",
				"events[1].lastName": "$auth1.lastName$",
				"events[2].type": "notification",
				"events[2].subtype": "shareaccepted",
				"events[2].username": "$auth2.userName$",
				"events[2].userID": "$auth2.userID$",
				"events[2].firstName": "$auth2.firstName$",
				"events[2].lastName": "$auth2.lastName$"
			},
			remember: {
				token: "token"
			}
		},
		// Connecting again to the back-channel with the same sequence number retrieves the event again.
		// This covers cases in which a client receives a back-channel message but is killed before processing it.
		eventLogDoOver: {
			url: "notifications",
			verb: "GET",
			params: {
				cstoken: "$auth1.cookie$",
				token: "$eventLog.token$",
				clientID: "$auth1.clientID$",
				since: "$initialState.lastEventShare$"
			},
			expectType: {
				"ok": "boolean",
				"events": "object"
			},
			expect: {
				"ok": true,
				"events.length": 3,
				"events[0].type": "notification",
				"events[0].subtype": "foldercreated",
				"events[0].name": "$createNode2.variables.name$",
				"events[0].parentID": "$auth1.rootFolder$",
				"events[0].username": "$auth1.userName$",
				"events[0].userID": "$auth1.userID$",
				"events[0].firstName": "$auth1.firstName$",
				"events[0].lastName": "$auth1.lastName$",
				"events[1].type": "notification",
				"events[1].subtype": "foldershared",
				"events[1].name": "$createNode2.variables.name$",
				"events[1].username": "$auth1.userName$",
				"events[1].userID": "$auth1.userID$",
				"events[1].firstName": "$auth1.firstName$",
				"events[1].lastName": "$auth1.lastName$",
				"events[2].type": "notification",
				"events[2].subtype": "shareaccepted",
				"events[2].username": "$auth2.userName$",
				"events[2].userID": "$auth2.userID$",
				"events[2].firstName": "$auth2.firstName$",
				"events[2].lastName": "$auth2.lastName$"
			}
		},
		// test2 doesn't see the event
		eventLog2: {
			url: "notifications",
			verb: "GET",
			params: {
				cstoken: "$auth2.cookie$",
				token: "$auth2.token$",
				clientID: "$auth2.clientID$",
				since: "$initialState.lastEventShare$",
				eventLog: true
			},
			expectType: {
				"ok": "boolean",
				"events": "object"
			},
			expect: {
				"ok": true,
				"events.length": 2,
				"events[0].type": "notification",
				"events[0].subtype": "foldershared",
				"events[0].name": "$createNode2.variables.name$",
				"events[1].username": "$auth1.userName$",
				"events[1].userID": "$auth1.userID$",
				"events[1].firstName": "$auth1.firstName$",
				"events[1].lastName": "$auth1.lastName$",
				"events[1].type": "notification",
				"events[1].subtype": "foldercreated",
				"events[1].name": "$createNode2.variables.name$ (test1)",
				"events[1].username": "$auth2.userName$",
				"events[1].userID": "$auth2.userID$",
				"events[1].firstName": "$auth2.firstName$",
				"events[1].lastName": "$auth2.lastName$"
			}
		}
			
	},
		
	
	
	nodes_get_returnsSyncTree: {
		auth: {
			libraryStep : lib.auth,
			variables : { userName : "test1" }
		},
		nodes: {
			url: "nodes",
			verb: "GET",
			params: {
				cstoken: "$auth.cookie$"
			},
			expectType: {
				"contents": "object",
				"count": "number"
			},
			expect: {
				"ok": true,
				"count": 0
			}
		}
	},
	
	//*********************************************
	// Testing Tempo-1238 & Tempo-1237 & Tempo-1243
	//*********************************************
	basicNodeActions: {
		auth1: {
			libraryStep : lib.auth,
			variables : { userName : "test1" }
		},
		auth2: {
			libraryStep : lib.auth,
			variables : { userName : "test2" }
		},
		auth3: {
			libraryStep : lib.auth,
			variables : { userName : "test3" }
		},
		initialState: {
			versions: ["v4"],
			libraryStep : lib.getSeqNo,
			variables : {
				cookie : "$auth1.cookie$",
				token : "$auth1.token$",
				clientID : "$auth1.clientID$"
			}
		},
		createNode: {
			libraryStep: lib.createFolder,
			variables: {
				"parentID": "$auth1.rootFolder$",
				"name": "SubFolder1",
				"cstoken": "$auth1.cookie$"
			}
		},
		createSubNode: {
			libraryStep: lib.createFolder,
			variables: {
				"parentID": "$createNode.id$",
				"name": "Sub Of SubFolder1",
				"cstoken": "$auth1.cookie$"
			}
		},
		copySubFolder:{
			libraryStep: lib.createFolder,
			variables: {
				"parentID": "$createSubNode.id$",
				"name": "Copy Subfolder1",
				"cstoken": "$auth1.cookie$"
			}
},
		moveSubFolder1:{
			libraryStep: lib.createFolder,
			variables: {
				"parentID": "$createSubNode.id$",
				"name": "Move This Subfolder1",
				"cstoken": "$auth1.cookie$"
			}
},
		moveSubFolder2:{
			libraryStep: lib.createFolder,
			variables: {
				"parentID": "$createSubNode.id$",
				"name": "Move This Subfolder2",
				"cstoken": "$auth1.cookie$"
			}
},
		// Create a read-write share with a user
		share2 : {
			libraryStep : lib.share,
			variables : {
				id : "$createSubNode.id$",
				userName : "test2",
				shareType : 2,
				cstoken : "$auth1.cookie$"
			}
		},
		accept2 : {
			libraryStep : lib.accept,
			variables : { id: "$createSubNode.id$", cstoken: "$auth2.cookie$" }
		},
		// Create a read-only share with a user
		share1 : {
			libraryStep : lib.share,
			variables : {
				id : "$createSubNode.id$",
				userName : "test3",
				shareType : 1,
				cstoken : "$auth1.cookie$"
			}
		},
		accept1 : {
			libraryStep : lib.accept,
			variables : { id: "$createSubNode.id$", cstoken: "$auth3.cookie$" }
		},
		
		getObjectInfo: {
			url: "nodes/$createNode.id$",
			verb: "GET",
			params: {
				"cstoken": "$auth1.cookie$"
			},
			expectType: {
				"ok": "boolean",
				"contents[0].id": "number",
				"count": "number"
			},
			expect: {
				"ok": true,
				"contents[0].id": "$createNode.id$",
				"count": 1
			}
		},
		// Copy the node as the owner
		copyNode: {
			url: "nodes/$auth1.rootFolder$/children",
			verb: "POST",
			params: {
				"cstoken": "$auth1.cookie$",
				"copyFrom": "$createSubNode.id$"
			},
			expectType: {
				"ok": "boolean",
				"id": "number"
			},
			expect: {
				"ok": true
			},
			remember: {
				"id": "id"
			}
		},
		// Copy the node as a read-write collaborator
		copyNodeRW: {
			url: "nodes/$auth2.rootFolder$/children",
			verb: "POST",
			params: {
				"cstoken": "$auth2.cookie$",
				"copyFrom": "$createSubNode.id$"
			},
			expectType: {
				"ok": "boolean",
				"id": "number"
			},
			expect: {
				"ok": true
			},
			remember: {
				"id": "id"
			}
	},
		// Copy the node as a read-only collaborator
		copyNodeRO: {
			url: "nodes/$auth3.rootFolder$/children",
			verb: "POST",
			params: {
				"cstoken": "$auth3.cookie$",
				"copyFrom": "$createSubNode.id$"
			},
			expectType: {
				"ok": "boolean",
				"id": "number"
			},
			expect: {
				"ok": true
			},
			remember: {
				"id": "id"
			}			
		},
		// As Owner, move the node
		
		moveNode: {
			url: "nodes/$moveSubFolder1.id$",
			verb: "PUT",
			params: {
				"cstoken": "$auth1.cookie$",
				"parentID": "$auth1.rootFolder$"
			},
			expectType: {
				"ok": "boolean"
			},
			expect: {
				"ok": true
			}
		},
		// As Read-only collaborator, move the node
		moveNodeRO: {
			url: "nodes/$moveSubFolder2.id$",
			verb: "PUT",
			params: {
				"cstoken": "$auth3.cookie$",
				"parentID": "$auth3.rootFolder$"
			},
			expectType: {
				"ok": "boolean"
			},
			expect: {
				"ok": false
			}
		},
		// As Read-write collaborator, move the node
		moveNodeRW: {
			url: "nodes/$moveSubFolder2.id$",
			verb: "PUT",
			params: {
				"cstoken": "$auth2.cookie$",
				"parentID": "$auth2.rootFolder$"
			},
			expectType: {
				"ok": "boolean"
			},
			expect: {
				"ok": true
			}
		},
		renameNode: {
			url: "nodes/$createSubNode.id$",
			verb: "PUT",
			params: {
				"cstoken": "$auth1.cookie$",
				"name": "NewName1"
			},
			expectType: {
				"ok": "boolean"
			},
			expect: {
				"ok": true
			}
		},
		// As Read-only collaborator, rename the node
		renameNodeRO: {
			url: "nodes/$copySubFolder.id$",
			verb: "PUT",
			params: {
				"cstoken": "$auth3.cookie$",
				"name": "NewName2"
			},
			expectType: {
				"ok": "boolean"
			},
			expect: {
				"ok": false
			}
		},
		// As Read-write collaborator, rename the node
		renameNodeRW: {
			url: "nodes/$copySubFolder.id$",
			verb: "PUT",
			params: {
				"cstoken": "$auth2.cookie$",
				"name": "NewName3"
			},
			expectType: {
				"ok": "boolean"
			},
			expect: {
				"ok": true
			}
		},
		
		breadcrumbs: {
			url: "nodes/$copySubFolder.id$/path",
			verb: "GET",
			params: {
				cstoken: "$auth1.cookie$"
			},
			expectType: {
				"path": "object"
			},
			expect: {
				"path.length": 4
			}			
		},
		// Test Special characters
		createBadCSNode: {
			url: "nodes/$auth1.rootFolder$/children",
			verb: "POST",
			params: {
				cstoken: "$auth1.cookie$",
				name: "Sub:Folder"
			},
			expectType: {
				"ok": "boolean",
				"errMsg": "string"
			},
			expect: {
				"ok": false,
				"errMsg": "Name cannot contain the character ':'."
			}
		},

		createBadWindowsName: {
			libraryStep: lib.createFolder,
			variables: {
				"parentID": "$auth1.rootFolder$",
				"name": "Spec<>ial Ch/\\ *\"",
				"cstoken": "$auth1.cookie$"
			}
		},

		createUTF8Node: {
			libraryStep: lib.createFolder,
			variables: {
				"parentID": "$auth1.rootFolder$",
				"name": "カタカナ",
				"cstoken": "$auth1.cookie$"
			}
		},
		
		//File Set operations
		// Regular file upload
		uploadFile1 : {
			url : "nodes/$createSubNode.id$/children",
			verb : "POST",
			type : "multipart/form-data",
			fileContents : "This is part of the File and Folder Set testing. Created by test1 user",
			fileName : "test1.txt",
			params : { 
				cstoken : "$auth1.cookie$"
					 
			},
			expectType: {
				"ok": "boolean"
			},
			expect: {
				"ok": true,
				"name": "test1.txt"
			},
			remember : {
				'id': 'id'
			}
		},
		
		//Read-write collaborator tries to upload a file to shared folder.
		uploadFile2 : {
			url : "nodes/$createSubNode.id$/children",
			verb : "POST",
			type : "multipart/form-data",
			fileContents : "This is part of the File and Folder Set testing. Created by test2 user",
			fileName : "test2.txt",
			params : { 
				cstoken : "$auth2.cookie$"
					 
			},
			expectType: {
				"ok": "boolean"
			},
			expect: {
				"ok": true,
				"name": "test2.txt"
			},
			remember : {
				'id': 'id'
			}
			
		},
		//Read-only collaborator tries to upload a file to shared folder.
		uploadFile3 : {
			url : "nodes/$createSubNode.id$/children",
			verb : "POST",
			type : "multipart/form-data",
			fileContents : "This is part of the File and Folder Set testing. Created by test3 user",
			fileName : "test3.txt",
			params : { 
				cstoken : "$auth3.cookie$"					 
			},
			expectType: {
				"ok": "boolean",
				"errMsg": "string"
			},
			expect: {
				"ok": false,
				"errMsg": "Insufficient permission to add node to container."
			}
		},
		//Read-only collaborator copies a file from a shared folder.
		copyFile1: {
			url: "nodes/$auth3.rootFolder$/children",
			verb: "POST",
			params: {
				"cstoken": "$auth3.cookie$",
				"copyFrom": "$uploadFile2.id$"
			},
			expectType: {
				"ok": "boolean",
				"id": "number"
			},
			expect: {
				"ok": true
			},
			remember: {
				"id": "id"
			}
		},
		
		//Rename file.
		renameFile1: {
			url: "nodes/$copyFile1.id$",
			verb: "PUT",
			params: {
				"cstoken": "$auth3.cookie$",
				"name": "NewFileName1"
			},
			expectType: {
				"ok": "boolean"
			},
			expect: {
				"ok": true
			}
		},
		
		//As the read-write collaborator, move a file out of shared folder and into collaborators root.
		moveFileRW: {
			url: "nodes/$uploadFile1.id$",
			verb: "PUT",
			params: {
				"cstoken": "$auth2.cookie$",
				"parentID": "$auth2.rootFolder$"
			},
			expectType: {
				"ok": "boolean"
			},
			expect: {
				"ok": true
			}
		},
		// Now get file and folder node information (TEMPO-1237)
		
		GetNodeInfoFile1 : {
			url: "nodes/$uploadFile1.id$",
			verb: "GET",
			params : { cstoken : "$auth2.cookie$" },
			expectType : { ok: "boolean" },
			expect : { 
				ok : true,
				"contents[0].dataHash" : "184f46790ee310509f7e8781f922d8c8f3ae932f" 
			}
		},
		// Confirm download as owner
		DownloadAsOwner: {
			url: "nodes/$copyFile1.id$/content",
			verb: "GET",
			dataType: "html",
			params : { cstoken : "$auth3.cookie$" },
			expectType : { content: "string" },
			expect : { content : "$uploadFile2.fileContents$" 
			}
		},
		
		//Get info as RW collaborator
		GetNodeInfoFile2 : {
			url: "nodes/$uploadFile2.id$",
			verb: "GET",
			params : { cstoken : "$auth2.cookie$" },
			expectType : { ok: "boolean" },
			expect : { 
				ok : true,
				"contents[0].dataHash" : "99dd78b83fb27280188c12cf1d8c03691471a767" 
			}
		},
		// Confirm download as RW collaborator
		DownloadAsRW: {
			url: "nodes/$uploadFile2.id$/content",
			verb: "GET",
			dataType: "html",
			params : { cstoken : "$auth2.cookie$" },
			expectType : { content: "string" },
			expect : {content : "$uploadFile2.fileContents$" }
		},

		//Get info as RO collaborator
		GetNodeInfoFile3 : {
			url: "nodes/$uploadFile2.id$",
			verb: "GET",
			params : { cstoken : "$auth3.cookie$" },
			expectType : { ok: "boolean" },
			expect : { 
				ok : true,
				"contents[0].dataHash" : "99dd78b83fb27280188c12cf1d8c03691471a767" 
				}
		},

		// Confirm download as RO collaborator
		DownloadAsRO: {
			url: "nodes/$uploadFile2.id$/content",
			verb: "GET",
			dataType: "html",
			params : { cstoken : "$auth3.cookie$" },
			expectType : { content: "string" },
			expect : {content : "$uploadFile2.fileContents$" }
		},

		//Get info for an unshared file
		GetNodeInfoFile4 : {
			url: "nodes/$copyFile1.id$",
			verb: "GET",
			params : { cstoken : "$auth1.cookie$" },
			expectType : { ok: "boolean" },
			expect : { 
				ok : false
			}
		},

		// Clean up - Delete File and Folder nodes
		deleteCopyFile1: {
			url: "nodes/$copyFile1.id$",
			verb: "DELETE",
			params: {
				cstoken: "$auth3.cookie$"
			},
			expectType: {
				"ok": "boolean"
			},
			expect: {
				"ok": true
			}
		},
		deleteUploadFile1: {
			url: "nodes/$uploadFile1.id$",
			verb: "DELETE",
			params: {
				cstoken: "$auth2.cookie$"
			},
			expectType: {
				"ok": "boolean"
			},
			expect: {
				"ok": true
			}
		},
		deleteUploadFile2: {
			url: "nodes/$uploadFile2.id$",
			verb: "DELETE",
			params: {
				cstoken: "$auth2.cookie$"
			},
			expectType: {
				"ok": "boolean"
			},
			expect: {
				"ok": true
			}
		},
		deleteCreateNode: {
			url: "nodes/$createNode.id$",
			verb: "DELETE",
			params: {
				cstoken: "$auth1.cookie$"
			},
			expectType: {
				"ok": "boolean"
			},
			expect: {
				"ok": true
			}
		},
		deleteCopyNode: {
			url: "nodes/$copyNode.id$",
			verb: "DELETE",
			params: {
				cstoken: "$auth1.cookie$"
			},
			expectType: {
				"ok": "boolean"
			},
			expect: {
				"ok": true
			}
		},
		deleteCopyNodeRW: {
			url: "nodes/$copyNodeRW.id$",
			verb: "DELETE",
			params: {
				cstoken: "$auth2.cookie$"
			},
			expectType: {
				"ok": "boolean"
			},
			expect: {
				"ok": true
			}
		},
		deleteMoveNodeRW: {
			url: "nodes/$moveSubFolder2.id$",
			verb: "DELETE",
			params: {
				cstoken: "$auth2.cookie$"
			},
			expectType: {
				"ok": "boolean"
			},
			expect: {
				"ok": true
			}
		},
		deleteCopyNodeRO: {
			url: "nodes/$copyNodeRO.id$",
			verb: "DELETE",
			params: {
				cstoken: "$auth3.cookie$"
			},
			expectType: {
				"ok": "boolean"
			},
			expect: {
				"ok": true
			}
		},
		//
		// Check back-channel responses for each user
		//
		eventLog1: {
			versions: ["v4"],
			url: "notifications",
			verb: "GET",
			params: {
				cstoken: "$auth1.cookie$",
				token: "$auth1.token$",
				clientID: "$auth1.clientID$",
				since: "$initialState.lastEvent$"
			},
			expectType: {
				"ok": "boolean",
				"events": "object"
			},
			expect: {
				"ok": true,
				"events.length": 22,
				"events[0].id": "$createNode.id$",
				"events[0].isReadOnly": false,
				"events[0].name": "SubFolder1",
				"events[0].parentID": "$auth1.rootFolder$",
				"events[0].shareType": 0,
				"events[0].subtype": "foldercreated",
				"events[0].username": "$auth1.userName$",
				"events[0].userID": "$auth1.userID$",
				"events[0].firstName": "$auth1.firstName$",
				"events[0].lastName": "$auth1.lastName$",
				"events[1].id": "$createSubNode.id$",
				"events[1].isReadOnly": false,
				"events[1].name": "Sub Of SubFolder1",
				"events[1].parentID": "$createNode.id$",
				"events[1].shareType": 0,
				"events[1].subtype": "foldercreated",
				"events[1].username": "$auth1.userName$",
				"events[1].userID": "$auth1.userID$",
				"events[1].firstName": "$auth1.firstName$",
				"events[1].lastName": "$auth1.lastName$",
				"events[2].id": "$copySubFolder.id$",
				"events[2].isReadOnly": false,
				"events[2].name": "Copy Subfolder1",
				"events[2].parentID": "$createSubNode.id$",
				"events[2].shareType": 0,
				"events[2].subtype": "foldercreated",
				"events[2].username": "$auth1.userName$",
				"events[2].userID": "$auth1.userID$",
				"events[2].firstName": "$auth1.firstName$",
				"events[2].lastName": "$auth1.lastName$",
				"events[3].id": "$moveSubFolder1.id$",
				"events[3].isReadOnly": false,
				"events[3].name": "Move This Subfolder1",
				"events[3].parentID": "$createSubNode.id$",
				"events[3].shareType": 0,
				"events[3].subtype": "foldercreated",
				"events[3].username": "$auth1.userName$",
				"events[3].userID": "$auth1.userID$",
				"events[3].firstName": "$auth1.firstName$",
				"events[3].lastName": "$auth1.lastName$",
				"events[4].id": "$moveSubFolder2.id$",
				"events[4].isReadOnly": false,
				"events[4].name": "Move This Subfolder2",
				"events[4].parentID": "$createSubNode.id$",
				"events[4].shareType": 0,
				"events[4].subtype": "foldercreated",
				"events[4].username": "$auth1.userName$",
				"events[4].userID": "$auth1.userID$",
				"events[4].firstName": "$auth1.firstName$",
				"events[4].lastName": "$auth1.lastName$",
				"events[5].id": "$createSubNode.id$",
				"events[5].name": "Sub Of SubFolder1",
				"events[5].shareOwner": "$auth1.userID$",
				"events[5].subtype": "foldershared",
				"events[5].toUser": "$auth2.userID$",
				"events[5].username": "$auth1.userName$",
				"events[5].userID": "$auth1.userID$",
				"events[5].firstName": "$auth1.firstName$",
				"events[5].lastName": "$auth1.lastName$",
				"events[6].id": "$createSubNode.id$",
				"events[6].shareOwner": "$auth1.userID$",
				"events[6].subtype": "shareaccepted",
				"events[6].toUser": "$auth2.userID$",
				"events[6].username": "$auth2.userName$",
				"events[6].userID": "$auth2.userID$",
				"events[6].firstName": "$auth2.firstName$",
				"events[6].lastName": "$auth2.lastName$",
				"events[7].id": "$createSubNode.id$",
				"events[7].name": "Sub Of SubFolder1",
				"events[7].shareOwner": "$auth1.userID$",
				"events[7].subtype": "foldershared",
				"events[7].toUser": "$auth3.userID$",
				"events[7].username": "$auth1.userName$",
				"events[7].userID": "$auth1.userID$",
				"events[7].firstName": "$auth1.firstName$",
				"events[7].lastName": "$auth1.lastName$",
				"events[8].id": "$createSubNode.id$",
				"events[8].shareOwner": "$auth1.userID$",
				"events[8].subtype": "shareaccepted",
				"events[8].toUser": "$auth3.userID$",
				"events[8].username": "$auth3.userName$",
				"events[8].userID": "$auth3.userID$",
				"events[8].firstName": "$auth3.firstName$",
				"events[8].lastName": "$auth3.lastName$",
				"events[9].copyFrom": "$createNode.id$",
				"events[9].id": "$copyNode.id$",
				"events[9].name": "Sub Of SubFolder1",
				"events[9].oldName": "Sub Of SubFolder1",
				"events[9].originalID": "$createSubNode.id$",
				"events[9].parentID": "$auth1.rootFolder$",
				"events[9].subtype": "copy",
				"events[9].username": "$auth1.userName$",
				"events[9].userID": "$auth1.userID$",
				"events[9].firstName": "$auth1.firstName$",
				"events[9].lastName": "$auth1.lastName$",
				"events[10].id": "$moveSubFolder1.id$",
				//"events[10].moveFrom": "$createSubNode.id$", //TEMPO-2236
				"events[10].name": "Move This Subfolder1",
				"events[10].parentID": "$auth1.rootFolder$",
				"events[10].subtype": "move",
				"events[10].username": "$auth1.userName$",
				"events[10].userID": "$auth1.userID$",
				"events[10].firstName": "$auth1.firstName$",
				"events[10].lastName": "$auth1.lastName$",
				"events[11].id": "$moveSubFolder2.id$",
				"events[11].name": "Move This Subfolder2",
				//"events[11].parentID": "$createSubNode.id$", // uncomment to test part of TEMPO-79
				"events[11].subtype": "delete",
				"events[11].username": "$auth2.userName$",
				"events[11].userID": "$auth2.userID$",
				"events[11].firstName": "$auth2.firstName$",
				"events[11].lastName": "$auth2.lastName$",
				"events[12].id": "$createSubNode.id$",
				"events[12].name": "NewName1",
				"events[12].subtype": "renamed",
				"events[12].username": "$auth1.userName$",
				"events[12].userID": "$auth1.userID$",
				"events[12].firstName": "$auth1.firstName$",
				"events[12].lastName": "$auth1.lastName$",
				"events[13].id": "$copySubFolder.id$",
				"events[13].name": "NewName3",
				"events[13].subtype": "renamed",
				"events[13].username": "$auth2.userName$",
				"events[13].userID": "$auth2.userID$",
				"events[13].firstName": "$auth2.firstName$",
				"events[13].lastName": "$auth2.lastName$",
				"events[14].id": "$createBadWindowsName.id$",
				"events[14].isReadOnly": false,
				"events[14].name": 'Spec<>ial Ch/\\ *"',
				"events[14].parentID": "$auth1.rootFolder$",
				"events[14].shareType": 0,
				"events[14].subtype": "foldercreated",
				"events[14].username": "$auth1.userName$",
				"events[14].userID": "$auth1.userID$",
				"events[14].firstName": "$auth1.firstName$",
				"events[14].lastName": "$auth1.lastName$",
				"events[15].id": "$createUTF8Node.id$",
				"events[15].isReadOnly": false,
				"events[15].name": "$createUTF8Node.variables.name$",
				"events[15].parentID": "$auth1.rootFolder$",
				"events[15].shareType": 0,
				"events[15].subtype": "foldercreated",
				"events[15].username": "$auth1.userName$",
				"events[15].userID": "$auth1.userID$",
				"events[15].firstName": "$auth1.firstName$",
				"events[15].lastName": "$auth1.lastName$",
				"events[16].dataHash": "184f46790ee310509f7e8781f922d8c8f3ae932f",
				"events[16].dataSize": "70",
				"events[16].id": "$uploadFile1.id$",
				"events[16].name": "test1.txt",
				"events[16].parentID": "$createSubNode.id$",
				"events[16].subtype": "versionadded",
				"events[16].versionNum": 1,
				"events[16].username": "$auth1.userName$",
				"events[16].userID": "$auth1.userID$",
				"events[16].firstName": "$auth1.firstName$",
				"events[16].lastName": "$auth1.lastName$",
				"events[17].dataHash": "99dd78b83fb27280188c12cf1d8c03691471a767",
				"events[17].dataSize": "70",
				"events[17].id": "$uploadFile2.id$",
				"events[17].name": "test2.txt",
				"events[17].parentID": "$createSubNode.id$",
				"events[17].subtype": "versionadded",
				"events[17].versionNum": 1,
				"events[17].username": "$auth2.userName$",
				"events[17].userID": "$auth2.userID$",
				"events[17].firstName": "$auth2.firstName$",
				"events[17].lastName": "$auth2.lastName$",
				"events[18].id": "$uploadFile1.id$",
				"events[18].name": "test1.txt",
				//"events[18].parentID": "$createSubNode.id$", // uncomment to test part of TEMPO-79
				"events[18].subtype": "delete",
				"events[18].username": "$auth2.userName$",
				"events[18].userID": "$auth2.userID$",
				"events[18].firstName": "$auth2.firstName$",
				"events[18].lastName": "$auth2.lastName$",
				"events[19].id": "$uploadFile2.id$",
				//"events[19].name": "test2.txt", // uncomment to test part of TEMPO-79 (run test more than once)
				//"events[19].parentID": "$createSubNode.id$", // uncomment to test part of TEMPO-79 
				"events[19].subtype": "delete",
				"events[19].username": "$auth2.userName$",
				"events[19].userID": "$auth2.userID$",
				"events[19].firstName": "$auth2.firstName$",
				"events[19].lastName": "$auth2.lastName$",
				"events[20].id": "$createNode.id$",
				//"events[20].name": "SubFolder1", // uncomment to test part of TEMPO-79 (run test more than once)
				//"events[20].parentID": "$auth1.rootFolder$", // uncomment to test part of TEMPO-79 
				"events[20].subtype": "delete",
				"events[20].username": "$auth1.userName$",
				"events[20].userID": "$auth1.userID$",
				"events[20].firstName": "$auth1.firstName$",
				"events[20].lastName": "$auth1.lastName$",
				"events[21].id": "$copyNode.id$",
				//"events[21].name": "Sub Of SubFolder1", // uncomment to test part of TEMPO-79 (run test more than once)
				//"events[21].parentID": "$auth1.rootFolder$", // uncomment to test part of TEMPO-79 
				"events[21].subtype": "delete",
				"events[21].username": "$auth1.userName$",
				"events[21].userID": "$auth1.userID$",
				"events[21].firstName": "$auth1.firstName$",
				"events[21].lastName": "$auth1.lastName$"
			}
		},
		eventLog2: {
			versions: ["v4"],
			url: "notifications",
			verb: "GET",
			params: {
				cstoken: "$auth2.cookie$",
				token: "$auth2.token$",
				clientID: "$auth2.clientID$",
				since: "$initialState.lastEvent$"
			},
			expectType: {
				"ok": "boolean",
				"events": "object"
			},
			expect: {
				"ok": true,
				"events.length": 15,
				"events[0].id": "$createSubNode.id$",
				"events[0].name": "Sub Of SubFolder1",
				"events[0].shareOwner": "$auth1.userID$",
				"events[0].subtype": "foldershared",
				"events[0].toUser": "$auth2.userID$",
				"events[0].username": "$auth1.userName$",
				"events[0].userID": "$auth1.userID$",
				"events[0].firstName": "$auth1.firstName$",
				"events[0].lastName": "$auth1.lastName$",
				"events[1].doSync": true,
				"events[1].id": "$createSubNode.id$",
				"events[1].isReadOnly": false,
				"events[1].name": "Sub Of SubFolder1 (test1)",
				"events[1].parentID": "$auth2.rootFolder$",
				"events[1].sharedFolder": 2,
				"events[1].shareType": 2,
				"events[1].subtype": "foldercreated",
				"events[1].username": "$auth2.userName$",
				"events[1].userID": "$auth2.userID$",
				"events[1].firstName": "$auth2.firstName$",
				"events[1].lastName": "$auth2.lastName$",
				//"events[2].copyFrom": "$auth2.rootFolder$", // uncomment to test TEMPO-2235
				"events[2].id": "$copyNodeRW.id$",
				"events[2].name": "Sub Of SubFolder1",
				//"events[2].oldName": "Sub Of SubFolder1 (test1)", // uncomment to test TEMPO-2235
				//"events[2].originalID": "$createSubNode.id$", // uncomment to test TEMPO-2235
				"events[2].parentID": "$auth2.rootFolder$",
				//"events[2].subtype": "copy",
				"events[2].username": "$auth2.userName$",
				"events[2].userID": "$auth2.userID$",
				"events[2].firstName": "$auth2.firstName$",
				"events[2].lastName": "$auth2.lastName$",
				"events[3].id": "$moveSubFolder1.id$",
				"events[3].name": "Move This Subfolder1",
				//"events[3].parentID": "$createSubNode.id$", // TEMPO-79
				"events[3].subtype": "delete",
				"events[3].username": "$auth1.userName$",
				"events[3].userID": "$auth1.userID$",
				"events[3].firstName": "$auth1.firstName$",
				"events[3].lastName": "$auth1.lastName$",
				"events[4].id": "$moveSubFolder2.id$",
				//"events[4].moveFrom": "$createSubNode.id$", // TEMPO-2236
				"events[4].name": "Move This Subfolder2",
				"events[4].parentID": "$auth2.rootFolder$",
				"events[4].subtype": "move",
				"events[4].username": "$auth2.userName$",
				"events[4].userID": "$auth2.userID$",
				"events[4].firstName": "$auth2.firstName$",
				"events[4].lastName": "$auth2.lastName$",
				"events[5].id": "$createSubNode.id$",
				"events[5].name": "NewName1 (test1)",
				"events[5].subtype": "renamed",
				"events[5].username": "$auth1.userName$",
				"events[5].userID": "$auth1.userID$",
				"events[5].firstName": "$auth1.firstName$",
				"events[5].lastName": "$auth1.lastName$",
				"events[6].id": "$copySubFolder.id$",
				"events[6].name": "NewName3",
				"events[6].subtype": "renamed",
				"events[6].username": "$auth2.userName$",
				"events[6].userID": "$auth2.userID$",
				"events[6].firstName": "$auth2.firstName$",
				"events[6].lastName": "$auth2.lastName$",
				"events[7].dataHash": "184f46790ee310509f7e8781f922d8c8f3ae932f",
				"events[7].dataSize": "70",
				"events[7].id": "$uploadFile1.id$",
				"events[7].name": "test1.txt",
				"events[7].parentID": "$createSubNode.id$",
				"events[7].subtype": "versionadded",
				"events[7].versionNum": 1,
				"events[7].username": "$auth1.userName$",
				"events[7].userID": "$auth1.userID$",
				"events[7].firstName": "$auth1.firstName$",
				"events[7].lastName": "$auth1.lastName$",
				"events[8].dataHash": "99dd78b83fb27280188c12cf1d8c03691471a767",
				"events[8].dataSize": "70",
				"events[8].id": "$uploadFile2.id$",
				"events[8].name": "test2.txt",
				"events[8].parentID": "$createSubNode.id$",
				"events[8].subtype": "versionadded",
				"events[8].versionNum": 1,
				"events[8].username": "$auth2.userName$",
				"events[8].userID": "$auth2.userID$",
				"events[8].firstName": "$auth2.firstName$",
				"events[8].lastName": "$auth2.lastName$",
				"events[9].id": "$uploadFile1.id$",
				//"events[9].moveFrom": "$createSubNode.id$", // TEMPO-2236
				"events[9].name": "test1.txt",
				"events[9].parentID": "$auth2.rootFolder$",
				"events[9].subtype": "move",
				"events[9].username": "$auth2.userName$",
				"events[9].userID": "$auth2.userID$",
				"events[9].firstName": "$auth2.firstName$",
				"events[9].lastName": "$auth2.lastName$",
				"events[10].id": "$uploadFile1.id$",
				//"events[10].name": "test1.txt", // uncomment for TEMPO-79
				//"events[10].parentID": "$createSubNode.id$", // uncomment to test part of TEMPO-79
				"events[10].subtype": "delete",
				"events[10].username": "$auth2.userName$",
				"events[10].userID": "$auth2.userID$",
				"events[10].firstName": "$auth2.firstName$",
				"events[10].lastName": "$auth2.lastName$",
				"events[11].id": "$uploadFile2.id$",
				//"events[11].name": "test2.txt", // TEMPO-79
				//"events[11].parentID": "$auth2.rootFolder$", // TEMPO-79
				"events[11].subtype": "delete",
				"events[11].username": "$auth2.userName$",
				"events[11].userID": "$auth2.userID$",
				"events[11].firstName": "$auth2.firstName$",
				"events[11].lastName": "$auth2.lastName$",
				"events[12].id": "$createSubNode.id$",
				"events[12].name": "NewName1 (test1)",
				"events[12].parentID": "$auth2.rootFolder$", // TEMPO-79
				"events[12].subtype": "delete",
				"events[12].username": "$auth1.userName$",
				"events[12].userID": "$auth1.userID$",
				"events[12].firstName": "$auth1.firstName$",
				"events[12].lastName": "$auth1.lastName$",
				"events[13].id": "$copyNodeRW.id$",
				//"events[13].name": "Sub Of SubFolder1", // TEMPO-79
				//"events[13].parentID": "$auth2.rootFolder$", // TEMPO-79
				"events[13].subtype": "delete",
				"events[13].username": "$auth2.userName$",
				"events[13].userID": "$auth2.userID$",
				"events[13].firstName": "$auth2.firstName$",
				"events[13].lastName": "$auth2.lastName$",
				"events[14].id": "$moveSubFolder2.id$",
				//"events[14].name": "Move This Subfolder2", // TEMPO-79
				//"events[14].parentID": "$auth2.rootFolder$", // TEMPO-79
				"events[14].subtype": "delete",
				"events[14].username": "$auth2.userName$",
				"events[14].userID": "$auth2.userID$",
				"events[14].firstName": "$auth2.firstName$",
				"events[14].lastName": "$auth2.lastName$"
			}
		},
		eventLog3: {
			versions: ["v4"],
			url: "notifications",
			verb: "GET",
			params: {
				cstoken: "$auth3.cookie$",
				token: "$auth3.token$",
				clientID: "$auth3.clientID$",
				since: "$initialState.lastEvent$"
			},
			expectType: {
				"ok": "boolean",
				"events": "object"
			},
			expect: {
				"ok": true,
				"events.length": 16,
				"events[0].id": "$createSubNode.id$",
				"events[0].name": "Sub Of SubFolder1",
				"events[0].shareOwner": "$auth1.userID$",
				"events[0].subtype": "foldershared",
				"events[0].toUser": "$auth3.userID$",
				"events[0].username": "$auth1.userName$",
				"events[0].userID": "$auth1.userID$",
				"events[0].firstName": "$auth1.firstName$",
				"events[0].lastName": "$auth1.lastName$",
				"events[1].doSync": true,
				"events[1].id": "$createSubNode.id$",
				"events[1].isReadOnly": true,
				"events[1].name": "Sub Of SubFolder1 (test1)",
				"events[1].parentID": "$auth3.rootFolder$",
				"events[1].sharedFolder": 2,
				"events[1].shareType": 1,
				"events[1].subtype": "foldercreated",
				"events[1].username": "$auth3.userName$",
				"events[1].userID": "$auth3.userID$",
				"events[1].firstName": "$auth3.firstName$",
				"events[1].lastName": "$auth3.lastName$",
				//"events[2].copyFrom": "$auth3.rootFolder$", // uncomment to test TEMPO-2235
				"events[2].id": "$copyNodeRO.id$",
				"events[2].name": "Sub Of SubFolder1",
				//"events[2].oldName": "Sub Of SubFolder1 (test1)", // uncomment to test TEMPO-2235
				//"events[2].originalID": "$createSubNode.id$", // uncomment to test TEMPO-2235
				"events[2].parentID": "$auth3.rootFolder$",
				//"events[2].subtype": "copy",
				"events[2].username": "$auth3.userName$",
				"events[2].userID": "$auth3.userID$",
				"events[2].firstName": "$auth3.firstName$",
				"events[2].lastName": "$auth3.lastName$",
				"events[3].id": "$moveSubFolder1.id$",
				"events[3].name": "Move This Subfolder1",
				//"events[3].parentID": "$createSubNode.id$", // TEMPO-79
				"events[3].subtype": "delete",
				"events[3].username": "$auth1.userName$",
				"events[3].userID": "$auth1.userID$",
				"events[3].firstName": "$auth1.firstName$",
				"events[3].lastName": "$auth1.lastName$",
				"events[4].id": "$moveSubFolder2.id$",
				"events[4].name": "Move This Subfolder2",
				//"events[4].parentID": "$createSubNode.id$", // TEMPO-79
				"events[4].subtype": "delete",
				"events[4].username": "$auth2.userName$",
				"events[4].userID": "$auth2.userID$",
				"events[4].firstName": "$auth2.firstName$",
				"events[4].lastName": "$auth2.lastName$",
				"events[5].id": "$createSubNode.id$",
				"events[5].name": "NewName1 (test1)",
				"events[5].subtype": "renamed",
				"events[5].username": "$auth1.userName$",
				"events[5].userID": "$auth1.userID$",
				"events[5].firstName": "$auth1.firstName$",
				"events[5].lastName": "$auth1.lastName$",
				"events[6].id": "$copySubFolder.id$",
				"events[6].name": "NewName3",
				"events[6].subtype": "renamed",
				"events[6].username": "$auth2.userName$",
				"events[6].userID": "$auth2.userID$",
				"events[6].firstName": "$auth2.firstName$",
				"events[6].lastName": "$auth2.lastName$",
				"events[7].dataHash": "184f46790ee310509f7e8781f922d8c8f3ae932f",
				"events[7].dataSize": "70",
				"events[7].id": "$uploadFile1.id$",
				"events[7].name": "test1.txt",
				"events[7].parentID": "$createSubNode.id$",
				"events[7].subtype": "versionadded",
				"events[7].versionNum": 1,
				"events[7].username": "$auth1.userName$",
				"events[7].userID": "$auth1.userID$",
				"events[7].firstName": "$auth1.firstName$",
				"events[7].lastName": "$auth1.lastName$",				
				"events[8].copyFrom": "$createSubNode.id$",
				"events[8].dataHash": "99dd78b83fb27280188c12cf1d8c03691471a767",
				"events[8].id": "$copyFile1.id$",
				"events[8].name": "test2.txt",
				"events[8].oldName": "test2.txt",
				"events[8].originalID": "$uploadFile2.id$",
				"events[8].parentID": "$auth3.rootFolder$",
				"events[8].subtype": "copy",
				"events[8].versionNum": 1,
				"events[8].username": "$auth3.userName$",
				"events[8].userID": "$auth3.userID$",
				"events[8].firstName": "$auth3.firstName$",
				"events[8].lastName": "$auth3.lastName$",
				"events[9].dataHash": "99dd78b83fb27280188c12cf1d8c03691471a767",
				"events[9].dataSize": "70",
				"events[9].id": "$uploadFile2.id$",
				"events[9].name": "test2.txt",
				"events[9].parentID": "$createSubNode.id$",
				"events[9].subtype": "versionadded",
				"events[9].versionNum": 1,
				"events[9].username": "$auth2.userName$",
				"events[9].userID": "$auth2.userID$",
				"events[9].firstName": "$auth2.firstName$",
				"events[9].lastName": "$auth2.lastName$",
				"events[10].id": "$copyFile1.id$",
				"events[10].name": "NewFileName1",
				"events[10].subtype": "renamed",
				"events[10].username": "$auth3.userName$",
				"events[10].userID": "$auth3.userID$",
				"events[10].firstName": "$auth3.firstName$",
				"events[10].lastName": "$auth3.lastName$",
				"events[11].id": "$uploadFile1.id$",
				//"events[11].name": "test1.txt", // TEMPO-79
				//"events[11].parentID": "$createSubNode.id$", // TEMPO-79
				"events[11].subtype": "delete",
				"events[11].username": "$auth2.userName$",
				"events[11].userID": "$auth2.userID$",
				"events[11].firstName": "$auth2.firstName$",
				"events[11].lastName": "$auth2.lastName$",
				"events[12].id": "$copyFile1.id$",
				//"events[12].name": "NewFileName1", // TEMPO-79
				//"events[12].parentID": "$auth3.rootFolder$", // TEMPO-79
				"events[12].subtype": "delete",
				"events[12].username": "$auth3.userName$",
				"events[12].userID": "$auth3.userID$",
				"events[12].firstName": "$auth3.firstName$",
				"events[12].lastName": "$auth3.lastName$",
				"events[13].id": "$uploadFile2.id$",
				//"events[13].name": "test2.txt", // TEMPO-79
				//"events[13].parentID": "$createSubNode.id$",
				"events[13].subtype": "delete",
				"events[13].username": "$auth2.userName$",
				"events[13].userID": "$auth2.userID$",
				"events[13].firstName": "$auth2.firstName$",
				"events[13].lastName": "$auth2.lastName$",
				"events[14].id": "$createSubNode.id$",
				//"events[14].name": "NewName1 (test1)", // TEMPO-79
				//"events[14].parentID": "$auth3.rootFolder$", // TEMPO-79
				"events[14].subtype": "delete",
				"events[14].username": "$auth1.userName$",
				"events[14].userID": "$auth1.userID$",
				"events[14].firstName": "$auth1.firstName$",
				"events[14].lastName": "$auth1.lastName$",
				"events[15].id": "$copyNodeRO.id$",
				//"events[15].name": "Sub Of SubFolder1", // TEMPO-79
				//"events[15].parentID": "$auth3.rootFolder$", // TEMPO-79
				"events[15].subtype": "delete",
				"events[15].username": "$auth3.userName$",
				"events[15].userID": "$auth3.userID$",
				"events[15].firstName": "$auth3.firstName$",
				"events[15].lastName": "$auth3.lastName$"
			}
		}
	},
	
	// **********************************************************************
	// Test of share, accept, and unshare w. two users and a read-write share
	// **********************************************************************
	basicSharing : {
	//
	// Log in two users; the first creates a folder and shares with the 2nd
	//
		auth1 : {
			libraryStep : lib.auth,
			variables : { userName : "test1" }
		},
		auth2 : {
			libraryStep : lib.auth,
			variables : { userName : "test2" }
		},
		initialState: {
			versions: ["v4"],
			libraryStep : lib.getSeqNo,
			variables : {
				cookie : "$auth1.cookie$",
				token : "$auth1.token$",
				clientID : "$auth1.clientID$"
			}
		},
	// initially, test2 has no pending shares
		getInitialShareCount : {
			libraryStep : lib.shareCount,
			variables : { 
				cstoken : "$auth2.cookie$" ,
				expectedShareCount : 0
			}
		},
		folder1 : {
			libraryStep : lib.createFolder,
			variables : {
				parentID : "$auth1.rootFolder$",
				name : "share",
				cstoken : "$auth1.cookie$"
			}
		},
		share : {
			libraryStep : lib.share,
			variables : {
				id : "$folder1.id$",
				userName : "test2",
				shareType : 2,
				cstoken : "$auth1.cookie$"
			}
		},
		getShareCount : {
			libraryStep : lib.shareCount,
			variables : { 
				cstoken : "$auth2.cookie$" ,
				expectedShareCount : 1
			}
		},
		getIncomingShares : {
			url : "shares/incoming",
			verb : "GET",
			params : { cstoken : "$auth2.cookie$" },
			expectType : { ok : "boolean", shares : "object" },
			expect : {
				ok : true,
				"shares.length" : 1,
				"shares[0].id" : "$folder1.id$",
				"shares[0].name" : "share"
			}
		},
	//
	// test2 accepts the share, verifies that it is in getsynctree,
	// and creates a subfolder
	//
		accept : {
			libraryStep : lib.accept,
			variables : { id: "$folder1.id$", cstoken: "$auth2.cookie$" }
		},
		getContents : {
			url : "nodes",
			verb : "GET",
			params : { cstoken : "$auth2.cookie$" },
			expectType : { contents : "object", count: "number" },
			expect : {
				count : 1,
				"contents[0].id" : "$folder1.id$",
				"contents[0].name" : "share (test1)",
				"contents[0].isReadOnly" : false
			}
		},
		folder2 : {
			libraryStep : lib.createFolder,
			variables : {
				parentID : "$folder1.id$",
				name : "inshare",
				cstoken : "$auth2.cookie$"
			}
		},
	//
	// The subfolder appears for test1 too
	//
		getContents2 : {
			url : "nodes/$folder1.id$/children",
			verb : "GET",
			params : { cstoken : "$auth1.cookie$" },
			expectType : { contents : "object", count: "number" },
			expect : {
				count : 1,
				"contents[0].id" : "$folder2.id$",
				"contents[0].name" : "inshare",
				"contents[0].isReadOnly" : false
			}
		},
	//
	// test1 unshares then checks the folder contents again--test2's folder
	// is still there
	//
		unshare : {
			libraryStep : lib.unshare,
			variables: { 
				id : "$folder1.id$", 
				cstoken : "$auth1.cookie$" ,
				userName : "test2"
			}
		},
		getFinalShareCount : {
			libraryStep : lib.shareCount,
			variables : { 
				cstoken : "$auth2.cookie$" ,
				expectedShareCount : 0
			}
		},		
		getContents3 : {
			url : "nodes/$folder1.id$/children",
			verb : "GET",
			params : { cstoken : "$auth1.cookie$" },
			expectType : { contents : "object", count: "number" },
			expect : {
				count : 1,
				"contents[0].id" : "$folder2.id$",
				"contents[0].name" : "inshare",
				"contents[0].isReadOnly" : false
			}
		},
		//
		// The share is no longer in test2's sync tree
		//
		getContents4 : {
			url : "nodes",
			verb : "GET",
			params : { cstoken : "$auth2.cookie$" },
			expectType : { contents : "object", count: "number" },
			expect : { count : 0 }
		},
		eventLog1: {
			versions: ["v4"],
			url: "notifications",
			verb: "GET",
			params: {
				cstoken: "$auth1.cookie$",
				token: "$auth1.token$",
				clientID: "$auth1.clientID$",
				since: "$initialState.lastEvent$"
			},
			expectType: {
				"ok": "boolean",
				"events": "object"
			},
			expect: {
				"ok": true,
				"events.length": 5,
				"events[0].id": "$folder1.id$",
				"events[0].isReadOnly": false,
				"events[0].name": "share",
				"events[0].parentID": "$auth1.rootFolder$",
				"events[0].shareType": 0,
				"events[0].subtype": "foldercreated",
				"events[1].id": "$folder1.id$",
				"events[1].name": "share",
				"events[1].shareOwner": "$auth1.userID$",
				"events[1].subtype": "foldershared",
				"events[1].toUser": "$auth2.userID$",
				"events[2].id": "$folder1.id$",
				"events[2].shareOwner": "$auth1.userID$",
				"events[2].subtype": "shareaccepted",
				"events[2].toUser": "$auth2.userID$",
				"events[3].id": "$folder2.id$",
				"events[3].isReadOnly": false,
				"events[3].name": "inshare",
				"events[3].parentID": "$folder1.id$",
				"events[3].sharedFolder": 2,
				"events[3].shareType": 2,
				"events[3].subtype": "foldercreated",
				"events[4].id": "$folder1.id$",
				"events[4].shareOwner": "$auth1.userID$",
				"events[4].subtype": "sharerejected",
				"events[4].toUser": "$auth2.userID$"
			}
		},
		eventLog2: {
			versions: ["v4"],
			url: "notifications",
			verb: "GET",
			params: {
				cstoken: "$auth2.cookie$",
				token: "$auth2.token$",
				clientID: "$auth2.clientID$",
				since: "$initialState.lastEvent$"
			},
			expectType: {
				"ok": "boolean",
				"events": "object"
			},
			expect: {
				"ok": true,
				"events.length": 4,
				"events[0].id": "$folder1.id$",
				"events[0].name": "share",
				"events[0].shareOwner": "$auth1.userID$",
				"events[0].subtype": "foldershared",
				"events[0].toUser": "$auth2.userID$",
				"events[1].id": "$folder1.id$",
				"events[1].isReadOnly": false,
				"events[1].name": "share (test1)",
				"events[1].parentID": "$auth2.rootFolder$",
				"events[1].sharedFolder": 2,
				"events[1].shareType": 2,
				"events[1].subtype": "foldercreated",
				"events[2].id": "$folder2.id$",
				"events[2].isReadOnly": false,
				"events[2].name": "inshare",
				"events[2].parentID": "$folder1.id$",
				"events[2].sharedFolder": 2,
				"events[2].shareType": 2,
				"events[2].subtype": "foldercreated",
				"events[3].id": "$folder1.id$",
				//"events[3].name": "share",		// TEMPO-79
				//"events[3].parentID": "$auth2.rootFolder$", // TEMPO-79
				"events[3].subtype": "delete"
			}
		}
	},
	
	// **********************************************************************
	// Test back-channel events due to sharing.
	// Fails before fix for TEMPO-2083.
	// ********************************************************************** 
	shareEvents: {
		VERSIONS: ["v4"],
		//
		// Log in two users; the first creates a folder and shares with the 2nd
		//
		auth1 : {
			libraryStep : lib.auth,
			variables : { userName : "test1" }
		},
		auth2 : {
			libraryStep : lib.auth,
			variables : { userName : "test2" }
		},
		initialState: {
			url: "notifications",
			verb: "GET",
			params: {
				cstoken: "$auth1.cookie$",
				token: "$auth1.token$",
				clientID: "$auth1.clientID$",
				since: -1,
				eventLog: true
			},
			expectType: {
				"isStale": "boolean",
				"minSeqNo": "number",
				"maxSeqNo" : "number"
			},
			expect: {
				"ok": true,
				"isStale": true
			},
			remember: {
				"maxSeqNo": "lastEvent"
			}
		},
		//
		// test1 creates a folder and offers a share to test2; user two accepts
		//
		folder1 : {
			libraryStep : lib.createFolder,
			variables : {
				parentID : "$auth1.rootFolder$",
				name : "share",
				cstoken : "$auth1.cookie$"
			}
		},
		share : {
			libraryStep : lib.share,
			variables : {
				id : "$folder1.id$",
				userName : "test2",
				shareType : 2,
				cstoken : "$auth1.cookie$"
			}
		},
		accept : {
			libraryStep : lib.accept,
			variables : { id: "$folder1.id$", cstoken: "$auth2.cookie$" }
		},
			
		//
		// check test2's event log: there should be a share request and a folder create,
		// and the folder create should have the correct id and parent id (test2's root, not test1's)
		//
		eventLog: {
			url: "notifications",
			verb: "GET",
			params: {
				cstoken: "$auth2.cookie$",
				token: "$auth2.token$",
				clientID: "$auth2.clientID$",
				since: "$initialState.lastEvent$",
				eventLog: true
			},
			expectType: {
				"ok": "boolean",
				"events": "object"
			},
			expect: {
				"ok": true,
				"events.length": 2,
				"events[0].subtype": "foldershared",
				"events[0].name": "$folder1.variables.name$",
				"events[1].subtype": "foldercreated",
				"events[1].name": "$folder1.variables.name$ (test1)",
				"events[1].id": "$folder1.id$",
				"events[1].parentID": "$auth2.rootFolder$"
			}
		}
	},
	
	// **********************************************************************
	// Test of read-only share, change share, share info calls, and unshare all w. three users
	// **********************************************************************
	multiSharing : {
	//
	// Log in three users; the first creates a folder and shares with the others
	//
		auth1 : {
			libraryStep : lib.auth,
			variables : { userName : "test1" }
		},
		auth2 : {
			libraryStep : lib.auth,
			variables : { userName : "test2" }
		},
		auth3 : {
			libraryStep : lib.auth,
			variables : { userName : "test3" }
		},
		initialState: {
			versions: ["v4"],
			libraryStep : lib.getSeqNo,
			variables : {
				cookie : "$auth1.cookie$",
				token : "$auth1.token$",
				clientID : "$auth1.clientID$"
			}
		},
		// initially, test1 has not shared any folders
		getInitialOutgoing : {
			url : "shares/outgoing",
			verb : "GET",
			params : { cstoken : "$auth1.cookie$" },
			expectType : { shares : "object" },
			expect : { "shares.length" : 0 }
		},
		folder1 : {
			libraryStep : lib.createFolder,
			variables : {
				parentID : "$auth1.rootFolder$",
				name : "share",
				cstoken : "$auth1.cookie$"
			}
		},
		share1 : {
			libraryStep : lib.share,
			variables : {
				id : "$folder1.id$",
				userName : "test2",
				shareType : 1,
				cstoken : "$auth1.cookie$"
			}
		},
		share2 : {
			libraryStep : lib.share,
			variables : {
				id : "$folder1.id$",
				userName : "test3",
				shareType : 1,
				cstoken : "$auth1.cookie$"
			}
		},
		// now there should be two outgoing shares
		getOutgoing2 : {
			url : "shares/outgoing",
			verb : "GET",
			params : { cstoken : "$auth1.cookie$" },
			expectType : { shares : "object" },
			expect : { 
				"shares.length" : 1,
				"shares[0].id" : "$folder1.id$"
			}
		},
		//
		// One user rejects and the other accepts
		//
		reject : {
			libraryStep : lib.reject,
			variables : { id: "$folder1.id$", cstoken: "$auth2.cookie$" }
		},	
		accept : {
			libraryStep : lib.accept,
			variables : { id: "$folder1.id$", cstoken: "$auth3.cookie$" }
		},
		getOutgoing3 : {
			url : "shares/outgoing",
			verb : "GET",
			params : { cstoken : "$auth1.cookie$" },
			expectType : { shares : "object" },
			expect : { 
				"shares.length" : 1,
				"shares[0].id" : "$folder1.id$"
			}
		},
		//
		// share again, and accept this time
		//
		share3 : {
			libraryStep : lib.share,
			variables : {
				id : "$folder1.id$",
				userName : "test2",
				shareType : 2,
				cstoken : "$auth1.cookie$"
			}
		},
		accept2 : {
			libraryStep : lib.accept,
			variables : { id: "$folder1.id$", cstoken: "$auth2.cookie$" }
		},
		getOutgoing4 : {
			url : "shares/outgoing",
			verb : "GET",
			params : { cstoken : "$auth1.cookie$" },
			expectType : { shares : "object" },
			expect : { 
				"shares.length" : 1,
				"shares[0].id" : "$folder1.id$"
			}
		},
		//
		// Both owner and sharee can get info on a share
		//
		getOutgoingShareInfo : {
			url : "shares/outgoing/$folder1.id$",
			verb : "GET",
			params : { cstoken : "$auth1.cookie$" },
			expectType : { shares : "object", "shares[0].userName" : "string" },
			expect : { "shares.length" : 3 }
		},
		getIncomingShareInfo : {
			url : "shares/incoming/$folder1.id$",
			verb : "GET",
			params : { cstoken : "$auth3.cookie$" },
			expectType : { shares : "object", "shares[0].userName" : "string" },
			expect : { "shares.length" : 3 }
		},
		//
		// test3 cannot create a folder in the read-only share, but test2 can
		//
		illegalCreate : {
			url : "nodes/$folder1.id$/children",
			verb : "POST",
			params : { name : "nope", cstoken : "$auth3.cookie$" },
			expectType : { ok : "boolean" },
			expect : { ok : false }
		},		
		folder2 : {
			libraryStep : lib.createFolder,
			variables : {
				parentID : "$folder1.id$",
				name : "yup",
				cstoken : "$auth2.cookie$"
			}
		},
		//
		// The subfolder appears for test3 too
		//
		getContents : {
			url : "nodes/$folder1.id$/children",
			verb : "GET",
			params : { cstoken : "$auth3.cookie$" },
			expectType : { contents : "object", count: "number" },
			expect : {
				count : 1,
				"contents[0].id" : "$folder2.id$",
				"contents[0].name" : "yup",
				"contents[0].isReadOnly" : true,
				"contents[0].isShared" : true,
				"contents[0].isRootShare" : false
			}
		},
		//
		// If we change test3 to read-write, that user can rename test2's folder
		//
		changeToReadWrite : {
			libraryStep : lib.changeShare,
			variables : {
				id : "$folder1.id$",
				userID : "$auth3.userID$",
				shareType : 2,
				cstoken : "$auth1.cookie$"
			}
		},
		rename : {
			libraryStep : lib.rename,
			variables : {
				id : "$folder2.id$",
				name : "renamed",
				cstoken : "$auth3.cookie$"
			}
		},
		//
		// Unshare all and check that the shares are gone
		//
		unshareAll : {
			libraryStep : lib.unshareAll,
			variables : { id : "$folder1.id$", cstoken : "$auth1.cookie$" }
		},
		getOutgoing5 : {
			url : "shares/outgoing",
			verb : "GET",
			params : { cstoken : "$auth1.cookie$" },
			expectType : { shares : "object" },
			expect : { 
				"shares.length" : 0
			}
		},
		//
		// user1 needs to auth again to clean up the share permissions
		//
		auth1x2 : {
			libraryStep : lib.auth,
			variables : { userName : "test1" }
		},
		getContents2 : {
			url : "nodes/$folder1.id$/children",
			verb : "GET",
			params : { cstoken : "$auth3.cookie$" },
			expectType : { ok: "boolean" },
			expect : { ok : false }
		},
		getContents3 : {
			url : "nodes/$folder1.id$",
			verb : "GET",
			params : { cstoken : "$auth2.cookie$" },
			expectType : { ok: "boolean" },
			expect : { ok : false }
		},
		eventLog1: {
			versions: ["v4"],
			url: "notifications",
			verb: "GET",
			params: {
				cstoken: "$auth1.cookie$",
				token: "$auth1.token$",
				clientID: "$auth1.clientID$",
				since: "$initialState.lastEvent$"
			},
			expectType: {
				"ok": "boolean",
				"events": "object"
			},
			expect: {
				"ok": true,
				"events.length": 11,
				"events[0].id": "$folder1.id$",
				"events[0].isReadOnly": false,
				"events[0].name": "share",
				"events[0].parentID": "$auth1.rootFolder$",
				"events[0].shareType": 0,
				"events[0].subtype": "foldercreated",
				"events[0].username": "$auth1.userName$",
				"events[0].userID": "$auth1.userID$",
				"events[0].firstName": "$auth1.firstName$",
				"events[0].lastName": "$auth1.lastName$",
				"events[1].id": "$folder1.id$",
				"events[1].name": "share",
				"events[1].shareOwner": "$auth1.userID$",
				"events[1].subtype": "foldershared",
				"events[1].toUser": "$auth2.userID$",
				"events[1].username": "$auth1.userName$",
				"events[1].userID": "$auth1.userID$",
				"events[1].firstName": "$auth1.firstName$",
				"events[1].lastName": "$auth1.lastName$",
				"events[2].id": "$folder1.id$",
				"events[2].name": "share",
				"events[2].shareOwner": "$auth1.userID$",
				"events[2].subtype": "foldershared",
				"events[2].toUser": "$auth3.userID$",
				"events[2].username": "$auth1.userName$",
				"events[2].userID": "$auth1.userID$",
				"events[2].firstName": "$auth1.firstName$",
				"events[2].lastName": "$auth1.lastName$",
				"events[3].id": "$folder1.id$",
				"events[3].shareOwner": "$auth1.userID$",
				"events[3].subtype": "sharerejected",
				"events[3].toUser": "$auth2.userID$",
				"events[3].username": "$auth2.userName$",
				"events[3].userID": "$auth2.userID$",
				"events[3].firstName": "$auth2.firstName$",
				"events[3].lastName": "$auth2.lastName$",
				"events[4].id": "$folder1.id$",
				"events[4].shareOwner": "$auth1.userID$",
				"events[4].subtype": "shareaccepted",
				"events[4].toUser": "$auth3.userID$",
				"events[4].username": "$auth3.userName$",
				"events[4].userID": "$auth3.userID$",
				"events[4].firstName": "$auth3.firstName$",
				"events[4].lastName": "$auth3.lastName$",
				"events[5].id": "$folder1.id$",
				"events[5].name": "share",
				"events[5].shareOwner": "$auth1.userID$",
				"events[5].subtype": "foldershared",
				"events[5].toUser": "$auth2.userID$",
				"events[5].username": "$auth1.userName$",
				"events[5].userID": "$auth1.userID$",
				"events[5].firstName": "$auth1.firstName$",
				"events[5].lastName": "$auth1.lastName$",
				"events[6].id": "$folder1.id$",
				"events[6].shareOwner": "$auth1.userID$",
				"events[6].subtype": "shareaccepted",
				"events[6].toUser": "$auth2.userID$",
				"events[6].username": "$auth2.userName$",
				"events[6].userID": "$auth2.userID$",
				"events[6].firstName": "$auth2.firstName$",
				"events[6].lastName": "$auth2.lastName$",
				"events[7].id": "$folder2.id$",
				"events[7].isReadOnly": false,
				"events[7].name": "yup",
				"events[7].parentID": "$folder1.id$",
				"events[7].sharedFolder": 2,
				"events[7].shareType": 2,
				"events[7].subtype": "foldercreated",
				"events[7].username": "$auth2.userName$",
				"events[7].userID": "$auth2.userID$",
				"events[7].firstName": "$auth2.firstName$",
				"events[7].lastName": "$auth2.lastName$",
				"events[8].id": "$folder2.id$",
				"events[8].name": "renamed",
				"events[8].subtype": "renamed",
				"events[8].username": "$auth3.userName$",
				"events[8].userID": "$auth3.userID$",
				"events[8].firstName": "$auth3.firstName$",
				"events[8].lastName": "$auth3.lastName$",
				// for the messages resulting from the unshare all, we can't predict
				// the order, so the toUser id is omitted here
				"events[9].id": "$folder1.id$",
				"events[9].shareOwner": "$auth1.userID$",
				"events[9].subtype": "sharerejected",
				"events[9].username": "$auth1.userName$",
				"events[9].userID": "$auth1.userID$",
				"events[9].firstName": "$auth1.firstName$",
				"events[9].lastName": "$auth1.lastName$",
				"events[10].id": "$folder1.id$",
				"events[10].shareOwner": "$auth1.userID$",
				"events[10].subtype": "sharerejected",
				"events[10].username": "$auth1.userName$",
				"events[10].userID": "$auth1.userID$",
				"events[10].firstName": "$auth1.firstName$",
				"events[10].lastName": "$auth1.lastName$"
			}
		},
		eventLog2: {
			versions: ["v4"],
			url: "notifications",
			verb: "GET",
			params: {
				cstoken: "$auth2.cookie$",
				token: "$auth2.token$",
				clientID: "$auth2.clientID$",
				since: "$initialState.lastEvent$"
			},
			expectType: {
				"ok": "boolean",
				"events": "object"
			},
			expect: {
				"ok": true,
				"events.length": 7,
				"events[0].id": "$folder1.id$",
				"events[0].name": "share",
				"events[0].shareOwner": "$auth1.userID$",
				"events[0].subtype": "foldershared",
				"events[0].toUser": "$auth2.userID$",
				"events[0].username": "$auth1.userName$",
				"events[0].userID": "$auth1.userID$",
				"events[0].firstName": "$auth1.firstName$",
				"events[0].lastName": "$auth1.lastName$",
				"events[1].id": "$folder1.id$",
				"events[1].shareOwner": "$auth1.userID$",
				"events[1].subtype": "sharerejected",
				"events[1].toUser": "$auth2.userID$",
				"events[1].username": "$auth2.userName$",
				"events[1].userID": "$auth2.userID$",
				"events[1].firstName": "$auth2.firstName$",
				"events[1].lastName": "$auth2.lastName$",
				"events[2].id": "$folder1.id$",
				"events[2].name": "share",
				"events[2].shareOwner": "$auth1.userID$",
				"events[2].subtype": "foldershared",
				"events[2].toUser": "$auth2.userID$",
				"events[2].username": "$auth1.userName$",
				"events[2].userID": "$auth1.userID$",
				"events[2].firstName": "$auth1.firstName$",
				"events[2].lastName": "$auth1.lastName$",
				"events[3].id": "$folder1.id$",
				"events[3].isReadOnly": false,
				"events[3].name": "share (test1)",
				"events[3].parentID": "$auth2.rootFolder$",
				"events[3].sharedFolder": 2,
				"events[3].shareType": 2,
				"events[3].subtype": "foldercreated",
				"events[3].username": "$auth2.userName$",
				"events[3].userID": "$auth2.userID$",
				"events[3].firstName": "$auth2.firstName$",
				"events[3].lastName": "$auth2.lastName$",
				"events[4].id": "$folder2.id$",
				"events[4].isReadOnly": false,
				"events[4].name": "yup",
				"events[4].parentID": "$folder1.id$",
				"events[4].sharedFolder": 2,
				"events[4].shareType": 2,
				"events[4].subtype": "foldercreated",
				"events[4].username": "$auth2.userName$",
				"events[4].userID": "$auth2.userID$",
				"events[4].firstName": "$auth2.firstName$",
				"events[4].lastName": "$auth2.lastName$",
				"events[5].id": "$folder2.id$",
				"events[5].name": "renamed",
				"events[5].subtype": "renamed",
				"events[5].username": "$auth3.userName$",
				"events[5].userID": "$auth3.userID$",
				"events[5].firstName": "$auth3.firstName$",
				"events[5].lastName": "$auth3.lastName$",
				"events[6].id": "$folder1.id$",
				//"events[6].name": "share (test1)", // TEMPO-79
				//"events[6].parentID": "$auth2.rootFolder$", // TEMPO-79
				"events[6].subtype": "delete",
				"events[6].username": "$auth1.userName$",
				"events[6].userID": "$auth1.userID$",
				"events[6].firstName": "$auth1.firstName$",
				"events[6].lastName": "$auth1.lastName$"
			}
		},
		eventLog3: {
			versions: ["v4"],
			url: "notifications",
			verb: "GET",
			params: {
				cstoken: "$auth3.cookie$",
				token: "$auth3.token$",
				clientID: "$auth3.clientID$",
				since: "$initialState.lastEvent$"
			},
			expectType: {
				"ok": "boolean",
				"events": "object"
			},
			expect: {
				"ok": true,
				"events.length": 6,
				"events[0].id": "$folder1.id$",
				"events[0].name": "share",
				"events[0].shareOwner": "$auth1.userID$",
				"events[0].subtype": "foldershared",
				"events[0].toUser": "$auth3.userID$",
				"events[0].username": "$auth1.userName$",
				"events[0].userID": "$auth1.userID$",
				"events[0].firstName": "$auth1.firstName$",
				"events[0].lastName": "$auth1.lastName$",
				"events[1].id": "$folder1.id$",
				"events[1].isReadOnly": true,
				"events[1].name": "share (test1)",
				"events[1].parentID": "$auth3.rootFolder$",
				"events[1].sharedFolder": 2,
				"events[1].shareType": 1,
				"events[1].subtype": "foldercreated",
				"events[1].username": "$auth3.userName$",
				"events[1].userID": "$auth3.userID$",
				"events[1].firstName": "$auth3.firstName$",
				"events[1].lastName": "$auth3.lastName$",
				"events[2].id": "$folder2.id$",
				"events[2].isReadOnly": true,
				"events[2].name": "yup",
				"events[2].parentID": "$folder1.id$",
				"events[2].sharedFolder": 2,
				"events[2].shareType": 1,
				"events[2].subtype": "foldercreated",
				"events[2].username": "$auth2.userName$",
				"events[2].userID": "$auth2.userID$",
				"events[2].firstName": "$auth2.firstName$",
				"events[2].lastName": "$auth2.lastName$",
				"events[3].id": "$folder1.id$",
				"events[3].isReadOnly": false,
				"events[3].name": "share",
				"events[3].shareType": 2,
				"events[3].subtype": "sharechange",
				"events[3].toUser": "$auth3.userID$",
				"events[3].username": "$auth1.userName$",
				"events[3].userID": "$auth1.userID$",
				"events[3].firstName": "$auth1.firstName$",
				"events[3].lastName": "$auth1.lastName$",
				"events[4].id": "$folder2.id$",
				"events[4].name": "renamed",
				"events[4].subtype": "renamed",
				"events[4].username": "$auth3.userName$",
				"events[4].userID": "$auth3.userID$",
				"events[4].firstName": "$auth3.firstName$",
				"events[4].lastName": "$auth3.lastName$",
				"events[5].id": "$folder1.id$",
				//"events[5].name": "share (test1)", // TEMPO-79
				//"events[5].parentID": "$auth3.rootFolder$", // TEMPO-79
				"events[5].subtype": "delete",
				"events[5].username": "$auth1.userName$",
				"events[5].userID": "$auth1.userID$",
				"events[5].firstName": "$auth1.firstName$",
				"events[5].lastName": "$auth1.lastName$"
			}
		}
	},
	// **********************************************************************
	// Test of sharing a sub folder
	// **********************************************************************
	subFolderSharing : {
	//
	// Log in three users; the first creates a folder and sub folder 
	//
		auth1 : {
			libraryStep : lib.auth,
			variables : { userName : "test1" }
		},
		auth2 : {
			libraryStep : lib.auth,
			variables : { userName : "test2" }
		},
		auth3 : {
			libraryStep : lib.auth,
			variables : { userName : "test3" }
		},
		// initially, test1 has not shared any folders
		getInitialOutgoing : {
			url : "shares/outgoing",
			verb : "GET",
			params : { cstoken : "$auth1.cookie$" },
			expectType : { shares : "object" },
			expect : { "shares.length" : 0 }
		},
		// create a folder
		folder1 : {
			libraryStep : lib.createFolder,
			variables : {
				parentID : "$auth1.rootFolder$",
				name : "parentFolder",
				cstoken : "$auth1.cookie$"
			}
		},
		// create a sub folder 
		subFolder1 : {
			libraryStep : lib.createFolder,
			variables : {
				parentID : "$folder1.id$",
				name : "subFolder",
				cstoken : "$auth1.cookie$"
			}
		},
		share1 : {
			libraryStep : lib.share,
			variables : {
				id : "$folder1.id$",
				userName : "test2",
				shareType : 2,
				cstoken : "$auth1.cookie$"
			}
		},
		shareSub : {
				url : "shares/outgoing/$subFolder1.id$/users/test3",
				verb : "POST",
				params : { shareType : 2, cstoken : "$auth1.cookie$" },
				expectType : { ok : "boolean" },
				expect : { ok : false }
		
		}
	},
	// **********************************************************************
	// Test sharing a folder that has already been shared
	// **********************************************************************
	alreadySharedFolder : {
	//
	// Log in two users; the first creates a folder and sub folder 
	//
		auth1 : {
			libraryStep : lib.auth,
			variables : { userName : "test1" }
		},
		auth2 : {
			libraryStep : lib.auth,
			variables : { userName : "test2" }
		},
		initialState: {
			versions: ["v4"],
			libraryStep : lib.getSeqNo,
			variables : {
				cookie : "$auth1.cookie$",
				token : "$auth1.token$",
				clientID : "$auth1.clientID$"
			}
		},
		
		// initially, test1 has not shared any folders
		getInitialOutgoing : {
			url : "shares/outgoing",
			verb : "GET",
			params : { cstoken : "$auth1.cookie$" },
			expectType : { shares : "object" },
			expect : { "shares.length" : 0 }
		},
		// create a folder
		folder1 : {
			libraryStep : lib.createFolder,
			variables : {
				parentID : "$auth1.rootFolder$",
				name : "parentFolder",
				cstoken : "$auth1.cookie$"
			}
		},
		// share a folder
		share1 : {
			libraryStep : lib.share,
			variables : {
				id : "$folder1.id$",
				userName : "test2",
				shareType : 2,
				cstoken : "$auth1.cookie$"
			}
		},
		// share a folder that has already been shared to the same user
		shareAlreadyShared : {
				url : "shares/outgoing/$folder1.id$/users/test2",
				verb : "POST",
				params : { shareType : 2, cstoken : "$auth1.cookie$" },
				expectType : { ok : "boolean" },
				expect : { ok : true }
		
		},
		// ensure that there is only still one share requests outgoing
		getOutgoingShares : {
			url : "shares/outgoing",
			verb : "GET",
			params : { cstoken : "$auth1.cookie$" },
			expectType : { shares : "object" },
			expect : { 
				"shares.length" : 1,
				"shares[0].id" : "$folder1.id$"	}
		},
		eventLog1: {
			versions: ["v4"],
			url: "notifications",
			verb: "GET",
			params: {
				cstoken: "$auth1.cookie$",
				token: "$auth1.token$",
				clientID: "$auth1.clientID$",
				since: "$initialState.lastEvent$"
			},
			expectType: {
				"ok": "boolean",
				"events": "object"
			},
			expect: {
				"ok": true,
				"events.length": 3,
				"events[0].id": "$folder1.id$",
				"events[0].isReadOnly": false,
				"events[0].name": "parentFolder",
				"events[0].parentID": "$auth1.rootFolder$",
				"events[0].shareType": 0,
				"events[0].subtype": "foldercreated",
				"events[1].id": "$folder1.id$",
				"events[1].name": "parentFolder",
				"events[1].shareOwner": "$auth1.userID$",
				"events[1].subtype": "foldershared",
				"events[1].toUser": "$auth2.userID$",
				"events[2].id": "$folder1.id$",
				"events[2].isReadOnly": false,
				"events[2].name": "parentFolder",
				"events[2].shareType": 2,
				"events[2].subtype": "sharechange",
				"events[2].toUser": "$auth2.userID$"
			}
		},
		eventLog2: {
			versions: ["v4"],
			url: "notifications",
			verb: "GET",
			params: {
				cstoken: "$auth2.cookie$",
				token: "$auth2.token$",
				clientID: "$auth2.clientID$",
				since: "$initialState.lastEvent$"
			},
			expectType: {
				"ok": "boolean",
				"events": "object"
			},
			expect: {
				"ok": true,
				"events.length": 2,
				"events[0].id": "$folder1.id$",
				"events[0].name": "parentFolder",
				"events[0].shareOwner": "$auth1.userID$",
				"events[0].subtype": "foldershared",
				"events[0].toUser": "$auth2.userID$",
				"events[1].id": "$folder1.id$",
				"events[1].isReadOnly": false,
				"events[1].name": "parentFolder",
				"events[1].shareType": 2,
				"events[1].subtype": "sharechange",
				"events[1].toUser": "$auth2.userID$"
			}
		}
	},
	// **********************************************************************
	// Test sharing a folder that is not in the Tempo volume
	// **********************************************************************
	shareNonTempoFolder : {
	//
	// Log in two users; the first creates a folder and sub folder 
	//
		auth1 : {
			libraryStep : lib.auth,
			variables : { userName : "test1" }
		},
		auth2 : {
			libraryStep : lib.auth,
			variables : { userName : "test2" }
		},
		
		// initially, test1 has not shared any folders
		getInitialOutgoing : {
			url : "shares/outgoing",
			verb : "GET",
			params : { cstoken : "$auth1.cookie$" },
			expectType : { shares : "object" },
			expect : { "shares.length" : 0 }
		},
		// create a folder that is in the user's Personal Workspace
		createFolder: {
			url: "nodes/$auth1.userID$/children",
			verb: "POST",
			params: {
				cstoken: "$auth1.cookie$",
				name: "nonTempoFolder"
			},
			expectType: {
				"ok": "boolean",
				"id": "number"
			},
			expect: {
				"ok": true
			},
			remember: {
				"id": "id"
			}
		},
		// share a folder that is not in the tempo root
		shareNonTempoFolder : {
				url : "shares/outgoing/$createFolder.id$/users/test2",
				verb : "POST",
				params : { shareType : 2, cstoken : "$auth1.cookie$" },
				expectType : { ok : "boolean" },
				expect : { ok : false }
		
		},
		// ensure that there is are no share requests outgoing
		getOutgoingShares : {
			url : "shares/outgoing",
			verb : "GET",
			params : { cstoken : "$auth1.cookie$" },
			expectType : { shares : "object" },
			expect : { 
				"shares.length" : 0
			}
		},
		// delete the folder created in the user's Personal Workspace
		deleteNode: {
			url: "nodes/$createFolder.id$",
			verb: "DELETE",
			params: {
				cstoken: "$auth1.cookie$"
			},
			expectType: {
				"ok": "boolean"
			},
			expect: {
				"ok": true
			}
		}
		
	},
	// **********************************************************************
	//File operation Tests
	// Upload and AddVersion
	// **********************************************************************
	
	Upload_Addversion: {
		auth1 : {
			libraryStep : lib.auth,
			variables : { userName : "test1" }
		},
		initialState: {
			versions: ["v4"],
			libraryStep : lib.getSeqNo,
			variables : {
				cookie : "$auth1.cookie$",
				token : "$auth1.token$",
				clientID : "$auth1.clientID$"
			}
		},
		folder1 : {
			libraryStep : lib.createFolder,
			variables : {
				parentID : "$auth1.rootFolder$",
				name : "share",
				cstoken : "$auth1.cookie$"
			}
		},
		Upload : {
			url : "nodes/$folder1.id$/children",
			verb : "POST",
			type : "multipart/form-data",
			fileContents : "FileContents - file stuff",
			fileName : "test.txt",
			params : { 
				cstoken : "$auth1.cookie$"					 
			},
			expectType: {
				"ok": "boolean"
			},
			expect: {
				"ok": true,
				"name": "test.txt"
			},
			remember : {
				'id': 'id'
			}
			
		},
		Download : {
			url: "nodes/$Upload.id$/content",
			verb: "GET",
			dataType: "html",
			params : { cstoken : "$auth1.cookie$", auto : true },
			expectType : { content: "string" },
			expect : {content : "$Upload.fileContents$" }
		},
		GetNodeInfo : {
			url: "nodes/$Upload.id$",
			verb: "GET",
			params : { cstoken : "$auth1.cookie$" },
			expectType : { ok: "boolean" },
			expect : { 
				ok : true,
				"contents[0].dataHash" : "b98a0395b2916ff94e700617a8ffc5117f57a68a" 
			}
		},
		GetFolderContents : {
			url : "nodes/$folder1.id$/children",
			verb : "GET",
			params : { cstoken : "$auth1.cookie$" },
			expectType : { ok : "boolean", contents : "object" },
			expect : {
				ok : true,
				"contents[0].dataHash" : "b98a0395b2916ff94e700617a8ffc5117f57a68a"
			}
		},
		Addversion :{
			url : "nodes/$Upload.id$/content",
			verb : "POST",
			type : "multipart/form-data",
			fileContents : "FileContents - file stuff v2",
			fileName : "test2.txt",
			params : { 
				cstoken : "$auth1.cookie$"
			},
			expect : {ok : true}
		},
		DownloadV2 : {
			url: "nodes/$Upload.id$/content",
			verb: "GET",
			dataType: "html",
			params : { cstoken : "$auth1.cookie$" },
			expectType : { content: "string" },
			expect : {content : "$Addversion.fileContents$" }
		},
		GetNodeInfoV2 : {
			url: "nodes/$Upload.id$",
			verb: "GET",
			params : { cstoken : "$auth1.cookie$" },
			expectType : { ok: "boolean" },
			expect : { 
				ok : true,
				"contents[0].dataHash" : "5683baf97c4fd7f189241486152167fece370ed9" 
			}
		},
		GetVersionHistory :{
			url: "nodes/$Upload.id$/versionHistory",
			verb: "GET",
			params : { cstoken : "$auth1.cookie$" },
			expectType : { 
				ok: "boolean",
				versionHistory: "object"
			},
			expect : { 
				ok : true,
				"versionHistory.length" : 2,
				"versionHistory[0].versionNum" : 1,
				"versionHistory[0].fileName" : "test.txt",
				"versionHistory[0].userID" : "$auth1.userID$",
				"versionHistory[1].versionNum" : 2,
				"versionHistory[1].fileName" : "test2.txt",
				"versionHistory[1].userID" : "$auth1.userID$"
			}		
		},
		GetAuditHistory :{
			url: "nodes/$Upload.id$/history",
			verb: "GET",
			params : { cstoken : "$auth1.cookie$" },
			expectType : { 
				ok: "boolean",
				history: "object"
			},
			expect : { 
				ok : true,
				"history.length" : 5,
			}		
		},
		eventLog1: {
			versions: ["v4"],
			url: "notifications",
			verb: "GET",
			params: {
				cstoken: "$auth1.cookie$",
				token: "$auth1.token$",
				clientID: "$auth1.clientID$",
				since: "$initialState.lastEvent$"
			},
			expectType: {
				"ok": "boolean",
				"events": "object"
			},
			expect: {
				"ok": true,
				"events.length": 3,
				"events[0].id": "$folder1.id$",
				"events[0].isReadOnly": false,
				"events[0].name": "share",
				"events[0].parentID": "$auth1.rootFolder$",
				"events[0].shareType": 0,
				"events[0].subtype": "foldercreated",
				"events[1].dataHash": "b98a0395b2916ff94e700617a8ffc5117f57a68a",
				"events[1].dataSize": "25",
				"events[1].id": "$Upload.id$",
				"events[1].name": "test.txt",
				"events[1].parentID": "$folder1.id$",
				"events[1].subtype": "versionadded",
				"events[1].versionNum": 1,
				"events[2].dataHash": "5683baf97c4fd7f189241486152167fece370ed9",
				"events[2].dataSize": "28",
				"events[2].id": "$Upload.id$",
				"events[2].name": "test.txt",
				"events[2].parentID": "$folder1.id$",
				"events[2].subtype": "versionadded",
				"events[2].versionNum": 2
			}
		}
	},
	
	// **********************************************************************
	// Publish file tests
	// **********************************************************************
	
	//Auth as test1 user and create two files in the Tempo volume.  One file has two versions
	PublishFiles: {
		auth1 : {
			libraryStep : lib.auth,
			variables : { userName : "test1" }
		},
		NewFile : {
			url : "nodes/$auth1.rootFolder$/children",
			verb : "POST",
			type : "multipart/form-data",
			fileContents : "Test file contents v1",
			fileName : "test.txt",
			params : { cstoken : "$auth1.cookie$" },
			remember : { 'id': 'id'},
			expect : { ok : true }
		},
		NewFileV2 :{
			url : "nodes/$NewFile.id$/content",
			verb : "POST",
			type : "multipart/form-data",
			fileContents : "Sample File v2",
			fileName : "test2.txt",
			params : { cstoken : "$auth1.cookie$" },
			expect : { ok : true }
		},
		NewFile2 :{
			url : "nodes/$auth1.rootFolder$/children",
			verb : "POST",
			type : "multipart/form-data",
			fileContents : "Second file contents",
			fileName : "newFile2.txt",
			params : { cstoken : "$auth1.cookie$" },
			remember : { 'id': 'id'},
			expect : { ok : true }
		},
		//Create a folder with a file within it in the user's personal workspace
		PWSFolder : {
			libraryStep : lib.createFolder,
			variables : {
				parentID : "$auth1.userID$",
				name : "Test Folder",
				cstoken : "$auth1.cookie$"
			},
			expect : { ok : true },
			remember : { 'id': 'id'}
		},
		PWSFile : {
			url : "nodes/$PWSFolder.id$/children",
			verb : "POST",
			type : "multipart/form-data",
			fileContents : "Test file contents",
			fileName : "ewsTest.txt",
			params : { cstoken : "$auth1.cookie$" },
			remember : { 'id': 'id'},
			expect : { ok : true }
		},
		//Publish one of the files in Tempo to the folder in Content Server while retaining the file in Tempo
		PublishToContainer : {
			url : "nodes/$PWSFolder.id$/children",
			verb : "POST",
			params : { 
				cstoken : "$auth1.cookie$",
				copyFrom : "$NewFile.id$",
				name : "PublishToContainer.txt"
			},
			expect : { ok : true },
			remember : { 'id': 'id'}		
		},
		CheckFileContentsForPublishToContainer : {
			url: "nodes/$PublishToContainer.id$/content",
			verb: "GET",
			dataType: "html",
			params : { cstoken : "$auth1.cookie$" },
			expectType : { content: "string" },
			expect : {content : "$NewFileV2.fileContents$" }
		},
		//Publish one of the files in Tempo to the file; adding a version to the file, in Content Server while retaining the file in Tempo
		PublishVersion1ToDocument : {
			url : "nodes/$PWSFile.id$/content",
			verb : "POST",
			params : { 
				cstoken : "$auth1.cookie$",
				copyFrom : "$NewFile.id$",
				version : 1
			},
			expect : { ok : true },
			remember : { 'id': 'id'}		
		},		
		CheckFileContentsForPublishVersion1ToDocument : {
			url: "nodes/$PublishVersion1ToDocument.id$/content",
			verb: "GET",
			dataType: "html",
			params : { cstoken : "$auth1.cookie$" },
			expectType : { content: "string" },
			expect : {content : "$NewFile.fileContents$" }
		},
		//Publish one of the files in Tempo to a file in Content Server while removing the file in Tempo
		PublishVersion1ToDocumentMove : {
			url : "nodes/$PWSFile.id$/content",
			verb : "POST",
			params : { 
				cstoken : "$auth1.cookie$",
				copyFrom : "$NewFile.id$",
				deleteOriginal : true,
				version : 1
			},
			expect : { ok : true },
			remember : { 'id': 'id'}		
		},
		CheckFileContentsForPublishVersion1ToDocumentMove : {
			url: "nodes/$PublishVersion1ToDocumentMove.id$/content",
			verb: "GET",
			dataType: "html",
			params : { cstoken : "$auth1.cookie$" },
			expectType : { content: "string" },
			expect : {content : "$NewFile.fileContents$" }
		},
		MakeSureOriginalGoneForPublishVersionToDocumentMove : {
			url: "nodes/$NewFile.id$",
			verb: "GET",
			params : { cstoken : "$auth1.cookie$" },
			expect : { ok : false }
		}
	},
	
	// **********************************************************************
	// Publish to Shared Folder Tests
	// **********************************************************************
	
	//Auth as test1 user and create a folder in the Tempo volume.  Share it with test2
	PublishtoSharedFolders: {
		auth1 : {
			libraryStep : lib.auth,
			variables : { userName : "test1" }
		},
		auth2 : {
			libraryStep : lib.auth,
			variables : { userName : "test2" }
		},
		auth3 : {
			libraryStep : lib.auth,
			variables : { userName : "test3" }
		},
	
		folder1 : {
			libraryStep : lib.createFolder,
			variables : {
				parentID : "$auth1.rootFolder$",
				name : "readWritShare",
				cstoken : "$auth1.cookie$"
				}
			},
		share : {
			libraryStep : lib.share,
			variables : {
				id : "$folder1.id$",
				userName : "test2",
				shareType : 2,
				cstoken : "$auth1.cookie$"
				}
			},	
		//test1 creates a file in their shared folder
		test1File : {
			url : "nodes/$folder1.id$/children",
			verb : "POST",
			type : "multipart/form-data",
			fileContents : "Test1 file contents v1",
			fileName : "test1.txt",
			params : { cstoken : "$auth1.cookie$" },
			remember : { 'id': 'id'},
			expect : { ok : true }
		},	
		//test2 creates a file in their tempo root folder
		test2File : {
			url : "nodes/$auth2.rootFolder$/children",
			verb : "POST",
			type : "multipart/form-data",
			fileContents : "Test2 file contents v1",
			fileName : "test2.txt",
			params : { cstoken : "$auth2.cookie$" },
			remember : { 'id': 'id'},
			expect : { ok : true }
		},
		//test2 publishes the file in their Tempo root to the file in the shared folder that they have read-write access to while removing the file in their Tempo
		PublishFiletoSharedDocReadWriteMove : {
			url : "nodes/$test1File.id$/content",
			verb : "POST",
			params : { 
				cstoken : "$auth2.cookie$",
				copyFrom : "$test2File.id$",
				deleteOriginal : true,
				version : 1
			},
			expect : { ok : true },
			remember : { 'id': 'id'}		
		},
		CheckFileContentsForPublishFiletoSharedDocReadWriteMove : {
			url: "nodes/$test1File.id$/content",
			verb: "GET",
			dataType: "html",
			params : { cstoken : "$auth1.cookie$" },
			expectType : { content: "string" },
			expect : {content : "$test2File.fileContents$" }
		},
		MakeSureOriginalGoneForPublishVersionToDocumentMove : {
			url: "nodes/$test2File.id$",
			verb: "GET",
			params : { cstoken : "$auth2.cookie$" },
			expect : { ok : false }
		},
		//test1 changes the share perms of the folder from read-write to read-only for test2
		changeShareToReadOnly : {
			libraryStep : lib.share,
			variables : {
				id : "$folder1.id$",
				userName : "test2",
				shareType : 1,
				cstoken : "$auth1.cookie$"
			}
		},
		//test1 creates a file in their shared folder
		test3File : {
			url : "nodes/$folder1.id$/children",
			verb : "POST",
			type : "multipart/form-data",
			fileContents : "Test3 file contents v1",
			fileName : "test3.txt",
			params : { cstoken : "$auth1.cookie$" },
			remember : { 'id': 'id'},
			expect : { ok : true }
		},
		//test2 creates a file in their tempo root folder
		test4File : {
			url : "nodes/$auth2.rootFolder$/children",
			verb : "POST",
			type : "multipart/form-data",
			fileContents : "Test4 file contents v1",
			fileName : "test4.txt",
			params : { cstoken : "$auth2.cookie$" },
			remember : { 'id': 'id'},
			expect : { ok : true }
		},
		//test2 attempts to publish the file in their Tempo root to the file in the shared folder that they have read-only access to while removing the file in their Tempo.  This will fail.
		PublishFiletoSharedDocReadOnlyMove : {
			url : "nodes/$test3File.id$/content",
			verb : "POST",
			params : { 
				cstoken : "$auth2.cookie$",
				copyFrom : "$test4File.id$",
				deleteOriginal : true,
				version : 1
			},
			expect : { ok : true },
			remember : { 'id': 'id'}		
		},
		CheckFileContentsForPublishFiletoSharedDocReadOnlyMove : {
			url: "nodes/$test3File.id$/content",
			verb: "GET",
			dataType: "html",
			params : { cstoken : "$auth1.cookie$" },
			expectType : { content: "string" },
			expect : {content : "$test4File.fileContents$" }
		},
		MakeSureOriginalNotGoneForPublishVersionToDocumentMove : {
			url: "nodes/$test4File.id$",
			verb: "GET",
			params : { cstoken : "$auth2.cookie$" },
			expect : { ok : false }
		},
		//test1 creates a file in their shared folder
		test5File : {
			url : "nodes/$folder1.id$/children",
			verb : "POST",
			type : "multipart/form-data",
			fileContents : "Test5 file contents v1",
			fileName : "test5.txt",
			params : { cstoken : "$auth1.cookie$" },
			remember : { 'id': 'id'},
			expect : { ok : true }
		},
		//test2 creates a file in their tempo root folder
		test6File : {
			url : "nodes/$auth2.rootFolder$/children",
			verb : "POST",
			type : "multipart/form-data",
			fileContents : "Test6 file contents v1",
			fileName : "test6.txt",
			params : { cstoken : "$auth2.cookie$" },
			remember : { 'id': 'id'},
			expect : { ok : true }
		},
		//test2 publishes the file in the shared folder that they have read-only access to the file in their Tempo root.  They also attempt to remove the original file, which should fail
		PublishFileFromSharedDocReadOnlyMove : {
			url : "nodes/$test6File.id$/content",
			verb : "POST",
			params : { 
				cstoken : "$auth2.cookie$",
				copyFrom : "$test5File.id$",
				deleteOriginal : true,
				version : 1
			},
			expect : { ok : true },
			remember : { 'id': 'id'}		
		},
		CheckFileContentsForPublishFileFromSharedDocReadOnlyMove : {
			url: "nodes/$test6File.id$/content",
			verb: "GET",
			dataType: "html",
			params : { cstoken : "$auth2.cookie$" },
			expectType : { content: "string" },
			expect : {content : "$test5File.fileContents$" }
		},
		MakeSureOriginalNotGoneForPublishFileFromSharedDocReadOnlyMove : {
			url: "nodes/$test5File.id$",
			verb: "GET",
			params : { cstoken : "$auth1.cookie$" },
			expect : { ok : false }
		},
		//test1 changes the share perms of the folder from read-only to read-write for test2
		changeShareToReadOnly : {
			libraryStep : lib.share,
			variables : {
				id : "$folder1.id$",
				userName : "test2",
				shareType : 2,
				cstoken : "$auth1.cookie$"
			}
		},
		
		//test1 creates a file in their shared folder
		test7File : {
			url : "nodes/$folder1.id$/children",
			verb : "POST",
			type : "multipart/form-data",
			fileContents : "Test7 file contents v1",
			fileName : "test7.txt",
			params : { cstoken : "$auth1.cookie$" },
			remember : { 'id': 'id'},
			expect : { ok : true }
		},
		//test2 creates a file in their tempo root folder
		test8File : {
			url : "nodes/$auth2.rootFolder$/children",
			verb : "POST",
			type : "multipart/form-data",
			fileContents : "Test8 file contents v1",
			fileName : "test8.txt",
			params : { cstoken : "$auth2.cookie$" },
			remember : { 'id': 'id'},
			expect : { ok : true }
		},
		//test2 publishes the file in the shared folder that they have read-write access to the file in their Tempo root.  They also remove the original file
		PublishFileFromSharedDocReadWriteMove : {
			url : "nodes/$test8File.id$/content",
			verb : "POST",
			params : { 
				cstoken : "$auth2.cookie$",
				copyFrom : "$test7File.id$",
				deleteOriginal : true,
				version : 1
			},
			expect : { ok : true },
			remember : { 'id': 'id'}		
		},
		CheckFileContentsForPublishFileFromSharedDocReadWriteMove : {
			url: "nodes/$test8File.id$/content",
			verb: "GET",
			dataType: "html",
			params : { cstoken : "$auth2.cookie$" },
			expectType : { content: "string" },
			expect : {content : "$test7File.fileContents$" }
		},
		MakeSureOriginalGoneForPublishFileFromSharedDocReadWriteMove : {
			url: "nodes/$test8File.id$",
			verb: "GET",
			params : { cstoken : "$auth1.cookie$" },
			expect : { ok : false }
		}
	},	
		
	// **********************************************************************
	// Users Resourses
	// Change Passsword
	// **********************************************************************
	
	changePassword_returnsOK: {
		auth : {
				libraryStep : lib.auth,
				variables : { userName : "test1" }
		},		
		changePassword: {
			url: "users/$auth.userID$",
			verb: "PUT",
			params: {
				cstoken : "$auth.cookie$",				
				oldPassword: "livelink",
				newPassword: "newPassword"
			},
			expectType: {
				"ok": "boolean"				
			},
			expect: {
				"ok": true
			}
		}
		
	},
	SearchUserTest : {
		auth1 : {
			libraryStep : lib.auth,
			variables : { userName : "test1" }
		},
		GetUsers : {
			url: "users",
			verb: "GET",
			params : { 
				cstoken : "$auth1.cookie$",
				filter : "tes",
				limit : 2
			},
			expect : { "users.length": 2 }
		}
	},
	
	// **********************************************************************
	// Basic user operations, add, get, delete photo
	// **********************************************************************
	
	UserPhoto: {
		auth: {
			libraryStep: lib.auth,
			variables: { userName: "test1" }
		},
		addUserPhoto: {
			url: "users/$auth.userID$/photo",
			verb: "POST",
			type: "multipart/form-data",
			contentType: "image/png",
			fileContents: utils.GetBinaryFileData("test.png"),
			binaryData: true,
			fileName: "test.png",
			params: {
				cstoken: "$auth.cookie$"
			},
			expect: {
				"ok": true
			}
		},
		getUserPhoto: {
			url: "users/$auth.userID$/photo",
			verb: "GET",
			binaryResponse: true,
			params: {
				cstoken: "$auth.cookie$"
			},
			expect: {
				content: utils.StringToArrayBuffer(utils.GetBinaryFileData("test.png"))
			}
		},
		deleteUserPhoto: {
			url: "users/$auth.userID$/photo",
			verb: "DELETE",
			params: {
				"cstoken": "$auth.cookie$"
			}
		}
	},
	
	addVersionLoop: {
		auth: {
			libraryStep : lib.auth,
			variables : { userName : "test2" }
		},
		AddFile: {
			url : "nodes/$auth.rootFolder$/children",
			verb : "POST",
			type : "multipart/form-data",
			fileContents : "Test7 file contents v1",
			fileName : "test.txt",
			params : { cstoken : "$auth.cookie$" },
			remember : { 'id': 'id'},
			expect : { ok : true }
		},
		AddVersion: {
			url : "nodes/$AddFile.id$/content",
			verb : "POST",
			type : "multipart/form-data",
			fileContents : "FileContents - file stuff v$AddVersion.itr$\n jawoiefhjaioyhfauhwefaow;ijefpoaihj\nfeopiahjwefuahwefF\nileContents - file stuff v$AddVersion.itr$jawoiefhjaioyhfauhwefaow;ijefpoaihjfeopiahjwefuahwef",
			fileName : "test.txt",
			params : { 
				cstoken : "$auth.cookie$"
			},
			expect : {ok : true},
			loop: 3
		}
	},
	
	//
	// Test for TEMPO-647, escaping in JSON strings
	//
	escaping: {
		auth1: {
			libraryStep : lib.auth,
			variables : { userName : "test1" }
		},
		createFolder: {
			libraryStep : lib.createFolder,
			variables : {
				parentID : "$auth1.rootFolder$",
				name : "hello\\new",
				cstoken : "$auth1.cookie$"
			}
		},
		getObjectInfo: {
			url: "nodes/$createFolder.id$",
			verb: "GET",
			params: {
				"cstoken": "$auth1.cookie$"
			},
			expectType: {
				"ok": "boolean",
				"contents[0].name": "string",
				"count": "number"
			},
			expect: {
				"ok": true,
				"contents[0].name": "$createFolder.variables.name$",
				"count": 1
			}
		},
		createFolder2: {
			libraryStep : lib.createFolder,
			variables : {
				parentID : "$auth1.rootFolder$",
				name : "fred\\/wilma",
				cstoken : "$auth1.cookie$"
			}
		},
		getObjectInfo2: {
			url: "nodes/$createFolder2.id$",
			verb: "GET",
			params: {
				"cstoken": "$auth1.cookie$"
			},
			expectType: {
				"ok": "boolean",
				"contents[0].name": "string",
				"count": "number"
			},
			expect: {
				"ok": true,
				"contents[0].name": "$createFolder2.variables.name$",
				"count": 1
			}
		}
	},

	shareNotify: {
		auth1 : {
			libraryStep : lib.auth,
			variables : { userName : "test1" }
		},
		auth2 : {
			libraryStep : lib.auth,
			variables : { userName : "test2" }
		},
		folder1 : {
			libraryStep : lib.createFolder,
			variables : {
				parentID : "$auth1.rootFolder$",
				name : "share",
				cstoken : "$auth1.cookie$"
			}
		},
		share : {
			libraryStep : lib.share,
			variables : {
				id : "$folder1.id$",
				userName : "test2",
				shareType : 2,
				cstoken : "$auth1.cookie$"
			}
		},
		accept : {
			libraryStep : lib.accept,
			variables : { id: "$folder1.id$", cstoken: "$auth2.cookie$" }
		},
		getSyncTree : {
			url : "nodes",
			verb : "GET",
			params : { cstoken : "$auth2.cookie$" },
			expectType : { contents : "object", count: "number" },
			expect : {
				count : 1,
				"contents[0].id" : "$folder1.id$",
				"contents[0].name" : "share (test1)",
				"contents[0].isReadOnly" : false,
				"contents[0].isNotifySet" : null
			}
		},
		getFolderContents : {
			url : "nodes/$auth2.rootFolder$/children",
			verb : "GET",
			params : { cstoken : "$auth2.cookie$" },
			expectType : { contents : "object", count: "number" },
			expect : {
				count : 1,
				"contents[0].id" : "$folder1.id$",
				"contents[0].name" : "share (test1)",
				"contents[0].isReadOnly" : false,
				"contents[0].isNotifySet" : false
			}
		},
		getObjectInfo : {
			url : "nodes/$folder1.id$",
			verb : "GET",
			params : { cstoken : "$auth2.cookie$" },
			expectType : { contents : "object", count: "number" },
			expect : {
				count : 1,
				"contents[0].id" : "$folder1.id$",
				"contents[0].name" : "share (test1)",
				"contents[0].isReadOnly" : false,
				"contents[0].isNotifySet" : false
			}
		},
		 /**
		  * Now set notify to true and check again
		  */
		setNotify: {
			url : "shares/incoming/$folder1.id$",
			verb : "PUT",
			params : { cstoken : "$auth2.cookie$", notify : true },
			expect : { ok : true }
		},
		getSyncTree2 : {
			url : "nodes",
			verb : "GET",
			params : { cstoken : "$auth2.cookie$" },
			expectType : { contents : "object", count: "number" },
			expect : {
				count : 1,
				"contents[0].id" : "$folder1.id$",
				"contents[0].name" : "share (test1)",
				"contents[0].isReadOnly" : false,
				"contents[0].isNotifySet" : null
			}
		},
		getFolderContents2 : {
			url : "nodes/$auth2.rootFolder$/children",
			verb : "GET",
			params : { cstoken : "$auth2.cookie$" },
			expectType : { contents : "object", count: "number" },
			expect : {
				count : 1,
				"contents[0].id" : "$folder1.id$",
				"contents[0].name" : "share (test1)",
				"contents[0].isReadOnly" : false,
				"contents[0].isNotifySet" : true
			}
		},
		getObjectInfo2 : {
			url : "nodes/$folder1.id$",
			verb : "GET",
			params : { cstoken : "$auth2.cookie$" },
			expectType : { contents : "object", count: "number" },
			expect : {
				count : 1,
				"contents[0].id" : "$folder1.id$",
				"contents[0].name" : "share (test1)",
				"contents[0].isReadOnly" : false,
				"contents[0].isNotifySet" : true
			}
		}
	},

	user_configuration_notification: {
		auth1 : {
			libraryStep : lib.auth,
			variables : { userName : "test1" }
		},
		auth2 : {
			libraryStep : lib.auth,
			variables : { userName : "test2" }
		},
		getUserInfo: {
			url: "users/$auth1.userid$/settings",
			verb: "GET",
			params: {
				"cstoken": "$auth1.cookie$"
			},
			expectType: {
				"ok": "boolean",
				"notifyOnFolderChange": "boolean",
				"notifyOnShareRequest": "boolean"
			},
			expect: {
				"ok": true,
			},
		},
		changeBothNotifyOnSettingsToTrue: {
			url: "users/$auth1.userID$/settings",
			verb: "PUT",
			params: {
				cstoken : "$auth1.cookie$",				
				notifyOnFolderChange : "true",
				notifyOnShareRequest: "true"
			},
			expectType: {
				"ok": "boolean"				
			},
			expect: {
				"ok": true
			},
		},
		getUserInfoAfterChangeToTrue: {
			url: "users/$auth1.userid$/settings",
			verb: "GET",
			params: {
				"cstoken": "$auth1.cookie$"
			},
			expectType: {
				"ok": "boolean",
				"notifyOnFolderChange": "boolean",
				"notifyOnShareRequest": "boolean"
			},
			expect: {
				"ok": true,
				"notifyOnFolderChange": true,
				"notifyOnShareRequest": true
			},
		},
		changeBothNotifyOnSettingsToFalse: {
			url: "users/$auth1.userID$/settings",
			verb: "PUT",
			params: {
				cstoken : "$auth1.cookie$",				
				notifyOnFolderChange : "false",
				notifyOnShareRequest: "false"
			},
			expectType: {
				"ok": "boolean"				
			},
			expect: {
				"ok": true
			},
		},
		getUserInfoAfterChangeToFalse: {
			url: "users/$auth1.userid$/settings",
			verb: "GET",
			params: {
				"cstoken": "$auth1.cookie$"
			},
			expectType: {
				"ok": "boolean",
				"notifyOnFolderChange": "boolean",
				"notifyOnShareRequest": "boolean"
			},
			expect: {
				"ok": true,
				"notifyOnFolderChange": false,
				"notifyOnShareRequest": false
			},
		},
		changeBothNotifyOnSettingsAsDifferentUser: {
			url: "users/$auth1.userID$/settings",
			verb: "PUT",
			params: {
				cstoken : "$auth2.cookie$",				
				notifyOnFolderChange : "true",
				notifyOnShareRequest: "true"
			},
			expectType: {
				"ok": "boolean"				
			},
			expect: {
				"ok": true
			},
		},
		getUserInfoAfterChangeFromDifferentUser: {
			url: "users/$auth1.userid$/settings",
			verb: "GET",
			params: {
				"cstoken": "$auth1.cookie$"
			},
			expectType: {
				"ok": "boolean",
				"notifyOnFolderChange": "boolean",
				"notifyOnShareRequest": "boolean"
			},
			expect: {
				"ok": true,
				"notifyOnFolderChange": false,
				"notifyOnShareRequest": false
			}
		}
	},
	
	CreateSTFR: {
		auth1: {
			libraryStep : lib.auth,
			variables : { userName : "test1" }
		},
		adminAuth: {
			url: "auth",
			verb: 'POST',
			dataType: "html",
			params: {username: "Admin", password: "livelink",admin: true},
			remember: {content: "cookie"},
		},
		adminCreateSTFR: {
			url: "approots",
			verb: "POST",
			params: {cstoken: "$adminAuth.cookie$", name: "STFRoot20"},
			expectType: {"id": "number"},
			remember: {"id": "STFRid"},
		},
		adminGetSTFR: {
			url: "approots/STFRoot20",
			verb: "GET",
			params: {cstoken: "$adminAuth.cookie$"},
			expectType: {"nodeID": "number"},
			expect: {"nodeID": "$adminCreateSTFR.STFRid$"},
		},
		adminGetBogusSTFR: {
			url: "approots/BogusSTFR1234",
			verb: "GET",
			params: {cstoken: "$adminAuth.cookie$"},
			expectError: 404, //Not Found
		},
		userGetSTFR: {
			url: "approots/STFRoot20",
			verb: "GET",
			params: {cstoken: "$auth1.cookie$"},
			expectError: 403, // Forbidden 
		},
		noTokenGetSTFR: {
			url: "approots/STFRoot20",
			verb: "GET",
			expectError: 401, // Forbidden 
		},
		adminCreateDupSTFR: {
			url: "approots",
			verb: "POST",
			expectError: 500,
			params: {cstoken: "$adminAuth.cookie$",	name: "STFRoot20"},
		},
		deleteNode: {
			url: "nodes/$adminCreateSTFR.STFRid$",
			verb: "DELETE",
			params: {cstoken: "$adminAuth.cookie$"},
			expectType: {"ok": "boolean"},
			expect: {"ok": true},
		},
		adminCreateNoNameSTFR: {
			url: "approots",
			verb: "POST",
			expectError: 500,
			params: {cstoken: "$adminAuth.cookie$", name: " "},
		},
		adminCreateNoTokenSTFR: {
			url: "approots",
			verb: "POST",
			expectError: 401,
			params: {cstoken: "", name: "STFRoot21"},
		},
		nonAdminCreateSTFR: {
			url: "approots",
			verb: "POST",
			expectError: 403,
			params: {cstoken: "$auth1.cookie$",	name: "nonAdminSTFRoot22"},
		},
		adminCreateUTF8STFR: {
			url: "approots",
			verb: "POST",
			params: {cstoken: "$adminAuth.cookie$", name: "utf8ÜçêæÑ¿®óÉøªàÀìÆôùÿγνωρίζω البحوث体中文test=1£èö'! @#$%^&()_-+=[]{};',.`~2"},
			expectType: {"id": "number"},
			remember: {"id": "STFRid"},
		},
		adminGetUTF8STFR: {
		//The utf8 name above needs to be URI encoded (as below) before sending.
			url: "approots/" + encodeURIComponent ("utf8ÜçêæÑ¿®óÉøªàÀìÆôùÿγνωρίζω البحوث体中文test=1£èö'! @#$%^&()_-+=[]{};',.`~2"),
			verb: "GET",
			params: {cstoken: "$adminAuth.cookie$"},
			expectType: {"nodeID": "number"},
			expect: {"nodeID": "$adminCreateUTF8STFR.STFRid$"},
		},
		deleteUTF8Node: {
			url: "nodes/$adminCreateUTF8STFR.STFRid$",
			verb: "DELETE",
			params: {cstoken: "$adminAuth.cookie$"},
			expectType: {"ok": "boolean"},
			expect: {"ok": true}
		}
	},
	
	Impersonation: {
	adminAuth: {
			url: "auth",
			verb: 'POST',
			dataType: "html",
			params: {
				username: "Admin",
				password: "livelink",
				admin: true
				},
			remember: {
				content: "cookie"
			},
		},
	auth1: {
			libraryStep : lib.auth,
			variables : { userName : "test1" }
			},
	adminImpersonateUser: {
			url: "auth",
			verb: "POST",
			params: {
				cstoken: "$adminAuth.cookie$",
				username: "test1",
				impersonate: true
			},			
			expectType: {
				"ok": "boolean",
				"rootFolder": "number"
			},
			expect: {
				"ok": true,
				"rootFolder": "$auth1.rootFolder$",
				"userID==1000": false
			},
		},
	auth2: {
			libraryStep : lib.auth,
			variables : { userName : "test2" }
			},
	UserImpersonateUser: {
			url: "auth",
			verb: "POST",
			params: {
				cstoken: "$auth2.cookie$",
				username: "test1",
				impersonate: true
			},			
			expectType: {
				"ok": "boolean"
			},
			expect: {
				"ok": false
			},
		},
	adminAuth2: {
			url: "auth",
			verb: 'POST',
			dataType: "html",
			params: {
				username: "Admin",
				password: "livelink",
				admin: true
				},
			remember: {
				content: "cookie"
			},
		},
	adminImpersonateNoUserName: {
			url: "auth",
			verb: "POST",
			params: {
				cstoken: "$adminAuth2.cookie$",
				username: "",
				impersonate: true
			},			
			expectType: {
				"ok": "boolean"
			},
			expect: {
				"ok": false
			},
		},
	adminImpersonateUserNoToken: {
			url: "auth",
			verb: "POST",
			params: {
				cstoken: "",
				username: "test1",
				impersonate: true
			},			
			expectType: {
				"ok": "boolean"
			},
			expect: {
				"ok": false
			},
		},
	adminImpersonateInvalidUser: {
			url: "auth",
			verb: "POST",
			params: {
				cstoken: "$adminAuth2.cookie$",
				username: "test20",
				impersonate: true
			},			
			expectType: {
				"ok": "boolean"
			},
			expect: {
				"ok": false
			}
		}
	},
	
	CreateSTF: {
		adminAuth: {
			url: "auth",
			verb: 'POST',
			dataType: "html",
			params: {
				username: "Admin",
				password: "livelink",
				admin: true
				},
			remember: {
				content: "cookie"
			},
		},
				
		regUserAuth1: {
			libraryStep : lib.auth,
			variables : { userName : "test1" }
		},
		
		regUserAuth2: {
			libraryStep : lib.auth,
			variables : { userName : "test2" }
		},
				
		adminCreateSTFR: {
			url: "approots",
			verb: "POST",
			params: {
				cstoken: "$adminAuth.cookie$",
				name: "STFRoot30"
			},
			expectType: {
				"id": "number"
			},
			remember: {
				"id": "STFRid"
			},
		},
		
		adminCreateSTF: {
			url: "approots/$adminCreateSTFR.STFRid$/children",
			verb: "POST",
			params: {
				cstoken: "$adminAuth.cookie$",
				name: "STF2",
				username: "test1"
			},
			expectType: {
				"id": "number"
			},
			remember: {
				"id": "STF2id"
			},
		},
		
			
		userCreateSTF: {
			url: "approots/$adminCreateSTFR.STFRid$/children",
			verb: "POST",
			expectError: 403,
			params: {
				cstoken: "$regUserAuth1.cookie$",
				username: "test1",
				name: "STF3"
			},
		},
		
		createNode: {
			libraryStep: lib.createFolder,
			variables: {
				"parentID": "$regUserAuth1.rootFolder$",
				"name": "RegFolder",
				"cstoken": "$regUserAuth1.cookie$"
			},
		},
		
		createSTFRegFolder: {
		url: "approots/$createNode.id$/children",
			verb: "POST",
			expectError: 500,
			params: {
				cstoken: "$adminAuth.cookie$",
				name: "STF4",
				username: "test1"
			},
		},
		createSTFTempoRootFolder: {
		url: "approots/$regUserAuth1.rootFolder$/children",
			verb: "POST",
			expectError: 500,
			params: {
				cstoken: "$adminAuth.cookie$",
				name: "STF5",
				username: "test1"
			},
		},
		
		adminCreateSTFNoName: {
			url: "approots/$adminCreateSTFR.STFRid$/children",
			verb: "POST",
			expectError: 500,
			params: {
				cstoken: "$adminAuth.cookie$",
				name: " ",
				username: "test1"
			},
		},
		
		adminCreateSTFNoName: {
			url: "approots/$adminCreateSTFR.STFRid$/children",
			verb: "POST",
			expectError: 400,
			params: {
				cstoken: "$adminAuth.cookie$",
				username: "test1"
			},
		},
		
		adminCreateSTFUTF8Name: {
			url: "approots/$adminCreateSTFR.STFRid$/children",
			verb: "POST",
			params: {
				cstoken: "$adminAuth.cookie$",
				name: "utf8ÜçêæÑ¿®óÉøªàÀìÆôùÿγνωρίζω البحوث体中文test=1£èö'! @#$%^&()_-+=[]{};',.`~3",
				username: "test1"
			},
			expectType: {
				"id": "number"
			},
			remember: {
				"id": "STFUTFid"
			},
		},
		adminCreateSTFInvalidUserName: {
			url: "approots/$adminCreateSTFR.STFRid$/children",
			verb: "POST",
			expectError: 400,
			params: {
				cstoken: "$adminAuth.cookie$",
				name: "STF6",
				username: "notauser"
			},
		},
		
		adminCreateSTFNoUserName: {
			url: "approots/$adminCreateSTFR.STFRid$/children",
			verb: "POST",
			expectError: 400,
			params: {
				cstoken: "$adminAuth.cookie$",
				name: "STF7",
			},
		},
		
		adminCreatePrivateReadWriteSTF: {
			url: "approots/$adminCreateSTFR.STFRid$/children",
			verb: "POST",
			params: {
				cstoken: "$adminAuth.cookie$",
				name: "STF8",
				username: "test1",
				type: "private",
				readonly: false
			},
			expectType: {
				"id": "number"
			},
			remember: {
				"id": "STF8id"
			},
		},
		
		getObjectInfo8: {
			url: "nodes/$adminCreatePrivateReadWriteSTF.STF8id$",
			verb: "GET",
			params: {
				"cstoken": "$regUserAuth2.cookie$"
			},
			expectType: {
				"ok": "boolean"
			},
			expect: {
				"ok": false,
			},
		},
		
		adminCreatePrivateReadOnlySTF: {
			url: "approots/$adminCreateSTFR.STFRid$/children",
			verb: "POST",
			params: {
				cstoken: "$adminAuth.cookie$",
				name: "STF9",
				username: "test1",
				type: "private"
			},
			expectType: {
				"id": "number"
			},
			remember: {
				"id": "STF9id"
			},
		},
		
		getObjectInfo9: {
			url: "nodes/$adminCreatePrivateReadOnlySTF.STF9id$",
			verb: "GET",
			params: {
				"cstoken": "$regUserAuth2.cookie$"
			},
			expectType: {
				"ok": "boolean"
			},
			expect: {
				"ok": false,
			},
		},
		
		adminCreatePublicReadWriteSTF: {
			url: "approots/$adminCreateSTFR.STFRid$/children",
			verb: "POST",
			params: {
				cstoken: "$adminAuth.cookie$",
				name: "STF10",
				username: "test1",
				readonly: false
			},
			expectType: {
				"id": "number"
			},
			remember: {
				"id": "STF10id"
			},
		},
		
		getObjectInfo10: {
			url: "nodes/$adminCreatePublicReadWriteSTF.STF10id$",
			verb: "GET",
			params: {
				"cstoken": "$regUserAuth2.cookie$"
			},
			expectType: {
				"ok": "boolean"
			},
			expect: {
				"ok": true,
			},
		},
		
		adminCreatePublicReadOnlySTF: {
			url: "approots/$adminCreateSTFR.STFRid$/children",
			verb: "POST",
			params: {
				cstoken: "$adminAuth.cookie$",
				name: "STF11",
				username: "test1",
				readonly: false
			},
			expectType: {
				"id": "number"
			},
			remember: {
				"id": "STF10id"
			},
		},
		
		getObjectInfo10: {
			url: "nodes/$adminCreatePublicReadOnlySTF.STF11id$",
			verb: "GET",
			params: {
				"cstoken": "$regUserAuth2.cookie$"
			},
			expectType: {
				"ok": "boolean"
			},
			expect: {
				"ok": false,
			}
		}
	},
	
	AddUserPrivateSTF: {
		adminAuth: {
			url: "auth",
			verb: 'POST',
			dataType: "html",
			params: {
				username: "Admin",
				password: "livelink",
				admin: true
				},
			remember: {
				content: "cookie"
			},
		},
				
		regUserAuth1: {
			libraryStep : lib.auth,
			variables : { userName : "test1" }
		},
		
		regUserAuth2: {
			libraryStep : lib.auth,
			variables : { userName : "test2" }
		},
		
		regUserAuth3: {
			libraryStep : lib.auth,
			variables : { userName : "test3" }
		},
				
		adminCreateSTFR: {
			url: "approots",
			verb: "POST",
			params: {
				cstoken: "$adminAuth.cookie$",
				name: "STFRoot1"
			},
			expectType: {
				"id": "number"
			},
			remember: {
				"id": "STFRid"
			},
		},
		
		adminCreateSTF: {
			url: "approots/$adminCreateSTFR.STFRid$/children",
			verb: "POST",
			params: {
				cstoken: "$adminAuth.cookie$",
				name: "STF1",
				username: "test1",
				type: "private"
			},
			expectType: {
				"id": "number"
			},
			remember: {
				"id": "STF1id"
			},
		},
		//Add regular user to private System Tempo Folder (STF) with Read Only perms
		getObjectInfo1: {
			url: "nodes/$adminCreateSTF.STF1id$",
			verb: "GET",
			params: {
				"cstoken": "$regUserAuth2.cookie$"
			},
			expectType: {
				"ok": "boolean"
			},
			expect: {
				"ok": false,
			},
		},
		
		AddUserReadOnlyAsAdmin: {
			url: "approots/$adminCreateSTFR.STFRid$/children/$adminCreateSTF.STF1id$/users/test2",
			verb: "PUT",
			params: {
				cstoken: "$adminAuth.cookie$",
				isReadOnly: true,
			},
		},
		
		getObjectInfo2: {
			url: "nodes/$adminCreateSTF.STF1id$",
			verb: "GET",
			params: {
				"cstoken": "$regUserAuth2.cookie$"
			},
			expectType: {
				"ok": "boolean"
			},
			expect: {
				"ok": true,
			},
		},
		//Add Admin user to private System Tempo Folder (STF) 
		AddAdminUserReadOnlyAsAdmin: {
			url: "approots/$adminCreateSTFR.STFRid$/children/$adminCreateSTF.STF1id$/users/Admin",
			verb: "PUT",
			params: {
				cstoken: "$adminAuth.cookie$",
				isReadOnly: true,
			},
		},
		
		//try to get folder after adding Admin user.
		getObjectInfo3: {
			url: "nodes/$adminCreateSTF.STF1id$",
			verb: "GET",
			params: {
				"cstoken": "$adminAuth.cookie$"
			},
			expectType: {
				"ok": "boolean"
			},
			expect: {
				"ok": true,
			},
		},
		//Add regular user to private System Tempo Folder (STF) as the owner of the STF
		AddUserReadOnlyAsRegUser: {
			url: "approots/$adminCreateSTFR.STFRid$/children/$adminCreateSTF.STF1id$/users/test3",
			verb: "PUT",
			expectError: 403,
			params: {
				cstoken: "$regUserAuth1.cookie$",
				isReadOnly: true,
			},
		},
		
		getObjectInfo4: {
			url: "nodes/$adminCreateSTF.STF1id$",
			verb: "GET",
			params: {
				"cstoken": "$regUserAuth3.cookie$"
			},
			expectType: {
				"ok": "boolean"
			},
			expect: {
				"ok": false,
			},
		},
			
		//Add regular user to private System Tempo Folder (STF) with Read Write perms
		AddUserReadWriteAsAdmin: {
			url: "approots/$adminCreateSTFR.STFRid$/children/$adminCreateSTF.STF1id$/users/test3",
			verb: "PUT",
			params: {
				cstoken: "$adminAuth.cookie$",
				isReadOnly: false,
			},
		},
		
		getObjectInfo5: {
			url: "nodes/$adminCreateSTF.STF1id$",
			verb: "GET",
			params: {
				"cstoken": "$regUserAuth3.cookie$"
			},
			expectType: {
				"ok": "boolean"
			},
			expect: {
				"ok": true,
			},
		},
		
		//Add an invalid user to private System Tempo Folder (STF) with Read Write perms, should get a 404 as the user can't be found
		AddInvalidUserReadWriteAsAdmin: {
			url: "approots/$adminCreateSTFR.STFRid$/children/$adminCreateSTF.STF1id$/users/invalidUser",
			verb: "PUT",
			expectError: 404,
			params: {
				cstoken: "$adminAuth.cookie$",
				isReadOnly: false,
			},
		}, 
		
		//Add an existing user to private System Tempo Folder (STF) who had Read Only perms with Read Write perms
		AddExistingUserWasReadOnlyToReadWrite: {
			url: "approots/$adminCreateSTFR.STFRid$/children/$adminCreateSTF.STF1id$/users/test2",
			verb: "PUT",
			params: {
				cstoken: "$adminAuth.cookie$",
				isReadOnly: false,
			},
		},
		
		getObjectInfo6: {
			url: "nodes/$adminCreateSTF.STF1id$",
			verb: "GET",
			params: {
				"cstoken": "$regUserAuth2.cookie$"
			},
			expectType: {
				"ok": "boolean"
			},
			expect: {
				"ok": true,
			},
		},
		
		//Add an existing user to private System Tempo Folder (STF) who had Read Write perms with Read Only perms
		AddExistingUserWasReadWriteToReadOnly: {
			url: "approots/$adminCreateSTFR.STFRid$/children/$adminCreateSTF.STF1id$/users/test3",
			verb: "PUT",
			params: {
				cstoken: "$adminAuth.cookie$",
				isReadOnly: true,
			},
		},
		
		getObjectInfo7: {
			url: "nodes/$adminCreateSTF.STF1id$",
			verb: "GET",
			params: {
				"cstoken": "$regUserAuth3.cookie$"
			},
			expectType: {
				"ok": "boolean"
			},
			expect: {
				"ok": true,
			}
		}
	},
	
	RemoveUserPrivateSTF: {
		adminAuth: {
			url: "auth",
			verb: 'POST',
			dataType: "html",
			params: {
				username: "Admin",
				password: "livelink",
				admin: true
				},
			remember: {
				content: "cookie"
			},
		},
				
		regUserAuth1: {
			libraryStep : lib.auth,
			variables : { userName : "test1" }
		},
		
		regUserAuth2: {
			libraryStep : lib.auth,
			variables : { userName : "test2" }
		},
		
		regUserAuth3: {
			libraryStep : lib.auth,
			variables : { userName : "test3" }
		},
				
		adminCreateSTFR: {
			url: "approots",
			verb: "POST",
			params: {
				cstoken: "$adminAuth.cookie$",
				name: "STFRoot1"
			},
			expectType: {
				"id": "number"
			},
			remember: {
				"id": "STFRid"
			},
		},
		
		adminCreateSTF: {
			url: "approots/$adminCreateSTFR.STFRid$/children",
			verb: "POST",
			params: {
				cstoken: "$adminAuth.cookie$",
				name: "STF1",
				username: "test1",
				type: "private"
			},
			expectType: {
				"id": "number"
			},
			remember: {
				"id": "STF1id"
			},
		},
		
		//Remove a Read Only user from a private STF
		getObjectInfoPre1: {
			url: "nodes/$adminCreateSTF.STF1id$",
			verb: "GET",
			params: {
				"cstoken": "$regUserAuth2.cookie$"
			},
			expectType: {
				"ok": "boolean"
			},
			expect: {
				"ok": false,
			},
		},
		
		AddUserReadOnlyAsAdmin2: {
			url: "approots/$adminCreateSTFR.STFRid$/children/$adminCreateSTF.STF1id$/users/test2",
			verb: "PUT",
			params: {
				cstoken: "$adminAuth.cookie$",
				isReadOnly: true,
			},
		},
		
		getObjectInfoPost1: {
			url: "nodes/$adminCreateSTF.STF1id$",
			verb: "GET",
			params: {
				"cstoken": "$regUserAuth2.cookie$"
			},
			expectType: {
				"ok": "boolean"
			},
			expect: {
				"ok": true,
			},
		},
		
		RemoveUserReadOnlyAsAdmin2: {
			url: "approots/$adminCreateSTFR.STFRid$/children/$adminCreateSTF.STF1id$/users/test2",
			verb: "DELETE",
			params: {
				cstoken: "$adminAuth.cookie$"
			},
		},
		
		getObjectInfo2: {
			url: "nodes/$adminCreateSTF.STF1id$",
			verb: "GET",
			params: {
				"cstoken": "$regUserAuth2.cookie$"
			},
			expectType: {
				"ok": "boolean"
			},
			expect: {
				"ok": false,
			},
		},
		
		//Remove a Read Write user from a private STF
		getObjectInfo3: {
			url: "nodes/$adminCreateSTF.STF1id$",
			verb: "GET",
			params: {
				"cstoken": "$regUserAuth3.cookie$"
			},
			expectType: {
				"ok": "boolean"
			},
			expect: {
				"ok": false,
			},
		},
		
		AddUserReadOnlyAsAdmin3: {
			url: "approots/$adminCreateSTFR.STFRid$/children/$adminCreateSTF.STF1id$/users/test3",
			verb: "PUT",
			params: {
				cstoken: "$adminAuth.cookie$",
				isReadOnly: false,
			},
		},
		
		getObjectInfo4: {
			url: "nodes/$adminCreateSTF.STF1id$",
			verb: "GET",
			params: {
				"cstoken": "$regUserAuth3.cookie$"
			},
			expectType: {
				"ok": "boolean"
			},
			expect: {
				"ok": true,
			},
		},
		
		RemoveUserReadOnlyAsAdmin3: {
			url: "approots/$adminCreateSTFR.STFRid$/children/$adminCreateSTF.STF1id$/users/test3",
			verb: "DELETE",
			params: {
				cstoken: "$adminAuth.cookie$"
			},
		},
		
		getObjectInfo5: {
			url: "nodes/$adminCreateSTF.STF1id$",
			verb: "GET",
			params: {
				"cstoken": "$regUserAuth3.cookie$"
			},
			expectType: {
				"ok": "boolean"
			},
			expect: {
				"ok": false,
			},
		},
		
		//Remove a user from a private STF who was never added to the STF
		getObjectInfo6: {
			url: "nodes/$adminCreateSTF.STF1id$",
			verb: "GET",
			params: {
				"cstoken": "$regUserAuth3.cookie$"
			},
			expectType: {
				"ok": "boolean"
			},
			expect: {
				"ok": false,
			},
		},
		
		RemoveNonUserAsAdmin: {
			url: "approots/$adminCreateSTFR.STFRid$/children/$adminCreateSTF.STF1id$/users/test3",
			verb: "DELETE",
			params: {
				cstoken: "$adminAuth.cookie$"
			},
		},
		
		getObjectInfo7: {
			url: "nodes/$adminCreateSTF.STF1id$",
			verb: "GET",
			params: {
				"cstoken": "$regUserAuth3.cookie$"
			},
			expectType: {
				"ok": "boolean"
			},
			expect: {
				"ok": false,
			},
		},
		
		//Remove a user from an invalid STF (invalid ID) 
		
		RemoveUserFromInvalidSTF: {
			url: "approots/$adminCreateSTFR.STFRid$/children/00000/users/test3",
			verb: "DELETE",
			expectError: 404,
			params: {
				cstoken: "$adminAuth.cookie$"
			},
		},
		
		//Remove a user from a STF as a non Admin user
		
		getObjectInfo8: {
			url: "nodes/$adminCreateSTF.STF1id$",
			verb: "GET",
			params: {
				"cstoken": "$regUserAuth3.cookie$"
			},
			expectType: {
				"ok": "boolean"
			},
			expect: {
				"ok": false,
			},
		},
		
		AddUserReadOnlyAsAdmin4: {
			url: "approots/$adminCreateSTFR.STFRid$/children/$adminCreateSTF.STF1id$/users/test3",
			verb: "PUT",
			params: {
				cstoken: "$adminAuth.cookie$",
				isReadOnly: false,
			},
		},
		
		getObjectInfo9: {
			url: "nodes/$adminCreateSTF.STF1id$",
			verb: "GET",
			params: {
				"cstoken": "$regUserAuth3.cookie$"
			},
			expectType: {
				"ok": "boolean"
			},
			expect: {
				"ok": true,
			},
		},
		
		RemoveUserAsNonAdmin: {
			url: "approots/$adminCreateSTFR.STFRid$/children/$adminCreateSTF.STF1id$/users/test3",
			verb: "DELETE",
			expectError: 403,
			params: {
				cstoken: "$regUserAuth1.cookie$"
			},
		},
		
		getObjectInfo10: {
			url: "nodes/$adminCreateSTF.STF1id$",
			verb: "GET",
			params: {
				"cstoken": "$regUserAuth3.cookie$"
			},
			expectType: {
				"ok": "boolean"
			},
			expect: {
				"ok": true,
			},
		},
		
		//Remove a user from a public STF as an Admin user
		
		adminCreatePublicSTF: {
			url: "approots/$adminCreateSTFR.STFRid$/children",
			verb: "POST",
			params: {
				cstoken: "$adminAuth.cookie$",
				name: "STFPublic1",
				username: "test1",
				type: "public"
			},
			expectType: {
				"id": "number"
			},
			remember: {
				"id": "STFPublic1id"
			},
		},
		
		getPublicSTFInfoPre1: {
			url: "nodes/$adminCreatePublicSTF.STFPublic1id$",
			verb: "GET",
			params: {
				"cstoken": "$regUserAuth2.cookie$"
			},
			expectType: {
				"ok": "boolean"
			},
			expect: {
				"ok": true,
			},
		},
		
		AddUserToPublicSTF: {
			url: "approots/$adminCreateSTFR.STFRid$/children/$adminCreatePublicSTF.STFPublic1id$/users/test2",
			verb: "PUT",
			params: {
				cstoken: "$adminAuth.cookie$",
				isReadOnly: true,
			},
		},
		
		getPublicSTFInfoPost1: {
			url: "nodes/$adminCreatePublicSTF.STFPublic1id$",
			verb: "GET",
			params: {
				"cstoken": "$regUserAuth2.cookie$"
			},
			expectType: {
				"ok": "boolean"
			},
			expect: {
				"ok": true,
			},
		},
		
		RemoveUserFromPublicSTF: {
			url: "approots/$adminCreateSTFR.STFRid$/children/$adminCreatePublicSTF.STFPublic1id$/users/test2",
			verb: "DELETE",
			params: {
				cstoken: "$adminAuth.cookie$"
			},
		},
		
		getPublicSTFInfoPost2: {
			url: "nodes/$adminCreatePublicSTF.STFPublic1id$",
			verb: "GET",
			params: {
				"cstoken": "$regUserAuth2.cookie$"
			},
			expectType: {
				"ok": "boolean"
			},
			expect: {
				"ok": true,
			},
		}
		
	},
	
	AddSubscriptionToSTF: {
		adminAuth: {
			url: "auth",
			verb: 'POST',
			dataType: "html",
			params: {
				username: "Admin",
				password: "livelink",
				admin: true
				},
			remember: {
				content: "cookie"
			},
		},
				
		regUserAuth1: {
			libraryStep : lib.auth,
			variables : { userName : "test1" }
		},
		
		regUserAuth2: {
			libraryStep : lib.auth,
			variables : { userName : "test2" }
		},
		
		initialState: {
			libraryStep : lib.getSeqNo,
			variables : {
				cookie : "$regUserAuth2.cookie$",
				token : "$regUserAuth2.token$",
				clientID : "$regUserAuth2.clientID$"
			}
		},
		
		adminCreateSTFR: {
			url: "approots",
			verb: "POST",
			params: {
				cstoken: "$adminAuth.cookie$",
				name: "STFRoot30"
			},
			expectType: {
				"id": "number"
			},
			remember: {
				"id": "STFRid"
			}
		},
		
		adminCreateSTF: {
			url: "approots/$adminCreateSTFR.STFRid$/children",
			verb: "POST",
			params: {
				cstoken: "$adminAuth.cookie$",
				name: "STF1",
				username: "test1"
			},
			expectType: {
				"id": "number"
			},
			remember: {
				"id": "STF1id"
			}
		},
		
		adminCreatePrivateSTF: {
			url: "approots/$adminCreateSTFR.STFRid$/children",
			verb: "POST",
			params: {
				cstoken: "$adminAuth.cookie$",
				name: "STF2",
				username: "test1",
				type: "private"
			},
			expectType: {
				"id": "number"
			},
			remember: {
				"id": "STF2id"
			},
		},
		
		userSubscribeToSTF: {
			url: "shares/incoming/$adminCreateSTF.STF1id$",
			verb: "PUT",
			expectType: {
				"ok": "boolean"
			},
			expect: {
				"ok": true,
			},
			params: {
				cstoken: "$regUserAuth2.cookie$",
				username: "test2",
				accepted: true
			}
		},
		
		uninvitedUserSubscribeToPrivateSTF: {
			url: "shares/incoming/$adminCreatePrivateSTF.STF2id$",
			verb: "PUT",
			expectType: {
				"ok": "boolean"
			},
			expect: {
				"ok": false,
			},
			params: {
				cstoken: "$regUserAuth2.cookie$",
				username: "test2",
				accepted: true
			}
		},
		
		AddUserReadWriteAsAdmin: {
			url: "approots/$adminCreateSTFR.STFRid$/children/$adminCreatePrivateSTF.STF2id$/users/test2",
			verb: "PUT",
			params: {
				cstoken: "$adminAuth.cookie$",
				isReadOnly: false,
			},
		},
		
		userSubscribeToPrivateSTF: {
			url: "shares/incoming/$adminCreatePrivateSTF.STF2id$",
			verb: "PUT",
			expectType: {
				"ok": "boolean"
			},
			expect: {
				"ok": true,
			},
			params: {
				cstoken: "$regUserAuth2.cookie$",
				username: "test2",
				accepted: true
			}
		},
		
		eventLogForTest2: {
			url: "notifications",
			verb: "GET",
			params: {
				cstoken: "$regUserAuth2.cookie$",
				token: "$regUserAuth2.token$",
				clientID: "$regUserAuth2.clientID$",
				since: "$initialState.lastEvent$"
			},
			expectType: {
				"ok": "boolean",
				"events": "object" 
			},
			expect: {
				"ok": true,
				"events.length": 2,
				"events[0].subtype": "foldercreated",
				"events[0].id": "$adminCreateSTF.STF1id$",
				"events[0].isSubscribed": true,
				"events[0].isReadOnly": true,
				"events[1].subtype": "foldercreated",
				"events[1].id": "$adminCreatePrivateSTF.STF2id$",
				"events[1].isSubscribed": true,
				"events[1].isReadOnly": false
			}
		}	
	},

	SetPublicSTF: {
		adminAuth: {
			url: "auth",
			verb: 'POST',
			dataType: "html",
			params: {
				username: "Admin",
				password: "livelink",
				admin: true
				},
			remember: {
				content: "cookie"
			},
		},
				
		regUserAuth1: {
			libraryStep : lib.auth,
			variables : { userName : "test1" }
		},
		
		regUserAuth2: {
			libraryStep : lib.auth,
			variables : { userName : "test2" }
		},
		
		regUserAuth3: {
			libraryStep : lib.auth,
			variables : { userName : "test3" }
		},
				
		adminCreateSTFR: {
			url: "approots",
			verb: "POST",
			params: {
				cstoken: "$adminAuth.cookie$",
				name: "STFRoot1"
			},
			expectType: {
				"id": "number"
			},
			remember: {
				"id": "STFRid"
			},
		},
		adminCreateSTF: {
			url: "approots/$adminCreateSTFR.STFRid$/children",
			verb: "POST",
			params: {
				cstoken: "$adminAuth.cookie$",
				name: "STF1",
				username: "test1",
				type: "private"
			},
			expectType: {
				"id": "number"
			},
			remember: {
				"id": "STF1id"
			},
		},
		
		//Update a private STF to be a public, ReadOnly STF
		getObjectInfo1: {
			url: "nodes/$adminCreateSTF.STF1id$",
			verb: "GET",
			params: {
				"cstoken": "$regUserAuth2.cookie$"
			},
			expectType: {
				"ok": "boolean"
			},
			expect: {
				"ok": false,
			},
		},
		UpdateSTFPrivToPubRO: {
			url: "approots/$adminCreateSTFR.STFRid$/children/$adminCreateSTF.STF1id$",
			verb: "PUT",
			params: {
				cstoken: "$adminAuth.cookie$",
				type: "public"
			},
		},
		
		getObjectInfo2: {
			url: "nodes/$adminCreateSTF.STF1id$",
			verb: "GET",
			params: {
				"cstoken": "$regUserAuth2.cookie$"
			},
			expectType: {
				"ok": "boolean"
			},
			expect: {
				"ok": true,
			},
		},
		createNode1: {
			libraryStep: lib.createFolder,
			variables: {
				"parentID": "$adminCreateSTF.STF1id$",
				"name": "Folder1",
				"cstoken": "$regUserAuth1.cookie$"
			},
		},
		
		rename1 : {
			url : "nodes/$createNode1.id$",
			verb : "PUT",
			params : { 
				name : "Folder1 renamed",
				cstoken : "$regUserAuth2.cookie$" 
			},
			expectType : { 
				"ok" : "boolean" 
			},
			expect : { ok : false,
			},
		},
				
		//Update a Public R/O STF to be a public R/W STF
		UpdateSTFPubROToPubRW: {
			url: "approots/$adminCreateSTFR.STFRid$/children/$adminCreateSTF.STF1id$",
			verb: "PUT",
			params: {
				cstoken: "$adminAuth.cookie$",
				type: "public",
				isReadOnly: false,
			},
		},
		
		getObjectInfo3: {
			url: "nodes/$adminCreateSTF.STF1id$",
			verb: "GET",
			params: {
				"cstoken": "$regUserAuth2.cookie$"
			},
			expectType: {
				"ok": "boolean"
			},
			expect: {
				"ok": true,
			},
		},
		
		rename2 : {
			url : "nodes/$createNode1.id$",
			verb : "PUT",
			params : { 
				name : "Folder1 renamed",
				cstoken : "$regUserAuth2.cookie$" 
			},
			expectType : { 
				"ok" : "boolean" 
			},
			expect : { ok : true,
			},
		},
		
		//Update a private STF to be a public, ReadWrite STF
		adminCreateSTF2: {
			url: "approots/$adminCreateSTFR.STFRid$/children",
			verb: "POST",
			params: {
				cstoken: "$adminAuth.cookie$",
				name: "STF2",
				username: "test1",
				type: "private"
			},
			expectType: {
				"id": "number"
			},
			remember: {
				"id": "STF2id"
			},
		},
		
		getObjectInfo4: {
			url: "nodes/$adminCreateSTF2.STF2id$",
			verb: "GET",
			params: {
				"cstoken": "$regUserAuth2.cookie$"
			},
			expectType: {
				"ok": "boolean"
			},
			expect: {
				"ok": false,
			},
		},
		UpdateSTFPrivToPubRW: {
			url: "approots/$adminCreateSTFR.STFRid$/children/$adminCreateSTF2.STF2id$",
			verb: "PUT",
			params: {
				cstoken: "$adminAuth.cookie$",
				type: "public",
				isReadOnly: false,
			},
		},
		
		getObjectInfo5: {
			url: "nodes/$adminCreateSTF2.STF2id$",
			verb: "GET",
			params: {
				"cstoken": "$regUserAuth2.cookie$"
			},
			expectType: {
				"ok": "boolean"
			},
			expect: {
				"ok": true,
			},
		},
		createNode2: {
			libraryStep: lib.createFolder,
			variables: {
				"parentID": "$adminCreateSTF2.STF2id$",
				"name": "Folder2",
				"cstoken": "$regUserAuth1.cookie$"
			},
		},
		
		rename3 : {
			url : "nodes/$createNode2.id$",
			verb : "PUT",
			params : { 
				name : "Folder2 renamed",
				cstoken : "$regUserAuth2.cookie$" 
			},
			expectType : { 
				"ok" : "boolean" 
			},
			expect : { ok : true,
			},
		},
				
		//Update a Public R/W STF to be a public R/O STF
		UpdateSTFPubRWToPubRO: {
			url: "approots/$adminCreateSTFR.STFRid$/children/$adminCreateSTF2.STF2id$",
			verb: "PUT",
			params: {
				cstoken: "$adminAuth.cookie$",
				type: "public",
				isReadOnly: true,
			},
		},
		
		getObjectInfo6: {
			url: "nodes/$adminCreateSTF2.STF2id$",
			verb: "GET",
			params: {
				"cstoken": "$regUserAuth2.cookie$"
			},
			expectType: {
				"ok": "boolean"
			},
			expect: {
				"ok": true,
			},
		},
		
		rename4 : {
			url : "nodes/$createNode2.id$",
			verb : "PUT",
			params : { 
				name : "Folder1 renamed again",
				cstoken : "$regUserAuth2.cookie$" 
			},
			expectType : { 
				"ok" : "boolean" 
			},
			expect : { ok : false,
			},
		},
		
		//Run STF change API without providing the Type or the isReadOnly parameter
		
		adminCreateSTF3: {
			url: "approots/$adminCreateSTFR.STFRid$/children",
			verb: "POST",
			params: {
				cstoken: "$adminAuth.cookie$",
				name: "STF3",
				username: "test1",
				type: "private"
			},
			expectType: {
				"id": "number"
			},
			remember: {
				"id": "STF3id"
			},
		},
		
		getObjectInfo7: {
			url: "nodes/$adminCreateSTF3.STF3id$",
			verb: "GET",
			params: {
				"cstoken": "$regUserAuth2.cookie$"
			},
			expectType: {
				"ok": "boolean"
			},
			expect: {
				"ok": false,
			},
		},
		
		//Entering no parameters will leave the STF as is
		UpdateSTFPrivToPubRONoParams: {
			url: "approots/$adminCreateSTFR.STFRid$/children/$adminCreateSTF3.STF3id$",
			verb: "PUT",
			params: {
				cstoken: "$adminAuth.cookie$",
			},
		},
		
		getObjectInfo8: {
			url: "nodes/$adminCreateSTF3.STF3id$",
			verb: "GET",
			params: {
				"cstoken": "$regUserAuth2.cookie$"
			},
			expectType: {
				"ok": "boolean"
			},
			expect: {
				"ok": false,
			},
		},
		
		//Entering only the Type parameter of Public with no isReadOnly param.  This will default to Public, ReadOnly
		UpdateSTFPrivToPubOnlyTypeParam: {
			url: "approots/$adminCreateSTFR.STFRid$/children/$adminCreateSTF3.STF3id$",
			verb: "PUT",
			params: {
				cstoken: "$adminAuth.cookie$",
				type: "public",
			},
		},
		
		createNode3: {
			libraryStep: lib.createFolder,
			variables: {
				"parentID": "$adminCreateSTF3.STF3id$",
				"name": "Folder3",
				"cstoken": "$regUserAuth1.cookie$"
			},
		},
		
		getObjectInfo9: {
			url: "nodes/$adminCreateSTF3.STF3id$",
			verb: "GET",
			params: {
				"cstoken": "$regUserAuth2.cookie$"
			},
			expectType: {
				"ok": "boolean"
			},
			expect: {
				"ok": true,
			},
		},
		
		rename5 : {
			url : "nodes/$createNode3.id$",
			verb : "PUT",
			params : { 
				name : "Folder3 renamed",
				cstoken : "$regUserAuth2.cookie$" 
			},
			expectType : { 
				"ok" : "boolean" 
			},
			expect : { ok : false,
			},
		},
		
		//Entering only the isReadOnly parameter or 'false' with no Type param.  This will leave STF as Public but change to Read Write
		UpdateSTFPrivToPubOnlyisReadOnlyParam: {
			url: "approots/$adminCreateSTFR.STFRid$/children/$adminCreateSTF3.STF3id$",
			verb: "PUT",
			params: {
				cstoken: "$adminAuth.cookie$",
				isReadOnly: false,
			},
		},
		
		rename6 : {
			url : "nodes/$createNode3.id$",
			verb : "PUT",
			params : { 
				name : "Folder3 renamed again",
				cstoken : "$regUserAuth2.cookie$" 
			},
			expectType : { 
				"ok" : "boolean" 
			},
			expect : { ok : true,
			},
		},
		
		//Entering an invalid STF id
		UpdateSTFInvalidSTFId: {
			url: "approots/$adminCreateSTFR.STFRid$/children/00000",
			verb: "PUT",
			expectError: 500,
			params: {
				cstoken: "$adminAuth.cookie$",
				type: "public",
				isReadOnly: true,
			},
		},
		
		//Using the cstoken of a non Admin user
		UpdateNonAdminUser: {
			url: "approots/$adminCreateSTFR.STFRid$/children/$adminCreateSTF3.STF3id$",
			verb: "PUT",
			expectError: 403,
			params: {
				cstoken: "$regUserAuth2.cookie$",
				type: "public",
				isReadOnly: true,
			}
		}
	},
		
	SetPrivateSTF: {
		adminAuth: {
			url: "auth",
			verb: 'POST',
			dataType: "html",
			params: {
				username: "Admin",
				password: "livelink",
				admin: true
				},
			remember: {
				content: "cookie"
			},
		},
				
		regUserAuth1: {
			libraryStep : lib.auth,
			variables : { userName : "test1" }
		},
		
		regUserAuth2: {
			libraryStep : lib.auth,
			variables : { userName : "test2" }
		},
		
		regUserAuth3: {
			libraryStep : lib.auth,
			variables : { userName : "test3" }
		},
				
		adminCreateSTFR: {
			url: "approots",
			verb: "POST",
			params: {
				cstoken: "$adminAuth.cookie$",
				name: "STFRoot1"
			},
			expectType: {
				"id": "number"
			},
			remember: {
				"id": "STFRid"
			},
		},
		
		//Update a public ReadOnly STF to be a private STF
		adminCreateSTF: {
			url: "approots/$adminCreateSTFR.STFRid$/children",
			verb: "POST",
			params: {
				cstoken: "$adminAuth.cookie$",
				name: "STF1",
				username: "test1",
				type: "public",
				isReadOnly: true,
			},
			expectType: {
				"id": "number"
			},
			remember: {
				"id": "STF1id"
			},
		},
		
		getObjectInfo1: {
			url: "nodes/$adminCreateSTF.STF1id$",
			verb: "GET",
			params: {
				"cstoken": "$regUserAuth2.cookie$"
			},
			expectType: {
				"ok": "boolean"
			},
			expect: {
				"ok": true,
			},
		},
		
		UpdateSTFPubROToPriv: {
			url: "approots/$adminCreateSTFR.STFRid$/children/$adminCreateSTF.STF1id$",
			verb: "PUT",
			params: {
				cstoken: "$adminAuth.cookie$",
				type: "private",
			},
		},
		
		getObjectInfo2: {
			url: "nodes/$adminCreateSTF.STF1id$",
			verb: "GET",
			params: {
				"cstoken": "$regUserAuth2.cookie$"
			},
			expectType: {
				"ok": "boolean"
			},
			expect: {
				"ok": false,
			},
		},
		
		//Update a public ReadWrite STF to be a private STF
		adminCreateSTF2: {
			url: "approots/$adminCreateSTFR.STFRid$/children",
			verb: "POST",
			params: {
				cstoken: "$adminAuth.cookie$",
				name: "STF2",
				username: "test1",
				type: "public",
				isReadOnly: true,
			},
			expectType: {
				"id": "number"
			},
			remember: {
				"id": "STF2id"
			},
		},
		
		getObjectInfo3: {
			url: "nodes/$adminCreateSTF2.STF2id$",
			verb: "GET",
			params: {
				"cstoken": "$regUserAuth2.cookie$"
			},
			expectType: {
				"ok": "boolean"
			},
			expect: {
				"ok": true,
			},
		},
		
		UpdateSTFPubRWToPriv: {
			url: "approots/$adminCreateSTFR.STFRid$/children/$adminCreateSTF2.STF2id$",
			verb: "PUT",
			params: {
				cstoken: "$adminAuth.cookie$",
				type: "private",
			},
		},
		
		getObjectInfo4: {
			url: "nodes/$adminCreateSTF2.STF2id$",
			verb: "GET",
			params: {
				"cstoken": "$regUserAuth2.cookie$"
			},
			expectType: {
				"ok": "boolean"
			},
			expect: {
				"ok": false,
			},
		},
		
		//Update a private STF to be a private STF
		adminCreateSTF3: {
			url: "approots/$adminCreateSTFR.STFRid$/children",
			verb: "POST",
			params: {
				cstoken: "$adminAuth.cookie$",
				name: "STF3",
				username: "test1",
				type: "private",
			},
			expectType: {
				"id": "number"
			},
			remember: {
				"id": "STF3id"
			},
		},
		
		getObjectInfo5: {
			url: "nodes/$adminCreateSTF3.STF3id$",
			verb: "GET",
			params: {
				"cstoken": "$regUserAuth2.cookie$"
			},
			expectType: {
				"ok": "boolean"
			},
			expect: {
				"ok": false,
			},
		},
		
		UpdateSTFPrivToPriv: {
			url: "approots/$adminCreateSTFR.STFRid$/children/$adminCreateSTF3.STF3id$",
			verb: "PUT",
			params: {
				cstoken: "$adminAuth.cookie$",
				type: "private",
			},
		},
		
		getObjectInfo6: {
			url: "nodes/$adminCreateSTF3.STF3id$",
			verb: "GET",
			params: {
				"cstoken": "$regUserAuth2.cookie$"
			},
			expectType: {
				"ok": "boolean"
			},
			expect: {
				"ok": false,
			},
		},
		
		//After adding a user to a public STF, make the STF private
		adminCreateSTF4: {
			url: "approots/$adminCreateSTFR.STFRid$/children",
			verb: "POST",
			params: {
				cstoken: "$adminAuth.cookie$",
				name: "STF4",
				username: "test1",
				type: "public"
			},
			expectType: {
				"id": "number"
			},
			remember: {
				"id": "STF4id"
			},
		},
		
		getObjectInfo7: {
			url: "nodes/$adminCreateSTF4.STF4id$",
			verb: "GET",
			params: {
				"cstoken": "$regUserAuth2.cookie$"
			},
			expectType: {
				"ok": "boolean"
			},
			expect: {
				"ok": true,
			},
		},
		
		AddUserToPublicSTF: {
			url: "approots/$adminCreateSTFR.STFRid$/children/$adminCreateSTF4.STF4id$/users/test2",
			verb: "PUT",
			params: {
				cstoken: "$adminAuth.cookie$",
				isReadOnly: false,
			},
		},
		
		getObjectInfo8: {
			url: "nodes/$adminCreateSTF4.STF4id$",
			verb: "GET",
			params: {
				"cstoken": "$regUserAuth2.cookie$"
			},
			expectType: {
				"ok": "boolean"
			},
			expect: {
				"ok": true,
			},
		},
		
		createNode1: {
			libraryStep: lib.createFolder,
			variables: {
				"parentID": "$adminCreateSTF4.STF4id$",
				"name": "Folder1",
				"cstoken": "$regUserAuth1.cookie$"
			},
		},
		
		renameNode1: {
			url: "nodes/$createNode1.id$",
			verb: "PUT",
			params: {
				"cstoken": "$regUserAuth2.cookie$",
				"name": "Folder1 renamed"
			},
			expectType: {
				"ok": "boolean"
			},
			expect: {
				"ok": true
			},
		},
		
		UpdateSTFPubRWToPriv2: {
			url: "approots/$adminCreateSTFR.STFRid$/children/$adminCreateSTF4.STF4id$",
			verb: "PUT",
			params: {
				cstoken: "$adminAuth.cookie$",
				type: "private",
			},
		},
		
		getObjectInfo9: {
			url: "nodes/$adminCreateSTF4.STF4id$",
			verb: "GET",
			params: {
				"cstoken": "$regUserAuth2.cookie$"
			},
			expectType: {
				"ok": "boolean"
			},
			expect: {
				"ok": true,
			},
		},
		
		renameNode2: {
			url: "nodes/$createNode1.id$",
			verb: "PUT",
			params: {
				"cstoken": "$regUserAuth2.cookie$",
				"name": "Folder1 renamed again"
			},
			expectType: {
				"ok": "boolean"
			},
			expect: {
				"ok": true
			},
		}
	},
	
	GetSubscriptionStatusForSTF: {
		adminAuth: {
			url: "auth",
			verb: 'POST',
			dataType: "html",
			params: {
				username: "Admin",
				password: "livelink",
				admin: true
				},
			remember: {
				content: "cookie"
			},
		},
				
		regUserAuth1: {
			libraryStep : lib.auth,
			variables : { userName : "test1" }
		},
		
		regUserAuth2: {
			libraryStep : lib.auth,
			variables : { userName : "test2" }
		},
		
		adminCreateSTFR: {
			url: "approots",
			verb: "POST",
			params: {
				cstoken: "$adminAuth.cookie$",
				name: "STFRoot32"
			},
			expectType: {
				"id": "number"
			},
			remember: {
				"id": "STFRid"
			}
		},
		
		adminCreatePublicSTF: {
			url: "approots/$adminCreateSTFR.STFRid$/children",
			verb: "POST",
			params: {
				cstoken: "$adminAuth.cookie$",
				name: "STF1",
				username: "test1"
			},
			expectType: {
				"id": "number"
			},
			remember: {
				"id": "STF1id"
			}
		},
		
		adminCreatePrivateSTF: {
			url: "approots/$adminCreateSTFR.STFRid$/children",
			verb: "POST",
			params: {
				cstoken: "$adminAuth.cookie$",
				name: "STF2",
				username: "test1",
				type: "private"
			},
			expectType: {
				"id": "number"
			},
			remember: {
				"id": "STF2id"
			},
		},
		
		adminCreatePublicSTFReadWrite: {
			url: "approots/$adminCreateSTFR.STFRid$/children",
			verb: "POST",
			params: {
				cstoken: "$adminAuth.cookie$",
				name: "STF3",
				username: "test1",
				isReadOnly: false
			},
			expectType: {
				"id": "number"
			},
			remember: {
				"id": "STF3id"
			},
		},
		
		getSubscriptionStatusBeforeSubscribingForPublicSTF: {
			url: "nodes/$adminCreatePublicSTF.STF1id$",
			verb: "GET",
			expectType : { contents : "object", count: "number" },
			expect : {
				count : 1,				
				"contents[0].isSubscribed" : false
			},
			params: {
				cstoken: "$regUserAuth2.cookie$"
			}
		},	
		
		userSubscribeToPublicSTF: {
			url: "shares/incoming/$adminCreatePublicSTF.STF1id$",
			verb: "PUT",
			expectType: {
				"ok": "boolean"
			},
			expect: {
				"ok": true,
			},
			params: {
				cstoken: "$regUserAuth2.cookie$",
				username: "test2",
				accepted: true
			}
		},
		
		getSubscriptionStatusForPublicSTF: {
			url: "nodes/$adminCreatePublicSTF.STF1id$",
			verb: "GET",
			expectType : { contents : "object", count: "number" },
			expect : {
				count : 1,
				"contents[0].name" : "STF1 (test1)",
				"contents[0].isReadOnly" : true,
				"contents[0].isSubscribed" : true
			},
			params: {
				cstoken: "$regUserAuth2.cookie$"
			}
		},	
		
		userSubscribeToPublicSTFReadWrite: {
			url: "shares/incoming/$adminCreatePublicSTFReadWrite.STF3id$",
			verb: "PUT",
			expectType: {
				"ok": "boolean"
			},
			expect: {
				"ok": true,
			},
			params: {
				cstoken: "$regUserAuth2.cookie$",
				username: "test2",
				accepted: true
			}
		},
		
		getSubscriptionStatusForPublicSTFReadWrite: {
			url: "nodes/$adminCreatePublicSTFReadWrite.STF3id$",
			verb: "GET",
			expectType : { contents : "object", count: "number" },
			expect : {
				count : 1,
				"contents[0].name" : "STF3 (test1)",
				"contents[0].isReadOnly" : false,
				"contents[0].isSubscribed" : true
			},
			params: {
				cstoken: "$regUserAuth2.cookie$"
			}
		},
		
		AddUserReadWriteAsAdminToPrivateSTF: {
			url: "approots/$adminCreateSTFR.STFRid$/children/$adminCreatePrivateSTF.STF2id$/users/test2",
			verb: "PUT",
			params: {
				cstoken: "$adminAuth.cookie$",
				isReadOnly: false,
			},
		},
		
		userSubscribeToPrivateSTF: {
			url: "shares/incoming/$adminCreatePrivateSTF.STF2id$",
			verb: "PUT",
			expectType: {
				"ok": "boolean"
			},
			expect: {
				"ok": true,
			},
			params: {
				cstoken: "$regUserAuth2.cookie$",
				username: "test2",
				accepted: true
			}
		},
		
		getSubscriptionStatusForPrivateSTF: {
			url: "nodes/$adminCreatePrivateSTF.STF2id$",
			verb: "GET",
			
			expectType : { contents : "object", count: "number" },
			expect : {
				count : 1,
				"contents[0].name" : "STF2 (test1)",
				"contents[0].isReadOnly" : false,
				"contents[0].isSubscribed" : true
			},
			
			params: {
				cstoken: "$regUserAuth2.cookie$"

			}
		}
	},
	
	DeleteSTF: {
		VERSIONS: ["v4"],
		adminAuth: {
			url: "auth",
			verb: 'POST',
			dataType: "html",
			params: {
				username: "Admin",
				password: "livelink",
				admin: true
			},
			remember: {
				content: "cookie"
			},
		},

		auth1: {
			libraryStep : lib.auth,
			variables : { userName : "test1" }
		},

		auth2: {
			libraryStep : lib.auth,
			variables : { userName : "test2" }
		},

		auth3: {
			libraryStep : lib.auth,
			variables : { userName : "test3" }
		},
		
		initialState: {
			libraryStep : lib.getSeqNo,
			variables : {
				cookie : "$auth1.cookie$",
				token : "$auth1.token$",
				clientID : "$auth1.clientID$"
			}
		},
		
		adminCreateSTFR: {
			url: "approots",
			verb: "POST",
			params: {
				cstoken: "$adminAuth.cookie$",
				name: "STFRoot1"
			},
			expectType: {
				"id": "number"
			},
			remember: {
				"id": "id"
			},
		},

		adminCreateSTF: {
			url: "approots/$adminCreateSTFR.id$/children",
			verb: "POST",
			params: {
				cstoken: "$adminAuth.cookie$",
				name: "STF1",
				username: "test1"
			},
			expectType: {
				"id": "number"
			},
			remember: {
				"id": "id"
			},
		},
		
		ownerSubscribe: {
			libraryStep: lib.accept,
			variables: {
				"id": "$adminCreateSTF.id$",
				"cstoken": "$auth1.cookie$"
			}
		},
		
		userSubscribe: {
			libraryStep: lib.accept,
			variables: {
				"id": "$adminCreateSTF.id$",
				"cstoken": "$auth2.cookie$"
			}
		},
		
		ownerAddFolder: {
			libraryStep: lib.createFolder,
			variables: {
				"parentID": "$adminCreateSTF.id$",
				"name": "f1",
				"cstoken": "$auth1.cookie$"
			}
		},
		
		ownerDeleteSTF: {
			url: "approots/$adminCreateSTFR.id$/children/$adminCreateSTF.id$",
			verb: "DELETE",
			params: {
				cstoken: "$auth1.cookie$"
			},
			expectError: 403
		},
		
		adminDeleteSTF: {
			url: "approots/$adminCreateSTFR.id$/children/$adminCreateSTF.id$",
			verb: "DELETE",
			params: {
				cstoken: "$adminAuth.cookie$"
			}
		},
		
		eventLog1: {
			url: "notifications",
			verb: "GET",
			params: {
				cstoken: "$auth1.cookie$",
				token: "$auth1.token$",
				clientID: "$auth1.clientID$",
				since: "$initialState.lastEvent$"
			},
			expectType: {
				"ok": "boolean",
				"events": "object"
			},
			expect: {
				"ok": true,
				"events.length": 6,
				"events[0].subtype": "foldercreated",
				"events[0].id": "$adminCreateSTF.id$",
				"events[0].name": "$adminCreateSTF.params.name$ (test1)",
				"events[0].parentID": "$auth1.rootFolder$",
				"events[0].isReadOnly": false,
				"events[1].subtype": "shareaccepted",
				"events[1].id": "$adminCreateSTF.id$",
				"events[1].toUser": "$auth1.userID$",
				"events[1].shareOwner": "$auth1.userID$",
				"events[2].subtype": "shareaccepted",
				"events[2].id": "$adminCreateSTF.id$",
				"events[2].toUser": "$auth2.userID$",
				"events[2].shareOwner": "$auth1.userID$",
				"events[3].subtype": "foldercreated",
				"events[3].id": "$ownerAddFolder.id$",
				"events[3].name": "$ownerAddFolder.params.name$",
				"events[3].parentID": "$adminCreateSTF.id$",
				"events[3].isReadOnly": false,
				"events[4].subtype": "delete",
				"events[4].id": "$adminCreateSTF.id$",
				"events[5].subtype": "delete",
				"events[5].id": "$ownerAddFolder.id$"
			}
		},
		
		eventLog2: {
			url: "notifications",
			verb: "GET",
			params: {
				cstoken: "$auth2.cookie$",
				token: "$auth2.token$",
				clientID: "$auth2.clientID$",
				since: "$initialState.lastEvent$"
			},
			expectType: {
				"ok": "boolean",
				"events": "object"
			},
			expect: {
				"ok": true,
				"events.length": 4,
				"events[0].subtype": "foldercreated",
				"events[0].id": "$adminCreateSTF.id$",
				"events[0].name": "$adminCreateSTF.params.name$ (test1)",
				"events[0].parentID": "$auth2.rootFolder$",
				"events[0].isReadOnly": true,
				"events[1].subtype": "foldercreated",
				"events[1].id": "$ownerAddFolder.id$",
				"events[1].name": "$ownerAddFolder.params.name$",
				"events[1].parentID": "$adminCreateSTF.id$",
				"events[1].isReadOnly": true,
				"events[2].subtype": "delete",
				"events[2].id": "$adminCreateSTF.id$",
				"events[3].subtype": "delete",
				"events[3].id": "$ownerAddFolder.id$"
			}
		},
		
		eventLog3: {
			url: "notifications",
			verb: "GET",
			params: {
				cstoken: "$auth3.cookie$",
				token: "$auth3.token$",
				clientID: "$auth3.clientID$",
				since: "$initialState.lastEvent$",
				eventLog: true
			},
			expectType: {
				"ok": "boolean",
				"events": "object"
			},
			expect: {
				"ok": true,
				"events.length": 0
			}
		}
	},
	
	DeleteSTFR: {
		VERSIONS: ["v4"],
		adminAuth: {
			url: "auth",
			verb: 'POST',
			dataType: "html",
			params: {
				username: "Admin",
				password: "livelink",
				admin: true
			},
			remember: {
				content: "cookie"
			},
		},

		auth1: {
			libraryStep : lib.auth,
			variables : { userName : "test1" }
		},

		auth2: {
			libraryStep : lib.auth,
			variables : { userName : "test2" }
		},

		auth3: {
			libraryStep : lib.auth,
			variables : { userName : "test3" }
		},
		
		initialState: {
			libraryStep : lib.getSeqNo,
			variables : {
				cookie : "$auth1.cookie$",
				token : "$auth1.token$",
				clientID : "$auth1.clientID$"
			}
		},
		
		adminCreateSTFR: {
			url: "approots",
			verb: "POST",
			params: {
				cstoken: "$adminAuth.cookie$",
				name: "STFRoot1"
			},
			expectType: {
				"id": "number"
			},
			remember: {
				"id": "id"
			},
		},

		adminCreateSTF: {
			url: "approots/$adminCreateSTFR.id$/children",
			verb: "POST",
			params: {
				cstoken: "$adminAuth.cookie$",
				name: "STF1",
				username: "test1"
			},
			expectType: {
				"id": "number"
			},
			remember: {
				"id": "id"
			},
		},
		
		ownerSubscribe: {
			libraryStep: lib.accept,
			variables: {
				"id": "$adminCreateSTF.id$",
				"cstoken": "$auth1.cookie$"
			}
		},
		
		userSubscribe: {
			libraryStep: lib.accept,
			variables: {
				"id": "$adminCreateSTF.id$",
				"cstoken": "$auth2.cookie$"
			}
		},
		
		ownerAddFolder: {
			libraryStep: lib.createFolder,
			variables: {
				"parentID": "$adminCreateSTF.id$",
				"name": "f1",
				"cstoken": "$auth1.cookie$"
			}
		},
		
		userDeleteSTFR: {
			url: "nodes/$adminCreateSTFR.id$",
			verb: "DELETE",
			params: {
				cstoken: "$auth1.cookie$"
			},
			expectType: {
				"ok": "boolean"
			},
			expect: {
				"ok": false
			}
		},
		
		adminDeleteSTFR: {
			url: "approots/$adminCreateSTFR.id$",
			verb: "DELETE",
			params: {
				cstoken: "$adminAuth.cookie$"
			}
		},
		
		eventLog1: {
			url: "notifications",
			verb: "GET",
			params: {
				cstoken: "$auth1.cookie$",
				token: "$auth1.token$",
				clientID: "$auth1.clientID$",
				since: "$initialState.lastEvent$"
			},
			expectType: {
				"ok": "boolean",
				"events": "object"
			},
			expect: {
				"ok": true,
				"events.length": 6,
				"events[0].subtype": "foldercreated",
				"events[0].id": "$adminCreateSTF.id$",
				"events[0].name": "$adminCreateSTF.params.name$ (test1)",
				"events[0].parentID": "$auth1.rootFolder$",
				"events[0].isReadOnly": false,
				"events[1].subtype": "shareaccepted",
				"events[1].id": "$adminCreateSTF.id$",
				"events[1].toUser": "$auth1.userID$",
				"events[1].shareOwner": "$auth1.userID$",
				"events[2].subtype": "shareaccepted",
				"events[2].id": "$adminCreateSTF.id$",
				"events[2].toUser": "$auth2.userID$",
				"events[2].shareOwner": "$auth1.userID$",
				"events[3].subtype": "foldercreated",
				"events[3].id": "$ownerAddFolder.id$",
				"events[3].name": "$ownerAddFolder.params.name$",
				"events[3].parentID": "$adminCreateSTF.id$",
				"events[3].isReadOnly": false,
				"events[4].subtype": "delete",
				"events[4].id": "$adminCreateSTF.id$",
				"events[5].subtype": "delete",
				"events[5].id": "$ownerAddFolder.id$"
			}
		},
		
		eventLog2: {
			url: "notifications",
			verb: "GET",
			params: {
				cstoken: "$auth2.cookie$",
				token: "$auth2.token$",
				clientID: "$auth2.clientID$",
				since: "$initialState.lastEvent$"
			},
			expectType: {
				"ok": "boolean",
				"events": "object"
			},
			expect: {
				"ok": true,
				"events.length": 4,
				"events[0].subtype": "foldercreated",
				"events[0].id": "$adminCreateSTF.id$",
				"events[0].name": "$adminCreateSTF.params.name$ (test1)",
				"events[0].parentID": "$auth2.rootFolder$",
				"events[0].isReadOnly": true,
				"events[1].subtype": "foldercreated",
				"events[1].id": "$ownerAddFolder.id$",
				"events[1].name": "$ownerAddFolder.params.name$",
				"events[1].parentID": "$adminCreateSTF.id$",
				"events[1].isReadOnly": true,
				"events[2].subtype": "delete",
				"events[2].id": "$adminCreateSTF.id$",
				"events[3].subtype": "delete",
				"events[3].id": "$ownerAddFolder.id$"
			}
		},
		
		eventLog3: {
			url: "notifications",
			verb: "GET",
			params: {
				cstoken: "$auth3.cookie$",
				token: "$auth3.token$",
				clientID: "$auth3.clientID$",
				since: "$initialState.lastEvent$",
				eventLog: true
			},
			expectType: {
				"ok": "boolean",
				"events": "object"
			},
			expect: {
				"ok": true,
				"events.length": 0
			}
		}
	},
	
	RenameSTFR: {
		VERSIONS: ["v4"],
		adminAuth: {
			url: "auth",
			verb: 'POST',
			dataType: "html",
			params: {
				username: "Admin",
				password: "livelink",
				admin: true
			},
			remember: {
				content: "cookie"
			},
		},

		auth1: {
			libraryStep : lib.auth,
			variables : { userName : "test1" }
		},

		auth2: {
			libraryStep : lib.auth,
			variables : { userName : "test2" }
		},
		
		adminCreateSTFR: {
			url: "approots",
			verb: "POST",
			params: {
				cstoken: "$adminAuth.cookie$",
				name: "STFRoot1"
			},
			expectType: {
				"id": "number"
			},
			remember: {
				"id": "id"
			},
		},

		adminCreateSTF: {
			url: "approots/$adminCreateSTFR.id$/children",
			verb: "POST",
			params: {
				cstoken: "$adminAuth.cookie$",
				name: "STF1",
				username: "test1"
			},
			expectType: {
				"id": "number"
			},
			remember: {
				"id": "id"
			},
		},
		
		ownerSubscribe: {
			libraryStep: lib.accept,
			variables: {
				"id": "$adminCreateSTF.id$",
				"cstoken": "$auth1.cookie$"
			}
		},
		
		userSubscribe: {
			libraryStep: lib.accept,
			variables: {
				"id": "$adminCreateSTF.id$",
				"cstoken": "$auth2.cookie$"
			}
		},
		
		ownerAddFolder: {
			libraryStep: lib.createFolder,
			variables: {
				"parentID": "$adminCreateSTF.id$",
				"name": "f1",
				"cstoken": "$auth1.cookie$"
			}
		},
		
		userRenameSTFRNode: {
			url: "nodes/$adminCreateSTFR.id$",
			verb: "PUT",
			params: {
				"name": "STFRoot1-r",
				"cstoken": "$auth1.cookie$"
			},
			expectType: {
				"ok": "boolean"
			},
			expect: {
				"ok": false
			}
		},
		
		userRenameSTFR: {
			url: "approots/$adminCreateSTFR.id$",
			verb: "PUT",
			params: {
				cstoken: "$auth1.cookie$",
				name: "STFRoot1-r"
			},
			expectError: 403
		},
		
		adminRenameSTFR: {
			url: "approots/$adminCreateSTFR.id$",
			verb: "PUT",
			params: {
				cstoken: "$adminAuth.cookie$",
				name: "STFRoot1-r"
			}
		},
		
		getObjectInfo: {
			url: "nodes/$adminCreateSTFR.id$",
			verb: "GET",
			params: {
				cstoken: "$auth1.cookie$"
			},
			expectType: {
				"ok": "boolean",
				"contents": "object",
				"contents[0].name": "string",
				"count": "number"
			},
			expect: {
				"ok": true,
				"contents[0].name": "$adminRenameSTFR.params.name$",
				"count": 1
			}
		}
	},
	
	RenameSTF: {
		VERSIONS: ["v4"],
		adminAuth: {
			url: "auth",
			verb: 'POST',
			dataType: "html",
			params: {
				username: "Admin",
				password: "livelink",
				admin: true
			},
			remember: {
				content: "cookie"
			},
		},

		auth1: {
			libraryStep : lib.auth,
			variables : { userName : "test1" }
		},

		auth2: {
			libraryStep : lib.auth,
			variables : { userName : "test2" }
		},
		
		auth3: {
			libraryStep : lib.auth,
			variables : { userName : "test3" }
		},
		
		adminCreateSTFR: {
			url: "approots",
			verb: "POST",
			params: {
				cstoken: "$adminAuth.cookie$",
				name: "STFRoot1"
			},
			expectType: {
				"id": "number"
			},
			remember: {
				"id": "id"
			},
		},

		adminCreateSTF: {
			url: "approots/$adminCreateSTFR.id$/children",
			verb: "POST",
			params: {
				cstoken: "$adminAuth.cookie$",
				name: "STF1",
				username: "test1"
			},
			expectType: {
				"id": "number"
			},
			remember: {
				"id": "id"
			},
		},
		
		ownerSubscribe: {
			libraryStep: lib.accept,
			variables: {
				"id": "$adminCreateSTF.id$",
				"cstoken": "$auth1.cookie$"
			}
		},
		
		userSubscribe: {
			libraryStep: lib.accept,
			variables: {
				"id": "$adminCreateSTF.id$",
				"cstoken": "$auth2.cookie$"
			}
		},
		
		ownerAddFolder: {
			libraryStep: lib.createFolder,
			variables: {
				"parentID": "$adminCreateSTF.id$",
				"name": "f1",
				"cstoken": "$auth1.cookie$"
			}
		},
		
		AdminUserRenameSTFNode: {
			url: "nodes/$adminCreateSTFR.id$/children/$adminCreateSTF.id$",
			verb: "PUT",
			expectError: 404,
			params: {
				"name": "STF1 rename",
				"cstoken": "$adminAuth.cookie$"
			},
		},
		
		nonSubUserRenameSTF: {
			url: "approots/$adminCreateSTFR.id$/children/$adminCreateSTF.id$",
			verb: "PUT",
			params: {
				cstoken: "$auth3.cookie$",
				name: "STF1 rename 2"
			},
			expectError: 403
		},
		
		adminRenameSTF: {
			url: "approots/$adminCreateSTFR.id$/children/$adminCreateSTF.id$",
			verb: "PUT",
			params: {
				cstoken: "$adminAuth.cookie$",
				name: "STF1 rename 3"
			}
		},
		
		ownerRenameSTF: {
			url: "approots/$adminCreateSTFR.id$/children/$adminCreateSTF.id$",
			verb: "PUT",
			params: {
				cstoken: "$auth1.cookie$",
				name: "STF1 rename 4"
			},
			expectError: 403
		},
		
		subUserRenameSTF: {
			url: "approots/$adminCreateSTFR.id$/children/$adminCreateSTF.id$",
			verb: "PUT",
			params: {
				cstoken: "$auth2.cookie$",
				name: "STF1 rename 5"
			},
			expectError: 403
		},
		
		getObjectInfo: {
			url: "nodes/$adminCreateSTF.id$",
			verb: "GET",
			params: {
				cstoken: "$auth1.cookie$"
			},
			expectType: {
				"ok": "boolean",
				"contents": "object",
				"contents[0].name": "string",
				"count": "number"
			},
			expect: {
				"ok": true,
				"contents[0].name": "STF1 rename 3 (test1)",
				"count": 1
			}
		}
	},
	
	SetPrivateSTFUnsubscribes: {
		VERSIONS: ["v4"],
		adminAuth: {
			url: "auth",
			verb: 'POST',
			dataType: "html",
			params: {
				username: "Admin",
				password: "livelink",
				admin: true
			},
			remember: {
				content: "cookie"
			},
		},

		auth1: {
			libraryStep : lib.auth,
			variables : { userName : "test1" }
		},

		auth2: {
			libraryStep : lib.auth,
			variables : { userName : "test2" }
		},
		
		initialState: {
			libraryStep : lib.getSeqNo,
			variables : {
				cookie : "$auth1.cookie$",
				token : "$auth1.token$",
				clientID : "$auth1.clientID$"
			}
		},
		
		adminCreateSTFR: {
			url: "approots",
			verb: "POST",
			params: {
				cstoken: "$adminAuth.cookie$",
				name: "STFRoot1"
			},
			expectType: {
				"id": "number"
			},
			remember: {
				"id": "id"
			},
		},

		adminCreateSTF: {
			url: "approots/$adminCreateSTFR.id$/children",
			verb: "POST",
			params: {
				cstoken: "$adminAuth.cookie$",
				name: "STF1",
				username: "test1"
			},
			expectType: {
				"id": "number"
			},
			remember: {
				"id": "id"
			},
		},
		
		ownerSubscribe: {
			libraryStep: lib.accept,
			variables: {
				"id": "$adminCreateSTF.id$",
				"cstoken": "$auth1.cookie$"
			}
		},
		
		userSubscribe: {
			libraryStep: lib.accept,
			variables: {
				"id": "$adminCreateSTF.id$",
				"cstoken": "$auth2.cookie$"
			}
		},
		
		//this step should remove test2 from the share, as the see perms will be gone
		// after this, the share should appear in test1's root browse, but not test2's,
		// and test1 but not test2 should receive events for it
		makePrivate: {
			url: "approots/$adminCreateSTFR.id$/children/$adminCreateSTF.id$",
			verb: "PUT",
			params: {
				type: "private",
				cstoken: "$adminAuth.cookie$"
			}
		},
		
		ownerAddFolder: {
			libraryStep: lib.createFolder,
			variables: {
				"parentID": "$adminCreateSTF.id$",
				"name": "f1",
				"cstoken": "$auth1.cookie$"
			}
		},
		
		getContents1: {
			url: "nodes/$auth1.rootFolder$/children",
			verb: "GET",
			params: {
				cstoken: "$auth1.cookie$"
			},
			expectType : { ok : "boolean", contents : "object", count: "number" },
			expect : {
				ok : true,
				count: 1
			}
		},
		
		getContents2: {
			url: "nodes/$auth2.rootFolder$/children",
			verb: "GET",
			params: {
				cstoken: "$auth2.cookie$"
			},
			expectType : { ok : "boolean", contents : "object", count: "number" },
			expect : {
				ok : true,
				count: 0
			}
		},
		
		eventLog1: {
			url: "notifications",
			verb: "GET",
			params: {
				cstoken: "$auth1.cookie$",
				token: "$auth1.token$",
				clientID: "$auth1.clientID$",
				since: "$initialState.lastEvent$"
			},
			expectType: {
				"ok": "boolean",
				"events": "object"
			},
			expect: {
				"ok": true,
				"events.length": 5,
				"events[0].subtype": "foldercreated",
				"events[1].subtype": "shareaccepted",
				"events[2].subtype": "shareaccepted",
				"events[3].subtype": "sharerejected",
				"events[3].toUser": "$auth2.userID$",
				"events[3].id": "$adminCreateSTF.id$",
				"events[4].subtype": "foldercreated",
				"events[4].id": "$ownerAddFolder.id$",
				"events[4].name": "$ownerAddFolder.params.name$",
				"events[4].parentID": "$adminCreateSTF.id$",
				"events[4].isReadOnly": false
			}
		},
		
		eventLog2: {
			url: "notifications",
			verb: "GET",
			params: {
				cstoken: "$auth2.cookie$",
				token: "$auth2.token$",
				clientID: "$auth2.clientID$",
				since: "$initialState.lastEvent$"
			},
			expectType: {
				"ok": "boolean",
				"events": "object"
			},
			expect: {
				"ok": true,
				"events.length": 2,
				"events[0].subtype": "foldercreated",
				"events[1].subtype": "delete",
				"events[1].id": "$adminCreateSTF.id$"
			}
		}
	},
	
	RemoveUserFromSTFUnsubscribes: {
		VERSIONS: ["v4"],
		adminAuth: {
			url: "auth",
			verb: 'POST',
			dataType: "html",
			params: {
				username: "Admin",
				password: "livelink",
				admin: true
			},
			remember: {
				content: "cookie"
			},
		},

		auth1: {
			libraryStep : lib.auth,
			variables : { userName : "test1" }
		},

		auth2: {
			libraryStep : lib.auth,
			variables : { userName : "test2" }
		},
		
		initialState: {
			libraryStep : lib.getSeqNo,
			variables : {
				cookie : "$auth1.cookie$",
				token : "$auth1.token$",
				clientID : "$auth1.clientID$"
			}
		},
		
		adminCreateSTFR: {
			url: "approots",
			verb: "POST",
			params: {
				cstoken: "$adminAuth.cookie$",
				name: "STFRoot1"
			},
			expectType: {
				"id": "number"
			},
			remember: {
				"id": "id"
			},
		},

		adminCreateSTF: {
			url: "approots/$adminCreateSTFR.id$/children",
			verb: "POST",
			params: {
				cstoken: "$adminAuth.cookie$",
				name: "STF1",
				username: "test1",
				type: "private"
			},
			expectType: {
				"id": "number"
			},
			remember: {
				"id": "id"
			},
		},
		
		ownerSubscribe: {
			libraryStep: lib.accept,
			variables: {
				"id": "$adminCreateSTF.id$",
				"cstoken": "$auth1.cookie$"
			}
		},
		
		addUser: {
			url: "approots/$adminCreateSTFR.id$/children/$adminCreateSTF.id$/users/test2",
			verb: "PUT",
			params: {
				cstoken: "$adminAuth.cookie$",
				isReadOnly: false
			}
		},
		
		userSubscribe: {
			libraryStep: lib.accept,
			variables: {
				"id": "$adminCreateSTF.id$",
				"cstoken": "$auth2.cookie$"
			}
		},
		
		getObjectInfo: {
			url: "nodes/$adminCreateSTF.id$",
			verb: "GET",
			params: {
				cstoken: "$auth1.cookie$"
			}
		},
		
		ownerAddFolder1: {
			libraryStep: lib.createFolder,
			variables: {
				"parentID": "$adminCreateSTF.id$",
				"name": "f1",
				"cstoken": "$auth1.cookie$"
			}
		},
		
		userAddFolder: {
			libraryStep: lib.createFolder,
			variables: {
				"parentID": "$adminCreateSTF.id$",
				"name": "testing",
				"cstoken": "$auth2.cookie$"
			}
		},
		
		getContents1: {
			url: "nodes/$auth1.rootFolder$/children",
			verb: "GET",
			params: {
				cstoken: "$auth1.cookie$"
			},
			expectType : { ok : "boolean", contents : "object", count: "number" },
			expect : {
				ok : true,
				count: 1
			}
		},
		
		getContents2: {
			url: "nodes/$adminCreateSTF.id$/children",
			verb: "GET",
			params: {
				cstoken: "$auth1.cookie$"
			},
			expectType : { ok : "boolean", contents : "object", count: "number" },
			expect : {
				ok : true,
				count: 2
			}
		},
		
		//this step should remove test2 from the share, as the see perms will be gone
		// after this, the share should appear in test1's root browse, but not test2's,
		// and test1 but not test2 should receive events for it
		removeUser: {
			url: "approots/$adminCreateSTFR.id$/children/$adminCreateSTF.id$/users/test2",
			verb: "DELETE",
			params: {
				cstoken: "$adminAuth.cookie$"
			}
		},
		
		ownerAddFolder2: {
			libraryStep: lib.createFolder,
			variables: {
				"parentID": "$adminCreateSTF.id$",
				"name": "f2",
				"cstoken": "$auth1.cookie$"
			}
		},
		
		getContents3: {
			url: "nodes/$auth1.rootFolder$/children",
			verb: "GET",
			params: {
				cstoken: "$auth1.cookie$"
			},
			expectType : { ok : "boolean", contents : "object", count: "number" },
			expect : {
				ok : true,
				count: 1
			}
		},
		
		getContents4: {
			url: "nodes/$adminCreateSTF.id$/children",
			verb: "GET",
			params: {
				cstoken: "$auth1.cookie$"
			},
			expectType : { ok : "boolean", contents : "object", count: "number" },
			expect : {
				ok : true,
				count: 3
			}
		},
		
		getContents5: {
			url: "nodes/$auth2.rootFolder$/children",
			verb: "GET",
			params: {
				cstoken: "$auth2.cookie$"
			},
			expectType : { ok : "boolean", contents : "object", count: "number" },
			expect : {
				ok : true,
				count: 0
			}
		},
		
		getContents6: {
			url: "nodes/$adminCreateSTF.id$/children",
			verb: "GET",
			params: {
				cstoken: "$auth2.cookie$"
			},
			expectType : { ok : "boolean", contents : "object", count: "number" },
			expect : {
				ok : false
			}
		},
		
		eventLog1: {
			url: "notifications",
			verb: "GET",
			params: {
				cstoken: "$auth1.cookie$",
				token: "$auth1.token$",
				clientID: "$auth1.clientID$",
				since: "$initialState.lastEvent$"
			},
			expectType: {
				"ok": "boolean",
				"events": "object"
			},
			expect: {
				"ok": true,
				"events.length": 7,
				"events[0].subtype": "foldercreated",
				"events[1].subtype": "shareaccepted",
				"events[2].subtype": "shareaccepted",
				"events[3].subtype": "foldercreated",
				"events[4].subtype": "foldercreated",
				"events[5].subtype": "sharerejected",
				"events[6].subtype": "foldercreated",
				"events[6].id": "$ownerAddFolder2.id$",
				"events[6].name": "$ownerAddFolder2.params.name$",
				"events[6].parentID": "$adminCreateSTF.id$",
				"events[6].isReadOnly": false
			}
		},
		
		eventLog2: {
			url: "notifications",
			verb: "GET",
			params: {
				cstoken: "$auth2.cookie$",
				token: "$auth2.token$",
				clientID: "$auth2.clientID$",
				since: "$initialState.lastEvent$"
			},
			expectType: {
				"ok": "boolean",
				"events": "object"
			},
			expect: {
				"ok": true,
				"events.length": 4,
				"events[0].subtype": "foldercreated",
				"events[1].subtype": "foldercreated",
				"events[2].subtype": "foldercreated",
				"events[3].subtype": "delete",
				"events[3].id": "$adminCreateSTF.id$"
			}
		}
	},
	
	ChangeSystemShareSendsShareChangeEvent: {
		VERSIONS: ["v4"],
		adminAuth: {
			url: "auth",
			verb: 'POST',
			dataType: "html",
			params: {
				username: "Admin",
				password: "livelink",
				admin: true
			},
			remember: {
				content: "cookie"
			},
		},

		auth1: {
			libraryStep : lib.auth,
			variables : { userName : "test1" }
		},

		auth2: {
			libraryStep : lib.auth,
			variables : { userName : "test2" }
		},
		
		auth3: {
			libraryStep : lib.auth,
			variables : { userName : "test3" }
		},
		
		initialState: {
			libraryStep : lib.getSeqNo,
			variables : {
				cookie : "$auth1.cookie$",
				token : "$auth1.token$",
				clientID : "$auth1.clientID$"
			}
		},
		
		adminCreateSTFR: {
			url: "approots",
			verb: "POST",
			params: {
				cstoken: "$adminAuth.cookie$",
				name: "STFRoot1"
			},
			expectType: {
				"id": "number"
			},
			remember: {
				"id": "id"
			},
		},

		adminCreateSTF: {
			url: "approots/$adminCreateSTFR.id$/children",
			verb: "POST",
			params: {
				cstoken: "$adminAuth.cookie$",
				name: "STF1",
				username: "test1",
				type: "public",
				isReadOnly: false
			},
			expectType: {
				"id": "number"
			},
			remember: {
				"id": "id"
			},
		},
		
		ownerSubscribe: {
			libraryStep: lib.accept,
			variables: {
				"id": "$adminCreateSTF.id$",
				"cstoken": "$auth1.cookie$"
			}
		},
		
		addROUser: {
			url: "approots/$adminCreateSTFR.id$/children/$adminCreateSTF.id$/users/test2",
			verb: "PUT",
			params: {
				cstoken: "$adminAuth.cookie$",
				isReadOnly: true
			}
		},
		
		addRWUser: {
			url: "approots/$adminCreateSTFR.id$/children/$adminCreateSTF.id$/users/test3",
			verb: "PUT",
			params: {
				cstoken: "$adminAuth.cookie$",
				isReadOnly: false
			}
		},
		
		roUserSubscribe: {
			libraryStep: lib.accept,
			variables: {
				"id": "$adminCreateSTF.id$",
				"cstoken": "$auth2.cookie$"
			}
		},
		
		rwUserSubscribe: {
			libraryStep: lib.accept,
			variables: {
				"id": "$adminCreateSTF.id$",
				"cstoken": "$auth3.cookie$"
			}
		},
		
		// These steps should make the share read-only for test2 and test3, so they should both
		// receive a share changed event
		makePrivate: {
			url: "approots/$adminCreateSTFR.id$/children/$adminCreateSTF.id$",
			verb: "PUT",
			params: {
				type: "private",
				cstoken: "$adminAuth.cookie$"
			}
		},	
		
		changeUserToRO: {
			url: "approots/$adminCreateSTFR.id$/children/$adminCreateSTF.id$/users/test3",
			verb: "PUT",
			params: {
				cstoken: "$adminAuth.cookie$",
				isReadOnly: true
			}
		},
		
		// These steps should now make each user read-write again, and test2 and test3 should recieve these events
		changeUserToRW: {
			url: "approots/$adminCreateSTFR.id$/children/$adminCreateSTF.id$/users/test2",
			verb: "PUT",
			params: {
				cstoken: "$adminAuth.cookie$",
				isReadOnly: false
			}
		},
		
		makePublic: {
			url: "approots/$adminCreateSTFR.id$/children/$adminCreateSTF.id$",
			verb: "PUT",
			params: {
				type: "public",
				isReadOnly: false,
				cstoken: "$adminAuth.cookie$"
			}
		},
		
		eventLog1: {
			url: "notifications",
			verb: "GET",
			params: {
				cstoken: "$auth1.cookie$",
				token: "$auth1.token$",
				clientID: "$auth1.clientID$",
				since: "$initialState.lastEvent$"
			},
			expectType: {
				"ok": "boolean",
				"events": "object"
			},
			expect: {
				"ok": true,
				"events.length": 4,
				"events[0].subtype": "foldercreated",
				"events[1].subtype": "shareaccepted",
				"events[2].subtype": "shareaccepted",
				"events[3].subtype": "shareaccepted"
			}
		},
		
		eventLog2: {
			url: "notifications",
			verb: "GET",
			params: {
				cstoken: "$auth2.cookie$",
				token: "$auth2.token$",
				clientID: "$auth2.clientID$",
				since: "$initialState.lastEvent$"
			},
			expectType: {
				"ok": "boolean",
				"events": "object"
			},
			expect: {
				"ok": true,
				"events.length": 3,
				"events[0].subtype": "foldercreated",
				"events[1].subtype": "sharechange",
				"events[1].id": "$adminCreateSTF.id$",
				"events[1].isReadOnly": true,
				"events[2].subtype": "sharechange",
				"events[2].id": "$adminCreateSTF.id$",
				"events[2].isReadOnly": false
			}
		},
		
		eventLog3: {
			url: "notifications",
			verb: "GET",
			params: {
				cstoken: "$auth3.cookie$",
				token: "$auth3.token$",
				clientID: "$auth3.clientID$",
				since: "$initialState.lastEvent$"
			},
			expectType: {
				"ok": "boolean",
				"events": "object"
			},
			expect: {
				"ok": true,
				"events.length": 3,
				"events[0].subtype": "foldercreated",
				"events[1].subtype": "sharechange",
				"events[1].id": "$adminCreateSTF.id$",
				"events[1].isReadOnly": true,
				"events[2].subtype": "sharechange",
				"events[2].id": "$adminCreateSTF.id$",
				"events[2].isReadOnly": false
			}
		}		
	},
	
	ChangeSystemShareConfirmFolderAccess: {
		VERSIONS: ["v4"],
		adminAuth: {
			url: "auth",
			verb: 'POST',
			dataType: "html",
			params: {
				username: "Admin",
				password: "livelink",
				admin: true
			},
			remember: {
				content: "cookie"
			},
		},

		auth1: {
			libraryStep : lib.auth,
			variables : { userName : "test1" }
		},

		auth2: {
			libraryStep : lib.auth,
			variables : { userName : "test2" }
		},
		
		auth3: {
			libraryStep : lib.auth,
			variables : { userName : "test3" }
		},
		
		initialState: {
			libraryStep : lib.getSeqNo,
			variables : {
				cookie : "$auth1.cookie$",
				token : "$auth1.token$",
				clientID : "$auth1.clientID$"
			}
		},
		
		adminCreateSTFR: {
			url: "approots",
			verb: "POST",
			params: {
				cstoken: "$adminAuth.cookie$",
				name: "STFRoot1"
			},
			expectType: {
				"id": "number"
			},
			remember: {
				"id": "id"
			},
		},

		adminCreateSTF: {
			url: "approots/$adminCreateSTFR.id$/children",
			verb: "POST",
			params: {
				cstoken: "$adminAuth.cookie$",
				name: "STF1",
				username: "test1",
				type: "public",
				isReadOnly: false
			},
			expectType: {
				"id": "number"
			},
			remember: {
				"id": "id"
			},
		},
		
		ownerSubscribe: {
			libraryStep: lib.accept,
			variables: {
				"id": "$adminCreateSTF.id$",
				"cstoken": "$auth1.cookie$"
			}
		},
		
		addROUser: {
			url: "approots/$adminCreateSTFR.id$/children/$adminCreateSTF.id$/users/test2",
			verb: "PUT",
			params: {
				cstoken: "$adminAuth.cookie$",
				isReadOnly: true
			}
		},
		
		addRWUser: {
			url: "approots/$adminCreateSTFR.id$/children/$adminCreateSTF.id$/users/test3",
			verb: "PUT",
			params: {
				cstoken: "$adminAuth.cookie$",
				isReadOnly: false
			}
		},
		
		roUserSubscribe: {
			libraryStep: lib.accept,
			variables: {
				"id": "$adminCreateSTF.id$",
				"cstoken": "$auth2.cookie$"
			}
		},
		
		rwUserSubscribe: {
			libraryStep: lib.accept,
			variables: {
				"id": "$adminCreateSTF.id$",
				"cstoken": "$auth3.cookie$"
			}
		},
		
		ownerAddFolder1: {
			libraryStep: lib.createFolder,
			variables: {
				"parentID": "$adminCreateSTF.id$",
				"name": "f1",
				"cstoken": "$auth1.cookie$"
			}
		},
		
		getContents1: {
			url: "nodes/$adminCreateSTF.id$/children",
			verb: "GET",
			params: {
				cstoken: "$auth2.cookie$"
			},
			expectType : { ok : "boolean", contents : "object", count: "number" },
			expect : {
				ok : true,
				count: 1
			}
		},
		
		// These steps should make the share read-only for test2, so only they should
		// receive a share changed event
		makePrivate: {
			url: "approots/$adminCreateSTFR.id$/children/$adminCreateSTF.id$",
			verb: "PUT",
			params: {
				type: "private",
				cstoken: "$adminAuth.cookie$"
			}
		},	
		
		// user test2 should no longer be able to get info on the STF
		getContents2: {
			url: "nodes/$adminCreateSTF.id$/children",
			verb: "GET",
			params: {
				cstoken: "$auth2.cookie$"
			},
			expectType : { ok : "boolean", contents : "object", count: "number" },
			expect : {
				ok : true,
				count: 0
			}
		},
		
		// user test3 should still be able to get info on the STF
		getContents2: {
			url: "nodes/$adminCreateSTF.id$/children",
			verb: "GET",
			params: {
				cstoken: "$auth3.cookie$"
			},
			expectType : { ok : "boolean", contents : "object", count: "number" },
			expect : {
				ok : true,
				count: 1
			}
		},
		
		//if test3's perms are set to ReadOnly on the STF after it has become a private folder, the user //should still be able to get info on the STF
		changeUserToRO: {
			url: "approots/$adminCreateSTFR.id$/children/$adminCreateSTF.id$/users/test3",
			verb: "PUT",
			params: {
				cstoken: "$adminAuth.cookie$",
				isReadOnly: true
			}
		},
		
		getContents3: {
			url: "nodes/$adminCreateSTF.id$/children",
			verb: "GET",
			params: {
				cstoken: "$auth3.cookie$"
			},
			expectType : { ok : "boolean", contents : "object", count: "number" },
			expect : {
				ok : true,
				count: 1
			}
		},
		
			
		// These steps should now make each user read-write again, and test2 and test3 should recieve these events
		changeUserToRW: {
			url: "approots/$adminCreateSTFR.id$/children/$adminCreateSTF.id$/users/test2",
			verb: "PUT",
			params: {
				cstoken: "$adminAuth.cookie$",
				isReadOnly: false
			}
		},
		
		makePublic: {
			url: "approots/$adminCreateSTFR.id$/children/$adminCreateSTF.id$",
			verb: "PUT",
			params: {
				type: "public",
				isReadOnly: false,
				cstoken: "$adminAuth.cookie$"
			}
		},
		
		// both user test2 and test3 should be able to get info on the STF
		getContents4: {
			url: "nodes/$adminCreateSTF.id$/children",
			verb: "GET",
			params: {
				cstoken: "$auth2.cookie$"
			},
			expectType : { ok : "boolean", contents : "object", count: "number" },
			expect : {
				ok : true,
				count: 1
			}
		},
		
		getContents5: {
			url: "nodes/$adminCreateSTF.id$/children",
			verb: "GET",
			params: {
				cstoken: "$auth3.cookie$"
			},
			expectType : { ok : "boolean", contents : "object", count: "number" },
			expect : {
				ok : true,
				count: 1
			}
		},
		
		eventLog1: {
			url: "notifications",
			verb: "GET",
			params: {
				cstoken: "$auth1.cookie$",
				token: "$auth1.token$",
				clientID: "$auth1.clientID$",
				since: "$initialState.lastEvent$"
			},
			expectType: {
				"ok": "boolean",
				"events": "object"
			},
			expect: {
				"ok": true,
				"events.length": 5,
				"events[0].subtype": "foldercreated",
				"events[1].subtype": "shareaccepted",
				"events[2].subtype": "shareaccepted",
				"events[3].subtype": "shareaccepted",
				"events[4].subtype": "foldercreated"
			}
		},
		
		eventLog2: {
			url: "notifications",
			verb: "GET",
			params: {
				cstoken: "$auth2.cookie$",
				token: "$auth2.token$",
				clientID: "$auth2.clientID$",
				since: "$initialState.lastEvent$"
			},
			expectType: {
				"ok": "boolean",
				"events": "object"
			},
			expect: {
				"ok": true,
				"events.length": 4,
				"events[0].subtype": "foldercreated",
				"events[1].subtype": "foldercreated",
				"events[2].subtype": "sharechange",
				"events[2].id": "$adminCreateSTF.id$",
				"events[2].isReadOnly": true,
				"events[3].subtype": "sharechange",
				"events[3].id": "$adminCreateSTF.id$",
				"events[3].isReadOnly": false
			}
		},
		
		eventLog3: {
			url: "notifications",
			verb: "GET",
			params: {
				cstoken: "$auth3.cookie$",
				token: "$auth3.token$",
				clientID: "$auth3.clientID$",
				since: "$initialState.lastEvent$"
			},
			expectType: {
				"ok": "boolean",
				"events": "object"
			},
			expect: {
				"ok": true,
				"events.length": 4,
				"events[0].subtype": "foldercreated",
				"events[1].subtype": "foldercreated",
				"events[2].subtype": "sharechange",
				"events[2].id": "$adminCreateSTF.id$",
				"events[2].isReadOnly": true,
				"events[3].subtype": "sharechange",
				"events[3].id": "$adminCreateSTF.id$",
				"events[3].isReadOnly": false
			}
		}		
	},
	
	BrowseSTF: {
		VERSIONS: ["v4"],
		adminAuth: {
			url: "auth",
			verb: 'POST',
			dataType: "html",
			params: {
				username: "Admin",
				password: "livelink",
				admin: true
			},
			remember: {
				content: "cookie"
			},
		},

		auth1: {
			libraryStep : lib.auth,
			variables : { userName : "test1" }
		},

		auth2: {
			libraryStep : lib.auth,
			variables : { userName : "test2" }
		},

		auth3: {
			libraryStep : lib.auth,
			variables : { userName : "test3" }
		},
		
		initialState: {
			libraryStep : lib.getSeqNo,
			variables : {
				cookie : "$auth1.cookie$",
				token : "$auth1.token$",
				clientID : "$auth1.clientID$"
			}
		},
		
		//Get contents on a folder within a private STF that a user has not subscribed to and not added to STF
		adminCreateSTFR: {
			url: "approots",
			verb: "POST",
			params: {
				cstoken: "$adminAuth.cookie$",
				name: "STFRoot1"
			},
			expectType: {
				"id": "number"
			},
			remember: {
				"id": "id"
			},
		},

		adminCreateSTF: {
			url: "approots/$adminCreateSTFR.id$/children",
			verb: "POST",
			params: {
				cstoken: "$adminAuth.cookie$",
				name: "STF1",
				type: "private",
				username: "test1"
			},
			expectType: {
				"id": "number"
			},
			remember: {
				"id": "id"
			},
		},
		
		createNode1: {
			libraryStep: lib.createFolder,
			variables: {
				"parentID": "$adminCreateSTF.id$",
				"name": "folder1",
				"cstoken": "$auth1.cookie$"
			},
		},
			
		uninvitedUserSubscribeToPrivateSTF: {
			url: "shares/incoming/$adminCreateSTF.id$",
			verb: "PUT",
			expectType: {
				"ok": "boolean"
			},
			expect: {
				"ok": false,
			},
			params: {
				cstoken: "$auth2.cookie$",
				username: "test2",
				accepted: true
			},
		},
		
		getContents1 : {
			url : "nodes/$auth2.rootFolder$/children",
			verb : "GET",
			params : { cstoken : "$auth2.cookie$" },
			expectType : { contents : "object", count: "number" },
			expect : {
				count : 0
			},
		},
		
		AddUserReadonlyAsAdminToPrivateSTF: {
			url: "approots/$adminCreateSTFR.id$/children/$adminCreateSTF.id$/users/test2",
			verb: "PUT",
			params: {
				cstoken: "$adminAuth.cookie$",
				isReadOnly: true,
			},
		},
		
		//Get contents on a folder within a private STF that a user has not subscribed to but was added to
		getContents2 : {
			url : "nodes/$auth2.rootFolder$/children",
			verb : "GET",
			params : { cstoken : "$auth2.cookie$" },
			expectType : { contents : "object", count: "number" },
			expect : {
				count : 0
			},
		},
		
		//Get contents on a folder within a private STF that a user has subscribed to
		userSubscribeToPrivateSTF: {
			url: "shares/incoming/$adminCreateSTF.id$",
			verb: "PUT",
			expectType: {
				"ok": "boolean"
			},
			expect: {
				"ok": true,
			},
			params: {
				cstoken: "$auth2.cookie$",
				username: "test2",
				accepted: true
			}
		},
		
		getContents3 : {
			url : "nodes/$auth2.rootFolder$/children",
			verb : "GET",
			params : { cstoken : "$auth2.cookie$" },
			expectType : { contents : "object", count: "number" },
			expect : {
				count : 1,
				"contents[0].id" : "$adminCreateSTF.id$",
				"contents[0].name" : "STF1 (test1)",
				"contents[0].isReadOnly" : true
			},
		},
		
		//Get contents on a folder within a public STF that a user not has subscribed to and not added to STF
		adminCreateSTF2: {
			url: "approots/$adminCreateSTFR.id$/children",
			verb: "POST",
			params: {
				cstoken: "$adminAuth.cookie$",
				name: "STF2",
				username: "test1"
			},
			expectType: {
				"id": "number"
			},
			remember: {
				"id": "id"
			},
		},
		
		createNode2: {
			libraryStep: lib.createFolder,
			variables: {
				"parentID": "$adminCreateSTF2.id$",
				"name": "folder2",
				"cstoken": "$auth1.cookie$"
			},
		},
			
		getContents4 : {
			url : "nodes/$adminCreateSTF2.id$/children",
			verb : "GET",
			params : { cstoken : "$auth2.cookie$" },
			expectType : { contents : "object", count: "number" },
			expect : {
				count : 1,
				"contents[0].id" : "$createNode2.id$",
				"contents[0].name" : "folder2",
				"contents[0].isReadOnly" : true
			},
		},
		
		getContents5 : {
			url : "nodes/$auth2.rootFolder$/children",
			verb : "GET",
			params : { cstoken : "$auth2.cookie$" },
			expectType : { contents : "object", count: "number" },
			expect : {
				count : 1,
				"contents[0].id" : "$adminCreateSTF.id$",
				"contents[0].name" : "STF1 (test1)",
				"contents[0].isReadOnly" : true
			},
		},
		
		//Get contents on a folder within a public STF that a user has not subscribed to but was added to
		AddUserReadonlyAsAdminToPublicSTF2: {
			url: "approots/$adminCreateSTFR.id$/children/$adminCreateSTF2.id$/users/test2",
			verb: "PUT",
			params: {
				cstoken: "$adminAuth.cookie$",
				isReadOnly: true,
			},
		},
		
		getContents6 : {
			url : "nodes/$adminCreateSTF2.id$/children",
			verb : "GET",
			params : { cstoken : "$auth2.cookie$" },
			expectType : { contents : "object", count: "number" },
			expect : {
				count : 1,
				"contents[0].id" : "$createNode2.id$",
				"contents[0].name" : "folder2",
				"contents[0].isReadOnly" : true
			},
		},
		
		getContents7 : {
			url : "nodes/$auth2.rootFolder$/children",
			verb : "GET",
			params : { cstoken : "$auth2.cookie$" },
			expectType : { contents : "object", count: "number" },
			expect : {
				count : 1,
				"contents[0].id" : "$adminCreateSTF.id$",
				"contents[0].name" : "STF1 (test1)",
				"contents[0].isReadOnly" : true
			},
		},
		
		//Get contents on a folder within a public STF that a user has subscribed to
		userSubscribeToPublicSTF2: {
			url: "shares/incoming/$adminCreateSTF2.id$",
			verb: "PUT",
			expectType: {
				"ok": "boolean"
			},
			expect: {
				"ok": true,
			},
			params: {
				cstoken: "$auth2.cookie$",
				username: "test2",
				accepted: true
			}
		},
		
		getContents8 : {
			url : "nodes/$adminCreateSTF2.id$/children",
			verb : "GET",
			params : { cstoken : "$auth2.cookie$" },
			expectType : { contents : "object", count: "number" },
			expect : {
				count : 1,
				"contents[0].id" : "$createNode2.id$",
				"contents[0].name" : "folder2",
				"contents[0].isReadOnly" : true
			},
		},
		
		getContents9 : {
			url : "nodes/$auth2.rootFolder$/children",
			verb : "GET",
			params : { cstoken : "$auth2.cookie$" },
			expectType : { contents : "object", count: "number" },
			expect : {
				count : 2,
				"contents[0].id" : "$adminCreateSTF2.id$",
				"contents[0].name" : "STF2 (test1)",
				"contents[0].isReadOnly" : true,
				"contents[0].id" : "$adminCreateSTF.id$",
				"contents[0].name" : "STF1 (test1)",
				"contents[0].isReadOnly" : true
			},
		}
	
	},
	
	UnsubscribeFromSTF: {
		adminAuth: {
			url: "auth",
			verb: 'POST',
			dataType: "html",
			params: {
				username: "Admin",
				password: "livelink",
				admin: true
				},
			remember: {
				content: "cookie"
			},
		},
				
		regUserAuth1: {
			libraryStep : lib.auth,
			variables : { userName : "test1" }
		},
		
		regUserAuth2: {
			libraryStep : lib.auth,
			variables : { userName : "test2" }
		},
		
		adminCreateSTFR: {
			url: "approots",
			verb: "POST",
			params: {
				cstoken: "$adminAuth.cookie$",
				name: "STFRoot32"
			},
			expectType: {
				"id": "number"
			},
			remember: {
				"id": "STFRid"
			}
		},
		
		adminCreatePublicSTF: {
			url: "approots/$adminCreateSTFR.STFRid$/children",
			verb: "POST",
			params: {
				cstoken: "$adminAuth.cookie$",
				name: "STF1",
				username: "test1"
			},
			expectType: {
				"id": "number"
			},
			remember: {
				"id": "STF1id"
			}
		},
		
		adminCreatePrivateSTF: {
			url: "approots/$adminCreateSTFR.STFRid$/children",
			verb: "POST",
			params: {
				cstoken: "$adminAuth.cookie$",
				name: "STF2",
				username: "test1",
				type: "private"
			},
			expectType: {
				"id": "number"
			},
			remember: {
				"id": "STF2id"
			},
		},		
		
		userSubscribeToPublicSTF: {
			url: "shares/incoming/$adminCreatePublicSTF.STF1id$",
			verb: "PUT",
			expectType: {
				"ok": "boolean"
			},
			expect: {
				"ok": true,
			},
			params: {
				cstoken: "$regUserAuth2.cookie$",
				username: "test2",
				accepted: true
			}
		},
		
		getSubscriptionStatusForPublicSTF: {
			url: "nodes/$adminCreatePublicSTF.STF1id$",
			verb: "GET",
			expectType : { contents : "object", count: "number" },
			expect : {
				count : 1,
				"contents[0].name" : "STF1 (test1)",
				"contents[0].isReadOnly" : true,
				"contents[0].isSubscribed" : true
			},
			params: {
				cstoken: "$regUserAuth2.cookie$"
			}
		},	
		
		unsubscribeFromPublicSTF: {
			url: "shares/incoming/$adminCreatePublicSTF.STF1id$",
			verb: "DELETE",
			expectType: {
				"ok": "boolean"
			},
			expect: {
				"ok": true,
			},
			params: {
				cstoken: "$regUserAuth2.cookie$"
			}
		},	
		
		getFolderInfoAfterUnsubscribeFromPublicSTF: {
			url: "nodes/$adminCreatePublicSTF.STF1id$",
			verb: "GET",
			expectType : { contents : "object", count: "number" },
			expect : {
				count : 1,
				"contents[0].isSubscribed" : false
			},
			params: {
				cstoken: "$regUserAuth2.cookie$"
			}
		},
		
		AddUserReadWriteAsAdminToPrivateSTF: {
			url: "approots/$adminCreateSTFR.STFRid$/children/$adminCreatePrivateSTF.STF2id$/users/test2",
			verb: "PUT",
			params: {
				cstoken: "$adminAuth.cookie$",
				isReadOnly: false,
			},
		},
		
		userSubscribeToPrivateSTF: {
			url: "shares/incoming/$adminCreatePrivateSTF.STF2id$",
			verb: "PUT",
			expectType: {
				"ok": "boolean"
			},
			expect: {
				"ok": true,
			},
			params: {
				cstoken: "$regUserAuth2.cookie$",
				username: "test2",
				accepted: true
			}
		},
		
		getFolderInfoForPrivateSTF: {
			url: "nodes/$adminCreatePrivateSTF.STF2id$",
			verb: "GET",
			
			expectType : { contents : "object", count: "number" },
			expect : {
				count : 1,
				"contents[0].name" : "STF2 (test1)",
				"contents[0].isReadOnly" : false,
				"contents[0].isSubscribed" : true
			},
			
			params: {
				cstoken: "$regUserAuth2.cookie$"

			}
		},
		
		unsubscribeFromPrivateSTF: {
			url: "shares/incoming/$adminCreatePrivateSTF.STF2id$",
			verb: "DELETE",
			expectType: {
				"ok": "boolean"
			},
			expect: {
				"ok": true,
			},
			params: {
				cstoken: "$regUserAuth2.cookie$"
			}
		},
		
		getFolderInfoAfterUnsubscribeFromPrivateSTF: {
			url: "nodes/$adminCreatePrivateSTF.STF2id$",
			verb: "GET",
			expectType : { contents : "object", count: "number" },
			expect : {
				count : 1,
				"contents[0].isSubscribed" : false
			},
			params: {
				cstoken: "$regUserAuth2.cookie$"
			}
		}
	},
	
	IconSTFR: {
		adminAuth: {
			url: "auth",
			verb: 'POST',
			dataType: "html",
			params: {
				username: "Admin",
				password: "livelink",
				admin: true
				},
			remember: {
				content: "cookie"
			},
		},
				
		regUserAuth1: {
			libraryStep : lib.auth,
			variables : { userName : "test1" }
		},
		
		adminCreateSTFR: {
			url: "approots",
			verb: "POST",
			params: {
				cstoken: "$adminAuth.cookie$",
				name: "SFTRoot32"
			},
			expectType: {
				"id": "number"
			},
			remember: {
				"id": "STFRid"
			}
		},
		
		addIconSTFR: {
			url: "nodes/$adminCreateSTFR.STFRid$/thumbnail",
			verb: "PUT",
			type: "multipart/form-data",
			contentType: "image/png",
			fileContents: utils.GetBinaryFileData("test.png"),
			binaryData: true,
			fileName: "test.png",
			params: {
				cstoken: "$adminAuth.cookie$"
			},
			expect: {
			}
		},
		
		getIconSTFR: {
			url: "nodes/$adminCreateSTFR.STFRid$/thumbnail",
			verb: "GET",
			binaryResponse: true,
			params: {
				cstoken: "$regUserAuth1.cookie$"
				//cstoken: "$adminAuth.cookie$"
			},
			expect: {
				content: utils.StringToArrayBuffer(utils.GetBinaryFileData("test.png"))
			}
		},
		
		deleteIconSTFR: {
			url: "nodes/$adminCreateSTFR.STFRid$/thumbnail",
			verb: "DELETE",
			params: {
				"cstoken": "$adminAuth.cookie$"
			}
		},
		
		adminCreateSTF: {
			url: "approots/$adminCreateSTFR.STFRid$/children",
			verb: "POST",
			params: {
				cstoken: "$adminAuth.cookie$",
				name: "STF1",
				username: "test1"
			},
			expectType: {
				"id": "number"
			},
			remember: {
				"id": "STFid"
			}
		},
		addIconSTF: {
			url: "nodes/$adminCreateSTF.STFid$/thumbnail",
			verb: "PUT",
			type: "multipart/form-data",
			contentType: "image/png",
			fileContents: utils.GetBinaryFileData("test.png"),
			binaryData: true,
			fileName: "test.png",
			params: {
				cstoken: "$adminAuth.cookie$"
			},
			expect: {
			}
		},
		
		getIconSTF: {
			url: "nodes/$adminCreateSTF.STFid$/thumbnail",
			verb: "GET",
			binaryResponse: true,
			params: {
				cstoken: "$regUserAuth1.cookie$"
				//cstoken: "$adminAuth.cookie$"
			},
			expect: {
				content: utils.StringToArrayBuffer(utils.GetBinaryFileData("test.png"))
			}
		},
		
		deleteIconSTF: {
			url: "nodes/$adminCreateSTF.STFid$/thumbnail",
			verb: "DELETE",
			params: {
				"cstoken": "$adminAuth.cookie$"
			}
		},
	},
	
	BrowseFoldersOnly: {
		auth1 : {
			libraryStep : lib.auth,
			variables : { userName : "test1" }
		},
		
		//Get content on empty root.  No Type
		GetFolderContentsOnEmptyRoot : {
			url : "nodes/$auth1.rootFolder$/children",
			verb : "GET",
			params : { cstoken : "$auth1.cookie$" },
			expectType : { ok : "boolean", contents : "object" },
			expect : {
				ok : true,
				count: 0
			}
		},
		
		//Get content on empty root.  Type indicated
		GetFolderContentsOnEmptyRootFoldersOnly : {
			url : "nodes/$auth1.rootFolder$/children",
			verb : "GET",
			params : { cstoken : "$auth1.cookie$", type : "folder" },
			expectType : { ok : "boolean", contents : "object" },
			expect : {
				ok : true,
				count: 0
			}
		},
		
		//Get content on root with folder only.  No Type
		folder1 : {
			libraryStep : lib.createFolder,
			variables : {
				parentID : "$auth1.rootFolder$",
				name : "share",
				cstoken : "$auth1.cookie$"
			}
		},
		
		GetFolderContentsOneFolderRoot : {
			url : "nodes/$auth1.rootFolder$/children",
			verb : "GET",
			params : { cstoken : "$auth1.cookie$" },
			expectType : { ok : "boolean", contents : "object" },
			expect : {
				ok : true,
				count: 1,
				"contents[0].name" : "share"
			}
		},
		
		//Get content on root with folder only.  Type indicated
		GetFolderContentsOneFolderRootFoldersOnly : {
			url : "nodes/$auth1.rootFolder$/children",
			verb : "GET",
			params : { cstoken : "$auth1.cookie$", type : "folder" },
			expectType : { ok : "boolean", contents : "object" },
			expect : {
				ok : true,
				count: 1,
				"contents[0].name" : "share"
			}
		},
		
		deleteFolder1: {
			url: "nodes/$folder1.id$",
			verb: "DELETE",
			params: {
				cstoken: "$auth1.cookie$"
			},
			expectType: {
				"ok": "boolean"
			},
			expect: {
				"ok": true
			}
		},
		
		//Get content on root with file only.  No Type
		UploadFile : {
			url : "nodes/$auth1.rootFolder$/children",
			verb : "POST",
			type : "multipart/form-data",
			fileContents : "FileContents - file stuff",
			fileName : "test.txt",
			params : { 
				cstoken : "$auth1.cookie$"					 
			},
			expectType: {
				"ok": "boolean"
			},
			expect: {
				"ok": true,
				"name": "test.txt"
			},
			remember : {
				'id': 'id'
			}
			
		},
				
		GetFolderContentsOnRootOneFile : {
			url : "nodes/$auth1.rootFolder$/children",
			verb : "GET",
			params : { cstoken : "$auth1.cookie$" },
			expectType : { ok : "boolean", contents : "object" },
			expect : {
				ok : true,
				count: 1,
				"contents[0].name" : "test.txt"
			}
		},
		
		//Get content on root with file only.  Type indicated
		GetFolderContentsOnRootOneFileFoldersOnly : {
			url : "nodes/$auth1.rootFolder$/children",
			verb : "GET",
			params : { cstoken : "$auth1.cookie$", type : "folder" },
			expectType : { ok : "boolean", contents : "object" },
			expect : {
				ok : true,
				count: 0
			}
		},
		
		//Get content on root with folders and files.  No Type
		folder2 : {
			libraryStep : lib.createFolder,
			variables : {
				parentID : "$auth1.rootFolder$",
				name : "folder2",
				cstoken : "$auth1.cookie$"
			}
		},
		
		folder3 : {
			libraryStep : lib.createFolder,
			variables : {
				parentID : "$auth1.rootFolder$",
				name : "folder3",
				cstoken : "$auth1.cookie$"
			}
		},
		
		
		UploadFile2 : {
			url : "nodes/$auth1.rootFolder$/children",
			verb : "POST",
			type : "multipart/form-data",
			fileContents : "FileContents - file stuff",
			fileName : "test2.txt",
			params : { 
				cstoken : "$auth1.cookie$"					 
			},
			expectType: {
				"ok": "boolean"
			},
			expect: {
				"ok": true,
				"name": "test2.txt"
			},
			remember : {
				'id': 'id'
			}			
		},
		
		
		GetFolderContentsMultiFileFolder : {
			url : "nodes/$auth1.rootFolder$/children",
			verb : "GET",
			params : { cstoken : "$auth1.cookie$" },
			expectType : { ok : "boolean", contents : "object" },
			expect : {
				ok : true,
				count: 4,
				"contents[0].name" : "folder2",
				"contents[1].name" : "folder3",
				"contents[2].name" : "test.txt",
				"contents[3].name" : "test2.txt"
			}
		},
		
		//Get content on root with folders and files.  Type indicated
		GetFolderContentsMultiFileFolderFoldersOnly : {
			url : "nodes/$auth1.rootFolder$/children",
			verb : "GET",
			params : { cstoken : "$auth1.cookie$", type : "folder" },
			expectType : { ok : "boolean", contents : "object" },
			expect : {
				ok : true,
				count: 2,
				"contents[0].name" : "folder2",
				"contents[1].name" : "folder3"
			}
		},
		
		//Get content on sub folder with no folders or files.  No Type
		subFolder1 : {
			libraryStep : lib.createFolder,
			variables : {
				parentID : "$folder3.id$",
				name : "subFolder1",
				cstoken : "$auth1.cookie$"
			}
		},
		
		subFolder2 : {
			libraryStep : lib.createFolder,
			variables : {
				parentID : "$folder3.id$",
				name : "subFolder2",
				cstoken : "$auth1.cookie$"
			}
		},
		
		
		UploadSubFile1 : {
			url : "nodes/$folder3.id$/children",
			verb : "POST",
			type : "multipart/form-data",
			fileContents : "FileContents - file stuff",
			fileName : "subTest1.txt",
			params : { 
				cstoken : "$auth1.cookie$"					 
			},
			expectType: {
				"ok": "boolean"
			},
			expect: {
				"ok": true,
				"name": "subTest1.txt"
			},
			remember : {
				'id': 'id'
			}			
		},
		
		UploadSubFile2 : {
			url : "nodes/$folder3.id$/children",
			verb : "POST",
			type : "multipart/form-data",
			fileContents : "FileContents - file stuff",
			fileName : "subTest2.txt",
			params : { 
				cstoken : "$auth1.cookie$"					 
			},
			expectType: {
				"ok": "boolean"
			},
			expect: {
				"ok": true,
				"name": "subTest2.txt"
			},
			remember : {
				'id': 'id'
			}			
		},
		
		GetFolderContentsFromSubMultiFileFolder : {
			url : "nodes/$folder3.id$/children",
			verb : "GET",
			params : { cstoken : "$auth1.cookie$" },
			expectType : { ok : "boolean", contents : "object" },
			expect : {
				ok : true,
				count: 4,
				"contents[0].name" : "subFolder1",
				"contents[1].name" : "subFolder2",
				"contents[2].name" : "subTest1.txt",
				"contents[3].name" : "subTest2.txt"
			}
		},
		
		//Get content on root with folders and files.  Type indicated
		GetFolderContentsFromSubMultiFileFolderFoldersOnly : {
			url : "nodes/$folder3.id$/children",
			verb : "GET",
			params : { cstoken : "$auth1.cookie$", type : "folder" },
			expectType : { ok : "boolean", contents : "object" },
			expect : {
				ok : true,
				count: 2,
				"contents[0].name" : "subFolder1",
				"contents[1].name" : "subFolder2"
			}
		},
		
		//Get content on System Tempo Folder Root with folders and files.  No Type.
		
		adminAuth: {
			url: "auth",
			verb: 'POST',
			dataType: "html",
			params: {
				username: "Admin",
				password: "livelink",
				admin: true
				},
			remember: {
				content: "cookie"
			},
		},
				
		adminCreateSTFR: {
			url: "approots",
			verb: "POST",
			params: {
				cstoken: "$adminAuth.cookie$",
				name: "STFRoot1"
			},
			expectType: {
				"id": "number"
			},
			remember: {
				"id": "STFRid"
			}
		},
		
		adminCreatePublicSTF: {
			url: "approots/$adminCreateSTFR.STFRid$/children",
			verb: "POST",
			params: {
				cstoken: "$adminAuth.cookie$",
				name: "STF1",
				username: "test1"
			},
			expectType: {
				"id": "number"
			},
			remember: {
				"id": "STF1id"
			}
		},
		
		adminCreatePrivateSTF: {
			url: "approots/$adminCreateSTFR.STFRid$/children",
			verb: "POST",
			params: {
				cstoken: "$adminAuth.cookie$",
				name: "STF2",
				username: "test1",
				type: "private"
			},
			expectType: {
				"id": "number"
			},
			remember: {
				"id": "STF2id"
			},
		},	

		UploadSTFRFile1 : {
			url : "nodes/$adminCreateSTFR.STFRid$/children",
			verb : "POST",
			type : "multipart/form-data",
			fileContents : "FileContents - file stuff",
			fileName : "STFRtest1.txt",
			params : { 
				cstoken : "$adminAuth.cookie$"					 
			},
			expectType: {
				"ok": "boolean"
			},
			expect: {
				"ok": true,
				"name": "STFRtest1.txt"
			},
			remember : {
				'id': 'id'
			}			
		},
		
		UploadSTFRFile2 : {
			url : "nodes/$adminCreateSTFR.STFRid$/children",
			verb : "POST",
			type : "multipart/form-data",
			fileContents : "FileContents - file stuff",
			fileName : "STFRtest2.txt",
			params : { 
				cstoken : "$adminAuth.cookie$"					 
			},
			expectType: {
				"ok": "boolean"
			},
			expect: {
				"ok": true,
				"name": "STFRtest2.txt"
			},
			remember : {
				'id': 'id'
			}			
		},
		
		GetFolderContentsFromSTFRMultiFileFolder : {
			url : "nodes/$adminCreateSTFR.STFRid$/children",
			verb : "GET",
			params : { cstoken : "$auth1.cookie$" },
			expectType : { ok : "boolean", contents : "object" },
			expect : {
				ok : true,
				count: 4,
				"contents[0].name" : "STF1",
				"contents[1].name" : "STF2",
				"contents[2].name" : "STFRtest1.txt",
				"contents[3].name" : "STFRtest2.txt"
				
			}
		},
		
		//Get content on System Tempo Folder Root with folders and files.  Type indicated.
		
		GetFolderContentsFromSTFRMultiFileFolderFoldersOnly : {
			url : "nodes/$adminCreateSTFR.STFRid$/children",
			verb : "GET",
			params : { cstoken : "$auth1.cookie$", type : "folder" },
			expectType : { ok : "boolean", contents : "object" },
			expect : {
				ok : true,
				count: 2,
				"contents[0].name" : "STF1",
				"contents[1].name" : "STF2"
			},
		},
		
		//Get content on System Tempo Folder with folders and files.  No Type.
		
		STFSubFolder1 : {
			libraryStep : lib.createFolder,
			variables : {
				parentID : "$adminCreatePublicSTF.STF1id$",
				name : "STFSubFolder1",
				cstoken : "$auth1.cookie$"
			}
		},
		
		STFSubFolder2 : {
			libraryStep : lib.createFolder,
			variables : {
				parentID : "$adminCreatePublicSTF.STF1id$",
				name : "STFSubFolder2",
				cstoken : "$auth1.cookie$"
			}
		},
		
		UploadSTFFile1 : {
			url : "nodes/$adminCreatePublicSTF.STF1id$/children",
			verb : "POST",
			type : "multipart/form-data",
			fileContents : "FileContents - file stuff",
			fileName : "STFtest1.txt",
			params : { 
				cstoken : "$adminAuth.cookie$"					 
			},
			expectType: {
				"ok": "boolean"
			},
			expect: {
				"ok": true,
				"name": "STFtest1.txt"
			},
			remember : {
				'id': 'id'
			}			
		},
		
		UploadSTFFile2 : {
			url : "nodes/$adminCreatePublicSTF.STF1id$/children",
			verb : "POST",
			type : "multipart/form-data",
			fileContents : "FileContents - file stuff",
			fileName : "STFtest2.txt",
			params : { 
				cstoken : "$adminAuth.cookie$"					 
			},
			expectType: {
				"ok": "boolean"
			},
			expect: {
				"ok": true,
				"name": "STFtest2.txt"
			},
			remember : {
				'id': 'id'
			}			
		},
		
		GetFolderContentsFromSTFMultiFileFolder : {
			url : "nodes/$adminCreatePublicSTF.STF1id$/children",
			verb : "GET",
			params : { cstoken : "$auth1.cookie$" },
			expectType : { ok : "boolean", contents : "object" },
			expect : {
				ok : true,
				count: 4,
				"contents[0].name" : "STFSubFolder1",
				"contents[1].name" : "STFSubFolder2",
				"contents[2].name" : "STFtest1.txt",
				"contents[3].name" : "STFtest2.txt"
			},
		},
		
		//Get content on System Tempo Folder Root with folders and files.  Type indicated.
		
		GetFolderContentsFromSTFMultiFileFolderFoldersOnly : {
			url : "nodes/$adminCreatePublicSTF.STF1id$/children",
			verb : "GET",
			params : { cstoken : "$auth1.cookie$", type : "folder" },
			expectType : { ok : "boolean", contents : "object" },
			expect : {
				ok : true,
				count: 2,
				"contents[0].name" : "STFSubFolder1",
				"contents[1].name" : "STFSubFolder2"
			},
		},
		
		//Get content on System Tempo Folder Root with folders and files.  Type indicated but invalid.
		//Any other value other than 'folder' will default the Type to 'all' which should return everything
		GetFolderContentsFromSTFMultiFileFolderInvalidType : {
			url : "nodes/$adminCreatePublicSTF.STF1id$/children",
			verb : "GET",
			params : { cstoken : "$auth1.cookie$", type : "invalid" },
			expectType : { ok : "boolean", contents : "object" },
			expect : {
				ok : true,
				count: 4,
				"contents[0].name" : "STFSubFolder1",
				"contents[1].name" : "STFSubFolder2",
				"contents[2].name" : "STFtest1.txt",
				"contents[3].name" : "STFtest2.txt"
			},
		}
		
	},
	
	"Manipulate Watched Nodes as Admin":{
		adminAuth: {
			url: "auth",
			verb: 'POST',
			dataType: "html",
			params: {
				username: "Admin",
				password: "livelink",
				admin: true
				},
			remember: {
				content: "cookie"
			},
		},
		noWatchesYet: {
			url: "watches",
			verb: "GET",
			params: { cstoken: "$adminAuth.cookie$" },
			expect: { "watches.length": 0}
		},
		addWatches: {
			url: "watches",
			verb: "POST",
			params: { 
				cstoken: "$adminAuth.cookie$",
				ids: "2000, 2003"
			}
		},
		watchesAdded: {
			url: "watches",
			verb: "GET",
			params: { cstoken: "$adminAuth.cookie$" },
			expect: {
				"watches.length": 2,
				"watches[0].id": 2000,
				"watches[1].id": 2003
			}
		},
		deleteWatch1: {
			url: "watches",
			verb: "DELETE",
			params: {
				cstoken: "$adminAuth.cookie$",
				ids: "2000"
			}
		},
		oneWatchRemains: {
			url: "watches",
			verb: "GET",
			params: { cstoken: "$adminAuth.cookie$" },
			expect: {
				"watches.length": 1,
				"watches[0].id": 2003
			}
		},
		deleteWatch2: {
			url: "watches/2003",
			verb: "DELETE",
			params: {
				cstoken: "$adminAuth.cookie$"
			}
		},
		noWatchesLeft: {
			url: "watches",
			verb: "GET",
			params: { cstoken: "$adminAuth.cookie$" },
			expect: { "watches.length": 0}
		}
	},
	
	"GetWatchEvents":{
		auth: {
			libraryStep : lib.auth,
			variables : { userName : "test1" }
		},
		adminAuth: {
			url: "auth",
			verb: 'POST',
			dataType: "html",
			params: {
				username: "Admin",
				password: "livelink",
				admin: true
				},
			remember: {
				content: "cookie"
			},
		},
		addWatch: {
			url: "watches/$auth.rootFolder$",
			verb: "PUT",
			params: { cstoken: "$adminAuth.cookie$" }
		},
		createContainerForMove: {
			libraryStep: lib.createFolder,
			variables: {
				parentID: "$auth.rootFolder$",
				cstoken: "$auth.cookie$",
				name: "target"
			}
		},
		eventsInit: {
			url: "events",
			params: { cstoken: "$adminAuth.cookie$", since: 0 },
			remember: { "events[data.events.length - 1].SeqNo": "lastSeqNo" }
		},
		noEventsYet: {
			url: "events",
			params: { cstoken: "$adminAuth.cookie$", since: "$eventsInit.lastSeqNo$" },
			expect: { "events.length" : 0 }
		},
		triggerCreateEvent: {
			url : "nodes/$auth.rootFolder$/children",
			verb : "POST",
			type : "multipart/form-data",
			fileContents : "some text",
			fileName : "test.txt",
			params : { cstoken : "$auth.cookie$" },
			remember : { 'id': 'id'},
			expect : { ok : true },
			expectType: {
				"ok": "boolean"
			}
		},
		triggerRenameEvent: {
			libraryStep: lib.rename,
			variables: {
				id: "$triggerCreateEvent.id$",
				name: "newname.txt",
				cstoken: "$auth.cookie$"
			}
		},
		triggerAddVersionEvent: {
			url : "nodes/$triggerCreateEvent.id$/content",
			verb : "POST",
			type : "multipart/form-data",
			fileContents : "some other text",
			fileName : "test1.txt",
			params : { 
				cstoken : "$auth.cookie$"
			},
			expect : {ok : true},
			expectType: {
				"ok": "boolean"
			}
		},
		triggerCopyEvent: {
			url: "nodes/$auth.rootFolder$/children",
			verb: "POST",
			params: {
				"copyFrom": "$triggerCreateEvent.id$",
				name: "copy.txt",
				cstoken: "$auth.cookie$"
			},
			expectType: {
				"ok": "boolean",
				"id": "number"
			},
			expect: {
				"ok": true
			},
			remember: {
				"id": "id"
			}
		},
		triggerMoveEvent: {
			url: "nodes/$triggerCopyEvent.id$",
			verb: "PUT",
			params: {
				"cstoken": "$auth.cookie$",
				"parentID": "$createContainerForMove.id$"
			},
			expectType: {
				"ok": "boolean"
			},
			expect: {
				"ok": true
			}
		},
		checkEvents: {
			url: "events",
			params: { cstoken: "$adminAuth.cookie$", since: "$eventsInit.lastSeqNo$" },
			expect: { 
				"events.length" : 6,
				"events[0].Event": 5, // add version
				"events[0].DataID": "$triggerCreateEvent.id$",
				"events[0].ParentID": "$auth.rootFolder$",
				"events[1].Event": 0, // create
				"events[1].DataID": "$triggerCreateEvent.id$",
				"events[1].ParentID": "$auth.rootFolder$",
				"events[2].Event": 2, // rename
				"events[2].DataID": "$triggerCreateEvent.id$",
				"events[2].Name": "$triggerRenameEvent.params.name$",
				"events[3].Event": 5, // add version
				"events[3].DataID": "$triggerCreateEvent.id$",
				"events[4].Event": 4, // copy
				"events[4].DataID": "$triggerCopyEvent.id$",
				"events[4].SourceID": "$triggerCreateEvent.id$",
				"events[4].ParentID": "$auth.rootFolder$",
				"events[5].Event": 3, // move
				"events[5].DataID": "$triggerCopyEvent.id$",
				"events[5].OldParentID": "$auth.rootFolder$",
				"events[5].ParentID": "$createContainerForMove.id$"
				
			}
		},
		deleteWatch: {
			url: "watches/$auth.rootFolder$",
			verb: "DELETE",
			params: { cstoken: "$adminAuth.cookie$" }
		},
		noMoreEvents: {
			url: "events",
			params: { cstoken: "$adminAuth.cookie$", since: "$eventsInit.lastSeqNo$" },
			expect: { "events.length" : 0 }
		}
	}
		
	//***********************************************************
	//API test to test server support of automatic client updates
	//***********************************************************
	/**These test cases have been commented out as they will need to be updated to account for different current and 
	minimum versions specified in the test environments' tempo.clients.properties file.
	
	To test these scenarios, uncomment and adjust the 'version' of each test case to coincide with the purpose of the test 
	and the limits provided in the test envornments tempo.clients.properties file located in the
	<TomcatHome>/Apache Software Foundation\Tomcat 7.0\conf  directory.
	
	**/
	/**
	auth_with_64WindowsClient_VersionHigherThanCurrent: {
		step1: {
			url: "auth",
			verb: "POST",
			params: {
				username: "test1",
				password: "livelink",
				os: "WIN",
				version: "10.0.22", //Update this version to be higher than your test environment's listed current version
				bitness: "64",
				language: "en",
				osVersion: "XP"
			},
			expectType: {
				"ok": "boolean",
				"auth": "boolean",
				cstoken: "string",
				"clientOS": "string",
				"clientCurVersion": "string",
				"clientMinVersion": "string",
				"clientLink": "string"
								
			},
			expect: {
				"ok": true,
				"auth": true,
				"clientNeedsUpgrade": null
			}
		}
	},
	
	auth_with_64WindowsClient_VersionEqualToCurrent: {
		step1: {
			url: "auth",
			verb: "POST",
			params: {
				username: "test1",
				password: "livelink",
				os: "WIN",
				version: "10.0.21", //Update this version to be equal to your test environment's listed current version
				bitness: "64",
				language: "en",
				osVersion: "Vista"
			},
			expectType: {
				"ok": "boolean",
				"auth": "boolean",
				cstoken: "string",
				"clientOS": "string",
				"clientCurVersion": "string",
				"clientMinVersion": "string",
				"clientLink": "string"
				
			},
			expect: {
				"ok": true,
				"auth": true,
				"clientNeedsUpgrade": null
			}
		}
	},
	
	auth_with_64WindowsClient_VersionWithinLimits: {
		step1: {
			url: "auth",
			verb: "POST",
			params: {
				username: "test1",
				password: "livelink",
				os: "WIN",
				version: "8.0.1", //Update this version to be within to your test environment's listed current and minimum versions
				bitness: "64",
				language: "en",
				osVersion: "7"
			},
			expectType: {
				"ok": "boolean",
				"auth": "boolean",
				cstoken: "string",
				"clientOS": "string",
				"clientCurVersion": "string",
				"clientMinVersion": "string",
				"clientLink": "string"
				
			},
			expect: {
				"ok": true,
				"auth": true,
				"clientNeedsUpgrade": null
			}
		}
	},
	
	auth_with_64WindowsClient_VersionEqualToMinimum: {
		step1: {
			url: "auth",
			verb: "POST",
			params: {
				username: "test1",
				password: "livelink",
				os: "WIN",
				version: "1.0.7", //Update this version to be equal to your test environment's listed minimum version
				bitness: "64",
				language: "en",
				osVersion: "7"
			},
			expectType: {
				"ok": "boolean",
				"auth": "boolean",
				cstoken: "string",
				"clientOS": "string",
				"clientCurVersion": "string",
				"clientMinVersion": "string",
				"clientLink": "string"
				
			},
			expect: {
				"ok": true,
				"auth": true,
				"clientNeedsUpgrade": null
			}
		}
	},
	
	auth_with_64WindowsClient_VersionLowerThanMinimum: {
		step1: {
			url: "auth",
			verb: "POST",
			params: {
				username: "test1",
				password: "livelink",
				os: "WIN",
				version: "1.0.6", //Update this version to be lower than your test environment's listed minimum version
				bitness: "64",
				language: "en",
				osVersion: "7"
			},
			expectType: {
				"ok": "boolean",
				"auth": "boolean",
				cstoken: "string",
				"clientOS": "string",
				"clientCurVersion": "string",
				"clientMinVersion": "string",
				"clientLink": "string"
				
			},
			expect: {
				"ok": true,
				"auth": false,
				"clientNeedsUpgrade": true
			}
		}
	},
	
	auth_with_32WindowsClient_VersionEqualToMinimum: {
		step1: {
			url: "auth",
			verb: "POST",
			params: {
				username: "test1",
				password: "livelink",
				os: "WIN",
				version: "1.0.7", //Update this version to be equal to your test environment's listed minimum version
				bitness: "32",
				language: "en",
				osVersion: "3.2"
			},
			expectType: {
				"ok": "boolean",
				"auth": "boolean",
				cstoken: "string",
				"clientOS": "string",
				"clientCurVersion": "string",
				"clientMinVersion": "string",
				"clientLink": "string"
				
			},
			expect: {
				"ok": true,
				"auth": true,
				"clientNeedsUpgrade": null
			}
		}
	},
	
	auth_with_32WindowsClient_VersionLowerThanMinimum: {
		step1: {
			url: "auth",
			verb: "POST",
			params: {
				username: "test1",
				password: "livelink",
				os: "WIN",
				version: "1.0.6", //Update this version to be lower than your test environment's listed minimum version
				bitness: "32",
				language: "pt",
				osVersion: "7"
			},
			expectType: {
				"ok": "boolean",
				"auth": "boolean",
				cstoken: "string",
				"clientOS": "string",
				"clientCurVersion": "string",
				"clientMinVersion": "string",
				"clientLink": "string"
				
			},
			expect: {
				"ok": true,
				"auth": false,
				"clientNeedsUpgrade": true
			}
		}
	},
	
	auth_with_MacOSClient_VersionWithinLimits: {
		step1: {
			url: "auth",
			verb: "POST",
			params: {
				username: "test1",
				password: "livelink",
				os: "MacOS",
				version: "10.0.2.1", //Update this version to be within to your test environment's listed current and minimum versions
				bitness: "64",
				language: "en",
				osVersion: "7"
			},
			expectType: {
				"ok": "boolean",
				"auth": "boolean",
				cstoken: "string",
				"clientOS": "string",
				"clientCurVersion": "string",
				"clientMinVersion": "string",
				"clientLink": "string"
				
			},
			expect: {
				"ok": true,
				"auth": true,
				"clientNeedsUpgrade": null
			}
		}
	},
	
	auth_with_MacOSClient_VersionLowerThanMinimum: {
		step1: {
			url: "auth",
			verb: "POST",
			params: {
				username: "test1",
				password: "livelink",
				os: "MacOS",
				version: "10.0.2.0", //Update this version to be lower than your test environment's listed minimum version
				bitness: "64",
				language: "en",
				osVersion: "7"
			},
			expectType: {
				"ok": "boolean",
				"auth": "boolean",
				cstoken: "string",
				"clientOS": "string",
				"clientCurVersion": "string",
				"clientMinVersion": "string",
				"clientLink": "string"
				
			},
			expect: {
				"ok": true,
				"auth": false,
				"clientNeedsUpgrade": true
			}
		}
	},
	
	auth_with_iOSClient_VersionWithinLimits: {
		step1: {
			url: "auth",
			verb: "POST",
			params: {
				username: "test1",
				password: "livelink",
				os: "iOS",
				version: "10.0.2.1", //Update this version to be within to your test environment's listed current and minimum versions
				bitness: "64",
				language: "en",
				osVersion: "7"
			},
			expectType: {
				"ok": "boolean",
				"auth": "boolean",
				cstoken: "string",
				"clientOS": "string",
				"clientCurVersion": "string",
				"clientMinVersion": "string",
				"clientLink": "string"
				
			},
			expect: {
				"ok": true,
				"auth": true,
				"clientNeedsUpgrade": null
			}
		}
	},
	
	auth_with_iOSClient_VersionLowerThanMinimum: {
		step1: {
			url: "auth",
			verb: "POST",
			params: {
				username: "test1",
				password: "livelink",
				os: "iOS",
				version: "10.0.2.0", //Update this version to be lower than your test environment's listed minimum version
				bitness: "64",
				language: "de",
				osVersion: "7"
			},
			expectType: {
				"ok": "boolean",
				"auth": "boolean",
				cstoken: "string",
				"clientOS": "string",
				"clientCurVersion": "string",
				"clientMinVersion": "string",
				"clientLink": "string"
				
			},
			expect: {
				"ok": true,
				"auth": false,
				"clientNeedsUpgrade": true
			}
		}
	},
	
	auth_with_AndroidClient_VersionWithinLimits: {
		step1: {
			url: "auth",
			verb: "POST",
			params: {
				username: "test1",
				password: "livelink",
				os: "Android",
				version: "10.0.2.1", //Update this version to be within to your test environment's listed current and minimum versions
				bitness: "64",
				language: "en",
				osVersion: "7"
			},
			expectType: {
				"ok": "boolean",
				"auth": "boolean",
				cstoken: "string",
				"clientOS": "string",
				"clientCurVersion": "string",
				"clientMinVersion": "string",
				"clientLink": "string"
				
			},
			expect: {
				"ok": true,
				"auth": true,
				"clientNeedsUpgrade": null
			}
		}
	},
	
	auth_with_AndroidClient_VersionLowerThanMinimum: {
		step1: {
			url: "auth",
			verb: "POST",
			params: {
				username: "test1",
				password: "livelink",
				os: "Android",
				version: "10.0.2.0", //Update this version to be lower than your test environment's listed minimum version
				bitness: "64",
				language: "fr",
				osVersion: "7"
			},
			expectType: {
				"ok": "boolean",
				"auth": "boolean",
				cstoken: "string",
				"clientOS": "string",
				"clientCurVersion": "string",
				"clientMinVersion": "string",
				"clientLink": "string"
				
			},
			expect: {
				"ok": true,
				"auth": false,
				"clientNeedsUpgrade": true
			}
		}
	},
	
	auth_with_BB6Client_VersionWithinLimits: {
		step1: {
			url: "auth",
			verb: "POST",
			params: {
				username: "test1",
				password: "livelink",
				os: "BB6",
				version: "10.0.2.1", //Update this version to be within to your test environment's listed current and minimum versions
				bitness: "64",
				language: "en",
				osVersion: "7"
			},
			expectType: {
				"ok": "boolean",
				"auth": "boolean",
				cstoken: "string",
				"clientOS": "string",
				"clientCurVersion": "string",
				"clientMinVersion": "string",
				"clientLink": "string"
				
			},
			expect: {
				"ok": true,
				"auth": true,
				"clientNeedsUpgrade": null
			}
		}
	},
	
	auth_with_BB6Client_VersionLowerThanMinimum: {
		step1: {
			url: "auth",
			verb: "POST",
			params: {
				username: "test1",
				password: "livelink",
				os: "BB6",
				version: "10.0.2.0", //Update this version to be lower than your test environment's listed minimum version
				bitness: "64",
				language: "ja",
				osVersion: "7"
			},
			expectType: {
				"ok": "boolean",
				"auth": "boolean",
				cstoken: "string",
				"clientOS": "string",
				"clientCurVersion": "string",
				"clientMinVersion": "string",
				"clientLink": "string"
				
			},
			expect: {
				"ok": true,
				"auth": false,
				"clientNeedsUpgrade": true
			}
		}
	},
	
	auth_with_BB5Client_VersionWithinLimits: {
		step1: {
			url: "auth",
			verb: "POST",
			params: {
				username: "test1",
				password: "livelink",
				os: "BB5",
				version: "10.0.2.1", //Update this version to be within to your test environment's listed current and minimum versions
				bitness: "64",
				language: "en",
				osVersion: "7"
			},
			expectType: {
				"ok": "boolean",
				"auth": "boolean",
				cstoken: "string",
				"clientOS": "string",
				"clientCurVersion": "string",
				"clientMinVersion": "string",
				"clientLink": "string"
				
			},
			expect: {
				"ok": true,
				"auth": true,
				"clientNeedsUpgrade": null
			}
		}
	},
	
	auth_with_BB5Client_VersionLowerThanMinimum: {
		step1: {
			url: "auth",
			verb: "POST",
			params: {
				username: "test1",
				password: "livelink",
				os: "BB5",
				version: "10.0.2.0", //Update this version to be lower than your test environment's listed minimum version
				bitness: "64",
				language: "en",
				osVersion: "7"
			},
			expectType: {
				"ok": "boolean",
				"auth": "boolean",
				cstoken: "string",
				"clientOS": "string",
				"clientCurVersion": "string",
				"clientMinVersion": "string",
				"clientLink": "string"
				
			},
			expect: {
				"ok": true,
				"auth": false,
				"clientNeedsUpgrade": true
			}
		}
	},
	
	auth_with_NoClient_VersionLowerThanMinimum_No_OS_Bitness_OSVersion: {
		step1: {
			url: "auth",
			verb: "POST",
			params: {
				username: "test1",
				password: "livelink",
				version: "1.0.6", //Update this version to be lower than your test environment's listed minimum version
				language: "en"
			
			},
			expectType: {
				"ok": "boolean",
				"auth": "boolean",
				cstoken: "string"
								
			},
			expect: {
				"ok": true,
				"auth": true,
				"clientNeedsUpgrade": null,
				"clientOS": null,
				"clientCurVersion": null,
				"clientMinVersion": null,
				"clientLink": null
			}
		}
	},
	
	auth_with_64WindowsClient_VersionLowerThanMinimum_No_Language_Sent: {
		step1: {
			url: "auth",
			verb: "POST",
			params: {
				username: "test1",
				password: "livelink",
				os: "WIN",
				version: "1.0.6", //Update this version to be lower than your test environment's listed minimum version
				bitness: "64",
				osVersion: "7"
			},
			expectType: {
				"ok": "boolean",
				"auth": "boolean",
				cstoken: "string",
				"clientOS": "string",
				"clientCurVersion": "string",
				"clientMinVersion": "string",
				"clientLink": "string"
				
			},
			expect: {
				"ok": true,
				"auth": false,
				"clientNeedsUpgrade": true
			}
		}
	},
	
	auth_with_32WindowsClient_VersionLowerThanMinimum_No_Language_Exists: {
		step1: {
			url: "auth",
			verb: "POST",
			params: {
				username: "test1",
				password: "livelink",
				os: "WIN",
				version: "1.0.6", //Update this version to be lower than your test environment's listed minimum version
				bitness: "32",
				language: "xx",
				osVersion: "XP"
			},
			expectType: {
				"ok": "boolean",
				"auth": "boolean",
				cstoken: "string",
				"clientOS": "string",
				"clientCurVersion": "string",
				"clientMinVersion": "string",
				"clientLink": "string"
				
			},
			expect: {
				"ok": true,
				"auth": false,
				"clientNeedsUpgrade": true
			}
		}
	},
	
	auth_with_64WindowsClient_VersionLowerThanMinimum_No_Version: {
		step1: {
			url: "auth",
			verb: "POST",
			params: {
				username: "test1",
				password: "livelink",
				os: "WIN",
				bitness: "64",
				language: "en",
				osVersion: "7"
			},
			expectType: {
				"ok": "boolean",
				"auth": "boolean",
				cstoken: "string",
				"clientOS": "string",
				"clientCurVersion": "string",
				"clientMinVersion": "string",
				"clientLink": "string"
				
			},
			expect: {
				"ok": true,
				"auth": true,
				"clientNeedsUpgrade": null
			}
		}
	}
	
	**/
};
