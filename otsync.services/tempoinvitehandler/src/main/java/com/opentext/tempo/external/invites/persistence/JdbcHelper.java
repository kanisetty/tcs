package com.opentext.tempo.external.invites.persistence;

public class JdbcHelper {

    // we support as many SQL databases as the AppWorks Gateway as we intend to add a schema to their
    // managed RDBMS instance

    private static final String DERBY_JDBC_DRIVER = "org.apache.derby.jdbc.EmbeddedDriver";
    private static final String MYSQL_JDBC_DRIVER = "com.mysql.jdbc.Driver";
    private static final String ORACLE_JDBC_DRIVER = "oracle.jdbc.OracleDriver";
    private static final String POSTGRES_JDBC_DRIVER = "org.postgresql.Driver";
    private static final String HANA_JDBC_DRIVER = "com.sap.db.jdbc.Driver";
    private static final String SQLITE_JDBC_DRIVER = "org.sqlite.JDBC";
    private static final String SQLSERVER_JDBC_DRIVER = "com.microsoft.sqlserver.jdbc.SQLServerDriver";
    private static final String DERBY_CONN_PREFIX = "jdbc:derby";
    private static final String MYSQL_CONN_PREFIX = "jdbc:mysql";
    private static final String ORACLE_CONN_PREFIX = "jdbc:oracle";
    private static final String POSTGRES_CONN_PREFIX = "jdbc:postgresql";
    private static final String HANA_CONN_PREFIX = "jdbc:sap";
    private static final String SQLITE_CONN_PREFIX = "jdbc:sqlite";
    private static final String SQLSERVER_CONN_PREFIX = "jdbc:sqlserver";

    public static String getJdbcDriverFromConnection(String connectionString) {
        String jdbcDriver = "";

        if (connectionString.startsWith(ORACLE_CONN_PREFIX)) {
            jdbcDriver = ORACLE_JDBC_DRIVER;
        } else if (connectionString.startsWith(SQLSERVER_CONN_PREFIX)) {
            jdbcDriver = SQLSERVER_JDBC_DRIVER;
        } else if (connectionString.startsWith(MYSQL_CONN_PREFIX)) {
            jdbcDriver = MYSQL_JDBC_DRIVER;
        } else if (connectionString.startsWith(SQLITE_CONN_PREFIX)) {
            jdbcDriver = SQLITE_JDBC_DRIVER;
        } else if (connectionString.startsWith(DERBY_CONN_PREFIX)) {
            jdbcDriver = DERBY_JDBC_DRIVER;
        } else if (connectionString.startsWith(POSTGRES_CONN_PREFIX)) {
            jdbcDriver = POSTGRES_JDBC_DRIVER;
        } else if (connectionString.startsWith(HANA_CONN_PREFIX)) {
            jdbcDriver = HANA_JDBC_DRIVER;
        }

        return jdbcDriver;
    }

}
