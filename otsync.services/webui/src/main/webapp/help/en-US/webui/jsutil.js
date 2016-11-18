  // ================================================================================
  function SetCookieVal(CookieKey, CookieValue) {
  // ================================================================================
    if (CookieValue=="-DELcooKie-") {
      var now = new Date();
      top.document.cookie=CookieKey + "=; expires=" + now.toGMTString() + "; path=/";
    } else {
      if ((CookieKey=="OTftsOptsForce") || (CookieKey=="OTftsOpts" && top.ftsStore==1)) {
        CookieValue="#s#" + top.ftsSrchMode
                  + "#o#" + top.ftsSortMode
                  + "#d#" + top.ftsAdhoc 
                  + "#p#" + top.ftsScope 
                  + "#m#" + top.ftsStore
                  + "#l#" + top.ftsDelay4adhoc
                  + "#u#" + top.tocSectnum
                  + "#";
        CookieKey="OTftsOpts";
      } else if (CookieKey=="OTftsOpts") { return false; }
      var nextyear = new Date();
      nextyear.setFullYear(nextyear.getFullYear() +1);
      top.document.cookie=CookieKey + "=" + CookieValue + "; expires=" + nextyear.toGMTString() + "; path=/";
    }
    return true;
  }  

  // ================================================================================
  function GetCookieVal(CookieKey) {
  // ================================================================================
    // var s= new String(manId);
    var ExtLinkVal4Man='';
    var CookieKey2use=CookieKey.replace(/Force/i, '');
    var CookieValue=new String('');
    if (top.document.cookie) {
      AllCookies=top.document.cookie;
      var posD=AllCookies.indexOf(CookieKey2use+"=");
      if (posD > -1) {
        var startposD=posD + CookieKey2use.length +1;
        var endposD=AllCookies.indexOf(";", startposD);
        if (endposD==-1) { endposD=AllCookies.length };
        CookieValue=AllCookies.substring(startposD, endposD);
        if (CookieKey.match(/OTftsOpts/)) {
          if ((CookieKey=="OTftsOptsForce") || (CookieKey=="OTftsOpts" 
             && CookieValue.match(/^#([a-z0-9]+#)+$/i) && CookieValue.match(/#m#1#/))) {
            var optMatch=new Object(); // s(\w+)#o(\w+)#p(\w+)#d(\w+)#m(\w+)#/); 
            var optMatch1=CookieValue.split('#');
            for (var o=1; o<optMatch1.length-1; o+=2) { 
              optMatch[optMatch1[o]]=optMatch1[o+1];
            }
            if (optMatch['s'] && optMatch['s']!='') { top.ftsSrchMode = optMatch['s']; }
            if (optMatch['o'] && optMatch['o']!='') { top.ftsSortMode = optMatch['o']; }
//            if (optMatch['p'] && optMatch['p']!='') { top.ftsScope = optMatch['p']; }
            if (optMatch['d'] && optMatch['d']!='') { top.ftsAdhoc = optMatch['d']; }
            if (optMatch['m'] && optMatch['m']!='') { top.ftsStore = optMatch['m']; }
            if (optMatch['l'] && optMatch['l']!='') { top.ftsDelay4adhoc = optMatch['l']; }
            if (optMatch['u'] && optMatch['u']!='') { top.tocSectnum = optMatch['u']; }
            if ((top.ftsSrchMode>2) && (!top.ctxtFlags || !top.ctxtFlags.match(/<xhtml>/i))) { top.ftsSrchMode=1 }
            return "";
          }
        }
        return CookieValue;
      } 
      return ""; 
    } else {
      return ""; 
    }
  }

