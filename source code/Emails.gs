var banner = "\n\nYours Truly,\n\tIllinois Tech Relationships as a Service"
    +"\n\nThank you for using Illinois Tech Relationships as a Service (RaaS). "
    +"Feel free to reach out to us on Instagram @iit.relationships or email us "
    +"at iitrelationships@gmail.com with any questions or concerns.\n\n"
    +"This is an automated email generated via Google apps script. Please do not reply. "
    +"If you are no longer interested in this service, email "
    +"iitrelationships@gmail.com to unsubscribe.";
var options = {
    "from": "iitrelationships@gmail.com",
    "name": "IIT RaaS"
  };

function sendWelcomeEmail(email, form) {
  console.log("Sending welcome email to "+email+" with form id "+form.getId());

  var url = form.getPublishedUrl();

  var subject = "Welcome to RaaS";
  var body = "Welcome to Illinois Institute of Technology Relationships as a Service (RaaS)!\n\n"
      +"Submit all your “likes” and “dislikes” for potential relationship candidates through the "
      +"following form: "+url+"\n"
      +"This form will be updated as more candidates appear.";
  sendEmail(email, subject, body);
}

function sendConfirmErrorEmail(email) {
  // we'll be running this off of an account in the iit domain
  // so we can restrict form responses to iit users => this function is unnecessary
  // it's a remnant of older implementation
  // and a failsafe in case OTS gets mad at me for using my hawk account (which they shouldn't)
  // TODO: implement
}

function sendNewCandidatesEmail(email, form) {
  console.log("Sending new candidates email to "+email+" with form id "+form.getId());

  var url = form.getPublishedUrl();

  var subject = "New Potential Matches";
  var body = "You have new relationship candidates awaiting your approval! "
      +"To view them, open your designated form. As a reminder, your unique "
      +"link for submitting your “likes” and “dislikes” is "+url;
  sendEmail(email, subject, body);
}

function sendMatchEmail(email, types, discord) {
  console.log("Emailing "+email+" discord link "+discord+" and types "+types);

  var subject = "You Have a Match!";
  var body = "Congratulations, you have a match!\n\n"
      +"You matched with someone for the following criteria: "+types+".\n\n"
      +"Message your match on discord at https://discordapp.com/users/"+encodeURI(discord)+"/ or friend request Discord tag "+discord;
  sendEmail(email, subject, body);
}

function sendEmail(email, subject, body) {
  GmailApp.sendEmail(email, subject, body+banner, options);
}