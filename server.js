var net = require('net');
var process = require('process');
const fs = require('fs');
const path = require('path');

const savePath = "/Users/dongle/Downloads/nodejs/";

var curConn;
const server = net.createServer(function(conn){
  var state = 0;// 0 normal, 1 recive file
  var filename = "";
  var receiveBuf = new Buffer(0);

  curConn = conn;
  console.log('client connected:' + conn.remoteAddress + ':' + conn.remotePort);

  conn.on('data', function(data){
    if (state === 0){
      var str = data.toString();
      console.log(str);
      if(str.startsWith("FILE:")){
        str = str.substr(5).trim();
        var p = path.parse(str);
        //fs.mkdirSync(savePath);
        filename = savePath + p.base;
        state = 1;
      }
    }
    else if (state == 1){
      receiveBuf = Buffer.concat([receiveBuf, data]);
      var index = receiveBuf.indexOf("#END#");
      if(index >= 0){
      //if(receiveBuf.includes("#END#", receiveBuf.length-6)){
        const fd = fs.openSync(filename, 'w');
        //fs.write(fd, receiveBuf, 0, receiveBuf.length-5);
        var written = fs.writeSync(fd, receiveBuf, 0, index);
        console.log("bytes writed "+written);
        receiveBuf = new Buffer(0);
        state = 0;
        fs.close(fd, function(error){
          if (error){
            console.log(error);
          }
        });
      }
    }
  });

  conn.on('close', function(data){
    console.log('client leaved:' + conn.remoteAddress);
    process.stdin.unpipe(conn);
  });

  process.stdin.pipe(conn);

}).listen(9000);

process.stdin.on('data', function(data){
  var str = data.toString();

  if(str.startsWith("FILE:")){
    str = str.substr(5).trim();
    fs.readFile(str, function(error, data){
      if (error){
        console.log(error.message);
      }
      else if(data){
        // curConn.setNoDelay(true);
        curConn.write(data, function(){
          curConn.write("#END#");
        });
      }
    });
  }
});

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
