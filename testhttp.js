var http = require('http');

// http.createServer(function(request, response) {
// 	response.writeHead(200, {'Content-Type': 'text-plain'});
// 	response.end('Hello World\n');
// }).listen(8124);

http.get('http://www.baidu.com/', function (response) {
    var body = [];

    console.log(response.statusCode);
    console.log(response.headers);

    response.on('data', function (chunk) {
        body.push(chunk);
    });

    response.on('end', function () {
        body = Buffer.concat(body);
        console.log(body.toString());
    });
});
