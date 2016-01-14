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
	
	This file contains JavaScript code used in the banner frame.
	

	Version
	=======

	2005-03-08 mmh: In AdminHeader_draw() <tbody> Tags ergänzt
	2005-05-04 mmh: Fenstergröße anpassen (optional)
	2005-05-06 mmh: überflüssigen Code auskommentiert
	2005-05-31 mmh: überflüssigen Code entfernt

*/

var adjustWindowsSize = 1; // set to 0 to switch off
var myFramesetBorder = 5;

function switchViewMode() {
	if (top.myViewmode=='topic'){ //switch to index mode, apply sNav and sNW
		sCurLoc=top.location.href; //topic.html
		sCurLoc=sCurLoc.substring(0,sCurLoc.lastIndexOf("/")+1); //path
		sCurTopic=parent.topicpage.location.href;
		sCurTopic=sCurTopic.substring(sCurTopic.lastIndexOf("/")+1); //file
		if (adjustWindowsSize) {
			myWinChange = myFramesetBorder + (1 * top.sNW);
			top.window.moveBy(-myWinChange, 0);
			top.window.resizeBy(+myWinChange, 0);
		}
		top.location=sCurLoc+'index.html?nav='+top.sNav+'&nw='+top.sNW+'&file='+sCurTopic;
	}
	else { //switch to topic mode, keep sNav and sNW
		sCurLoc=top.location.href //index.html
		sCurLoc=sCurLoc.substring(0,sCurLoc.lastIndexOf("/")+1); //path
		sCurTopic=parent.topicpage.location.href;
		sCurTopic=sCurTopic.substring(sCurTopic.lastIndexOf("/")+1); //file
		top.sNW = (document.all) ? top.navtop.document.body.clientWidth : top.navtop.innerWidth;
		if (adjustWindowsSize) {
			myWinChange = myFramesetBorder + (1 * top.sNW);
			top.window.resizeBy(-myWinChange, 0);
			top.window.moveBy(+myWinChange, 0);
		}
		top.location=sCurLoc+'topic.html?nav='+top.sNav+'&nw='+top.sNW+'&file='+sCurTopic;
		// else top.location=sCurLoc+'topic.html?nav='+top.sNav+'&nw='+top.navtop.innerWidth+'&file='+sCurTopic;
	}
}

function prevPage(){
	if (top.topicpage.prevPage && top.topicpage.prevPage != '')
		top.topicpage.location = top.topicpage.prevPage;
}

function nextPage(){
	if (top.topicpage.nextPage && top.topicpage.nextPage != '')
		top.topicpage.location = top.topicpage.nextPage;
}

function pVer(){
	pW=window.open(top.topicpage.location+'?print','pW','directories=no,height=600,location=no,menubar=yes,resizable=yes,scrollbars=yes,toolbar=no,width=750');
}

function updateBanner(imagePath, t1, t2, pp, np) {
	if ( imagePath == null ){
		this.imagePath = '../static/images/';
	}
	else{
		this.imagePath = imagePath;
	}
	// alert('update\nt1: ' + t1 + '\nt2: ' + t2);
	if(this.document.getElementById){
		vt1Obj=this.document.getElementById("dbxixos-t1");
		vt2Obj=this.document.getElementById("dbxixos-t2");
		vppObj=this.document.getElementById("dbxixos-prevpage");
		vnpObj=this.document.getElementById("dbxixos-nextpage");
	}
	else 
		if(this.document.all){
			vt1Obj=this.document.all.item("dbxixos-t1");
			vt2Obj=this.document.all.item("dbxixos-t2");
			vppObj=this.document.all.item("dbxixos-prevpage");
			vnpObj=this.document.all.item("dbxixos-nextpage");
		}
	if (vt1Obj) {
		vt1Obj.innerHTML = (t1 == '')?'&nbsp;':t1;
		vt2Obj.innerHTML = t2;
		if(pp == ''){
			// make image inactive
			vppObj.src = this.imagePath + 'pix_back_inactive.gif';
		} else {
			// make image active
			vppObj.src = this.imagePath + 'pix_back.gif';
		}
		if(np == ''){
			// make image inactive
			vnpObj.src = this.imagePath + 'pix_forward_inactive.gif';
		} else {
			// make image active
			vnpObj.src = this.imagePath + 'pix_forward.gif';
		}
	}
	if (np && np != '') {  top.topicpage.nextPage=np }
	if (pp && pp != '') {  top.topicpage.prevPage=pp }
}
