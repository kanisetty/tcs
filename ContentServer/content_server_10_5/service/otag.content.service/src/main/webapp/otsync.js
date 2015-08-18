var CLIENTID = "";
var CSTOKEN = "";
var USERID = "";
var BACK_CHANNEL_TOKEN = "";
var CSBASEURL = "";

function setCookie(c_name,value,exdays)
{
var exdate=new Date();
exdate.setDate(exdate.getDate() + exdays);
var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
document.cookie=c_name + "=" + c_value;
}

(function($) {
    $(document).ready(function() {
        $("#action-forms").hide();
        $('#server-messages').css('height', ($(window).height() - '100') + 'px');
    });

    $(window).resize(function () {
        $('#server-messages').css('height', ($(window).height() - '100') + 'px');
    });
    $(document).scroll(function () {
        var scrolly = $(document).scrollTop() + 8;
        if (scrolly < 0) scrolly = 0;
        $('#responses').css('top', scrolly + 'px');
    });
})(jQuery);


//subscribe_events sends the server the long poll request and will wait in the background until a new event has occurred
function subscribe_events() {
    (function($) {
        $.ajax({
            url: 'BackChannel',
            type: 'POST',
            dataType: 'json',
            data: '{ "type": "subscribe", "subtype": "events", "username": "", "password": "", "clientID": "' + CLIENTID + '", "cstoken": "' + CSTOKEN + '", "token": "' + BACK_CHANNEL_TOKEN + '" }',
            contentType: 'application/json; charset=UTF-8',
            timeout: 0,
            success: function (data) {
            	var resubscribe = true;
            	
            	if(data != null && data.info != null && data.info.errMsg == null){
	                if (data.type == 'notification'){
	
		                switch (data.subtype) {
			                case 'foldercreated':
			                    add_folder_html(data.info.name + ' (created)');
			                    break;
			                case 'delete':
			                	add_folder_html(data.info.name + ' (deleted)');
			                	break;
			                case 'renamed':
			                	add_folder_html(data.info.name + ' (renamed)');
			                	break;
                            case 'move':
                                add_folder_html(data.info.name + ' (moved)');
			                    break;
                            case 'copy':
                                add_folder_html(data.info.name + ' (copied)');
			                    break;
                            case 'filecreated':
                            	add_file_html(data.info.name + ' (created)');
			                    break;
                            case 'versionadded':
                                add_file_html(data.info.name + ' (version added)');
			                    break;
			                default:
								if (data != null) {
			                    	add_server_message_html(formatJsonObject(data));
			                	}
				                break;
		                }
	                }
	                else {
	                	add_server_message_html(formatJsonObject(data));
	                	resubscribe = false;
	                }
            	} else if (data != null && data.info != null && data.info.errMsg != null) {
					add_server_message_html(unescape(data.info.errMsg));
            	} else {
            		if (data != null) {
                    	add_server_message_html(formatJsonObject(data));
                	}
            	}
            	
				if (data != null && data.token != null) {
					BACK_CHANNEL_TOKEN = data.token;
				}
				
				if (resubscribe) {
					subscribe_events();  //need to resubscribe to get the next event
				}
            },
            error: function (data, textStatus, errorThrown) {
                add_server_message_html(errorThrown);
            }
        });
    })(jQuery);
}

