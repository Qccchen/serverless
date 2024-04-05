const sgMail = require('@sendgrid/mail');
const mysql = require('mysql2/promise');
const { v4: uuidv4 } = require('uuid');
const sendgridApiKey = process.env.SENDGRID_API_KEY;

sgMail.setApiKey(sendgridApiKey);

async function sendVerificationEmail(pubSubEvent) {
    const messageBody = Buffer.from(pubSubEvent.data, 'base64').toString();
    const userData = JSON.parse(messageBody);
    const { userId, email } = userData; 
    const verificationToken = uuidv4();
    const verificationLink = `https://qccchen.me/verify?verificationToken=${verificationToken}`;

    const msg = {
        to: email,
        from: 'noreply@qccchen.me', 
        subject: 'Verify your email address',
        text: `Please verify your email address by clicking on this link: ${verificationLink}`,
        html: `<p>Please verify your email address by clicking on this <a href="${verificationLink}">link</a>.</p>`,
    };

    try {
        await sgMail.send(msg);
        console.log(`Verification email sent to ${email}`);
    } catch (error) {
        console.error(`Error sending verification email to ${email}: `, error);
        throw new Error(`Error processing user ${userId}: ${error.message}`);
    }

    try {
        const connection = await mysql.createConnection({
            user: process.env.DB_USER,
            database: process.env.DB_DATABASE,
            password: process.env.DB_PASSWORD,
            socketPath: `/cloudsql/${process.env.DB_CONNECTION_NAME}`
        });

        const [result] = await connection.execute(
            'UPDATE users SET verification_sent_at = ?, verification_token = ? WHERE id = ?',
            [new Date(), verificationToken, userId]
        );

        console.log(`Verification record updated for ${email}:`, result);
        await connection.end();
    } catch (error) {
        console.error(`Error updating verification record for ${email}: `, error);
        throw new Error(`Error processing user ${userId}: ${error.message}`);
    }
};

module.exports = {
    sendVerificationEmail
};