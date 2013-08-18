var http = require('http');
var path = require('path');
var fs = require('fs');
var url = require('url');

http.createServer(function (request, response) {
    console.log('request starting...');
	
    var filePath = '.' + request.url;
    if (filePath == './')
      filePath = './index.html';
    var uri = url.parse(request.url).pathname;
    
    fs.exists(filePath, function(exists) {
        var url_request = url.parse(request.url).pathname;      
        var tmp  = url_request.lastIndexOf(".");
        var extension  = url_request.substring((tmp + 1));
    
      if (exists) {
        fs.readFile(filePath, function(error, content) {
          if (error) {
            response.writeHead(500);
            response.end();
          }
          else {
            console.log('SUCCESS!');
            console.log(uri);
            // set content type
            if (extension === 'html') response.writeHeader(200, {"Content-Type": 'text/html'});
            else if (extension === 'htm') response.writeHeader(200, {"Content-Type": 'text/html'});
            else if (extension === 'css') response.writeHeader(200, {"Content-Type": 'text/css'});
            else if (extension === 'js') response.writeHeader(200, {"Content-Type": 'text/javascript'});
            else if (extension === 'png') response.writeHeader(200, {"Content-Type": 'image/png'});
            else if (extension === 'jpg') response.writeHeader(200, {"Content-Type": 'image/jpg'});
            else if (extension === 'jpeg') response.writeHeader(200, {"Content-Type": 'image/jpeg'});
            else { console.log("NO CORRECT EXTENSION")};
                //console.log(extension);
                response.end(content, 'utf-8');
          }
        });
      }
      else {
        response.writeHead(404);
        response.end();
      }
    });
	
}).listen(3000);
console.log('Server running at localhost:3000');
