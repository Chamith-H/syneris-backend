import { IsNotEmpty, IsOptional } from 'class-validator';

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

  @IsOptional()
  message: string;

  @IsOptional()
  phone: string;

  @IsOptional()
  country: string;

  @IsNotEmpty()
  company: string;
}
