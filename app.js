var fs     = require('fs');
var http = require('http');
var express = require('express');
var path = require('path');
var route = require('./routes/route');
var app = express();
var request = require('request');


app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  //app.set('view engine', 'jade');
  app.engine('html', require('ejs').renderFile);
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', route.index);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});




/*** Nodemailer start ***/
var nodemailer = require("nodemailer");
// create reusable transport method (opens pool of SMTP connections)
var smtpTransport = nodemailer.createTransport("SMTP",{
    service: "Gmail",
    auth: {
        user: "mydummyemail@gmail.com",
        pass: "mypass"
    }
});
// setup e-mail data with unicode symbols
var mailOptions = {
    from: "Fred Foo<myemail@gmail.com>", // sender address
    to: "myemail@gmail.com", // list of receivers
    subject: "Hello", // Subject line
    text: "emailed fired after", // plaintext body
    html: "<b>Hello</b>" // html body
}
// send mail with defined transport object
smtpTransport.sendMail(mailOptions, function(error, response){
    if(error){
        console.log(error);
    }else{
        console.log("Message sent: " + response.message);
    }

    // if you don't want to use this transport object anymore, uncomment following line
    //smtpTransport.close(); // shut down the connection pool, no more messages
});


