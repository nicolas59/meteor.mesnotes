;(function () {
  "use strict";


////////////////////////////////////////////////////////////////////
// Patches
//
if (!console || !console.log) {
// stub for IE
console = {
  log: function (msg) {
    $('#log').append(msg)
  }
};
}
////////////////////////////////////////////////////////////////////
// Startup
//
Meteor.startup(function () {

  Meteor.secrets = new Meteor.Collection('secrets');
  Meteor.Notes = new Mongo.Collection("notes");

////////////////////////////////////////////////////////////////////
// Create Test Secrets
//
if (Meteor.secrets.find().fetch().length === 0) {
  Meteor.secrets.insert({secret:"ec2 password: apple2"});
  Meteor.secrets.insert({secret:"domain registration pw: apple3"});
}
////////////////////////////////////////////////////////////////////
// Create Test Users
//
if (Meteor.users.find().fetch().length === 0) {
  console.log('Creating users: ');
  var users = [
  {name:"nrousseau",email:"nicolas.rousseau1@gmail.com",roles:['admin']}
  ];
  _.each(users, function (userData) {
    var id,
    user;
    console.log(userData);
    id = Accounts.createUser({
      email: userData.email,
      password: "test",
      profile: { name: userData.name }
    });
// email verification
Meteor.users.update({_id: id}, {$set:{'emails.0.verified': true}});
Roles.addUsersToRoles(id, userData.roles);
});
}
////////////////////////////////////////////////////////////////////
// Prevent non-authorized users from creating new users
//
Accounts.validateNewUser(function (user) {
  var loggedInUser = Meteor.user();
  if (Roles.userIsInRole(loggedInUser, ['admin','manage-users'])) {
    return true;
  }
  throw new Meteor.Error(403, "Not authorized to create new users");
});
});
////////////////////////////////////////////////////////////////////
// Publish
//
// Authorized users can view secrets
Meteor.publish("secrets", function () {
  var user = Meteor.users.findOne({_id:this.userId});
  if (Roles.userIsInRole(user, ["admin","view-secrets"])) {
    return Meteor.secrets.find();
  }
  this.stop();
  return;
});
// Authorized users can manage user accounts
Meteor.publish("users", function () {
  var user = Meteor.users.findOne({_id:this.userId});
  if (Roles.userIsInRole(user, ["admin","manage-users"])) {
    return Meteor.users.find({}, {fields: {emails: 1, profile: 1, roles: 1}});
  }
  this.stop();
  return;
});





Meteor.methods({
 
/**
* Permet d'ajouter une note
*/
 addNote: function (title, description) {
    // Check argument types
    check(title, String);
    check(description, String);

    if (! this.userId) {
      throw new Meteor.Error("not-logged-in",
        "Must be logged in to post a comment.");
    }
    console.log(Meteor.Notes);
console.log(Meteor.Notes.find().fetch());
    Meteor.Notes.insert({
      subject : title,
      description : description,
      createdAt : new Date()
    });
  
    return true;
  },
  doLogin: function (username, password) {
    // Check argument types
    check(username, String);
    check(password, String);

    var user = Meteor.users.findOne({profile :{name:username}});
    
    console.log('Result : ', Accounts._checkPassword(user, password));
    console.log(Meteor.users.find().fetch());
    if(typeof(user)!=="undefined"
       && user!=null){
      this.userId = user._id;
    }else{
      throw new Meteor.Error("not-logged-in",
        "Identifiant ou mot de passe incorrect");    
    }
  }
})

}());