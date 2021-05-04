let express = require('express');
let bodyParser = require('body-parser');
let routes = require("./routes");

let app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(routes);

let http = require('http');

/**
 * Create HTTP server.
 */
let server = http.createServer(app);
////////////////////////////////
// Socket.io server listens to our app
let io = require('socket.io').listen(server);

let messages = [] //loads old messages when a client (re)connects
// Emit welcome message on connection
io.on('connection', function (socket) {
    // Use socket to communicate with this particular client only, sending it it's own id
    socket.emit('welcome', {id: socket.id, messages: messages}); //send previous messages

    socket.on('update', function (data) {
        // Broadcast to everyone (including self)
        io.emit('update', data);
        messages.push(data)
    });

});

/**
 * Listen on provided port, on all network interfaces.
 */
let port = process.env.PORT || 4006;

server.listen(port);