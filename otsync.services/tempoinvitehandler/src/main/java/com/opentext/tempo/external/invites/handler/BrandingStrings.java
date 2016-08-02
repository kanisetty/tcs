package com.opentext.tempo.external.invites.handler;

import java.util.ResourceBundle;

/**
 * Used in XML generated for our XSL based UI.
 */
public class BrandingStrings {

    public static final String BRANDING_DATA = "BrandingStrings";

    private static String productName;
    private static String companyName;
    private static String shortProductName;

    public static String getProductName() {
        if (productName == null)
            productName = getBrandingData("productName");
        return productName;
    }

    public static String getShortProductName() {
        if (shortProductName == null)
            shortProductName = getBrandingData("shortProductName");
        return shortProductName;
    }

    public static String getCompanyName() {
        if (companyName == null)
            companyName = getBrandingData("companyName");
        return companyName;
    }

    private static String getBrandingData(String propertyName) {
        return ResourceBundle.getBundle(BRANDING_DATA).getString(propertyName);
    }

}
