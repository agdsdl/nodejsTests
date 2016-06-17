var net = require('net');
var process = require('process');

const server = net.createServer(function(conn){
  console.log('client connected:' + conn.remoteAddress + ':' + conn.remotePort);

  conn.on('data', function(data){
    console.log(data.toString());
  })

  conn.on('close', function(data){
    console.log('client leaved:' + conn.remoteAddress);
    process.stdin.unpipe(conn);
  })

  process.stdin.pipe(conn);
}).listen(9000);

console.log("server listenning at port 9000");

var os = require('os');
var ifaces = os.networkInterfaces();

Object.keys(ifaces).forEach(function (ifname) {
  var alias = 0;

  ifaces[ifname].forEach(function (iface) {
    if ('IPv4' !== iface.family || iface.internal !== false) {
      // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
      return;
    }

    if (alias >= 1) {
      // this single interface has multiple ipv4 addresses
      console.log(ifname + ':' + alias, iface.address);
    } else {
      // this interface has only one ipv4 adress
      console.log(ifname, iface.address);
    }
    ++alias;
  });
});