function send_request(jsonStr) {
    (function($) {
        $.ajax({
            url: 'FrontChannel',
            type: 'POST',
            dataType: 'json',
            data: jsonStr,
            contentType: 'application/json; charset=UTF-8',
            success: function (data) {
		    	var i;
		    	var msg;
		    	
            	if(data.info && data.info.ok == true){
	            	switch (data.type) { 
	            	case 'auth': 
	                    if (data.info.auth == true) {
	                        CLIENTID = data.clientID;
	                        CSTOKEN = data.cstoken;
	                        BACK_CHANNEL_TOKEN = data.token;
	                        USERID = data.info.userID;
	                        CSBASEURL = data.info.csbaseurl;
	                        
	                        $("#login-form").hide();
	                        $("#action-forms").show();
	                        
	                        subscribe_events(data.client_id, data.cookie, data.cs_user_id);
	                    }
	                    else {
	                        msg = "Authentication Failed";
	                        if (data.info.errMsg != null)
	                            msg += ": " + unescape(data.info.errMsg);
	                        alert(msg);
	                    }
	            		break;
	            		
	                case 'request':
		                switch (data.subtype) {
		                	case 'getfoldercontents':
		                	case 'getsynctree':
		                		add_folder_contents_html(data.info.results.contents);
								break;
			                case 'gethistory':
			                	for(i in data.info.results){
			                		event = data.info.results[i];
			                		add_server_message_html(event.AUDITDATE + ": " + event.EVENTDISPLAYNAME + " by " + event.USERNAME);
			                		add_server_message_html("-->" + event.VALUE1 + "; " + event.VALUE2);
			                	}
			                	break;
			                default:
			                	if (data != null) {
			                    	add_server_message_html(formatJsonObject(data));
			                	}
				                break;
		                }	                
		            	break;
		            
	                case 'pulse':
	                	//add_server_message_html(formatJsonObject(data));
	                	msg = '';
	                	for(i in data.info){
	                		comment = data.info[i];
	                		msg += '<div class="comment"><div class="comment-image"><img src="' + get_download_url(null, comment.user.profile_image_url) + '" title="Profile Photo"></div>';
	                		msg += '<div class="comment-inner"><div class="comment-info">' + comment.user.screen_name + ': ' + comment.text + '</div>';
	                		msg += '<div class="comment-date">' + comment.created_at + '</div>';
	                		if (comment.attachment_richtext != null && comment.attachment_richtext != '') {
	                			msg += '<div class="comment-attachments">' + get_pulse_attachment_html(comment.attachment_richtext) + '</div>';
	                		}
	                		msg += '</div></div>';
	                	}
                		add_server_message_html(msg);
	                	break;
	                    
	                }
            	} else if (data.info && data.info.errMsg != null) {
					add_server_message_html(unescape(data.info.errMsg));
            	} else {
            		if (data != null) {
                    	add_server_message_html(formatJsonObject(data));
                	}
            	}
                
				if (data.cstoken != null) {
                	CSTOKEN = data.cstoken;
                	setCookie("LLCookie", unescape(CSTOKEN), 30);
				}
            },
            error: function (data, textStatus, errorThrown) {
                add_server_message_html(errorThrown);
            }
        });
    })(jQuery);
}

function execute_request(type, subtype) {
	var jsonString = build_request(type, subtype);
	send_request(jsonString);
}

