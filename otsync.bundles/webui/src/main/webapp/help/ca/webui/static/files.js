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
	
	This file contains JavaScript code used in the content frame.
	

	Version
	=======

	2005-03-08 mmh: In AdminFooter_draw() <tbody> Tags ergänzt
	2005-04-26 mmh: IE code für relation menu ergänzt
	2005-05-06 mmh: überflüssigen Code auskommentiert
	2005-05-31 mmh: überflüssigen Code entfernt

*/

var xID = "../files/"+document.location.href.substring(document.location.href.lastIndexOf("/")+1);
var sPrint=false;
if(window.location.search=='?print'){sPrint=true;}
if(!sPrint&&window==window.top){
	sCurLoc=top.location.href;
	sCurLoc=sCurLoc.substring(0,sCurLoc.lastIndexOf("/")-1);
	sCurLoc=sCurLoc.substring(0,sCurLoc.lastIndexOf("/")+1);
	sCurTopic=top.location.href;
	sCurTopic=sCurTopic.substring(sCurTopic.lastIndexOf("/")+1);
	top.location=sCurLoc+'topic.html?file='+sCurTopic;
}
function suckerfish_fix() {
	if (document.all&&document.getElementById) {
		navRoot = document.getElementById("dbxixos-rel");
		if (navRoot) {
			for (i=0; i<navRoot.childNodes.length; i++) {
				node = navRoot.childNodes[i];
				if (node.nodeName=="LI") {
					node.onmouseover=function() {this.className+=" over";}
					node.onmouseout=function() {this.className=this.className.replace(" over", "");}
				}
			}
		}
	}
}

function prep(){
	suckerfish_fix();
	if(sPrint){
		for(i=0;i<document.links.length;i++){
			with(document.links[i]){
				style.textDecoration='none';style.color='black';style.cursor='text';
			}
		}
	}
	else{
		if(parent.navlist){
			if(parent.navlist.loadSynchPage){
				parent.navlist.loadSynchPage(xID)
			}
		}
		if(top){
			if(top.ftsSrchExpr){
				if(top.ftsSrchExpr!=""){
					if(top.navlist.highLight){
						top.navlist.highLight(self,top.ftsSrchExpr,top.ftsSrchMode);
					}
				}
			}
		}
	}
}


