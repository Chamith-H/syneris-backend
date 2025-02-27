import { BadRequestException, Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class SmtpService {
  /* Initiallized mail transporter............................................ */
  private transporter;

  /* Authenticated with credentialls.......................................... */
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  /* SMTP requests............................................................ */
  async sendEmail(bodyData: any) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: bodyData.receiver,
      subject: bodyData.heading,
      html: bodyData.template,
    };

    try {
      return await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error occurred:', error);
      throw new BadRequestException(bodyData.error);
    }
  }

  async sendAttachment(mailOptions: any) {
    try {
      return await this.transporter.sendMail({
        from: process.env.EMAIL_USER,
        ...mailOptions,
      });
    } catch (error) {
      console.error('Error occurred:', error);
      throw new BadRequestException(mailOptions.error);
    }
  }
}
