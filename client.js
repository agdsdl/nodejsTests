var net = require('net');
var process = require('process');

var options = {
  port: 9000,
  host: process.argv.slice(2)[0]
};

var client = net.connect(options, function(){
  client.write('');
  process.stdin.pipe(client);
  client.pipe(process.stdout);
});

client.on('error', function(err){
  console.log(err);
});

// client.on('end', function(){
//   console.log("end");
// })
client.on('close', function(){
  console.log("server closed!");
  process.stdin.unpipe(client);
  client.unpipe();
  client.destroy();
  process.stdin.destroy();
})