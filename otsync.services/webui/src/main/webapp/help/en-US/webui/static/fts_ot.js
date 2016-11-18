//*************************************************************

var vMinEntry= 2;

function validEntry(entry){
	var words = new Array;
	while(entry.charAt(0)==" "){entry=entry.substring(1,entry.length);}
	while(entry.charAt((entry.length)-1)==" "){entry=entry.substring(0,entry.length-1);}
  if (entry.match(/^\s*$/)) {
    top.frame1.location="toc4js.htm?reset";
		return false;
  }
	entry=entry.replace(/[ \t]+/g," ");
	top.ftsSrchExpr=entry;
	if(!top.ftsSrchMode==1) { words=entry.split(" "); }
	                   else { words[0]=entry; }
	var wordsok=true;
	for(i=0;i<words.length;i++){
		if(words[i].length<vMinEntry)wordsok=false;
		if(words[i].match(/[^\*]/)==null)wordsok=false;
	}
	if(!wordsok){
		alert(top.lbl4fts["msgTooShort"]);
		document.getElementById('searchField').focus();
		return false;
	}
	return true;
}

function preSubmit(){
  parent.seenHits='';
	formField=document.searchForm.searchField.value;
  formField=formField.replace(/\\/g,"&#0092;");
 	if (!validEntry(formField)) {
		return false;
	} else {
		if(top.ftsScope && top.ftsScope==2){
		  top.ftsPgHighltCur=0;
      writeResultCountOnly(top.ftsPgHighltCur);
			top.frame2.location.reload();
			return true;
		}	
		return true;
	}
}

function absTop(vItem){
	if(vItem)return(vItem.offsetParent)?vItem.offsetTop+absTop(vItem.offsetParent):vItem.offsetTop;
	else return 0;
}

function putFirstHitInView(vWin){
	if(vWin.document.getElementById)vItemTop=absTop(vWin.document.getElementById("firsthit"));
	if(vWin.document.all)vItemTop=absTop(vWin.document.all.item("firsthit"));
	if(vWin.innerHeight)		// v5.6.2
		cH=vWin.innerHeight;	// v5.6.2
	else {
		if(vWin.document.documentElement && vWin.document.documentElement.clientHeight)
			cH=vWin.document.documentElement.clientHeight;
		else
			if(vWin.document.body)cH=vWin.document.body.clientHeight;
	}
	if(vItemTop+16>cH){vWin.scrollTo(0,16+vItemTop-(cH/2));}
}

