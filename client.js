var net = require('net');
const fs = require('fs');
const path = require('path');

const savePath = "/Users/dongle/Downloads/nodejs/";

var options = {
  port: 9000,
  host: process.argv.slice(2)[0]
};

var client = net.connect(options, function(){
  client.write('');
  
  var state = 0;// 0 normal, 1 recive file
  var filename = "";
  var receiveBuf = new Buffer(0);
  client.on('data', function(data){
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
      // const lastbytes = receiveBuf.subarray(receiveBuf.length-5, receiveBuf.length-1);
      // const lastStr = String.fromCharCode.apply(null, lastbytes);
      var index = receiveBuf.indexOf("#END#");
      if(index >= 0){
      //if(lastbytes.length == 6 && lastStr == "#END#\n"){
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

  process.stdin.pipe(client);
  //client.pipe(process.stdout);
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
});

process.stdin.on('data', function(data){
  var str = data.toString();

  if(str.startsWith("FILE:")){
    str = str.substr(5).trim();
    fs.readFile(str, function(error, data){
      if (error){
        console.log(error.message);
      }
      else if(data){
        client.setNoDelay(true);
        client.write(data, function(){
          client.write("#END#");
        });
      }
    });
  }
});