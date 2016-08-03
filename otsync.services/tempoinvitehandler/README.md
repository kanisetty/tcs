# Tempo Invite Handler 16.0.1 Release Notes

There were some changes to the release handler in 16.0.1, due to the AppWorks 16 model of service interaction.
Direct access to the database and supporting OTDS instance were removed.

This service now creates a set of configuration settings via the AppWorks SDK.
These can be set via the AppWorks Gateway administration UI.

Db settings include
- username
- password
- jdbc URL

OTDS settings include
- external user partition name
- OTDS admin user username
- OTDS admin user password

## Provisioning the required resources

The invite handler database and OTDS resources must be provisioned before installing the service.

### Database

The database you are entering the details for must obviously exist before deploying the service, and the JDBC driver Jar required for your db type should be placed in the /lib folder of the Tomcat instance hosting the AppWorks Gateway.

The following are some examples of JDBC URLs
- Postgres - jdbc:postgresql://localhost:5432/gateway
- Oracle - jdbc:oracle:thin:@//localhost:1521/gateway
- SQL Server - jdbc:sqlserver://localhost:1433;databaseName=gateway

### OTDS

The OTDS administrator credentials you must provide also give you access to the OTDS administration UI.
The following administration tasks must be performed in that UI to setup the external user access.

#### Create external users partition

From the main view
- select the `Partitions` section via the left nav
- using the `+ Add` button at the top of the `Partitions` view create a `New Non-synchronized User Partition`
- fill out the name (we wil use in our service settings), a description and use the `Save` button present on that row

#### Provide Gateway Access

We want external users to be able to login via the Gateway (mobile client, etc.) so need to configure OTDS to allow this.

From the main view
- select the `Access Roles` section via the left nav
- in the `Access Roles` view locate the AppWorks Gateway role, usually named `Access to OTAG` or similar, and use the `Actions` link
- on the `Actions` context menu select `View Acces Role Details`
- in the `View Access Role Details` view click `Add`, find your external users partition, check the check box and use the `Add Selected Items to Access Role` button
- use the `Close Dialog` button to return to the `Access Role Details` view
- be sure to hit the `Save` button in this view else your changes will not be persisted

### Restricting app access

 We probably do not want our external users to have access to all apps so will want to make use of the AppWorks Gateways audience features. We can restrict the audience on a per-app basis using OTDS user ids, groups and partitions.  In general we should do this for all available apps to ensure we have the correct level of access.

 #### Configuring access per app

 - in the Gateway administration UI go to the `Apps` page via the left nav
 - for a given app tile use the cog button to view the apps settings
 - select the `Audience` tab, and then the `User/Group/Partition Audience`
 - uncheck the `Available to all users` checkbox removing general access
 - then search for the partitions/groups/users you do want provide access to (excluding our external users partition), checking the box and hitting the `Save` button for each

Now the external users should not have access to the app.

NOTE! `Runtime` specific audiences can also be setup in this area of the apps settings.
