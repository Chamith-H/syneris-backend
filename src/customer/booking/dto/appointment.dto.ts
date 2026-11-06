import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

export class AppointmentDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  @MaxLength(10)
  bookedDate: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/)
  @MaxLength(5)
  bookedTime: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  timeZone: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name: string;

  @IsEmail()
  @MaxLength(254)
  @IsNotEmpty()
  email: string;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  message: string;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  phone: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  country: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(160)
  company: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(8192)
  captchaToken: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  website: string;
}
