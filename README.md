# Illinois Tech Relationships as a Service (RaaS)
A proposed friendships/dating service for use by Illinois Institute of Technology students

### User Scenarios

The service will be created to meet the requirements provided in the following user scenarios:
1. As an end user, I would like to be able to sign up for the service anonymously, specifying my gender and preferred gender, so that I may view and connect with other potential friends/dating/sex partners at IIT without knowledge of my participation in the service or lack thereof being compromised.
2. As an end user, I would like to be able to view potential friends/dating/sex partners and anonymously either "like" them or "dislike" them, so that I may find someone who shares my attitudes toward our potential relationship and interest to engage in one, defined as a "match", without knowledge of my interest in individuals or lack thereof being compromised.
3. As an end user, I would like to be able to anonymously communicate with individuals designated as "matches", so that I may ensure their credibility as individuals and decide on a day/time to further development of our relationship in person, with highly probable cause that my correspondent shares my attitudes toward our relationship and interest to engage in one.

### Model and Service Usage Description
A publicly available form will be shared on the iit.confessions and iit.relationships Instagram pages at the launch date of the service. This form will allow you to sign up for the service, specifying your personal gender, preferred gender of your friends/dating/sex partners, link to Instagram or other account for photos, and personal email for correspondence. In addition, to ensure that no one fills out this form on behalf of another person, thus creating false matches, the form will require you to be signed in to your Hawk Gmail account. However, this is solely to verify your identity, and this service will not in any way be associated with your Hawk account nor will you be sent emails on that account. If you do not feel comfortable using your Hawk Gmail account, you are welcome to reach out to us for alternative verification options by sending a direct message to iit.relationships on Instagram or emailing us at iitrelationships@gmail.com.

Within a few minutes after filling out this form, you will receive an automatically-generated message via personal email providing you with friends/dating/sex partner options for you to "like" or "dislike" according to the relationship type criteria you've selected, including whether you fancy them sexually or not. In addition, some of the options will be of people with public profiles who did not sign up for the service in order to ensure that people cannot simply sign up to view who's using the service. In other words, your signing up for the service remains completely anonymous, even to us developers as all correspondence will be automated.

Upon matching with someone, defined as "you liking them" and "them liking you back" mutually under any criteria, you will each be provided with the other's Discord tag, allowing you to message them directly, and the relationship type criteria upon which you mutually "liked" each other. However, you will not be told which match you're messaging, only that you're messaging someone you've matched with. This significantly diminishes the likelihood of someone "liking" all potential friends/dating/sex partners just for the sake of knowing who likes them back by requiring them to carry on a conversation if they take you seriously. Finally, when you feel comfortable, you can reveal your identities to each other through Discord messages and decide on a time and location to meet in person.

At any given time, the only people with potential to access the information you provide will be the two students at the Illinois Institute of Technology who have developed this service, and we assure you that we will not view or use this information for personal gain. We don't have the incentive to, and our putting time into setting up this service should indicate to you that we'd like to remain as trustworthy as possible to encourage its use. We will not have access to your personal messages with matches, as these will be on Discord, which encrypts all data-in-transit.

Please refer to our [Privacy Policy](/Privacy%20Policy.md) for further information on how your data is processed and safeguarded as well as for procedures on how to modify your submissions. Reach out to us on Instagram @iit.relationships or email us at iitrelationships@gmail.com with questions or concerns at any time.

### Implementation
Languages: Google Apps Script, JavaScript
#### Service Setup
1. create an alias (iitrelationships@gmail.com) for your hawk account (...@hawk.iit.edu)
2. create two folders: "Matching Forms" and "Sign-Up Form"
3. place sign-up form in the Sign-Up Form folder and create a spreadsheet for responses (with default name)
    1. restrict sign-up form to users of specific domain (iit.edu)
4. in the Sign-Up Form folder, create a spreadsheet titled "Serviced Users"
5. in Retrieve Folders and Files.gs,
    1. finish implementation for getBaseIdHelper
    2. run getBaseIdHelper to obtain base ID of the folder containing the service and update the base_id global variable
    3. run runIdHelpers and update all other global variables accordingly
