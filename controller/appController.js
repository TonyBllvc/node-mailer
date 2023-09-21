const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');

const { EMAIL, PASSWORD } = require('../env')

/** send mail from testing account */
const signup = async (req, res) => {

    // /** testing account */
    let testAccount = await nodemailer.createTestAccount();

    //   // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            // ( replace with actual username and passwword )
            user: testAccount.user, // generated ethereal user
            pass: testAccount.pass, // generated ethereal password
        },
    });

    let message = {
        from: '"Tony Boy 👻" <foo@example.com>', // sender address
        to: "bar@example.com, baz@example.com", // list of receivers
        subject: "Hello there ✔", // Subject line
        text: "Successfully Register with us.", // ?? // plain text body
        html: "<b>Successfully Register with us.</b>", // ?? // html body
    }


    transporter.sendMail(message).then((info) => {
        return res.status(201)
            .json({
                msg: "you should receive an email", // message sent
                info: info.messageId, // message id
                preview: nodemailer.getTestMessageUrl(info) // a preview of a denmo email account
            })
    }).catch(error => {
        return res.status(500).json({ error })
    })

    // res.status(201).json("Signup Successfully...!");
}

/** send mail from real gmail account */
const getbill = (req, res) => {

    const { userEmail } = req.body;

    let config = {
        service: 'gmail',
        auth: {
            user: EMAIL,
            pass: PASSWORD
        }
    }

    let transporter = nodemailer.createTransport(config);

    let MailGenerator = new Mailgen({
        theme: "default",
        product: {
            name: "Mailgen", // A name after 'Your truly
            link: 'https://mailgen.js/'
        }
    })

    let response = {
        body: {
            name: "Daily Tuition", // Name of the rceipiant
            intro: "Your bill has arrived!",
            table: {
                data: [
                    {
                        item: "Nodemailer Stack Book",
                        description: "A Backend application",
                        price: "$10.99",
                    }
                ]
            },
            outro: "Looking forward to do more business"
        }
    }

    let mail = MailGenerator.generate(response)

    let message = {
        from: EMAIL,
        to: userEmail,
        subject: "Place Order",
        html: mail
    }

    transporter.sendMail(message).then(() => {
        return res.status(201).json({
            msg: "you should receive an email"
        })
    }).catch(error => {
        return res.status(500).json({ error })
    })

    // res.status(201 ).json("getBill Successfully...!");
}


module.exports = {
    signup,
    getbill
}