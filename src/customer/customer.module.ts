import { Module } from '@nestjs/common';
import { ContactService } from './contact/contact.service';
import { ContactController } from './contact/contact.controller';
import { SmtpService } from 'src/shared/mail.service';
import { ContactUsTemplate } from 'src/templates/contact-us.template';
import { BookingService } from './booking/booking.service';
import { BookingController } from './booking/booking.controller';
import { AppointmentTemplate } from 'src/templates/appointment.template';

@Module({
  providers: [
    ContactService,
    SmtpService,
    ContactUsTemplate,
    BookingService,
    AppointmentTemplate,
  ],
  controllers: [ContactController, BookingController],
})
export class CustomerModule {}