6. create a copy of the script for every suspected 19 users (20 triggers per script - 1 for sign-up form)
7. in each copy, in general settings, uncheck "Enable Chrome V8 runtime" (see changes since version 1 below)
8. in each copy, in Triggers.gs,
    1. change the conditional in onSignUp accordingly to service 19 users
    2. run createSignUpTrigger to link script to sign-up form
    3. authorize the script with necessary permissions
#### Modifying User Information
##### Modifying Sign-Up Information:
1. update user information accordingly on the sign-up form linked spreadsheet
2. remove the trigger associated with the user's existing matching form
3. in Update Matching Form.gs,
    1. change the hawk ID in runUserUpdate to be that of the desired user
    2. run runUserUpdate
##### Modifying Likes/Dislikes:
1. remove the row with likes and dislikes for the corresponding candidate from the "Unmatched" sheet in the user's likes/dislikes responses spreadsheet
2. append the candidate's associated hawk ID and name to the end of the user's candidates spreadsheet
3. perform a likes/dislikes submission on behalf of the user without entering any information (this runs the form update script)

Note: this action can only be performed if the match has not yet been processed. It cannot be performed if the user's likes/dislikes are located in the "Matched" or "Rejected" sheets of the user's likes/dislikes responses spreadsheet.
#### Removing a User
To remove a user manually from the service, you (the developer) must do each of the following:
* open the sign-up form and delete the user's response
* delete the row corresponding to the user's response in the sign-up form spreadsheet
* delete the row corresponding to the user's hawk ID in the "Serviced Users" spreadsheet
* delete the folder with the user's hawk ID in "Matching Forms"
#### Changelog
##### Changes in v2.0:
* closed sign-up form during processing (removes potential bugs for if another user signs up during processing)
* updated code to support deprecated Rhino interpreter (JavaScript ES5)
  * Google Apps Script has a bug in its latest runtime ⇒ if one form submit trigger attempts to create another, it will be disabled
  * this is fixed by running on older runtime (Rhino) that didn't have this bug
* added setRequireLogin(false) for matching (like/dislike) forms
* added debugging (console.log) statements
* created privacy policy and added to sign-up form
##### Changes in v2.1:
* fixed submitted info for wrong candidate bug ⇒ this would occur when user doesn't fill out information for a preceding candidate
  * fix: calculated proper index to read from candidates sheet using ItemResponse.getItem().getIndex()-2/2 in Responses Formatting.gs
##### Changes in v3.0:
* updating relationship types used to be extremely difficult and would compromise anonymity because it required recording the user's already submitted likes/dislikes, removing the user, signing them up again, and filling out matching forms on behalf of other users
  * it can now be accomplished easily using the steps in the "Modifying User Sign-Up Information" section above
### Potential Bugs
1. two users submit likes/dislikes for each other within 10 seconds ⇒ two triggers might simultaneously modify the same spreadsheet
    * note: this is a theoretical error, and in all the tests I conducted, submitting the two forms simultaneously functioned as intended
    * workaround: (see note) I expect this to be very rare, so if I get a script error, I'll manually add the users back to each other's candidates lists
    * future development: implement a form execution queue (this will be extremely difficult if not impossible with multiple copies of same script)
2. fail to read from serviced users spreadsheet within 30 secs
    * note: this occurred once during the early stages of debugging version 1.0 and has not occurred since
    * workaround: (see note) I expect this to be very rare, so if I get a script error, I'll delete the last user in the serviced users spreadsheet and manually rerun main in Sign Ups.gs. The script currently skips that user on subsequent runs if it encounters this error
3. script execution time exceeds Google's daily quota
    * note: this would require a ridiculously large number of form submissions to occur, thus rendering it infeasible and only a theoretical error
    * implications: form submissions would not be processed, new users would be unable to sign up that day, existing users would continue to see the same candidates despite having submitted likes/dislikes
    * workaround: none possible - scripts will resume execution normally the following day
