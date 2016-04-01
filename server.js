Sensors = new Mongo.Collection("sensors");
Rooms = new Mongo.Collection("rooms");

if (Meteor.isClient) {

  Template.rooms.helpers({
    rooms: function () {
      return [{active: 'active'}, {active: ''}];
    }
  });
}
//ROom colectino
//sensor collection
if (Meteor.isServer) {
  Meteor.startup(function () {
    JsonRoutes.Middleware.use('/api', JsonRoutes.Middleware.parseBearerToken);
    JsonRoutes.Middleware.use('/api', JsonRoutes.Middleware.authenticateMeteorUserByToken);

    Accounts.onCreateUser(function(options, user) {
        user.profile['room'] = options.room;
        return user;
    });

    JsonRoutes.add("post", "/api/add_sensor/", function (req, res, next) {
      var user = req.user_id,
          room = req.room_id;
      if(user != null){
        Meteor.users.update({_id:user}, { $set: {'room': room} });
        JsonRoutes.sendResult(res, {code: 200});
      }else
        JsonRoutes.sendResult(res, {code: 500});
    });

    JsonRoutes.add("get", "/rooms_avalailable/", function (req, res, next) {
      var rooms_avalailable = []
      JsonRoutes.sendResult(res, {code: 200, rooms: rooms_avalailable});
    });

    JsonRoutes.add("post", "/api/room_status/:id", function (req, res, next) {
      var user = req.user_id,
          room = req.params.id,
          status = req.status;

      if(user != null){
        Rooms.update({_id:room}, { $set: {'status': status} });
        JsonRoutes.sendResult(res, {code: 200});
      }else
        JsonRoutes.sendResult(res, {code: 500});
    });
  });
}
