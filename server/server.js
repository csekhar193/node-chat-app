const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
const app = express();

const server = http.createServer(app);
const io = socketIO(server);
let users = new Users();

app.use(express.static(publicPath));

io.on('connection', (socket) => {
	console.log('new User is connected.');
	socket.on('join', (params, callback) => {
		if( !isRealString(params.name) || !isRealString(params.room) ) {
			callback('Chat Room need a name and room name.');
		}
		socket.join(params.room);
		users.removeUser(socket.id);
		users.addUser(socket.id, params.name, params.room);

		io.to(params.room).emit('updateUsersList', users.getUserList(params.room));
		socket.emit('newMessage', generateMessage('Admin', 'Welcome to chat app'));

		socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined.`));

		callback();
	});

	

	socket.on('createMessage', (message, callback) => {
		let user = users.getUser(socket.id);
		if (user && isRealString(message.text)) {
			io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
		}
		callback();
	});

	socket.on('createLocationMessage', (location) => {
		let user = users.getUser(socket.id);
		if (user) {
			io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, location.latitude, location.longitude));	
		}
	});

	socket.on('disconnect', () => {
		let user = users.removeUser(socket.id);
		io.to(user.room).emit('updateUsersList', users.getUserList(user.room));
		io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`))
	});
});



server.listen(port, () => {
	console.log(`Server is up on port ${port}`);
});