/* 
	DocBook V4.3-Based Variant DbXixos V1.0 
	XSL transformation for Online Help output. 
	Created 2005 by itl AG & cap studio 

	This JavaScript file is part of the 
	OpenText authoring environment. 
	Only authorized users may use or modify this file. 
	Distribution is limited to other OpenText users.
*/
/*
This search routine is based on the free Recon Search Engine
by Jerry Bradenbaugh (http://www.serve.com/hotsyte/)
alterations have been made by Marc Reed (http://www.marcreed.com)
This script may be used for free
*/
/*
Further alterations were necessary for inclusion in the FM2HTML process.
Version:
4.0 - 2002-09-25 mmh -- added validation functions
						optimized output formatting
4.1 - 2002-09-26 mmh -- store searchField in top frame
4.2 - 2002-10-02 mmh -- removed validation functions
4.3 - 2002-12-05 mmh -- Make "Results" a variable
4.4 - 2003-01-13 mmh -- Remove title from search string, it is already in the long text
						Simplify result array (only one array)
						Remove search in URL and other useless subroutines
						Variable names clean-up
4.5 - 2002-01-21 mmh -- Expand ? to nbsp | any non white space char
						Expand * to zero or more non white space chars
						Expand dash to: dash|en dash|em dash|nb dash
						Removed old lines
4.6 - 2003-03-20 mmh -- Added / to chars to be escaped!
2011-11-21 ekb -- General rearrangements and security update
2014+15    ekb -- Major extensions and rearrangements 
           (particularly integration and exended functionality with dynamic TOC,
           modular context, support for PI Root search)
*/

//*************************************************************************
// Define global variables

// the maxResults variable determines how many results are displayed per page:
var maxResults=10000;
var dbgs='';

var myMatches=new Array();
var myMatchesPtn=new Array();
var splitline=new Array();
var indexer=0;
var srcCrit="any"; // may be overwritten
var sortMode='dflt'; // may be overwritten via sortMode parameter (0=sort by rank, 1=sort+group by document)
var scopePtn=new RegExp(''); //'ccmprj-cgd-qargm-rmlogac', 'i');
var idSrch=0;

var siOfs=0;
var siOfsPrev=0;
var siDir=new String('');
var siUT=new String('');
var siDocid=new String('');

var nesTocIn;
if (top.ftsScope && (top.ftsScope=='below' || top.ftsScope==1) && parent && parent.frame2 && nesToc) {
  var curIdPtn=new RegExp(";([\\d\\-]+):" + parent.frame2.location.href.replace(/.*[\/\\]|\.html*$/gi, '') + ";", 'i');
  if (parent.location.href.match(/[&?]pg=([\w\-\_]+)/i)) {
    curIdPtn=RegExp(";([\\d\\-]+):" + parent.document.location.href.match(/[&?]pg=([\w\-\_]+)/i)[1] + ";", 'i');
  }
  nesTocIn=nesToc.match(curIdPtn);
  if (nesTocIn) {
    // Determine all sections for "below" context to reduce the scope of the search
    var curSubPtn=new RegExp(";" + nesTocIn[1] + "(-[0-9])*:([^;]*)", 'gi');
    var nesTocMatch=nesToc.match(curSubPtn);
    scopePtn=RegExp("<org manid|\\|(" + nesTocMatch.join('').replace(/;\d+(-\d+)*:/gi, '|').replace(/^\|/, '') + ")\\.htm");
  }
}
var scopePtnLcl=scopePtn;


var seenHitsLocal=''; // used only if search is run without a parent HTML

function SetDocLang(myLang) {
}

//*************************************************************************
// Search Results page should call this function
// ------------------------------------------------------
function doSearch() {
// ------------------------------------------------------
	fullEntry=top.ftsSrchExpr; // "+" converted to space
  var ftsIdxCntTgt=top.ftsIdxCnt;
  var loadChkCnt=0;
  var idx2load=new Array();
  if (top.ftsScope && (top.ftsScope=='allmod' || top.ftsScope==3)) {
//alert("avl:" + top.dynIdxAvl);
    for (var d=0; d<(top.dynIdxAvl.length); d++) {
      // dynIdxAll lists all _potential_ modules. 
      var idxRef=top.dynIdxAvl[d].split('>');
      var re4idxRef=new RegExp('#' + idxRef[0] + '#', 'i');
      if (!top.siRead.match(re4idxRef)) {
        var siReadPre=top.siRead;
        top.loadFile(top.dynIdxAvl[d], "js", document);
        ftsIdxCntTgt++;
      }
    }
  }
  // alert("sp:" + top.siRead + " <!> " + top.ftsIdxCnt + "/" + ftsIdxCntTgt );
  // ------------------------------------------------------
  function srchPrep() {
  // ------------------------------------------------------
    loadChkCnt++; 
    if ((top.ftsIdxCnt>=ftsIdxCntTgt) && (top.ftsIdx0Cnt<=top.ftsIdxCnt)) {
      // alert("go:" + top.ftsIdx0Cnt + ">=" + top.ftsIdxCnt + " -- " + top.ftsIdxCnt + "<=" + ftsIdxCntTgt + " -- " + top.siRead);
      if (fullEntry.match(/^:id:[^\s]+$/)) { fullEntry=fullEntry.replace(/^:id:/, ''); idSrch=1; }
      ftsMsg('');
      if(fullEntry!="") {
        filteredEntry="";
        //Look for multiple spaces (white space = \s)
        filteredEntry=fullEntry.replace(/\s+/g," ");
        prepareSearch(filteredEntry);
      }
    } else if ((loadChkCnt<50) || (top.ftsIdx0Cnt>top.ftsIdxCnt)) {
      // alert("wt:" + top.siRead + " <!> " + top.ftsIdxCnt + "/" + ftsIdxCntTgt + "/" + top.dynloadcnt);
      ftsMsg("Loading search index (" + top.ftsIdx0Cnt + ") ...");
      setTimeout(srchPrep,200);
    } else {
      window.status="Sorry, search index download took too long. Please reduce the scope to a single module." // temporary message for now
    }
  }
  srchPrep();
}

