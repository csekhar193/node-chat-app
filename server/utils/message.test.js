const expect = require('expect');

const {generateMessage} = require('./message');

describe('generateMessage', () => {
	it('should generate correct message object ', () => {
		let from = "chandu";
		let text = "This is my text";
		let message = generateMessage(from, text);
		expect(typeof message.createdAt).toBe('number');
		expect(message).toMatchObject({from, text});
	});
});