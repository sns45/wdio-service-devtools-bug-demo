var data;
var chai = require('chai');
var	expect = chai.expect;

describe("wdio-devtools-service bug demo",function(){
	it('should listen on network events', function() {
		browser.cdp('Network', 'enable');
		browser.on('Network.responseReceived', function (params) {
			data = params;
			console.log("BUG: This doesn't execute through wdio launcher");
		});
		browser.url('https://www.google.com');
		expect(data).to.not.equal(undefined);
	});
});