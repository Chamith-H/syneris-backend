import { IsNotEmpty } from 'class-validator';

export class AppointmentDto {
  @IsNotEmpty()
  bookedDate: string;

  @IsNotEmpty()
  bookedTime: string;

  @IsNotEmpty()
  timeZone: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  phone: string;
}
