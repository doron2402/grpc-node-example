const grpc = require('grpc');
const path = require('path');
const PROTO_PATH = path.join(__dirname, '/message.proto');
const message = grpc.load(PROTO_PATH).message;
let db = require('./db.json');

class Message {
  getList (call, callback) {
    return callback(null, {
      messages: db
    })
  }
  getById (call, callback) {
    if (!call.request.message_id) {
      return callback(`Message id is required.`);
    }
    for (var i = 0; i < db.length; i++) {
      if (db[i].message_id === parseInt(call.request.message_id)) {
        return callback(null, db[i]);
      }
    }
    return callback(null);
  }
  insert (call, callback) {
    let newMessage = Object.assign({}, call.request);
    newMessage.message_id = (db.length + 1) + '';
    db.push(newMessage);
    return callback(null, newMessage);
  }
  update (call, callback) {
    if (!call.request.message_id) {
      return callback(`Message id (${call.request.message_id}) can't be found.`);
    }
    for( var i = 0; i < db.length; i++) {
      if (db[i].message_id === parseInt(call.request.message_id)) {
        const newMessage = Object.assign(db[i], call.request);
        db.splice(i, 1, newMessage);
        return callback(null, newMessage);
      }
    }
    return callback('Can not find message.');
  }
  remove (call, callback) {
    if (!call.request.message_id) {
      return callback(`Messag can't be found.`);
    }
    for( var i = 0; i < db.length; i++) {
      if (db[i].message_id === parseInt(call.request.message_id)) {
        db.splice(i, 1);
        return callback(null);
      }
    }
    return callback(`Message id (${call.request.message_id}) can't be found.`);
  }
}

const getServer = function (service, serviceCall, lintener){
  const server = new grpc.Server();
  server.addService(service, serviceCall);
  server.bind(lintener, grpc.ServerCredentials.createInsecure());
  return server;
}

function main() {
  const messagesAPI = getServer(message.service, new Message, '0.0.0.0:50051');
  messagesAPI.start();
}

main();