// ------------------------------------------------------
function getQueryString(Val) {
// ------------------------------------------------------
// This generic function will return the value of a QueryString
// If a variable is available, it is used
// ------------------------------------------------------
	if(Val=='searchField'){
		if(top){
			if(top.searchField){
				if(top.searchField!=""){return top.searchField;}
			}
		}
	}
	if(Val=='searchMode'){
		if(top){
			if(top.searchMode){
				if(top.searchMode!=""){return top.searchMode;}
			}
		}
	}
	if(Val=='sortMode'){
		if(top){
			if(top.sortMode){
				if(top.sortMode!=""){return top.sortMode;}
			}
		}
	}
	thisURLparamStr=document.location.search;
	// Chop "?" off thisURLparamStr
	if(thisURLparamStr.charAt(0)=="?") thisURLparamStr=thisURLparamStr.substring(1,thisURLparamStr.length);
	returnStr="";
	if(thisURLparamStr!="") {
		// Build array out of thisURLparamStr using "&" as delimiter
		splitline=thisURLparamStr.split("&");
		for(i=0;i<splitline.length;i++) {
			splitparam=splitline[i].split("=");
			if(unescape(splitparam[0])==Val) returnStr=unescape(splitparam[1]);
		}
		returnStr=returnStr.replace(/\+/g," ");
	}
	return returnStr;
}

