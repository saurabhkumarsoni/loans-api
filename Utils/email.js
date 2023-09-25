const nodemailer = require('nodemailer');

module.exports = {
    sendEmail: async(option) =>{
        // 1. CREATE TRANSPORTER
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        })
    
        // DEFINE EMAIL OPTION
        const emailOption = {
            from: 'Cineflix support<support@cineflix.com>',
            to: option.email,
            subject: option.subject,
            text: option.message,
            html: option.html
        }
    
       await transporter.sendMail(emailOption);
    
    }
}



