var loadingDialog = loadingDialog || (function ($) {
        'use strict';

        // timeout
        var $timeout = null;

        // Creating modal dialog's DOM
        var $dialog = $(
            '<div class="modal fade" data-backdrop="static" data-keyboard="false" tabindex="-1" role="dialog" aria-hidden="true" style="padding-top:15%; overflow-y:visible;">' +
            '<div class="modal-dialog modal-m">' +
            '<div class="modal-content">' +
            '<div class="modal-header"><h3 style="margin:0;"></h3></div>' +
            '<div class="modal-body">' +
            '<div class="reload" style="display:none;"><button onclick="location.reload();">Retry</button></div>' +
            '<div class="progress progress-striped active" style="margin-bottom:0;"><div class="progress-bar" style="width: 100%"></div></div>' +
            '</div>' +
            '</div></div></div>');

        return {
            /**
             * Opens our dialog
             * @param message Custom message
             * @param options Custom options:
             * 				  options.dialogSize - bootstrap postfix for dialog size, e.g. "sm", "m";
             * 				  options.progressType - bootstrap postfix for progress bar type, e.g. "success", "warning".
             */
            show: function (message, options) {
                // Assigning defaults
                if (typeof options === 'undefined') {
                    options = {};
                }
                if (typeof message === 'undefined') {
                    message = 'LOADING';
                }
                var settings = $.extend({
                    dialogSize: 'm',
                    progressType: '',
                    onHide: null // This callback runs after the dialog was hidden
                }, options);

                // Configuring dialog
                $dialog.find('.modal-dialog').attr('class', 'modal-dialog').addClass('modal-' + settings.dialogSize);
                $dialog.find('.progress-bar').attr('class', 'progress-bar');
                if (settings.progressType) {
                    $dialog.find('.progress-bar').addClass('progress-bar-' + settings.progressType);
                }
                $dialog.find('h3').text(message);
                // Adding callbacks
                if (typeof settings.onHide === 'function') {
                    $dialog.off('hidden.bs.modal').on('hidden.bs.modal', function (e) {
                        settings.onHide.call($dialog);
                    });
                }

                $dialog.find('.reload').hide();
                $dialog.find('.progress').show();

                // Opening dialog
                $dialog.modal();

                $timeout = setTimeout(this.showRetry, 7500);

            },
            /**
             * Closes dialog
             */
            hide: function () {
              clearTimeout($timeout);
              $timeout = null;
              $dialog.find('.reload').hide();
              $dialog.find('.progress').show();
              $dialog.modal('hide');
            },

            showRetry: function () {
              clearTimeout($timeout);
              $timeout = null;
              $dialog.find('.reload').show();
              $dialog.find('.progress').hide();
            },

            cancelTimeout: function () {
              clearTimeout($timeout);
              $timeout = null;
            }
        };

    })(jQuery);
