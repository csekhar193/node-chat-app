const expect = require('expect');

const {generateMessage, generateLocationMessage} = require('./message');

describe('generateMessage', () => {
	it('should generate correct message object ', () => {
		let from = "chandu";
		let text = "This is my text";
		let message = generateMessage(from, text);
		expect(typeof message.createdAt).toBe('number');
		expect(message).toMatchObject({from, text});
	});
});

describe('generateLocationMessage', () => {
	it('should generate correct message object with link having latitude and longitude ', () => {
		let from = "chandu";
		let lat = 15;
		let long = 20;
		let link = "https://www.google.com/maps?q=15,20";
		let message = generateLocationMessage(from, lat, long);
		expect(typeof message.createdAt).toBe('number');
		expect(message).toMatchObject({from, link});
	});
});