function build_request(type, subtype, chunked) {
    return (function($) {
		var username = $("#user").val();
		var password = $("#pass").val();
		var request = '';
		
		switch(subtype) {
		case 'auth':
			var storeResponses = $("#auth_sr").val();
			var authCookie = $("#auth_cookie").val();
			if(storeResponses == "")
				return '{ "type": "' + type + '", "subtype": "' + subtype + '", "cstoken": "' + authCookie + '", "username": "' + username + '", "password": "' + password + '" }';
			else
				return '{ "type": "' + type + '", "subtype": "' + subtype + '", "cstoken": "' + authCookie + '", "username": "' + username + '", "password": "' + password + '", "storeResponses": "' + storeResponses + '" }';
			
		case 'serverCheck':
			return '{"type":"serverCheck"}';
			
		case 'createfolder':
			var foldername = addslashes($("#cf_foldername").val());
			var parentid = $("#cf_parentid").val();
			var merge = $("#cf_merge").val();
			request = '"info": { "parentID":"' + parentid + '", "name":"' + foldername + '", "mergeOnConflict":"' + merge + '" }';
			break;
	
		case 'rename':
			var foldername = addslashes($("#rf_foldername").val());
			var nodeid = $("#rf_nodeid").val();
			request = '"info": { "newname":"' + foldername + '", "nodeID":"' + nodeid + '" }';
			break;

                case 'move':
			var newname = $("#mn_newname").val();
			var nodeid = $("#mn_nodeid").val();
                        var parentid = $("#mn_parentid").val();
			request = '"info": { "nodeID":"' + nodeid + '", "parentID":"' + parentid + '", "newname":"' + newname + '" }';
			break;

                case 'copy':
			var newname = $("#cn_newname").val();
			var nodeid = $("#cn_nodeid").val();
                        var parentid = $("#cn_parentid").val();
			request = '"info": { "nodeID":"' + nodeid + '", "parentID":"' + parentid + '", "newname":"' + newname + '" }';
			break;
			
		case 'delete':
			var nodeid = $("#df_nodeid").val();
			request = '"info": { "nodeID":"' + nodeid + '" }';
			break;
			
		case 'getfoldercontents':
			var nodeid = $("#gfc_nodeid").val();
			var sort = $("#gfc_sort").val();
			var page = $("#gfc_page").val();
			var pagesize = $("#gfc_pagesize").val();
			var desc = ($("#gfc_desc").is(":checked")) ? "true" : "false"; 
			var fields = $("#gfc_fields").val();
			if(fields == "") fields = '""';
			
			request = '"info": { "containerID": "' + nodeid + '", "sort": "' + sort + '", "page": "' + page + '", "pageSize": "' + pagesize + '", "desc": ' + desc + ', "fields":' + fields + ' }';
			break;
			
		case 'getsynctree':
			var nodeid = $("#gst_nodeid").val();
			var fields = $("#gst_fields").val();
			if(fields == "") fields = '""';
			
			request = '"info": { "nodeID": "' + nodeid + '", "fields":' + fields + ' }';
			break;
			
		case 'getobjectinfo':
			var nodeids = $("#goi_nodeids").val();
			if (nodeids == '') nodeids = '[]';
			var fields = $("#goi_fields").val();
			if(fields == "") fields = '""';
			
			request = '"info": { "nodeIDs": ' + nodeids + ', "fields":' + fields + ' }';
			break;
			
		case 'gethistory':
			var nodeID = $("#gfh_nodeid").val();
			var numRows = $("#gfh_numrows").val();
			var pageNumber = $("#gfh_pagenumber").val();
			var maxHistorySize = $("#gfh_maxhistorysize").val();
			request = '"info": { "nodeID":"' + nodeID + '", "numRows":"' + numRows +'", "pageNumber":"' + pageNumber + '", "maxHistorySize":"' + maxHistorySize + '" }';
			break;
			
		case 'GetComments':
			var nodeid = $("#gcfo_nodeid").val();
			request = '"info": { "nodeID":"' + nodeid + '" }';
			break;
			
		case 'AddComment':
			var nodeid = $("#acfo_nodeid").val();
			var status = addslashes($("#acfo_status").val());
			request = '"info": { "status":"' + status + '", "nodeID":"' + nodeid + '" }';
			break;
			
		case 'Upload':
			var nodeid;
			var filename;
			var lastpart = "";
			
			if (chunked == true) {
				nodeid = $("#ch_upload_parent").val();
				filename = $("#ch_upload_file").val();
				lastpart = ($("#ch_last_part").is(":checked")) ? ",\"lastpart\":\"true\"" : ""; 
			}
			else {
				nodeid = $("#upload_parent").val();
				filename = $("#upload_file").val();
			}
			request = '"info":{"parentID":"' + nodeid + '","name":"' + filename + '"' + lastpart + '}';
			break;
			
		case 'uploadprofilephoto':
			request = ($("#chp_last_part").is(":checked")) ? '"info":{"lastpart":"true"}' : "";
			break;

		case 'search':
			var infoBuild = '"info": { ';

			var query = $("#search_query").val();
			if ( query != null && query != "" )
				infoBuild += '"query":"' + query + '"';

			var searchLocation = $("#search_searchLocation").val();
			if ( searchLocation != null && searchLocation != "" )
				infoBuild += ',"searchLocation":' + searchLocation;

			var sort = $("#search_sort").val();
			if ( sort != null && sort != "" )
				infoBuild += ',"sort":"' + sort + '"';

			var asc = $("#search_asc").val();
			if ( asc != null && asc != "" )
				infoBuild += ',"asc":' + asc;

			var pageSize = $("#search_pageSize").val();
			if ( pageSize != null && pageSize != "" )
				infoBuild += ',"pageSize":' + pageSize;

			var pageNumber = $("#search_pageNumber").val();
			if ( pageNumber != null && pageNumber != "" )
				infoBuild += ',"pageNumber":' + pageNumber;



			infoBuild += '}';

			request = infoBuild;
			break;


		case 'UploadVersion':
			var nodeid = $("#object_id").val();
			request = '"info":{"nodeID":"' + nodeid + '"}';
			break;

		case 'DownloadRequest':
			// intentional fallthrough
		case 'UploadRequest':
			request = '';
			break;
			
		case 'share':
			var nodeid = $("#share_nodeid").val();
                        var users = $("#share_user").val();
                        var shareTypes = $("#share_sharetype").val();
                        var userList = parseUserListAndShareTypes(users, shareTypes);
            
                        request = '"info": { "nodeID":"' + nodeid + '", "userList":' + userList + ' }';
			break;
		
		case 'unshare':
			var nodeid = $("#unshare_nodeid").val();
                        var users = $("#unshare_user").val();
                        var userList = parseUserList(users);
            
                        request = '"info": { "nodeID":"' + nodeid + '", "userList":' + userList + ' }';
			break;

                case 'unshareall':
			var nodeid = $("#unshareall_nodeid").val();

                        request = '"info": { "nodeID":"' + nodeid + '"}';
			break;

                case 'acceptsharerequest':
			var nodeid = $("#asr_nodeid").val();
			request = '"info": { "nodeID":"' + nodeid + '" }';
			break;
			
		case 'rejectsharerequest':
			var nodeid = $("#rsr_nodeid").val();
			request = '"info": { "nodeID":"' + nodeid + '" }';
			break;
			
		case 'getsharelist':
			var pagesize = $("#gsl_pagesize").val();
			var pagenum = $("#gsl_pagenumber").val();
			request = '"info": { "pageSize":"' + pagesize + '", "pageNumber":"' + pagenum + '" }';
			break;
			
		case 'getsharelistcount':
			request = '';
			break;

		case 'getlocationpath':
			var nodeid = $("#glp_nodeid").val();
			request = '"info": { "nodeID":"' + nodeid + '" }';
			break;

        case 'usersearch':
			var searchStr = $("#us_searchstr").val();
			var limit = $("#us_limit").val();
			request = '"info": { "searchStr":"' + searchStr + '", "limit":"' + limit + '" }';
			break;
			
        case 'getsharedbyuser':
			var pagesize = $("#gsbu_pagesize").val();
			var pagenum = $("#gsbu_pagenumber").val();
			var sortby = $("#gsbu_sortby").val();
			var descending = $("#gsbu_descending").val();
			request = '"info": { "pageSize":"' + pagesize + '", "pageNumber":"' + pagenum + '", "sortOn": "' + sortby + '", "sortDescending":"' + descending + '" }';
        	break;

        case 'getsharesforobject':
			var nodeid = $("#gsbo_nodeid").val();
			request = '"info": { "nodeID":"' + nodeid + '" }';
        	break;
		
        case 'getversionhistory':
        	var nodeid = $("#gvh_nodeid").val();
			var pagesize = $("#gvh_pagesize").val();
			var pagenum = $("#gvh_pagenumber").val();
			request = '"info": { "nodeID":"' + nodeid + '", "pageSize":"' + pagesize + '", "pageNumber":"' + pagenum + '" }';
			break;
        	
        case 'pubtofilecopy':
        	var nodeid = $("#p2dc_nodeid").val();
        	var target = $("#p2dc_target").val();
        	var version = $("#p2dc_version").val();
        	request = '"info": { "nodeID":"' + nodeid + '", "target":"' + target + '", "version":"' + version + '" }';
        	break;
        	
        case 'pubtofilemove':
        	var nodeid = $("#p2dm_nodeid").val();
        	var target = $("#p2dm_target").val();
        	var version = $("#p2dm_version").val();
        	request = '"info": { "nodeID":"' + nodeid + '", "target":"' + target + '", "version":"' + version + '" }';
        	break;
        	
        case 'multi':
        	var info = $("#multi_info").val();
        	request = '"info":' + info;
        	break;
			
		default:
			alert("Bad Request Type");
			return '{}';
		}
    
		if (request != '') {
			return '{"type":"' + type + '","subtype":"' + subtype + '","username":"' + username + '","password":"' + password + '","clientID":"' + CLIENTID + '","cstoken":"' + CSTOKEN + '",' + request + '}';
		}
		else {
			return '{"type":"' + type + '","subtype":"' + subtype + '","username":"' + username + '","password":"' + password + '","clientID":"' + CLIENTID + '","cstoken":"' + CSTOKEN + '"}';
		}
    })(jQuery);
}

