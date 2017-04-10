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
*/

//*************************************************************************
// Define global variables

// the maxResults variable determines how many results are displayed per page:
var maxResults=15;

var myMatches=new Array();
var splitline=new Array();
var indexer=0;
var srcCrit="any"; // may be overwritten
var vResults='';
var idSrch=0;
var seenHitsLocal=''; // used only if search is run without a parent HTML

function SetDocLang(myLang) {
//  switch(myLang) {
//      case 'de'     : vResults="Treffer"; break;
//      case 'default': vResults="Matches"; break;
//  } // may be overwritten
}

//*************************************************************************
//Search Results page should call this function

function doSearch() {
	fullEntry=getQueryString('searchField'); // "+" converted to space
  idSrch=0;
  if (fullEntry.match(/^:id:[^\s]+$/)) { fullEntry=fullEntry.replace(/:id:/, ''); idSrch=1; }
	if(fullEntry!="") {
		filteredEntry="";
		//Look for multiple spaces (white space = \s)
		filteredEntry=fullEntry.replace(/\s+/g," ");
		prepareSearch(filteredEntry);
	}
}

//*************************************************************************
// This generic function will return the value of a QueryString
// If a variable is available, it is used

function getQueryString(Val) {
	if(Val=='searchField'){
		if(top){
			if(top.ftsSrchExpr){
				if(top.ftsSrchExpr!=""){return top.ftsSrchExpr;}
			}
		}
	}
	if(Val=='searchMode'){
		if(top){
			if(top.ftsSrchMode){
				if(top.ftsSrchMode!=""){return top.ftsSrchMode;}
			}
		}
	}
	thisURLparamStr=document.location.search;
	//chop "?" off thisURLparamStr
	if(thisURLparamStr.charAt(0)=="?") thisURLparamStr=thisURLparamStr.substring(1,thisURLparamStr.length);
	returnStr="";
	if(thisURLparamStr!="") {
		//Build array out of thisURLparamStr using "&" as delimiter
		splitline=thisURLparamStr.split("&");
		for(i=0;i<splitline.length;i++) {
			splitparam=splitline[i].split("=");
			if(unescape(splitparam[0])==Val) returnStr=unescape(splitparam[1]);
		}
		returnStr=returnStr.replace(/\+/g," ");
	}
	return returnStr;
}

//*************************************************************************
//Determine any word/all words/phrase search

function prepareSearch(text) {
	//clean up spaces at beginning of string
	while(text.charAt(0)==' ') text=text.substring(1,text.length);
	//clean up spaces at end of string
	while(text.charAt(text.length-1)==' ') text=text.substring(0,text.length-1);
	if(text.length<1) {
		alert("ERROR: Please type some text before starting any search.");
		return;
	}
	// default srcCrit defined above;
	if (parseInt(getQueryString('searchMode'))==0||getQueryString('searchMode')=="any") srcCrit="any";
	if (parseInt(getQueryString('searchMode'))==1||getQueryString('searchMode')=="all") srcCrit="all";
	if (parseInt(getQueryString('searchMode'))==2||getQueryString('searchMode')=="phrase") srcCrit="phrase";
	var entry=text;
	if(entry.charAt(0)=="~") { // full RegExp search
		entry=entry.substring(1,entry.length);
	}
	else { // only * and ? wildcards
		entry=entry.replace(/([\\\^\$\+\{\}\.\(\)\|\[\]])/g,"\\$1");  // v4.6  // v5.6 remove slash
		entry=entry.replace(/\*/g,"[^¶\\x20\\f\\n\\r\\t\\v<>]*");
		entry=entry.replace(/\?/g,"(&nbsp;|[^¶\\x20\\f\\n\\r\\t\\v<>])");
		entry=entry.replace(/-/g,"(\-|‑|–|—)");
	}
	entry=entry.replace(/\//g,"\\/");
	if(srcCrit=="phrase") {doSearchExactPhrase(entry,text);return;}
	else {
		// If not exact phrase, split the entry string into an array
		searchArray=entry.split(" ");
		if(idSrch==1) {doSearchPgid(searchArray,text);return;}
		if(srcCrit=="any") {doSearchAny(searchArray,text);return;}
		else if(srcCrit=="all") {doSearchAll(searchArray,text);return;}
	}
}

//*************************************************************
// Evoked if user searches ANY WORDS

// t: array of search terms
// text: original search text

function doSearchAny(t,text) {
	var matchesInLine=0;
	var refineAllString = "";
	for(i=0;i<profiles.length;i++) {
		// use only content part of profile
		var splitline=profiles[i].split("|");
		refineAllString=splitline[3].toUpperCase();
		matchesInLine=0;
		for(j=0;j<t.length;j++) {
			myRE=RegExp(t[j], "gi");
			matchesArray=refineAllString.match(myRE);
			if(matchesArray!=null)matchesInLine=matchesInLine+matchesArray.length;
		}
		if(matchesInLine>0) {
			// Store only hits, title and URL
			myMatches[indexer]=(0-matchesInLine)+"|"+splitline[0]+"|"+splitline[4];
			indexer++;
		}
	}
	if(myMatches.length==0) {writeNoResultPage(text);return;}
	else {writeResultPage(myMatches,text);}
}

//*************************************************************
// Evoked if user searches ALL WORDS

// t: array of search terms
// text: original search text

function doSearchAll(t,text) {
	var matchesInLine=0;
	var refineAllString="";
	for(i=0;i<profiles.length;i++) {
		var allConfirmation=true;
		// use only content part of profile
		var splitline=profiles[i].split("|");
		refineAllString=splitline[3].toUpperCase();
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
			myMatches[indexer]=(0-matchesInLine)+"|"+splitline[0]+"|"+splitline[4];
			indexer++;
		}
	}
	if(myMatches.length==0) {writeNoResultPage(text);return;}
	else {writeResultPage(myMatches,text);}
}

