package com.opentext.otsync.dcs.appworks;

import com.opentext.otag.service.context.components.AWComponent;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

public interface ContentServerURLProvider extends AWComponent {

    Log LOG = LogFactory.getLog(ContentServerURLProvider.class);

    String getContentServerUrl();


}
