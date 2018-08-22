let socket = io();

socket.on('connect', function () {
	console.log('connected to server.');
});

socket.on('newMessage', function (newMessage) {
	let li = jQuery('<li></li>');
	li.text(`${newMessage.from}: ${newMessage.text}`);
	jQuery('#messages').append(li);
});

socket.on('newLocationMessage', function (location) {
	let li = jQuery('<li></li>');
	let a = jQuery('<a target="_blank">My Current Location.</a>');
	li.text(`${location.from}: `);
	a.attr('href', location.link);
	li.append(a);
	jQuery('#messages').append(li);
})

socket.on('disconnect', function () {
	console.log('Disconnected from server.')
});


jQuery('#message-form').on('submit', function(e){
	e.preventDefault();
	socket.emit('createMessage', {
		from : "chandu",
		text : jQuery('input[name=message]').val()
	}, function() {
		jQuery('input[name=message]').val('');
	});
});

let locationButton = jQuery('#send-location');

locationButton.on('click', function () {
	jQuery(this).attr('disabled', true);
	if(!navigator.geolocation){
		alert('Your Browser does not support geolocation.');
	}
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
			jQuery(this).attr('disabled', false);
		})
		.catch(() => {
			alert('Unable to fetch the location.');
			jQuery(this).attr('disabled', false);
		});
});