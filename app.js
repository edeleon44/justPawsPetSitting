var express = require('express');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var path = require('path');
var nodemailer = require('nodemailer');

var app = express();

//View Engine Set Up
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views/'));

//Static Folder
app.use('/public', express.static(path.join(__dirname, 'public')));

//Body Paser Middleware
app.use(bodyParser.urlencoded({ extended: false}))
app.use(bodyParser.json());




app.get('/', (req,res) => {
	res.render('contact');
	// res.send('HELLO');
});


app.post('/send', (req,res) => {
	var output = `
		<p>You have a new contact request</p>
		<h3>Contact Details</h3>
		<ul>
			<li>Name: ${req.body.name}<li>
			<li>Name: ${req.body.company}<li>
			<li>Name: ${req.body.email}<li>
			<li>Name: ${req.body.phone}<li>
		</ul>
		<h3>Mesagee</h3>
		<p>${req.body.message}</p>
	`;
	// create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: 'smtp.sender.net',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: 'apikey', // generated ethereal user
        pass: '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'  // generated ethereal password
    },
    tls:{
      rejectUnauthorized:false
    }
  });

  // setup email data with unicode symbols
  let mailOptions = {
      from: 'contactform@justpawspetsitting.com', // sender address
      to: 'justpawspetsitting@yahoo.com', // list of receivers
      subject: 'Node Contact Request', // Subject line
      text: 'Hello world?', // plain text body
      html: output, // html body
      attachments: [{ filename: `${req.body.name}.pdf` }]
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);   
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

      res.render('contact', {msg:'Email has been sent'});
  });
  });

}; 

app.listen(3000, () => console.log('Server Started....'));