/**
 * # Object Details
 * An object detail viewer component for
 * OpenText Application Gateway.
 *
 * **Version** 1.0.0
 */

/* jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true,
 strict:true, undef:true, unused:true, curly:true, browser:true,
 jquery: true */
/* global App */

;(function () {
    // Keep JavaScript definitions strict
    "use strict";

    // Create the application
    var ObjDetails = new App();
    var deviceStrategy = ObjDetails.getDeviceStrategy();
    var objectData = ObjDetails.getParameters();
    var nodeID = objectData.id;

    /**
     * ## Initialization
     * Set up initial events and load data for the node.
     */
    /**
     * ### ObjDetails.init
     *
     * Application initialization.
     */
    ObjDetails.init = function () {
        // Only trigger the initialization once
        if (this.initialized) {
            return;
        }
        this.initialized = true;

        // Bind events for the application
        bindEvents();

        // Get data for the node given in the query string
        getNodeData(nodeID);
        $('#tab-navigation.btn-group > .btn:first-child').attr('class', 'btn btn-primary');
    };

    /**
     * ### bindEvents
     *
     * Bind any events for the page.
     */
    function bindEvents () {
        $(document.body).on("click", "#tab-navigation", function (event) {
            // Don't trigger default events
            event.preventDefault();

            // Switch to the tab specified by the href attribute
            showTab(ObjDetails.getHash(event.target.href));
        });
    }

    /**
     * ## Data Loading
     * Load data for the application.
     */

    /**
     * ### getNodeData
     *
     * Get the node data from the server.
     *
     * @param nodeId    ID of the Node to query.
     */
    function getNodeData (nodeId) {

        // Send request to server if the node is valid
        if (isValidNode(nodeId)) {
            $.when(ObjDetails.runRequestWithAuth({url: deviceStrategy.getGatewayURL() + "/content/v5/nodes/" + nodeId + "/details"}))
                .done(function (data) {
                    // Make sure there is data to show
                    showData(data);
                }).fail(function (data) {
                    onError(data.errMsg);
                });
        }
    }

    /**
     * ### getHistory
     *
     * Get the audit history from the server.
     *
     * @param nodeId    The Object ID of the object to audit.
     */
    function getHistory (nodeId) {
        // Make sure the node is valid
        if (isValidNode(nodeId) && $("#audit-history").children().length === 0) {
            $("").addClass("loading");
            $.when(ObjDetails.runRequestWithAuth({url: deviceStrategy.getGatewayURL() + "/content/v5/nodes/" + nodeId + "/history"}))
                .done(function (data) {
                    if (data.ok) {
                        showHistory(data.history);
                    } else {
                        onError(data.errMsg);
                    }
                }).fail(function (error) {
                    onError(error.errMsg);
                }).always(function () {
                    $("").removeClass("loading");
                });
        }
    }

    /**
     * #### onError
     *
     * Clear node data and show the error.
     *
     * @param error    The error message string.
     */
    function onError (error) {
        clearData();
        $("#node-name").text(error);
    }

    /**
     * ## Display Data
     * Bind the data to fields within the application and
     * show it to the user.
     */

    /**
     * ### showData
     *
     * Bind the data to the view.
     *
     * @param node    Object containing the node data.
     */
    function showData (node) {
        // Set the header text and node name
        $(".node-name").text(node.name);

        // Set tab data
        setGeneralTab(node);
        setCategoryTab(node.categories);
    }

    /**
     * ### showHistory
     *
     * Bind the history data to the view.
     *
     * @param data    Object containing the audit list data.
     */
    function showHistory (data) {
        var idx, len = data.length, history, lst = [];

        for (idx = 0; idx < len; idx += 1) {
            history = data[idx];

            // Build the audit row
            lst.push("<li>");

            // Add the action
            lst.push("<div class='audit-action'>" +
            history.eventDisplayName + "</div>");

            // Add the information
            lst.push("<small class='audit-info'>" +
            ObjDetails.format.displayName(history.userName,
                history.firstName, history.lastName) +
            " - " + ObjDetails.format.date(history.auditDate) +
            "</small>");
            lst.push("</li>");
        }

        // Add the items to the list
        $("#audit-history").html(lst.join(""));
    }

    /**
     * #### setGeneralTab
     *
     * Set the data on the General Tab.
     *
     * @param node    An object containing the node's data.
     */
    function setGeneralTab (node) {
        // Set Description
        $("#node-desc").text(node.description);

        // Set Create Date
        $("#node-created").text(ObjDetails.format.date(node.displayCreateDate?node.displayCreateDate:node.createDate));

        // Set Creator username
        $("#node-created-by").text(node.ownerName);

        // Set Modified Date
        $("#node-modified").text(ObjDetails.format.date(node.displayModifyDate?node.displayModifyDate:node.modifyDate));

        // Set Type
        $("#node-type").text(formatType(node.mimetype));

        // Set size
        $("#node-size").text(formatSize(node.dataSize));
    }

    /**
     * #### setCategoryTab
     *
     * Set the data on the Category Tab.
     *
     * @param node    An object containing the category data.
     */
    function setCategoryTab (categories) {
        var $cats = $("#categories"), $catData,
            cat, catIdx,catLen = categories.length,
            att, attIdx, attLen, attData, val;

        if (catLen <= 0) {
            $cats.html(apputil.T('label.NoCategoriesDefined'));
            return;
        }

        // Iterate over each category
        for (catIdx = 0; catIdx < catLen; catIdx += 1) {
            cat = categories[catIdx];
            attLen = cat.attributeCount;
            attData = [];

            // Set the header
            $("<div class='page-header'><h4>" + cat.name + "</h4></div>")
                .appendTo($cats);

            // Create the category container
            $catData = $("<div class='container-fluid'></div>")
                .appendTo($cats);

            // Iterate over each attribute
            for (attIdx = 0; attIdx < attLen; attIdx += 1) {
                att = cat.attributes[attIdx];

                // Create attribute row
                attData.push("<div class='row-fluid'>");

                attData.push("<div class='span6 grid-heading'>");
                attData.push(att.name);
                attData.push("</div>");

                attData.push("<div class='span6'>");
                val = att.value;

                // Check for different formats
                if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(val)) {
                    // Date type
                    val = ObjDetails.format.date(val);
                } else if (typeof val === "string") {
                    // String
                    val = val.replace(/\r?\n/g, "<br>");
                }
                attData.push(val);
                attData.push("</div>");

                attData.push("</div>");
            }
            $(attData.join("")).appendTo($catData);
        }
    }

    /**
     * ### showTab
     *
     * Show the specified tab data
     *
     * @param tabId    The ID of the tab to show.
     */
    function showTab (tabId) {
        // Get the possible tabs by the navigation element
        $("#tab-navigation > a").each(function () {
            var target = ObjDetails.getHash($(this).attr("href"));
            $("#" + target).toggle(target === tabId);
        });

        if (tabId === "history") {
            getHistory(nodeID);
        }
    }

    /**
     * ### clearData
     *
     * Clear all node data.
     */
    function clearData () {
        // Clear image
        $("#node-type-img").attr("src", "");

        // Clear fields
        $(".field").html("");
    }

    /**
     * ## Miscellaneous
     * Helper functions for the application.
     */

    /**
     * ### isValidNode
     *
     * Check if the Node ID is valid.
     *
     * @param nodeId    The ID to check.
     * @return          Boolean representing the validity of the ID.
     */
    function isValidNode (nodeId) {
        // Check the validity of the node
        var isInvalid = (isNaN(nodeId) || nodeId === "");

        // Clear the page and show an error if it is not valid
        if (isInvalid) {
            onError(apputil.T('label.ErrorInvalidNodeID'));
        }

        return !isInvalid;
    }

    /**
     * ### formatSize
     *
     * Format the node size based to an easier to read format.
     * Translate bytes to a larger unit if necessary.
     *
     * @param size    The size of the node, in bytes.
     * @return        String representing a human-readable size.
     *                0.00 [unit] (0.00 bytes)
     */
    function formatSize (size) {
        var formats = [apputil.T("label.bytes"), apputil.T("label.KB"), apputil.T("label.MB"), apputil.T("label.GB"), apputil.T("label.TB")],
            idx = 0, bytes = size;

        // If the size is invalid, set it to 0
        if (isNaN(size) || size === null) {
            size = bytes = 0;
        }

        // Increase the base unit as needed
        while (size >= 1024) {
            idx += 1;
            size /= 1024;
        }

        if (idx !== 0) {
            // If the unit is not bytes, round the data and add byte info
            size = (Math.round(size * 10) / 10).toFixed(2);
            bytes = " (" + ObjDetails.format.number(bytes) + " " + apputil.T("label.bytes") + ")";
        } else {
            // If the size is 1 byte, make the unit singular
            if (size == 1) {
                formats[0] = apputil.T("label.byte");
            }
            // No extra bytes data
            bytes = "";
        }

        return ObjDetails.format.number(size) + " " + formats[idx] + bytes;
    }

    /**
     * ### formatType
     *
     * Format the node type to an easier to read format.
     *
     * @param theType    The element's type.
     * @return           String representing a human-readable type.
     */
    function formatType (theType) {
        // An object of all possible types
        var types = {
            "application/pdf": "PDF"
        };

        // Default if the value is not found
        return types[theType] || apputil.T("Document");
    }

    /**
     * ### getIconUri
     *
     * Get an icon for the current node type.
     *
     * @param node    Data about the node.
     * @return        String representing the path to the icon.
     */
    function getIconUri (node) {
        var type = "";
        switch (node.subtype) {
            case 0:
                // Folder; Might have an action?
                break;
            case 144:
                // Document
                type = node.mimeType;
                break;
        }

        return deviceStrategy.getGatewayURL() + "/content/icons/" +
            node.subtype + (type !== "" ? "_" + type : "") + ".png";
    }

    $('#tab-navigation.btn-group > .btn').click(function() {

        $('#tab-navigation.btn-group > .btn').attr('class', 'btn');
        $(this).addClass('btn-primary');
    });

    // Manually start the application
    ObjDetails.start();
}).call(this);
