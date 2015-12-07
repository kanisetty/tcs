var SelectionController = new function(){
    var allCheckedOnPage = false; //whether the items are all checked on the page
    var allCheckedInFolder = false; // whether the user wants to check all items in the folder
    var checkedNum = 0; //number of currently checked items
    var childNodes = [];
    var imageSettings = {
        checked: info.repo + "/img/chkbox_checked.png",
        unchecked: info.repo + "/img/chkbox.png"
    };
    var self= this;
    var totalInFolder = 0; //total number of items in folder
    var totalOnPage = 0; //total number of items on the page

    //constants to determine which message to show when the user presses the checkall box
    this.CONFIRMCHECKALL = 0;
    this.CHECKALLCONFIRMED = 1;

    /**
     * Check all the rows on the page
     *
     * @public
     */
    this.CheckAllOnPage = function()
    {
        $('.itemCheckBox a').each(function(){
            $(this).parents('.browseItem').addClass('browseItemSelected');
            $(this).children('img').attr("src", imageSettings.checked);
            $(this).tmplItem().data.checked = true;
        });
        checkedNum = totalOnPage;
        allCheckedOnPage = true;
        $('#checkAll').children('img').attr("src", imageSettings.checked);
    };

    /**
     * Get whether the user wants to check all items in the folder or not
     *
     * @returns {Boolean}
     *
     * @public
     */
    this.GetAllCheckedInFolder = function(){
        return allCheckedInFolder;
    }

    /**
     * get the number of selected items
     *
     * @returns {Array}
     * @public
     */
    this.GetCheckedItems = function() {
        if(allCheckedInFolder)
        {
            return childNodes;
        }

        var items = [];
        $('.browseItem,.thumbnailViewBrowseItem').each(function(){
            var tmplData = $(this).tmplItem().data;
            if(tmplData.checked)
            {
                items.push(tmplData.DATAID);
            }
        });
        return items;
    };

    /**
     * get the cildNode array
     *
     * @returns {Array}
     * @public
     */
    this.GetChildNodes = function(){
        return childNodes;
    }

    /**
     * get the number of checked rows
     *
     * @returns {Integer}
     * @public
     */
    this.GetCheckNum = function(){
        return checkedNum;
    };

    /**
     * get the parentID of the selected items
     *
     * @public
     */
    this.GetParentID = function() {
        return $('.browseItemSelected').tmplItem().data.PARENTID;
    };

    /**
     * get the number of items in folder
     *
     * @returns {Integer}
     * @public
     */
    this.GetTotalInFolder = function(){
        return totalInFolder;
    };

    /**
     * get the number of total rows(already displayed) on the page
     *
     * @returns {Integer}
     * @public
     */
    this.GetTotalOnPage = function(){
        return totalOnPage;
    };

    /**
     * load the more button to the dom
     *
     * @public
     */
    this.LoadMultiActionButton = function()
    {
        var dropDownTmplVar = {
            id: 'multiActionDropDown',
            button: {
                id: 'multiActionDropDownButton',
                name: 'multiActionDropDownButton',
                classes: 'topButton',
                textLeft: T('LABEL.More'),
                img: 'arrow-down.png'
            },
            options: [{classes: 'multiActionCopy', linktext: T('LABEL.Copy'), action: T('LABEL.Copy')},
                      {classes: 'multiActionDelete', linktext: T('LABEL.Delete'), action: T('LABEL.Delete')},
                      {classes: 'multiActionMove', linktext: T('LABEL.Move'), action: T('LABEL.Move')}
            ]

        };
        $('#multiActionDropDown').remove();
        $("#dropDownWrapped_tmpl").template(dropDownTmplVar).appendTo('#pageActions');

        //when initialized, hide the more button as no item is selected
        $('#multiActionDropDown').hide();
    };

    /**
     * Reset the status of the selectionController
     *
     * @public
     */
    this.Reset = function(){
        $('#checkAll').children('img').attr("src", imageSettings.unchecked);
        checkedNum = 0;
        totalOnPage = 0;
        allCheckedOnPage = false;
    };

    /**
     * Set that the user wants to select all items in the folder
     *
     * @public
     */
    this.SetAllCheckedInFolder = function()
    {
        allCheckedInFolder = true;
    }

    /**
     * set the childNode list
     *
     * @argument {Arary}    l       The list to be set
     * @public
     */
    this.SetChildNodes = function(l){
        if(typeof l !== 'undefined')
        {
            childNodes = l;
        }else
        {
            childNodes = [];
        }

    }

    /**
     * Set the total number of rows on the page
     *
     * @public
     */
    this.SetTotalOnPage = function(){
        totalOnPage = $('.browseItem').length;
    };

    /**
     * Set the total number of items in folder
     *
     * @public
     */
    this.SetTotalInFolder = function(t){
        totalInFolder = t;
    }

    /**
     * Displays messages when user clickes the checkall checkbox
     *
     * @public
     */
    this.ShowCheckAllMessage = function(message){
        SelectionController.RemoveCheckAllMessage();
        var tmplVar;
        switch(message)
        {
            case SelectionController.CONFIRMCHECKALL:
                tmplVar = {
                    text: T('LABEL.SelectAllOnPage', {count: totalOnPage}),
                    linkId: 'selectAllInFolderLink',
                    linkText: T('LABEL.SelectAllInFolder', {count: totalInFolder})
    };
            break;
            case SelectionController.CHECKALLCONFIRMED:
                tmplVar = {
                    text: T('LABEL.SelectAllInFolderConfirmed', {count: totalInFolder}),
                    linkId: 'clearSelection',
                    linkText: T('LABEL.ClearSelection')
                };
            break;
        }
        ui.LoadTemplatePreprend("#selectAllMessage_tmpl", tmplVar, '#itemsForFileTab');
    }

    /**
     * Remove the message
     *
     * @public
     */
    this.RemoveCheckAllMessage = function(){
        $('.selectAllMessage').remove();
    }

    /**
     * Toggle CheckAll
     * if all rows are checked, uncheck all of them
     * if all rows are unchecked, check all of them
     * if not all rows are checked, check all of them
     *
     * @public
     */
    this.ToggleCheckAll = function(){
		//don't check/uncheck all if there are rows that is being processed
        if($('.disabled').length > 0)
        {
            return;
        }
        SelectionController.SetTotalOnPage();
        if(totalOnPage === 0)
        {
            return;
        }
        if(checkedNum === totalOnPage) //all checked, so uncheck all
        {
            SelectionController.RemoveCheckAllMessage();
            SelectionController.UncheckAll();
            SelectionController.UpdateMultiActionMenu();
        }else
        {
            if(totalOnPage !== totalInFolder)
            {
                SelectionController.ShowCheckAllMessage(SelectionController.CONFIRMCHECKALL);
            }
            SelectionController.CheckAllOnPage();
            SelectionController.UpdateMultiActionMenu();
        }

    };

	this.SelectCheckBox = function(dom)
	{
		$(dom).children('img').attr("src", imageSettings.checked);
	};

	this.isChecked = function(dom)
	{
		if($(dom).children('img').attr("src") === imageSettings.checked)
		{
			return true;
		}
		return false;
	}
    /**
     * Toggle the checkbox status for a single row
     * if the row is checked, uncheck it
     * if the row is unchecked, check it;
     * if all rows are checked, then checkAll is set
     *
     * @public
     */
    this.ToggleCheckBox = function(dom)
    {
        if($(dom).tmplItem().data.checked === true) {
            $(dom).parents('.browseItem').removeClass('browseItemSelected');
            $(dom).children('img').attr("src", imageSettings.unchecked);
            $(dom).tmplItem().data.checked = false;

            //if one row is unchecked, then set checkAll to unchecked
            checkedNum = checkedNum - 1;
            allCheckedOnPage = false;
            allCheckedInFolder = false;
            $('#checkAll').children('img').attr("src", imageSettings.unchecked);
            SelectionController.RemoveCheckAllMessage();
        }
        else
        {
            if(!$(dom).parents('.browseItem').hasClass('browseItemHover'))
            {
                $(dom).parents('.browseItem').addClass('browseItemSelected');
            }
            $(dom).children('img').attr("src", imageSettings.checked);
            $(dom).tmplItem().data.checked = true;

            checkedNum = checkedNum + 1;
            if(checkedNum === totalOnPage)
            {
                $('#checkAll').children('img').attr("src", imageSettings.checked);
                allCheckedOnPage = true;
                if(totalOnPage !== totalInFolder)
                {
                SelectionController.ShowCheckAllMessage(SelectionController.CONFIRMCHECKALL);
                }
            }
        }
    };

    /**
     * Uncheck all the rows
     *
     * @public
     */
    this.UncheckAll = function()
    {
        $('.itemCheckBox a').each(function(){
            $(this).parents('.browseItem').removeClass('browseItemSelected');
            $(this).children('img').attr("src", imageSettings.unchecked);
            $(this).tmplItem().data.checked = false;
        });
        allCheckedOnPage = false;
        allCheckedInFolder =false;
        checkedNum = 0;
        $('#checkAll').children('img').attr("src", imageSettings.unchecked);
    };

    /**
     * update the multiaction menu to refect the number of selected items
     *
     *@public
     */
    this.UpdateMultiActionMenu = function()
    {
        if(checkedNum!==0)
        {
            var count = checkedNum;
            if(allCheckedInFolder === true)
            {
                count = totalInFolder;
            }
            var tmplVar = $('#multiActionDropDown').tmplItem().data;
            $.each(tmplVar.options, function(i, v){
                v.linktext = T('LABEL.MultiActionItemsCount', {action: v.action, count: count});
            });
            $('#multiActionDropDown').tmplItem().update();
            $('#multiActionDropDown').show();

			var objInfoTemplateVar = $('#objectInfoDetails').tmplItem().data;

			if(objInfoTemplateVar.isReadOnly)
			{
				$('.multiActionDelete').parent('li').remove();
				$('.multiActionMove').parent('li').remove();
			}
        }
        else
        {
            $('#multiActionDropDown').hide();
        }
    };

    /**
     * Force to check all rows
     * Called when new rows are added to the page via infinit scrolling to
     * make sure the new rows are checked if checkAll is selected
     *
     * @public
     */
    this.UpDateNewRowsCheckStatus = function(){
        if(allCheckedOnPage === true)
        {
            if(totalInFolder !== totalOnPage)
            {
                SelectionController.ShowCheckAllMessage(SelectionController.CONFIRMCHECKALL);
            }else{
                SelectionController.RemoveCheckAllMessage();
            }
            SelectionController.CheckAllOnPage();
            SelectionController.UpdateMultiActionMenu();
            $('#checkAll').children('img').attr("src", imageSettings.checked);
            }
    };

    /**
     * Add related Events
     *
     * @public
     */
    this.AddEvents = function(){
        var bodyTag = $('body');
        bodyTag.delegate('.itemCheckBox a', 'click', function(e){
			e.stopPropagation();
			if($(this).parents('.browseItem').hasClass('disabled'))
			{
				return false;
			}
			SelectionController.ToggleCheckBox(this);
			if($(this).attr('class')!= 'notificationConfigCheckBox')
			{
				SelectionController.UpdateMultiActionMenu();
			}
			return false;
		});

        bodyTag.delegate('.itemCheckBox a', 'keydown', function(e){
			if($(this).parents('.browseItem').hasClass('disabled'))
			{
				//allow tab to go through
				if(e.keyCode!==9)
				{
					return false;
				}

			}
			if(e.keyCode === 32)
			{
				SelectionController.ToggleCheckBox(this);
				SelectionController.UpdateMultiActionMenu();
				return false;
			}

        });

        bodyTag.delegate('#checkAll', 'click', function(){
            SelectionController.ToggleCheckAll();
        });

        //event handler for the checkAll checkbox
        bodyTag.delegate('#selectAllInFolderLink', 'click', function(){
            SelectionController.ShowCheckAllMessage(SelectionController.CHECKALLCONFIRMED);
            SelectionController.SetAllCheckedInFolder();
            SelectionController.UpdateMultiActionMenu();
        });

        bodyTag.delegate('#clearSelection', 'click', function(){
            SelectionController.RemoveCheckAllMessage();
            SelectionController.UncheckAll();
            SelectionController.UpdateMultiActionMenu();
        });
    };
};