function highLight(vObj,text,mode){
  text=window.ftsSrchExpr;
  var hlMax=10;
  if (top.ftsPgHighltMax) { hlMax=top.ftsPgHighltMax }
  if ((text) && (text !='') && (hlMax>0)) {
    text=text.replace(/&#0092;/g,"\\");
  	var words=new Array();
  	var vHighObj;
  	var vString;
    var agt=navigator.userAgent.toLowerCase();
    var is_navadv=((((agt.indexOf('mozilla')!=-1)&&(agt.indexOf('spoofer')==-1)&&(agt.indexOf('compatible')==-1)&&(agt.indexOf('opera')==-1)&&(agt.indexOf('webtv')==-1)&&(agt.indexOf('hotjava')==-1))&&(parseInt(navigator.appVersion)>=5))||(agt.indexOf('gecko')!=-1));
    var is_ieadv=(((agt.indexOf("msie")!=-1)&&(agt.indexOf("opera")==-1))&&(ScriptEngineMajorVersion()+(ScriptEngineMinorVersion()/10)>=5.5));
    var does_AdvRegEx=(is_navadv||is_ieadv); // certain RegExp commands only understood by IE5.5+ and NS6+
  	if (top.frame2.document.getElementById) { 
      vHighObj= top.frame2.document.getElementById("HL4SRCH"); 
    } else if (top.frame2.document.all) { 
      vHighObj= top.frame2.document.all.item("HL4SRCH"); 
    }
    if (vHighObj && vHighObj.innerHTML) {
    	vString=vHighObj.innerHTML;
    }	else {
      vString="";
      window.status="Sorry, no highlighting/auto-scrolling available.";
    }
  	if(text.charAt(0)=="~") { // full RegExp search
  		text=text.substring(1,text.length);
  	}
  	else { // only * and ? wildcards
  		text=text.replace(/\*\**/g,"*");
  		text=text.replace(/([\\\^\$\+\{\}\.\(\)\|\[\]])/g,"\\$1");	// v5.6 remove slash
  		text=text.replace(/\*/g,"[^¶\\x20\\f\\n\\r\\t\\v<>]*");
  		if(does_AdvRegEx){
  			text=text.replace(/\?/g,"(?:&nbsp;|[^¶\\x20\\f\\n\\r\\t\\v<>])");
  			text=text.replace(/-/g,"(?:\-|-|–|—)");
  		}
  		else{
  			text=text.replace(/\?/g,"[^¶\\x20\\f\\n\\r\\t\\v<>]");
  		}
  	}
  	text=text.replace(/\//g,"\\/");		// v5.6 new
  	if(mode==2){if(does_AdvRegEx){words[0]=text.replace(/ /g,"(?:\\s+|&nbsp;|\xC2\xA0)");}}else{words=text.split(" ");}
  //alert(words[0]);
  	for(i=0;i<words.length;i++){
  		var re=RegExp("(" + words[i] + ")([^>]*<)", "gi");
      j=i;if(j>=5)j=4; // max number of fts-match variations defined in css
  		k=0;
  		do{vString=vString.replace(re,"<<#fts-match"+j+">>$1>>/#fts-match"+j+">>$2");
  			k++;if(k>hlMax)break;}while(vString.match(re)!=null);
  	}
  	re=RegExp("<<#(fts-match[0-9]+)>>([^>]+)>>\/#(fts-match[0-9]+)>>", "i");//first hit
  	if(re.test(vString)){
  		vString=vString.replace(re,"<span id=\"firsthit\" class=\"$1\">$2</span>");
      re=RegExp("<<#(fts-match[0-9]+)>>([^>]+)>>\/#(fts-match[0-9]+)>>", "gi");//first hit
  		vString=vString.replace(re,"<span class=\"$1\">$2</span>");
  		vHighObj.innerHTML=vString;//highlighting done, now check scroll position
  		putFirstHitInView(vObj);
  	}
  	// Count matches for messaging
  	var pgHitCntDispl=top.frame1.document.getElementById("pgHitCntDispl");
  	var pgHitsSeeHl  =top.frame1.document.getElementById("ftsRsltSeeHl");
  	var pgHitCntScope=top.frame1.document.getElementById("pgHitCntScope");
  	if (pgHitCntDispl) {
      top.ftsPgHighltCur=0;
      var spList=vHighObj.getElementsByTagName("span");
	    var ntElem=top.frame1.document.getElementById("ftsRsltSeeHl");
      for (var i=0; i<spList.length; i++) { if (spList[i].className && spList[i].className.match(/fts-match/i)) { top.ftsPgHighltCur++; }}
      if (top.ftsPgHighltCur==0) {
        pgHitCntDispl.innerHTML=top.lbl4fts["fts_MsgNoMatchCurPg"];
        pgHitCntDispl.className="ftslistTitle nomatch";
        pgHitCntDispl.className="ftslistTitle nomatch";
  	    if (ntElem) { ntElem.className+=" hideMe" }
        if (pgHitCntScope) { pgHitCntScope.innerHTML=''; }
      } else {
        if (top.ftsPgHighltCur==1) { pgHitCntDispl.innerHTML=top.ftsPgHighltCur + " " + top.lbl4fts["rsltPgTtl1"]; }
                              else { pgHitCntDispl.innerHTML=top.ftsPgHighltCur + " " + top.lbl4fts["rsltPgTtl"]; }
        pgHitCntDispl.className="ftslistTitle";
  	    if (ntElem) { ntElem.className=ntElem.className.replace(/ hideMe/i, '');}
        if (pgHitsSeeHl)   { pgHitsSeeHl.innerHTML   = top.lbl4fts["ftsRsltSeeHl"] }
        if (pgHitCntScope) { pgHitCntScope.innerHTML = top.lbl4fts["ftsRsltScope"+top.ftsScope]; }
      }
  	}

 } 	
}   

