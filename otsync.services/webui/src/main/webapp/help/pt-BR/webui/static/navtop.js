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
	
	This file contains JavaScript code used in the navtop frame.
	

	Version
	=======

	2005-05-31 mmh

*/

if (top.sNav == '')top.sNav = 'toc';

function updateNav(){
	navLoc=top.navlist.location.href;
	top.navlist.location.href=navLoc.substring(0,navLoc.lastIndexOf("/")+1)+top.sNav+".html";
	
	if(document.getElementById){
		document.getElementById('toc').style.backgroundColor=(top.sNav=='toc')?'#fff':'#ddd';
		document.getElementById('ix').style.backgroundColor=(top.sNav=='ix')?'#fff':'#ddd';
		document.getElementById('fts').style.backgroundColor=(top.sNav=='fts')?'#fff':'#ddd';
		document.getElementById('toc').style.borderBottom=(top.sNav=='toc')?'2px solid #fff':'1px solid #aaa';
		document.getElementById('ix').style.borderBottom=(top.sNav=='ix')?'2px solid #fff':'1px solid #aaa';
		document.getElementById('fts').style.borderBottom=(top.sNav=='fts')?'2px solid #fff':'1px solid #aaa';
		document.getElementById('toc').style.borderLeft=(top.sNav=='toc')?'1px solid #aaa':'1px solid #fff';
		document.getElementById('ix').style.borderLeft=(top.sNav=='ix')?'1px solid #aaa':'1px solid #fff';
		document.getElementById('fts').style.borderLeft=(top.sNav=='fts')?'1px solid #aaa':'1px solid #fff';
	}
	else 
		if(document.all){
			document.all['toc'].style.backgroundColor=(top.sNav=='toc')?'#fff':'#ddd';
			document.all['ix'].style.backgroundColor=(top.sNav=='ix')?'#fff':'#ddd';
			document.all['fts'].style.backgroundColor=(top.sNav=='fts')?'#fff':'#ddd';
			document.all['toc'].style.borderBottom=(top.sNav=='toc')?'2px solid #fff':'1px solid #aaa';
			document.all['ix'].style.borderBottom=(top.sNav=='ix')?'2px solid #fff':'1px solid #aaa';
			document.all['fts'].style.borderBottom=(top.sNav=='fts')?'2px solid #fff':'1px solid #aaa';
			document.all['toc'].style.borderLeft=(top.sNav=='toc')?'1px solid #aaa':'1px solid #fff';
			document.all['ix'].style.borderLeft=(top.sNav=='ix')?'1px solid #aaa':'1px solid #fff';
			document.all['fts'].style.borderLeft=(top.sNav=='fts')?'1px solid #aaa':'1px solid #fff';
		}
}
