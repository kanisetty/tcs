<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Tempo Generic Client</title>

<style type="text/css">
#requests {
  width: 55%;
  float: left;
}
#responses {
  width: 43%;
  float: right;
}

.msg {
  float: left;
  clear: both;
  padding-bottom: 3px;
  border-bottom: 1px solid gray;
  width: 100%;
}

</style>

<script	src="http://ajax.googleapis.com/ajax/libs/jquery/1.5.2/jquery.min.js"	type="text/javascript"></script>
<script type="text/javascript">
		(function($) {
			$(document).ready(function() {
				//subscribe_events();  //set up the long poll request when the page is loaded
			});
		})(jQuery);
		                

		// subscribe_events sends the server the long poll request and will wait in the background until a new event has occurred
		function subscribe_events() {
			(function($) {                
				$.ajax({
					url: 'http://localhost:8080/tempo/BackChannel',
					type: 'POST',
					dataType: 'json',
					data: '{ "type": "subscribe_events" }',
					contentType: 'application/json',
					success: function (data) {
						switch (data.type) {
						case 'folder_created':
							add_folder_html(data.folder_name);
							break;
						default:
							$('#result').html("Unhandled Event: " + data.type);
							break;
						}
						subscribe_events();  //need to resubscribe to get the next event
					},             
					error: function (data, textStatus, errorThrown) {
						add_server_message_html(errorThrown);
					}             
				});
			})(jQuery);
		}

		function add_server_message_html(message) {
			$('#server-messages').append('<div class="msg">' + message + '</div>');
		}

		//adds the html to the <ul> to show a folder has been created
		function add_folder_html(folder_name) {
			add_server_message_html('<img src="images/folder.png"> ' + folder_name);
		}
		
		//sends a generic request to the otsync_engine
		function generic_request() {
			(function($) {
				var channel_url = $("#channel").val();
				var request = $("#request").val();
				if (channel_url == "" || request == "") {
					$("#result").html("Make sure you specify the request channel AND the JSON string.");
					return;
				}

				$.ajax({
					url: channel_url,
					type: 'POST',
					dataType: 'json',
					data: request,
					contentType: 'application/json',
					success: function (data) {
						var output = '';
						for (property in data) {
							output += property + ': ' + data[property]+'; ';
						}
						add_server_message_html(output);
					},
					error: function (data, textStatus, errorThrown) {
						add_server_message_html(errorThrown);
					}            
				});
			})(jQuery);
		}

		//sends the request on the front channel to create a folder, with a little error checking on the folder name
		function create_folder() {
			(function($) {
				var folder_name = $("#folder_name").attr("value");
				if (folder_name == "") {
					$("#result").html("Please specify a folder name to add...");
					return;
				}

				//add_folder_html(folder_name);	//its not a server response so we'll comment this out as to not confuse the server messages
				 
				$.ajax({
					url: 'http://localhost:8080/tempo/FrontChannel',
					type: 'POST',
					dataType: 'json',
					data: '{ "type": "create_folder", "options": { "foldername" : "' + folder_name + '" } }',
					contentType: 'application/json',
					error: function (data, textStatus, errorThrown) {
						add_server_message_html(errorThrown);
					}            
				});
			})(jQuery);
		}
		
</script>

</head>

<body>

<!-- generic message container -->
<div id="result"></div>

<div id="requests">
	<fieldset><legend>Generic JSON Request</legend>
	<form action="index.jsp" method="post" onsubmit="return false;">
		Specify Channel: <input type="text" id="channel" name="channel" value="http://localhost:8080/tempo/FrontChannel" size="55"><br>
	
		Generic JSON String:<br>
		<textarea id="request" rows="4" cols="55"></textarea><br>
		<input type="button" value="Send JSON" onclick="generic_request();">
	</form>
	</fieldset>
	
	<fieldset><legend>Create Folder</legend>
	<form action="index.jsp" method="post" onsubmit="return false;">
		<input id="folder_name" type="text" name="name"	value="">
		<input type="button" value="Add Folder" onclick="create_folder();">
	</form>
	</fieldset>
	
	<fieldset><legend>Upload File</legend>
	<form enctype="multipart/form-data" method="post" action="/tempo/ContentChannel">
		<input type="file" name="file">
		<input type="submit" value="upload">
	</form>
	</fieldset>
</div>

<div id="responses">
	<fieldset><legend>Server Messages</legend>
		<div id="server-messages">
		</div>
	</fieldset>
</div>

</body>
</html>