// ------------------------------------------------------
function prepareSearch(text) {
// ------------------------------------------------------
// Determine any word/all words/phrase search
// ------------------------------------------------------
	// Clean up spaces at beginning and end of string
	siOfs=0;
  siOfsPrev=0;
	siDir='';
	siUT='';
	siDocid='';

	while(text.charAt(0)==' ') text=text.substring(1,text.length);
	while(text.charAt(text.length-1)==' ') text=text.substring(0,text.length-1);
	if(text.length<1) {
		alert("ERROR: Please type some text before starting any search.");
		return;
	}
	// default sortMode defined above;
	sortMode="dflt";
	if (parseInt(top.ftsSortMode)==1 || top.ftsSortMode=="lvl1")   { sortMode="lvl1" };
	// default srcCrit defined above;
	if (parseInt(top.ftsSrchMode)==0 || top.ftsSrchMode=="any")    { srcCrit="any"   };
	if (parseInt(top.ftsSrchMode)==1 || top.ftsSrchMode=="all")    { srcCrit="all"   };
	if (parseInt(top.ftsSrchMode)==2 || top.ftsSrchMode=="phrase") { srcCrit="phrase"};
	if (parseInt(top.ftsSrchMode)==3 || top.ftsSrchMode=="pgid")   { srcCrit="pgid"};
	var entry=text;
	var srchBase=4; // field index for normal text
	if (entry.match(/^:h?id:[a-z0-9\.\-_]+$/i)) { 
	  // Search term starts with":id:/:hid:" => search for ID (HTML file name) or help ID instead of normal text
  	if (entry.match(/^:hid:[a-z0-9\.\-_]+$/i)) { srchBase=3; } else { srchBase=5; } 
	  entry=entry.replace(/^:h?id:/i, '') 
	}
	if(entry.charAt(0)=="~") { // full RegExp search
		entry=entry.substring(1,entry.length);
	}
	else { // only * and ? wildcards
		entry=entry.replace(/([\\\^\$\+\{\}\.\(\)\|\[\]])/g,"\\$1");  // v4.6  // v5.6 remove slash
		entry=entry.replace(/\*/g,"[^¶\\x20\\f\\n\\r\\t\\v<>]*");
		entry=entry.replace(/\|/g,""); // since "|" is used as the field separation, the indexer removes any occurences in the text itself
		entry=entry.replace(/\?/g,"(&nbsp;|[^¶\\x20\\f\\n\\r\\t\\v<>])");
		entry=entry.replace(/-/g,"(\-|‑|–|—)");
	}
	entry=entry.replace(/\//g,"\\/");

	if ((idSrch==1) || (srcCrit=="pgid"))  { searchArray=entry.split(" "); 
	                                         doSearchPgid(searchArray, text, srchBase);return;}
	else if (srcCrit=="phrase")            { doSearchExactPhrase(entry, text, srchBase);return;}
	else {
		// If not exact phrase, split the entry string into an array
		searchArray=entry.split(" ");
		if(srcCrit=="any")                   { doSearchAny(searchArray, text, srchBase);return; }
		else if(srcCrit=="all")              { doSearchAll(searchArray, text, srchBase);return; }
	}
}

// =============================================================
//    Actual search procedures 
// =============================================================
function doSearchAny(t, text, srchBase) {
// ------------------------------------------------------
// Evoked if user searches ANY WORDS
// ------------------------------------------------------
// t: array of search terms
// text: original search text
// ------------------------------------------------------
	var matchesInLine=0;
	var matchMaxCnt=0;
	var refineAllString = "";
	var myMatchFiles=new Array();
	scopePtnLcl=scopePtn;
	for(i=0;i<top.profiles.length;i++) {
		// use only content part of profile
		if (top.profiles[i].match(/<siHdr4\w+/i)) {
      ParseSiHdr(top.profiles[i]);
		  continue;
		}
		if ((scopePtnLcl!='') && (!top.profiles[i].match(scopePtnLcl))) { continue; } 
		var splitline=top.profiles[i].split("|");
		refineAllString=('' + splitline[srchBase]).toUpperCase();
		matchesInLine=0;
		for(j=0;j<t.length;j++) {
			myRE=RegExp(t[j], "gi");
			matchesArray=refineAllString.match(myRE);
			if(matchesArray!=null)matchesInLine=matchesInLine+matchesArray.length;
		}
		if(matchesInLine>0) {
			// Store only hits, title and URL
			myMatches[indexer]=(0-matchesInLine)+"|"+splitline[0]+"|"+splitline[5];
			// myMatches fields (=> later splitline (not here!))
			// 0: weight -- ^
			// 1: title                          --- ^
			// 2: file name                                          -- ^
      myMatchFiles[splitline[5]]=matchesInLine;
      if (matchesInLine > matchMaxCnt) { matchMaxCnt=matchesInLine }
  		if (sortMode=='lvl1') { myMatches[indexer]+="|" + splitline[1].replace(/>\d+/, '') }
             		       else { myMatches[indexer]+="|" + splitline[1] }
			// 3: host section count ("lvl1>lvl2")                  -- ^
      myMatches[indexer]+="|" + siOfs + "|" + siDir + "|" + siUT + "|" + siDocid;
			// 4: siOfs             ---^
			// 5: siDir                           ---^
			// 6: siUT                                          ---^
			// 7: siDocid                                                      ---^
			indexer++;
		}
	}
	DisplayResult(text, matchMaxCnt, myMatches, myMatchFiles);
}

// ------------------------------------------------------
function doSearchAll(t, text, srchBase) {
// ------------------------------------------------------
// Evoked if user searches ALL WORDS
// ------------------------------------------------------
// t: array of search terms
// text: original search text
	var matchesInLine=0;
	var matchMaxCnt=0;
	var refineAllString="";
	var myMatchFiles=new Array();
	scopePtnLcl=scopePtn;
	for(i=0;i<top.profiles.length;i++) {
		if (top.profiles[i].match(/<siHdr4\w+/i)) {
      ParseSiHdr(top.profiles[i]);
		  continue;
		}
		if ((scopePtnLcl!='') && (!top.profiles[i].match(scopePtnLcl))) { continue; } 
		var allConfirmation=true;
		// use only content part of profile
		var splitline=top.profiles[i].split("|");
		refineAllString=('' + splitline[srchBase]).toUpperCase();
		matchesInLine=0;
		for(j=0;j<t.length;j++) {
			myRE=RegExp(t[j], "gi");
			matchesArray=refineAllString.match(myRE);
			if(matchesArray!=null) {
				matchesInLine=matchesInLine+matchesArray.length;
			}
			else {
				allConfirmation=false;
			}
		}
		if(allConfirmation) {
			// Store only hits, title and URL
			myMatches[indexer]=(0-matchesInLine)+"|"+splitline[0]+"|"+splitline[5];
			if (matchesInLine) {
  			myMatchFiles[splitline[5]]=matchesInLine;
  			if (matchesInLine > matchMaxCnt) { matchMaxCnt=matchesInLine }
  		}
  		if (sortMode=='lvl1') { myMatches[indexer]+="|" + splitline[1].replace(/>\d+/, '') }
               		     else { myMatches[indexer]+="|" + splitline[1] }
      myMatches[indexer]+="|" + siOfs + "|" + siDir + "|" + siUT + "|" + siDocid;
			indexer++;
		}
	}
	DisplayResult(text, matchMaxCnt, myMatches, myMatchFiles);
}

// ------------------------------------------------------
function doSearchPgid(t, text, srchBase) {
// ------------------------------------------------------
// Variant of search all for internal purposes
// ------------------------------------------------------
	var matchesInLine=0;
	var matchMaxCnt=0;
	var refineAllString="";
	var myMatchFiles=new Array();
	scopePtnLcl=scopePtn;
	for(i=0;i<top.profiles.length;i++) {
		if (top.profiles[i].match(/<siHdr4\w+/i)) {
      ParseSiHdr(top.profiles[i]);
		  continue;
		}
		if ((scopePtnLcl!='') && (!top.profiles[i].match(scopePtnLcl))) { continue; } 
		var allConfirmation=true;
		// use only content part of profile
		var splitline=top.profiles[i].split("|");
		refineAllString=(''+ splitline[5]).toUpperCase().replace(/\.html?/, '') + ";" + splitline[2].toUpperCase();
		matchesInLine=0;
		for(j=0;j<t.length;j++) {
			myRE=RegExp(t[j], "gi");
			matchesArray=refineAllString.match(myRE);
			if(matchesArray!=null) {
				matchesInLine=matchesInLine+matchesArray.length;
			}
			else {
				allConfirmation=false;
			}
		}
		if(allConfirmation) {
			// Store only hits, title and URL
			myMatches[indexer]=(0-matchesInLine)+"|"+splitline[0]+"|"+splitline[5];
			if (matchesInLine) {
  			myMatchFiles[splitline[5]]=matchesInLine;
  			if (matchesInLine > matchMaxCnt) { matchMaxCnt=matchesInLine }
  		}
  		if (sortMode=='lvl1') { myMatches[indexer]+="|" + splitline[1].replace(/>\d+/, '') }
               		     else { myMatches[indexer]+="|" + splitline[1] }
      myMatches[indexer]+="|" + siOfs + "|" + siDir + "|" + siUT + "|" + siDocid;

			indexer++;
		}
	}
	DisplayResult(text, matchMaxCnt, myMatches, myMatchFiles);
}

// ------------------------------------------------------
function doSearchExactPhrase(t, text, srchBase) {
// ------------------------------------------------------
// If user wants exact phrase
// ------------------------------------------------------
// t: search term
// text: original search text
	var matchesInLine=0;
	var matchMaxCnt=0;
	var refineAllString="";
	var myMatchFiles=new Array();
	scopePtnLcl=scopePtn;
	for(i=0;i<top.profiles.length;i++) {
		// use only content part of profile
		if (top.profiles[i].match(/<siHdr4\w+/i)) {
      ParseSiHdr(top.profiles[i]);
		  continue;
		}
		if ((scopePtnLcl!='') && (!top.profiles[i].match(scopePtnLcl))) { continue; } 
		var splitline=top.profiles[i].split("|");
		refineAllString=splitline[srchBase].toUpperCase();
		matchesInLine=0;
  	myRE=RegExp(t, "gi");
		matchesArray=refineAllString.match(myRE);
		if(matchesArray!=null) {
			// Store only hits, title and URL
			matchesInLine=matchesInLine+matchesArray.length;
			myMatches[indexer]=(0-matchesInLine)+"|"+splitline[0]+"|"+splitline[5];
			if (matchesInLine) {
  			myMatchFiles[splitline[5]]=matchesInLine;
  			if (matchesInLine > matchMaxCnt) { matchMaxCnt=matchesInLine }
  		}
  		if (sortMode=='lvl1') { myMatches[indexer]+="|" + splitline[1].replace(/>\d+/, '') }
              		     else { myMatches[indexer]+="|" + splitline[1] }
      myMatches[indexer]+="|" + siOfs + "|" + siDir + "|" + siUT + "|" + siDocid;
			indexer++;
		}
	}
	DisplayResult(text, matchMaxCnt, myMatches, myMatchFiles);
}

// ===================================================================
//    Create output 
// ===================================================================

// ------------------------------------------------------
function DisplayResult(text, matchMaxCnt, myMatches, myMatchFiles) {
// ------------------------------------------------------
// Wrapper for different result page functions,
// nestoc processing, storing result in top for restore/further evaluation
// ------------------------------------------------------
	if (parseInt(top.ftsSortMode)==2 || top.ftsSortMode=="toc" || 	(getQueryString("TocAdHoc")==1)) {
	  var srchRsltPtn='';
	  var matchCntCnt='';
	  var ids4expandPtn=new Array();
    ftsMsg("Searching...");

	  var nesTocArr=new Array();
	  var dbgKey='';
    if (parent && parent.frame2 && nesToc) {
      var nesTocArrTmp=nesToc.split(/;/g);
      for (var n=0; n<nesTocArrTmp.length; n++) {
        var idFile=nesTocArrTmp[n].split(/:/);
        nesTocArr[idFile[1]]=idFile[0];
        dbgKey+=idFile[0] + ">" + idFile[1] + "\n";
  			myMatchFiles[idFile[0]]=myMatchFiles[idFile[1]+".htm"];
      }
    }
    // alert(dbgKey);

    var unmatched8nestoc=''; // just for debugging as soon as working with full TOC
    var ids4siblPtn=new Array();
	  for (var fname in myMatchFiles) { 
	    var key=fname.replace(/\.html?/i, '')
	    if (nesTocArr[key]) { 
	      var myNestocID=nesTocArr[key];
	      srchRsltPtn+="|" + myNestocID; 
        ids4siblPtn[myNestocID.replace(/\d+(\||$)/, '\\d+')]++;
        while (myNestocID.match(/-\d/)) {
          myNestocID=myNestocID.replace(/-\d+$/, '');
          ids4expandPtn[myNestocID]++;
          ids4siblPtn[myNestocID.replace(/\d+(\||$)/, '\\d+')]++;
        }
	    } else  { 
	      unmatched8nestoc+=key + "\n" 
	    }
	  }
    var ftsExpandPtn='';
    var ftsSiblPtn='';
	  for (var key in ids4expandPtn) {  ftsExpandPtn+="|" + key;  }
	  for (var key in ids4siblPtn)   {  ftsSiblPtn+="|" + key;    }
	  top.ftsRsltPtn         = srchRsltPtn.replace(/^\|/, '');;
	  top.ftsExpandPtn       = ftsExpandPtn.replace(/^\|/, '');;
	  top.ftsMatchSiblingPtn = ftsSiblPtn.replace(/^\|/, '');
	  top.ftsRslt            = myMatchFiles;
	  top.ftsMatchMaxCnt     = matchMaxCnt;
	  this.location=top.tocredir + "toc4js.htm?srchRslt";
	} else if(myMatches.length==0) { 
	  writeNoResultPage(text);return;
	} else {
	  writeResultPage(myMatches,text);
  }
}

// ------------------------------------------------------
function writeNoResultPage(text) {
// ------------------------------------------------------
// Write no-results page
// ------------------------------------------------------
// text: original search text, not needed here
// ------------------------------------------------------
  var ftsResElem=document.getElementById("ftsRes");
	var resList='';
  var msg='';
  if      (top.ftsScope==1) { msg=top.lbl4fts["fts_MsgNoMatchCurNd"]; }
  else if (top.ftsScope==2) { msg=top.lbl4fts["fts_MsgNoMatchCurPg"]; } 
  else if (top.ftsScope==3) { msg=top.lbl4fts["fts_MsgNoMatch"]; }
  else                      { msg=top.lbl4fts["fts_MsgNoMatch"];      }
	
	resList+="<br><div class=\"ftslistTitle nomatch\">" + msg + "</div>";
	
  ftsResElem.innerHTML=resList;
	return true;
}

// ------------------------------------------------------
function writeResultCountOnly(hitCnt) {
// ------------------------------------------------------
  var ftsResElem=document.getElementById("ftsRes");
	var div = appendElement(ftsResElem, "div");
	div.className = "ftslistTitle";
	div.id = "pgHitCntDispl";
	if (top.lbl4fts) {
  	var scopeDiv = appendElement(ftsResElem, "div");
  	scopeDiv.className = "ftsRsltAddinfo";
	  scopeDiv.innerHTML= top.lbl4fts["ftsRsltScope"+top.ftsScope];
  	scopeDiv.id = "pgHitCntScope";
  }
	var ul = appendElement(ftsResElem, "div");
	ul.className = "ftslist";
	var p = appendElement(ul, "p");
	p.id = "ftsRsltSeeHl";
  appendText(p, top.lbl4fts["ftsRsltSeeHl"]);

  if (hitCnt && hitCnt>0) {
    appendText(div, "" + hitCnt + " " + top.lbl4fts["rsltPgTtl"]);
    if (top.lbl4fts) {
      scopeDiv.innerHTML= top.lbl4fts["ftsRsltScope"+top.ftsScope];
      if ((top.doclang!="en") && (top.siRead.match(/-en(-\d+)?#/i))) {
        scopeDiv.innerHTML+= "<br>" + top.lbl4fts["rsltNtEnModOnly"];
      }
    }
  }
  return true;
}

// ------------------------------------------------------
function writeResultPage(passedArray, text) {
// ------------------------------------------------------
	var thisPageNum=(getQueryString("range")!="") ? parseInt(getQueryString("range")):1;
	var beginResult=maxResults*(thisPageNum-1)+1; // initially 1
	var endResult=(parseInt(beginResult+maxResults-1)<passedArray.length) ? parseInt(beginResult+maxResults-1):passedArray.length;
  var ftsResElem=document.getElementById("ftsRes");
	var resList='';
	var horizontalLine;
	var div;
	var span;
	var unorderedList;
	var li;
	var link;
	var adi;
	var li4div;
	var ul4div;
  var siUT=new String('');
  var siDocid=new String('');

	// write result summary
	div = appendElement(ftsResElem, "div");
	div.className = "ftslistTitle";
	span = appendElement(div, "span");
	span.className = "ftslistTitle";
	appendText(span, "" + passedArray.length + " " + top.lbl4fts["rsltPgTtl"] + ":");
	appendText(div, " ");

	var pagingDiv = appendElement(ftsResElem, "div");
	if (passedArray.length>maxResults) {
    div = appendElement(pagingDiv, "div");
    div.className = "ftsPglist";
		maxPageNum=parseInt(passedArray.length/maxResults);
		if(passedArray.length/maxResults>maxPageNum)maxPageNum++;
		appendText(div, " ");
		
		for(i=0;i<maxPageNum;i++) {
			thisLocation=(location.href.indexOf("&range=")>-1) ? changeParam("range",parseInt(i+1)):location.href+"&range="+parseInt(i+1);
			if(parseInt(i+1)!=thisPageNum) {
				link = appendElement(div, "a");
				link.setAttribute("href", thisLocation);
				link.setAttribute("target", "_self");
				appendText(link, "" + (i+1));
			} else {
				var pgSpan = appendElement(div, "span");
				appendText(pgSpan, (i+1));
				pgSpan.className="act";
			}
		}
	} 
	if (top.lbl4fts) {
  	var scopeDiv = appendElement(ftsResElem, "div");
  	scopeDiv.className = "ftsRsltAddinfo";
	  if ((top.ftsScope==3) && (top.ftsSortMode==0)) {
  	  scopeDiv.innerHTML= top.lbl4fts["ftsRsltScope"+top.ftsScope] + "<br>" + top.lbl4fts["ftsRsltScopeCurMod"] + " / " + top.lbl4fts["ftsRsltScopeOthMod"];
	  } else {
  	  scopeDiv.innerHTML= top.lbl4fts["ftsRsltScope"+top.ftsScope];
    }
    if ((top.doclang!="en") && (top.siRead.match(/-en(-\d+)?#/i))) {
      scopeDiv.innerHTML+= "<br>" + top.lbl4fts["rsltNtEnModOnly"];
    }
  }
	    
	unorderedList = appendElement(ftsResElem, "ul");
	unorderedList.className = "ftslist";
  // -------------------------------------------------------------
	if (sortMode=='lvl1') { // sort by top node first
  // -------------------------------------------------------------
  	passedArray.sort(compareDiv); // see compareDiv function below
  	var divPrev='';
  	var divRef;
  	var siUTprev='';
  	var siutCnt=0;
  	var liCnt=0;
    // -----------------------------------------
    // Write result lines
    for (i=(beginResult-1);i<endResult;i++) {
    // -----------------------------------------
      splitline=passedArray[i].split("|");
      rank=parseInt(splitline[0]);
      if(rank<0)rank=0-rank;
      if (splitline[6] && splitline[6]!='') { siUT=splitline[6]    } else { siUT=''    }
      if (splitline[7] && splitline[7]!='') { siDocid=splitline[7] } else { siDocid='' }
      if (splitline[3] != divPrev) {
          if (siUT!='' && siUT!=siUTprev) {
         li4div = appendElement(unorderedList, "li");
             li4div.className = "ftsSiut-clps0";
             siutCnt++;
             li4div.id = "ftsgrp-"+siutCnt;
             li4div.onclick=function(){
               var l=document.getElementsByTagName("li");
               var clps2use=" hideMe";
               if (this.className.match(/-clps0/i)) {
                 this.className=this.className.replace(/-clps0/i, '-clps1');
               } else {
                 clps2use="";
                 this.className=this.className.replace(/-clps1/i, '-clps0');
               }
               for (var i=0; i<l.length; i++) {
                 var re=new RegExp("(" + this.id + ")( hideMe)?", 'i');
                 l[i].className=l[i].className.replace(re, "$1"+clps2use);
               }
             };
             li4div.title="Search results for '" + siUT + "' module. Click to expand/collapse.";
             
             ttl4div = appendElement(li4div, "span");
             appendText(ttl4div, siUT);
             siUTprev=siUT;
          }
         li4div = appendElement(unorderedList, "li");
         li4div.className = "ftsdiv" + " ftsgrp-"+siutCnt;
         ttl4div = appendElement(li4div, "span");
         ttl4div.className = "ftsdiv";
         liCnt++;
         divRef=splitline[3].split('>');
         if (divRef[0]) { divRef[0]=parseInt(divRef[0])+parseInt(splitline[4]) }
         if (divRef[1]) { divRef[1]=parseInt(divRef[1])+parseInt(splitline[4]) }
//         if (siUT!='' && top.divTtl && divRef[0] && top.divTtl[divRef[0]]) {
//           appendText(ttl4div, siUT + ' > ' + top.divTtl[divRef[0]]);
//         } else 
         if (top.divTtl && divRef[1] && top.divTtl[divRef[1]]) {
           appendText(ttl4div, top.divTtl[divRef[0]] + ' > ' + top.divTtl[divRef[1]]);
         } else if (top.divTtl && divRef[0] && top.divTtl[divRef[0]]) {
           appendText(ttl4div, top.divTtl[divRef[0]]);
         } else {
           appendText(ttl4div, splitline[3]);
         }
         ul4div = appendElement(li4div, "ul");
         ul4div.className = "ftsdiv";
         divPrev=splitline[3];
      }
      if (splitline[1]) { splitline[1]=parseInt(splitline[1])+parseInt(splitline[4]) }
      if (parent.seenHits.match("-" + i + "-")) {
         li = appendElement(ul4div, "li");
         li.className = "ftslist";
         link = appendElement(li, "a");
         link.className = "ftsreslinkpassed";
         link.setAttribute("href", splitline[5] + splitline[2]);
         link.setAttribute("onclick", "hitSeen("+i+");");
         link.setAttribute("id", splitline[2].replace(/.*[\/\\]|\.html?$/gi, ''));
         appendText(link, top.divTtl[splitline[1]] + " ("+rank+")");
      } else {
         li = appendElement(ul4div, "li");
         li.className = "ftslist";
         link = appendElement(li, "a");
         link.className = "ftsreslinkpassed";
         link.setAttribute("onclick", "hitSeen("+i+");");
         link.setAttribute("href", splitline[5] + splitline[2]);
         link.setAttribute("id", splitline[2].replace(/.*[\/\\]|\.html?$/gi, ''));
         appendText(link, top.divTtl[splitline[1]] + " ("+rank+")");
       }
    }
  // -------------------------------------------------------------
	} else { // sort by hit count first
  // -------------------------------------------------------------
  	passedArray.sort(compare); // see compare function below
    // -----------------------------------------
    // Write result lines
    for(i=(beginResult-1);i<endResult;i++) {
    // -----------------------------------------
      splitline=passedArray[i].split("|");
      if (splitline[6] && splitline[6]!='') { siUT=splitline[6]    } else { siUT=''    }
      if (splitline[7] && splitline[7]!='') { siDocid=splitline[7] } else { siDocid='' }
      if (splitline[1]) { splitline[1]=parseInt(splitline[1])+parseInt(splitline[4]) }
      rank=parseInt(splitline[0]);
      if(rank<0) {rank=0-rank};
      li = appendElement(unorderedList, "li");
      li.className = "ftslist";
      link = appendElement(li, "a");
      link.className = "ftsreslinkpassed";
      link.setAttribute("onclick", "hitSeen("+i+");");
      link.setAttribute("href", splitline[5] + splitline[2]);
      link.setAttribute("id", splitline[2].replace(/.*[\/\\]|\.html?$/gi, ''));
      appendText(link, top.divTtl[splitline[1]] + " ("+rank+")");
      if (splitline[3] && top.divTtl) {
        adi = appendElement(link, "i");
        adi.className = "ftsadi";            
        // li.style.color = top.modref[siDocid];
        divRef=splitline[3].split('>');
        if (divRef[0]) { divRef[0]=parseInt(divRef[0])+parseInt(splitline[4]) }
        if (divRef[1]) { divRef[1]=parseInt(divRef[1])+parseInt(splitline[4]) }
        if (siUT!='' && divRef[0] && top.divTtl[divRef[0]]) {
          var cls="modref4" + siDocid;
          var pp="";
          if (top.ftsScope && top.ftsScope==3) {
            if (siUT!=top.ut) { cls+=" docDiff"; pp=top.lbl4fts["fts_MatchInCurDocModule"]; }
                         else { cls+=" docSame"; pp=top.lbl4fts["fts_MatchInOtherDocModule"]; }
          }
          var sp = appendElement(adi, "span");
          sp.className = cls;
          sp.title = pp;
          appendText(sp, siUT);
          appendText(adi, ' > ' + top.divTtl[divRef[0]]);
        } else if (divRef[1] && top.divTtl[divRef[1]]) {
          appendText(li, top.divTtl[divRef[0]] + ' > ' + top.divTtl[divRef[1]]);
        } else if (divRef[0] && top.divTtl[divRef[0]]) {
          appendText(li, top.divTtl[divRef[0]]);
        } else {
          appendText(li, '---');
        }
      }
    }
	}
	clearOut();
}


// ------------------------------------------------------
function updResList() {
// ------------------------------------------------------
  var ftsResElem=document.getElementById("ftsRes");
  var e2p=ftsResElem.getElementsByTagName('span');
  var ptn4docid=new RegExp("^modref4" + top.docid + "-" + top.doclang + " ", 'i');
  for (i=0; i<e2p.length; i++) {
    if (e2p[i].className.match(ptn4docid)) {
      e2p[i].className=e2p[i].className.replace(/ (docSame|docDiff)$/i, " docSame");
      e2p[i].title=top.lbl4fts["fts_MatchInOtherDocModule"];
    } else {
      e2p[i].className=e2p[i].className.replace(/ (docSame|docDiff)$/i, " docDiff");
      e2p[i].title=top.lbl4fts["fts_MatchInCurDocModule"];
    }
  }
}

// ===================================================================
//    Auxiliary functions 
// ===================================================================

// ------------------------------------------------------
function hitSeen(indx) {
// ------------------------------------------------------
  parent.seenHits+="-" + indx + "-";
}
  
// ------------------------------------------------------
function clearOut() {
// ------------------------------------------------------
// Clear the arrays and variables generated from the current search
// ------------------------------------------------------
	myMatches.length = 0;
	splitline.length = 0;
	indexer = 0;
	all = false;
}

// ------------------------------------------------------
function changeParam(whichParam, newVal) {
// ------------------------------------------------------
// This function will parse the URL search string and change a name/value pair
// ------------------------------------------------------
	newParamStr = "";
	thisURLstr = document.location.href.substring(0, document.location.href.indexOf("?"));
	thisURLparamStr = document.location.href.substring(document.location.href.indexOf("?") + 1, document.location.href.length);
	//Build array out of thisURLparamStr using "&" as delimiter
	splitline=(thisURLparamStr.split("&"))
	for (cnt=0; cnt < splitline.length; cnt++) {
		splitparam = splitline[cnt].split("=")
		if (splitparam[0] == whichParam) {
			// if we find whichParam in thisURLparamStr replace whichParam's value with newVal
			newParamStr = newParamStr + splitparam[0] + "=" + escape(newVal) + "&";
		} else {
			//leave other parameters intact
			newParamStr = newParamStr + splitparam[0] + "=" + splitparam[1] + "&";
		}
	}
	//strip off trailing ampersand
	if (newParamStr.charAt(newParamStr.length - 1) == "&") newParamStr = newParamStr.substring(0, newParamStr.length - 1);
	//apply new URL
 	return(thisURLstr + "?" + newParamStr);
}

// ------------------------------------------------------
function compare(a, b) {
// ------------------------------------------------------
// Sorts search results based on (1) Number of hits (2) alphabetically
// ------------------------------------------------------
	if (parseInt(a) - parseInt(b) != 0) {
		return parseInt(a) - parseInt(b)
	} else {
		var aComp = a.substring(a.indexOf("|") + 1, a.length)
		var bComp = b.substring(b.indexOf("|") + 1, b.length)
		if (aComp < bComp) {return -1}
		if (aComp > bComp) {return 1}
		return 0
	}
}

// ------------------------------------------------------
function compareDiv(a, b) {
// ------------------------------------------------------
// Sorts search results based on (1) alpabetical order of top level nodes (2) Number of hits 
// ------------------------------------------------------
  var aPosSttl=a.indexOf("|");
  var bPosSttl=b.indexOf("|");
  var aPosTtl=a.lastIndexOf("|")+1;
  var bPosTtl=b.lastIndexOf("|")+1;
  var aDiv = a.substring(aPosTtl) + a.substring(aPosSttl);
  var bDiv = b.substring(bPosTtl) + b.substring(bPosSttl);
	if (aDiv!=bDiv) {
		return parseInt(aDiv) - parseInt(bDiv)
//		if (aDiv < bDiv) {return -1}
//		if (aDiv > bDiv) {return 1}
		return 0
	} else if (parseInt(a) - parseInt(b) != 0) {
		return parseInt(a) - parseInt(b)
	} else {
		var aComp = a.substring(a.indexOf("|") + 1, a.length)
		var bComp = b.substring(b.indexOf("|") + 1, b.length)
		if (aComp < bComp) {return -1}
		if (aComp > bComp) {return 1}
		return 0
	}
}


// ------------------------------------------------------
function HtmlEncode($str, $default) {
// ------------------------------------------------------
	if($str == null || $str.length == 0)
	{
		$str = ($default == null ? '' : $default);
	}
	
	$out = '';
	$len = $str.length;
	
	// Allow: a-z A-Z 0-9 SPACE , .
	// Allow (dec): 97-122 65-90 48-57 32 44 46
	
	for($cnt = 0; $cnt < $len; $cnt++)
	{
		$c = $str.charCodeAt($cnt);
		if( ($c >= 97 && $c <= 122) ||
			($c >= 65 && $c <= 90 ) ||
			($c >= 48 && $c <= 57 ) ||
			$c == 32 || $c == 44 || $c == 46 )
		{
			$out += $str.charAt($cnt);
		}
		else
		{
			$out += '&#' + $c + ';';
		}
	}
	
	return $out;
}

// ------------------------------------------------------
function ParseSiHdr(line) {
// ------------------------------------------------------
  if (line.match(/<siHdr4pi/i)) {
    var orgHeader=line.replace(/.*?>/, '').split("#"); // 1: manid, 2:dir
    siDocid=orgHeader[1];
    if (top.siDirColl[siDocid] && top.siDirColl[siDocid]!='') { siDir=top.siDirColl[siDocid];} 
                                                         else { siDir=''; } // siDir=orgHeader[2].split(";")[0]; // OT-internal note: see toc2toc4js
    siOfs+=siOfsPrev;
    siOfsPrev=parseInt(orgHeader[3]);
    siUT=orgHeader[4];
    if (top.ftsScope!='allmod' && top.ftsScope!='3') {
      if (siDocid!=top.docid + "-" + top.doclang) { scopePtnLcl=RegExp("<--DocOutOfScope-->"); } 
                                             else { scopePtnLcl=scopePtn;     }
    }
  } else if (line.match(/<siHdr4cvt>/i)) {
    top.siDocTtlVers=line.replace(/<\/?siHdr\w+>/gi, '')
  } else if (line.match(/<siHdr4cut>/i)) {
    top.siDocTtl=line.replace(/<\/?siHdr\w+>/gi, '')
  }
}	

// ------------------------------------------------------
function setQueryString() {
// ------------------------------------------------------
	$searchField = document.getElementById('searchField');
	$searchField.value = getQueryString("searchField");
}

// ------------------------------------------------------
function appendElement(parent, elementName) {
// ------------------------------------------------------
	var child = document.createElement(elementName);
	parent.appendChild(child);
	return child;
}

// ------------------------------------------------------
function appendText(parent, text) {
// ------------------------------------------------------
	var textNode = document.createTextNode(text);
	parent.appendChild(textNode);
}

