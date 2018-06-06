# grpc-node-example
Messaging API using GRPC

## How to start:
- Make sure to install the dependencies. `npm i`
- Run the server `node server.js`
- Run the client `node client-cli`
- There are several options for CRUD operation on the "db" (the json file `db.json` but you get the gist).

## Important files
###Server `server.js`: the server will define the methods we want to expose to our client.
###Client `client-cli.js`: the client will be communicating with our server (server.js) via http 2.0.
- Database `db.json`: instead of using real database, in this example I'll be using a simple json file.
- Schema `message.proto`: protobuf message schema, this define the message schema


## Client
- Create Message: `node client-cli.js insert '{"created_by": 1, "created_at": "2017-01-01T10:23:44.000Z", "body": "Some text as message body","thread_id": 1}'`
- Get Message (by id): `node client-cli.js single <id>`
- Get Messages (list): `node client-cli.js list`
- Delete/Remove Message (by id): `node client-cli.js remove <id>`
- Update Message: `node client-cli.js update '{"message_id": 1, "created_by": 1, "created_at": "2017-01-01T10:23:44.000Z", "body": "Some text as message body","thread_id": 1}'` ** make sure to pass `message_id`