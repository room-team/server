Rooms = new Mongo.Collection('Rooms');
var labbieRoom = 8;
var num_rooms = 12;

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
  //  initialize rooms to be vacant
  Meteor.startup(function () {
    for (i = 1; i <= num_rooms; i++) {
      if(i == labbieRoom) {
        Rooms.upsert({
          id : i
        }, {
          $set: {
            status: 'labbie'
          }
        });
      } else {
        Rooms.upsert({
          id : i
        }, {
          $set: {
            status: 'vacant'
          }
        });
      }
    }

    Meteor.methods({
      'accounts.newUser'(username, password, roomId) {
        if (roomId == labbieRoom) {
          throw new Meteor.Error('you cannot register as the labbie room');
        }
        if(Meteor.users.findOne({'profile.room': roomId}) != null) {
          throw new Meteor.Error('that room is already has a sensor');
        }
        return Accounts.createUser({
          'username': username,
          'password': password,
          'profile': {'room':roomId}
        });
      },
      'accounts.setRoom'(roomId) {
        if (! Meteor.userId()) {
          throw new Meteor.Error('not-authorized');
        }
        if (roomId == labbieRoom) {
          throw new Meteor.Error('you cannot register as the labbie room');
        }
        if(Meteor.users.findOne({'profile.room': roomId}) == null)
          Meteor.users.update(Meteor.userId(), {$set: {profile: {room: roomId}}});
        return roomId;
      },
      'rooms.getAvailable'() {
        var result = [];
        for (i = 1; i <= num_rooms; i++) {
          if(i != labbieRoom && Meteor.users.findOne({'profile.room': i}) == null)
            result.push(i);
        }
        return result;
      },
      'rooms.setStatus'(status) {
        if (! Meteor.userId()) {
          throw new Meteor.Error('not-authorized');
        }
        if((status == 0 || status == 1) && Meteor.user().profile.room != null) {
          var text_status = status == 1 ? 'vacant' : 'occupied';
          Rooms.update({id: Meteor.user().profile.room}, { $set: {'status': text_status} });
          return text_status;
        }
        else
          throw new Meteor.Error('incorrect status');
      },
    });
  });
}
