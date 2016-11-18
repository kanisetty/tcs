  var keyPressed=-1;
  var nesTocIn;
  var tst1;
  var chldnum4fv=0;
  var timers= {};
  if (window.chnum4fv && window.chnum4fv>0) { chldnum4fv=window.chnum4fv; }
  top.ftsPrevSeenHit=''; // generally reset when page in TOC pane changes

  // ================================================================================
   function ProcVis(teCur, options) {
  // ================================================================================
    if (options && options.match(/^init$/)) {
    // - - - - - - - - - - - - - - - - - -
    // Restore former trace, when user jmps back from search to TOC page
      var visCnt=0;
      for (var v=top.visArr.length; v>=0; v--) {
        var te=document.getElementById(top.visArr[v]);
        if (te) { 
          if (te.className) { te.className=te.className.replace(/ vis\d*/, '') + ' vis'+visCnt }
                       else { te.className= ' vis'+visCnt; }
          if (visCnt<4) { visCnt++ };
        }
      }
    // - - - - - - - - - - - - - - - - - -
    } else if (options && options.match(/^regMove:/)) {
    // - - - - - - - - - - - - - - - - - -
      // Just add ID to race list; no actaul processing, since called from search (no TOC list available)
      // If the ID is not a toc ID (ttr-\d-\d...), map it to the related TOC ID via nestoc.
      var tgt=options.match(/^regMove:(.*)/);
      if (tgt[1].match(/^ttr(-\d+)+$/i)) { 
        top.visArr.push(tgt[1]);
      } else {
        var curIdPtn=new RegExp(";([\\d\\-]+):" + tgt[1] + ";", 'i');
        nesTocIn=nesToc.match(curIdPtn);
        if (nesTocIn) { top.visArr.push("ttr-" + nesTocIn[1]); }
      }
    // - - - - - - - - - - - - - - - - - -
    } else if (teCur && teCur.className && !teCur.className.match(/ vis[012]( |$)/)) {
    // - - - - - - - - - - - - - - - - - -
      // Add ID to trace list and update classes of TOC entries
      if (!(options && options.match(/init/))) {
        teCur.className=teCur.className.replace(/ vis\d/gi, '');
        teCur.className+=" vis0";
        top.visArr.push(teCur.id);
      }
      var te;
      for (var v=1; v<4; v++) {
        var te=document.getElementById(top.visArr[top.visArr.length-v-1]);
        if (te && te.className) { te.className=te.className.replace(/ vis\d*/, ' vis'+v); }
      }
    }
  }
    
  var timeout;
  // ================================================================================
  function procInput(rootid, me, mode, val, evt) {
  // ================================================================================
    window.prevFiltExpr=val;
    var charCode='';
    if (mode=='reset') {
      charCode=27;
    } else {
      evt = (evt) ? evt : event;
      charCode=(evt.charCode) ? evt.charCode : ((evt.which) ? evt.which : evt.keyCode);
    }
    var trColl=document.getElementsByTagName("tr");
    // - - - - - - - - - - - - - - - - - - - -
    if (charCode==27) { 
    // - - - - - - - - - - - - - - - - - - - -
      var valOrg=me.value;
      // ftsMsg('--ftsStatsHide--');
      ftsMsg("Updating display ...");
      val=''; 
      me.value='';
      top.ftsSrchExpr='';
      top.ftsMatchColl.length=0;
      if (trColl) {
        for (var i=1; trColl.length>i; i++) {
          if (trColl[i].className.match(/ ftsMatch[1-9]/)) {
            trColl[i].childNodes[chldnum4fv].innerHTML='&nbsp;';
          }
          trColl[i].className=trColl[i].className.replace(/ ftsMatch\d/gi, '');
        }
      }
      top.ftsStats='';
      ftsMsg("");
      if (valOrg=='' && window.location.href.match(/fts\.html/i)) {
        window.location=top.tocredir + "toc4js.htm";
      }
      me.focus();
      
    // - - - - - - - - - - - - - - - - - - - -
    } else if (charCode==33) { 
    // - - - - - - - - - - - - - - - - - - - -
      if (top.ftsStats && top.ftsStats!='') {
        ftsNav(document.getElementById('nav4ftsMatchTup'));
      } else if (document.location.href.match(/fts.html/i)) {
        ftsNav(null, 'hitlistUp');
      } else if ((top.document.backwardlink && top.document.backwardlink!='')) {
        top.frame2.location=top.docdir + top.document.backwardlink;
      }
      return false;
    // - - - - - - - - - - - - - - - - - - - -
    } else if (charCode==34) {
    // - - - - - - - - - - - - - - - - - - - -
      if (top.ftsStats && top.ftsStats!='') {
        ftsNav(document.getElementById('nav4ftsMatchTdn'));
      } else if (document.location.href.match(/fts.html/i)) {
        ftsNav(null, 'hitlistDn');
      } else if ((top.document.forwardlink && top.document.forwardlink!='')) {
        top.frame2.location=top.docdir + top.document.forwardlink;
      }
      ftsNav(document.getElementById('nav4ftsMatchTdn'));
      return false;
    // - - - - - - - - - - - - - - - - - - - -
    } else if (val != me.lastValue) {
    // - - - - - - - - - - - - - - - - - - - -
      me.lastValue = val;
      var charCodeStr=charCode.toString(10);
      if (   (top.ftsAdhoc==1) 
          && (top.ftsScope<3)
          && (charCode<32 || charCode>46) // cursor movements do not count && (val.length>2)
          && (!charCodeStr.match(/^(9|10|13)$/))
      ) {
        if (val.length>2) {
        // Delay before search in the case of typing
          if(timeout) { clearTimeout(timeout); }
          // Start new time out, do the search!
          timeout = setTimeout(function() {
            FvProc('', 'ftsCall:TocAdHoc'); return false;
          }, top.ftsDelay4adhoc);
        } else if (val=='') {
          procInput('', document.getElementById('searchField'), 'reset'); 
        }
      }
    // - - - - - - - - - - - - - - - - - - - -
    }
  }
  
  // ================================================================================
  function ftsNav(caller, mode) {
  // ================================================================================
    if (mode && mode.match(/hitlist(Up|Dn)/i)) {
      var aList=top.frame1.document.getElementsByTagName('a');
      var cur=0;
      var tgt;
      for (var i=0; i<aList.length; i++) {
        if (top.ftsPrevSeenHit!='' && aList[i].id && aList[i].id==top.ftsPrevSeenHit) { cur=i; break;  }
        else if (cur==0 && aList[i].id && aList[i].href.match(aList[i].id))           { cur=i; }
      }
      if      (top.ftsPrevSeenHit=='' && mode.match(/hitlistDn/i))          { c=1; tgt=aList[cur]; top.ftsPrevSeenHit=tgt.id; }
      else if (mode.match(/hitlistUp/i) && aList[cur-1] && aList[cur-1].id) { c=2; tgt=aList[cur-1]; }
      else if (mode.match(/hitlistDn/i) && aList[cur+1] && aList[cur+1].id) { c=3; tgt=aList[cur+1]; }
      if (tgt && tgt.id && tgt.href && tgt.href.match(tgt.id)) {
        top.frame2.location=top.docdir + tgt.href;
      }
      top.frame1.document.getElementById('searchField').focus();
      return false;
    }

    var trColl=document.getElementsByTagName("tr");
    var matchColl=top.ftsMatchColl;
    var trCur=-1;
    if (caller && caller.id) {
      var ptnMatch=caller.id.match(/nav4ftsMatch(\d|T)(up|dn)/);
      if (ptnMatch) {
        if (ptnMatch[1]=="T") { ptnMatch[1]="[1-3]" }
        var cls2match=new RegExp("ftsMatch" + ptnMatch[1]);
        if (matchColl.length<1) {
          for (var i=0; i<trColl.length; i++) {
            if (trColl[i].className.match(/(^|\s)active(\s|$)/i)) {
              trCur=i;
            }
            if (trColl[i].className.match(/ftsMatch[1-3]/)) {
              matchColl[i]=trColl[i].className;
            }
          }
          top.ftsMatchColl=matchColl;
        } else {
          for (var i=0; i<trColl.length; i++) {
            if (trColl[i].className.match(/(^|\s)active(\s|$)/i)) {
              trCur=i;
              break;
            }
          }
        }
        if (ptnMatch[2]=="up") {
          for (var i=trCur-1; i>0; i--) {
            if (matchColl[i] && matchColl[i].match(cls2match)) {
              var href=trColl[i].innerHTML.match(/\shref="?([^"\s]*\.html?)/i);
              if (href) {
                top.frame2.location=top.docdir + href[1];
                return true;
              }
            }
          }
        } else if (ptnMatch[2]=="dn") {
          for (var i=trCur+1; i<trColl.length; i++) {
            if (matchColl[i] && matchColl[i].match(cls2match)) {
              var href=trColl[i].innerHTML.match(/\shref="?([^"\s]*\.htm)/i);
              if (href) {
                top.frame2.location=top.docdir + href[1];
                return true;
              }
            }
          }
        }
        var clsOrig=caller.className;
        caller.className="alert";
        document.getElementById("msgLvl2").innerHTML="<div class=\"alert\">No more matches in this direction and this match group</div>";
        timeout = setTimeout(function() {
          caller.className=clsOrig;
          document.getElementById("msgLvl2").innerHTML='';
          return false;
        }, 800);
      }
    }
  }
  
  // ================================================================================
  function ftsMsg(strg) {
  // ================================================================================
    var ftsMsgElm=document.getElementById('ftsmsg');
    if ((strg=='---') && (top.ftsStats!='')) {
      window.status=top.ftsStats;
    } else if (((strg=='--ftsStats--') || (strg=='')) && (top.ftsStats!='')) {
//      var stAll='';
//      var st=top.ftsStats.split(/, | \(|; /, 5);
//      if (st[0].match(/^0x/)) { stAll+="<span onClick=\"ftsNav(this)\" id=\"nav4ftsNoMatchUp\">&nbsp;</span>" + "<span onClick=\"ftsNav(this)\" id=\"nav4ftsNoMatchUp\">&nbsp;</span>" }
//                         else { stAll+="<span onClick=\"ftsNav(this)\" id=\"nav4ftsMatch3dn\" >&nbsp;</span>" + "<span onClick=\"ftsNav(this)\" id=\"nav4ftsMatch3up\" >&nbsp;</span>" }
//      stAll+= "<span class=\"ftsMatch3\">"   + st[0].replace(/.*?: /, '') + "</span>";
//      stAll+= "<span id=\"msgLvl2\">&nbsp;</span>" +"<br>";
//
//      if (st[1].match(/^0x/)) { stAll+="<span onClick=\"ftsNav(this)\" id=\"nav4ftsNoMatchUp\">&nbsp;</span>" + "<span onClick=\"ftsNav(this)\" id=\"nav4ftsNoMatchUp\">&nbsp;</span>" }
//                         else { stAll+="<span onClick=\"ftsNav(this)\" id=\"nav4ftsMatch2dn\" >&nbsp;</span>" + "<span onClick=\"ftsNav(this)\" id=\"nav4ftsMatch2up\" >&nbsp;</span>" }
//      stAll+= "<span class=\"ftsMatch3\">"   + st[1].replace(/.*?: /, '') + "</span>" +"<br>";
//
//      if (st[2].match(/^0x/)) { stAll+="<span onClick=\"ftsNav(this)\" id=\"nav4ftsNoMatchUp\">&nbsp;</span>" + "<span onClick=\"ftsNav(this)\" id=\"nav4ftsNoMatchUp\">&nbsp;</span>" }
//                         else { stAll+="<span onClick=\"ftsNav(this)\" id=\"nav4ftsMatch1dn\" >&nbsp;</span>" + "<span onClick=\"ftsNav(this)\" id=\"nav4ftsMatch1up\" >&nbsp;</span>" }
//      stAll+= "<span class=\"ftsMatch3\">"   + st[2].replace(/.*?: /, '') + "</span>" +"<br>";
//                         
//      if (st[2].match(/^0x/)) { stAll+="<span onClick=\"ftsNav(this)\" id=\"nav4ftsNoMatchUp\">&nbsp;</span>" + "<span onClick=\"ftsNav(this)\" id=\"nav4ftsNoMatchUp\">&nbsp;</span>" }
//                         else { stAll+="<span onClick=\"ftsNav(this)\" id=\"nav4ftsMatch1dn\" >&nbsp;</span>" + "<span onClick=\"ftsNav(this)\" id=\"nav4ftsMatch1up\" >&nbsp;</span>" }
//      stAll+="<span class=\"ftsMatchTtl\">" + st[3] + "</span>";
      var stAll=top.ftsStats;
      stAll=stAll.replace(/<\/tr>/, "<td rowspan=\"4\" valign=\"top\" id=\"msgLvl2\"></td></tr>");
      document.getElementById('ftsmsg').className='ftsStats';
      document.getElementById('ftsmsg').innerHTML=stAll;
    } else if (((strg=='--ftsStats--') && (top.ftsStats=='')) || (strg=='--ftsStatsHide--')) { 
      document.getElementById('ftsmsg').innerHTML='';
      document.getElementById('ftsmsg').className='hideMe';
    } else if (strg!='') {
      ftsMsgElm.className="";
      ftsMsgElm.innerHTML=strg;
    } else {
      ftsMsgElm.className="hideMe";
      ftsMsgElm.innerHTML=strg;
//    } else {
//      window.status=strg;
    }
  }
  
  // ================================================================================
  function ToggleTE(caller, mode) {
  // ================================================================================
    if (tst1) { 
      var tst2=new Date().getTime();
      var clickDur=tst2 - tst1;
      // alert(clickDur + " -- " + keyPressed);
    }
    var trColl=document.getElementsByTagName("tr");
    var RE4cal=new RegExp();
    var RE4sub=new RegExp();
    var RE4ssb=new RegExp();
    var RE4oth=new RegExp();
    var clpsTgt4cal='';
    var clpsTgt4sub='';
    var clpsTgt4ssb='';
    var clpsTgt4oth='';
    ftsMsg("Updating display ... ");
    // ===================================================
    if (mode && mode.match(/^reset$/i)) {
    // - - - - - - - - - - - - - - - - - - - - - - - - - -
      top.ftsStats='';
      procInput('', document.getElementById('searchField'), 'reset'); 
      ftsMsg("");
      ToggleTE(this, "showLvl3");
      return false;
    // ===================================================
    } else if (caller && mode && mode.match(/^srchRslt$/i) && (top.ftsSrchExpr!='')) {
    // - - - - - - - - - - - - - - - - - - - - - - - - - -
      if (!top.ftsRsltPtn.match(/\w+/)) {
        var msg='';
        if      (top.ftsScope==1) { msg=top.lbl4fts["fts_MsgNoMatchCurNd"]; }
        else if (top.ftsScope==2) { msg=top.lbl4fts["fts_MsgNoMatchCurPg"]; } 
        else if (top.ftsScope==3) { msg=top.lbl4fts["fts_MsgNoMatchAllMd"]; }
        else                      { msg=top.lbl4fts["fts_MsgNoMatch"]; }
        ftsMsg("");
        msg=msg.replace(/<.*?>/gi, '');
        alert(msg);
        return false;
      };
      ftsMsg("Updating display ...");
      var matchCnt1=0;
      var matchCnt2=0;
      var matchCnt3=0;
      var noMatchCnt=0;
      var ftsMatchFiles=new Array;
      var ftsMatchCls2=parseInt(top.ftsMatchMaxCnt/3*2);
      var ftsMatchCls1=parseInt(top.ftsMatchMaxCnt/3);
      ftsMatchFiles=top.ftsRslt;
      var RE4match  = new RegExp("^ttr-(" + top.ftsRsltPtn + ")$");
      var RE4expand = new RegExp("^ttr-(" + top.ftsExpandPtn + ")$");
      var RE4sibl   = new RegExp("^ttr-(" + top.ftsMatchSiblingPtn + ")$");
      // alert(RE4sibl);
      // - - - - - - - - - - - - - - - - - - - -
      for (var i=0; i<trColl.length; i++) {
      // - - - - - - - - - - - - - - - - - - - -
        trColl[i].className=trColl[i].className.replace(/\sftsMatch\d/, '');
        var reMatch=trColl[i].id.match(RE4match);
        if (trColl[i].id) {
          // - - - - - - - - - - - - - - - - - - - -
          if (reMatch) {
          // - - - - - - - - - - - - - - - - - - - -
            if (trColl[i].id.match(RE4expand)) {
              trColl[i].className=trColl[i].className.replace(/(clps|clch)(-\w+|\shideMe)*( vizGap)*/, "$1-0");
            } else {
              trColl[i].className=trColl[i].className.replace(/(clps|clch)(-\w+|\shideMe)*( vizGap)*/, "$1-1");
            }
            if (reMatch[1] && ftsMatchFiles && top.ftsRslt[reMatch[1]]) {
              trColl[i].childNodes[chldnum4fv].innerHTML=top.ftsRslt[reMatch[1]];
              if (top.ftsRslt[reMatch[1]] > ftsMatchCls2) {
                trColl[i].className+=" ftsMatch3";
                matchCnt3++;
              } else if (top.ftsRslt[reMatch[1]] > ftsMatchCls1) {
                trColl[i].className+=" ftsMatch2";
                matchCnt2++;
              } else {
                trColl[i].className+=" ftsMatch1";
                matchCnt1++;
              }
            } else {
              trColl[i].className+=" ftsMatch1";
              matchCnt1++;
            }
          // - - - - - - - - - - - - - - - - - - - -
          } else if (trColl[i].id.match(RE4expand)) {
          // - - - - - - - - - - - - - - - - - - - -
            trColl[i].className=trColl[i].className.replace(/(clps|clch)(-\w+|\shideMe)*( vizGap)*/, "$1-0 ftsMatch0");
            noMatchCnt++;
          // - - - - - - - - - - - - - - - - - - - -
          } else if (trColl[i].id.match(RE4sibl)) {
          // - - - - - - - - - - - - - - - - - - - -
            trColl[i].className=trColl[i].className.replace(/(clps|clch)(-\w+|\shideMe)*( vizGap)*/, "$1-1 ftsMatch0");
            noMatchCnt++;
          // - - - - - - - - - - - - - - - - - - - -
          } else if (trColl[i].id.match(/ttr-\d+$/i)) {
          // - - - - - - - - - - - - - - - - - - - -
            trColl[i].className=trColl[i].className.replace(/clps(-\w+|\shideMe)*( vizGap)*/, "clps-1 ftsMatch0");
            trColl[i].className=trColl[i].className.replace(/clch(-\w+|\shideMe)*( vizGap)*/, "clch-1 ftsMatch0");
            noMatchCnt++;
          // - - - - - - - - - - - - - - - - - - - -
          } else if (trColl[i].id.match(/ttr-/i)) {
          // - - - - - - - - - - - - - - - - - - - -
            trColl[i].className=trColl[i].className.replace(/clps(-\w+|\shideMe)*( vizGap)*/, "clps-1 hideMe ftsMatch0");
            trColl[i].className=trColl[i].className.replace(/clch(-\w+|\shideMe)*( vizGap)*/, "clch-1 hideMe ftsMatch0");
            noMatchCnt++;
          }
        }
      }
//      top.ftsStats="Stats: " + matchCnt3 + "x >"+ ftsMatchCls2 + " matches, " 
//                             + matchCnt2 + "x "+ (ftsMatchCls1+1) + "..." + ftsMatchCls2 + " matches, " 
//                             + matchCnt1 + "x &lt;"+ (ftsMatchCls1+1) + " matches"
//                             + " (total: " + (matchCnt3+matchCnt2+matchCnt1) + "/" + trColl.length + "; see also green numbers on the left)";
      var stAll='';
      var matchCntT=(matchCnt3+matchCnt2+matchCnt1);
      if (matchCnt3==0) { stAll+="<tr class=\"ftsStatMatch3\">"
                                   + "<td><span id=\"nav4ftsNoMatchUp\" onClick=\"ftsNav(this)\">&nbsp;</span>" 
                                       + "<span id=\"nav4ftsNoMatchUp\" onClick=\"ftsNav(this)\">&nbsp;</span></td>" }
                   else { stAll+="<tr class=\"ftsStatMatch3\">"
                                   + "<td><span id=\"nav4ftsMatch3dn\"  onClick=\"ftsNav(this)\" title=\"Next match of this group\">&nbsp;</span>" 
                                       + "<span id=\"nav4ftsMatch3up\"  onClick=\"ftsNav(this)\" title=\"Previous match of this group\">&nbsp;</span></td>" }
      stAll+= "<td class=\"val\">"   + matchCnt3 + "</td><td>x&nbsp;</td><td><b>&gt;" + ftsMatchCls2 + "</b> matches</td></tr>\n";

      if (matchCnt2==0) { stAll+="<tr class=\"ftsStatMatch2\">"
                                   + "<td><span id=\"nav4ftsNoMatchUp\" onClick=\"ftsNav(this)\">&nbsp;</span>" 
                                       + "<span id=\"nav4ftsNoMatchUp\" onClick=\"ftsNav(this)\">&nbsp;</span></td>" }
                   else { stAll+="<tr class=\"ftsStatMatch2\">"
                                   + "<td><span id=\"nav4ftsMatch2dn\"  onClick=\"ftsNav(this)\" title=\"Next match of this group\">&nbsp;</span>" 
                                       + "<span id=\"nav4ftsMatch2up\"  onClick=\"ftsNav(this)\" title=\"Previous match of this group\">&nbsp;</span></td>" }
      stAll+= "<td class=\"val\">"   + matchCnt2 + "</td><td>x</td><td><b>" + (ftsMatchCls1+1) + "..." + ftsMatchCls2 + "</b> matches</td></tr>\n";

      if (matchCnt1==0) { stAll+="<tr class=\"ftsStatMatch1\">"
                                   + "<td><span id=\"nav4ftsNoMatchUp\" onClick=\"ftsNav(this)\">&nbsp;</span>"
                                       + "<span id=\"nav4ftsNoMatchUp\" onClick=\"ftsNav(this)\">&nbsp;</span></td>" }
                   else { stAll+="<tr class=\"ftsStatMatch1\">"
                                   + "<td><span id=\"nav4ftsMatch1dn\"  onClick=\"ftsNav(this)\" title=\"Next match of this group\">&nbsp;</span>"
                                       + "<span id=\"nav4ftsMatch1up\"  onClick=\"ftsNav(this)\" title=\"Previous match of this group\">&nbsp;</span></td>" }
      stAll+= "<td class=\"val\">"   + matchCnt1 + "</td><td>x</td><td><b>&lt;" + (ftsMatchCls1+1) + "</b> matches</td></tr>\n";
                         
      if (matchCntT==0) { stAll+="<tr class=\"ftsStatMatchT\">"
                                   + "<td><span id=\"nav4ftsNoMatchUp\" onClick=\"ftsNav(this)\">&nbsp;</span>"
                                       + "<span id=\"nav4ftsNoMatchUp\" onClick=\"ftsNav(this)\">&nbsp;</span></td>" }
                   else { stAll+="<tr class=\"ftsStatMatchT\">"
                                   + "<td><span id=\"nav4ftsMatchTdn\"  onClick=\"ftsNav(this)\" title=\"Next match of this group\">&nbsp;</span>"
                                       + "<span id=\"nav4ftsMatchTup\"  onClick=\"ftsNav(this)\" title=\"Previous match of this group\">&nbsp;</span></td>" }
      stAll+="<td class=\"val\">" + matchCntT + "</td><td colspan=\"2\">total matches</td></tr>\n";

      top.ftsStats=  "<table id=\"ftsStats\">" + stAll + "</table>"
                     + "<div id=\"x4ftsStats\" onclick=\"procInput('', document.getElementById('searchField'), 'reset'); return false;\" title=\"Click to reset search\">X</div>\n";
      ftsMsg('--ftsStats--');
      // alert(trColl.length + " : " + matchCnt + " / " + noMatchCnt + " ## " + ftsMatchCls1 + "/" + ftsMatchCls2);
      return false;
    // ===================================================
    } else if (caller && mode && mode.match(/jumpto:/i)) {
    // - - - - - - - - - - - - - - - - - - - - - - - - - -
    // Entry itself and siblings: unhide, do not expand (all elements with ID reduced by last number, but with trailing dash)
    // parent and higher: unhide, do expand
    // siblings
      ftsMsg("Updating display ...");
      var mArr=mode.match(/jumpto:(.*)/i);
      var id4startTE=mArr[1];
//alert(id4startTE);
      if (!id4startTE.match(/^ttr(-\d+)+$/)) {
        var curIdPtn=new RegExp(";([\\d\\-]+):" + id4startTE + ";", 'i');
        nesTocIn=nesToc.match(curIdPtn);
        if (nesTocIn) { id4startTE="ttr-" + nesTocIn[1] }
      }
      
      var iterId=id4startTE;
      var ptnColl='';
      var te2start=document.getElementById(id4startTE);

      if (!(te2start && te2start.className))   { 
        ftsMsg("");
        return false; 
      }
      if (!te2start.className.match(/hideMe/)) { 
        if (mode && mode.match(/jumpto:/i)) { ProcVis(te2start); }
        ftsMsg("");
        return false;
      }
      while (iterId.match(/ttr-\d+-\d+/i)) {
        iterId=iterId.replace(/-\d+$/, '');
        ptnColl+="^" + iterId + "$|";
      }
      ptnColl=ptnColl.replace(/\|$/, '');
      RE4cal=RegExp(id4startTE.replace(/\d+$/, "\\d+$"));
      RE4sub=RegExp('ttr-');
      RE4ssb=RegExp('ttr-');
      RE4oth=RegExp(ptnColl); // higher levels: 
      clpsTgt4cal='-1'; 
      clpsTgt4sub='';
      clpsTgt4ssb='';
      clpsTgt4oth='-0';
      ftsMsg("");
    // ===================================================
    } else if (caller && mode && mode.match(/showLvl/i)) {
    // - - - - - - - - - - - - - - - - - - - - - - - - - -
      ftsMsg("Updating display ...");
      if (top.curPgId && top.curPgId!='' && top.topid!=top.docid) {
        top.location=document.location.href.replace(/toc4js.htm\?(\w+).*/i, 'jsframe.htm?' + top.curPgId + "&fts4allmod&" + mode);
        return false;
      }
      var tgtLvl=mode.match(/showLvl(.*)/i);
      if (tgtLvl) {
        if ((tgtLvl[1]>5) || (tgtLvl[1]=='All')) { 
          RE4cal=RegExp("ttr-\\d+");
          clpsTgt4cal='-0'; 
          clpsTgt4sub='';
          clpsTgt4ssb='';
        } else {
          var idPtn="ttr";
          for (var l=0; l<tgtLvl[1]; l++) {
            idPtn+="-\\d+";
          }
          RE4cal=RegExp(idPtn + "$");
          RE4sub=RegExp(idPtn + "-\\d+$");
          RE4ssb=RegExp(idPtn + "-");
          RE4oth=RegExp('ttr-'); // higher levels: 
          clpsTgt4cal='-1'; // -symbol-hidden
          clpsTgt4sub='-1 hideMe';
          clpsTgt4ssb='-1 hideMe';
          clpsTgt4oth='-0';
        }
      }
      ftsMsg("");
      FvProc('', 'tocdlg0');
    // ===================================================
    } else if (caller && mode && mode.match(/tglSub/i)) {
    // - - - - - - - - - - - - - - - - - - - - - - - - - -
      ftsMsg("Updating display ...");
      var callerTr=caller.parentNode.parentNode.parentNode;
      var callerCls=document.getElementById(callerTr.id).id;
      var tmpArr=callerTr.innerHTML.match(/id="?toc(\d)/i);
      if (tmpArr) {
        var callerLvl=tmpArr[1]-1;
        if (clickDur && clickDur>750) {
          // At a long click, also process all siblings
          callerCls=callerCls.replace(/\d+$/, "\\d+");
        }
        var tglCnt=0;
        RE4cal=RegExp(callerCls + "$");
        RE4sub=RegExp(callerCls + "-\\d+$");
        RE4ssb=RegExp(callerCls + "-");
        clpsTgt4cal='-1'; //
        clpsTgt4sub='-1 hideMe';
        clpsTgt4ssb='-1 hideMe';
        if (callerTr.className.match(clpsTgt4cal)) { 
          clpsTgt4cal='-0';
          clpsTgt4sub='-1';
          clpsTgt4ssb=''; // don't touch sub-sub when unhiding 
        } 
        if (keyPressed && keyPressed==18 && clpsTgt4cal=='-0') {
          // Expanding with ALT pushed: expand all sub nodes as well
          RE4sub=RegExp(callerCls + "-\\d+");
          clpsTgt4cal='-0';
          clpsTgt4sub='-0';
          clpsTgt4ssb='-0'; 
        }
      }
      ftsMsg("");
    // ===================================================
    } else if (caller && mode && mode.match(/^(fvOnly)$/i)) {
    // - - - - - - - - - - - - - - - - - - - - - - - - - - 
      ftsMsg("Updating display ...");
      var cls4gap='';
      for (var i=0; i<trColl.length; i++) {
        if (trColl[i].id.match(/^ttr(-\d+)+$/i)) {
          if (trColl[i].childNodes[chldnum4fv].className.match(/ isfv/)) {
            trColl[i].className=trColl[i].className.replace(/(clps|clch)(-\w+|\shideMe)*( vizGap)?/, "$1-1" + cls4gap);
            cls4gap="";
            tglCnt++;
          } else {
            trColl[i].className=trColl[i].className.replace(/(clps|clch)(-\w+|\shideMe)*( vizGap)*/, "$1-1 hideMe");
            cls4gap=" vizGap";
            tglCnt++;
          }
        }
      }
      ftsMsg("");
      return false;
    // ===================================================
    } else if (caller && mode && mode.match(/^(trcOnly)$/i)) {
    // - - - - - - - - - - - - - - - - - - - - - - - - - - 
      ftsMsg("Updating display ...");
      var cls4gap='';
      for (var i=0; i<trColl.length; i++) {
        if (trColl[i].id.match(/^ttr(-\d+)+$/i)) {
          if (trColl[i].className.match(/ vis\d+/)) {
            trColl[i].className=trColl[i].className.replace(/(clps|clch)(-\w+|\shideMe)*( vizGap)*/, "$1-1" + cls4gap);
            cls4gap="";
            tglCnt++;
          } else {
            trColl[i].className=trColl[i].className.replace(/(clps|clch)(-\w+|\shideMe)*( vizGap)*/, "$1-1 hideMe");
            cls4gap=" vizGap";
            tglCnt++;
          }
        }
      }
      ftsMsg("");
      return false;
    }
    // - - - - - - - - - - - - - - - - - - - -
    ftsMsg("Updating display ...");
    if ((clpsTgt4cal!='') || (clpsTgt4sub!='') || (clpsTgt4ssb!='') || (clpsTgt4oth!='')) {
      for (var i=0; i<trColl.length; i++) {
        if (trColl[i].id.match(RE4cal)) {
          trColl[i].className=trColl[i].className.replace(/(clps|clch)(-\w+|\shideMe)*( vizGap)*/, "$1" + clpsTgt4cal);
          tglCnt++;
        } else if ((clpsTgt4sub !='') && (trColl[i].id.match(RE4sub)))  {
          trColl[i].className=trColl[i].className.replace(/(clps|clch)(-\w+|\shideMe)*( vizGap)*/, "$1" + clpsTgt4sub);
          tglCnt++;
        } else if ((clpsTgt4ssb !='') && (trColl[i].id.match(RE4ssb)))  {
          trColl[i].className=trColl[i].className.replace(/(clps|clch)(-\w+|\shideMe)*( vizGap)*/, "$1" + clpsTgt4ssb);
          tglCnt++;
        } else if ((clpsTgt4oth !='') && (trColl[i].id.match(RE4oth)))  {
          trColl[i].className=trColl[i].className.replace(/(clps|clch)(-\w+|\shideMe)*( vizGap)*/, "$1" + clpsTgt4oth);
          tglCnt++;
        }
      }
    }
    if (mode) {
      if (mode.match(/jumpto:/i)) { 
        ProcVis(te2start); 
      } else if (mode.match(/showLvl/i) && top.frame2) {
        // alert(top.frame2.location.href.replace(/\.html?$/i, ''));
        ToggleTE(this, "jumpto:" + top.frame2.location.href.replace(/.*[\\\/]|\.html?$/gi, ''));
      }
    }
    ftsMsg("");
    return false;
  }

  // ================================================================================
  function FvProc(caller, mode) {
  // ================================================================================
      function tglDlg(mode) {
        var modeBase=mode.replace(/\d+$/, '');
        if (mode.match(/^\w+1$/i)) {
          trgElm.className+=' omo';
          dlgElm.className=dlgElm.className.replace(/ hideMe/, " showMe");
          if (timers[modeBase]) { clearTimeout(timers[modeBase]) }
        // ---------------------------------------------
        } else if (mode.match(/^\w+0$/i)) {
          timers[modeBase] = setTimeout(function () { 
            trgElm.className=trgElm.className.replace(/ omo/gi, '')
            dlgElm.className=dlgElm.className.replace(/ showMe/i, " hideMe");
          }, 150);
        }
      }
    // ---------------------------------------------
    if (tst1) { 
      var tst2=new Date().getTime();
      var clickDur=tst2 - tst1;
      // alert(clickDur + " -- " + keyPressed);
    }
    var cnt=0;
    if (caller.firstChild && caller.firstChild.className && caller.firstChild.className.match(/^unAvl1?$/)) { return false; }
    // ===============================================
    if (mode && mode.match(/init/)) {
    // ---------------------------------------------
      ftsMsg("Updating display ...");
      var trColl=document.getElementsByTagName("tr");
      top.fvList=top.GetCookieVal('fvList4syncpcwb-h-ugd');
      for (var i=0; i<trColl.length; i++) {
        var fc=trColl[i].childNodes[chldnum4fv];
        if (fc && fc.className && fc.className.match(/^fv(\s|$)/i)) {
          fc.onmouseover=function(){ this.className+=' omo';};
          fc.onmouseout =function(){ this.className=this.className.replace(/ omo/, '');};
          fc.onmouseup  =function(){ FvProc(this, 'tgl')};
          fc.onmousedown=function(){ tst1=new Date().getTime()};
          fc.title="Click to add or remove bookmarks.";
          var href=trColl[i].innerHTML.match(/<a[^>]*\sid=([^\.\s]*)\.htm/i);
          if (href) {
            var RE=new RegExp("#" + href[1].replace(/"/g, '') + "#");
            if (top.fvList.match(RE)) { fc.className+=" isfv"; } // fc.innerHTML="&#x2605;";
          }
        }
        var srchFldElm=document.getElementById('searchField');
        if (srchFldElm) { 
          if (top.ftsSrchExpr!='') { srchFldElm.value=top.ftsSrchExpr; srchFldElm.className='' }
//                              else { srchFldElm.value='Search'; srchFldElm.className='Dflt' }
        }
        var tt=trColl[i].getElementsByTagName('tt');
        if (tt && tt[0]) {
          if (trColl[i].className.match(/clps-/i)) {
            tt[0].onmousedown=function(){tst1=new Date().getTime()};
            tt[0].onmouseup=function(){ToggleTE(this, 'tglSub')};
          }
          tt[0].className='clps';
        }
      }

      var dlgElm=document.getElementById('ftsdlg');
      var ftsCtrls=dlgElm.getElementsByTagName('div');
      var sm3elem=document.getElementById('ftsdlgSrchMode3');
      for (var n=0; n<ftsCtrls.length; n++) {
        if (ftsCtrls[n] && ftsCtrls[n].id) { ftsCtrls[n].firstChild.className='noOpt' }
      }
      if (top.curTocEntryId && top.curTocEntryId!='') { ProcVis('', 'init'); }
      if (top.ctxtFlags) { } //place4picmt
      document.getElementById('ftsdlgSrchMode' + top.ftsSrchMode).firstChild.className="isOpt";
      document.getElementById('ftsdlgSortMode' + top.ftsSortMode).firstChild.className="isOpt";
      document.getElementById('ftsdlgScope' + top.ftsScope).firstChild.className="isOpt";
      if (top.ftsScope==3)   { 
        document.getElementById('ftsdlgAdhocOpt').firstChild.className="unAvl"; 
        document.getElementById('ftsdlgSortMode2').firstChild.className="unAvl";
        // if (top.ftsAdhoc==1)    { top.ftsAdhoc=0 }
        if (top.ftsSortMode==2) { top.ftsSortMode=1; 
          document.getElementById('ftsdlgSortMode2').firstChild.className="isOpt"; 
        }
      }
      else if (top.ftsAdhoc==1) { document.getElementById('ftsdlgAdhocOpt').firstChild.className="isOpt" }
                     else  { document.getElementById('ftsdlgAdhocOpt').firstChild.className="noOpt" }
      if (top.ftsStore==1) { document.getElementById('ftsdlgStoreOpt').firstChild.className="isOpt" }
                     else  { document.getElementById('ftsdlgStoreOpt').firstChild.className="noOpt" }
      var msgBox=document.getElementById('ftsmsg');
      if (msgBox && msgBox.innerHTML.match(/loading/i)) {
        msgBox.className=" hideMe";
      }
    // ===============================================
    } else if (mode && mode.match(/tgl/)) {
    // ---------------------------------------------
      var trColl=document.getElementsByTagName("tr");
      if (caller) {
        var href=caller.parentNode.innerHTML.match(/<a[^>]*id=([^\.\s]*)\.htm/i);
        if (href) {
          var RE=new RegExp("#" + href[1].replace(/"/g, '') + "#");
          if (top.fvList.match(RE)) { 
            top.fvList=top.fvList.replace(RE, ''); 
            caller.className=caller.className.replace(/ isfv/gi, ''); 
            // caller.innerHTML="&nbsp;"; 
          } else { 
            top.fvList+="#" +href[1].replace(/"/g, '') + "#"; 
            caller.className+=' isfv'; 
            // caller.innerHTML="&#x2605;"; 
          }
          top.SetCookieVal('fvList4syncpcwb-h-ugd', top.fvList);
        }
      }
    // ===============================================
    } else if (mode && mode.match(/tocdlg\w/)) {
    // ---------------------------------------------
      var dlgElm=document.getElementById('tocdlg');
      var trgElm=document.getElementById('tocdlgTrg');
      // ---------------------------------------------
      if (mode.match(/^tocdlg(0|1)$/i)) {
        tglDlg(mode);
      // ---------------------------------------------
      } else if (mode.match(/tocdlgBmReset/i)) {
        if (confirm('Are you sure you want to reset your bookmarks for this document?')) {
          ftsMsg("Updating display ...");
          var trColl=document.getElementsByTagName("tr");
          var RE=new RegExp(' isfv', 'i');
          for (var i=0; i<trColl.length; i++) {
            var fc=trColl[i].childNodes[chldnum4fv];
            if (fc.className && fc.className.match(/^fv(\s|$)/i)) {
              fc.className=fc.className.replace(/ isfv/, ''); 
            }          
          }
          FvProc('', 'tocdlg0');
          top.fvList='';
          top.SetCookieVal('fvList4syncpcwb-h-ugd', top.fvList);
          // window.status="Bookmarks have been reset.";
          ftsMsg("");
        }
        return false;
      // ---------------------------------------------
      } else if (mode.match(/tocdlgTrcReset/i)) {
        ftsMsg("Updating display ...");
        var trColl=document.getElementsByTagName("tr");
        var RE=RegExp(' vis\\d+', 'i');
        for (var i=0; i<trColl.length; i++) {
          var fc=trColl[i];
          if (fc.className) {
            fc.className=fc.className.replace(RE, ''); 
          }          
        }
        FvProc('', 'tocdlg0');
        // window.status="Bookmarks have been reset.";
        ftsMsg("");
        return false;
      // ---------------------------------------------
      } else if (mode.match(/tocdlgTglSnum|tocdlgSetSnum/i)) {
        if (mode.match(/tocdlgTglSnum/i)) {
          if (top.tocSectnum==1) { top.tocSectnum=0; }
                            else { top.tocSectnum=1; }
          top.SetCookieVal("OTftsOpts");
        }
        var cssAll = document.styleSheets;
        var newVal='';
        if (top.tocSectnum==0) { newVal='none' }
        allCssLoop: for (var s=0; s<cssAll.length; s++) {     
          var css4j=cssAll[s];
          var csr=css4j.cssRules?css4j.cssRules:css4j.rules;
          var csr2proc;
          for (var c=0; c<csr.length; c++) {     
            if (csr[c].selectorText.match(/^td\.snum$/i)) {
              csr[c].style.display=newVal;
              break allCssLoop;
            }
          }
        }
      }
    // ===============================================
    } else if (mode && mode.match(/ftsCall/)) {
    // ---------------------------------------------
      var ftsCall=new String("");
      var ftsFld=document.getElementById('searchField');
      top.ftsSrchExpr=ftsFld.value;
      top.ftsMatchColl.length=0;
      if ((top.ftsSrchExpr!='') && (document.getElementById('searchField').className=='')) {
        ftsCall+=top.ftsSrchExpr;
        top.ftsStats='';
        if (top.ftsSrchMode!='') { ftsCall+='&searchMode=' + top.ftsSrchMode; }
        if (top.ftsSortMode!='') { ftsCall+='&sortMode=' + top.ftsSortMode;   }
        if (top.ftsScope!='')    { ftsCall+='&scope=' + top.ftsScope;         }
        if (mode.match(/:TocAdHoc/)) { ftsCall+='&TocAdHoc=1'; }
        if (top.curPgId && top.curPgId!='' && top.topid!=top.docid) {
          var pgloc=top.frame2.location.href.replace(/[^\/\\]*$/, '').replace(/[^\\\/:a-zA-Z0-9\-\_\.]*/gi, '');
          top.location=document.location.href.replace(/[\\\/:a-zA-Z0-9\-\_\.]*(toc4js.htm|fts\.html)\?(\w+).*/i, pgloc + "jsframe.htm?" + top.curPgId + "&ftsfwd&searchField=" + ftsCall);
          return false;
        }
        ftsMsg("Searching ...");
        document.location=top.docdir + "fts.html?searchField=" + ftsCall;
        return false;
      } else if ((top.ftsSrchExpr=='') && ((top.ftsStats!='') || (document.location.href.match(/fts\.htm/i)))) {
        procInput('', ftsFld, 'reset');
      } else {
        alert('Please specify a search string first');
      }
    // ===============================================
    } else if (mode && mode.match(/ftsdlg\w+/)) {
    // ---------------------------------------------
      var dlgElm=document.getElementById('ftsdlg');
      var trgElm=document.getElementById('ftsdlgTrg');
      var inVal=mode.match(/ftsdlg(SrchMode|SortMode|Scope|Adhoc|Store)(\d|Opt)?/); // "Tgl" only for "Adhoc"
      // ---------------------------------------------
      if (mode.match(/^ftsdlg(0|1)$/i)) {
        tglDlg(mode);
      // ---------------------------------------------
      } else if (mode.match(/^ftsdlgHlphlp$/i)) {
        window.open(top.docdir + "xxjstoc.htm");
        return false;
      // ---------------------------------------------
      } else if (inVal) {
        var re1=new RegExp('^ftsdlg'+inVal[1]);
        var re2=new RegExp('^'+mode+'$');
        var ftsCtrls=dlgElm.getElementsByTagName('div');      
        // - - - - - - - - - - - - - - - - - - - - -
        if (mode.match(/^ftsdlg(Adhoc|Store)Opt$/i)) {
        // - - - - - - - - - - - - - - - - - - - - -
          var clsNew='';
          var flwup='';
          if (inVal[1]=='Adhoc') {
            if (top.ftsAdhoc && top.ftsAdhoc==1) { top.ftsAdhoc=0; clsNew='noOpt'; flwup='reset'; } 
                                            else { top.ftsAdhoc=1; clsNew='isOpt'; }  
          } else if (inVal[1]=='Store') {
            if (top.ftsStore && top.ftsStore==1) { top.ftsStore=0; clsNew='noOpt'; } 
                                            else { top.ftsStore=1; clsNew='isOpt'; }  
          } // expecting "Tgl" for now
          for (var n=0; n<ftsCtrls.length; n++) {
            if (ftsCtrls[n] && ftsCtrls[n].id && ftsCtrls[n].id.match(re2)) { ftsCtrls[n].firstChild.className=clsNew; }
          }
          if (flwup=="reset") { procInput('', document.getElementById('searchField'), 'reset'); }
          top.SetCookieVal("OTftsOpts");
        // - - - - - - - - - - - - - - - - - - - - -
        } else {
        // - - - - - - - - - - - - - - - - - - - - -
          if (inVal[1]=='SrchMode') { top.ftsSrchMode=inVal[2] }
          if (inVal[1]=='SortMode') { top.ftsSortMode=inVal[2] }
          if (inVal[1]=='Scope')    { top.ftsScope=inVal[2]    }     
          for (var n=0; n<ftsCtrls.length; n++) {
            if (ftsCtrls[n] && ftsCtrls[n].id) {
              if (ftsCtrls[n].id.match(re2)) {
                ftsCtrls[n].firstChild.className="isOpt";
              } else if (ftsCtrls[n].id.match(re1)) {
                ftsCtrls[n].firstChild.className="noOpt";
              }
            }
          }
          if (top.ftsScope==3) {
            document.getElementById('ftsdlgSortMode2').firstChild.className="unAvl";
            if (top.ftsAdhoc==1)    { 
              document.getElementById('ftsdlgAdhocOpt').firstChild.className="unAvl1";
              top.ftsAdhoc=-1;
            } else {
              document.getElementById('ftsdlgAdhocOpt').firstChild.className="unAvl";
            }
            if (top.ftsSortMode==2) { 
              top.ftsSortMode=1; 
              document.getElementById('ftsdlgSortMode1').firstChild.className="isOpt"; 
            }
          } else if (document.getElementById('ftsdlgAdhocOpt').firstChild.className=="unAvl1") {
            top.ftsAdhoc=1;
            document.getElementById('ftsdlgAdhocOpt').firstChild.className="isOpt"; 
            document.getElementById('ftsdlgSortMode2').firstChild.className="noOpt";
          } else if (document.getElementById('ftsdlgAdhocOpt').firstChild.className=="unAvl") {
            top.ftsAdhoc=0;
            document.getElementById('ftsdlgAdhocOpt').firstChild.className="noOpt"; 
            document.getElementById('ftsdlgSortMode2').firstChild.className="noOpt";
          }
          top.SetCookieVal("OTftsOpts");
          // - - - - - - - - - - - - - - - - - - - - -
          if (document.location.href.match(/fts/i)) {
            FvProc('', 'ftsCall');
          }
        }
      }
      // ---------------------------------------------
    }
    ftsMsg("");
    
  }
  
