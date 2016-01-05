//From csui project.  Used to create the custom alpaca fields
var UAPI = { User: 0, Group: 1 };
var NodeTypes = { Alias: 1, SearchQuery: 258 };

function parseDate(text) {
    return text && moment(text)
            .toDate();
}

function stringifyDate(date) {
    return JSON.stringify(date);
}

function dateToLocalIsoString(date, format) {
    function pad(n) { return n < 10 ? '0' + n : n }
    var localIsoString = date;
    var mmDatetime;
    if (format) {
        // LL -> moment: yy/mm/dd -> YY/MM/DD
        format = format.replace(/y/g, "Y")
            .replace(/m/g, "M")
            .replace(/d/g, "D");
        mmDatetime = moment (date, format);
    } else {
        mmDatetime = moment (date);
    }
    if (mmDatetime.isValid()) {
        localIsoString = mmDatetime.year() + '-'
            + pad((mmDatetime.month() + 1)) + '-'
            + pad(mmDatetime.date()) + 'T'
            + pad(mmDatetime.hours()) + ':'
            + pad(mmDatetime.minutes()) + ':'
            + pad(mmDatetime.seconds());
    }
    return localIsoString;
}

function formatDate(date, format) {
    if (format) {
        // LL -> moment: yy/mm/dd -> YY/MM/DD
        format = format.replace(/y/g, "Y")
            .replace(/m/g, "M")
            .replace(/d/g, "D");
        return date ? moment(date)
            .format(format) : "";
    }
    return formatFriendlyDate(date);
}

function formatTime(date) {
    return formatFriendlyTime();
}

function formatDateTime(date) {
    return formatFriendlyDateTime(date);
}

function formatExactDate(date) {
    return date ? moment(date)
        .format('L') : "";
}

function formatExactTime(date) {
    return date ? moment(date)
        .format('LT') : "";
}

function formatExactDateTime(date) {
    return date ? moment(date)
        .format('L LT') : "";
}

function formatFriendlyDate(date) {
    return date ? moment(date)
        .format('L H:mm') : "";
}

function formatFriendlyDateTime(date) {
    return date ? moment(date)
        .format('L H:mm') : "";
}

function formatMemberName(member) {
    if (!member) {
        return "";
    }
    if (_.isNumber(member) || _.isString(member)) {
        return member.toString();
    }
    if (isBackbone(member)) {
        member = member.attributes;
    }
    var firstName = member.first_name,
        lastName = member.last_name,
        middleName = member.middle_name,
        name;
    if (firstName) {
        if (middleName) {
            name = _.str.sformat(lang.ColumnMemberName3, lastName, firstName,
                middleName);
        } else {
            name = _.str.sformat(lang.ColumnMemberName2, lastName, firstName);
        }
    } else {
        name = lastName;
    }
    return name || member.name || member.id && member.id.toString() || "";
}

var escapeHtmlHelper = $("<p></p>");

function escapeHtml(text, preserveLineBreaks) {
    // There's no HTML escaping function which would return a text to be
    // concatenated with the rest of the raw HTML markup so that the text
    // value would be the same and not interpreted as HTML markup.
    // Let's use an artificial DOM element for this, wrapped with jQuery.
    var html = escapeHtmlHelper.text(text)
        .html();
    if (preserveLineBreaks) {
        html = html.replace(/\r?\n/g, "\r\n<br>");
    }
    return html;
}

function getReadableFileSizeString(fileSizeInBytes) {

    if (fileSizeInBytes == 0) {
        return '0 kB';
    }
    var i = -1;
    var byteUnits = [' KB', ' MB', ' GB', ' TB', 'PB', 'EB', 'ZB', 'YB'];
    do {
        fileSizeInBytes = fileSizeInBytes / 1024;
        i++;
    } while (fileSizeInBytes > 1024);

    return Math.max(fileSizeInBytes, 0.1)
            .toFixed(1) + byteUnits[i];
}

function isBackbone(value) {
    // descendant of Backbone.Events
    return value && value.once;
}

function isPlaceholder(value) {
    // string selector, DOM object or jQuery object
    return value && (_.isString(value) || isElement(value) ||
        value.insertAfter);
}

//Returns true if it is a DOM element
function isElement(o) {
    return (
        typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
        o && typeof o === "object" && o !== null && o.nodeType === 1 &&
        typeof o.nodeName === "string"
    );
}

base = {
    version: '1.0',
    parseDate: parseDate,
    stringifyDate: stringifyDate,
    dateToLocalIsoString: dateToLocalIsoString,
    formatDate: formatDate,
    formatTime: formatTime,
    formatDateTime: formatDateTime,
    formatExactDate: formatExactDate,
    formatExactTime: formatExactTime,
    formatExactDateTime: formatExactDateTime,
    formatFriendlyDate: formatFriendlyDate,
    formatFriendlyDateTime: formatFriendlyDateTime,

    formatMemberName: formatMemberName,

    escapeHtml: escapeHtml,
    getReadableFileSizeString: getReadableFileSizeString,
    isBackbone: isBackbone,
    isPlaceholder: isPlaceholder,
    UAPI: UAPI,
    NodeTypes: NodeTypes

};