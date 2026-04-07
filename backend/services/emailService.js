import nodemailer from "nodemailer";

// Basic Ethereal Email config for testing
// You should replace this with a real SMTP like SendGrid/Gmail in production
export const sendEmail = async (options) => {
    try {
        // Create a test account for local testing if no credentials are provided
        // let testAccount = await nodemailer.createTestAccount();

        // To use real gmail:
        // const transporter = nodemailer.createTransport({
        //     service: 'gmail',
        //     auth: {
        //         user: process.env.EMAIL_USER,
        //         pass: process.env.EMAIL_PASS
        //     }
        // });

        const transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: process.env.EMAIL_USER || 'alvah.hamill63@ethereal.email', // Add fallback for testing
                pass: process.env.EMAIL_PASS || '8rUvE1CqS1Uu3H3Z1W'
            }
        });

        const mailOptions = {
            from: 'Book Exchange Platform <noreply@bookexchange.com>',
            to: options.email,
            subject: options.subject,
            html: options.message,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Message sent: %s", info.messageId);

    } catch (error) {
        console.error("Email could not be sent:", error);
    }
};
