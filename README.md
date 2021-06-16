# Illinois Tech Relationships as a Service (RaaS)
A proposed friendships/dating service for use by Illinois Institute of Technology students

Service Setup:
0. create an alias (iitrelationships@gmail.com) for your hawk account (...@hawk.iit.edu)
1. create two folders: "Matching Forms" and "Sign-Up Form"
2. place sign-up form in the Sign-Up Form folder and create a spreadsheet for responses (with default name)
  i. restrict sign-up form to users of specific domain (iit.edu)
3. in the Sign-Up Form folder, create a spreadsheet titled "Serviced Users"
4. in Retrieve Folders/Files.gs, run getFolderIdHelper, getSpreadsheetIdHelper, and getSignUpFormIdHelper and update global id variables
5. create a copy of the script for every suspected 19 users (20 triggers per script - 1 for sign-up form)
6. in each copy, in Triggers.gs, change the conditional in onSignUp to service 19 users
7. create one fake sign-up
  i. in each script copy, in Sign Ups.gs, run main to authorize script with necessary permissions
  ii. remove the fake sign-up from the form and delete row from responses spreadsheet
  iii. delete any folders in the "Matching Forms" folder

Potential Bugs:
* two users submit likes/dislikes for each other within 10 seconds => two scripts might simultaneously access same spreadsheet
  * workaround: I expect this to be very rare, so if I get a script error, I'll manually add the users back to each other's candidates lists
  * future development: implement a form execution queue (this will be extremely difficult with multiple copies of same script)
* fail to read from serviced users spreadsheet within 30 secs
  * workaround: I expect this to be very rare, so if I get a script error, I'll delete the last user in Serviced Users spreadsheet
and manually rerun main in Sign Ups.gs
