 Template.login.events({
    'click .seconnecter' : function(event, template){
        var username = template.find("input[name='identifiant']").value;
        var pwd = template.find("input[name='password']").value;
      
        Meteor.call('doLogin',
          username, pwd, 
         function (error, result) {
          if (error) {
            alert(error);
          } else {
            alert(result);
          }
        });
     }
   }
)