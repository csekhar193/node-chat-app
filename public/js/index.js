let socket = io();

function scrollToBottom () {
	//Selectors
	let messages = jQuery('#messages');
	let newMessage = messages.children('li:last-child');
	//Heights
	let clientHeight = messages.prop('clientHeight');
	let scrollTop = messages.prop('scrollTop');
	let scrollHeight = messages.prop('scrollHeight');
	let newMessageHeight = newMessage.innerHeight();
	let lastMessageHeight = newMessage.prev().innerHeight();
	if( clientHeight + scrollTop + newMessageHeight +lastMessageHeight >= scrollHeight ) {
		messages.scrollTop(scrollHeight);
	}
}

socket.on('connect', function () {
	console.log('connected to server.');
});

socket.on('newMessage', function (newMessage) {
	let formattedTime = moment(newMessage.createdAt).format('h:mm a');
	let template = jQuery('#message-template').html();
	let html = Mustache.render(template, {
		from : newMessage.from,
		text : newMessage.text, 
		createdAt : formattedTime
	});
	jQuery('#messages').append(html);
	scrollToBottom();
});

socket.on('newLocationMessage', function (location) {
	let formattedTime = moment(location.createdAt).format('h:mm a');
	let template = jQuery('#location-message-template').html();
	let html = Mustache.render(template, {
		from : location.from,
		url : location.link,
		createdAt : formattedTime	
	});
	jQuery('#messages').append(html);
	scrollToBottom();
});

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