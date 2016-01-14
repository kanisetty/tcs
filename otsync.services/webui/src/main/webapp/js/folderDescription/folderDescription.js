var FolderDescription = new function () {
    this.init = function (objectInfo) {
        var template = objectInfo.ISREADONLY ? "readonlyDescriptionTemplate" : "editableDescriptionTemplate";
        ui.LoadTemplateInEmptyElement(template, objectInfo, "#folderDescriptionInfo");
		//fix for ie's implementation of placeholders for textareas
		clear_placeholder('folderDescriptionInput', T('LABEL.EnterFolderDescription'));
        addEventsHandler();
    };

	
    function addEventsHandler() {
        $("body").delegate("#updateDescriptionButton", "click", function (e) {
            var nodeID = $(this).parent().tmplItem().data.DATAID;
            var desc = $("#folderDescriptionInput").val();

            FolderDescription.updateDescription(nodeID, desc);
        });
    }
};
