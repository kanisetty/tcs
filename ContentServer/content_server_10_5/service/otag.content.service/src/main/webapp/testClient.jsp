<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>TEMPO Generic Client</title>

<link rel="stylesheet" type="text/css" href="style.css"></link>

<script	src="http://ajax.googleapis.com/ajax/libs/jquery/1.5.2/jquery.min.js" type="text/javascript"></script>
<script	src="otsync.js" type="text/javascript"></script>

</head>

<body>

<!-- generic message container -->
<div id="result"></div>

<div id="requests">
    <div id="login-form">
	    <fieldset><legend>Login</legend>
	        <form action="index.jsp" method="post" onsubmit="execute_request('auth', 'auth'); return false;">
	            <div class="label">Username:</div><div class="field"><input type="text" id="user" name="user" value=""></div>
	            <div class="label">Password:</div><div class="field"><input type="password" id="pass" name="pass" value=""></div>
	            <div class="label">Cookie:</div><div class="field"><input type="text" id="auth_cookie" name="auth_cookie" value=""></div>
	            <div class="label">Max stored responses:</div><div class="field"><input type="text" id="auth_sr" name="auth_sr" value=""></div>
	            <div class="label"><input type="submit" value="Log In"></div>
	        </form>
		</fieldset>
		
		<fieldset><legend>Check Server</legend>
	        <form action="index.jsp" method="post" onsubmit="execute_request('serverCheck', 'serverCheck'); return false;">
	            <div class="label"><input type="submit" value="Check Server"></div>
	        </form>
		</fieldset>
    </div>
	
    <div id="action-forms">
	    <fieldset><legend>Create Folder</legend>
	        <form action="index.jsp" method="post" onsubmit="execute_request('request', 'createfolder'); return false;">
	            <div class="label">Folder Name:</div><div class="field"><input type="text" id="cf_foldername" name="foldername" value=""></div>
	            <div class="label">Parent ID:</div><div class="field"><input type="text" id="cf_parentid" name="cf_parentid" value=""></div>
	            <div class="label">mergeOnConflict:</div><div class="field"><input type="text" id="cf_merge" name="cf_merge" value=""></div>
	            <div class="label"><input type="submit" value="Create Folder"></div>
	        </form>
		</fieldset>
	    <fieldset><legend>Rename Object</legend>
	        <form action="index.jsp" method="post" onsubmit="execute_request('request', 'rename'); return false;">
	            <div class="label">Folder Name:</div><div class="field"><input type="text" id="rf_foldername" name="foldername" value=""></div>
	            <div class="label">Node ID:</div><div class="field"><input type="text" id="rf_nodeid" name="rf_nodeid" value=""></div>
	            <div class="label"><input type="submit" value="Rename Folder"></div>
	        </form>
		</fieldset>
	    <fieldset><legend>Delete Object</legend>
	        <form action="index.jsp" method="post" onsubmit="execute_request('request', 'delete'); return false;">
	            <div class="label">Node ID:</div><div class="field"><input type="text" id="df_nodeid" name="df_nodeid" value=""></div>
	            <div class="label"><input type="submit" value="Delete Folder"></div>
	        </form>
		</fieldset>
	    <fieldset><legend>Get Folder Contents</legend>
	        <form action="index.jsp" method="post" onsubmit="execute_request('request', 'getfoldercontents'); return false;">
	            <div class="label">Folder ID:</div><div class="field"><input type="text" id="gfc_nodeid" name="gfc_nodeid" value=""></div>
	            <div class="label">Page:</div><div class="field"><input type="text" id="gfc_page" name="gfc_page" value="" size="3"></div>
	            <div class="label">Page Size:</div><div class="field"><input type="text" id="gfc_pagesize" name="gfc_pagesize" value="" size="3"></div>
	            <div class="label">Sort:</div><div class="field"><input type="text" id="gfc_sort" name="gfc_sort" value=""></div>
	            <div class="label">Desc?:</div><div class="field"><input type="checkbox" id="gfc_desc" name="gfc_desc" value="1"></div>
	            <div class="label">Fields:</div><div class="field"><input type="text" id="gfc_fields" name="gfc_fields" value=""></div>
	            <div class="label"><input type="submit" value="Get Folder Contents"></div>
	        </form>
		</fieldset>
	    <fieldset><legend>Get Sync Tree</legend>
	        <form action="index.jsp" method="post" onsubmit="execute_request('request', 'getsynctree'); return false;">
	            <div class="label">Folder ID:</div><div class="field"><input type="text" id="gst_nodeid" name="gst_nodeid" value=""></div>
	            <div class="label">Fields:</div><div class="field"><input type="text" id="gst_fields" name="gst_fields" value=""></div>
	            <div class="label"><input type="submit" value="Get Sync Tree"></div>
	        </form>
		</fieldset>
	    <fieldset><legend>Get Object Info</legend>
	        <form action="index.jsp" method="post" onsubmit="execute_request('request', 'getobjectinfo'); return false;">
	            <div class="label">Node IDs:</div><div class="field"><input type="text" id="goi_nodeids" name="goi_nodeids" value=""></div>
	            <div class="label">Fields:</div><div class="field"><input type="text" id="goi_fields" name="goi_fields" value=""></div>
	            <div class="label"><input type="submit" value="Get Object Info"></div>
	        </form>
		</fieldset>
	    <fieldset><legend>Get Folder History</legend>
	        <form action="index.jsp" method="post" onsubmit="execute_request('request', 'gethistory'); return false;">
	            <div class="label">Folder ID:</div><div class="field"><input type="text" id="gfh_nodeid" name="gfh_nodeid" value=""></div>
	            <div class="label">Number of Rows:</div><div class="field"><input type="text" id="gfh_numrows" name="gfh_numrows" value=""></div>
	            <div class="label">Page Number:</div><div class="field"><input type="text" id="gfh_pagenumber" name="gfh_pagenumber" value=""></div>
	            <div class="label">Max History Size:</div><div class="field"><input type="text" id="gfh_maxhistorysize" name="gfh_maxhistorysize" value=""></div>
	            <div class="label"><input type="submit" value="Get Folder History"></div>
	        </form>
		</fieldset>
		<fieldset>
			<legend>Get Comments For Object</legend>
			<form action="index.jsp" method="post" onsubmit="execute_request('pulse', 'GetComments'); return false;">
				<div class="label">Node ID:</div>
				<div class="field"><input type="text" id="gcfo_nodeid" name="gcfo_nodeid" value=""></div>
				<div class="label"><input type="submit" value="Get Comments"></div>
			</form>
		</fieldset>
		<fieldset>
			<legend>Comment On Object</legend>
			<form action="index.jsp" method="post" onsubmit="execute_request('pulse', 'AddComment'); return false;">
				<div class="label">Node ID:</div>
				<div class="field"><input type="text" id="acfo_nodeid" name="acfo_nodeid" value=""></div>
				<div class="label">Comment:</div>
				<div class="field"><input type="text" id="acfo_status" name="acfo_status" value="" maxlength="1000"></div>
				<div class="label"><input type="submit" value="Post Comment"></div>
			</form>
		</fieldset>
		
		
		<fieldset>
			<legend>Get Download Authorization</legend>
			<form action="index.jsp" method="post" onsubmit="execute_request('contentRequest', 'DownloadRequest'); return false;">
				<div class="label"><input type="submit" value="Send Request"></div>
			</form>
		</fieldset>
		<fieldset>
			<legend>Download File (by url <em>or</em> nodeid)</legend>
			<!-- Using a standard download for with a script to set the llcookie. Uses a new window/tab because otherwise
			Firefox (and perhaps other browsers) interprets this as leaving the page and kills the back-channel connection.
			The alternative would be to run a script to re-establish the back-channel after a download request goes out;
			I'm not sure offhand how to hook that up, though. -->
			<form action="ContentChannel" method="get" onsubmit="download(false);" target="_blank">
				<div class="label">URL:</div>
				<div class="field"><input type="text" id="content_url" name="url" value=""></div>
				<div class="label">Node ID:</div>
				<div class="field"><input type="text" id="content_nodeID" name="nodeID" value=""></div>
				<div class="label">Version:</div>
				<div class="field"><input type="text" id="content_vernum" name="vernum" value=""></div>
				<div class="label"><input type="submit" value="Download File"></div>
				<input type="hidden" name="LLCookie" id="content_llcookie"/>
			</form>
		</fieldset>
		<fieldset>
			<legend>Get Upload Authorization</legend>
			<form action="index.jsp" method="post" onsubmit="execute_request('contentRequest', 'UploadRequest'); return false;">
				<div class="label"><input type="submit" value="Send Request"></div>
			</form>
		</fieldset>
		<fieldset>
			<legend>Upload File</legend>
			<form action="ContentChannel" method="post" enctype="multipart/form-data" onsubmit="upload(false);" target="_blank">
				<input type="hidden" name="func" value="otsync.otsyncrequest"/>
				<input type="hidden" name="payload" id="upload_payload"/>
				<div class="label">Parent ID:</div>
				<div class="field"><input type="text" id="upload_parent" name="upload_parent"/></div>
				<div class="label">File to upload:</div>
				<div class="field"><input type="file" name="versionFile" id="upload_file"/></div>
				<div class="field"><input type="submit" value="Upload File"/></div>
			</form>
		</fieldset>

        <fieldset><legend>Move Node</legend>
	        <form action="index.jsp" method="post" onsubmit="execute_request('request', 'move'); return false;">
	            <div class="label">Node ID:</div><div class="field"><input type="text" id="mn_nodeid" name="mn_nodeid" value=""></div>
	            <div class="label">ID of the container to move to:</div><div class="field"><input type="text" id="mn_parentid" name="mn_parentid" value=""></div>
                    <div class="label">New Name (optional):</div><div class="field"><input type="text" id="mn_newname" name="mn_newname" value=""></div>
	            <div class="label"><input type="submit" value="Move Node"></div>
	        </form>
		</fieldset>

        <fieldset><legend>Copy Node</legend>
	        <form action="index.jsp" method="post" onsubmit="execute_request('request', 'copy'); return false;">
	            <div class="label">Node ID:</div><div class="field"><input type="text" id="cn_nodeid" name="cn_nodeid" value=""></div>
	            <div class="label">ID of the container to copy to:</div><div class="field"><input type="text" id="cn_parentid" name="cn_parentid" value=""></div>
                    <div class="label">New Name (optional):</div><div class="field"><input type="text" id="cn_newname" name="cn_newname" value=""></div>
	            <div class="label"><input type="submit" value="Copy Node"></div>
	        </form>
		</fieldset>
		
		<fieldset>
			<legend>Get Chunked Download Authorization</legend>
			<form action="index.jsp" method="post" onsubmit="execute_request('chunkedContentRequest', 'DownloadRequest'); return false;">
				<div class="label"><input type="submit" value="Send Request"></div>
			</form>
		</fieldset>
		<fieldset>
			<legend>Chunked Download File (by url <em>or</em> nodeid)</legend>
			<!-- Using a standard download for with a script to set the llcookie. Uses a new window/tab because otherwise
			Firefox (and perhaps other browsers) interprets this as leaving the page and kills the back-channel connection.
			The alternative would be to run a script to re-establish the back-channel after a download request goes out;
			I'm not sure offhand how to hook that up, though. -->
			<form action="ChunkedContentChannel" method="get" onsubmit="download(true);" target="_blank">
				<div class="label">URL:</div>
				<div class="field"><input type="text" id="ch_content_url" name="url" value=""></div>
				<div class="label">Node ID:</div>
				<div class="field"><input type="text" id="ch_content_nodeID" name="nodeID" value=""></div>
				<div class="label"><input type="submit" value="Chunked Download File"></div>
				<input type="hidden" name="LLCookie" id="ch_content_llcookie"/>
			</form>
		</fieldset>
		<fieldset>
			<legend>Get Chunked Upload Authorization</legend>
			<form action="index.jsp" method="post" onsubmit="execute_request('chunkedContentRequest', 'UploadRequest'); return false;">
				<div class="label"><input type="submit" value="Send Request"></div>
			</form>
		</fieldset>
		<fieldset>
			<legend>Chunked Upload File</legend>
			<form action="ChunkedContentChannel" method="post" enctype="multipart/form-data" onsubmit="upload(true);" target="_blank">
				<input type="hidden" name="func" value="otsync.otsyncrequest"/>
				<input type="hidden" name="payload" id="ch_upload_payload"/>
				<div class="label">Parent ID:</div>
				<div class="field"><input type="text" id="ch_upload_parent" name="upload_parent"/></div>
				<div class="label">File to upload:</div>
				<div class="field"><input type="file" name="versionFile" id="ch_upload_file"/></div>
				<div class="label">Last Part?</div>
				<div class="field"><input type="checkbox" value="1" name="lastPart" id="ch_last_part"/></div>
				<div class="label"><input type="submit" value="Upload File"/></div>
			</form>
		</fieldset>
		<fieldset>
			<legend>Chunked Upload Photo</legend>
			<form action="ChunkedContentChannel" method="post" enctype="multipart/form-data" onsubmit="photo_upload();" target="_blank">
				<input type="hidden" name="func" value="otsync.otsyncrequest"/>
				<input type="hidden" name="payload" id="chp_upload_payload"/>
				<div class="label">File to upload:</div>
				<div class="field"><input type="file" name="Photo" id="chp_upload_file"/></div>
				<div class="label">Last Part?</div>
				<div class="field"><input type="checkbox" value="1" name="lastPart" id="chp_last_part"/></div>
				<div class="label"><input type="submit" value="Upload Photo"/></div>
			</form>
		</fieldset>
		
        <fieldset>
			<legend>Upload Version</legend>
			<form action="ContentChannel" method="post" enctype="multipart/form-data" onsubmit="upload_version();" target="_blank">
				<input type="hidden" name="func" value="otsync.otsyncrequest"/>
				<input type="hidden" name="payload" id="upload_version_payload"/>
				<div class="label">Object ID:</div>
				<div class="field"><input type="text" id="object_id" name="object_id"/></div>
				<div class="label">File to upload:</div>
				<div class="field"><input type="submit" value="Upload File"/></div>
				<div class="field"><input type="file" name="versionFile" id="upload_version_file"/></div>
			</form>
		</fieldset>
                
		<fieldset><legend>Send Sharing Request</legend>
			<form action="index.jsp" method="post" onsubmit="execute_request('request', 'share'); return false;">
			    <div class="label">Node ID:</div><div class="field"><input type="text" id="share_nodeid" name="share_nodeid" value=""></div>
			           <div class="label">User:</div><div class="field"><input type="text" id="share_user" name="share_user" value=""></div>
			           <div class="label">Share Type:</div><div class="field"><input type="text" id="share_sharetype" name="share_sharetype" value=""></div>
			    <div class="label"><input type="submit" value="Share"></div>
			</form>
		</fieldset>
		
		<fieldset><legend>Send Unshare Request</legend>
			<form action="index.jsp" method="post" onsubmit="execute_request('request', 'unshare'); return false;">
			    <div class="label">Node ID:</div><div class="field"><input type="text" id="unshare_nodeid" name="unshare_nodeid" value=""></div>
	            <div class="label">User:</div><div class="field"><input type="text" id="unshare_user" name="unshare_user" value=""></div>
			    <div class="label"><input type="submit" value="Unshare"></div>
			</form>
		</fieldset>

                <fieldset><legend>Send Unshare All Request</legend>
			<form action="index.jsp" method="post" onsubmit="execute_request('request', 'unshareall'); return false;">
			    <div class="label">Node ID:</div><div class="field"><input type="text" id="unshareall_nodeid" name="unshareall_nodeid" value=""></div>
			    <div class="label"><input type="submit" value="Unshare"></div>
			</form>
		</fieldset>

	    <fieldset><legend>Accept Sharing Request</legend>
	        <form action="index.jsp" method="post" onsubmit="execute_request('request', 'acceptsharerequest'); return false;">
	            <div class="label">Node ID:</div><div class="field"><input type="text" id="asr_nodeid" name="asr_nodeid" value=""></div>
	            <div class="label"><input type="submit" value="Accept Share"></div>
	        </form>
		</fieldset>

	    <fieldset><legend>Reject Sharing Request</legend>
	        <form action="index.jsp" method="post" onsubmit="execute_request('request', 'rejectsharerequest'); return false;">
	            <div class="label">Node ID:</div><div class="field"><input type="text" id="rsr_nodeid" name="rsr_nodeid" value=""></div>
	            <div class="label"><input type="submit" value="Reject Share"></div>
	        </form>
		</fieldset>
		
	    <fieldset><legend>Get Pending Share List</legend>
	        <form action="index.jsp" method="post" onsubmit="execute_request('request', 'getsharelist'); return false;">
	            <div class="label">Page Size:</div><div class="field"><input type="text" id="gsl_pagesize" name="gsl_pagesize" value=""></div>
	            <div class="label">Page Number:</div><div class="field"><input type="text" id="gsl_pagenumber" name="gsl_pagenumber" value=""></div>
	            <div class="label"><input type="submit" value="Get Share List"></div>
	        </form>
		</fieldset>
		
         <fieldset>
			<legend>Get Pending Share List Count</legend>
			<form action="index.jsp" method="post" onsubmit="execute_request('request', 'getsharelistcount'); return false;">
				<div class="label"><input type="submit" value="Send Share List Count"></div>
			</form>
		 </fieldset>
 		
 		<fieldset>
			<legend>Get Location Path</legend>
			<form action="index.jsp" method="post" onsubmit="execute_request('request', 'getlocationpath'); return false;">
			 	<div class="label">Node ID:</div><div class="field"><input type="text" id="glp_nodeid" name="glp_nodeid" value=""></div>
				<div class="label"><input type="submit" value="Get Location Path"></div>
			</form>
		 </fieldset>
		
         <fieldset>
			<legend>Get Folders User Has Shared</legend>
			<form action="index.jsp" method="post" onsubmit="execute_request('request', 'getsharedbyuser'); return false;">
	            <div class="label">Page Size:</div><div class="field"><input type="text" id="gsbu_pagesize" name="gsbu_pagesize" value=""></div>
	            <div class="label">Page Number:</div><div class="field"><input type="text" id="gsbu_pagenumber" name="gsbu_pagenumber" value=""></div>
	            <div class="label">Sort column:</div><div class="field"><input type="text" id="gsbu_sortby" name="gsbu_sortby" value=""></div>
	            <div class="label">Descending sort:</div><div class="field"><input type="text" id="gsbu_descending" name="gsbu_descending" value=""></div>            
				<div class="label"><input type="submit" value="Get List Of Shared Folders"></div>
			</form>
		 </fieldset>

           <fieldset><legend>Get Shared Users For a Folder</legend>
	        <form action="index.jsp" method="post" onsubmit="execute_request('request', 'getsharesforobject'); return false;">
	            <div class="label">Node ID:</div><div class="field"><input type="text" id="gsbo_nodeid" name="gsbo_nodeid" value=""></div>
                    <div class="label"><input type="submit" value="Get List of Shares for Node"></div>
	        </form>
          </fieldset>

        <fieldset><legend>Search For Users</legend>
	        <form action="index.jsp" method="post" onsubmit="execute_request('request', 'usersearch'); return false;">
	            <div class="label">Search String:</div><div class="field"><input type="text" id="us_searchstr" name="us_searchstr" value=""></div>
                    <div class="label">Result Limit:</div><div class="field"><input type="text" id="us_limit" name="us_limit" value=""></div>
	            <div class="label"><input type="submit" value="Search"></div>
			</form>
            </fieldset>
            <fieldset><legend>Search</legend>
	        <form action="index.jsp" method="post" onsubmit="execute_request('request', 'search'); return false;">
	            <div class="label">query:</div><div class="field"><input type="text" id="search_query" name="query" value=""></div>
	            <div class="label">searchLocation:</div><div class="field"><input type="text" id="search_searchLocation" name="searchLocation" value=""></div>
                    <div class="label">sort:</div><div class="field"><input type="text" id="search_sort" name="sort" value=""></div>
                    <div class="label">ascending:</div><div class="field"><input type="text" id="search_asc" name="asc" value=""></div>
                    <div class="label">pageSize:</div><div class="field"><input type="text" id="search_pageSize" name="pageSize" value=""></div>
                    <div class="label">pageNumber:</div><div class="field"><input type="text" id="search_pageNumber" name="pageNumber" value=""></div>
                    <div class="label"><input type="submit" value="Search"></div>
	        </form>
          </fieldset>
          
	    <fieldset><legend>Get Version History</legend>
	        <form action="index.jsp" method="post" onsubmit="execute_request('request', 'getversionhistory'); return false;">
	             <div class="label">Node ID:</div><div class="field"><input type="text" id="gvh_nodeid" name="gvh_nodeid" value=""></div>
	            <div class="label">Page Size:</div><div class="field"><input type="text" id="gvh_pagesize" name="gvh_pagesize" value=""></div>
	            <div class="label">Page Number:</div><div class="field"><input type="text" id="gvh_pagenumber" name="gvh_pagenumber" value=""></div>
	            <div class="label"><input type="submit" value="Get Version History"></div>
	        </form>
		</fieldset>
          
	    <fieldset><legend>Publish To Document (Copy)</legend>
	        <form action="index.jsp" method="post" onsubmit="execute_request('request', 'pubtofilecopy'); return false;">
	             <div class="label">Node ID:</div><div class="field"><input type="text" id="p2dc_nodeid" name="p2dc_nodeid" value=""></div>
	            <div class="label">Target:</div><div class="field"><input type="text" id="p2dc_target" name="p2dc_target" value=""></div>
	            <div class="label">Version:</div><div class="field"><input type="text" id="p2dc_version" name="p2dc_version" value=""></div>
	            <div class="label"><input type="submit" value="Publish To Document (Copy)"></div>
	        </form>
		</fieldset>
          
	    <fieldset><legend>Publish To Document (Move)</legend>
	        <form action="index.jsp" method="post" onsubmit="execute_request('request', 'pubtofilemove'); return false;">
	             <div class="label">Node ID:</div><div class="field"><input type="text" id="p2dm_nodeid" name="p2dm_nodeid" value=""></div>
	            <div class="label">Target:</div><div class="field"><input type="text" id="p2dm_target" name="p2dm_target" value=""></div>
	            <div class="label">Version:</div><div class="field"><input type="text" id="p2dm_version" name="p2dm_version" value=""></div>
	            <div class="label"><input type="submit" value="Publish To Document (Move)"></div>
	        </form>
		</fieldset>
          
	    <fieldset><legend>Multi</legend>
	        <form action="index.jsp" method="post" onsubmit="execute_request('request', 'multi'); return false;">
	             <div class="label">List of infos:</div><div class="field"><input type="text" id="multi_info" name="multi_info" value=""></div>
	            <div class="label"><input type="submit" value="Send Multi"></div>
	        </form>
		</fieldset>
    </div>
</div>

<div id="responses">
    <fieldset><legend>Server Messages</legend>
        <div id="server-messages">
        </div>
    </fieldset>
    <button onclick="clear_server_messages();">Clear Server Messages</button>
</div>

<div style="display: none" id="notepad"></div>

</body>
</html>
