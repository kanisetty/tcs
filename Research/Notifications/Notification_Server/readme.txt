To run this application, follow these steps:

1. Retrieve this project from the git repo
2. Download and install NodeJS: https://nodejs.org/
3. Download and install MongoDB: https://www.mongodb.org/

4. In command prompt or equivalent console, navigate to project root folder: ~\awc.research\Notifications\Notification_Server
5. Type "npm install". Node will obtain all packages described in package.json

6. Run MongoDB in command prompt or equivalent console, see launchDb.bat contents for default binary executable
6a. You will likely need to create MongoDB's storage folder, default is C:\data\db, or you can run the executable with a parameter pointing to a folder

7. Run the Notification Server application by typing "node server.js" (see step 4 for location in cmd)