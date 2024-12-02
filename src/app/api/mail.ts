"use server";
var nodemailer = require("nodemailer");

type Params = {
    email: string,
    html: string,
    sub: string
}

const handleMail = async ({ email, html, sub }: Params) => {
    var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.NODEMAILER_EMAIL,
            pass: process.env.NODEMAILER_PW,
        },
    });

    var mailOptions = {
        from: "d21350180@gmail.com",
        to: email,
        subject: sub || "Mail",
        html,
    };

    await new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (err: string, response: string) => {
            if (err) {
                reject(err);
            } else {
                resolve(response);
            }
        });
    });
}

export default handleMail