var data;
var chai = require('chai');
var	expect = chai.expect;
var actions = require("./../actions.js");
var conf = require("./../wdio.conf");
var webdriverio = require('webdriverio');
var CDP = require('chrome-remote-interface');
var event = require('events');

function _getCDPclient(port) {
	return new Promise(function (resolve) {
		return CDP({
			port : port,
			host: 'localhost', // works only on local
			target: function (targets) {
				return targets.findIndex(function (t) {
					return t.type ==='page'
				})
			}
		}, resolve)
	});
}


describe('Test', function(){
	var that = this;
	this.timeout(999999);
	var CDPport;
	var client; //CDP client
	var omnituredata;
	before(function() {
		browser = webdriverio.remote({
			host: 'localhost',
			desiredCapabilities: {
				browserName: 'chrome'
			}
		});

		browser.addCommand('cdp', function (domain, command, args) {
			if (!client[domain]) {
				throw new Error('Domain "' + domain + '" doesn\'t exist in the Chrome DevTools protocol');
			}

			if (!client[domain][command]) {
				throw new Error('The "' + domain + '" domain doesn\'t have a method called ' + command);
			}

			return new Promise(function (resolve, reject) {
				return client[domain][command](args, function (err, result) {
					if (err) {
						return reject(new Error('Chrome DevTools Error: ' + result.message));
					}
					return resolve(result)
				})
			})
		});

		browser.addCommand('cdpConnection', function () {
			return {'host': client.host, 'port': client.port}
		});

		// client.on('event', function (event) {
		// 	return browser.emit(event.method || 'event', event.params)
		// });


		return browser.init()
			.url('chrome://version/')
			.getText('#command_line')
			.then(function (args) {
				return _getCDPclient(args.match(/--remote-debugging-port=(\d*)/)[1])
					.then(function(instance){
					return client = instance;
					});
			})
			.then(function() {
				client.on('event', function (event) {
					return browser.emit(event.method || 'event', event.params)
				});
			})
		});

		it('test ', function(){
			return browser
				.cdpConnection().then(function(obj){
					console.log(obj);
				})
				.cdp('Network', 'enable')
				.cdp('Network', 'clearBrowserCache')
				.on('Network.requestWillBeSent', function(params){
					if(params.request.url.includes('ssl.o')) {
						omnituredata = params.request.url;
					}
				})
				.url('https://www.webmd.com/default.htm')
		});

		it('test', function(){
			expect(omnituredata).to.not.equal(undefined);
		});

		after(function (done) {
			browser.end().then(function () {
				done();
			});
		});
});