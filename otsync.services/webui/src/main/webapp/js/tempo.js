
	/* 
		DEVELOPER'S VERSION tempo.JS

		This file should NOT be checked in!
		It is intended for use on developer's machines during the 
		development process. It will load all of the required 
		css and javascript files, allowing a developer to work
		from multiple files without having to change index.jsp
		which is only looking for one js file and one css file.
	*/
	function loadScript(sScriptSrc,callbackfunction) 
	{
		//gets document head element
		var oHead = document.getElementsByTagName('head')[0];
		if(oHead)
		{
			//creates a new script tag		
			var oScript = document.createElement('script');
					
			//adds src and type attribute to script tag
			oScript.setAttribute('src',sScriptSrc);
			oScript.setAttribute('type','text/javascript');

			//calling a function after the js is loaded (IE)
			var loadFunction = function()
				{
					if (this.readyState == 'complete' || this.readyState == 'loaded')
					{
						callbackfunction(); 
					}
				};
			oScript.onreadystatechange = loadFunction;

			//calling a function after the js is loaded (Firefox)
			oScript.onload = callbackfunction;
			
			//append the script tag to document head element		
			oHead.appendChild(oScript);
		}
	};

	loadScript(info.repo+'/js/jquery.js',load1);


function load1(){$.getScript(info.repo+'/js/jquery-ui.js', load2);}
function load2(){$.getScript(info.repo+'/js/jquery.tmpl.js', load3);}
function load3(){$.getScript(info.repo+'/js/jquery.jsperanto.js', load4);}
function load4(){$.getScript(info.repo+'/js/jquery.address.js', load5);}
function load5(){$.getScript(info.repo+'/js/json2.js', load6);}
function load6(){$.getScript(info.repo+'/js/jquery.iframe-transport.js', load7);}
function load7(){$.getScript(info.repo+'/js/jquery.fileupload.js', load8);}
function load8(){$.getScript(info.repo+'/js/jquery.colorbox.js', load9);}
function load9(){$.getScript(info.repo+'/js/iso8601.min.js', load10);}
function load10(){$.getScript(info.repo+'/locales/en-US.js', load11);}
function load11(){$.getScript(info.repo+'/js/templates.js', load12);}
function load12(){$.getScript(info.repo+'/js/checkbox.js', load13);}
function load13(){$.getScript(info.repo+'/js/utils.js', load14);}
function load14(){$.getScript(info.repo+'/js/ui.js', load15);}
function load15(){$.getScript(info.repo+'/js/user.js', load16);}
function load16(){$.getScript(info.repo+'/js/request.js', load17);}
function load17(){$.getScript(info.repo+'/js/response.js', load18);}
function load18(){$.getScript(info.repo+'/js/externalShare.js', load19);}
function load19(){$.getScript(info.repo+'/js/version.js', load20);}
function load20(){$.getScript(info.repo+'/js/dialogs.js', load21);}
function load21(){$.getScript(info.repo+'/js/events.js', load22);}
function load22(){$.getScript(info.repo+'/js/selectbox.js', load23);}
function load23(){$.getScript(info.repo+'/js/addfolder/addfolder.js', load24);}
function load24(){$.getScript(info.repo+'/js/addfolder/addfolder.request.js', load25);}
function load25(){$.getScript(info.repo+'/js/copy/copy.js', load26);}
function load26(){$.getScript(info.repo+'/js/copy/copy.request.js', load27);}
function load27(){$.getScript(info.repo+'/js/copy/copy.dialog.js', load28);}
function load28(){$.getScript(info.repo+'/js/tasks/tasks.js', load29);}
function load29(){$.getScript(info.repo+'/js/tasks/tasks.request.js', load30);}
function load30(){$.getScript(info.repo+'/js/folderDescription/folderDescription.js', load31);}
function load31(){$.getScript(info.repo+'/js/folderDescription/folderDescription.request.js', load32);}
function load32(){$.getScript(info.repo+'/js/browse/sortcontroller.js', load33);}
function load33(){$.getScript(info.repo+'/js/browse/selectioncontroller.js', load34);}
function load34(){$.getScript(info.repo+'/js/browse/browse.js', load35);}
function load35(){$.getScript(info.repo+'/js/browse/browse.request.js', load36);}
function load36(){$.getScript(info.repo+'/js/delete/delete.js', load37);}
function load37(){$.getScript(info.repo+'/js/delete/delete.request.js', load38);}
function load38(){$.getScript(info.repo+'/js/move/move.js', load39);}
function load39(){$.getScript(info.repo+'/js/move/move.request.js', load40);}
function load40(){$.getScript(info.repo+'/js/move/move.dialog.js', load41);}
function load41(){$.getScript(info.repo+'/js/profile/profile.js', load42);}
function load42(){$.getScript(info.repo+'/js/profile/profile.dialog.js', load43);}
function load43(){$.getScript(info.repo+'/js/profile/profile.request.js', load44);}
function load44(){$.getScript(info.repo+'/js/userNotificationConfig/userNotificationConfig.js', load45);}
function load45(){$.getScript(info.repo+'/js/userNotificationConfig/userNotificationConfig.dialog.js', load46);}
function load46(){$.getScript(info.repo+'/js/userNotificationConfig/userNotificationConfig.request.js', load47);}
function load47(){$.getScript(info.repo+'/js/rename/renamecontroller.js', load48);}
function load48(){$.getScript(info.repo+'/js/reserve/reserve.js', load49);}
function load49(){$.getScript(info.repo+'/js/reserve/reserve.request.js', load50);}
function load50(){$.getScript(info.repo+'/js/unreserve/unreserve.js', load51);}
function load51(){$.getScript(info.repo+'/js/unreserve/unreserve.request.js', load52);}
function load52(){$.getScript(info.repo+'/js/search/search.js', load53);}
function load53(){$.getScript(info.repo+'/js/search/search.request.js', load54);}
function load54(){$.getScript(info.repo+'/js/share/share.js', load55);}
function load55(){$.getScript(info.repo+'/js/share/share.request.js', load56);}
function load56(){$.getScript(info.repo+'/js/share/share.dialogs.js', load57);}
function load57(){$.getScript(info.repo+'/js/collaborators/collaborators.js', load58);}
function load58(){$.getScript(info.repo+'/js/collaborators/collaborators.dialogs.js', load59);}
function load59(){$.getScript(info.repo+'/js/collaborators/collaborators.request.js', load60);}
function load60(){$.getScript(info.repo+'/js/upload/uploadcontroller.js', load61);}
function load61(){$.getScript(info.repo+'/js/startup.js', load62);}
function load62(){$.getScript(info.repo+'/help/helpmappings.js', load63);}
function load63(){var x = $.address.value();$.address.value('');$.address.value(x); };