function parseUserListAndShareTypes(users, shareTypes){

	var resultList = '[';
	var userArray = users.split(",");
	var shareArray = shareTypes.split(",");
	 
	 
	for ( var i = 0; i<userArray.length; i++ ) {
		resultList += '{"userLogin":"' + userArray[i] + '", "shareType":"'+ shareArray[i] +'" }';
		if(i < userArray.length-1){
			resultList += ',';
		}
	}
	
	resultList += ']';
	
	return resultList;
}

function parseUserList(users){

	var resultList = '[';
	var userArray = users.split(",");
	 
	for ( var i = 0; i<userArray.length; i++ ) {
		resultList += '"' + userArray[i] + '"';
		if(i < userArray.length-1){
			resultList += ',';
		}
	}
	
	resultList += ']';
	
	return resultList;
}

function add_server_message_html(message) {
    $('#server-messages').prepend('<div class="msg">' + message + '</div>');
}

function clear_server_messages(){
	$('#server-messages').empty();
}

function formatJsonObject(jsonObj) {
	var output = '<div class="formatted-json">';
	
	for (property in jsonObj) {
		if (typeof(jsonObj[property]) == 'object') {
			output += '<div>' + property + ':' + '<div style="padding-left: 20px;">' + formatJsonObject(jsonObj[property]) + '</div></div>';
		}
		else {
			output += '<div>' + property + ': ' + jsonObj[property] + '; ' + '</div>';
		}
	}
	
	output += '</div>';
	
	return output;	
}

