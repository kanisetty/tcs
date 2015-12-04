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
	
	This file contains JavaScript code used in the toc frame.
	

	Version
	=======

	2005-05-31 mmh

*/

// Open all folders
// May not work with very large trees (browser may time out)
// You may call this on a node other than the root, but it must be a folder
function expandTree(folderObj)
{
	var childObj;
	var i;
	//Open folder
	if (!folderObj.isOpen) clickOnNodeObj(folderObj)
	//Call this function for all folder children
	for (i=0 ; i < folderObj.nChildren; i++)  {
		childObj = folderObj.children[i]
		if (typeof childObj.setState != "undefined") {//is folder
			expandTree(childObj)
		}
	}
}

// Close all folders
function collapseTree()
{
	clickOnNodeObj(foldersTree)  //hide all folders
	clickOnNodeObj(foldersTree)  //restore first level
}

// In order to show a folder, open all the folders that are higher in the hierarchy 
// all the way to the root must also be opened.
// (Does not affect selection highlight.)
function openFolderInTree(linkID) 
{
	var folderObj;
	folderObj = findObj(linkID);
	folderObj.forceOpeningOfAncestorFolders();
	if (!folderObj.isOpen) clickOnNodeObj(folderObj);
}

// Load a page as if a node on the tree was clicked (synchronize frames)
// (Highlights selection if highlight is available.)
function loadSynchPage(linkID) 
{
	var docObj;
	docObj = findObj(linkID);
	if (docObj) {
		docObj.forceOpeningOfAncestorFolders();
		highlightObjLink(docObj);
		// clickOnLink(linkID,docObj.link,TARGETFRAME);

		//Scroll the tree window to show the selected node
		//scroll doesn work with NS4, for example
		if (typeof document.documentElement != "undefined") {
			document.documentElement.scrollTop=docObj.navObj.offsetTop;
		}
	} else {
		// remove highlight
		if (browserVersion == 1 || browserVersion == 3) {
			if (lastClicked != null) {
				var prevClickedDOMObj = getElById('itemTextLink'+lastClicked.id);
				prevClickedDOMObj.style.color=lastClickedColor;
				prevClickedDOMObj.style.backgroundColor=lastClickedBgColor;
			}
		}
	}
}

