import nodemailer from 'nodemailer';

export default ({ subject, to, html }) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.mxhichina.com',
    port: 465,
    secure: true,
    auth: {
      user: 'api@hengkx.com',
      pass: 'ApiApi123'
    }
  });
  const mailOptions = {
    from: '云笔记<api@hengkx.com>',
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