//adds the html to the <ul> to show a folder has been created
function add_folder_html(folder) {
   	add_server_message_html('<img src="images/folder.png"> ' + folder);
}

function add_file_html(file) {
   	add_server_message_html('<img src="images/file.png"> ' + file);
}

function add_folder_contents_html(contents) {
	var ret = '';
	var files = 0;
	var dirs = 0;
	for (var item in contents) {
		if (contents[item].SUBTYPE != 0) {
			ret += '<span title="' + contents[item].DATAID + '"><img src="images/file.png"> ' + contents[item].NAME + ' [' + contents[item].DATASIZE + 'b] </span><br>';
			files++;
		}
		else {
			ret += '<span title="' + contents[item].DATAID + '"><img src="images/folder.png"> ' + contents[item].NAME + ' [' + contents[item].CHILDCOUNT + '] </span><br>';
			dirs++;
		}
	}
	add_server_message_html("Files: " + files + " Dirs: " + dirs);
	add_server_message_html(ret);
}

function get_download_url(nodeID, srcUrl) {
	var url = '';
	
	if (nodeID != null) {
		url = 'ChunkedContentChannel?url=&nodeID=' + nodeID;
	}
	else if (srcUrl != null) {
		url = 'ChunkedContentChannel?url=' + encodeURIComponent(srcUrl) + '&nodeID=';
	}

	return url;
}

function download(chunked) {
	(function($) {
		if (chunked == true) {
			$('#ch_content_llcookie').val(CSTOKEN);
		}
		else {
			$('#content_llcookie').val(CSTOKEN);
		}
		return true;
	})(jQuery);
}

function upload(chunked) {
	(function($) {
		if (chunked == true) {
			$('#ch_upload_payload').val(build_request('content', 'Upload', chunked));
		}
		else {
			$('#upload_payload').val(build_request('content', 'Upload', chunked));
		}
		return true;
	})(jQuery);
}

function photo_upload(){
	jQuery('#chp_upload_payload').val(build_request('content', 'uploadprofilephoto'));
	return true;
}

function upload_version() {
	(function($) {
		$('#upload_version_payload').val(build_request('content', 'UploadVersion'));
		return true;
	})(jQuery);
}

function addslashes(str) {
	return str.replace(/\\/g, '\\\\').replace(/\"/g, '\\\"');
}


function get_pulse_attachment_html(attachment) {
	var retval = '';

	(function($) {
		$("#notepad").html(attachment);
		retval = '<div><img src="'+get_download_url(null, $('img[alt="Document"]', $("#notepad")).attr('src'))+'">';
		retval += '<a target="_blank" href="'+CSBASEURL+$('span', $("#notepad")).attr('url')+'">'+$('span', $("#notepad")).html()+'</a></div>';
	})(jQuery);

	return retval;
}
