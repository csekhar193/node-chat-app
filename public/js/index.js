let socket = io();

socket.on('connect', function () {
	console.log('connected to server.');

	socket.emit('createMessage', {
		from: 'jen@example.com',
		text: 'Hey, This is chandu.'
	})
});



socket.on('newMessage', function (newMessage) {
	console.log(newMessage);
});

socket.on('disconnect', function () {
	console.log('Disconnected from server.')
});