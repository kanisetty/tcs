 window.focus()
 document.maxtoc=5;
 document.currentToc=3;
 document.LinkToRememberNum='';
 window.switchingToc=0;
 window.TocUpdatedBy=new String('none');
 window.TocUpdCnt=0;
 window.seenHits=new String();
 var myRefWin;

 // ----------------------------------
 function SetLinks(bwlink,fwlink,hmlink,endlink,CurTocLevel) {
 // ----------------------------------
 // This function is called by frame2 pages to set the local links
 // that are used in the "for" script below then.
 // (c) 2004 Ekbert Mertens, IXOS SOFTWARE AG
   document.backwardlink=bwlink;
   document.forwardlink=fwlink;
   document.homelink=hmlink;
   document.endlink=endlink;
   document.CurTocLevel=CurTocLevel;
 }
 
 // ----------------------------------
 function MarkCurrentTocLink(toMatch) {
 // ----------------------------------
 // This function is called to highlight the TOC entry that matches the currently
 // displayed HTML file. It also changes the displayed TOC page to the deepest one, if
 // no matching TOC entry is found on the current TOC page. Unfortunately, in IE, 
 // the highlighting does not work immediately after this TOC change; obviously, 
 // the location change is not correctly stored internally.
 // (c) 2004 Ekbert Mertens, IXOS SOFTWARE AG
   var TocDoc=frame1.document;
   var found=0;
   var loopCnt=0;
   var j=0;
   var i=0;
   var k=0;
   var TocDocLoc=String("");
   var re=RegExp("xx", "i");
   
   if (toMatch=="--reset--") { 
     document.LinkToRememberNum=''; 
     document.LinkToRememberClassName='';
     // top.LinkToRememberClassName='';
     top.searchField='';
     top.searchMode='';
     return;
   }  
   
   TocDocLoc=String(frame1.location);
   if ((TocDoc.links[1] != null) && (TocDoc.links) && (!(TocDocLoc.match(/fts\.htm/i))))  {
     do {
       if (TocDocLoc.indexOf("idx2.htm")>0) { return }
       loopCnt++;
       if (document.LinkToRememberNum != '') {
         var myArr=document.LinkToRememberNum.split(";");
         for (var i=0; i < myArr.length; i++) {
           if ((myArr[i]>0) && (TocDoc.links[myArr[i]])) {
             TocDoc.links[myArr[i]].className=document.LinkToRememberClassName;
             var parNode=TocDoc.links[myArr[i]].parentNode;
             strg=TocDoc.links[myArr[i]].className
             strg.replace(/ active /gi, "");
             parNode.className=document.LinkToRememberClassNamePar1;
             parNode=parNode.parentNode;
             parNode.className=document.LinkToRememberClassNamePar2;
           }  
         }  
       }  
       document.LinkToRememberNum='';
  
       for (var k=0; k < TocDoc.links.length; k++) {
         if ((TocDoc.links[k].href.indexOf("/"+toMatch)>0) && (TocDoc.links[k].href.indexOf("#")<0))  { 
           document.LinkToRememberClassName=TocDoc.links[k].className;
           document.LinkToRememberNum=document.LinkToRememberNum + ";" + k;
           TocDoc.links[k].className = "active " + TocDoc.links[k].className;
           var parNode=TocDoc.links[k].parentNode;
           document.LinkToRememberClassNamePar1=parNode.className;
           parNode.className = "active " + parNode.className;
           parNode=parNode.parentNode;
           document.LinkToRememberClassNamePar2=parNode.className;
           parNode.className = "active " + parNode.className;
           found++;
           if (found==1) { 
             var id2go=new String(TocDoc.links[k].href);
             id2go=id2go.replace(/.*\//, "");
             TocDoc.getElementById(id2go).focus();
             // TocDoc.links[k].scrollBy(-100,0);
           } // to scroll the TOC if necessary
           window.focus(); // to re-activate general key codes in the script below
         }
       } 
       if ((found==0) && (window.switchingToc!=1)) { 
         TocDocLoc=TocDocLoc.replace(/([\/\\])[^\/\\]*?$/, "$1" + "toc" + document.maxtoc + ".htm");
         frame1.location=TocDocLoc;
         TocDoc=frame1.document;
       }  
     } while ((found==0) && (loopCnt<2));
   }  
   window.switchingToc=0;
   if (window.TocUpdatedBy==toMatch) { 
     window.TocUpdCnt++;
   } else { 
     window.TocUpdCnt=1;
     window.TocUpdatedBy=toMatch;
   }  
 }  

 // ----------------------------------
 function PutInfoToClipboard(FullId,piInfoCounter,LocString) {
 // ----------------------------------
    piInfoCounter++;
    ManId='';
    SectId='';
    if (piInfoCounter == 5) { piInfoCounter=1 }
    switch(piInfoCounter) {
      case 1:
        ClipString=String(LocString);
        ClipString=ClipString.replace(/file:/g, "")
        ClipString=ClipString.replace(/^\/+(\w:)/g, "$1")
        ClipString=ClipString.replace(/\//g, "\\")
        break;
      case 2:
        ClipString=String(LocString);
        break;
      case 3:
        SectId=FullId.replace(/(Pre-|Prel-|FCS-|RMP-)?([a-zA-Z]+?)((?:\d+[a-zA-Z]?)|(?:\&[\w\-\d]+;))?(-H|-X|-\d+)?-([a-zA-Z]+?)(-([a-zA-Z\/]+?))?(-((?:\d+)|(?:\&[\w\-\d]+;)))?\.([a-zA-Z_\-\.]*)$/, "$1>>$2-$5.$10");
        ClipString=SectId.replace(/.*?>>/, "");
        break;
      default:
        ClipString=FullId;
        break;
    }        
    window.clipboardData.setData('Text', ClipString); 
    window.status='Copied to Clipboard: ' + ClipString;
    return piInfoCounter;
  }
 

 // ----------------------------------
 function RefWin(page, targetspec, winspec) {
 // ----------------------------------
   if (winspec=="small") {
     var tgtX=screen.availWidth-310;
     winspec="top=0, left=0, toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, resizable=yes, width=300, height=300";
   } else if (winspec=="listing") {
     var tgtX=screen.availWidth-610;
     var tgtH=screen.availHeight-30;
     winspec="top=0, left=0, toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, resizable=yes, width=600, height=" + tgtH;
   } else if (winspec=="") {
     var tgtX=screen.availWidth-410;
     winspec="toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, resizable=yes, width=600, height=400";
   };
   if (!myRefWin || myRefWin.closed){
       myRefWin = window.open(page, "pirefwin_" + targetspec, winspec);
       myRefWin.moveTo(tgtX,0);
   }   
   myRefWin.location=page;
   myRefWin.focus();
   return false; // to skip actual href processing
 }
 
 
 // Enable navigation via keyboard (note the difference between frameset level and page evel!):
 // * PgDn/PgUp or CsLeft/CsRight on frameset level: scroll page by page
 // * CsDn/CsUp: Switch to page level and scroll within the page
 // * PgDn/PgUp on page level: Scroll in steps of screen height *within the page*
 // * ESC: Switch back to frameset level
 // * Numbers: Open TOC of <number> level, if available
 // * "i" or "x": Open index in TOC frame
 // Tested in Netscape 7 (Firefox, mozilla) and IE 6; will not work in lower versions.
 // The *link variables are set by the frame2 pages via the SetLinks function above.
 // (c) 2004 Ekbert Mertens, IXOS SOFTWARE AG
function handleKeyCode(evt) {
  evt= (evt) ? evt : ((window.event) ? event : null);
  if (evt) {
    if      ((document.backwardlink != "") && ((evt.keyCode==33) || (evt.keyCode==37)))
                { frame2.location=document.backwardlink; return true; }
    else if ((document.forwardlink != "") && ((evt.keyCode==34) || (evt.keyCode==39)))
                { frame2.location=document.forwardlink; return true; }
    else if ((document.forwardlink != "") && (evt.keyCode==36))
                { frame2.location=document.homelink; return true; }
    else if ((document.forwardlink != "") && (evt.keyCode==35))
                { frame2.location=document.endlink; return true; }
              
    else if ((evt.keyCode>96) && (evt.keyCode<(97+document.maxtoc)))
                { frame1.location="toc"+(evt.keyCode-96)+".htm"; return true; }
    else if ((evt.keyCode>48) && (evt.keyCode<(49+document.maxtoc)))
                { frame1.location="toc"+(evt.keyCode-48)+".htm"; return true; }
              
    else if ((document.currentToc<document.maxtoc) && ((evt.charCode==43) ||  (evt.keyCode==187) || (evt.keyCode==107))) // plus
                { document.currentToc++; frame1.location="toc"+document.currentToc+".htm"; return true; }
    else if ((document.currentToc>1) && ((evt.charCode==45) || (evt.keyCode==189) || (evt.keyCode==109))) // minus
                { document.currentToc--; frame1.location="toc"+document.currentToc+".htm"; return true; }
    else if ((evt.keyCode==40) || (evt.keyCode==38))
                { frame2.focus(); return true; }

//      else if (evt.keyCode==27)
//                  { frame1.focus(); return true; }
    else if ((evt.keyCode==73) || (evt.keyCode==88)) // I or X to Index
                { frame1.location="idx2.htm"; return true; }
    else if ((evt.keyCode==83) || (evt.keyCode==105)) // S or F 12343to search
                { frame1.location="fts.html?searchField="; return true; }
    else { return true; }
  }              
}  
document.onkeyup = handleKeyCode;
