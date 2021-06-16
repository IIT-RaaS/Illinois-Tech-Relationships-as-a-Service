# Illinois Tech Relationships as a Service (RaaS)
A proposed friendships/dating service for use by Illinois Institute of Technology students

### User Scenarios

The service will be created to meet the requirements provided in the following user scenarios:
1. As an end user, I would like to be able to sign up for the service anonymously, specifying my gender and preferred gender, so that I may view and connect with other potential friends/dating/sex partners at IIT without knowledge of my participation in the service or lack thereof being compromised.
2. As an end user, I would like to be able to view potential friends/dating/sex partners and anonymously either "like" them or "dislike" them, so that I may find someone who shares my attitudes toward our potential relationship and interest to engage in one, defined as a "match", without knowledge of my interest in individuals or lack thereof being compromised.
3. As an end user, I would like to be able to anonymously communicate with individuals designated as "matches", so that I may ensure their credibility as individuals and decide on a day/time to further development of our relationship in person, with highly probable cause that my correspondent shares my attitudes toward our relationship and interest to engage in one.

### Model and Service Usage Description
A publicly available form will be shared on the iit.confessions and iit.relationships Instagram pages at the launch date of the service. This form will allow you to sign up for the service, specifying your personal gender, preferred gender of your friends/dating/sexual partners, link to Instagram or other account for photos, and personal email for correspondence. In addition, to ensure that no one fills out this form on behalf of another person, thus creating false matches, the form will require you to be signed in to your Hawk Gmail account. However, this is solely to verify your identity, and this service will not in any way be associated with your Hawk account nor will you be sent emails on that account. If you do not feel comfortable using your Hawk Gmail account, you are welcome to reach out to us for alternative verification options by sending a direct message to iit.relationships on Instagram.

After a set time interval (which will probably start out as a couple weeks but shorten upon our service gaining popularity), you will receive an automatically-generated message via personal email providing you with friends/dating/sex partner options for you to "like" or "dislike" according to the relationship type criteria you've selected, including whether you fancy them sexually or not. In addition, some of the options will be of people with public profiles who did not sign up for the service in order to ensure that people cannot simply sign up to view who's using the service. In other words, your signing up for the service remains completely anonymous, even to us developers as all correspondence will be automated.

Upon matching with someone, defined as "you liking them" and "them liking you back" mutually under any criteria, you will each be provided with the other's Discord tag, allowing you to message them directly, and the relationship type criteria upon which you mutually "liked" each other. However, you will not be told which match you're messaging, only that you're messaging someone you've matched with. This significantly diminishes the likelihood of someone "liking" all potential friends/dating/sex partners just for the sake of knowing who likes them back by requiring them to carry on a conversation if they take you seriously. Finally, when you feel comfortable, you can reveal your identities to each other through Discord messages and decide on a time and location to meet in person.

At any given time, the only people with potential to access the information you provide will be the two students at the Illinois Institute of Technology who have developed this service, and we assure you that we will not view or use this information for personal gain. We don't have the incentive to, and our putting time into setting up this service should indicate to you that we'd like to remain as trustworthy as possible to encourage its use. We will not have access to your personal messages with matches, as these will be on Discord, which encrypts all data-in-transit.

### Implementation
Languages: Google Apps Script, Javascript
##### Service Setup:
1. create an alias (iitrelationships@gmail.com) for your hawk account (...@hawk.iit.edu)
2. create two folders: "Matching Forms" and "Sign-Up Form"
3. place sign-up form in the Sign-Up Form folder and create a spreadsheet for responses (with default name)
    1. restrict sign-up form to users of specific domain (iit.edu)
4. in the Sign-Up Form folder, create a spreadsheet titled "Serviced Users"
5. in Retrieve Folders/Files.gs, run getFolderIdHelper, getSpreadsheetIdHelper, and getSignUpFormIdHelper and update global id variables
6. create a copy of the script for every suspected 19 users (20 triggers per script - 1 for sign-up form)
7. in each copy, in Triggers.gs, change the conditional in onSignUp to service 19 users
8. create one fake sign-up
    1. in each script copy, in Sign Ups.gs, run main to authorize script with necessary permissions
    2. remove the fake sign-up from the form and delete row from responses spreadsheet
    3. delete any folders in the "Matching Forms" folder
##### Potential Bugs:
* two users submit likes/dislikes for each other within 10 seconds ⇒ two triggers might simultaneously modify same spreadsheet
  * workaround: I expect this to be very rare, so if I get a script error, I'll manually add the users back to each other's candidates lists
  * future development: implement a form execution queue (this will be extremely difficult with multiple copies of same script)
* fail to read from serviced users spreadsheet within 30 secs
  * workaround: I expect this to be very rare, so if I get a script error, I'll delete the last user in Serviced Users spreadsheet
and manually rerun main in Sign Ups.gs. The script currently skips that user on subsequent runs if it encounters this error
