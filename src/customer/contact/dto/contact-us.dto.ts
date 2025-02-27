import { IsNotEmpty, IsOptional } from 'class-validator';

export class ContactUsDto {
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
