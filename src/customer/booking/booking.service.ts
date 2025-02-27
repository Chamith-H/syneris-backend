import { BadRequestException, Injectable } from '@nestjs/common';
import { AppointmentDto } from './dto/appointment.dto';
import * as ics from 'ics';
import { SmtpService } from '../../shared/smtp.service';
import * as momentTz from 'moment-timezone';
import { AppointmentTemplate } from '../../templates/appointment.template';
import * as cheerio from 'cheerio';

@Injectable()
export class BookingService {
  constructor(
    private smtpService: SmtpService,
    private appointmentTemplate: AppointmentTemplate,
  ) {}

  async bookAppointment(dto: AppointmentDto) {
    const startMoment = momentTz.tz(
      `${dto.bookedDate} ${dto.bookedTime}`,
      'YYYY-MM-DD HH:mm',
      dto.timeZone,
    );

    const endMoment = startMoment.clone().add(30, 'minutes');

    const event: ics.EventAttributes = {
      start: [
        startMoment.year(),
        startMoment.month() + 1,
        startMoment.date(),
        startMoment.hour(),
        startMoment.minute(),
      ],
      end: [
        endMoment.year(),
        endMoment.month() + 1,
        endMoment.date(),
        endMoment.hour(),
        endMoment.minute(),
      ],
      title: 'Online Appointment',
      description: 'Event scheduled based on user input',
      location: 'Location of the event',
      url: 'http://your-event-link.com',
      status: 'CONFIRMED',
      busyStatus: 'BUSY',
    };

    const { error, value } = await ics.createEvent(event);

    if (error) {
      throw new BadRequestException('Failed to create calendar event');
    }

    const tempString = await this.appointmentTemplate.appointment(dto.name);

    const $ = cheerio.load(tempString);
    const modifiedHtml = $.html();

    const mailOptions = {
      to: dto.email,
      subject: 'Syneris Solutions - Online Appointment Invitation',
      cc: ['akila@syneris.solutions', 'prageeth@syneris.solutions'],
      html: modifiedHtml,
      attachments: [
        {
          filename: 'event.ics',
          content: value,
          contentType: 'text/calendar',
        },
      ],
    };

    const mailStatus = await this.smtpService.sendAttachment(mailOptions);

    if (!mailStatus) {
      throw new BadRequestException(
        'Sorry, cannot send request to your email!',
      );
    }

    const tempString2 = await this.appointmentTemplate.appointmentReply(
      dto.name,
      dto.email,
      dto.company,
      dto.country,
      dto.phone,
      dto.message,
      dto.bookedDate,
      dto.bookedTime,
      dto.timeZone,
    );

    const $2 = cheerio.load(tempString2);

    const modifiedHtml2 = $2.html();

    const emailData2 = {
      receiver: 'akila@syneris.solutions',
      heading: 'New Appointment Booking',
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
      message:
        'Thank you for scheduling your appointment! A confirmation email has been sent to you with the details. We look forward to seeing you!',
    };
  }
}
