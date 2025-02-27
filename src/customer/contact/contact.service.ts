import { BadRequestException, Injectable } from '@nestjs/common';
import { ContactUsDto } from './dto/contact-us.dto';
import { SmtpService } from '../../shared/smtp.service';
import * as cheerio from 'cheerio';
import { ContactUsTemplate } from '../../templates/contact-us.template';

@Injectable()
export class ContactService {
  constructor(
    private smtpService: SmtpService,
    private contactTemplate: ContactUsTemplate,
  ) {}

  async contactUs(dto: ContactUsDto) {
    const tempString = await this.contactTemplate.contactUs(dto.name);

    const $ = cheerio.load(tempString);
    const modifiedHtml = $.html();

    const emailData = {
      receiver: dto.email,
      heading: 'Contacting Syneris Solutions',
      template: modifiedHtml,
      error: 'Sorry, cannot send request to your email!',
    };

    const mailStatus = await this.smtpService.sendEmail(emailData);

    if (!mailStatus) {
      throw new BadRequestException(
        'Sorry, cannot send request to your email!',
      );
    }

    const tempString2 = await this.contactTemplate.contactReply(
      dto.name,
      dto.email,
      dto.message,
    );

    const $2 = cheerio.load(tempString2);

    const modifiedHtml2 = $2.html();

    const emailData2 = {
      receiver: 'akila@syneris.solutions',
      heading: 'Message from new customer',
      template: modifiedHtml2,
      error: 'Sorry, cannot send request to your email!',
    };

    const mailStatus2 = await this.smtpService.sendEmail(emailData2);

    if (!mailStatus2) {
      throw new BadRequestException(
        'Sorry, cannot send request to your email!',
      );
    }

    return {
      message: 'Send successfully',
    };
  }
}
