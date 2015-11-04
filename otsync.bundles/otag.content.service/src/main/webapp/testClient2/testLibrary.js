/**
List all common test steps here, such as auth and create node. Basically any
test that has reuse value. Format is comma-separated as test_name : { steps }
Each step is step_name : { parameters }

see tests object (below) for parameters.
**/

var lib = {
	
	auth: {
		url: "auth",
		verb: 'POST',
		params: {
			username: "$userName$",
			password: 'livelink',
			type: "rest test client",
			language: "english",
			os: "windows",
			cloudPushKey: "test cloud key",
			clientID: "tempo api tests"
		},
		expectType: {
			"ok": "boolean",
			"auth": "boolean",
			"cstoken": "string",
			"rootFolder": "number"
		},
		expect: {
			"ok": true,
			"auth": true
		},
		remember: {
			cstoken: "cookie",
			token: "token",
			clientID: "clientID",
			rootFolder: "rootFolder",
			userID : "userID",
			userName: "userName",
			userID: "userID",
			firstName: "firstName",
			lastName: "lastName"
		}
	},
	createFolder: {
		url: "nodes/$parentID$/children",
		verb: "POST",
		params: {
			cstoken: "$cstoken$",
			name: "$name$"
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
	rename : {
		url : "nodes/$id$",
		verb : "PUT",
		params : { name : "$name$", cstoken : "$cstoken$" },
		expectType : { ok : "boolean" },
		expect : { ok : true }
	},
	share : {
		url : "shares/outgoing/$id$/users/$userName$",
		verb : "POST",
		params : { shareType : "$shareType$", cstoken : "$cstoken$" },
		expectType : { ok : "boolean" },
		expect : { ok : true }
	},
	unshare : {
		url : "shares/outgoing/$id$/users/$userName$",
		verb : "DELETE",
		params: { cstoken : "$cstoken$" },
		expectType : { ok : "boolean" },
		expect : { ok : true }
	},
	unshareAll : {
		url : "shares/outgoing/$id$",
		verb : "DELETE",
		params: { cstoken : "$cstoken$" },
		expectType : { ok : "boolean" },
		expect : { ok : true }
	},
	shareCount : {
		url : "shares/incoming",
		verb : "GET",
		params : { countOnly : true, cstoken : "$cstoken$" },
		expectType : { ok : "boolean", shareCount : "number" },
		expect: { ok : true, shareCount : "$expectedShareCount$" }
	},
	accept : {
		url : "shares/incoming/$id$",
		verb : "PUT",
		params : { accepted : true, cstoken : "$cstoken$" },
		expectType : { ok : "boolean" },
		expect : { ok : true }
	},
	reject : {
		url : "shares/incoming/$id$",
		verb : "PUT",
		params : { rejected : true, cstoken : "$cstoken$" },
		expectType : { ok : "boolean" },
		expect : { ok : true }
	},
	changeShare : {
		url : "shares/outgoing/$id$/users/$userID$",
		verb : "PUT",
		params : { shareType : "$shareType$", cstoken : "$cstoken$" },
		expectType : { ok : "boolean" },
		expect : { ok : true }
	},
	getSeqNo : {
		url : "notifications",
		verb : "GET",
		params: {
			cstoken: "$cookie$",
			token: "$token$",
			clientID: "$clientID$",
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
			"maxSeqNo": "lastEvent",
		}
	}
					
};
