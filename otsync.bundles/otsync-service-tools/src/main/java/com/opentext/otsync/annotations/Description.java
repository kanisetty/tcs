package com.opentext.otsync.annotations;

import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;

/**
 * Use on a jax-rs resource class, method, or parameter to add a swagger-doc description.
 *
 * On methods, the value parameter sets the "description" field for all operations on a path, and should be the
 * same for each verb on the path. Summary and notes are per-operation, and only apply to methods, not classes or params.
 *
 */
@Retention(RetentionPolicy.RUNTIME)
public @interface Description {
    String value();
    String summary() default "";
    String notes() default "";
}
