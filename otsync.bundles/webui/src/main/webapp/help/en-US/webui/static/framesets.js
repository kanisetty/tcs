/* 
	DocBook V4.3-Based Variant DbXixos V1.0 
	XSL transformation for Online Help output. 
	Created 2005 by itl AG & cap studio 

	This JavaScript file is part of the 
	OpenText authoring environment. 
	Only authorized users may use or modify this file. 
	Distribution is limited to other OpenText users.


	Description
	===========
	
	This file contains JavaScript code used to create
	the frameset files.
	

	Version
	=======

	2005-05-31 mmh
	2005-07-20 ekbert: workaround: extended banner-test to surround bug in mozilla (top.hasBanner)

*/

function draw_frameset_full() {
	myViewmode='index';
	ntH="32";
	sQuery = window.location.search;
	sNav=''; if(sQuery!=''){rexp=/nav=([^&]*)/i; if(rexp.exec(sQuery))sNav= RegExp.$1;}if(sNav=='')sNav='toc';
	sNW='';  if(sQuery!=''){rexp=/nw=([^&]*)/i;  if(rexp.exec(sQuery))sNW=  RegExp.$1;}if(sNW==''||sNW=='undefined'||sNW < 150)sNW='300';
	sFile='';if(sQuery!=''){rexp=/file=([^&]*)/i;if(rexp.exec(sQuery))sFile=RegExp.$1;}if(sFile=='')sFile='index.htm';

	sFrameset= 
	'<frameset cols="'+sNW+',*" rows="*" frameborder="yes" framespacing="3" bordercolor="#000000" border="5">\n' +
	'	<frameset cols="*" rows="'+ntH+',*" framespacing="0" border="0" bordercolor="#000000" frameborder="no">\n' +
	'		<frame src="dynamic/navtop.html?id='+sNav+'" id="navtop" name="navtop" scrolling="no" marginheight="0" marginwidth="0">\n' +
	'		<frame src="dynamic/'+sNav+'.html" id="navlist" name="navlist" frameborder="yes" marginheight="0" marginwidth="0">\n' +
	'	</frameset>\n' +
	'	<frameset cols="*" rows="73,*" framespacing="0" border="0" bordercolor="#000000" frameborder="no">\n' +
	'		<frame src="dynamic/banner.html" id="banner" name="banner" scrolling="no" marginheight="0" marginwidth="0">\n' +
	'		<frame src="files/' + sFile + '" id="topicpage" name="topicpage" marginheight="0" marginwidth="36" scrolling="auto">\n' +
	'	</frameset>\n' +
	'	<noframes>\n' +
	'		<body><p>Please use a browser with frame display capabilities.</p></body>\n' +
	'	</noframes>\n' +
	'</frameset>\n';	
	document.write(sFrameset);
}

function draw_frameset_topic() {
	myViewmode='topic';
	sQuery = window.location.search;
	sId='';  if(sQuery!=''){rexp=/id=([^&]*)/i;  if(rexp.exec(sQuery))sId=  RegExp.$1;}
	sFile='';if(sQuery!=''){rexp=/file=([^&]*)/i;if(rexp.exec(sQuery))sFile=RegExp.$1;}
	sNav= '';if(sQuery!=''){rexp=/nav=([^&]*)/i; if(rexp.exec(sQuery))sNav= RegExp.$1;}if(sNav=='')sNav='toc';
	sNW='';  if(sQuery!=''){rexp=/nw=([^&]*)/i;  if(rexp.exec(sQuery))sNW=  RegExp.$1;}if(sNW=='')sNW='300';

	if(sId==''){ // no map value, look for file name
		if(sFile=='')sFile='index.htm';
	}
	else{ // redirect to context topic in frameset if found
		if(myMap[sId]) {
			sFile=myMap[sId];
		}
		else{ // map value not found, goto default page
			sFile='index.htm'; 
		}
	}
	sFrameset = 
	'<frameset cols="*" rows="73,*" framespacing="0" border="0" frameborder="0">\n' +
	'	<frame src="dynamic/banner.html" id="banner" name="banner" noresize scrolling="no" marginheight="0" marginwidth="0">\n' +
	'	<frame src="files/' + sFile + '" id="topicpage" name="topicpage" marginheight="0" marginwidth="36" scrolling="auto">\n' +
	'	<noframes>\n' +
	'		<body><p>Please use a browser with frame display capabilities.</p></body>\n' +
	'	</noframes>\n' +
	'</frameset>\n';
	document.write(sFrameset);
	top.hasBanner=1;
}
