Sensors = new Mongo.Collection("sensors");
Rooms = new Mongo.Collection("rooms");

if (Meteor.isClient) {
  Template.rooms.helpers({
    room: function () { 
      return Rooms.find({});
    }
  });
}

//Room colection
//sensor collection
if (Meteor.isServer) {
  Meteor.startup(function () {
    Accounts.onCreateUser(function(options, user) {
        user.profile['room'] = options.room;
        return user;
    });

    Meteor.methods({
      'accounts.newUser'(username, password, roomId) {
        check(username, String);
        check(password, String);
        check(roomId, Integer);
        Accounts.createUser({
          'username': username,
          'password': password,
          'profile': {'room':roomId}
        });
      },
      'accounts.setRoom'(text) {
        check(text, Integer);
        if (! Meteor.userId()) {
          throw new Meteor.Error('not-authorized');
        }
        //TODO write if to make sure that the room is available
        Accounts.update(Meteor.userId(), {$set: {profile: {room: text}}});
      },
      'rooms.setStatus'(status) {
        check(status, Integer);
        if (! Meteor.userId()) {
          throw new Meteor.Error('not-authorized');
        }
        if((status == 0 || status == 1) && Meteor.user().profile.room != null)
          Rooms.update({_id: Meteor.user().profile.room}, { $set: {'status': status} });
        else
          throw new Meteor.Error('incorrect status');
      },
    });
  });
}
