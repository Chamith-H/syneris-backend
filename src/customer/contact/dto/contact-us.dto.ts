import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class ContactUsDto {
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
