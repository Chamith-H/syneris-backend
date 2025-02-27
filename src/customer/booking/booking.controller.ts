import { Body, Controller, Post } from '@nestjs/common';
import { BookingService } from './booking.service';
import { AppointmentDto } from './dto/appointment.dto';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post('appointment')
  async postAppointment(@Body() dto: AppointmentDto) {
    return await this.bookingService.bookAppointment(dto);
  }
}