function doSearchPgid(t,text) {
	var matchesInLine=0;
	var refineAllString="";
	for(i=0;i<profiles.length;i++) {
		var allConfirmation=true;
		// use only content part of profile
		var splitline=profiles[i].split("|");
		refineAllString=splitline[4].toUpperCase().replace(/\.html?/, '') + ";" + splitline[2].toUpperCase();
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
			myMatches[indexer]=(0-matchesInLine)+"|"+splitline[0]+"|"+splitline[4];
			indexer++;
		}
	}
	if(myMatches.length==0) {writeNoResultPage(text);return;}
	else {writeResultPage(myMatches,text);}
}


//*************************************************************
// If user wants exact phrase

// t: search term
// text: original search text

function doSearchExactPhrase(t,text) {
	var matchesInLine=0;
	var refineAllString="";
	for(i=0;i<profiles.length;i++) {
		// use only content part of profile
		var splitline=profiles[i].split("|");
		refineAllString=splitline[3].toUpperCase();
		matchesInLine=0;
  	myRE=RegExp(t, "gi");
		matchesArray=refineAllString.match(myRE);
		if(matchesArray!=null) {
			// Store only hits, title and URL
			matchesInLine=matchesInLine+matchesArray.length;
			myMatches[indexer]=(0-matchesInLine)+"|"+splitline[0]+"|"+splitline[4];
			indexer++;
		}
	}
	if(myMatches.length==0) {writeNoResultPage(text);return;}
	else {writeResultPage(myMatches,text);}
}

//*************************************************************
// Write no-results page

// text: original search text, not needed here

function writeNoResultPage(text) {
  var ftsResElem=document.getElementById("ftsRes");
	var resList='';
	resList+="<br><div class=\"ftslistTitle nomatch\"><span class=\"ftslistTitle\">"+vResults+": </span>0</div>";
  ftsResElem.innerHTML=resList;
	return true;
}

//*************************************************************
// Write successfull search results page

// passedArray[i]: "-Treffer|Titel|URL"
// text: original search text, not needed here

function hitSeen(indx) {
  parent.seenHits+="-" + indx + "-";
}
  

//*************************************************************
// Clear the arrays and variables generated from the current search

function clearOut() {
	myMatches.length = 0;
	splitline.length = 0;
	indexer = 0;
	all = false;
}

//*************************************************************************
// This function will parse the URL search string and change a name/value pair

function changeParam(whichParam, newVal) {
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

//*************************************************************
// Sorts search results based on 1.Number of hits 2.alphabetically

function compare(a, b) {
	if (parseInt(a) - parseInt(b) != 0) {
		return parseInt(a) - parseInt(b)
	}else {
		var aComp = a.substring(a.indexOf("|") + 1, a.length)
		var bComp = b.substring(b.indexOf("|") + 1, b.length)
		if (aComp < bComp) {return -1}
		if (aComp > bComp) {return 1}
		return 0
	}
}

function HtmlEncode($str, $default)
{
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

function setQueryString() {
	$searchField = document.getElementById('searchField');
	$searchField.value = getQueryString("searchField");
}


function writeResultPage(passedArray, text) {
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

	// write result summary
	div = appendElement(ftsResElem, "div");
	div.className = "ftslistTitle";
	span = appendElement(div, "span");
	span.className = "ftslistTitle";
	appendText(span, "" +vResults+":");
	appendText(div, " ");
	span = appendElement(div, "span");
	span.className = "ftslistCountInTitle";
	appendText(span, " ("+beginResult+"-"+endResult+" / "+passedArray.length+")");

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
			}
			else {
				var pgSpan = appendElement(div, "span");
				appendText(pgSpan, (i+1));
				pgSpan.className="act";
			}
		}
	} 

	unorderedList = appendElement(ftsResElem, "ul");
	unorderedList.className = "ftslist";

	passedArray.sort(compare); // see compare function below
	// write result lines
	for(i=(beginResult-1);i<endResult;i++) {
		splitline=passedArray[i].split("|");
		rank=parseInt(splitline[0]);
		if(rank<0)rank=0-rank;
		if (parent.seenHits.match("-" + i + "-")) {
       li = appendElement(unorderedList, "li");
		   li.className = "ftslist";
		   link = appendElement(li, "a");
		   link.className = "ftsreslinkpassed";
		   link.setAttribute("href", splitline[2]);
		   appendText(link, splitline[1] + " ("+rank+")");
		   
	    } else {
       resList+="<li class=\"ftslist\"><a class=\"ftsreslink\" onclick=\"hitSeen("+i+"); this.className='ftsreslinkpassed'\" href=\""+splitline[2]+"\">"+splitline[1]+" ("+rank+")</a></li>";
		   li = appendElement(unorderedList, "li");
		   li.className = "ftslist";
		   link = appendElement(li, "a");
		   link.className = "ftsreslink";
		   link.setAttribute("onclick", "hitSeen("+i+"); this.className='ftsreslinkpassed'");
		   link.setAttribute("href", splitline[2]);
		   
		   appendText(link, splitline[1] + " ("+rank+")");
     }
	}
	clearOut();
}

function appendElement(parent, elementName) {
	var child = document.createElement(elementName);
	parent.appendChild(child);
	return child;
}

function appendText(parent, text) {
	var textNode = document.createTextNode(text);
	parent.appendChild(textNode);
}

