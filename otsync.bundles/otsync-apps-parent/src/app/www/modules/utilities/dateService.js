angular.module('dateService', [])
    .factory('$dateService', ['$displayMessageService', '$filter', function ($displayMessageService, $filter) {
        return {

            getCurrentDate: function(){
                return new Date();
            },

            getFormattedNow: function(){
                return $filter('date')(new Date(), 'yyyy-MM-dd');
            },

            getTimeAgo: function(dateString){
                var timeAgo = '';

                if ( dateString != null && dateString.length > 0) {

                    var date = new Date(dateString);
                    var currentTime = this.getCurrentDate();
                    var timeDiffInMilliSecs = currentTime.getTime() - date.getTime();

                    var seconds = Math.abs(timeDiffInMilliSecs) / 1000;
                    var minutes = seconds / 60;
                    var hours = minutes / 60;
                    var days = hours / 24;
                    var years = days / 365;

                    if (seconds < 45) {
                        timeAgo += Math.round(seconds) + ' ' + $displayMessageService.translate('SECONDS') + ' ' + $displayMessageService.translate('AGO');
                    } else if (seconds < 90) {
                        timeAgo += 1 + ' ' + $displayMessageService.translate('MINUTE') + ' ' + $displayMessageService.translate('AGO');
                    } else if (minutes < 45) {
                        timeAgo += Math.round(minutes) + ' ' + $displayMessageService.translate('MINUTES') + ' ' + $displayMessageService.translate('AGO');
                    } else if (minutes < 90) {
                        timeAgo += 1 + ' ' + $displayMessageService.translate('HOUR') + ' ' + $displayMessageService.translate('AGO');
                    } else if (hours < 24) {
                        timeAgo += Math.round(hours) + ' ' + $displayMessageService.translate('HOURS') + ' ' + $displayMessageService.translate('AGO');
                    } else if (hours < 42) {
                        timeAgo += 1 + ' ' + $displayMessageService.translate('DAY') + ' ' + $displayMessageService.translate('AGO');
                    } else if (days < 30) {
                        timeAgo += Math.round(days) + ' ' + $displayMessageService.translate('DAYS') + ' ' + $displayMessageService.translate('AGO');
                    } else if (days < 45) {
                        timeAgo += 1 + ' ' + $displayMessageService.translate('MONTH') + ' ' + $displayMessageService.translate('AGO');
                    } else if (days < 365) {
                        timeAgo += Math.round(days / 30) + ' ' + $displayMessageService.translate('MONTHS') + ' ' + $displayMessageService.translate('AGO');
                    } else if (years < 1.5) {
                        timeAgo += 1 + ' ' + $displayMessageService.translate('YEAR') + ' ' + $displayMessageService.translate('AGO');
                    } else {
                        timeAgo += Math.round(years) + ' ' + $displayMessageService.translate('YEARS') + ' ' + $displayMessageService.translate('AGO');
                    }
                }

                return timeAgo;
            },

            getISODateString: function(date) {
                function _pad(n) {
                    return n < 10 ? '0' + n : n
                }

                return  date.getUTCFullYear()
                    + '-' + _pad(date.getUTCMonth()+1)
                    + '-' + _pad(date.getUTCDate())
                    + 'T' + _pad(date.getUTCHours())
                    + ':' + _pad(date.getUTCMinutes())
                    + ':' + _pad(date.getUTCSeconds())
                    + 'Z';
            }
        }
    }]);