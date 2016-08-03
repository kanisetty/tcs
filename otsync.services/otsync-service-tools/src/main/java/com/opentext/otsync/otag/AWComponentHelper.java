package com.opentext.otsync.otag;

import com.opentext.otag.service.context.components.AWComponent;
import com.opentext.otag.service.context.components.AWComponentContext;

public class AWComponentHelper {

    public static <T extends AWComponent> T getComponent(Class<T> type) {
        try {
            return AWComponentContext.getComponent(type);
        } catch (ClassCastException e) {
            // translate the underlying Exceptions meaning
            throw new RuntimeException("Component of type " + type.getName() + " was not found");
        }
    }

}
