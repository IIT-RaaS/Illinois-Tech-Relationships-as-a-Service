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

### Implementation
Languages: Google Apps Script, JavaScript
##### Service Setup:
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
##### Removing a User:
To remove a user manually from the service, you (the developer) must do each of the following:
* open the sign-up form and delete the user's response
* delete the row corresponding to the user's response in the sign-up form spreadsheet
* delete the row corresponding to the user's hawk ID in the "Serviced Users" spreadsheet
* delete the folder with the user's hawk ID in "Matching Forms"

In the event of a user submitting incorrect data, remove the user entirely using the above procedure and ask them to resubmit the form
##### Changes Since v1:
* closed sign-up form during processing (removes potential bugs for if another user signs up during processing)
* updated code to support deprecated Rhino interpreter (JavaScript ES5)
  * Google Apps Script has a bug in its latest runtime ⇒ if one form submit trigger attempts to create another, it will be disabled
  * this is fixed by running on older runtime (Rhino) that didn't have this bug
* added setRequireLogin(false) for matching (like/dislike) forms
* added debugging (console.log) statements
* created privacy policy and added to sign-up form
##### Potential Bugs:
* two users submit likes/dislikes for each other within 10 seconds ⇒ two triggers might simultaneously modify same spreadsheet
  * note: this is a theoretical error, and in all the tests I conducted, submitting the two forms simultaneously functioned as intended
  * workaround: (see note) I expect this to be very rare, so if I get a script error, I'll manually add the users back to each other's candidates lists
  * future development: implement a form execution queue (this will be extremely difficult with multiple copies of same script)
* fail to read from serviced users spreadsheet within 30 secs
  * workaround: I expect this to be very rare, so if I get a script error, I'll delete the last user in Serviced Users spreadsheet and manually rerun main in Sign Ups.gs. The script currently skips that user on subsequent runs if it encounters this error
