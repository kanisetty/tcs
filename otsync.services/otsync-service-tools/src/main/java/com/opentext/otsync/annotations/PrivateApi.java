package com.opentext.otsync.annotations;

import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;

/**
 * Annotate root resource classes or methods with this annotation to prevent swagger doc being generated for them. 
 *
 */
@Retention(RetentionPolicy.RUNTIME)
public @interface PrivateApi {

}
