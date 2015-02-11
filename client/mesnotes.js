//var Notes = new Mongo.Collection("notes");
var Notes = new Mongo.Collection("notes");
if (Meteor.isClient) {

  Template.body.helpers({
    checkEditMode : function(status){
      return Session.get("editMode") ===  status;
    },

    editMode : function(){
      return Session.get("editMode");
    },
    notes: function () {
      return Notes.find({});
    }
  });

  Template.body.events({
    'click a.makeNewNote' : function(e, template){
      Session.set("editMode", "edit");
      return false;
    },
    'click .showNodes' : function(){
      Session.set("editMode", "notes");
      return false;
    },
    'click .glyphicon-remove' : function(e, template){
      Session.set("editMode", "notes");
      Notes.remove({_id:$(e.target).parent().data("id")});
      return false;
    },

    'click .login' : function(e){
      Session.set("editMode", "login");
    }
  });


  Template.newnote.events({
    'click .ajouter' : function(event, template){

      Meteor.call('addNote',
         template.find(".title").value, 
         template.find(".description").value, 
        function (error, result) {
          if (error) {
            alert(error);
          } else {
            Session.set("editMode", "notes");
          }
        });
/*
      Notes.insert({
        subject : template.find(".title").value,
        description : template.find(".description").value,
        createdAt : new Date()
      });

      Session.set("editMode", false);
*/
      return false;
    }
  });

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
