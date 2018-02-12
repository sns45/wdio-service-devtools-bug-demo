var data;
var chai = require('chai');
var	expect = chai.expect;
var actions = require("./../actions.js");
var conf = require("./../wdio.conf");
describe("wdio-devtools-service bug demo",function(){
	before(function () {
		browser.url("chrome://version/");
		console.log(conf.config.host);
		portnum = actions.findcdpPort(browser.getText('#command_line'));
		console.log("PORRRRRRRRRRRRRRRRRRRRT" + portnum);
		browser.cdpConnect(conf.config.host, portnum);
		//browser.pause(1000);
		console.log(browser.cdpConnection());

	});
	it('should listen on network events', function() {
		browser.cdp('Network', 'enable');
		browser.on('Network.responseReceived', function (params) {
			data = params;
			console.log("BUG: This doesn't execute through wdio launcher");
		});
		console.log(browser.cdpConnection());
		browser.url('https://www.google.com');
		expect(data).to.not.equal(undefined);
	});
});