var net = require('net');
var process = require('process');

net.createServer(function(conn){
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

console.log("server listenning at 9000...");
