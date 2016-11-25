const Express = require('express');
const SocketIO = require('socket.io');

const app = Express();
const server = require('http').Server( app );
const io = SocketIO( server );

// Serve public dir
app.use( Express.static( 'public' ) );

// Connect to lab
require('./lab')( io );

server.listen( 8000, () => console.log("Ready.") );

