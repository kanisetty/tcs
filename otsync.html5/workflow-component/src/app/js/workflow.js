$(document).ready(function () {
    "use strict";

    /* jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true,
     strict:true, undef:true, unused:true, curly:true, browser:true */
    /* global App, moment */

    $('.hide-initially').hide();

    var workflow = new App();
    var workflowData = workflow.getParameters();
    var nodeID = workflowData.id;
    var _gatewayURL = null;
    var clientOS = null;
    var deviceStrategy = workflow.getDeviceStrategy();

    workflow.init = function () {
        var _this = this;
        var action;

        clientOS = deviceStrategy.getClientOS();

        if (_this.initialized) {
            return;
        }

        deviceStrategy.getGatewayURL()
            .done(function (gatewayURL) {
                _gatewayURL = gatewayURL;

                _this.initialized = true;

                $('#close-button').click(workflow.close);

                if (workflowData.action != null) {
                    action = workflowData.action;
                }

                if (action == "assignment") {

                    if (workflowData.groupStep) {

                        $('#step-accept-assignment-btn').click(function () {
                            workflow.acceptAssignment();
                        });

                        $('#step-not-accept-assignment-btn').click(function () {
                            workflow.close();
                        });

                        $('#step').show();
                        $('#accept-assignment-section').show();
                    } else {

                        try {
                            $('#step-send-btn').text('Send on').click(function () {
                                workflow.sendOn();
                            });
                            workflow.showStep();
                        } catch (e) {
                            alert(e);
                        }
                    }
                } else if (action == "view") {

                    $('#step-send-btn').text('Initiate').click(function () {
                        workflow.initiate();
                    });

                    $('#workflow-title').show();
                    $('#wftitle-label').show();
                    workflow.showWorkflow();
                } else {
                    // unknown action
                    workflow.setNodeName(apputil.T("error.Unknown action provided by container"));
                }
            })
            .fail(function (error) {
                alert(error);
            });
    };

    workflow.clear = function () {
        $('#workflow').empty();
    };

    workflow.setNodeName = function (nodeName) {
        $("#node-name").text(nodeName);
    };

    workflow.showStep = function () {

        if (isValidId(nodeID)) {

            $.when(workflow.runRequestWithAuth({
                url: _gatewayURL + "/workflow/v5/workflows/" + nodeID + "/subwork/" + workflowData.subwork + "/tasks/" + workflowData.step

                + "?stepDoneUrl=" + encodeURIComponent(_gatewayURL + "/workflow-component/stepdone.jsp?os=" + clientOS)
                + "&formDoneUrl=" + encodeURIComponent(_gatewayURL + "/workflow-component/formupdated.jsp?os=" + clientOS)
            })).done(function (data) {

                // If it's a signing step, stop and explain that we don't handle that.
                // If it's a web form, we get a relative url back; go there.
                // Otherwise, draw the page based on the data returned.
                if (data.isSignatureStep) {
                    workflow.showSignatureRequired();
                } else if (data.location != null) {
                    workflow.openWindow(_gatewayURL + data.location);
                    workflow.close();
                } else {
                    workflow.renderStep(data);
                }
            }).fail(function (error) {
                onRequestFail(error);
            });
        }
    };

    workflow.showWorkflow = function () {

        if (isValidId(nodeID)) {
            $.when(workflow.runRequestWithAuth({
                url: _gatewayURL + "/workflow/v5/workflows/" + nodeID
                + "?nextUrl=" + encodeURIComponent(_gatewayURL + "/workflow-component/formsubmitted.jsp?os=" + clientOS)
            })).done(function (data) {

                // If a signature is required, stop and explain that we don't handle that.
                // If it's a web form, we get a relative url back; go there.
                // Otherwise, draw the page based on the data returned.
                if (data.isSignatureRequired) {
                    workflow.showSignatureRequired();
                } else if (data.location != null) {
                    workflow.openWindow(_gatewayURL + data.location);
                    workflow.close();
                } else {
                    workflowData.mapID = data.mapID;
                    workflow.renderStep(data);
                }
            }).fail(function (error) {
                onRequestFail(error);
            });
        }
    };

    workflow.showSignatureRequired = function () {

        workflow.setNodeName(apputil.T("label.Signature Required"));
        $('#signature-explanation').text(apputil.T("label.SignatureExplanation")).fadeIn('fast');
        $('.done').show();
    };

    /**
     * Render a standard workflow step
     */
    workflow.renderStep = function (data) {

        workflow.setNodeName(data.title + ": " + data.name);
        $("#workflow-title").val(data.title);

        if (data.isTitleEditable == false) {
            $("#workflow-title").attr('disabled', 'disabled');
        }

        if (data.isDueDateEditable) {
            $('#datetimepicker-due-date').datetimepicker({
                format: "yyyy-MM-dd HH:mm PP",
                pick12HourFormat: true,
                pickSeconds: false
            }).data('datetimepicker');
            $('#step-due-date').show();
        }

        if (data.instruction) {
            workflow.appendHTMLWithScriptTagsAsText($('#step-instructions'), data.instruction);
            $('#step-instructions').show();
            $('#step-instructions-label').show();
        }

        if (data.comments) {

            $('#comment-form').show();

            if (data.comments.length == 1) {

                if (data.comments[0].comment !== null && data.comments[0].comment != '') {
                    $('#step-prev-comment-label').text(apputil.T("label.CommentOnPreviousStep", {
                        step: data.comments[0].name,
                        user: data.comments[0].user
                    }));
                    workflow.appendHTMLWithScriptTagsAsText($('#step-prev-comment-text'), data.comments[0].comment);
                    $('#step-prev-comment').show();
                }
            } else if (data.comments.length > 1) {

                workflow.drawComments(data.comments);

                $('#step-view-comments-btn').click(function () {
                    $('#step').hide();
                    $('#comments').fadeIn('fast');
                });

                $("#step-prev-comments-multiple").show();
            }
        }

        if (data.commentInstructions) {
            workflow.appendHTMLWithScriptTagsAsText($('#commentInstructions'), data.commentInstructions);
            $('#commentInstructions').show();
        }

        if (data.canSendForReview) {
            workflow.drawReviewForm();

            $('#send-for-review-btn').click(function () {
                $('#step').hide();
                $('#sendForReview').fadeIn('fast');
            }).show();
        }

        if (data.canDelegate) {
            workflow.drawDelegateForm();

            $('#delegate-btn').click(function () {
                $('#step').hide();
                $('#delegateArea').fadeIn('fast');
            }).show();
        }

        if (data.attachments) {
            var nodeID = data.attachments;

            $('#step-view-attachments-btn').click(function () {
                var data = {
                    nodeID: nodeID,
                    title: apputil.T("label.Attachments")
                };

                var destComponentName = 'ews-app';

                workflow.openFromAppworks(destComponentName, data, false, false);
            });

            if (data.attachmentInstructions != null) {
                workflow.appendHTMLWithScriptTagsAsText($('#attachmentInstructions'), data.attachmentInstructions);
                $('#attachmentInstructions').show();
            }

            $('#attachment-group').show();
        }

        if (data.attributes && data.attributes.length > 0) {

            if (data.attributeInstructions) {
                workflow.appendHTMLWithScriptTagsAsText($('#attributeInstructions'), data.attributeInstructions);
                $('#attributeInstructions').show();
            }

            var i = 0;
            var attr;

            for (i in data.attributes) {

                attr = data.attributes[i];

                if (workflow.attributes[attr.type] != undefined) {

                    workflow.attributes[attr.type].get(attr);
                } else if (attr.validValues != undefined) { // popup field

                    workflow.attributes['OtherPopup'].get(attr);
                } else {

                    workflow.attributes['Other'].get(attr);
                }
            }

            //call once to enable/disable the initaite button
            workflow.checkRequiredAtts();

            $('.required-attr').change(function () {
                workflow.checkRequiredAtts();
            });

            $('.datetimepicker-attr').on('changeDate', function () {
                workflow.checkRequiredAtts();
            });

            $('#attribute-group').show();
        }

        if (data.forms && data.forms.length > 0) {

            workflow.drawForms(data.forms);

            $('#step-view-forms-btn').click(function () {
                $('#step').hide();
                $('#forms').fadeIn('fast');
            }).show();
        }

        if (data.dispositions && data.dispositions.length > 0) {

            $('#step-dispositions').empty();

            for (var i in data.dispositions) {

                var disposition = data.dispositions[i];

                $('#step-dispositions').append($('<button class="btn span3"/>').text(disposition).data('disposition', disposition).click(function () {
                    var disposition = $(this).data('disposition');
                    workflow.sendOn(disposition);
                }));
            }

            $('#step-dispositions').show();
        } else {

            $('#step-send-btn').show();
        }

        $('#step').fadeIn('fast');
    };

    workflow.drawComments = function (comments) {

        var group = $('<div class="control-group comment-group"/>');

        $('#comments').empty().append(group);

        for (var i in comments) {

            var comment = comments[i];

            if (comment.comment !== null && comment.comment != '') {

                group.append($('<label id="step-prev-comment-label-multiple"/>').text(apputil.T("label.CommentOnStep", {
                    step: comment.name,
                    user: comment.user
                })));
                group.append($('<p id="step-prev-comment-text">'));
                workflow.appendHTMLWithScriptTagsAsText(group, comment.comment);
                group.append('</p>');
            }
        }

        $('#comments').append($('<button class="btn btn-primary"/>').text(apputil.T('label.OK')).click(function () {
            $('#comments').hide();
            $('#step').fadeIn('fast');
        }));
    };

    workflow.drawReviewForm = function () {

        $('#Review-StepName').val($('#node-name').text());
        $('#Review-send-btn').click(function () {
            workflow.sendForReview();
        });

        $('#attrTypeaheadAssignee').keydown(function () {
            $(this).attr('data-dirty', 'true');
        });

        $('#attrTypeaheadAssignee').blur(function () {
            var item = $(this);

            if (item.attr('data-dirty') == 'true') {
                $('#Review-Assignee').val('');
                item.val('');
                $('#Review-send-btn').addClass('disabled').attr('disabled', 'disabled');
            }
        });

        $('#attrTypeaheadAssignee').typeahead({

            source: function () {

                return function (query, process) {

                    return $.when(workflow.runRequestWithAuth({
                        url: _gatewayURL + '/content/v5/users?filter=' + encodeURIComponent(query)
                    })).done(function (data) {

                        var options = [];

                        for (var i in data.users) {
                            options.push('<span data-attrid data-userID="' + data.users[i].userID + '">'
                                + workflow.format.displayName(data.users[i].userName, data.users[i].firstName, data.users[i].lastName) + '</span>');
                        }

                        return process(options);
                    });
                };
            }(),

            matcher: function (item) {

                return true;	// always match, our api takes care of the filtering.
            },

            updater: function () {

                return function (item) {
                    item = $(item);
                    $('#attrTypeaheadAssignee').attr('data-dirty', 'false');
                    $('#Review-Assignee').val(item.attr('data-userID'));
                    $('#Review-send-btn').removeClass('disabled').removeAttr('disabled');
                    return item.text();
                };
            }(),

            highlighter: function (item) {

                return item;
            },

            minLength: 2,
            items: 5
        });
    };

    workflow.drawDelegateForm = function () {

        $('#Delegate-send-btn').click(function () {
            workflow.sendDelegate();
        });


        $('#attrTypeaheadDelgateAssignee').keydown(function () {
            $(this).attr('data-dirty', 'true');
        });

        $('#attrTypeaheadDelgateAssignee').blur(function () {
            var item = $(this);

            if (item.attr('data-dirty') == 'true') {

                $('#Delegate-Assignee').val('');
                item.val('');
                $('#Delegate-send-btn').addClass('disabled').attr('disabled', 'disabled');
            }
        });

        $('#attrTypeaheadDelgateAssignee').typeahead({
            source: function () {

                return function (query, process) {

                    return $.when(workflow.runRequestWithAuth({
                        url: _gatewayURL + '/content/v5/users?filter=' + encodeURIComponent(query)
                    })).done(function (data) {

                        var options = [];

                        for (var i in data.users) {
                            options.push('<span data-attrid data-userID="' + data.users[i].userID + '">'
                                + workflow.format.displayName(data.users[i].userName, data.users[i].firstName, data.users[i].lastName) + '</span>');
                        }

                        return process(options);
                    });
                };
            }(),

            matcher: function (item) {

                return true;	// always match, our api takes care of the filtering.
            },

            updater: function () {

                return function (item) {
                    item = $(item);
                    $('#attrTypeaheadDelgateAssignee').attr('data-dirty', 'false');
                    $('#Delegate-Assignee').val(item.attr('data-userID'));
                    $('#Delegate-send-btn').removeClass('disabled').removeAttr('disabled');
                    return item.text();
                };
            }(),

            highlighter: function (item) {

                return item;
            },

            minLength: 2,
            items: 5
        });
    };

    workflow.drawForms = function (forms) {

        var group = $('<div class="control-group"/>');

        $('#forms').empty().append(group);

        for (var i in forms) {

            var form = forms[i];

            group.append($('<button class="btn btn-block"/>').text(form.name)
                .addClass(form.isRequired ? "btn-warning" : "")
                .click(function (url) {
                    return function () {
                        workflow.openWindow(_gatewayURL + url);
                    };
                }(form.url))
            );
        }

        $('#forms').append($('<button class="btn btn-primary"/>').text(apputil.T('label.OK')).click(function () {
            $('#forms').hide();
            $('#step').fadeIn('fast');
        }));

    };

    workflow.sendDelegate = function () {

        var userID = $('#Delegate-Assignee').val();
        var url = _gatewayURL
            + "/workflow/v5/workflows/" + nodeID + "/subwork/" + workflowData.subwork + "/tasks/" + workflowData.step
            + '?userID=' + encodeURIComponent(userID)
            + '&xAction=Delegate';

        $.when(workflow.runRequestWithAuth({
            url: url,
            type: 'PUT'
        })).done(function () {

            workflow.setNodeName(apputil.T("label.Success! The workflow has been delegated"));
            $('.hide-initially').hide();
            $('.done').show();
        }).fail(onDelegateFail);
    };

    workflow.sendForReview = function () {

        var userID = $('#Review-Assignee').val();
        var instructions = $('#Review-Instructions').val();
        var duration = $('#Review-Duration').val();
        var stepName = $('#Review-StepName').val();
        var url = gatewayURL
            + "/workflow/v5/workflows/" + nodeID + "/subwork/" + workflowData.subwork + "/tasks/" + workflowData.step
            + '?userID=' + encodeURIComponent(userID)
            + '&stepName=' + encodeURIComponent(stepName)
            + '&xAction=Review_sendon';

        if (instructions != '')
            url += "&instructions=" + encodeURIComponent(instructions);

        if (duration != '')
            url += "&duration=" + encodeURIComponent(duration);

        $.when(workflow.runRequestWithAuth({
            url: url,
            type: 'PUT'
        })).done(function () {

            workflow.setNodeName(apputil.T("label.Success! The workflow has been sent for review"));
            $('.hide-initially').hide();
            $('.done').show();
        }).fail(onSendForReviewFail);
    };

    workflow.sendOn = function (disposition) {
        var attrs = {};

        $('.wf-attribute').each(function () {
            var item = $(this);
            var isReadOnly = item.closest('.control-group').hasClass('read-only-attr');

            if (!isReadOnly) {

                var id = item.attr('data-attrid');
                var rowid = (item.attr('data-attr-row') != undefined) ? parseInt(item.attr('data-attr-row')) : 0;

                if (attrs[id] == undefined) {

                    attrs[id] = [];
                }

                attrs[id][rowid] = workflow.attributes[item.attr('data-type')].set($(this));
            }
        });

        var url = _gatewayURL
            + "/workflow/v5/workflows/" + nodeID + "/subwork/" + workflowData.subwork + "/tasks/" + workflowData.step
            + '?atts=' + encodeURIComponent(JSON.stringify(attrs));

        if (disposition) url += "&disposition=" + encodeURIComponent(disposition);

        var comment = $('#step-comment').val();

        if (comment != "")
            url += "&comment=" + encodeURIComponent(comment);


        $.when(workflow.runRequestWithAuth({
            url: url,
            type: 'PUT'
        })).done(function () {
            workflow.setNodeName(apputil.T("label.Success! The workflow has been sent on"));
            $('.hide-initially').hide();
            $('.done').show();

        }).fail(function (error) {
            onRequestFail(error);
        });
    };

    workflow.acceptAssignment = function () {

        var url = _gatewayURL
            + "/workflow/v5/workflows/" + nodeID + "/subwork/" + workflowData.subwork + "/tasks/" + workflowData.step;

        $.when(workflow.runRequestWithAuth({
            url: url,
            type: 'POST'
        })).done(function () {
            $('#accept-assignment-section').hide();
            $('#step-send-btn').text('Send on').click(function () {
                workflow.sendOn();
            });

            workflow.showStep();
        }).fail(function (error) {
            onRequestFail(error);
        });
    };

    workflow.initiate = function () {

        var url = _gatewayURL
            + "/workflow/v5/workflows/" + workflowData.mapID;

        var data = {

            title: $('#workflow-title').val()
        };

        var comment = $('#step-comment').val();

        if (comment != "")
            data.comment = comment;

        var duedate = $('#due-date-field').val();

        if (duedate != "")
            data.dueDate = moment(duedate, "YYYY-MM-DD HH:mm A").utc().format("YYYY-MM-DDTHH:mm:ss[Z]");

        var attrs = {};

        $('.wf-attribute').each(function () {
            var item = $(this);
            var rowid = (item.attr('data-attr-row') != undefined) ? parseInt(item.attr('data-attr-row')) : 0;

            if (attrs[item.attr('data-attrid')] == undefined) {

                attrs[item.attr('data-attrid')] = [];
            }

            attrs[item.attr('data-attrid')][rowid] = workflow.attributes[item.attr('data-type')].set($(this));
        });

        data.atts = JSON.stringify(attrs);

        $.when(workflow.runRequestWithAuth({
            url: url,
            type: 'POST',
            data: data
        })).done(function () {
            workflow.setNodeName(apputil.T("label.Success! The workflow has been initiated"));
            $('.hide-initially').hide();
            $('.done').show();
        }).fail(function (error) {
            onRequestFail(error);
        });
    };

    function onRequestFail(error) {
        if (typeof error === 'string') {
            workflow.setNodeName(apputil.T(error));
            alert(error);
        } else {
            workflow.setNodeName(apputil.T(error.errMsg));
        }
        workflow.clear();
    }

    function onSendForReviewFail() {

        workflow.setNodeName(apputil.T("error.Error sending for review"));
        $('.hide-initially').hide();
        $('.done').show();
    }

    function onDelegateFail() {

        workflow.setNodeName(apputil.T("Error, unable to delegate"));
        $('.hide-initially').hide();
        $('.done').show();
    }

    function isValidId(nodeId) {

        var isInvalid = (isNaN(nodeId) || nodeId === "");

        if (isInvalid) {

            workflow.setNodeName(apputil.T("error.Error: Invalid workflow ID"));
            workflow.clear();
        }

        return !isInvalid;
    }

    workflow.attributes = {

        Boolean: {

            get: function (attr) {
                var field = $('<div class="control-group' + (attr.isReadOnly ? ' read-only-attr' : '') + '"></div>');

                field.append($('<div class="controls"><label class="checkbox">'
                    + '<input class="wf-attribute' + (attr.isRequired ? ' required-attr' : '') + '" type="checkbox" data-attrid="' + attr.id + '" data-type="Boolean" ' + ((attr.values[0]) ? 'checked="checked"' : '') + (attr.isReadOnly ? ' disabled="disabled"' : '') + '/>'
                    + attr.name + ((attr.isRequired) ? '<strong class="text-error">*</strong>' : '')
                    + '</label></div>'));

                $("#attributes").append(field);

            },

            set: function (item) {
                return item.val() == 'on';
            }
        },


        Date: {

            get: function (attr) {

                var field = $('<div class="control-group' + (attr.isReadOnly ? ' read-only-attr' : '') + '"></div>');
                var html = '<label class="control-label">' + attr.name + ((attr.isRequired) ? '<span class="text-error">*</span>' : '') + '</label>';

                for (var i = 0; i < attr.numRows; i++) {

                    html += '<div class="controls">'
                        + '<div id="datetimepicker' + attr.id + '-' + i + '" class="datetimepicker-attr input-append date">'
                        + '<input type="text" class="input-large wf-attribute' + (attr.isRequired ? ' required-attr' : '') + '" data-attrid="' + attr.id + '" data-attr-row="' + i + '" data-type="Date" value="' + ((attr.values[i] == null) ? '' : attr.values[i]) + '" ' + (attr.isReadOnly ? ' disabled="disabled"' : '') + '/>'
                        + '<span class="add-on"><i data-time-icon="icon-time" data-date-icon="icon-calendar"></i></span></div></div>';
                }

                field.append($(html));

                $("#attributes").append(field);

                if (!attr.isReadOnly) {

                    for (i = 0; i < attr.numRows; i++) {

                        var picker;

                        if (attr.isTimeField) {

                            picker = $('#datetimepicker' + attr.id + '-' + i).datetimepicker({
                                format: "yyyy-MM-dd HH:mm PP",
                                pick12HourFormat: true,
                                pickSeconds: false
                            });
                        } else {

                            picker = $('#datetimepicker' + attr.id + '-' + i).datetimepicker({
                                format: "yyyy-MM-dd",
                                pick12HourFormat: true,
                                pickTime: false
                            });
                        }

                        if (attr.values[i] != null) {

                            picker.data('datetimepicker').setLocalDate(moment(attr.values[i], "YYYY-MM-DDTHH:mm:ssZ").toDate());
                        }
                    }
                }
            },

            set: function (item) {

                if (item.val() != '') {

                    return moment(item.val(), "YYYY-MM-DD HH:mm A").utc().format("YYYY-MM-DDTHH:mm:ss[Z]");
                } else {

                    return '';
                }

            }
        },

        DatePopup: {

            get: function (attr) {

                var field = $('<div class="control-group' + (attr.isReadOnly ? ' read-only-attr' : '') + '"></div>');
                var formattedDate;

                field.append($('<label class="control-label">' + attr.name + ((attr.isRequired) ? '<strong class="text-error">*</strong>' : '') + '</label>'));

                for (var i = 0; i < attr.numRows; i++) {

                    var div = $('<div class="controls" />');
                    var input = $('<select class="wf-attribute' + (attr.isRequired ? ' required-attr' : '') + '" data-attrid="' + attr.id + '" data-attr-row="' + i + '" data-type="DatePopup" ' + (attr.isReadOnly ? ' disabled="disabled"' : '') + '>');

                    input.append($('<option value="">Select...</option>'));

                    for (var j in attr.validValues) {

                        formattedDate = moment(attr.validValues[j], "YYYY-MM-DDTHH:mm:ssZ").format('YYYY-MM-DD');
                        input.append($('<option '
                            + ((attr.validValues[j] == attr.values[i]) ? 'selected="selected"' : '')
                            + ' value="' + attr.validValues[j] + '">' + formattedDate + '</option>'));
                    }

                    div.append(input);
                    field.append(div);
                }

                $("#attributes").append(field);
            },

            set: function (item) {

                return item.val();
            }
        },

        Integer: {
            get: function (attr) {

                var field = $('<div class="control-group' + (attr.isReadOnly ? ' read-only-attr' : '') + '"></div>');

                field.append($('<label class="control-label">'
                    + attr.name + ((attr.isRequired) ? '<strong class="text-error">*</strong>' : '')
                    + '</label>'));

                for (var i = 0; i < attr.numRows; i++) {

                    field.append($('<div class="controls"><input class="wf-attribute' + (attr.isRequired ? ' required-attr' : '') + '" type="number" data-attrid="' + attr.id + '" data-attr-row="' + i + '" data-type="Integer"'
                        + 'value="' + ((attr.values[i] == null) ? '' : attr.values[i]) + '" ' + (attr.isReadOnly ? ' disabled="disabled"' : '') + '/></div>'));
                }

                $("#attributes").append(field);
            },

            set: function (item) {

                var val = parseInt(item.val());

                return (isNaN(val)) ? null : val;
            }

        },

        IntegerPopup: {
            get: function (attr) {

                var field = $('<div class="control-group' + (attr.isReadOnly ? ' read-only-attr' : '') + '"></div>');

                field.append($('<label class="control-label">' + attr.name + ((attr.isRequired) ? '<strong class="text-error">*</strong>' : '') + '</label>'));

                for (var i = 0; i < attr.numRows; i++) {

                    var div = $('<div class="controls" />');
                    var input = $('<select class="wf-attribute' + (attr.isRequired ? ' required-attr' : '') + '" data-attrid="' + attr.id + '" data-attr-row="' + i + '" data-type="IntegerPopup" ' + (attr.isReadOnly ? ' disabled="disabled"' : '') + '>');

                    input.append($('<option value="">Select...</option>'));

                    for (var j in attr.validValues) {

                        input.append($('<option '
                            + ((attr.validValues[j] == attr.values[0]) ? 'selected="selected"' : '')
                            + ' value="' + attr.validValues[j] + '">' + attr.validValues[j] + '</option>'));
                    }

                    div.append(input);

                    field.append(div);

                }

                $("#attributes").append(field);
            },

            set: function (item) {

                var val = parseInt(item.val());
                return (isNaN(val)) ? null : val;
            }
        },

        Real: {
            get: function (attr) {

                var field = $('<div class="control-group' + (attr.isReadOnly ? ' read-only-attr' : '') + '"></div>');

                field.append($('<label class="control-label" for="attr' + attr.id + '">'
                    + attr.name + ((attr.isRequired) ? '<strong class="text-error">*</strong>' : '')
                    + '</label>'));

                for (var i = 0; i < attr.numRows; i++) {

                    field.append($('<div class="controls"><input class="wf-attribute' + (attr.isRequired ? ' required-attr' : '') + '" type="number" step="any" data-attrid="' + attr.id + '" data-attr-row="' + i + '" data-type="Real"'
                        + 'value="' + ((attr.values[i] == null) ? '' : attr.values[i]) + '" ' + (attr.isReadOnly ? ' disabled="disabled"' : '') + '/></div>'));
                }

                $("#attributes").append(field);
            },

            set: function (item) {
                var val = parseFloat(item.val());

                return (isNaN(val)) ? null : val;
            }
        },

        RealPopup: {
            get: function (attr) {

                var field = $('<div class="control-group' + (attr.isReadOnly ? ' read-only-attr' : '') + '"></div>');

                field.append($('<label class="control-label">' + attr.name + ((attr.isRequired) ? '<strong class="text-error">*</strong>' : '') + '</label>'));

                for (var i = 0; i < attr.numRows; i++) {

                    var div = $('<div class="controls" />');
                    var input = $('<select class="wf-attribute' + (attr.isRequired ? ' required-attr' : '') + '" data-attrid="' + attr.id + '" data-attr-row="' + i + '" data-type="RealPopup" ' + (attr.isReadOnly ? ' disabled="disabled"' : '') + '>');

                    input.append($('<option value="">Select...</option>'));

                    for (var j in attr.validValues) {

                        input.append($('<option '
                            + ((attr.validValues[j] == attr.values[0]) ? 'selected="selected"' : '')
                            + ' value="' + attr.validValues[j] + '">' + attr.validValues[j] + '</option>'));
                    }

                    div.append(input);
                    field.append(div);
                }

                $("#attributes").append(field);
            },

            set: function (item) {

                var val = parseFloat(item.val());

                return (isNaN(val)) ? null : val;
            }
        },

        StringField: {
            get: function (attr) {

                var field = $('<div class="control-group' + (attr.isReadOnly ? ' read-only-attr' : '') + '"></div>');
                var html = '<label class="control-label" for="attr' + attr.id + '">'
                    + attr.name + ((attr.isRequired) ? '<strong class="text-error">*</strong>' : '')
                    + '</label>';

                for (var i = 0; i < attr.numRows; i++) {

                    html += '<div class="controls"><input class="wf-attribute' + (attr.isRequired ? ' required-attr' : '') + '" type="text" data-attrid="' + attr.id + '" data-type="StringField"'
                        + 'data-attr-row="' + i + '" value="' + ((attr.values[i] == null) ? '' : attr.values[i]) + '" ' + (attr.isReadOnly ? ' disabled="disabled"' : '') + '/></div>';
                }

                field.append($(html));

                $("#attributes").append(field);
            },

            set: function (item) {

                return item.val();
            }
        },

        StringMultiLine: {

            get: function (attr) {

                var field = $('<div class="control-group' + (attr.isReadOnly ? ' read-only-attr' : '') + '"></div>');

                field.append($('<label class="control-label" for="attr' + attr.id + '">'
                    + attr.name + ((attr.isRequired) ? '<strong class="text-error">*</strong>' : '')
                    + '</label>'));

                for (var i = 0; i < attr.numRows; i++) {

                    field.append($('<div class="controls"><textarea class="wf-attribute' + (attr.isRequired ? ' required-attr' : '') + '" rows="3" data-attrid="' + attr.id + '"data-attr-row="' + i + '" data-type="StringMultiLine" ' + (attr.isReadOnly ? ' disabled="disabled"' : '') + '>'
                        + ((attr.values[i] == null) ? '' : attr.values[i])
                        + '</textarea></div>'));
                }

                $("#attributes").append(field);
            },

            set: function (item) {

                return item.val();
            }
        },

        StringPopup: {

            get: function (attr) {

                var field = $('<div class="control-group' + (attr.isReadOnly ? ' read-only-attr' : '') + '"></div>');

                field.append($('<label class="control-label">' + attr.name + ((attr.isRequired) ? '<strong class="text-error">*</strong>' : '') + '</label>'));

                for (var i = 0; i < attr.numRows; i++) {

                    var div = $('<div class="controls" />');
                    var input = $('<select class="wf-attribute' + (attr.isRequired ? ' required-attr' : '') + '" data-attrid="' + attr.id + '" data-type="StringPopup" data-attr-row="' + i + '" ' + (attr.isReadOnly ? ' disabled="disabled"' : '') + '>');

                    input.append($('<option value="">Select...</option>'));

                    for (var j in attr.validValues) {

                        input.append($('<option '
                            + ((attr.validValues[j] == attr.values[i]) ? 'selected="selected"' : '')
                            + ' value="' + attr.validValues[j] + '">' + attr.validValues[j] + '</option>'));
                    }

                    div.append(input);
                    field.append(div);
                }

                $("#attributes").append(field);
            },

            set: function (item) {

                return (item.val() == "") ? null : item.val();
            }
        },

        User: {

            get: function (attr) {

                var field = $('<div class="control-group' + (attr.isReadOnly ? ' read-only-attr' : '') + '"></div>');

                field.append($('<label class="control-label" for="attr' + attr.id + '">'
                    + attr.name + ((attr.isRequired) ? '<strong class="text-error">*</strong>' : '')
                    + '</label>'));

                for (var row = 0; row < attr.numRows; row++) {

                    field.append($('<div class="controls"><input class="wf-attribute' + (attr.isRequired ? ' required-attr' : '') + '" type="hidden" id="attr'
                        + attr.id + '-' + row + '" data-attrid="' + attr.id + '" data-attr-row="' + row + '" data-type="User" data-dirty="false" '
                        + 'value="' + ((attr.values[row] == null) ? '' : attr.values[row].userName) + '"/>'
                        + '<input class="ajax-typeahead" type="text" id="attrTypeahead' + attr.id + '-' + row + '" data-attrid="' + attr.id + '"'
                        + 'value="' + ((attr.values[row] == null) ? '' : attr.values[row].displayName) + '" ' + (attr.isReadOnly ? ' disabled="disabled"' : '') + '/></div>'));
                }

                $("#attributes").append(field);

                for (row = 0; row < attr.numRows; row++) {

                    $('#attrTypeahead' + attr.id + '-' + row).keydown(function () {
                        $(this).attr('data-dirty', 'true');
                    });

                    $('#attrTypeahead' + attr.id + '-' + row).blur(function () {
                        var item = $(this);

                        if (item.attr('data-dirty') == 'true') {

                            $('#attr' + item.attr('data-attrid') + '-' + item.attr('data-attr-row')).val('');

                            item.val('');

                            if (attr.isRequired) {

                                workflow.checkRequiredAtts();
                            }
                        }
                    });

                    $('#attrTypeahead' + attr.id + '-' + row).typeahead({

                        source: function (attrid, row) {

                            return function (query, process) {

                                return $.when(workflow.runRequestWithAuth({
                                    url: _gatewayURL + '/content/v5/users?filter=' + encodeURIComponent(query)
                                })).done(function (data) {
                                    var options = [];

                                    for (var i in data.users) {

                                        options.push('<span data-attrid="' + attrid + '-' + row + '" data-username="' + data.users[i].userName + '">'
                                            + workflow.format.displayName(data.users[i].userName, data.users[i].firstName, data.users[i].lastName) + '</span>');
                                    }

                                    return process(options);
                                });
                            };
                        }(attr.id, row),

                        matcher: function (item) {

                            return true;	// always match, our api takes care of the filtering.
                        },

                        updater: function (attrid, row) {

                            return function (item) {

                                item = $(item);

                                $('#attrTypeahead' + attrid + '-' + row).attr('data-dirty', 'false');
                                $('#attr' + attrid + '-' + row).val(item.attr('data-username'));

                                if (attr.isRequired) {

                                    workflow.checkRequiredAtts();
                                }

                                return item.text();
                            };

                        }(attr.id, row),

                        highlighter: function (item) {

                            return item;
                        },

                        minLength: 2,
                        items: 5
                    });
                }
            },

            set: function (item) {

                return item.val();
            }
        },

        WebAttrNodeSelect: {

            get: function (attr) {

                var field = $('<div class="control-group' + (attr.isReadOnly ? ' read-only-attr' : '') + '"></div>');

                field.append($('<label class="control-label" for="attr' + attr.id + '">'
                    + attr.name + ((attr.isRequired) ? '<strong class="text-error">*</strong>' : '')
                    + '</label>'));

                for (var row = 0; row < attr.numRows; row++) {

                    field.append($('<div class="controls"><input class="wf-attribute' + (attr.isRequired ? ' required-attr' : '') + '" type="hidden" id="attr'
                        + attr.id + '-' + row + '" data-attrid="' + attr.id + '" data-attr-row="' + row + '" data-type="WebAttrNodeSelect"'
                        + 'value="' + ((attr.values[row] == null) ? '' : attr.values[row].id) + '"/>'
                        + '<input class="ajax-typeahead" type="text" id="attrTypeahead' + attr.id + '-' + row + '" data-attrid="' + attr.id + '" data-dirty="false" '
                        + 'value="' + ((attr.values[row] == null) ? '' : attr.values[row].name) + '" ' + (attr.isReadOnly ? ' disabled="disabled"' : '') + '/></div>'));
                }

                $("#attributes").append(field);

                var nodeTypes = attr.nodeTypes.join(',');

                for (row = 0; row < attr.numRows; row++) {

                    $('#attrTypeahead' + attr.id + '-' + row).keydown(function () {

                        $(this).attr('data-dirty', 'true');
                    });

                    $('#attrTypeahead' + attr.id + '-' + row).blur(function () {

                        var item = $(this);

                        if (item.attr('data-dirty') == 'true') {

                            $('#attr' + item.attr('data-attrid') + '-' + item.attr('data-attr-row')).val('');
                            item.val('');

                            if (attr.isRequired) {

                                workflow.checkRequiredAtts();
                            }
                        }
                    });

                    $('#attrTypeahead' + attr.id + '-' + row).typeahead({

                        source: function (attrid, row, nodeTypes) {

                            return function (query, process) {

                                var baseFolders = workflow.baseFolders.get();
                                var baseFoldersStr = baseFolders.join(',');

                                return $.when(workflow.runRequestWithAuth({
                                    url: _gatewayURL + '/content/v5/nodes',
                                    data: {
                                        filter: '*' + query + '*',
                                        ids: baseFoldersStr,
                                        isTempoSearch: false,
                                        isNameOnlySearch: true,
                                        nodeTypes: nodeTypes
                                    }
                                })).done(function (data) {

                                    var options = [];

                                    for (var i in data.resultList) {

                                        options.push('<span data-attrid="' + attrid + '-' + row + '" data-nodeid="' + data.resultList[i].id + '" data-selected-display="' + data.resultList[i].name + '">'
                                            + data.resultList[i].name
                                            + ((data.resultList[i].parentName != null) ? ' (' + apputil.T('label.inParent', {parentName: data.resultList[i].parentName}) + ')' : '')
                                            + '</span>');
                                    }

                                    return process(options);
                                });
                            };
                        }(attr.id, row, nodeTypes),

                        matcher: function (item) {

                            return true;	// always match, our api takes care of the filtering.
                        },

                        updater: function (attrid, row) {

                            return function (item) {

                                item = $(item);

                                $('#attrTypeahead' + attrid + '-' + row).attr('data-dirty', 'false');
                                $('#attr' + attrid + '-' + row).val(item.attr('data-nodeid'));

                                if (attr.isRequired) {

                                    workflow.checkRequiredAtts();
                                }

                                return item.attr('data-selected-display');
                            };
                        }(attr.id, row),

                        highlighter: function (item) {

                            return item;
                        },

                        minLength: 2,
                        items: 5
                    });
                }
            },

            set: function (item) {

                var val = parseInt(item.val());

                return (isNaN(val)) ? null : val;
            }
        },

        UserPopup: {

            get: function (attr) {

                var field = $('<div class="control-group' + (attr.isReadOnly ? ' read-only-attr' : '') + '"></div>');

                field.append($('<label class="control-label" for="attr' + attr.id + '"' + '>' + attr.name + ((attr.isRequired) ? '<strong class="text-error">*</strong>' : '') + '</label>'));

                for (var i = 0; i < attr.numRows; i++) {

                    var div = $('<div class="controls" />');
                    var input = $('<select class="wf-attribute' + (attr.isRequired ? ' required-attr' : '') + '" data-attrid="' + attr.id + '" data-attr-row="' + i + '" data-type="UserPopup" ' + (attr.isReadOnly ? ' disabled="disabled"' : '') + '>');

                    input.append($('<option value="">Select...</option>'));

                    for (var j in attr.validValues) {

                        input.append($('<option '
                            + ((attr.values[0] != null && attr.validValues[j].userName == attr.values[0].userName) ? 'selected="selected"' : '')
                            + ' value="' + attr.validValues[j].userName + '">' + attr.validValues[j].displayName + '</option>'));
                    }

                    div.append(input);
                    field.append(div);
                }

                $("#attributes").append(field);
            },

            set: function (item) {
                return (item.val() == "") ? null : item.val();
            }
        },


        Other: {

            get: function (attr) {

                var field = $('<div class="control-group' + (attr.isReadOnly ? ' read-only-attr' : '') + '"></div>');

                var html = '<label class="control-label" for="attr' + attr.id + '">'
                    + attr.name + ((attr.isRequired) ? '<strong class="text-error">*</strong>' : '')
                    + '</label>';

                for (var i = 0; i < attr.numRows; i++) {

                    html += '<div class="controls"><input class="wf-attribute' + (attr.isRequired ? ' required-attr' : '') + '" type="text" data-attrid="' + attr.id + '" data-type="Other"'
                        + 'data-attr-row="' + i + '" value="' + ((attr.values[i] == null) ? '' : attr.values[i]) + '" ' + (attr.isReadOnly ? ' disabled="disabled"' : '') + '/></div>';
                }

                field.append($(html));
                $("#attributes").append(field);
            },

            set: function (item) {

                return item.val();
            }
        },


        OtherPopup: {

            get: function (attr) {

                var field = $('<div class="control-group' + (attr.isReadOnly ? ' read-only-attr' : '') + '"></div>');

                field.append($('<label class="control-label">' + attr.name + ((attr.isRequired) ? '<strong class="text-error">*</strong>' : '') + '</label>'));

                for (var i = 0; i < attr.numRows; i++) {

                    var div = $('<div class="controls" />');
                    var input = $('<select class="wf-attribute" data-attrid="' + attr.id + '" data-type="OtherPopup" data-attr-row="' + i + '" ' + (attr.isReadOnly ? ' disabled="disabled"' : '') + '>');

                    input.append($('<option value="">Select...</option>'));

                    for (var j in attr.validValues) {

                        input.append($('<option '
                            + ((attr.validValues[j] == attr.values[i]) ? 'selected="selected"' : '')
                            + ' value="' + attr.validValues[j] + '">' + attr.validValues[j] + '</option>'));
                    }

                    div.append(input);
                    field.append(div);
                }

                $("#attributes").append(field);
            },

            set: function (item) {

                return (item.val() == "") ? null : item.val();

            }

        }


    };

    workflow.baseFolders = new function () {
        var baseFolders = null;

        this.get = function () {

            if (baseFolders == null) {

                $.when(workflow.runRequestWithAuth({
                    url: _gatewayURL + '/content/v5/properties',
                    async: false,
                    cache: false,
                    type: 'GET'
                })).done(function (data) {
                    var ids = [];

                    for (var i in data) {

                        ids.push(data[i]);
                    }

                    baseFolders = ids;
                });
            }

            return baseFolders;
        };
    };

    workflow.appendHTMLWithScriptTagsAsText = function (parentElement, htmlString) {
        var htmlNodes = $.parseHTML(htmlString, null, true);

        $.each(htmlNodes, function (i, el) {

            if (el.tagName == "SCRIPT") {
                var tmp = document.createElement("div");
                tmp.appendChild(el);
                $('<div/>').text(tmp.innerHTML).appendTo(parentElement);
            } else {
                parentElement.append(el);
            }
        });
    };

    workflow.checkRequiredAtts = function () {

        $('.required-attr').each(function () {
            $('#step-send-btn').removeClass('disabled').removeAttr('disabled');

            if ($(this).val() == '') {

                $('#step-send-btn').addClass('disabled').attr('disabled', 'disabled');
                return false;
            }
        });

    };

    workflow.start();
});