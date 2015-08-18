
package com.opentext.ecm.otsync.http;

import com.opentext.ecm.otsync.ContentServerService;
import com.opentext.ecm.otsync.SettingsService;

public class ContentServerURL {

    private static final String DIRECTORY_TRAVERSAL_STRING = "/..";
    private final String url;

    public ContentServerURL(String newURL) {
        if (newURL == null || newURL.isEmpty()) {
            url = "";
        } else {
            url = buildAbsoluteURL(newURL);
        }
    }

    public String getURL() {
        return url;
    }

    public boolean isValid() {
        String checkURL = url;
        String[] whitelist = getSettingService().getValidURLWhiteList();
        boolean validURL = false;

        //confirm that the url is for the known Content Server
        if (checkURL.startsWith(getSettingService().getContentServerBaseUrl())) {
            //remove the validated substring
            checkURL = url.substring(getSettingService().getContentServerBaseUrl().length());
        } else {
            return false;
        }

        //remove the relative URL if present
        if (checkURL.startsWith(getSettingService().getContentServerRelativeURL())) {
            checkURL = checkURL.substring(getSettingService().getContentServerRelativeURL().length());
        }

        //confirm that the URL is for an authorized request type
        for (String white : whitelist) {
            if (white.trim().length() > 0 && checkURL.startsWith(white.trim())) {
                validURL = true;
                break;
            }
        }

        if (checkURL.contains(DIRECTORY_TRAVERSAL_STRING)) {
            validURL = false;
        }

        return validURL;
    }

    private String buildAbsoluteURL(String url) {
        String result = url;

        if (!result.contains("://")) {
            //if url doesn't start with a /
            String contentServerBaseUrl = getSettingService().getContentServerBaseUrl();
            String contentServerRelativeURL = getSettingService().getContentServerRelativeURL();

            if (!result.startsWith("/")) {
                //check to see if the url doesnt contain the relative path of content server
                if (!result.contains(contentServerRelativeURL)) {
                    //if it doesn't contain a ?
                    if (!result.contains("?"))
                        //append the relative url and the ?
                        result = contentServerBaseUrl + contentServerRelativeURL + "?" + result;
                    else {
                        //if we are starving with a ? just append the relative url
                        if (result.startsWith("?"))
                            result = contentServerBaseUrl + contentServerRelativeURL + result;
                        else {
                            //if it doesn't start with a ? just get the substring of the url after the ? and including ?
                            result = result.substring(result.indexOf('?'));
                            //append the relative url
                            result = contentServerBaseUrl + contentServerRelativeURL + result;
                        }
                    }
                } else {
                    //if it already contains the relative cs url then just append the / and the content server url
                    result = "/" + result;
                    result = contentServerBaseUrl + result;
                }
            } else {
                //if the url starts with a /
                //check to see if it has the relative url of CS
                if (!result.contains(contentServerRelativeURL)) {
                    //if url contains a ? just get the substring that occurs starting with ? and after
                    if (result.contains("?")) {
                        result = result.substring(url.indexOf('?'));
                        //append the relative url
                        result = contentServerBaseUrl + contentServerRelativeURL + result;
                    } else // just append (used for relative pulse photo urls)
                        result = contentServerBaseUrl + result;
                } else //then just append
                    result = contentServerBaseUrl + result;
            }
        }

        return result;
    }

    private SettingsService getSettingService() {
        return ContentServerService.getSettingsService();
    }
}
