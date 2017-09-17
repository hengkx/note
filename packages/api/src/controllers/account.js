import validator from 'validator';
import randomize from 'randomatic';
import nodemailer from 'nodemailer';
import ApiError from '../errors/ApiError';
import { User, UserActive } from '../models';

export async function signup(ctx) {
  const { ip, body } = ctx.request;
  const { email, password } = body;

  if (!validator.isEmail(email)) throw new ApiError('EMAIL_INVALID');
  if (!password || password.length < 6) throw new ApiError('PASSWORD_INVALID');
  const count = await User.count({ email });
  if (count > 0) throw new ApiError('EMAIL_EXISTS');
  const token = randomize('a0', 32);
  const res = await User.create({
    email,
    password,
    name: email.substring(0, email.indexOf('@')),
    avatar: 'test',
    reg_ip: ip
  });
  await UserActive.create({ email, token });

  const transporter = nodemailer.createTransport({
    host: 'smtp.mxhichina.com',
    port: 465,
    secure: true,
    auth: {
      user: 'api@hengkx.com',
      pass: 'ApiApi123'
    }
  });
  const activeUrl = `http://localhost:3000/api/account/active?email=${email}&token=${token}`;
  const mailOptions = {
    from: '云笔记<api@hengkx.com>',
    to: email,
    subject: '帐号激活',
    html: `<style class="fox_global_style">div.fox_html_content { line-height: 1.5; }p { margin-top: 0px; margin-bottom: 0px; }div.fox_html_content { font-size: 10.5pt; font-family: 微软雅黑; color: rgb(0, 0, 0); line-height: 1.5; }</style><center> <table cellpadding="0" cellspacing="0" class="email-container" align="center" width="550" style="font-family: Lato, 'Lucida Sans', 'Lucida Grande', SegoeUI, 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 15px; font-weight: normal; line-height: 22px; color: #444444; text-align: left; border: 1px solid rgb(177, 213, 245); border-top-left-radius: 4px; border-top-right-radius: 4px; border-bottom-right-radius: 4px; border-bottom-left-radius: 4px; width: 550px;"> <tbody><tr> <td> <table cellpadding="0" cellspacing="0" class="padding" width="100%" style="padding-left: 40px; padding-right: 40px; padding-top: 30px; padding-bottom: 35px;"> <tbody> <tr class="header"> <td align="center"> <h1 style="font-size: 24px; line-height: 1.3em; margin-bottom: 5px;">欢迎云笔记</h1> </td> </tr> <tr class="content"> <td align="center"> <p style="font-size: 15px; font-weight: normal; line-height: 22px;">点击下面的按钮确认电子邮件地址。</p> </td> </tr> <tr> <td align="center"> <table cellpadding="12" border="0" style="font-family: Lato, 'Lucida Sans', 'Lucida Grande', SegoeUI, 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 16px; font-weight: bold; line-height: 25px; color: #444444; text-align: left;"> <tbody><tr> <td class="button" style="color: rgb(255, 255, 255); font-size: 16px; line-height: 24px; text-align: center; display: block;"> <a href="${activeUrl}" style="color: rgb(255, 255, 255); text-align: center; display: block; padding: 12px 20px; height: 100%; border-top-left-radius: 4px; border-top-right-radius: 4px; border-bottom-right-radius: 4px; border-bottom-left-radius: 4px; text-decoration: none; background-color: rgb(43, 136, 217); min-width: 150px;"><strong>激活帐户</strong></a> </td> </tr> </tbody></table> </td> </tr> </tbody> </table> </td> </tr> </tbody></table> <table border="0" cellpadding="0" cellspacing="0" align="center" class="footer" style="max-width: 550px; font-family: Lato, 'Lucida Sans', 'Lucida Grande', SegoeUI, 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 15px; line-height: 22px; color: #444444; text-align: left; padding: 20px 0; font-weight: normal;"> <tbody><tr> <td align="center" style="text-align: center; font-size: 12px; line-height: 18px; color: rgb(163, 163, 163); padding: 5px 0px;"> <!-- Hack: trick validate-assets... true --> </td> </tr> <tr> <td style="text-align: center; font-weight: normal; font-size: 12px; line-height: 18px; color: rgb(163, 163, 163); padding: 5px 0px;"> <p>© 2017 <a name="footer_copyright" href="https://note.hengkx.com" style="color: rgb(43, 136, 217); text-decoration: underline;">Hengkx</a></p> </td> </tr> </tbody></table> </center>`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log(info);
  });

  ctx.body = res;
}

export async function active(ctx) {
  const { email, token } = ctx.query;
  const count = await UserActive.count({ email, token, is_used: false });
  if (count === 0) throw new ApiError('ACTIVE_INFO_INVALID');
  await UserActive.findOneAndUpdate({ email, token, is_used: false }, { is_used: true });
  const res = await User.findOneAndUpdate({ email }, {
    is_actived: true
  }, { new: true });
  ctx.body = res;
}


export async function signin(ctx) {
  const { body } = ctx.request;
  const { email, password } = body;
  const user = await User.findOne({ email, password });
  if (!user) throw new ApiError('EMAIL_AND_PASSWORD_NOT_MATCH');

  ctx.body = user;
}
