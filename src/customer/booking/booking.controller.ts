import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { BookingService } from './booking.service';
import { AppointmentDto } from './dto/appointment.dto';
import { FormSubmissionGuard } from '../../shared/form-submission.guard';

@Controller('booking')
@UseGuards(FormSubmissionGuard)
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post('appointment')
  async postAppointment(@Body() dto: AppointmentDto) {
    return await this.bookingService.bookAppointment(dto);
  }
}
