import nodemailer from 'nodemailer';
import config from '../config';

export default ({ subject, to, html }) => {
  const transporter = nodemailer.createTransport(config.email);
  const mailOptions = {
    from: config.email.from,
    to,
    subject,
    html
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log(info);
  });
}
