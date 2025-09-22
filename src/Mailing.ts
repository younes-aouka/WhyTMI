import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "aoukayounes360@gmail.com",
    pass: process.env.Gmail_Pass
  }
});

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export async function sendVerificationEmail(reciver: string, token: string) {
  await transporter.sendMail({
    from: "aoukayounes360@gmail.com",
    to: reciver,
    subject: "Account activation email",
    html: `
      <p>Hi, that's a message from WhyTMI for activating your account!</p>
      <p>Click <a href="${baseUrl}/verify-email/${token}"><b>here</b></a> to activate your account</p>
    `
  });
}

export async function sendResetingPasswordEmail(reciver: string, token: string) {
  await transporter.sendMail({
    from: "aoukayounes360@gmail.com",
    to: reciver,
    subject: "Password Resetting email",
    html: `
      <p>Hi, WhyTMI sent you a message for resetting your password!</p>
      <p>Click <a href="${baseUrl}/reset-password/${token}"><b>here</b></a> to reset your password</p>
    `
  });
}

