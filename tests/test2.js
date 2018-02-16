var data;
var chai = require('chai');
var	expect = chai.expect;
var actions = require("./../actions.js");
var conf = require("./../wdio.conf");
var webdriverio = require('webdriverio');
var CDP = require('chrome-remote-interface');

function _getCDPclient(port) {
	return new Promise( function (resolve) {
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
	this.timeout(999999);
	var CDPport;
	var client; //CDP client
	var that = this;
	before(function(){
		browser = webdriverio.remote({
			host: 'localhost',
			desiredCapabilities: {
				browserName: 'chrome'
			}
	})
	return browser.init()
			.url('chrome://version/')
			.getText('#command_line').then(function(args) {
				client = _getCDPclient(args.match(/--remote-debugging-port=(\d*)/)[1])
				
			})
			.addCommand('cdp', function (domain, command, args) {
				if (!client[domain]) {
					throw new Error('Domain "'+ domain+'" doesn\'t exist in the Chrome DevTools protocol');
				}
		
				if (!this.client[domain][command]) {
					throw new Error('The "'+ domain +'" domain doesn\'t have a method called '+command);
				}
		
				return new Promise(function (resolve, reject) {
					return this.client[domain][command](args, function(err, result) {
					if (err) {
						return reject(new Error('Chrome DevTools Error: '+ result.message));
					}
					return resolve(result)
					})
				})
			})
			.cdp('Network', 'enable')
	});
	
	
	it('test ', function(){
	
	});
});