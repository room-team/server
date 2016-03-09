Sensors = new Mongo.Collection("sensors");
Rooms = new Mongo.Collection("rooms");
Accounts = Meteor.users;


if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault('counter', 0);

  Template.hello.helpers({
    counter: function () {
      return Session.get('counter');
    }
  });

  Template.hello.events({
    'click button': function () {
      // increment the counter when button is clicked
      Session.set('counter', Session.get('counter') + 1);
    }
  });
}
//ROom colectino
//sensor collection
if (Meteor.isServer) {
  Accounts.onCreateUser(function(options, user) {
      //pass the surname in the options

      user.profile.room = options.room;

      return user;
  });

  Meteor.startup(function () {

    // code to run on server at startup
    Meteor.method("add_sensor", function (username, password, room_id) {
      var options = {
        username: username,
        password: password,
        room: room_id
      };

      Accounts.createUser(options, function(err) {
        return err;
      });
    }, {
      url: "add_sensor",
      httpMethod: "post",
      getArgsFromRequest: function (request) {
        // Let's say we want this function to accept a form-encoded request with 
        // fields named `a` and `b`. 
        var content = request.body;
        var password = content.password;
        var username = content.username;
        var room_id = content.room_id;

        // Since form enconding doesn't distinguish numbers and strings, we need 
        // to parse it manually 
        return [ password, username, room_id ];
      }
    });

    Meteor.publish("rooms_avalailable", function (index) {
      return Widgets.find({index: {$gt: parseInt(index, 10)}});
    }, {
      url: "rooms_avalailable",
      httpMethod: "get"
    });
    Meteor.publish("room_status", function (index) {
      return Widgets.find({index: {$gt: parseInt(index, 10)}});
    }, {
      url: "room_status",
      httpMethod: "post",
      getArgsFromRequest: function (request) {
        // Let's say we want this function to accept a form-encoded request with 
        // fields named `a` and `b`. 
        var content = request.body;
      
        // Since form enconding doesn't distinguish numbers and strings, we need 
        // to parse it manually 
        return [ parseInt(content.a, 10), parseInt(content.b, 10) ];
      }
    });
  });
}
