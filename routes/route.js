// handler for homepage
exports.index = function(req, res) {
  //  res.render('index', { title: 'Coffee Tagging'}); //Jade
  res.render('index.html', { title: 'Coffee Tagging'});
};
// handler for mail
exports.mail = function(req, res) {
  var nodemailer = require("nodemailer");
  // create reusable transport method (opens pool of SMTP connections)
  var smtpTransport = nodemailer.createTransport("SMTP",{
    service: "Gmail",
    auth: {
        user: "myemail@gmail.com",
        pass: "mypass"
    }
  });
  // setup e-mail data with unicode symbols
  var mailOptions = {
    from: "Fred Foo<myemail@gmail.com>", // sender address
    to: "myemail@gmail.com", // list of receivers
    subject: "Hello", // Subject line
    text: "email fired after routing to mail", // plaintext body
    html: "<b>Hello</b>" // html body
  }
  // send mail with defined transport object
  smtpTransport.sendMail(mailOptions, function(error, response){
    if(error){
        console.log(error);
    }else{
        console.log("Message sent: " + response.message);
    }
    res.redirect('/');

    // if you don't want to use this transport object anymore, uncomment following line
    //smtpTransport.close(); // shut down the connection pool, no more messages
  });  
};

