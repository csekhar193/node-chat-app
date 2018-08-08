const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
const app = express();

const server = http.createServer(app);
const io = socketIO(server);

io.on('connection', (socket) => {
	console.log('new User is connected.');

	socket.emit('newMessage', {
		to : 'mike@example.com',
		text : 'Hey, What is going on.',
		createAt : 123
	});

	socket.on('createMessage', (message) => {
		console.log(message)
	});

	socket.on('disconnect', () => {
		console.log('User is disconnected');
	});
});

app.use(express.static(publicPath));

server.listen(port, () => {
	console.log(`Server is up on port ${port}`);
});