function findcdpPort(commandline){
	//console.log(commandline);
	if(commandline.match(/--remote-debugging-port=(\d*)/)) {
		portnum = parseInt(commandline.match(/--remote-debugging-port=(\d*)/)[1]);
	} else {

	}
	return portnum;
}

module.exports.findcdpPort = findcdpPort;