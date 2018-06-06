const path = require('path');
const grpc = require('grpc');
const PROTO_PATH = path.join(__dirname, '/message.proto');
const Client = grpc.load(PROTO_PATH).message;

// handle call back from server
const _handleCB = (err, res) => {
  if (err) {
    return console.error(err);
  }
  return console.log(res);
}

// validate message id must be a number
const _validateMessageId = (messageId) => {
  if (isNaN(messageId)) {
    throw new Error('Message id must be a number');
  }
  return;
};

// validate message options
const _validateMessageOptions = (options) => {
  try {
    const body = JSON.parse(options);
    return body;
  } catch (err) {
    throw new Error(err);
  }
};

function run() {
  const getClient = function (address) {
    return new Client(address, grpc.credentials.createInsecure());
  };
  const messageClient = getClient('127.0.0.1:50051');

  switch (process.argv[2]) {
    case 'list':
      messageClient.getList({}, _handleCB);
      break;
    case 'insert':
      const parsedBodyInsert = _validateMessageOptions(process.argv[3]);
      messageClient.insert(parsedBodyInsert, _handleCB);
      console.log('insert message');
      break;  
    case 'single': 
      _validateMessageId(process.argv[3]);
      messageClient.getById({ message_id: process.argv[3] }, _handleCB);
      console.log('get message by id');
      break;
    case 'remove':  
      _validateMessageId(process.argv[3]);
      messageClient.remove({ message_id: process.argv[3]}, _handleCB);
      console.log('remove message by id');
      break;
    case 'update': 
      const parsedBodyUpdate = _validateMessageOptions(process.argv[3]);
      messageClient.update(parsedBodyUpdate, _handleCB);
      break;
    default:
      console.log(`>> help
         - Get single message by id "node client-cli.js single <id>"
         - Get multiple messages "node client-cli.js list"
         - Create a message "node client-cli.js insert '{"created_by": "1", ... }'"
         - Update a message "node client-cli.js update '{"message_id": "1", "created_by": "1", ... }'"
         - Delete/Remove a message "node client-cli.js remove <id>"
      `)
      break;
  }
}


run()

 

