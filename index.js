let nodemailer = require('nodemailer');
var handlebars = require('handlebars');
var fs = require('fs');
const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;
app.use(cors({origin: '*'}));
var readHTMLFile = function (path, callback) {
    fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
        if (err) {
            callback(err);
            throw err;

        }
        else {
            callback(null, html);
        }
    });
};

let mailerConfig = {
    host: "smtp.office365.com",
    secureConnection: true,
    port: 587,
    auth: {
        user: "contact@daycoresolutions.com",
        pass: "daycore123"
    }
};
let transporter = nodemailer.createTransport(mailerConfig);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/send-mail', (req, res) => {
    readHTMLFile('./index.html', function (err, html) {
        var template = handlebars.compile(html);
        var replacements = {
            name: req.body.name,
            email: req.body.email,
            subject: req.body.subject,
            message: req.body.message,
        };
        var htmlToSend = template(replacements);
        let mailOptions = {
            from: mailerConfig.auth.user,
            to: 'rineeshkumar9@gmail.com,ajaytiyan@gmail.com,Kokanti.hemanth97@gmail.com',
            subject: 'Contact Details',
            html: htmlToSend
        };
        transporter.sendMail(mailOptions, function (error) {
            if (error) {
                res.status(200).send('Thanks for contact us! we will get back soon.')
            } else {
                res.status(404).send('Something went wrong! Try later.');
            }
        });
    });
});
app.listen(process.env.PORT || port, () => console.log(`App listening on port ${process.env.PORT || port}!`));

