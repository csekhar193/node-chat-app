let socket = io();

socket.on('connect', function () {
	console.log('connected to server.');
});

socket.on('newMessage', function (newMessage) {
	var formattedTime = moment(newMessage.createdAt).format('h:mm a');
	let li = jQuery('<li></li>');
	li.text(`${newMessage.from} ${formattedTime}: ${newMessage.text}`);
	jQuery('#messages').append(li);
});

socket.on('newLocationMessage', function (location) {
	var formattedTime = moment(location.createdAt).format('h:mm a');
	let li = jQuery('<li></li>');
	let a = jQuery('<a target="_blank">My Current Location.</a>');
	li.text(`${location.from} ${formattedTime}: `);
	a.attr('href', location.link);
	li.append(a);
	jQuery('#messages').append(li);
})

socket.on('disconnect', function () {
	console.log('Disconnected from server.')
});


jQuery('#message-form').on('submit', function(e){
	e.preventDefault();
	let messageTextBox =  jQuery('input[name=message]');
	socket.emit('createMessage', {
		from : "chandu",
		text : messageTextBox.val()
	}, function() {
		messageTextBox.val('');
	});
});

let locationButton = jQuery('#send-location');

locationButton.on('click', function () {
	if(!navigator.geolocation){
		alert('Your Browser does not support geolocation.');
	}

	locationButton.attr('disabled', true).text('Sending Location...');

	let getLocation = new Promise((resolve, reject) => {
		navigator.geolocation.getCurrentPosition((position)=>{
			resolve(position);
		}, () => {
			reject();
		});
	});

	getLocation
		.then((position) => {
			socket.emit('createLocationMessage', {
				latitude: position.coords.latitude,
				longitude: position.coords.longitude
			})
			locationButton.attr('disabled', false).text('Send Location');
		})
		.catch(() => {
			alert('Unable to fetch the location.');
			locationButton.attr('disabled', false).text('Send Location');
		});
});